import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  Code,
  Heart,
  Layers,
  Gauge,
  Target,
  Clock,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { generateAnalysis } from "../data/careerEngine";
import type {
  StudentProfile,
  YearOfStudy,
  Domain,
  ExperienceLevel,
  CareerGoal,
  WeeklyHours,
} from "../types";

const STEPS = [
  { title: "About You", icon: User },
  { title: "Skills & Interests", icon: Code },
  { title: "Preferences", icon: Target },
  { title: "Learning", icon: Clock },
];

const YEARS: YearOfStudy[] = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];
const DOMAINS: Domain[] = ["Web Development", "AI/ML", "Data", "Cybersecurity", "Cloud", "Mobile Development", "Other"];
const EXPERIENCE: ExperienceLevel[] = ["Beginner", "Intermediate", "Advanced"];
const GOALS: CareerGoal[] = ["Internship", "Placement", "Higher Studies", "Entrepreneurship", "Not Sure"];
const HOURS: WeeklyHours[] = ["5 hours", "10 hours", "15 hours", "20+ hours"];

const SKILL_SUGGESTIONS = ["Python", "JavaScript", "Java", "C++", "React", "SQL", "HTML/CSS", "Node.js", "Git", "Data Structures", "Machine Learning", "TensorFlow", "AWS", "Docker", "TypeScript", "Flutter"];
const INTEREST_SUGGESTIONS = ["Web Development", "AI/ML", "Data Science", "Cybersecurity", "Cloud Computing", "Mobile Apps", "Game Development", "IoT", "Blockchain", "UI/UX Design", "Open Source", "Competitive Programming"];

