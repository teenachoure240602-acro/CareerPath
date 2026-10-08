import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  BrainCircuit,
  Database,
  Sparkles,
  UserPlus,
  Cpu,
  Map as MapIcon,
  GitCompare,
  CalendarDays,
  Rocket,
  TrendingUp,
  Wand2,
  FlaskConical,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { DEMO_PROFILES } from "../data/demoProfiles";
import { generateAnalysis } from "../data/careerEngine";
import { getCareerIcon } from "../utils/careerIcons";

const FEATURE_CAREERS = [
  {
    icon: Code2,
    name: "Full Stack Developer",
    desc: "Build complete web applications from database to pixel-perfect UI. The most versatile engineering role.",
    gradient: "from-navy-500 to-navy-700",
  },
  {
    icon: BrainCircuit,
    name: "AI/ML Engineer",
    desc: "Design intelligent systems that learn from data. Power recommendations, vision, and language models.",
    gradient: "from-accent-500 to-accent-700",
  },
  {
    icon: Database,
    name: "Data Engineer",
    desc: "Build the pipelines and infrastructure that power data-driven decisions at scale across organizations.",
    gradient: "from-navy-600 to-accent-600",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: "Tell us about yourself",
    desc: "Share your skills, interests, year of study, preferred domain, and career goals through a guided form.",
  },
  {
    icon: Cpu,
    title: "AI analyzes your profile",
    desc: "Our AI engine evaluates your strengths, identifies skill gaps, and matches you to the best career paths.",
  },
  {
    icon: MapIcon,
    title: "Get your personalized roadmap",
    desc: "Receive three career paths with match scores, year-by-year roadmaps, projects, and a 30-day action plan.",
  },
];

const FEATURES = [
  { icon: Sparkles, title: "AI-Powered Analysis", desc: "Smart matching algorithm evaluates your profile against career requirements" },
  { icon: MapIcon, title: "Year-by-Year Roadmaps", desc: "Detailed learning paths from Year 1 through graduation, tailored to each career" },
  { icon: GitCompare, title: "Compare Careers", desc: "Side-by-side comparison of match scores, difficulty, and skills across all paths" },
  { icon: CalendarDays, title: "30-Day Action Plan", desc: "Weekly breakdown of learning goals, topics, and projects to start immediately" },
  { icon: Rocket, title: "Internship & Placement Prep", desc: "Targeted preparation guides for landing internships and full-time roles" },
  { icon: TrendingUp, title: "Project Recommendations", desc: "Hands-on project ideas with technologies and difficulty levels for your portfolio" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { setProfile, setAnalysis, setIsDemo } = useApp();
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const handleDemoSelect = (demoId: string) => {
    const demo = DEMO_PROFILES.find((d) => d.id === demoId);
    if (!demo) return;
    setDemoLoading(demoId);
    const result = generateAnalysis(demo.profile);
    setProfile(demo.profile);
    setAnalysis(result);
    setIsDemo(true);
    setTimeout(() => navigate("/results"), 800);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span className="text-sm text-navy-200">AI-Powered Career Path Simulator</span>
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
            Three Futures.
            <br />
            <span className="gradient-text">One Student.</span>
          </h1>

          <p className="text-lg sm:text-xl text-navy-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover the career paths that fit your skills, interests and goals — powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/profile" className="btn-primary text-lg px-8 py-4 group">
              Explore My Career Paths
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              How It Works
            </a>
          </div>
        </div>

        {/* Career Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {FEATURE_CAREERS.map((career, i) => {
            const Icon = career.icon;
            return (
              <div
                key={career.name}
                className="glass-card p-6 hover:-translate-y-2 transition-all duration-300 group"
                style={{ animation: `fadeInUp 0.6s ease-out ${0.2 + i * 0.15}s both` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${career.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{career.name}</h3>
                <p className="text-sm text-navy-300 leading-relaxed">{career.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Mode Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300">No signup needed</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Try a Demo Profile</h2>
          <p className="text-navy-300 text-lg max-w-2xl mx-auto">
            See how it works instantly with a sample student profile. No form to fill — just pick one and explore.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {DEMO_PROFILES.map((demo, i) => {
            const Icon = getCareerIcon(demo.icon);
            const isLoading = demoLoading === demo.id;
            return (
              <button
                key={demo.id}
                onClick={() => handleDemoSelect(demo.id)}
                disabled={demoLoading !== null}
                className="glass-card p-6 text-left hover:-translate-y-2 transition-all duration-300 group disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.12}s both` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${demo.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{demo.label}</h3>
                <p className="text-sm text-navy-300 leading-relaxed mb-4">{demo.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {demo.profile.skills.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-navy-300 border border-white/10">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-accent-300 group-hover:text-accent-200 transition-colors">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-accent-400/30 border-t-accent-400 animate-spin" />
                      Loading demo...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Try this profile
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-navy-400 mt-6">
          Demo profiles use sample data labeled throughout the app. Results are generated locally and work even without AI service availability.
        </p>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl text-white mb-4">How It Works</h2>
          <p className="text-navy-300 text-lg">Three simple steps to your personalized career roadmap</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <div
                  className="glass-card p-8 text-center hover:card-glow transition-all duration-300"
                  style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.15}s both` }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-500 to-accent-500 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-accent-400 mb-2">STEP {i + 1}</div>
                  <h3 className="font-display font-bold text-xl text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-navy-300 leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-navy-500/50 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl text-white mb-4">Everything You Need</h2>
          <p className="text-navy-300 text-lg">A complete career planning platform built for students</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card p-6 hover:bg-white/[0.07] transition-all duration-300"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-navy-300 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="glass-card p-12 text-center relative overflow-hidden card-glow">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-500 via-accent-400 to-navy-500" />
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Ready to Discover Your Career Path?
          </h2>
          <p className="text-navy-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who've found their direction. It takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/profile" className="btn-primary text-lg px-8 py-4 group">
              Start Your Analysis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#demo" className="btn-secondary text-lg px-8 py-4">
              <FlaskConical className="w-5 h-5" /> Try a Demo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
