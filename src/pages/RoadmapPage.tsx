import { useParams, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  Wrench,
  Calendar,
  Map as MapIcon,
  Rocket,
  Briefcase,
  Target,
  CheckCircle2,
  CalendarDays,
  GitCompare,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CAREER_LIBRARY } from "../data/careerEngine";
import { getCareerIcon } from "../utils/careerIcons";
import type { CareerPath } from "../types";

function getCareer(id: string): CareerPath | null {
  const template = CAREER_LIBRARY[id];
  if (!template) return null;
  return { ...template, matchPercentage: 0, currentStrengths: [], skillGaps: [], whyFits: [] };
}

export default function RoadmapPage() {
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
  const hasMatchData = analysisCareer !== undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to="/results" className="btn-ghost mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Results
      </Link>

      {/* Header */}
      <div className="glass-card p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-500 via-accent-400 to-navy-500" />
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-500 to-accent-500 flex items-center justify-center shrink-0">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-3xl text-white mb-2">{career.name}</h1>
            <p className="text-navy-300">{career.tagline}</p>
            {hasMatchData && (
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-navy-300">Match:</span>
                  <span className="text-2xl font-display font-bold text-accent-300">{career.matchPercentage}%</span>
                </div>
                <div className="flex-1 max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-400 to-navy-400 rounded-full"
                    style={{ width: `${career.matchPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link to="/compare" className="btn-secondary text-sm">
            <GitCompare className="w-4 h-4" /> Compare Careers
          </Link>
          <Link to={`/action-plan/${career.id}`} className="btn-primary text-sm">
            <CalendarDays className="w-4 h-4" /> 30-Day Action Plan
          </Link>
        </div>
      </div>

      {/* Section: Career Overview */}
      <Section icon={MapIcon} title="Career Overview" color="text-accent-400">
        <p className="text-navy-200 leading-relaxed">{career.overview}</p>
      </Section>

      {/* Section: Why This Career Fits You */}
      {hasMatchData && career.whyFits.length > 0 && (
        <Section icon={TrendingUp} title="Why This Career Fits You" color="text-accent-400">
          <div className="space-y-3">
            {career.whyFits.map((reason, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                <span className="text-navy-200 text-sm">{reason}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Section: Current Skills */}
      {hasMatchData && career.currentStrengths.length > 0 && (
        <Section icon={TrendingUp} title="Current Skills" color="text-accent-400">
          <div className="flex flex-wrap gap-2">
            {career.currentStrengths.map((s) => (
              <span key={s} className="px-3 py-2 rounded-lg bg-accent-500/15 text-accent-200 text-sm border border-accent-500/20">
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Section: Skill Gaps */}
      {hasMatchData && career.skillGaps.length > 0 && (
        <Section icon={AlertCircle} title="Skill Gaps" color="text-amber-400">
          <div className="space-y-2">
            {career.skillGaps.map((gap) => (
              <div key={gap.skill} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <span className="text-navy-200 text-sm">{gap.skill}</span>
                <span className={`text-xs px-2.5 py-1 rounded-lg ${
                  gap.importance === "Critical"
                    ? "bg-red-500/15 text-red-300 border border-red-500/20"
                    : gap.importance === "Important"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                    : "bg-navy-500/15 text-navy-300 border border-navy-500/20"
                }`}>
                  {gap.importance}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Section: Technologies to Learn */}
      <Section icon={Wrench} title="Technologies to Learn" color="text-navy-300">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {career.technologies.map((tech, i) => (
            <div
              key={tech}
              className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all"
              style={{ animation: `scaleIn 0.3s ease-out ${i * 0.05}s both` }}
            >
              <Wrench className="w-5 h-5 text-navy-400 mx-auto mb-2" />
              <span className="text-sm text-white font-medium">{tech}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Section: Year-by-Year Roadmap */}
      <Section icon={Calendar} title="Year-by-Year Roadmap" color="text-accent-400">
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-400 via-navy-400 to-transparent" />
          <div className="space-y-6">
            {career.yearByYear.map((year, i) => (
              <div key={year.year} className="relative pl-16" style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both` }}>
                <div className="absolute left-0 top-1 w-11 h-11 rounded-xl bg-gradient-to-br from-navy-500 to-accent-500 flex items-center justify-center ring-4 ring-navy-950">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                <div className="glass-card p-5 hover:bg-white/[0.07] transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-lg text-white">{year.year}</h3>
                    <span className="text-xs px-3 py-1 rounded-lg bg-accent-500/15 text-accent-300 border border-accent-500/20">
                      {year.focus}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 mb-3">
                    {year.topics.map((topic) => (
                      <div key={topic} className="flex items-center gap-2 text-sm text-navy-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0" />
                        {topic}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-accent-500/5 rounded-lg p-3 border border-accent-500/10">
                    <Target className="w-4 h-4 text-accent-400 shrink-0" />
                    <span className="text-accent-200"><span className="font-semibold">Milestone:</span> {year.milestone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section: Recommended Projects */}
      <Section icon={Rocket} title="Recommended Projects" color="text-accent-400">
        <div className="grid sm:grid-cols-2 gap-4">
          {career.projects.map((project, i) => (
            <div
              key={project.title}
              className="glass-card p-5 hover:-translate-y-1 transition-all"
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold text-white">{project.title}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-lg shrink-0 ml-2 ${
                  project.difficulty === "Beginner"
                    ? "bg-green-500/15 text-green-300 border border-green-500/20"
                    : project.difficulty === "Intermediate"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                    : "bg-red-500/15 text-red-300 border border-red-500/20"
                }`}>
                  {project.difficulty}
                </span>
              </div>
              <p className="text-sm text-navy-300 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-0.5 rounded bg-white/5 text-navy-300 border border-white/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section: Internship Preparation */}
      <Section icon={Briefcase} title="Internship Preparation" color="text-accent-400">
        <div className="space-y-3">
          {career.internshipPrep.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <div className="w-6 h-6 rounded-lg bg-accent-500/20 flex items-center justify-center shrink-0 text-accent-300 text-xs font-bold">
                {i + 1}
              </div>
              <span className="text-navy-200 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Section: Placement Preparation */}
      <Section icon={Target} title="Placement Preparation" color="text-accent-400">
        <div className="space-y-3">
          {career.placementPrep.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <div className="w-6 h-6 rounded-lg bg-navy-500/20 flex items-center justify-center shrink-0 text-navy-300 text-xs font-bold">
                {i + 1}
              </div>
              <span className="text-navy-200 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Section: First 30-Day Action Plan Preview */}
      <Section icon={CalendarDays} title="First 30-Day Action Plan" color="text-accent-400">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {career.thirtyDayPlan.map((week, i) => (
            <div key={week.week} className="glass-card p-5" style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}>
              <h3 className="font-display font-semibold text-white mb-2">{week.week}</h3>
              <p className="text-sm text-navy-300 mb-2">{week.learningGoals[0]}</p>
              <p className="text-xs text-navy-400">Project: {week.projectTask}</p>
            </div>
          ))}
        </div>
        <Link to={`/action-plan/${career.id}`} className="btn-primary w-full sm:w-auto">
          View Full 30-Day Plan <CalendarDays className="w-4 h-4" />
        </Link>
      </Section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: typeof MapIcon;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8" style={{ animation: "fadeInUp 0.5s ease-out" }}>
      <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2.5">
        <Icon className={`w-5 h-5 ${color}`} /> {title}
      </h2>
      {children}
    </div>
  );
}