export default function ProfileForm() {
  const navigate = useNavigate();
  const { setProfile, setAnalysis } = useApp();
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const [name, setName] = useState("");
  const [year, setYear] = useState<YearOfStudy | "">("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [domain, setDomain] = useState<Domain | "">("");
  const [experience, setExperience] = useState<ExperienceLevel | "">("");
  const [goal, setGoal] = useState<CareerGoal | "">("");
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHours | "">("");

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return name.trim().length > 0 && year !== "";
      case 1: return skills.length > 0 && interests.length > 0;
      case 2: return domain !== "" && experience !== "" && goal !== "";
      case 3: return weeklyHours !== "";
      default: return false;
    }
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
    }
    setInterestInput("");
  };

  const handleSubmit = () => {
    setAnalyzing(true);
    const profile: StudentProfile = {
      name: name.trim(),
      year: year as YearOfStudy,
      skills,
      interests,
      domain: domain as Domain,
      experience: experience as ExperienceLevel,
      goal: goal as CareerGoal,
      weeklyHours: weeklyHours as WeeklyHours,
    };

    setTimeout(() => {
      const result = generateAnalysis(profile);
      setProfile(profile);
      setAnalysis(result);
      navigate("/results");
    }, 2800);
  };

  if (analyzing) {
    return <AnalyzingScreen name={name} />;
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Build Your Profile</h1>
        <p className="text-navy-300">Tell us about yourself so we can find your ideal career paths</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isDone = i < step;
            const isActive = i === step;
            return (
              <div key={s.title} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isDone
                        ? "bg-gradient-to-br from-accent-400 to-navy-500 text-white"
                        : isActive
                        ? "bg-gradient-to-br from-navy-500 to-accent-500 text-white ring-4 ring-accent-500/20"
                        : "bg-white/5 text-navy-400 border border-white/10"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${isActive || isDone ? "text-white" : "text-navy-400"}`}>
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 rounded-full bg-white/10 relative overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-accent-400 to-navy-400 transition-all duration-500 ${
                        isDone ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-400 to-navy-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-card p-6 sm:p-8" style={{ animation: "fadeInUp 0.4s ease-out" }}>
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-100 mb-3">
                <User className="w-4 h-4 text-accent-400" /> Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-navy-400 focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-100 mb-3">
                <GraduationCap className="w-4 h-4 text-accent-400" /> Current Year of Study
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      year === y
                        ? "bg-gradient-to-r from-navy-500 to-accent-500 text-white"
                        : "bg-white/5 text-navy-200 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-100 mb-3">
                <Code className="w-4 h-4 text-accent-400" /> Your Skills
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))}
                  placeholder="Type a skill and press Enter"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-navy-400 focus:outline-none focus:border-accent-400 transition-all"
                />
                <button onClick={() => addSkill(skillInput)} className="px-4 py-2.5 rounded-xl bg-accent-500/20 text-accent-300 border border-accent-500/20 hover:bg-accent-500/30 transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-500/15 text-accent-200 text-sm border border-accent-500/20">
                      {s}
                      <button onClick={() => setSkills(skills.filter((x) => x !== s))} className="hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                  <button
                    key={s}
                    onClick={() => addSkill(s)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-navy-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-100 mb-3">
                <Heart className="w-4 h-4 text-accent-400" /> Your Interests
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest(interestInput))}
                  placeholder="Type an interest and press Enter"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-navy-400 focus:outline-none focus:border-accent-400 transition-all"
                />
                <button onClick={() => addInterest(interestInput)} className="px-4 py-2.5 rounded-xl bg-navy-500/20 text-navy-300 border border-navy-500/20 hover:bg-navy-500/30 transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {interests.map((i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-500/15 text-navy-200 text-sm border border-navy-500/20">
                      {i}
                      <button onClick={() => setInterests(interests.filter((x) => x !== i))} className="hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {INTEREST_SUGGESTIONS.filter((s) => !interests.includes(s)).slice(0, 8).map((s) => (
                  <button
                    key={s}
                    onClick={() => addInterest(s)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-navy-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-100 mb-3">
                <Layers className="w-4 h-4 text-accent-400" /> Preferred Domain
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DOMAINS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      domain === d
                        ? "bg-gradient-to-r from-navy-500 to-accent-500 text-white"
                        : "bg-white/5 text-navy-200 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-100 mb-3">
                <Gauge className="w-4 h-4 text-accent-400" /> Experience Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {EXPERIENCE.map((e) => (
                  <button
                    key={e}
                    onClick={() => setExperience(e)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      experience === e
                        ? "bg-gradient-to-r from-navy-500 to-accent-500 text-white"
                        : "bg-white/5 text-navy-200 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-100 mb-3">
                <Target className="w-4 h-4 text-accent-400" /> Career Goal
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      goal === g
                        ? "bg-gradient-to-r from-navy-500 to-accent-500 text-white"
                        : "bg-white/5 text-navy-200 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-100 mb-3">
                <Clock className="w-4 h-4 text-accent-400" /> Weekly Learning Time
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    onClick={() => setWeeklyHours(h)}
                    className={`px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                      weeklyHours === h
                        ? "bg-gradient-to-r from-navy-500 to-accent-500 text-white"
                        : "bg-white/5 text-navy-200 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-400" /> Profile Summary
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-navy-400">Name:</span> <span className="text-white">{name}</span></div>
                <div><span className="text-navy-400">Year:</span> <span className="text-white">{year}</span></div>
                <div><span className="text-navy-400">Domain:</span> <span className="text-white">{domain}</span></div>
                <div><span className="text-navy-400">Experience:</span> <span className="text-white">{experience}</span></div>
                <div><span className="text-navy-400">Goal:</span> <span className="text-white">{goal}</span></div>
                <div><span className="text-navy-400">Hours/week:</span> <span className="text-white">{weeklyHours}</span></div>
                <div className="col-span-2"><span className="text-navy-400">Skills:</span> <span className="text-white">{skills.join(", ")}</span></div>
                <div className="col-span-2"><span className="text-navy-400">Interests:</span> <span className="text-white">{interests.join(", ")}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              step === 0 ? "opacity-30 cursor-not-allowed" : "text-navy-200 hover:text-white hover:bg-white/5"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                canProceed()
                  ? "bg-gradient-to-r from-navy-500 to-accent-500 text-white hover:shadow-lg hover:shadow-navy-500/30 hover:-translate-y-0.5"
                  : "bg-white/5 text-navy-400 cursor-not-allowed"
              }`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                canProceed()
                  ? "bg-gradient-to-r from-accent-400 to-navy-400 text-white hover:shadow-lg hover:shadow-accent-500/30 hover:-translate-y-0.5"
                  : "bg-white/5 text-navy-400 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-4 h-4" /> Analyze My Career
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalyzingScreen({ name }: { name: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="text-center max-w-md">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-400 border-r-navy-400 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-navy-500/30 to-accent-500/30 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-accent-300 animate-pulse" />
          </div>
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">
          Analyzing your profile{name ? `, ${name}` : ""}...
        </h2>
        <p className="text-navy-300 mb-8">
          Our AI is evaluating your skills, interests, and goals to find your best career matches
        </p>
        <div className="space-y-3">
          {["Evaluating skill profiles", "Matching career patterns", "Generating personalized roadmaps"].map((text, i) => (
            <div
              key={text}
              className="flex items-center gap-3 text-sm text-navy-200"
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.6}s both` }}
            >
              <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-400" />
              </div>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
