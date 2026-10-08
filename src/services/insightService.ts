import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabaseClient";

export interface CareerInsight {
  whyFits: string;
  skillGaps: string[];
  projectSuggestions: string[];
  whatToLearnNext: string;
  careerAdvice: string;
}

interface InsightRequest {
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

export async function fetchCareerInsight(req: InsightRequest): Promise<CareerInsight> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/gemini-career-insight`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    let message = `AI insight unavailable (status ${response.status})`;
    try {
      const errorBody = JSON.parse(await response.text());
      if (errorBody?.error) message = errorBody.error;
    } catch {
      // no JSON body
    }
    throw new Error(message);
  }

  const data = await response.json() as CareerInsight;
  return data;
}
