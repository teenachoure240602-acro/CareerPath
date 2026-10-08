import type { StudentProfile } from "../types";

export interface DemoProfile {
  id: string;
  label: string;
  description: string;
  icon: "Code2" | "BrainCircuit" | "Database";
  gradient: string;
  profile: StudentProfile;
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "web-dev",
    label: "Web Development Student",
    description: "2nd year student with frontend skills exploring full-stack careers",
    icon: "Code2",
    gradient: "from-sky-500 to-blue-600",
    profile: {
      name: "Alex Chen",
      year: "2nd Year",
      skills: ["HTML/CSS", "JavaScript", "React", "Git", "Python"],
      interests: ["Web Development", "UI/UX Design", "Open Source"],
      domain: "Web Development",
      experience: "Beginner",
      goal: "Internship",
      weeklyHours: "15 hours",
    },
  },
  {
    id: "ai-ml",
    label: "AI/ML Interested Student",
    description: "3rd year student with Python and math background curious about ML",
    icon: "BrainCircuit",
    gradient: "from-accent-500 to-purple-600",
    profile: {
      name: "Priya Sharma",
      year: "3rd Year",
      skills: ["Python", "NumPy", "Pandas", "Machine Learning", "Data Structures", "Statistics"],
      interests: ["AI/ML", "Data Science", "Competitive Programming"],
      domain: "AI/ML",
      experience: "Intermediate",
      goal: "Placement",
      weeklyHours: "20+ hours",
    },
  },
  {
    id: "data-eng",
    label: "Data Engineering Student",
    description: "4th year student with SQL and cloud basics targeting data roles",
    icon: "Database",
    gradient: "from-emerald-500 to-teal-600",
    profile: {
      name: "Jordan Lee",
      year: "4th Year",
      skills: ["SQL", "Python", "AWS", "Docker", "Linux", "Tableau"],
      interests: ["Data Science", "Cloud Computing", "IoT"],
      domain: "Data",
      experience: "Intermediate",
      goal: "Placement",
      weeklyHours: "20+ hours",
    },
  },
];
