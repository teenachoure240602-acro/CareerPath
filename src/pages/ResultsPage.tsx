import { Link } from "react-router-dom";
import { Sparkles, GitCompare, CalendarDays, User, GraduationCap, Code, Target, Clock, Layers, Gauge, FlaskConical, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import CareerCard from "../components/CareerCard";

export default function ResultsPage() {
  const { analysis, isDemo } = useApp();

  if (!analysis) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <Sparkles className="w-12 h-12 text-navy-400 mx-auto mb-4" />
        <h1 className="font-display font-bold text-2xl text-white mb-3">No Analysis Yet</h1>
        <p className="text-navy-300 mb-6">Complete your profile to see your personalized career paths.</p>
        <Link to="/profile" className="btn-primary">Build My Profile</Link>
      </div>
    );
  }

  const { profile, careers } = analysis;

  const profileItems = [
    { icon: User, label: "Name", value: profile.name },
    { icon: GraduationCap, label: "Year", value: profile.year },
    { icon: Layers, label: "Domain", value: profile.domain },
    { icon: Gauge, label: "Experience", value: profile.experience },
    { icon: Target, label: "Goal", value: profile.goal },
    { icon: Clock, label: "Hours/week", value: profile.weeklyHours },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 mb-4">
          <Sparkles className="w-4 h-4 text-accent-400" />
          <span className="text-sm text-accent-300">Analysis Complete</span>
        </div>
        <h1 className="font-display font-bold text-4xl text-white mb-3">Your AI Career Analysis</h1>
        <p className="text-navy-300 text-lg">Three personalized career paths based on your profile</p>
      </div>

      {/* Demo Data Banner */}
      {isDemo && (
        <div
          id="demo-banner"
          className="glass-card p-5 mb-8 border-amber-500/20 flex flex-col sm:flex-row items-center gap-4"
          style={{ animation: "fadeInUp 0.4s ease-out" }}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0">
            <FlaskConical className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display font-semibold text-white mb-0.5">You're viewing sample data</h2>
            <p className="text-sm text-navy-300">
              This is a demo profile showing how the analysis looks. Build your own profile for personalized results.
            </p>
          </div>
          <Link to="/profile" className="btn-primary text-sm shrink-0 group">
            Build My Own Profile
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* Profile Summary */}
      <div className="glass-card p-6 mb-10" style={{ animation: "fadeInUp 0.5s ease-out" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-white flex items-center gap-2">
            <User className="w-5 h-5 text-accent-400" /> Profile Summary
          </h2>
          {isDemo && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/20 font-medium">
              Sample Profile
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {profileItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-white/5 rounded-xl p-3">
                <Icon className="w-4 h-4 text-navy-400 mb-1.5" />
                <div className="text-xs text-navy-400">{item.label}</div>
                <div className="text-sm text-white font-medium">{item.value}</div>
              </div>
            );
          })}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-accent-400" />
              <span className="text-xs text-navy-400">Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-accent-500/15 text-accent-200 border border-accent-500/20">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-navy-300" />
              <span className="text-xs text-navy-400">Interests</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-navy-500/15 text-navy-200 border border-navy-500/20">{i}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Career Path Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {careers.map((career, i) => (
          <CareerCard key={career.id} career={career} rank={i} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/compare" className="btn-secondary group">
          <GitCompare className="w-4 h-4" /> Compare All Careers
        </Link>
        <Link to={`/action-plan/${careers[0].id}`} className="btn-primary group">
          <CalendarDays className="w-4 h-4" /> View 30-Day Action Plan
        </Link>
      </div>
    </div>
  );
}
