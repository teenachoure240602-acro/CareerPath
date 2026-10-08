import type {
  CareerAnalysis,
  CareerPath,
  StudentProfile,
  SkillGap,
  YearPlan,
  ProjectRecommendation,
  WeekPlan,
  MatchBreakdown,
} from "../types";
import { generateAnalysis as generateMockAnalysis } from "../data/careerEngine";
import { iconForCareerName } from "../utils/careerIcons";

// Raw shape returned by the AI (field names differ from our internal CareerPath type)
interface AIMatchBreakdownItem {
  label: string;
  score: number;
}

interface AICareer {
  careerName: string;
  matchScore: number;
  matchBreakdown?: AIMatchBreakdownItem[];
  overview: string;
  whyItFits: string[];
  currentStrengths: string[];
  skillGaps: { skill: string; importance: string }[];
  technologies: string[];
  difficulty: string;
  preparationTime: string;
  year1: { focus: string; topics: string[]; milestone: string };
  year2: { focus: string; topics: string[]; milestone: string };
  year3: { focus: string; topics: string[]; milestone: string };
  year4: { focus: string; topics: string[]; milestone: string };
  recommendedProjects: { title: string; description: string; difficulty: string; technologies: string[] }[];
  internshipPreparation: string[];
  placementPreparation: string[];
  thirtyDayPlan: { week: string; learningGoals: string[]; topics: string[]; miniTask: string; projectTask: string }[];
}

interface AIResponse {
  careers: AICareer[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function clampDifficulty(d: string): CareerPath["difficulty"] {
  const lower = d.toLowerCase();
  if (lower.includes("demand") || lower.includes("hard") || lower.includes("very")) return "Demanding";
  if (lower.includes("challeng")) return "Challenging";
  return "Moderate";
}

function clampSkillGapImportance(imp: string): SkillGap["importance"] {
  const lower = imp.toLowerCase();
  if (lower.includes("critical") || lower.includes("essential")) return "Critical";
  if (lower.includes("important") || lower.includes("major")) return "Important";
  return "Beneficial";
}

function clampProjectDifficulty(d: string): ProjectRecommendation["difficulty"] {
  const lower = d.toLowerCase();
  if (lower.includes("adv") || lower.includes("hard")) return "Advanced";
  if (lower.includes("inter")) return "Intermediate";
  return "Beginner";
}

function mapYearPlan(yearLabel: string, raw: { focus: string; topics: string[]; milestone: string }): YearPlan {
  return {
    year: yearLabel,
    focus: raw.focus,
    topics: Array.isArray(raw.topics) ? raw.topics : [],
    milestone: raw.milestone,
  };
}

function mapWeekPlan(raw: {
  week: string;
  learningGoals: string[];
  topics: string[];
  miniTask: string;
  projectTask: string;
}): WeekPlan {
  return {
    week: raw.week,
    learningGoals: Array.isArray(raw.learningGoals) ? raw.learningGoals : [],
    topics: Array.isArray(raw.topics) ? raw.topics : [],
    miniTask: raw.miniTask || "",
    projectTask: raw.projectTask || "",
  };
}

function mapMatchBreakdown(raw: AIMatchBreakdownItem[] | undefined): MatchBreakdown[] {
  const fallback: MatchBreakdown[] = [
    { label: "Skill Match", score: 75 },
    { label: "Interest Match", score: 75 },
    { label: "Goal Match", score: 75 },
    { label: "Experience Match", score: 75 },
  ];
  if (!Array.isArray(raw) || raw.length === 0) return fallback;
  return raw.map((item) => ({
    label: item.label || "Match",
    score: Math.max(0, Math.min(100, Math.round(item.score))),
  }));
}

function mapAICareer(raw: AICareer, index: number): CareerPath {
  const id = slugify(raw.careerName);
  const iconName = iconForCareerName(raw.careerName);

  const tagline = raw.technologies.slice(0, 4).join(" · ");

  const yearByYear: YearPlan[] = [
    mapYearPlan("Year 1", raw.year1),
    mapYearPlan("Year 2", raw.year2),
    mapYearPlan("Year 3", raw.year3),
    mapYearPlan("Year 4", raw.year4),
  ];

  const projects: ProjectRecommendation[] = (raw.recommendedProjects || []).map((p) => ({
    title: p.title,
    description: p.description,
    difficulty: clampProjectDifficulty(p.difficulty),
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
  }));

  const skillGaps: SkillGap[] = (raw.skillGaps || []).map((g) => ({
    skill: g.skill,
    importance: clampSkillGapImportance(g.importance),
  }));

  const thirtyDayPlan: WeekPlan[] = (raw.thirtyDayPlan || []).map(mapWeekPlan);

  return {
    id,
    name: raw.careerName,
    icon: iconName,
    tagline,
    matchPercentage: Math.max(0, Math.min(100, Math.round(raw.matchScore))),
    matchBreakdown: mapMatchBreakdown(raw.matchBreakdown),
    explanation: raw.overview,
    whyFits: Array.isArray(raw.whyItFits) ? raw.whyItFits : [],
    currentStrengths: Array.isArray(raw.currentStrengths) ? raw.currentStrengths : [],
    skillGaps,
    difficulty: clampDifficulty(raw.difficulty),
    prepTime: raw.preparationTime,
    technologies: Array.isArray(raw.technologies) ? raw.technologies : [],
    coreSkills: (Array.isArray(raw.technologies) ? raw.technologies : []).slice(0, 6).join(", "),
    recommendedFor: raw.whyItFits?.[0] ?? "Students matching this career profile",
    jobPreparation: (raw.placementPreparation || []).join("; "),
    overview: raw.overview,
    yearByYear,
    projects,
    internshipPrep: Array.isArray(raw.internshipPreparation) ? raw.internshipPreparation : [],
    placementPrep: Array.isArray(raw.placementPreparation) ? raw.placementPreparation : [],
    thirtyDayPlan,
  };
}

export async function generateAICareerAnalysis(profile: StudentProfile): Promise<CareerAnalysis> {
  const response = await fetch("/api/generate-career-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: profile.name,
      year: profile.year,
      skills: profile.skills,
      interests: profile.interests,
      domain: profile.domain,
      experience: profile.experience,
      goal: profile.goal,
      weeklyHours: profile.weeklyHours,
    }),
  });

  if (!response.ok) {
    let message = `AI service unavailable (status ${response.status})`;
    try {
      const errorBody = JSON.parse(await response.text());
      if (errorBody?.error) message = errorBody.error;
    } catch {
      // response had no JSON body — use the generic message
    }
    throw new Error(message);
  }

  const data: AIResponse = await response.json();

  if (!data.careers || !Array.isArray(data.careers) || data.careers.length === 0) {
    throw new Error("AI returned no careers");
  }

  const careers = data.careers
    .slice(0, 3)
    .map((raw, i) => mapAICareer(raw, i))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    profile,
    careers,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateCareerAnalysisWithFallback(profile: StudentProfile): Promise<CareerAnalysis> {
  try {
    const aiResult = await generateAICareerAnalysis(profile);
    return aiResult;
  } catch (err) {
    console.warn("AI analysis failed, falling back to local engine:", err);
    return generateMockAnalysis(profile);
  }
}
