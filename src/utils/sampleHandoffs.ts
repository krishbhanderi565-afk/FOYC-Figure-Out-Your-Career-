export interface SampleHandoffOption {
  id: string;
  title: string;
  role: string;
  badge: string;
  rawText: string;
}

export const SAMPLE_HANDOFFS: SampleHandoffOption[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer (Full-Stack & Systems)',
    role: 'Full-Stack Software Engineer',
    badge: 'Tech & Engineering',
    rawText: `FOYC_DASHBOARD_START
{
  "schema_version": "foyc_dashboard_v2",
  "profile": {
    "preferred_name": "Alex Chen",
    "country": "Global",
    "current_education_or_profession": "Computer Science & Engineering",
    "current_career_stage": "Career Switcher / Final Year",
    "work_experience": "Personal software projects and coursework",
    "current_field": "Software Development"
  },
  "career_direction": {
    "primary_career_direction": "Full-Stack Software Engineer",
    "career_description": "Architecting resilient web applications, end-to-end TypeScript systems, scalable REST/GraphQL APIs, and transactional database layers.",
    "why_this_direction_was_suggested": "Strong logical problem-solving aptitude, desire for tangible feedback loops, and high market demand for reliable product builders.",
    "key_responsibilities": [
      "Design and maintain scalable web application architectures",
      "Implement secure authentication, authorization, and transactional database schemas",
      "Write high-coverage automated unit and integration tests",
      "Deploy containerized microservices and manage continuous integration pipelines"
    ],
    "expected_opportunities": [
      "Mid-level Full-Stack Engineer at venture-backed product startups",
      "Frontend Architecture Specialist",
      "Backend API & Distributed Systems Engineer"
    ],
    "alternative_career_paths": [
      {
        "title": "Backend Systems Engineer",
        "description": "Deeper focus on concurrency, distributed queues, and low-latency storage engines",
        "overlap_score": 88
      },
      {
        "title": "DevOps & Cloud Platform Engineer",
        "description": "Specializing in Kubernetes, Terraform, cloud infrastructure, and CI/CD pipelines",
        "overlap_score": 75
      }
    ],
    "important_trade_offs": [
      "Requires constant continuous learning as web frameworks evolve rapidly",
      "Balancing rapid feature delivery with architectural tech-debt"
    ],
    "confidence_level": "High (96%)"
  },
  "strengths_and_skills": {
    "existing_strengths": [
      "First-principles algorithmic thinking",
      "Structured debugging and root-cause analysis",
      "Clean TypeScript code hygiene and typed interfaces"
    ],
    "transferable_skills": [
      "Technical writing and documentation",
      "Git version control and collaborative code review",
      "Performance profiling and optimization"
    ],
    "current_technical_skills": [
      "TypeScript",
      "React 19",
      "Node.js",
      "PostgreSQL",
      "Git & GitHub"
    ],
    "current_professional_skills": [
      "Agile workflow estimation",
      "Async team communication",
      "System design trade-off analysis"
    ],
    "skills_to_improve": [
      "PostgreSQL query optimization with EXPLAIN ANALYZE",
      "Distributed background queues with Redis / BullMQ",
      "Dockerized container orchestration"
    ]
  },
  "skill_gaps": [
    {
      "skill_name": "Relational Indexing & Query Tuning",
      "current_level": "Beginner",
      "target_level": "Advanced",
      "priority": "High",
      "explanation": "Production databases slow down without composite indexes and efficient query plans.",
      "recommended_learning_order": 1
    },
    {
      "skill_name": "Containerization & Docker Multi-stage Builds",
      "current_level": "Beginner",
      "target_level": "Intermediate",
      "priority": "High",
      "explanation": "Essential for reproducible deployment across cloud environments.",
      "recommended_learning_order": 2
    },
    {
      "skill_name": "Distributed Worker Queues (Redis / BullMQ)",
      "current_level": "None",
      "target_level": "Intermediate",
      "priority": "Medium",
      "explanation": "Prevents slow external API calls and email processing from blocking the HTTP event loop.",
      "recommended_learning_order": 3
    }
  ],
  "long_term_goals": "Reach Senior Full-Stack Engineer leading core product architecture within 2-3 years.",
  "roadmap": {
    "long_term_goal": "Lead high-scale web products with autonomous technical decision making.",
    "short_term_goals": [
      "Deploy 2 verified production full-stack systems with public GitHub code",
      "Master relational data modeling and database migrations",
      "Complete 50 targeted data structure & algorithm practice problems"
    ],
    "career_stages": [
      {
        "stage_name": "Foundation",
        "target_duration": "Weeks 1-4",
        "completion_criteria": "Strict TypeScript typing, modular folder structure, clean linting"
      },
      {
        "stage_name": "Skill Development",
        "target_duration": "Weeks 5-10",
        "completion_criteria": "Relational PostgreSQL database with RLS and JWT authentication"
      },
      {
        "stage_name": "Practical Application",
        "target_duration": "Weeks 11-16",
        "completion_criteria": "Full-stack project deployed on VPS or cloud with CI/CD"
      },
      {
        "stage_name": "Professional Readiness",
        "target_duration": "Weeks 17-22",
        "completion_criteria": "Public portfolio, verified capstone documentation, mock interviews"
      },
      {
        "stage_name": "Career Growth",
        "target_duration": "Ongoing",
        "completion_criteria": "Continuous learning, open-source contributions, high-impact shipping"
      }
    ],
    "milestones": [
      {
        "id": "ms-1",
        "stage": "Foundation",
        "title": "Full-Stack Architecture & Strict TypeScript",
        "description": "Establish a production template using modern React, Node.js, and TypeScript with zero type escapes.",
        "priority": "High",
        "target_duration": "Weeks 1-4",
        "completion_criteria": "Zero any types, strict tsconfig, and automated lint scripts passing.",
        "dependencies": [],
        "is_completed": true
      },
      {
        "id": "ms-2",
        "stage": "Skill Development",
        "title": "Relational Data Modeling & PostgreSQL RLS",
        "description": "Architect transactional relational schemas with foreign key cascades and composite indexes.",
        "priority": "High",
        "target_duration": "Weeks 5-10",
        "completion_criteria": "Pass automated migration tests and execute EXPLAIN ANALYZE without sequential scans.",
        "dependencies": ["ms-1"],
        "is_completed": false
      },
      {
        "id": "ms-3",
        "stage": "Practical Application",
        "title": "Production Capstone Deployment with CI/CD",
        "description": "Ship a multi-tenant full-stack web application with GitHub Actions automated testing.",
        "priority": "High",
        "target_duration": "Weeks 11-16",
        "completion_criteria": "Live URL, passing GitHub Actions CI pipeline, and >80% test coverage.",
        "dependencies": ["ms-2"],
        "is_completed": false
      },
      {
        "id": "ms-4",
        "stage": "Professional Readiness",
        "title": "System Design & Technical Interview Screening",
        "description": "Practice real-world system design questions (rate limiters, URL shorteners, messaging queues).",
        "priority": "Medium",
        "target_duration": "Weeks 17-22",
        "completion_criteria": "Conduct 3 mock technical interviews and complete 50 LeetCode Medium challenges.",
        "dependencies": ["ms-3"],
        "is_completed": false
      }
    ]
  },
  "tasks": [
    {
      "id": "task-1",
      "title": "Implement strict JWT auth with refresh token rotation",
      "description": "Build authentication controller with httpOnly secure cookies and bcrypt hashing.",
      "category": "Backend",
      "priority": "High",
      "estimated_duration": "3 hours",
      "due_date": null,
      "related_milestone": "ms-2",
      "is_completed": true
    },
    {
      "id": "task-2",
      "title": "Write database migration scripts for 11 core tables",
      "description": "Create PostgreSQL SQL files defining foreign keys, triggers, and RLS policies.",
      "category": "Database",
      "priority": "High",
      "estimated_duration": "4 hours",
      "due_date": null,
      "related_milestone": "ms-2",
      "is_completed": false
    },
    {
      "id": "task-3",
      "title": "Set up in-memory rate limiting and CORS middleware",
      "description": "Protect public REST endpoints against brute force and DDoS traffic.",
      "category": "DevOps",
      "priority": "High",
      "estimated_duration": "2 hours",
      "due_date": null,
      "related_milestone": "ms-1",
      "is_completed": true
    },
    {
      "id": "task-4",
      "title": "Build multi-stage Dockerfile and docker-compose orchestration",
      "description": "Minimize production Docker container footprint to under 150MB.",
      "category": "DevOps",
      "priority": "Medium",
      "estimated_duration": "3 hours",
      "due_date": null,
      "related_milestone": "ms-3",
      "is_completed": false
    },
    {
      "id": "task-5",
      "title": "Draft comprehensive architectural README for portfolio capstone",
      "description": "Include system architecture diagrams, API specs, and local setup steps.",
      "category": "Portfolio",
      "priority": "Medium",
      "estimated_duration": "2.5 hours",
      "due_date": null,
      "related_milestone": "ms-3",
      "is_completed": false
    }
  ],
  "habits": [
    {
      "id": "habit-1",
      "title": "45 mins focused deep-work coding session",
      "description": "Single-task coding on active feature branch without phone or social distractions.",
      "frequency": "daily",
      "target": "45 mins deep focus",
      "category": "Core Craft",
      "streak": 5,
      "completed_today": true
    },
    {
      "id": "habit-2",
      "title": "Solve 1 algorithm or system design problem",
      "description": "Practice time/space complexity analysis on arrays, trees, or graphs.",
      "frequency": "daily",
      "target": "1 problem analyzed",
      "category": "Problem Solving",
      "streak": 3,
      "completed_today": false
    },
    {
      "id": "habit-3",
      "title": "Read 1 engineering blog post or technical RFC",
      "description": "Stay updated with architecture patterns from Netflix, Uber, or Cloudflare tech blogs.",
      "frequency": "weekly",
      "target": "2 posts / week",
      "category": "Industry Knowledge",
      "streak": 2,
      "completed_today": true
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "PulseTrack: Real-Time Telemetry & API Monitoring Dashboard",
      "description": "High-throughput telemetry ingestion service processing HTTP events and visualizing response times in real time with WebSockets.",
      "skills_developed": ["TypeScript", "WebSockets", "TimescaleDB / PostgreSQL", "Tailwind CSS"],
      "expected_output": "Live interactive dashboard and public GitHub repository with comprehensive README.",
      "milestones": ["ms-2", "ms-3"],
      "status": "in_progress",
      "github_url": "https://github.com/example/pulsetrack",
      "live_demo_url": "https://pulsetrack.example.com"
    },
    {
      "id": "proj-2",
      "title": "VaultSync: Distributed Asset & File Security Engine",
      "description": "S3-compatible asset management service with pre-signed upload URLs and background thumbnail processing.",
      "skills_developed": ["Docker", "Redis Queues", "Object Storage", "JWT Auth"],
      "expected_output": "Containerized service running on cloud VPS with automated health checks.",
      "milestones": ["ms-3"],
      "status": "planned",
      "github_url": "",
      "live_demo_url": ""
    }
  ],
  "resources": [
    {
      "id": "res-1",
      "title": "Official PostgreSQL Documentation: Indexing Strategies",
      "resource_type": "Documentation",
      "description": "Authoritative guide on B-Tree, GIN, and GiST indexes with query planner insights.",
      "url": "https://www.postgresql.org/docs/current/indexes.html",
      "related_skill": "Relational Databases",
      "is_verified": true
    },
    {
      "id": "res-2",
      "title": "Designing Data-Intensive Applications (Martin Kleppmann)",
      "resource_type": "Book",
      "description": "The gold standard textbook on distributed systems, replication, and data models.",
      "url": "https://dataintensive.net/",
      "related_skill": "System Design",
      "is_verified": true
    },
    {
      "id": "res-3",
      "title": "Full Stack Open (University of Helsinki)",
      "resource_type": "Course",
      "description": "World-class open curriculum on modern JavaScript, React, Node.js, and automated testing.",
      "url": "https://fullstackopen.com/en/",
      "related_skill": "Web Development",
      "is_verified": true
    }
  ],
  "review_schedule": {
    "frequency": "Sunday evening calibration",
    "weekly_goals": [
      "Ship authentication middleware with 100% test pass rate",
      "Complete 5 LeetCode medium problems",
      "Log weekly review and resolve blockers"
    ],
    "reflection_questions": [
      "What key milestone or concept was mastered this week?",
      "What blockers or ambiguities were encountered?",
      "Are you still energized by this direction?",
      "What are the non-negotiable commitments for next week?"
    ],
    "progress_indicators": [
      "Weekly habit consistency > 80%",
      "At least 1 portfolio task shipped",
      "Zero unhandled production exceptions"
    ],
    "suggested_reassessment_date": null
  },
  "assumptions": [
    "Dedicated commitment of 12-15 hours per week",
    "Access to a computer with Node.js and Docker installed",
    "Preference for building real software systems over passive video watching"
  ],
  "confidence_and_uncertainties": "High confidence (96%) based on stated interest in logical systems. Key factor to monitor is consistent weekly momentum."
}
FOYC_DASHBOARD_END`,
  },
  {
    id: 'ai-engineer',
    title: 'Applied AI & ML Systems Engineer',
    role: 'Applied AI & Machine Learning Engineer',
    badge: 'Frontier AI & Data',
    rawText: `FOYC_DASHBOARD_START
{
  "schema_version": "foyc_dashboard_v2",
  "profile": {
    "preferred_name": "Maya Patel",
    "country": "Global",
    "current_education_or_profession": "Data Analyst / Python Developer",
    "current_career_stage": "Transitioning to Frontier AI",
    "work_experience": "2 years in data wrangling and analytics",
    "current_field": "Data Science & AI"
  },
  "career_direction": {
    "primary_career_direction": "Applied AI & ML Systems Engineer",
    "career_description": "Building production LLM agents, vector retrieval pipelines (RAG), fine-tuning domain models, and evaluating frontier AI applications.",
    "why_this_direction_was_suggested": "Combines your Python foundation and curiosity about generative models into the most rapidly expanding engineering discipline.",
    "key_responsibilities": [
      "Architect multi-agent autonomous workflows and evaluation harnesses",
      "Build high-throughput vector search and contextual retrieval systems",
      "Fine-tune open-weights models (Llama, Mistral) with LoRA/QLoRA",
      "Deploy low-latency model inference servers with vLLM and TensorRT"
    ],
    "expected_opportunities": [
      "Applied AI Engineer at enterprise generative AI startups",
      "RAG & Information Retrieval Architect",
      "AI Systems Integrator & Consultant"
    ],
    "alternative_career_paths": [
      {
        "title": "Machine Learning Research Engineer",
        "description": "Deeper mathematical focus on novel model architectures and training dynamics",
        "overlap_score": 80
      },
      {
        "title": "Data Platform & MLOps Engineer",
        "description": "Specializing in feature stores, model monitoring, and pipeline orchestration",
        "overlap_score": 85
      }
    ],
    "important_trade_offs": [
      "API pricing, rate limits, and non-deterministic model outputs require defensive engineering",
      "Rapid model obsolescence requires constant framework updates"
    ],
    "confidence_level": "High (94%)"
  },
  "strengths_and_skills": {
    "existing_strengths": [
      "Strong Python programming and data wrangling",
      "Statistical understanding and metric evaluation",
      "Quick prototyping with open-source libraries"
    ],
    "transferable_skills": [
      "Data pipeline automation",
      "REST API design and integration",
      "Benchmarking and experiment tracking"
    ],
    "current_technical_skills": [
      "Python 3.12",
      "Pandas & NumPy",
      "SQL",
      "LangChain / LlamaIndex",
      "FastAPI"
    ],
    "current_professional_skills": [
      "Hypothesis-driven experiment design",
      "Stakeholder reporting",
      "Prompt optimization"
    ],
    "skills_to_improve": [
      "Vector embeddings and similarity metrics (Cosine, HNSW)",
      "Automated evaluation frameworks (Ragas, DeepEval)",
      "vLLM inference optimization"
    ]
  },
  "skill_gaps": [
    {
      "skill_name": "RAG Evaluation & Triad Metrics (Faithfulness, Relevance)",
      "current_level": "Beginner",
      "target_level": "Advanced",
      "priority": "High",
      "explanation": "GenAI projects fail in production without quantitative hallucination metrics.",
      "recommended_learning_order": 1
    },
    {
      "skill_name": "Vector Databases (pgvector, Qdrant, Pinecone)",
      "current_level": "Beginner",
      "target_level": "Intermediate",
      "priority": "High",
      "explanation": "Crucial for building context-aware semantic retrieval engines.",
      "recommended_learning_order": 2
    }
  ],
  "long_term_goals": "Become Principal AI Architect deploying multi-modal agentic systems at enterprise scale.",
  "roadmap": {
    "long_term_goal": "Lead applied AI engineering and model evaluation teams.",
    "short_term_goals": [
      "Build a production RAG system with verifiable precision > 90%",
      "Deploy open-weight model with vLLM on cloud GPU",
      "Publish 2 technical articles on agent evaluation"
    ],
    "career_stages": [
      {
        "stage_name": "Foundation",
        "target_duration": "Weeks 1-4",
        "completion_criteria": "Embeddings, vector math, semantic search with pgvector"
      },
      {
        "stage_name": "Skill Development",
        "target_duration": "Weeks 5-10",
        "completion_criteria": "Multi-agent orchestration and LangGraph workflows"
      },
      {
        "stage_name": "Practical Application",
        "target_duration": "Weeks 11-16",
        "completion_criteria": "End-to-end evaluation harness with automated test suites"
      },
      {
        "stage_name": "Professional Readiness",
        "target_duration": "Weeks 17-22",
        "completion_criteria": "Open-source contributions and portfolio launch"
      },
      {
        "stage_name": "Career Growth",
        "target_duration": "Ongoing",
        "completion_criteria": "Deploying frontier multimodal models"
      }
    ],
    "milestones": [
      {
        "id": "ms-ai-1",
        "stage": "Foundation",
        "title": "Embeddings & Semantic Search Mastery",
        "description": "Implement vector indexing with pgvector and compare dense vs hybrid retrieval.",
        "priority": "High",
        "target_duration": "Weeks 1-4",
        "completion_criteria": "Achieve <50ms retrieval latency across 100,000 documents.",
        "dependencies": [],
        "is_completed": true
      },
      {
        "id": "ms-ai-2",
        "stage": "Skill Development",
        "title": "Autonomous Multi-Agent Workflow Engine",
        "description": "Build an agentic researcher using LangGraph with tool-calling and human-in-the-loop pauses.",
        "priority": "High",
        "target_duration": "Weeks 5-10",
        "completion_criteria": "Agent completes 5-step research synthesis without hallucinated sources.",
        "dependencies": ["ms-ai-1"],
        "is_completed": false
      }
    ]
  },
  "tasks": [
    {
      "id": "t-ai-1",
      "title": "Benchmark Dense vs Hybrid BM25 retrieval on technical docs",
      "description": "Run precision@k evaluation on custom documentation corpus.",
      "category": "Retrieval",
      "priority": "High",
      "estimated_duration": "4 hours",
      "due_date": null,
      "related_milestone": "ms-ai-1",
      "is_completed": true
    },
    {
      "id": "t-ai-2",
      "title": "Build LangGraph agent state graph with branching logic",
      "description": "Implement reflection, tool execution, and state persistence with SQLite checkpointer.",
      "category": "Agents",
      "priority": "High",
      "estimated_duration": "5 hours",
      "due_date": null,
      "related_milestone": "ms-ai-2",
      "is_completed": false
    }
  ],
  "habits": [
    {
      "id": "h-ai-1",
      "title": "Read 1 ArXiv AI paper or Hugging Face release",
      "description": "Understand core architectural improvements in frontier models.",
      "frequency": "daily",
      "target": "30 mins reading",
      "category": "Frontier AI",
      "streak": 4,
      "completed_today": true
    }
  ],
  "projects": [
    {
      "id": "p-ai-1",
      "title": "DocuMentor: Multi-Agent Technical Research & Verification Copilot",
      "description": "Autonomous multi-agent system analyzing PDF whitepapers, cross-verifying citations, and producing markdown executive summaries.",
      "skills_developed": ["Python", "LangGraph", "FastAPI", "Qdrant", "Ragas"],
      "expected_output": "Live web demo and open-source GitHub repository with automated evals.",
      "milestones": ["ms-ai-2"],
      "status": "in_progress",
      "github_url": "https://github.com/example/documentor",
      "live_demo_url": "https://documentor.example.com"
    }
  ],
  "resources": [
    {
      "id": "r-ai-1",
      "title": "DeepLearning.AI: LangGraph & Agentic Design Patterns",
      "resource_type": "Course",
      "description": "Hands-on implementation of reflection, tool-use, and multi-agent teams.",
      "url": "https://deeplearning.ai",
      "related_skill": "Agent Architecture",
      "is_verified": true
    }
  ],
  "review_schedule": {
    "frequency": "Sunday evening calibration",
    "weekly_goals": [
      "Complete agent reflection loop implementation",
      "Evaluate precision score across 50 test questions"
    ],
    "reflection_questions": [
      "Did the agent reduce hallucination rates this week?",
      "What new vector retrieval techniques were tested?"
    ],
    "progress_indicators": ["Precision score > 90%"],
    "suggested_reassessment_date": null
  },
  "assumptions": ["GPU cloud access (Colab or RunPod) for fine-tuning"],
  "confidence_and_uncertainties": "Very high momentum. Focus on quantifiable evaluation rather than prompt tinkering."
}
FOYC_DASHBOARD_END`,
  },
  {
    id: 'product-designer',
    title: 'Product & UX/UI Designer',
    role: 'Product & UX/UI Designer',
    badge: 'Design & Human-Centered',
    rawText: `FOYC_DASHBOARD_START
{
  "schema_version": "foyc_dashboard_v2",
  "profile": {
    "preferred_name": "Jordan Taylor",
    "country": "Global",
    "current_education_or_profession": "Graphic Design / Visual Arts",
    "current_career_stage": "Transitioning to Product UX",
    "work_experience": "Brand identity and visual design projects",
    "current_field": "Design & UX"
  },
  "career_direction": {
    "primary_career_direction": "Product & UX/UI Designer",
    "career_description": "Crafting intuitive digital experiences, design systems, interactive prototypes, and conducting user research for modern web and mobile apps.",
    "why_this_direction_was_suggested": "Strong aesthetic eye, visual empathy, and passion for solving user pain points through thoughtful interaction design.",
    "key_responsibilities": [
      "Conduct user interviews, usability tests, and journey mapping",
      "Build scalable Figma design systems with auto-layout and design tokens",
      "Create interactive micro-interaction prototypes",
      "Collaborate closely with frontend engineers to ensure design fidelity"
    ],
    "expected_opportunities": [
      "Product Designer at high-growth tech startups",
      "Design Systems Specialist",
      "UX Researcher & Interaction Designer"
    ],
    "alternative_career_paths": [
      {
        "title": "Design Engineer",
        "description": "Bridging Figma design tokens directly into React/Tailwind code",
        "overlap_score": 85
      }
    ],
    "important_trade_offs": [
      "Must learn to advocate for user needs against tight product deadlines"
    ],
    "confidence_level": "High (92%)"
  },
  "strengths_and_skills": {
    "existing_strengths": [
      "Visual hierarchy and color harmony",
      "Typography styling and brand consistency",
      "High empathy for user frustration"
    ],
    "transferable_skills": [
      "Creative direction and moodboarding",
      "Storyboarding and narrative structuring"
    ],
    "current_technical_skills": [
      "Figma",
      "Adobe Illustrator",
      "Wireframing",
      "Component Libraries"
    ],
    "current_professional_skills": [
      "Design critique moderation",
      "Client presentation"
    ],
    "skills_to_improve": [
      "Figma auto-layout variables & tokens",
      "Usability testing methodologies",
      "Basic HTML/CSS mental models"
    ]
  },
  "skill_gaps": [
    {
      "skill_name": "Figma Variables, Component Properties & Tokens",
      "current_level": "Beginner",
      "target_level": "Advanced",
      "priority": "High",
      "explanation": "Modern product teams require design systems that mirror production code tokens.",
      "recommended_learning_order": 1
    }
  ],
  "long_term_goals": "Become Lead Product Designer shaping zero-to-one product design systems.",
  "roadmap": {
    "long_term_goal": "Lead product design and design engineering across multiple web products.",
    "short_term_goals": [
      "Complete 2 comprehensive end-to-end UX case studies",
      "Build a public portfolio with interactive Figma prototypes"
    ],
    "career_stages": [
      {
        "stage_name": "Foundation",
        "target_duration": "Weeks 1-4",
        "completion_criteria": "Advanced Figma components, auto-layout, design tokens"
      },
      {
        "stage_name": "Skill Development",
        "target_duration": "Weeks 5-10",
        "completion_criteria": "User interviews, persona synthesis, wireframing"
      },
      {
        "stage_name": "Practical Application",
        "target_duration": "Weeks 11-16",
        "completion_criteria": "Two comprehensive case studies with usability test recordings"
      },
      {
        "stage_name": "Professional Readiness",
        "target_duration": "Weeks 17-22",
        "completion_criteria": "Public portfolio review and mock design challenges"
      },
      {
        "stage_name": "Career Growth",
        "target_duration": "Ongoing",
        "completion_criteria": "Design leadership and cross-functional influence"
      }
    ],
    "milestones": [
      {
        "id": "ms-des-1",
        "stage": "Foundation",
        "title": "Design Systems & Token Architecture",
        "description": "Construct a comprehensive design system in Figma with light/dark theme variables.",
        "priority": "High",
        "target_duration": "Weeks 1-4",
        "completion_criteria": "Full library with 40+ accessible components adhering to WCAG 2.1 AA.",
        "dependencies": [],
        "is_completed": true
      }
    ]
  },
  "tasks": [
    {
      "id": "t-des-1",
      "title": "Build responsive navigation component with Figma auto-layout",
      "description": "Support desktop, tablet, and mobile variants with smooth state transitions.",
      "category": "Design System",
      "priority": "High",
      "estimated_duration": "3 hours",
      "due_date": null,
      "related_milestone": "ms-des-1",
      "is_completed": true
    }
  ],
  "habits": [
    {
      "id": "h-des-1",
      "title": "Deconstruct 1 top-tier product UI screen daily",
      "description": "Analyze spacing, visual hierarchy, microcopy, and affordances on Mobbin.",
      "frequency": "daily",
      "target": "20 mins critique",
      "category": "Visual Sense",
      "streak": 7,
      "completed_today": true
    }
  ],
  "projects": [
    {
      "id": "p-des-1",
      "title": "ClarityFlow: Fintech Mobile Experience Redesign",
      "description": "End-to-end mobile app redesign simplifying personal investment workflows and reducing onboarding friction.",
      "skills_developed": ["Figma", "User Journey Mapping", "Prototyping", "Usability Testing"],
      "expected_output": "Interactive Figma prototype and published case study with usability test metrics.",
      "milestones": ["ms-des-1"],
      "status": "in_progress",
      "github_url": "",
      "live_demo_url": "https://figma.com/@clarityflow"
    }
  ],
  "resources": [
    {
      "id": "r-des-1",
      "title": "Refactoring UI (Adam Wathan & Steve Schoger)",
      "resource_type": "Book",
      "description": "Tactical advice on designing beautiful user interfaces from a developer perspective.",
      "url": "https://www.refactoringui.com/",
      "related_skill": "Visual Design",
      "is_verified": true
    }
  ],
  "review_schedule": {
    "frequency": "Sunday evening calibration",
    "weekly_goals": ["Finalize user interview notes and update interactive prototype"],
    "reflection_questions": ["Did usability test participants navigate the primary flow without hesitation?"],
    "progress_indicators": ["Usability task success rate > 85%"],
    "suggested_reassessment_date": null
  },
  "assumptions": ["Access to Figma Professional"],
  "confidence_and_uncertainties": "High creative passion. Ensure case studies emphasize problem solving over purely visual decoration."
}
FOYC_DASHBOARD_END`,
  },
  {
    id: 'tech-founder',
    title: 'Tech Founder / Indie Hacker',
    role: 'Tech Founder & Product Builder',
    badge: 'Entrepreneurship',
    rawText: `FOYC_DASHBOARD_START
{
  "schema_version": "foyc_dashboard_v2",
  "profile": {
    "preferred_name": "Sam Rivera",
    "country": "Global",
    "current_education_or_profession": "Full-Stack Developer / Generalist",
    "current_career_stage": "Bootstrapping First Venture",
    "work_experience": "Software engineering and product management",
    "current_field": "Startups & SaaS"
  },
  "career_direction": {
    "primary_career_direction": "Tech Founder & Indie Hacker",
    "career_description": "Validating customer problems, building minimum viable products (MVPs), acquiring initial paying customers, and iterating toward profitability.",
    "why_this_direction_was_suggested": "High autonomous drive, broad cross-functional skillset, and ambition to build compounding independent businesses.",
    "key_responsibilities": [
      "Conduct customer discovery interviews and identify acute willingness to pay",
      "Rapidly prototype and ship functional MVPs in 2-4 weeks",
      "Build distribution channels (content, programmatic SEO, communities)",
      "Manage customer onboarding, feedback loops, and unit economics"
    ],
    "expected_opportunities": [
      "Bootstrapped SaaS founder reaching $10k+ MRR",
      "Venture-scale startup founder",
      "Fractional Head of Product / Technical Cofounder"
    ],
    "alternative_career_paths": [
      {
        "title": "Founding Engineer at Early Stage Startup",
        "description": "High equity and zero-to-one building without sole financial risk",
        "overlap_score": 90
      }
    ],
    "important_trade_offs": [
      "Income volatility in the early stages requires conservative personal runway",
      "Must do non-coding tasks (sales, marketing, customer support) daily"
    ],
    "confidence_level": "High (90%)"
  },
  "strengths_and_skills": {
    "existing_strengths": [
      "Rapid end-to-end prototyping capability",
      "Pragmatic product prioritization",
      "High resilience and comfort with ambiguity"
    ],
    "transferable_skills": [
      "Customer communication",
      "Technical architecture",
      "Financial budgeting and unit economics"
    ],
    "current_technical_skills": [
      "Next.js / React",
      "TypeScript",
      "Supabase / PostgreSQL",
      "Stripe Integration"
    ],
    "current_professional_skills": [
      "Cold outreach",
      "Copywriting",
      "Problem validation"
    ],
    "skills_to_improve": [
      "Customer discovery interview questioning (The Mom Test)",
      "Organic distribution and SEO",
      "Email marketing automation"
    ]
  },
  "skill_gaps": [
    {
      "skill_name": "Customer Discovery & Pre-sales (The Mom Test Framework)",
      "current_level": "Beginner",
      "target_level": "Advanced",
      "priority": "High",
      "explanation": "Building before validating acute willingness to pay is the #1 reason startups fail.",
      "recommended_learning_order": 1
    }
  ],
  "long_term_goals": "Achieve financial freedom with $20k+ MRR portfolio of micro-SaaS products.",
  "roadmap": {
    "long_term_goal": "Operate profitable independent software businesses with high gross margins.",
    "short_term_goals": [
      "Interview 20 potential customers before writing code",
      "Pre-sell 5 annual subscriptions for MVP",
      "Launch on Product Hunt and Twitter/X"
    ],
    "career_stages": [
      {
        "stage_name": "Foundation",
        "target_duration": "Weeks 1-4",
        "completion_criteria": "Customer discovery interviews, acute problem identified"
      },
      {
        "stage_name": "Skill Development",
        "target_duration": "Weeks 5-10",
        "completion_criteria": "Clickable prototype and pre-orders secured"
      },
      {
        "stage_name": "Practical Application",
        "target_duration": "Weeks 11-16",
        "completion_criteria": "MVP shipped with Stripe payments and live users"
      },
      {
        "stage_name": "Professional Readiness",
        "target_duration": "Weeks 17-22",
        "completion_criteria": "First $1,000 MRR milestone achieved"
      },
      {
        "stage_name": "Career Growth",
        "target_duration": "Ongoing",
        "completion_criteria": "Scaling distribution and organic compounding"
      }
    ],
    "milestones": [
      {
        "id": "ms-fnd-1",
        "stage": "Foundation",
        "title": "Customer Problem Discovery Sprint",
        "description": "Conduct 20 customer interviews using Mom Test questions to find acute pain.",
        "priority": "High",
        "target_duration": "Weeks 1-4",
        "completion_criteria": "At least 5 target users express strong desire to pre-pay for solution.",
        "dependencies": [],
        "is_completed": true
      }
    ]
  },
  "tasks": [
    {
      "id": "t-fnd-1",
      "title": "Draft 1-page offer document and landing page",
      "description": "Clearly state the customer problem, proposed solution, and pricing tier.",
      "category": "Validation",
      "priority": "High",
      "estimated_duration": "3 hours",
      "due_date": null,
      "related_milestone": "ms-fnd-1",
      "is_completed": true
    }
  ],
  "habits": [
    {
      "id": "h-fnd-1",
      "title": "Engage with 5 potential target customers daily",
      "description": "Provide authentic value in niche communities without spamming.",
      "frequency": "daily",
      "target": "5 genuine conversations",
      "category": "Distribution",
      "streak": 6,
      "completed_today": true
    }
  ],
  "projects": [
    {
      "id": "p-fnd-1",
      "title": "FeedPulse: Micro-SaaS Customer Testimonial Collector",
      "description": "Embeddable testimonial widget with automated video and text capture for indie founders.",
      "skills_developed": ["Next.js", "Stripe Checkout", "PostgreSQL", "Cold Email"],
      "expected_output": "Live SaaS application processing real subscriptions.",
      "milestones": ["ms-fnd-1"],
      "status": "in_progress",
      "github_url": "",
      "live_demo_url": "https://feedpulse.example.com"
    }
  ],
  "resources": [
    {
      "id": "r-fnd-1",
      "title": "The Mom Test (Rob Fitzpatrick)",
      "resource_type": "Book",
      "description": "How to talk to customers and learn if your business is a good idea when everyone is lying to you.",
      "url": "http://momtestbook.com/",
      "related_skill": "Customer Discovery",
      "is_verified": true
    }
  ],
  "review_schedule": {
    "frequency": "Sunday evening calibration",
    "weekly_goals": ["Conduct 5 user discovery calls and update sales landing page"],
    "reflection_questions": ["Did any user offer their credit card or request an invoice this week?"],
    "progress_indicators": ["Customer interview count >= 5"],
    "suggested_reassessment_date": null
  },
  "assumptions": ["6-12 months personal runway to reach profitability"],
  "confidence_and_uncertainties": "Clear market demand. Critical metric is sales velocity."
}
FOYC_DASHBOARD_END`,
  },
];
