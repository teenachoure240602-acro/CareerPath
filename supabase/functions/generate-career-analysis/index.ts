const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const ANTHROPIC_BASE_URL = Deno.env.get("ANTHROPIC_BASE_URL") ?? "https://api.anthropic.com";
const ANTHROPIC_MODEL = Deno.env.get("ANTHROPIC_SMALL_FAST_MODEL") ?? "claude-haiku-4-5-20251001";

interface StudentProfileInput {
  name: string;
  year: string;
  skills: string[];
  interests: string[];
  domain: string;
  experience: string;
  goal: string;
  weeklyHours: string;
}

function buildSystemPrompt(): string {
  return `You are an expert career counselor for college students. You analyze a student's profile and generate exactly THREE realistic, personalized career paths.

Your analysis must be SPECIFIC to the student's submitted profile:
- If the student has weak skills, clearly identify which skills are weak and what they need to learn.
- If the student is unsure about their career ("Not Sure" goal), suggest diverse realistic options across different domains.
- If the student has strong skills in a particular area, acknowledge those as current strengths.
- The match score (0-100) should reflect how well the career aligns with their skills, interests, domain, and goals.
- Recommendations must be practical and actionable, not generic advice.
- Technologies, projects, and preparation steps must be specific to each career path.
- The year-by-year roadmap must be dynamic and tailored to the student's current year and experience level.

Return a JSON object with exactly this structure (no markdown, no explanation, just valid JSON):

{
  "careers": [
    {
      "careerName": "string",
      "matchScore": number (0-100),
      "overview": "string - 2-3 sentence career overview tailored to why it suits this student",
      "whyItFits": ["string", "string", "string"] - 3-4 specific reasons tied to the student's profile,
      "currentStrengths": ["string"] - skills from the student's profile that are relevant,
      "skillGaps": [{"skill": "string", "importance": "Critical|Important|Beneficial"}],
      "technologies": ["string"] - 6-10 technologies to learn for this career,
      "difficulty": "Moderate|Challenging|Demanding",
      "preparationTime": "string - e.g. '6-9 months focused learning'",
      "year1": {"focus": "string", "topics": ["string"], "milestone": "string"},
      "year2": {"focus": "string", "topics": ["string"], "milestone": "string"},
      "year3": {"focus": "string", "topics": ["string"], "milestone": "string"},
      "year4": {"focus": "string", "topics": ["string"], "milestone": "string"},
      "recommendedProjects": [{"title": "string", "description": "string", "difficulty": "Beginner|Intermediate|Advanced", "technologies": ["string"]}],
      "internshipPreparation": ["string"] - 4-6 specific steps,
      "placementPreparation": ["string"] - 4-6 specific steps,
      "thirtyDayPlan": [{"week": "Week 1", "learningGoals": ["string"], "topics": ["string"], "miniTask": "string", "projectTask": "string"}]
    }
  ]
}

Rules:
- Generate exactly 3 careers.
- Sort careers by matchScore descending (highest first).
- If the student's preferred domain maps to a career, that career should generally have the highest match.
- For "Not Sure" goal students, pick 3 diverse careers across different domains.
- If the student is already in 3rd/4th year or Graduate, adjust year1/year2 topics to be more accelerated or mark them as "catch-up" phases.
- Skill gaps must reference real technologies/skills needed for that career that the student doesn't have.
- Each career should have 4 recommended projects and 4 weeks in the thirtyDayPlan.`;
}

function buildUserProfile(profile: StudentProfileInput): string {
  return `Student Profile:
- Name: ${profile.name}
- Current Year: ${profile.year}
- Skills: ${profile.skills.join(", ") || "None listed"}
- Interests: ${profile.interests.join(", ") || "None listed"}
- Preferred Domain: ${profile.domain}
- Experience Level: ${profile.experience}
- Career Goal: ${profile.goal}
- Weekly Learning Time: ${profile.weeklyHours}

Analyze this profile and generate exactly 3 personalized career paths. Return only valid JSON.`;
}

function sanitizeJsonResponse(text: string): string {
  let cleaned = text.trim();

  // Remove markdown code fences if present
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");

  // Find the first { and last } to extract the JSON object
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
}

function validateCareers(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.careers) || obj.careers.length !== 3) return false;

  for (const career of obj.careers) {
    if (!career || typeof career !== "object") return false;
    const c = career as Record<string, unknown>;
    if (typeof c.careerName !== "string") return false;
    if (typeof c.matchScore !== "number") return false;
    if (typeof c.overview !== "string") return false;
    if (!Array.isArray(c.whyItFits)) return false;
    if (!Array.isArray(c.currentStrengths)) return false;
    if (!Array.isArray(c.skillGaps)) return false;
    if (!Array.isArray(c.technologies)) return false;
    if (typeof c.difficulty !== "string") return false;
    if (typeof c.preparationTime !== "string") return false;
    if (!c.year1 || !c.year2 || !c.year3 || !c.year4) return false;
    if (!Array.isArray(c.recommendedProjects)) return false;
    if (!Array.isArray(c.internshipPreparation)) return false;
    if (!Array.isArray(c.placementPreparation)) return false;
    if (!Array.isArray(c.thirtyDayPlan)) return false;
  }

  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const profile: StudentProfileInput = await req.json();

    if (!profile.skills || !profile.interests || !profile.domain) {
      return new Response(
        JSON.stringify({ error: "Missing required profile fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = buildSystemPrompt();
    const userMessage = buildUserProfile(profile);

    const anthropicResponse = await fetch(
      `${ANTHROPIC_BASE_URL}/v1/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 8000,
          messages: [
            { role: "user", content: `${systemPrompt}\n\n${userMessage}` }
          ],
        }),
      }
    );

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error("Anthropic API error:", anthropicResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `AI service error (${anthropicResponse.status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const textContent = anthropicData.content?.[0]?.text;

    if (!textContent) {
      return new Response(
        JSON.stringify({ error: "Empty response from AI service" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanedJson = sanitizeJsonResponse(textContent);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch {
      console.error("Failed to parse AI response as JSON");
      return new Response(
        JSON.stringify({ error: "Invalid JSON from AI service" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!validateCareers(parsed)) {
      console.error("AI response failed validation");
      return new Response(
        JSON.stringify({ error: "AI response did not match expected schema" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(parsed),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
