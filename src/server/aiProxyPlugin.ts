import type { Plugin } from "vite";

const AI_API_KEY = process.env.AI_API_KEY ?? "";
const AI_BASE_URL = process.env.AI_BASE_URL ?? "https://api.anthropic.com";
const AI_MODEL = process.env.AI_MODEL ?? "claude-haiku-4-5-20251001";
const AI_CUSTOM_HEADERS = process.env.AI_CUSTOM_HEADERS ?? "";
const REQUEST_TIMEOUT_MS = 30_000;

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

const SYSTEM_PROMPT = `You are an expert career counselor for college students. You analyze a student's profile and generate exactly THREE realistic, personalized career paths.

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
      "matchScore": number,
      "matchBreakdown": [
        {"label": "Skill Match", "score": number},
        {"label": "Interest Match", "score": number},
        {"label": "Goal Match", "score": number},
        {"label": "Experience Match", "score": number}
      ],
      "overview": "string - 2-3 sentence career overview tailored to why it suits this student",
      "whyItFits": ["string", "string", "string", "string", "string"],
      "currentStrengths": ["string"],
      "skillGaps": [{"skill": "string", "importance": "Critical|Important|Beneficial"}],
      "technologies": ["string"],
      "difficulty": "Moderate|Challenging|Demanding",
      "preparationTime": "string",
      "year1": {"focus": "string", "topics": ["string"], "milestone": "string"},
      "year2": {"focus": "string", "topics": ["string"], "milestone": "string"},
      "year3": {"focus": "string", "topics": ["string"], "milestone": "string"},
      "year4": {"focus": "string", "topics": ["string"], "milestone": "string"},
      "recommendedProjects": [{"title": "string", "description": "string", "difficulty": "Beginner|Intermediate|Advanced", "technologies": ["string"]}],
      "internshipPreparation": ["string"],
      "placementPreparation": ["string"],
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
- Each career should have 4 recommended projects and 4 weeks in the thirtyDayPlan.
- matchBreakdown scores must each be 0-100 and the weighted average of the four sub-scores should roughly equal the overall matchScore.
- whyItFits must contain 3-5 specific reasons referencing the student's actual skills, interests, domain, experience, or goal.
- Return ONLY valid JSON, no markdown fences, no preamble.`;

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
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned.trim();
}

function validateProfile(body: unknown): body is StudentProfileInput {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    typeof b.year === "string" &&
    Array.isArray(b.skills) &&
    Array.isArray(b.interests) &&
    typeof b.domain === "string" &&
    typeof b.experience === "string" &&
    typeof b.goal === "string" &&
    typeof b.weeklyHours === "string"
  );
}

function sendJson(res: any, status: number, payload: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

export function aiProxyPlugin(): Plugin {
  return {
    name: "ai-proxy-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== "/api/generate-career-analysis" || req.method !== "POST") {
          return next();
        }

        if (!AI_API_KEY) {
          console.error("AI_API_KEY environment variable is not set");
          sendJson(res, 503, { error: "AI service is not configured. Set AI_API_KEY in the server environment." });
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(chunk as Buffer);
          }
          const raw: unknown = JSON.parse(Buffer.concat(chunks).toString());

          if (!validateProfile(raw)) {
            sendJson(res, 400, { error: "Missing or invalid profile fields in request body." });
            return;
          }

          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "x-api-key": AI_API_KEY,
            "anthropic-version": "2023-06-01",
          };

          if (AI_CUSTOM_HEADERS) {
            for (const pair of AI_CUSTOM_HEADERS.split(",")) {
              const [key, ...valParts] = pair.split(":");
              if (key && valParts.length) {
                headers[key.trim()] = valParts.join(":").trim();
              }
            }
          }

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

          let anthropicResponse: Response;
          try {
            anthropicResponse = await fetch(
              `${AI_BASE_URL}/v1/messages`,
              {
                method: "POST",
                headers,
                signal: controller.signal,
                body: JSON.stringify({
                  model: AI_MODEL,
                  max_tokens: 8000,
                  messages: [
                    { role: "user", content: `${SYSTEM_PROMPT}\n\n${buildUserProfile(raw)}` },
                  ],
                }),
              }
            );
          } catch (fetchErr) {
            clearTimeout(timeout);
            const isAbort = fetchErr instanceof Error && fetchErr.name === "AbortError";
            console.error(isAbort ? "AI request timed out" : "AI fetch failed", fetchErr);
            sendJson(res, 504, { error: isAbort ? "AI service timed out. Please try again." : "Could not reach the AI service." });
            return;
          }
          clearTimeout(timeout);

          if (!anthropicResponse.ok) {
            const errorText = await anthropicResponse.text();
            console.error("AI API error:", anthropicResponse.status, errorText);
            sendJson(res, 502, { error: `AI service error (${anthropicResponse.status})` });
            return;
          }

          const anthropicData = await anthropicResponse.json();
          const textContent = anthropicData.content?.[0]?.text;

          if (!textContent) {
            sendJson(res, 502, { error: "Empty response from AI service" });
            return;
          }

          const cleanedJson = sanitizeJsonResponse(textContent);

          let parsed: unknown;
          try {
            parsed = JSON.parse(cleanedJson);
          } catch {
            console.error("Failed to parse AI response as JSON");
            sendJson(res, 502, { error: "Invalid JSON from AI service" });
            return;
          }

          sendJson(res, 200, parsed);
        } catch (err) {
          console.error("AI proxy error:", err);
          sendJson(res, 500, { error: "Internal server error" });
        }
      });
    },
  };
}
