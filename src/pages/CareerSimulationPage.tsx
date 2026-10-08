import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Code2,
  Rocket,
  Briefcase,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Wand2,
  Award,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CAREER_LIBRARY } from "../data/careerEngine";
import { getCareerIcon } from "../utils/careerIcons";
import type { CareerPath, StudentProfile } from "../types";

interface QuarterSim {
  period: string;
  label: string;
  icon: typeof Code2;
  color: string;
  bgColor: string;
  borderColor: string;
  skillsToLearn: string[];
  projects: string[];
  milestone: string;
}

function getCareer(id: string): CareerPath | null {
  const template = CAREER_LIBRARY[id];
  if (!template) return null;
  return {
    ...template,
    matchPercentage: 0,
    matchBreakdown: [],
    currentStrengths: [],
    skillGaps: [],
    whyFits: [],
  };
}

function buildSimulation(career: CareerPath, profile: StudentProfile | null): QuarterSim[] {
  const t = career.technologies;

  // Quarter 1 (Months 1-3): Skills to learn — foundational technologies
  const q1Skills = t.slice(0, 4).map((tech) => tech);
  // Quarter 2 (Months 4-6): Projects — use first two projects
  const q2Projects = career.projects.slice(0, 2).map((p) => p.title);
  // Quarter 3 (Months 7-9): Advanced skills + internship prep
  const q3Skills = t.slice(4, 8).map((tech) => tech);
  // Quarter 4 (Months 10-12): Interview & placement prep

  const currentSkills = profile
    ? profile.skills.length > 0
      ? profile.skills.slice(0, 5)
      : ["Basic programming", "Problem-solving mindset"]
    : career.currentStrengths.slice(0, 5).length > 0
      ? career.currentStrengths.slice(0, 5)
      : ["Basic programming", "Problem-solving mindset"];

  const requiredSkills = t.slice(0, 6);

  const careerReadySkills = [
    ...requiredSkills.slice(0, 3),
    "System Design",
    "Interview-ready Portfolio",
    "Mock Interview Experience",
  ];

  return [
    {
      period: "Months 1-3",
      label: "Skills to Learn",
      icon: Code2,
      color: "text-sky-300",
      bgColor: "from-sky-500/20 to-sky-600/10",
      borderColor: "border-sky-500/30",
      skillsToLearn: q1Skills,
      projects: [],
      milestone: `Master the fundamentals of ${q1Skills.slice(0, 2).join(" and ")}${currentSkills.length > 0 ? `, building on your existing knowledge of ${currentSkills.slice(0, 2).join(" and ")}` : ""}`,
    },
    {
      period: "Months 4-6",
      label: "Projects",
      icon: Rocket,
      color: "text-accent-300",
      bgColor: "from-accent-500/20 to-accent-600/10",
      borderColor: "border-accent-500/30",
      skillsToLearn: [],
      projects: q2Projects,
      milestone: `Build and ship ${q2Projects.length} portfolio-worthy projects using ${t.slice(0, 3).join(", ")}`,
    },
    {
      period: "Months 7-9",
      label: "Advanced Skills & Internship Prep",
      icon: Briefcase,
      color: "text-emerald-300",
      bgColor: "from-emerald-500/20 to-emerald-600/10",
      borderColor: "border-emerald-500/30",
      skillsToLearn: q3Skills,
      projects: [],
      milestone: "Apply for internships with a polished resume and 3+ deployed projects",
    },
    {
      period: "Months 10-12",
      label: "Interview & Placement Prep",
      icon: Target,
      color: "text-amber-300",
      bgColor: "from-amber-500/20 to-amber-600/10",
      borderColor: "border-amber-500/30",
      skillsToLearn: career.placementPrep.slice(0, 4),
      projects: [],
      milestone: "Secure your target role with confidence in DSA, system design, and behavioral interviews",
    },
  ];
}

