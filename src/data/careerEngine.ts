import type {
  CareerPath,
  CareerAnalysis,
  StudentProfile,
  YearPlan,
  ProjectRecommendation,
  WeekPlan,
  SkillGap,
} from "../types";

const SKILL_KEYWORDS: Record<string, string[]> = {
  "Web Development": ["html", "css", "javascript", "react", "node", "fullstack", "frontend", "backend", "web", "api", "express", "next", "tailwind", "typescript"],
  "AI/ML": ["python", "ml", "ai", "machine learning", "deep learning", "tensorflow", "pytorch", "data science", "nlp", "computer vision", "scikit", "pandas", "numpy"],
  "Data": ["sql", "python", "excel", "tableau", "power bi", "data", "etl", "spark", "hadoop", "warehouse", "airflow", "dbt", "kafka"],
  "Cybersecurity": ["security", "network", "linux", "cryptography", "penetration", "owasp", "firewall", "ceh", "kali", "burp", "siem"],
  "Cloud": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "cloud", "ci/cd", "devops", "jenkins", "linux", "serverless"],
  "Mobile Development": ["flutter", "dart", "react native", "kotlin", "swift", "android", "ios", "mobile", "xcode", "jetpack"],
};

function normalize(arr: string[]): string[] {
  return arr.map((s) => s.trim().toLowerCase());
}

function countSkillMatches(skills: string[], domain: string): number {
  const lower = normalize(skills);
  const keywords = SKILL_KEYWORDS[domain] || [];
  let count = 0;
  for (const skill of lower) {
    if (keywords.some((kw) => skill.includes(kw) || kw.includes(skill))) {
      count++;
    }
  }
  return count;
}

