# CareerPath AI

AI-powered career path simulator that analyzes a student's profile and generates three personalized, explainable career recommendations with roadmaps, project ideas, and action plans.

---

## Problem Statement

Students often struggle to decide which technology career fits their skills, interests and goals. With dozens of domains — web development, AI/ML, data engineering, cloud, cybersecurity, and more — choosing a direction feels overwhelming. Most advice is generic, and existing tools don't explain *why* a particular career was recommended or show *what the journey looks like* month by month.

## Solution

CareerPath AI analyzes a student's profile — skills, interests, year of study, preferred domain, experience level, career goal, and weekly time commitment — and simulates three realistic career futures. Each recommendation comes with a transparent match score, a breakdown of *why* that score was given, a year-by-year roadmap, recommended projects, and a 30-day action plan to start immediately.

Students can also explore a "What If I Choose This Career?" simulation that visualizes their 12-month transformation from current skills to career-ready, and try the entire app instantly with demo profiles — no signup required.

---

## Key Features

- **AI Career Recommendations** — An AI engine evaluates the student's profile against career requirements and generates three personalized career paths sorted by match score.
- **Three Career Paths** — Every analysis produces three distinct career options so students can compare and choose.
- **Match Score** — Each career shows an overall match percentage (0–100) computed from the student's profile.
- **Explainable Recommendations** — Every match score is broken down into four sub-scores — Skill Match, Interest Match, Goal Match, and Experience Match — displayed as animated progress bars. A "Why This Career?" section lists 3–5 specific reasons based on the student's actual profile.
- **Skill Gap Analysis** — Identifies which technologies and skills the student already has and which ones they still need to learn, categorized by importance (Critical, Important, Beneficial).
- **Year-by-Year Roadmap** — A detailed learning plan from Year 1 through graduation, with focus areas, topics, and milestones for each year.
- **Project Recommendations** — Four hands-on project ideas per career with difficulty levels and technology stacks, so students can build a portfolio.
- **Career Comparison** — Side-by-side comparison table of all three career paths across match score, difficulty, core skills, prep time, technologies, and more.
- **30-Day Action Plan** — A week-by-week breakdown of learning goals, topics, mini-tasks, and project tasks to start building skills immediately.
- **Career Simulation** — A "What If I Choose This Career?" timeline that visualizes the student's 12-month journey across four quarters — skills, projects, advanced skills & internship prep, and interview & placement prep — with a transformation bar showing Current Skills → Required Skills → Career Ready.
- **Demo Mode** — Three sample student profiles (Web Development, AI/ML, Data Engineering) let visitors try the full app instantly without filling out a form. Demo data is clearly labeled as sample data throughout.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Engine | AI API (Anthropic Claude) via server proxy |
| Backend | REST API (Vite dev server plugin + Supabase Edge Functions) |
| Icons | Lucide React |
| Routing | React Router DOM |
| Hosting | GitHub Pages / Netlify / Vercel |
| Version Control | Git & GitHub |

---

## How It Works

### 1. Build Your Profile

The student fills out a guided 4-step form:

- **Step 1 — About You:** Name and current year of study
- **Step 2 — Skills & Interests:** Add skills (e.g., Python, React, SQL) and interests (e.g., AI/ML, Web Development) with quick-add suggestions
- **Step 3 — Preferences:** Preferred domain, experience level (Beginner / Intermediate / Advanced), and career goal (Internship / Placement / Higher Studies / Entrepreneurship / Not Sure)
- **Step 4 — Learning:** Weekly time commitment (5 / 10 / 15 / 20+ hours)

### 2. AI Analysis

The profile is sent to the AI engine, which:

1. Evaluates the student's skills against each career's core technologies
2. Assesses interest alignment with the career domain
3. Checks how well the student's goal matches the career path
4. Considers experience level and available learning time
5. Generates three personalized career paths with match scores, sub-score breakdowns, skill gaps, roadmaps, projects, and preparation guides

If the AI service is temporarily unavailable, the app falls back to a local career engine that computes match scores using keyword-based skill matching, domain alignment, and goal/experience heuristics — so the app always works.

### 3. Explore Your Results

The results page shows:

- A profile summary with all submitted information
- Three career cards, each with:
  - Overall match percentage
  - **Match breakdown** with animated bars (Skill, Interest, Goal, Experience)
  - **"Why This Career?"** section with 3–5 specific reasons
  - Current strengths and skill gaps
  - Difficulty level and estimated prep time

### 4. Dive Deeper

From each career card, students can:

- **View Roadmap** — A detailed page with career overview, year-by-year roadmap, technologies to learn, recommended projects, internship prep, placement prep, and a 30-day action plan preview
- **What If I Choose This?** — A 12-month simulation timeline showing the transformation from current skills to career-ready
- **Compare Careers** — Side-by-side comparison of all three paths
- **30-Day Action Plan** — A detailed week-by-week plan to start building skills today

### 5. Try Demo Mode

Visitors can skip the form entirely and try the app with one of three pre-built sample student profiles. Demo results are generated locally and clearly labeled as sample data.

---

## Future Scope

- **Job Recommendation** — Match students to real job openings based on their profile and career path
- **LinkedIn Profile Analysis** — Import skills and experience directly from a LinkedIn profile URL
- **Resume Integration** — Upload a resume and auto-extract skills, projects, and experience
- **Live Job Market Data** — Show real-time demand, salary ranges, and trending technologies for each career
- **Skill Progress Tracking** — Let students log completed courses, projects, and skills, and track their progress toward career readiness over time

---

## Team

| Name | Role | Contact |
|---|---|---|
| [Team Member 1] | Frontend Developer | [email@example.com] |
| [Team Member 2] | AI / Backend Developer | [email@example.com] |
| [Team Member 3] | UI/UX Designer | [email@example.com] |
| [Team Member 4] | Project Manager | [email@example.com] |

> _Replace the placeholders above with your team members' details._

---

## Screenshots

> _Add screenshots of the application here._

**Landing Page**
![Landing Page](screenshots/landing-page.png)

**Profile Form**
![Profile Form](screenshots/profile-form.png)

**Results — Career Cards with Match Breakdown**
![Results Page](screenshots/results-page.png)

**Career Roadmap**
![Roadmap Page](screenshots/roadmap-page.png)

**Career Simulation Timeline**
![Career Simulation](screenshots/career-simulation.png)

**Compare Careers**
![Compare Page](screenshots/compare-page.png)

**30-Day Action Plan**
![Action Plan](screenshots/action-plan.png)

**Demo Mode**
![Demo Mode](screenshots/demo-mode.png)

> _Place screenshot images in a `screenshots/` directory at the project root._

---

## Live Demo

> **[https://careerpath-ai.example.com](https://careerpath-ai.example.com)**

> _Replace the URL above with your deployed application link._

---

## Repository

**GitHub:** [https://github.com/your-username/careerpath-ai](https://github.com/your-username/careerpath-ai)

> _Replace the URL above with your actual GitHub repository link._

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/careerpath-ai.git
cd careerpath-ai

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

### Environment Variables

Create a `.env` file in the project root:

```
AI_API_KEY=your-api-key
AI_BASE_URL=https://api.anthropic.com
AI_MODEL=claude-haiku-4-5-20251001
```

> The app works without AI keys — it falls back to a local career engine automatically.

---

## License

This project is licensed under the MIT License.
