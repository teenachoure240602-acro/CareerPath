import { Link } from "react-router-dom";
import { ArrowRight, Code2, BrainCircuit, Database, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import type { CareerPath } from "../types";
import { useApp } from "../context/AppContext";

const ICON_MAP: Record<string, typeof Code2> = {
  Code2,
  BrainCircuit,
  Database,
};

export default function CareerCard({ career, rank }: { career: CareerPath; rank: number }) {
  const { setProfile, analysis } = useApp();
  const Icon = ICON_MAP[career.icon] || Sparkles;
  const isBestMatch = rank === 0;

  return (
    <div
      className={`glass-card p-6 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${
        isBestMatch ? "card-glow ring-1 ring-accent-400/30" : ""
      }`}
      style={{ animation: `fadeInUp 0.6s ease-out ${rank * 0.15}s both` }}
    >
      {isBestMatch && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-accent-400 to-navy-400 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
          BEST MATCH
        </div>
      )}

      <div className="flex items-start gap-4 mb-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
          isBestMatch ? "bg-gradient-to-br from-accent-400 to-navy-500" : "bg-white/10"
        }`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-xl text-white">{career.name}</h3>
          <p className="text-sm text-navy-300 mt-0.5">{career.tagline}</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-navy-200">Match Score</span>
          <span className={`text-2xl font-display font-bold ${isBestMatch ? "text-accent-300" : "text-white"}`}>
            {career.matchPercentage}%
          </span>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isBestMatch ? "bg-gradient-to-r from-accent-400 to-navy-400" : "bg-gradient-to-r from-navy-500 to-navy-400"
            }`}
            style={{ width: `${career.matchPercentage}%`, animation: "fadeIn 1.2s ease-out" }}
          />
        </div>
      </div>

      <p className="text-sm text-navy-200 mb-5 leading-relaxed">{career.explanation}</p>

      <div className="space-y-4 mb-5">
        <div>
          <h4 className="text-xs font-semibold text-accent-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Current Strengths
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {career.currentStrengths.slice(0, 3).map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-accent-500/15 text-accent-200 border border-accent-500/20">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Skill Gaps
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {career.skillGaps.slice(0, 4).map((g) => (
              <span key={g.skill} className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-200 border border-amber-500/15">
                {g.skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
        <div className="bg-white/5 rounded-lg p-3">
          <span className="text-xs text-navy-400 block">Difficulty</span>
          <span className="text-white font-medium">{career.difficulty}</span>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <span className="text-xs text-navy-400 block">Prep Time</span>
          <span className="text-white font-medium text-xs">{career.prepTime}</span>
        </div>
      </div>

      <Link
        to={`/roadmap/${career.id}`}
        onClick={() => analysis && setProfile(analysis.profile)}
        className="btn-primary w-full group"
      >
        Explore Roadmap
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