const CAREER_TEMPLATES: Record<string, Omit<CareerPath, "matchPercentage" | "currentStrengths" | "skillGaps" | "whyFits">> = {
  "full-stack-developer": {
    id: "full-stack-developer",
    name: "Full Stack Developer",
    icon: "Code2",
    tagline: "Build end-to-end web applications from database to UI",
    explanation: "A versatile developer who works on both frontend and backend, creating complete web applications that millions of people can use.",
    difficulty: "Moderate",
    prepTime: "6–9 months focused learning",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Docker", "REST APIs", "GraphQL"],
    coreSkills: "JavaScript/TypeScript, React, Node.js, SQL, Git, System Design",
    recommendedFor: "Students who love building visible products and want versatility across the stack",
    jobPreparation: "Build a portfolio of 3–4 full-stack projects, practice DSA in JavaScript, mock interviews, system design basics",
    overview:
      "Full Stack Development is the art of building complete web applications — from pixel-perfect user interfaces to robust server logic and database management. You'll work across the entire technology stack, making you one of the most versatile and in-demand engineers in the industry. From startups to tech giants, full stack developers are the glue that holds product teams together.",
    yearByYear: [
      { year: "Year 1", focus: "Programming Fundamentals", topics: ["C/C++ or Python basics", "Data structures basics", "Git & GitHub", "HTML, CSS, JavaScript basics", "Build 2–3 small projects"], milestone: "Publish your first personal website on GitHub Pages" },
      { year: "Year 2", focus: "Core Web Development", topics: ["Advanced JavaScript (ES6+)", "React fundamentals", "REST APIs & fetch", "Database basics (SQL)", "Responsive design with Tailwind"], milestone: "Deploy a full-stack CRUD app with a real database" },
      { year: "Year 3", focus: "Advanced Development & Internship", topics: ["TypeScript", "System design basics", "Authentication & security", "Docker & deployment", "Build a major capstone project"], milestone: "Land a summer internship at a product company" },
      { year: "Year 4", focus: "Placement Preparation", topics: ["DSA problem-solving (LeetCode)", "System design interviews", "Resume & portfolio polish", "Mock interviews", "Company-specific prep"], milestone: "Secure a full-time SDE offer" },
    ],
    projects: [
      { title: "Task Management App", description: "A drag-and-drop kanban board with user authentication and real-time updates", difficulty: "Intermediate", technologies: ["React", "Node.js", "PostgreSQL", "Socket.io"] },
      { title: "E-Commerce Store", description: "Full storefront with cart, checkout, admin dashboard, and Stripe payments", difficulty: "Advanced", technologies: ["Next.js", "TypeScript", "Prisma", "Stripe"] },
      { title: "Real-Time Chat App", description: "WebSocket-based messaging with rooms, typing indicators, and message history", difficulty: "Intermediate", technologies: ["React", "Express", "Socket.io", "MongoDB"] },
      { title: "Personal Portfolio CMS", description: "A self-hosted portfolio with a custom CMS for managing projects and blog posts", difficulty: "Beginner", technologies: ["React", "Node.js", "SQLite"] },
    ],
    internshipPrep: [
      "Build and deploy 2 full-stack projects to GitHub with clean README files",
      "Master JavaScript fundamentals — closures, promises, async/await, event loop",
      "Practice 50+ DSA problems in JavaScript/Python on LeetCode (easy + medium)",
      "Learn SQL basics — joins, aggregations, indexes, and normalization",
      "Create a resume highlighting projects with measurable impact",
      "Contribute to one open-source repository to show collaboration skills",
    ],
    placementPrep: [
      "Solve 150+ DSA problems covering arrays, trees, graphs, DP, and system design",
      "Study system design: load balancing, caching, database sharding, microservices",
      "Do 10+ mock interviews with peers or platforms like Pramp",
      "Build a standout portfolio website showcasing 3–4 deployed projects",
      "Prepare behavioral answers using the STAR method for common questions",
      "Apply to 30+ companies — track each with a spreadsheet and follow up",
    ],
    thirtyDayPlan: [
      { week: "Week 1", learningGoals: ["Master JavaScript fundamentals and DOM manipulation", "Set up your development environment"], topics: ["Variables, functions, closures", "ES6+ features (arrow functions, destructuring, spread)", "DOM manipulation & events", "Git workflow — branches, merges, PRs"], miniTask: "Write a JavaScript quiz app with vanilla DOM manipulation", projectTask: "Clone a login/signup page with form validation in HTML/CSS/JS" },
      { week: "Week 2", learningGoals: ["Learn React fundamentals and component architecture", "Understand state management"], topics: ["JSX & components", "Props & state with hooks", "useEffect & lifecycle", "Conditional rendering & lists"], miniTask: "Build a todo app with add, edit, delete, and filter functionality", projectTask: "Create a weather dashboard consuming a public REST API" },
      { week: "Week 3", learningGoals: ["Build backend APIs with Node.js and Express", "Connect to a database"], topics: ["Express server setup", "REST API design", "PostgreSQL with Prisma ORM", "Authentication with JWT"], miniTask: "Create a REST API for a blog with CRUD operations", projectTask: "Build a full-stack note-taking app with React frontend and Express backend" },
      { week: "Week 4", learningGoals: ["Polish your full-stack project for deployment", "Start DSA practice"], topics: ["Docker basics & containerization", "Deploy to Vercel/Render", "DSA: arrays & strings (10 problems)", "Write a compelling README & polish GitHub profile"], miniTask: "Solve 10 LeetCode easy problems in JavaScript", projectTask: "Deploy your note-taking app with Docker and write a project case study" },
    ],
  },
  "ai-ml-engineer": {
    id: "ai-ml-engineer",
    name: "AI/ML Engineer",
    icon: "BrainCircuit",
    tagline: "Build intelligent systems that learn from data",
    explanation: "Design and deploy machine learning models that power recommendations, vision systems, NLP, and AI products used by millions.",
    difficulty: "Demanding",
    prepTime: "9–12 months focused learning",
    technologies: ["Python", "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "Jupyter", "Hugging Face", "Docker"],
    coreSkills: "Python, Linear Algebra, Statistics, ML algorithms, Deep Learning, MLOps",
    recommendedFor: "Students strong in math who are curious about how AI and intelligence work under the hood",
    jobPreparation: "Build ML portfolio projects, participate in Kaggle, study ML system design, practice ML interview rounds",
    overview:
      "AI/ML Engineering sits at the intersection of mathematics, statistics, and software engineering. You'll build models that can predict, classify, generate, and understand human language. From recommendation engines to autonomous systems, ML engineers create the intelligence layer of modern products. This path rewards curiosity, patience with experimentation, and a strong mathematical foundation.",
    yearByYear: [
      { year: "Year 1", focus: "Math & Programming Foundations", topics: ["Python programming", "Linear algebra basics", "Calculus & probability", "Statistics fundamentals", "NumPy & Pandas"], milestone: "Complete a data analysis project with visualization" },
      { year: "Year 2", focus: "Machine Learning Core", topics: ["Supervised learning algorithms", "Scikit-learn", "Model evaluation & metrics", "Feature engineering", "Data preprocessing pipelines"], milestone: "Achieve a Kaggle competition submission and build 2 ML models" },
      { year: "Year 3", focus: "Deep Learning & Specialization", topics: ["Neural networks with PyTorch/TensorFlow", "CNNs for computer vision", "RNNs & Transformers for NLP", "Model deployment with Flask/FastAPI", "Research paper reading"], milestone: "Deploy a deep learning model as a web API and land an ML internship" },
      { year: "Year 4", focus: "Advanced Topics & Placement", topics: ["MLOps & model lifecycle", "LLMs & fine-tuning", "ML system design", "Kaggle competitions", "Interview prep (ML + DSA)"], milestone: "Secure an ML engineer / data scientist role" },
    ],
    projects: [
      { title: "Image Classification Pipeline", description: "Build a CNN that classifies images with data augmentation and transfer learning", difficulty: "Intermediate", technologies: ["PyTorch", "TensorFlow", "NumPy", "Matplotlib"] },
      { title: "Sentiment Analysis API", description: "Train an NLP model on reviews and deploy it as a real-time REST API", difficulty: "Advanced", technologies: ["Hugging Face", "FastAPI", "Docker", "Transformers"] },
      { title: "Recommendation Engine", description: "Build a collaborative filtering recommender for movies or products", difficulty: "Intermediate", technologies: ["Python", "scikit-learn", "Pandas", "Surprise"] },
      { title: "LLM Fine-Tuning Project", description: "Fine-tune an open-source LLM on a custom dataset for a specific domain", difficulty: "Advanced", technologies: ["PyTorch", "Hugging Face", "LoRA", "WandB"] },
    ],
    internshipPrep: [
      "Complete 2+ Kaggle competitions and document your approach in notebooks",
      "Build an end-to-end ML pipeline: data → model → evaluation → deployment",
      "Master Python, NumPy, Pandas, and scikit-learn fundamentals",
      "Read and summarize 5 influential ML research papers",
      "Create a GitHub portfolio with well-documented ML projects",
      "Brush up on linear algebra, probability, and statistics basics",
    ],
    placementPrep: [
      "Study ML fundamentals deeply — bias-variance, regularization, gradient descent, optimization",
      "Practice ML system design: feature stores, model serving, monitoring, scaling",
      "Build 3+ portfolio projects covering vision, NLP, and tabular data",
      "Practice coding interviews in Python — DSA + ML coding rounds",
      "Stay current with LLMs, RAG, and modern AI architectures",
      "Prepare to explain your projects' math, trade-offs, and results clearly",
    ],
    thirtyDayPlan: [
      { week: "Week 1", learningGoals: ["Master Python for data science", "Understand data manipulation with Pandas"], topics: ["Python syntax, functions, OOP", "NumPy arrays & vectorized operations", "Pandas DataFrames — filtering, grouping, merging", "Matplotlib & Seaborn for data visualization"], miniTask: "Analyze a real dataset (e.g., Titanic) and create 5 meaningful visualizations", projectTask: "Build a data cleaning and exploration pipeline for a Kaggle dataset" },
      { week: "Week 2", learningGoals: ["Learn core ML algorithms and model evaluation", "Understand the ML workflow"], topics: ["Linear & logistic regression", "Decision trees & random forests", "Train/test split, cross-validation", "Precision, recall, F1, ROC-AUC"], miniTask: "Train a classification model and evaluate it with 3 different metrics", projectTask: "Build a house price prediction model using scikit-learn and document the full process" },
      { week: "Week 3", learningGoals: ["Dive into neural networks and deep learning", "Learn PyTorch or TensorFlow basics"], topics: ["Perceptrons & activation functions", "Backpropagation & gradient descent", "Building a simple neural network", "Training loops & loss functions"], miniTask: "Train a neural network on MNIST digit classification and achieve 95%+ accuracy", projectTask: "Build an image classifier using transfer learning with a pre-trained CNN" },
      { week: "Week 4", learningGoals: ["Deploy an ML model as an API", "Start your ML portfolio"], topics: ["FastAPI for model serving", "Model serialization with joblib/pickle", "Docker for ML deployment", "Writing an ML project README & case study"], miniTask: "Wrap your image classifier in a FastAPI endpoint and test it with curl", projectTask: "Deploy your ML model to a free hosting service and write a full project case study" },
    ],
  },
  "data-engineer": {
    id: "data-engineer",
    name: "Data Engineer",
    icon: "Database",
    tagline: "Build the pipelines that power data-driven decisions",
    explanation: "Design and maintain the infrastructure that collects, cleans, and delivers data at scale — the backbone of every data-driven organization.",
    difficulty: "Challenging",
    prepTime: "6–10 months focused learning",
    technologies: ["Python", "SQL", "Apache Spark", "Airflow", "Kafka", "dbt", "Snowflake", "AWS", "PostgreSQL"],
    coreSkills: "SQL, Python, ETL/ELT, Data Modeling, Cloud Platforms, Orchestration",
    recommendedFor: "Students who enjoy building systems and pipelines, and want to work with data at scale",
    jobPreparation: "Build ETL pipeline projects, learn cloud data tools, practice SQL deeply, understand data modeling",
    overview:
      "Data Engineering is about building the plumbing of the data world. You design pipelines that ingest, transform, and serve data reliably to analysts, scientists, and applications. Without data engineers, there is no data science, no analytics, no AI. You'll work with distributed systems, cloud platforms, and massive datasets, making this one of the most critical and well-paid roles in modern tech.",
    yearByYear: [
      { year: "Year 1", focus: "Data & Programming Foundations", topics: ["Python programming", "SQL fundamentals", "Excel & data basics", "Linux command line", "Git & version control"], milestone: "Build a data scraper and store results in a database" },
      { year: "Year 2", focus: "Databases & ETL Basics", topics: ["Advanced SQL (joins, window functions, CTEs)", "Data modeling (star schema, normalization)", "Python ETL scripts", "Pandas for data transformation", "Introduction to cloud (AWS S3, EC2)"], milestone: "Build an end-to-end ETL pipeline that loads data into a data warehouse" },
      { year: "Year 3", focus: "Big Data & Cloud Pipelines", topics: ["Apache Spark for distributed processing", "Airflow for pipeline orchestration", "Kafka for streaming data", "dbt for data transformation", "Cloud data warehouses (Snowflake/BigQuery)"], milestone: "Orchestrate a multi-stage pipeline with Airflow and land an internship" },
      { year: "Year 4", focus: "Advanced Topics & Placement", topics: ["Data architecture & governance", "Streaming pipelines (Spark Structured Streaming)", "System design for data systems", "Interview prep (SQL + Python + data modeling)", "Cloud certifications (AWS/Azure)"], milestone: "Secure a data engineer role at a data-driven company" },
    ],
    projects: [
      { title: "ETL Data Pipeline", description: "Extract data from a public API, transform it with Python, and load it into PostgreSQL on a schedule", difficulty: "Intermediate", technologies: ["Python", "Airflow", "PostgreSQL", "Docker"] },
      { title: "Real-Time Streaming Dashboard", description: "Stream events through Kafka, process with Spark, and visualize in real-time", difficulty: "Advanced", technologies: ["Kafka", "Apache Spark", "Python", "Elasticsearch"] },
      { title: "Data Warehouse Migration", description: "Model and build a dimensional data warehouse using dbt and Snowflake", difficulty: "Advanced", technologies: ["dbt", "Snowflake", "SQL", "Airflow"] },
      { title: "Web Scraper & Analytics Pipeline", description: "Scrape e-commerce data daily, store in S3, transform with Spark, and generate reports", difficulty: "Intermediate", technologies: ["Python", "BeautifulSoup", "AWS S3", "Pandas"] },
    ],
    internshipPrep: [
      "Master SQL — window functions, CTEs, performance optimization, and data modeling",
      "Build 2 ETL pipeline projects with proper documentation and scheduling",
      "Learn Python deeply — especially data libraries (Pandas, requests, SQLAlchemy)",
      "Get comfortable with at least one cloud platform (AWS recommended)",
      "Understand data warehousing concepts — star schema, slowly changing dimensions",
      "Set up a GitHub portfolio showing your pipeline architectures and SQL skills",
    ],
    placementPrep: [
      "Practice 100+ SQL problems (LeetCode, HackerRank) including complex joins and window functions",
      "Study data modeling deeply — Kimball, Data Vault, lakehouse architecture",
      "Build a portfolio with 3+ pipeline projects covering batch, streaming, and cloud",
      "Learn system design for data-intensive applications (Kafka, Spark, distributed systems)",
      "Get an AWS Solutions Architect or Azure Data Engineer certification",
      "Prepare to discuss data quality, pipeline observability, and scalability trade-offs",
    ],
    thirtyDayPlan: [
      { week: "Week 1", learningGoals: ["Master SQL fundamentals and advanced queries", "Set up your data engineering environment"], topics: ["SQL SELECT, WHERE, GROUP BY, HAVING", "JOINs (inner, left, full, cross)", "Subqueries & CTEs", "Window functions (ROW_NUMBER, RANK, LAG, LEAD)"], miniTask: "Solve 20 SQL problems on HackerRank (easy + medium)", projectTask: "Design a database schema for an e-commerce platform with 5+ related tables" },
      { week: "Week 2", learningGoals: ["Learn Python for data engineering", "Build your first ETL pipeline"], topics: ["Python file I/O & requests", "Pandas for data transformation", "SQLAlchemy for database connections", "ETL patterns — extract, transform, load"], miniTask: "Write a Python script that fetches data from a public API and saves it to CSV", projectTask: "Build an ETL pipeline: extract from an API, transform with Pandas, load into PostgreSQL" },
      { week: "Week 3", learningGoals: ["Learn data orchestration with Airflow", "Understand data warehousing"], topics: ["Airflow DAGs, operators, and scheduling", "Data warehouse concepts (star schema, fact/dimension tables)", "dbt for SQL transformations", "Cloud basics — AWS S3 and RDS"], miniTask: "Write an Airflow DAG that runs your ETL pipeline on a daily schedule", projectTask: "Build a dimensional data warehouse: design star schema, load with dbt, query with SQL" },
      { week: "Week 4", learningGoals: ["Explore big data processing with Spark", "Polish your portfolio"], topics: ["PySpark DataFrames & transformations", "Spark SQL for distributed queries", "Docker for data pipeline deployment", "Writing pipeline documentation & architecture diagrams"], miniTask: "Process a large CSV dataset with PySpark and compute aggregations", projectTask: "Containerize your ETL pipeline with Docker and document the full architecture in a README" },
    ],
  },
};

function computeMatch(profile: StudentProfile, careerId: string): number {
  const baseMatch: Record<string, number> = {
    "full-stack-developer": 72,
    "ai-ml-engineer": 68,
    "data-engineer": 70,
  };

  let match = baseMatch[careerId] || 65;

  const domainToCareer: Record<string, string> = {
    "Web Development": "full-stack-developer",
    "AI/ML": "ai-ml-engineer",
    Data: "data-engineer",
  };

  const preferredCareer = domainToCareer[profile.domain];
  if (preferredCareer === careerId) {
    match += 15;
  }

  const skillMatches = countSkillMatches(profile.skills, profile.domain);
  match += Math.min(skillMatches * 3, 12);

  const expBoost: Record<string, number> = { Beginner: 0, Intermediate: 3, Advanced: 6 };
  match += expBoost[profile.experience] || 0;

  const hoursBoost: Record<string, number> = { "5 hours": 0, "10 hours": 2, "15 hours": 4, "20+ hours": 6 };
  match += hoursBoost[profile.weeklyHours] || 0;

  const interestMatches = countSkillMatches(profile.interests, profile.domain);
  match += Math.min(interestMatches * 2, 6);

  return Math.min(Math.round(match), 98);
}

function getCurrentStrengths(profile: StudentProfile, careerId: string): string[] {
  const career = CAREER_TEMPLATES[careerId];
  const careerKeywords = career.technologies.map((t) => t.toLowerCase());
  const allSkills = [...profile.skills, ...profile.interests];
  const strengths: string[] = [];

  for (const skill of allSkills) {
    const lower = skill.toLowerCase();
    if (careerKeywords.some((kw) => lower.includes(kw) || kw.includes(lower))) {
      strengths.push(skill.trim());
    }
  }

  if (strengths.length === 0) {
    if (profile.experience !== "Beginner") {
      strengths.push("Prior programming experience");
    }
    if (profile.skills.length > 3) {
      strengths.push("Broad skill foundation across multiple areas");
    }
  }

  if (strengths.length < 2) {
    strengths.push("Strong learning momentum and willingness to grow");
  }

  return strengths.slice(0, 5);
}

function getSkillGaps(profile: StudentProfile, careerId: string): SkillGap[] {
  const career = CAREER_TEMPLATES[careerId];
  const userSkills = normalize([...profile.skills, ...profile.interests]);
  const gaps: SkillGap[] = [];

  for (const tech of career.technologies) {
    const lower = tech.toLowerCase();
    const hasSkill = userSkills.some((s) => s.includes(lower) || lower.includes(s));
    if (!hasSkill) {
      const importance: SkillGap["importance"] =
        career.technologies.indexOf(tech) < 3 ? "Critical" : career.technologies.indexOf(tech) < 6 ? "Important" : "Beneficial";
      gaps.push({ skill: tech, importance });
    }
  }

  return gaps.slice(0, 8);
}

function getWhyFits(profile: StudentProfile, careerId: string): string[] {
  const career = CAREER_TEMPLATES[careerId];
  const reasons: string[] = [];

  const domainToCareer: Record<string, string> = {
    "Web Development": "full-stack-developer",
    "AI/ML": "ai-ml-engineer",
    Data: "data-engineer",
  };

  if (domainToCareer[profile.domain] === careerId) {
    reasons.push(`Your preferred domain is ${profile.domain}, which aligns directly with this career path`);
  }

  const skillMatches = countSkillMatches(profile.skills, career.name.includes("Full") ? "Web Development" : career.name.includes("AI") ? "AI/ML" : "Data");
  if (skillMatches >= 2) {
    reasons.push(`You already have ${skillMatches}+ relevant skills that overlap with this career's core technologies`);
  }

  if (profile.experience !== "Beginner") {
    reasons.push(`Your ${profile.experience.toLowerCase()} experience level gives you a head start on the learning curve`);
  }

  if (profile.weeklyHours === "20+ hours" || profile.weeklyHours === "15 hours") {
    reasons.push(`Your ${profile.weeklyHours} weekly learning commitment allows you to follow the roadmap effectively`);
  }

  const interestMatches = countSkillMatches(profile.interests, career.name.includes("Full") ? "Web Development" : career.name.includes("AI") ? "AI/ML" : "Data");
  if (interestMatches >= 1) {
    reasons.push("Your stated interests show genuine curiosity about this field's core problems");
  }

  if (profile.goal === "Internship") {
    reasons.push("This career path has strong internship opportunities starting from Year 3");
  } else if (profile.goal === "Placement") {
    reasons.push("This career has excellent campus placement prospects with high demand");
  }

  if (reasons.length < 2) {
    reasons.push("This career offers strong growth potential and is in high demand across the industry");
    reasons.push("The roadmap can be adapted to your current skill level and pace");
  }

  return reasons.slice(0, 4);
}

function generateCareer(profile: StudentProfile, careerId: string): CareerPath {
  const template = CAREER_TEMPLATES[careerId];
  return {
    ...template,
    matchPercentage: computeMatch(profile, careerId),
    currentStrengths: getCurrentStrengths(profile, careerId),
    skillGaps: getSkillGaps(profile, careerId),
    whyFits: getWhyFits(profile, careerId),
  };
}

export function generateAnalysis(profile: StudentProfile): CareerAnalysis {
  const careerIds = ["full-stack-developer", "ai-ml-engineer", "data-engineer"];
  const careers = careerIds
    .map((id) => generateCareer(profile, id))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    profile,
    careers,
    generatedAt: new Date().toISOString(),
  };
}

export const CAREER_LIBRARY = CAREER_TEMPLATES;