export default function CareerSimulationPage() {
  const { careerId } = useParams<{ careerId: string }>();
  const { analysis } = useApp();

  const analysisCareer = analysis?.careers.find((c) => c.id === careerId);
  const career = analysisCareer || (careerId ? getCareer(careerId) : null);

  if (!career) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h1 className="font-display font-bold text-2xl text-white mb-3">Career Not Found</h1>
        <Link to="/results" className="btn-primary">Back to Results</Link>
      </div>
    );
  }

  const Icon = getCareerIcon(career.icon);
  const profile = analysis?.profile ?? null;
  const quarters = buildSimulation(career, profile);

  const currentSkills = profile && profile.skills.length > 0
    ? profile.skills.slice(0, 6)
    : career.currentStrengths.length > 0
      ? career.currentStrengths.slice(0, 6)
      : ["Basic programming", "Problem-solving"];

  const requiredSkills = career.technologies.slice(0, 5);
  const careerReadySkills = [
    ...requiredSkills.slice(0, 3),
    "System Design",
    "Interview-Ready Portfolio",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to={`/roadmap/${career.id}`} className="btn-ghost mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Roadmap
      </Link>

      {/* Header */}
      <div className="glass-card p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-accent-400 to-amber-400" />
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-accent-500 flex items-center justify-center shrink-0">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 mb-2">
              <Wand2 className="w-3.5 h-3.5 text-accent-400" />
              <span className="text-xs text-accent-300 font-medium">Career Simulation</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-white mb-2">What If You Choose {career.name}?</h1>
            <p className="text-navy-300">A month-by-month simulation of your journey from where you are now to career-ready.</p>
          </div>
        </div>
      </div>

      {/* Skill Transformation Bar */}
      <div className="glass-card p-6 mb-8" style={{ animation: "fadeInUp 0.5s ease-out" }}>
        <h2 className="font-display font-bold text-lg text-white mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-400" /> Your Transformation Journey
        </h2>
        <p className="text-sm text-navy-400 mb-6">See how you'll evolve from your current skills to becoming career-ready</p>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Current Skills */}
          <div className="rounded-2xl p-5 bg-white/5 border border-white/10" style={{ animation: "fadeInUp 0.4s ease-out 0.1s both" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-navy-500/20 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-navy-300" />
              </div>
              <span className="text-sm font-semibold text-navy-200">Current Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentSkills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-navy-500/15 text-navy-200 border border-navy-500/20">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-1">
              <div className="h-0.5 w-8 bg-gradient-to-r from-navy-500/40 to-accent-500/40" />
              <ArrowRight className="w-5 h-5 text-accent-400/60" />
              <div className="h-0.5 w-8 bg-gradient-to-r from-accent-500/40 to-amber-500/40" />
            </div>
          </div>

          {/* Required Skills */}
          <div className="rounded-2xl p-5 bg-accent-500/5 border border-accent-500/15" style={{ animation: "fadeInUp 0.4s ease-out 0.2s both" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-300" />
              </div>
              <span className="text-sm font-semibold text-accent-200">Required Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-accent-500/15 text-accent-200 border border-accent-500/20">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Career Ready */}
        <div className="mt-4 rounded-2xl p-5 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20" style={{ animation: "fadeInUp 0.4s ease-out 0.3s both" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="text-sm font-semibold text-emerald-200">Career Ready</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {careerReadySkills.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-200 border border-emerald-500/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-accent-500 via-emerald-500 to-amber-500 md:left-1/2 md:-translate-x-1/2" />

        <div className="space-y-8">
          {quarters.map((q, i) => {
            const QIcon = q.icon;
            const isLeft = i % 2 === 0;
            return (
              <div
                key={q.period}
                className={`relative flex items-start gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} md:gap-0`}
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both` }}
              >
                {/* Node */}
                <div className="absolute left-0 top-1 z-10 md:left-1/2 md:-translate-x-1/2">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${q.bgColor} border ${q.borderColor} flex items-center justify-center ring-4 ring-navy-950`}>
                    <QIcon className={`w-6 h-6 ${q.color}`} />
                  </div>
                </div>

                {/* Card */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <div className={`glass-card p-5 bg-gradient-to-br ${q.bgColor} border ${q.borderColor}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isLeft ? "md:justify-end" : ""}`}>
                      <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">{q.period}</span>
                    </div>
                    <h3 className={`font-display font-bold text-lg text-white mb-3`}>{q.label}</h3>

                    {q.skillsToLearn.length > 0 && (
                      <div className={`mb-3 ${isLeft ? "md:text-left" : ""}`}>
                        <p className="text-xs text-navy-400 mb-2 font-medium">
                          {i === 2 ? "Advanced Skills:" : i === 3 ? "Preparation Steps:" : "Skills to Learn:"}
                        </p>
                        <div className={`flex flex-wrap gap-1.5 ${isLeft ? "md:justify-end" : ""}`}>
                          {q.skillsToLearn.map((s) => (
                            <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {q.projects.length > 0 && (
                      <div className={`mb-3 ${isLeft ? "md:text-left" : ""}`}>
                        <p className="text-xs text-navy-400 mb-2 font-medium">Projects to Build:</p>
                        <div className="space-y-2">
                          {q.projects.map((p) => (
                            <div key={p} className={`flex items-center gap-2 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                              <Rocket className="w-4 h-4 text-accent-400 shrink-0" />
                              <span className="text-sm text-navy-100">{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Milestone */}
                    <div className={`flex items-start gap-2 rounded-lg p-3 bg-white/5 border border-white/10 ${isLeft ? "md:flex-row-reverse md:text-right" : ""}`}>
                      <CheckCircle2 className={`w-4 h-4 ${q.color} shrink-0 mt-0.5`} />
                      <span className="text-sm text-navy-100">
                        <span className="font-semibold">Milestone: </span>
                        {q.milestone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spacer for opposite side on desktop */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to={`/roadmap/${career.id}`} className="btn-secondary group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Roadmap
        </Link>
        <Link to={`/action-plan/${career.id}`} className="btn-primary group">
          Start Your 30-Day Action Plan
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
