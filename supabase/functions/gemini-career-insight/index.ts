const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Apikey",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemma-3-27b-it";
const REQUEST_TIMEOUT_MS = 30_000;

interface CareerInsightRequest {
  profile: {
    name: string;
    year: string;
    skills: string[];
    interests: string[];
    domain: string;
    experience: string;
    goal: string;
    weeklyHours: string;
  };
  topCareer: {
    name: string;
    matchPercentage: number;
    matchBreakdown: { label: string; score: number }[];
    whyFits: string[];
    skillGaps: { skill: string; importance: string }[];
    technologies: string[];
    overview: string;
  };
}

function buildPrompt(req: CareerInsightRequest): string {
  const { profile, topCareer } = req;
  return `You are an expert career counselor. A student has received a career analysis from an AI career engine. Your job is to provide a short, personalized AI insight for the TOP recommended career.

Student Profile:
- Name: ${profile.name}
- Year: ${profile.year}
- Skills: ${profile.skills.join(", ") || "None"}
- Interests: ${profile.interests.join(", ") || "None"}
- Domain: ${profile.domain}
- Experience: ${profile.experience}
- Goal: ${profile.goal}
- Weekly Hours: ${profile.weeklyHours}

Top Recommended Career: ${topCareer.name} (Match: ${topCareer.matchPercentage}%)
- Overview: ${topCareer.overview}
- Why it fits: ${topCareer.whyFits.join("; ")}
- Skill gaps: ${topCareer.skillGaps.map((g) => `${g.skill} (${g.importance})`).join(", ")}
- Key technologies: ${topCareer.technologies.join(", ")}

Generate a JSON object with EXACTLY this structure (no markdown, no preamble, just valid JSON):

{
  "whyFits": "2-3 sentences explaining why this career fits this specific student",
  "skillGaps": ["top skill gap 1", "top skill gap 2", "top skill gap 3"],
  "projectSuggestions": ["project idea 1 with brief description", "project idea 2 with brief description", "project idea 3 with brief description"],
  "whatToLearnNext": "1-2 sentences on what the student should learn next",
  "careerAdvice": "1-2 sentences of practical career advice for this student"
}

Return ONLY valid JSON. No markdown fences.`;
}

function sanitizeJsonResponse(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned.trim();
}

function validateInsight(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.whyFits === "string" &&
    Array.isArray(d.skillGaps) &&
    Array.isArray(d.projectSuggestions) &&
    typeof d.whatToLearnNext === "string" &&
    typeof d.careerAdvice === "string"
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Gemini API key is not configured." }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const raw: unknown = await req.json();

    if (!raw || typeof raw !== "object") {
      return new Response(
        JSON.stringify({ error: "Invalid request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = raw as CareerInsightRequest;
    if (!body.profile || !body.topCareer || !body.topCareer.name) {
      return new Response(
        JSON.stringify({ error: "Missing profile or topCareer in request." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = buildPrompt(body);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let geminiResponse: Response;
    try {
      geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          }),
        }
      );
    } catch (fetchErr) {
      clearTimeout(timeout);
      const isAbort = fetchErr instanceof Error && fetchErr.name === "AbortError";
      return new Response(
        JSON.stringify({ error: isAbort ? "Request timed out." : "Could not reach Gemini API." }),
        { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    clearTimeout(timeout);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Gemini API error (${geminiResponse.status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiResponse.json();
    const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      return new Response(
        JSON.stringify({ error: "Empty response from Gemini." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanedJson = sanitizeJsonResponse(textContent);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON from Gemini." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!validateInsight(parsed)) {
      return new Response(
        JSON.stringify({ error: "Gemini response did not match expected format." }),
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
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
