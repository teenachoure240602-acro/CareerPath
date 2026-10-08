import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Code2,
  BrainCircuit,
  Database,
  Sparkles,
  Target,
  CheckSquare,
  Rocket,
  BookOpen,
  Wrench,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CAREER_LIBRARY } from "../data/careerEngine";
import type { CareerPath, WeekPlan } from "../types";

const ICON_MAP: Record<string, typeof Code2> = {
  Code2,
  BrainCircuit,
  Database,
};

const WEEK_COLORS = [
  "from-navy-500 to-navy-700",
  "from-accent-500 to-accent-700",
  "from-navy-600 to-accent-600",
  "from-accent-600 to-navy-600",
];

export default function ActionPlanPage() {
  const { careerId } = useParams<{ careerId: string }>();
  const { analysis } = useApp();

  const analysisCareer = analysis?.careers.find((c) => c.id === careerId);
  const template = careerId ? CAREER_LIBRARY[careerId] : null;
  const career = analysisCareer || template;

  if (!career) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h1 className="font-display font-bold text-2xl text-white mb-3">Action Plan Not Found</h1>
        <Link to="/results" className="btn-primary">Back to Results</Link>
      </div>
    );
  }

  const fullCareer = career as CareerPath;
  const Icon = ICON_MAP[fullCareer.icon] || Sparkles;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to={`/roadmap/${fullCareer.id}`} className="btn-ghost mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Roadmap
      </Link>

      {/* Header */}
      <div className="glass-card p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-400 via-navy-400 to-accent-400" />
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-500 to-accent-500 flex items-center justify-center shrink-0">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-accent-300 text-sm mb-1">
              <CalendarDays className="w-4 h-4" /> 30-Day Action Plan
            </div>
            <h1 className="font-display font-bold text-3xl text-white">{fullCareer.name}</h1>
            <p className="text-navy-300 mt-1">Your first month toward becoming a {fullCareer.name.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="glass-card p-6 mb-8 bg-accent-500/5 border-accent-500/15">
        <p className="text-navy-200 leading-relaxed">
          This 4-week plan is designed to kickstart your journey. Each week builds on the previous one, combining
          learning goals, focused topics, a mini task, and a hands-on project task. Stay consistent and track your progress!
        </p>
      </div>

      {/* Weekly Plan */}
      <div className="space-y-6">
        {fullCareer.thirtyDayPlan.map((week: WeekPlan, i: number) => (
          <div
            key={week.week}
            className="glass-card p-6 sm:p-8 relative overflow-hidden"
            style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both` }}
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${WEEK_COLORS[i]}`} />

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${WEEK_COLORS[i]} flex items-center justify-center shrink-0`}>
                <span className="text-white font-display font-bold text-lg">{i + 1}</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-white">{week.week}</h2>
                <p className="text-sm text-navy-400">Days {i * 7 + 1}–{(i + 1) * 7}</p>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-accent-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" /> Learning Goals
              </h3>
              <div className="space-y-2">
                {week.learningGoals.map((goal, j) => (
                  <div key={j} className="flex items-start gap-2.5 bg-white/5 rounded-lg p-3">
                    <CheckSquare className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-navy-100">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Topics to Cover
              </h3>
              <div className="flex flex-wrap gap-2">
                {week.topics.map((topic) => (
                  <span key={topic} className="text-sm px-3 py-1.5 rounded-lg bg-white/5 text-navy-200 border border-white/10">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Mini Task & Project Task */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-navy-500/10 rounded-xl p-4 border border-navy-500/15">
                <h3 className="text-sm font-semibold text-navy-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4" /> Mini Task
                </h3>
                <p className="text-sm text-navy-100">{week.miniTask}</p>
              </div>
              <div className="bg-accent-500/10 rounded-xl p-4 border border-accent-500/15">
                <h3 className="text-sm font-semibold text-accent-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Rocket className="w-4 h-4" /> Project Task
                </h3>
                <p className="text-sm text-navy-100">{week.projectTask}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="glass-card p-8 text-center mt-8">
        <h2 className="font-display font-bold text-2xl text-white mb-3">Ready to Start?</h2>
        <p className="text-navy-300 mb-6">Begin Week 1 today and track your progress over the next 30 days</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={`/roadmap/${fullCareer.id}`} className="btn-secondary">
            View Full Roadmap
          </Link>
          <Link to="/compare" className="btn-primary">
            Compare All Careers
          </Link>
        </div>
      </div>
    </div>
  );
}
