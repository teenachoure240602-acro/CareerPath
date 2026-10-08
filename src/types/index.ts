export type YearOfStudy = "1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "Graduate";
export type Domain = "Web Development" | "AI/ML" | "Data" | "Cybersecurity" | "Cloud" | "Mobile Development" | "Other";
export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";
export type CareerGoal = "Internship" | "Placement" | "Higher Studies" | "Entrepreneurship" | "Not Sure";
export type WeeklyHours = "5 hours" | "10 hours" | "15 hours" | "20+ hours";

export interface StudentProfile {
  name: string;
  year: YearOfStudy;
  skills: string[];
  interests: string[];
  domain: Domain;
  experience: ExperienceLevel;
  goal: CareerGoal;
  weeklyHours: WeeklyHours;
}

export interface SkillGap {
  skill: string;
  importance: "Critical" | "Important" | "Beneficial";
}

export interface YearPlan {
  year: string;
  focus: string;
  topics: string[];
  milestone: string;
}

export interface ProjectRecommendation {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  technologies: string[];
}

export interface WeekPlan {
  week: string;
  learningGoals: string[];
  topics: string[];
  miniTask: string;
  projectTask: string;
}

export interface MatchBreakdown {
  label: string;
  score: number;
}

export interface CareerPath {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  matchPercentage: number;
  matchBreakdown: MatchBreakdown[];
  explanation: string;
  whyFits: string[];
  currentStrengths: string[];
  skillGaps: SkillGap[];
  difficulty: "Moderate" | "Challenging" | "Demanding";
  prepTime: string;
  technologies: string[];
  coreSkills: string;
  recommendedFor: string;
  jobPreparation: string;
  overview: string;
  yearByYear: YearPlan[];
  projects: ProjectRecommendation[];
  internshipPrep: string[];
  placementPrep: string[];
  thirtyDayPlan: WeekPlan[];
}

export interface CareerAnalysis {
  profile: StudentProfile;
  careers: CareerPath[];
  generatedAt: string;
}
