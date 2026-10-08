import { Link } from "react-router-dom";
import { GitCompare, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CAREER_LIBRARY } from "../data/careerEngine";
import { getCareerIcon } from "../utils/careerIcons";
import type { CareerPath } from "../types";

export default function ComparePage() {
  const { analysis } = useApp();

  let careers: CareerPath[];
  if (analysis) {
    careers = analysis.careers;
  } else {
    careers = Object.values(CAREER_LIBRARY).map((t) => ({
      ...t,
      matchPercentage: 0,
      currentStrengths: [],
      skillGaps: [],
      whyFits: [],
    }));
  }

  const bestMatch = careers.reduce((best, c) => (c.matchPercentage > best.matchPercentage ? c : best), careers[0]);

  const rows: { label: string; key: (c: CareerPath) => string }[] = [
    { label: "Match Score", key: (c) => `${c.matchPercentage}%` },
    { label: "Learning Difficulty", key: (c) => c.difficulty },
    { label: "Core Skills", key: (c) => c.coreSkills },
    { label: "Expected Prep Time", key: (c) => c.prepTime },
    { label: "Key Technologies", key: (c) => c.technologies.slice(0, 4).join(", ") },
    { label: "Job Preparation", key: (c) => c.jobPreparation },
    { label: "Recommended For", key: (c) => c.recommendedFor },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <GitCompare className="w-4 h-4 text-accent-400" />
          <span className="text-sm text-navy-200">Side-by-Side Comparison</span>
        </div>
        <h1 className="font-display font-bold text-4xl text-white mb-3">Compare Career Paths</h1>
        <p className="text-navy-300 text-lg">See how your three career matches stack up against each other</p>
      </div>

      {!analysis && (
        <div className="glass-card p-6 mb-8 text-center">
          <p className="text-navy-300 text-sm">
            Showing default career comparison. <Link to="/profile" className="text-accent-400 hover:underline">Build your profile</Link> for personalized match scores.
          </p>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block glass-card overflow-hidden" style={{ animation: "fadeInUp 0.5s ease-out" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-5 text-sm font-semibold text-navy-300 w-1/6">Attribute</th>
              {careers.map((career) => {
                const Icon = getCareerIcon(career.icon);
                const isBest = career.id === bestMatch.id && analysis;
                return (
                  <th key={career.id} className="text-left p-5 relative">
                    {isBest && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-accent-400 to-navy-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> BEST
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isBest ? "bg-gradient-to-br from-accent-400 to-navy-500" : "bg-white/10"}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-display font-bold text-white">{career.name}</span>
                    </div>
                    {analysis && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isBest ? "bg-gradient-to-r from-accent-400 to-navy-400" : "bg-navy-500"}`}
                            style={{ width: `${career.matchPercentage}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${isBest ? "text-accent-300" : "text-white"}`}>{career.matchPercentage}%</span>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                <td className="p-5 text-sm font-medium text-navy-300 border-r border-white/5">{row.label}</td>
                {careers.map((career) => (
                  <td key={career.id} className="p-5 text-sm text-navy-100 align-top">
                    {row.key(career)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-white/[0.03]">
              <td className="p-5 text-sm font-medium text-navy-300 border-r border-white/5">Explore</td>
              {careers.map((career) => (
                <td key={career.id} className="p-5">
                  <Link to={`/roadmap/${career.id}`} className="btn-ghost text-sm group">
                    View Roadmap <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-6">
        {careers.map((career, i) => {
          const Icon = getCareerIcon(career.icon);
          const isBest = career.id === bestMatch.id && analysis;
          return (
            <div
              key={career.id}
              className={`glass-card p-6 ${isBest ? "ring-1 ring-accent-400/30" : ""}`}
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isBest ? "bg-gradient-to-br from-accent-400 to-navy-500" : "bg-white/10"}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white">{career.name}</h3>
                  {isBest && <span className="text-xs text-accent-300 flex items-center gap-1"><Trophy className="w-3 h-3" /> Best Match</span>}
                </div>
                {analysis && (
                  <span className={`ml-auto text-2xl font-display font-bold ${isBest ? "text-accent-300" : "text-white"}`}>{career.matchPercentage}%</span>
                )}
              </div>
              <div className="space-y-3">
                {rows.map((row) => (
                  <div key={row.label} className="border-b border-white/5 pb-3 last:border-0">
                    <div className="text-xs text-navy-400 mb-1">{row.label}</div>
                    <div className="text-sm text-navy-100">{row.key(career)}</div>
                  </div>
                ))}
              </div>
              <Link to={`/roadmap/${career.id}`} className="btn-primary w-full mt-4 text-sm">
                View Roadmap <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
