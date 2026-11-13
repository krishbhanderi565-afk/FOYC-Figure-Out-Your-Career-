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
    rawText: `FOYC CAREER DASHBOARD HANDOFF

---BEGIN FOYC PROFILE---
Name: Alex Chen
Stage: Final Year CS Student
Target: Full-Stack Software Engineer at High-Growth Product Company
Hours Available: 15 hours/week
---END FOYC PROFILE---

---BEGIN FOYC CAREER DIRECTION---
Primary: Full-Stack Software Engineer
Summary: Building robust end-to-end web architectures, scalable APIs, and reactive frontend experiences.
Why: Matches your passion for tangible problem solving, logical structure, and immediate feedback loops.
Long-Term Goal: Senior Engineer leading critical product features within 3 years.
Short-Term Objective: Ship 2 production-grade applications with CI/CD and pass technical screenings.
Alternatives: Backend Systems Engineer, Cloud Solutions Architect, DevOps Engineer
Strengths: Algorithmic problem solving, clean code standards, quick API integration
Gaps: Advanced system design patterns, distributed caching, production observability
---END FOYC CAREER DIRECTION---

---BEGIN FOYC SKILL ROADMAP---
1. Advanced TypeScript, Modern React 19 architecture, and State Machines
2. Node.js backend scalability, PostgreSQL indexing, and Prisma ORM
3. Redis caching, background worker queues, and REST/GraphQL API design
4. Docker containerization, AWS/Vercel deployment pipelines, and automated testing
5. System design for high availability and concurrency
---END FOYC SKILL ROADMAP---

---BEGIN FOYC MILESTONES---
1. Foundation Mastery: Build strict TypeScript + Next.js/React full-stack patterns
2. Core Services: Architect database schemas with PostgreSQL, RLS, and secure auth
3. Capstone Deployment: Deploy multi-tenant SaaS application with automated tests and CI/CD
4. Interview Readiness: Complete 50 targeted LeetCode medium problems and 5 mock technical interviews
5. Career Launch: Land senior-level junior or mid-tier engineering role with verified proof of work
---END FOYC MILESTONES---

---BEGIN FOYC TASKS---
- Implement strict JWT and Session authentication with refresh token rotation
- Build transactional database schema with PostgreSQL and migrations
- Optimize database queries with composite indices and explain analyze
- Write Vitest unit tests and Playwright integration tests with >80% coverage
- Containerize application with multi-stage Dockerfile and docker-compose
- Set up GitHub Actions CI/CD pipeline with automated linting and build checks
- Complete System Design audit of a real-world URL shortener and notification engine
---END FOYC TASKS---

---BEGIN FOYC HABITS---
- 60 mins focused coding on active repository without social distractions
- Solve 1 algorithm/data structure problem and document space/time complexity
- Review 1 open-source pull request or technical RFC document
---END FOYC HABITS---

---BEGIN FOYC PROJECTS---
1. PulseTrack: High-throughput API telemetry dashboard with real-time WebSockets
2. CloudSync: Distributed asset storage engine with background thumbnail processing
---END FOYC PROJECTS---

---BEGIN FOYC RESOURCES---
- MDN Web Docs & TypeScript Deep Dive (Free Documentation)
- Designing Data-Intensive Applications by Martin Kleppmann (Book)
- Roadmap.sh Full Stack Developer Path (Interactive Guide)
---END FOYC RESOURCES---

---BEGIN FOYC ASSUMPTIONS---
- User has basic programming knowledge in JS/Python.
- Hardware is capable of running local Docker containers.
---END FOYC ASSUMPTIONS---`
  },
  {
    id: 'applied-ai-engineer',
    title: 'Applied AI & LLM Engineer',
    role: 'Applied AI Engineer',
    badge: 'AI & Data Science',
    rawText: `FOYC CAREER DASHBOARD HANDOFF

---BEGIN FOYC PROFILE---
Name: Priya Sharma
Stage: Working Software Developer pivoting to AI
Target: Applied AI Engineer building LLM applications & agents
Hours Available: 12 hours/week
---END FOYC PROFILE---

---BEGIN FOYC CAREER DIRECTION---
Primary: Applied AI & LLM Systems Engineer
Summary: Bridging cutting-edge foundation models with enterprise software through RAG pipelines, fine-tuning, and agentic workflows.
Why: Leverages existing software engineering maturity while capturing the explosive demand for AI implementation.
Long-Term Goal: Lead an AI engineering team building production agentic systems.
Short-Term Objective: Build and deploy a multi-agent RAG system with verifiable evaluation metrics.
Alternatives: Machine Learning Engineer, MLOps Engineer, Data Scientist
Strengths: Strong Python fundamentals, backend architecture, rapid prototyping
Gaps: Vector database optimization, LLM evaluation frameworks (Ragas/TruLens), fine-tuning techniques
---END FOYC CAREER DIRECTION---

---BEGIN FOYC SKILL ROADMAP---
1. Python async programming, NumPy, Pandas, and PyTorch inference pipelines
2. Vector embeddings, Chunking strategies, and Hybrid search (Dense + Sparse/BM25)
3. Advanced RAG architectures: Query rewriting, reranking with Cohere, and contextual retrieval
4. Agent frameworks: LangGraph, function calling, stateful tool orchestration, and memory
5. LLM Ops: Prompt evaluation, latency reduction, token caching, and guardrails
---END FOYC SKILL ROADMAP---

---BEGIN FOYC MILESTONES---
1. Foundation: Deepen understanding of Transformers, tokenization, and attention mechanics
2. RAG Production Engine: Build production-grade RAG over 10,000 complex domain PDFs
3. Agentic Workflow: Create an autonomous research agent using LangGraph and web tools
4. Evaluation & Hardening: Implement automated synthetic test evaluations and hallucination benchmarks
5. Proof of Competency: Publish interactive demo and technical article break-down
---END FOYC MILESTONES---

---BEGIN FOYC TASKS---
- Implement chunking comparison benchmark across recursive, semantic, and markdown splitters
- Connect Qdrant/Pinecone with hybrid search and cross-encoder reranking
- Build structured output extraction using Instructor and Pydantic validation
- Implement LangGraph workflow with human-in-the-loop verification gate
- Run automated RAG evaluation using Ragas assessing faithfulness and answer relevance
- Deploy inference endpoint on modal.com or runpod with streaming response
---END FOYC TASKS---

---BEGIN FOYC HABITS---
- 45 mins reading latest AI research papers (Arxiv / Hugging Face daily papers)
- 60 mins hands-on model tuning or pipeline coding
- Test 1 new prompt engineering technique or open-source tool
---END FOYC HABITS---

---BEGIN FOYC PROJECTS---
1. DocuMind: Multi-agent financial report analyst with citations and verification
2. AgentOps: Evaluation sandbox comparing GPT-4o, Claude 3.7, and local DeepSeek-R1
---END FOYC PROJECTS---

---BEGIN FOYC RESOURCES---
- DeepLearning.ai Short Courses on LLMs and Agents (Verified Course)
- Hugging Face NLP Course (Interactive Tutorials)
- LangChain & LlamaIndex Official Cookbooks (Documentation)
---END FOYC RESOURCES---

---BEGIN FOYC ASSUMPTIONS---
- Has access to OpenAI / Anthropic API credits or capable GPU.
- Comfort with command line and Git.
---END FOYC ASSUMPTIONS---`
  },
  {
    id: 'product-designer',
    title: 'Product & UX/UI Designer',
    role: 'Senior Product Designer',
    badge: 'Design & Creative',
    rawText: `FOYC CAREER DASHBOARD HANDOFF

---BEGIN FOYC PROFILE---
Name: Maya Lindqvist
Stage: Career Switcher from Graphic Design
Target: Product Designer at B2B SaaS or Design-Led Consumer Startup
Hours Available: 14 hours/week
---END FOYC PROFILE---

---BEGIN FOYC CAREER DIRECTION---
Primary: Product & UX/UI Designer
Summary: Crafting human-centered digital experiences, accessible design systems, and delightful interactive prototypes.
Why: Perfectly blends visual aesthetic taste with empathetic human psychology and product strategy.
Long-Term Goal: Staff Product Designer leading end-to-end design strategy for high-impact software.
Short-Term Objective: Publish 2 comprehensive case studies showcasing business metrics and user research.
Alternatives: UX Researcher, Design Systems Lead, Creative Technologist
Strengths: Visual composition, typography, color theory, Figma component architecture
Gaps: Usability testing methodologies, product analytics (Mixpanel/PostHog), responsive code handoff
---END FOYC CAREER DIRECTION---

---BEGIN FOYC SKILL ROADMAP---
1. User research methodologies: Usability tests, user journeys, and problem framing
2. Figma advanced architecture: Variables, tokens, auto-layout, and interactive components
3. Information architecture, wireframing, and interactive micro-animations
4. Design system creation with accessibility standards (WCAG AAA compliance)
5. Business metrics alignment: Conversion optimization, retention, and friction reduction
---END FOYC SKILL ROADMAP---

---BEGIN FOYC MILESTONES---
1. Research & Problem Discovery: Conduct 5 live user interviews and create synthesis affinity map
2. High-Fidelity UI & Systems: Build comprehensive tokenized design system in Figma
3. Interactive Prototype: Build high-fidelity prototype with micro-interactions and realistic states
4. Usability Testing & Iteration: Run moderated testing session with 5 users and iterate on friction points
5. Portfolio Launch: Launch custom web portfolio with deep narrative case studies
---END FOYC MILESTONES---

---BEGIN FOYC TASKS---
- Audit 3 competitor applications and map out user flow friction points
- Define design tokens for spacing, typography, and semantic color modes
- Build responsive auto-layout components with interactive states (hover, focus, disabled)
- Conduct 3 usability tests with Figma interactive prototype and record observations
- Write case study highlighting problem statement, metrics, tradeoffs, and iterations
- Polish case study presentation deck for design hiring manager review
---END FOYC TASKS---

---BEGIN FOYC HABITS---
- 30 mins UI tear-down analysis of a top Dribbble/Mobbin product screen
- 45 mins active Figma prototyping and micro-interaction craft
- Share 1 design breakdown or critique on Twitter/LinkedIn
---END FOYC HABITS---

---BEGIN FOYC PROJECTS---
1. FinFlow: Mobile personal wealth management system for Gen-Z freelancers
2. Nucleus Design System: Multi-brand design token library with documented component guidelines
---END FOYC PROJECTS---

---BEGIN FOYC RESOURCES---
- Refactoring UI by Adam Wathan & Steve Schoger (Design Principles Book)
- Nielsen Norman Group UX Research Articles (Verified Articles)
- Mobbin.com Real App Design Patterns Library (Inspiration)
---END FOYC RESOURCES---

---BEGIN FOYC ASSUMPTIONS---
- User has basic visual design familiarity.
- Figma account is available.
---END FOYC ASSUMPTIONS---`
  },
  {
    id: 'tech-entrepreneur',
    title: 'Tech Founder & Micro-SaaS Builder',
    role: 'Solopreneur / Founder',
    badge: 'Business & Startup',
    rawText: `FOYC CAREER DASHBOARD HANDOFF

---BEGIN FOYC PROFILE---
Name: David Miller
Stage: Self-taught builder / Indie hacker
Target: Profitable Micro-SaaS generating $10k MRR
Hours Available: 20 hours/week
---END FOYC PROFILE---

---BEGIN FOYC CAREER DIRECTION---
Primary: Tech Founder & Micro-SaaS Builder
Summary: Identifying high-intent niche B2B problems, building lean solutions, and scaling through programmatic distribution and SEO.
Why: Maximum creative autonomy, compounding equity, and direct connection between effort and financial reward.
Long-Term Goal: Build a portfolio of profitable software businesses with >80% gross margins.
Short-Term Objective: Launch MVP, acquire first 10 paying customers, and reach ramen profitability.
Alternatives: Early-stage Startup Founding Engineer, Technical Growth Marketer, Product Manager
Strengths: Rapid execution, self-directed discipline, willingness to sell
Gaps: B2B sales outreach, churn reduction, customer onboarding optimization
---END FOYC CAREER DIRECTION---

---BEGIN FOYC SKILL ROADMAP---
1. Rapid MVP development using battle-tested boilerplates and serverless infrastructure
2. Cold outreach, organic audience building, and LinkedIn/Twitter distribution
3. Stripe billing, subscriptions, webhooks, and tiered pricing psychology
4. Programmatic SEO, directory submissions, and product launch strategy (Product Hunt, Reddit)
5. Customer success, onboarding tours, and feedback collection loops
---END FOYC SKILL ROADMAP---

---BEGIN FOYC MILESTONES---
1. Customer Discovery: Interview 15 prospective customers and pre-sell 3 pilot subscriptions
2. MVP Build Sprint: Ship minimum lovable product within 3 weeks of code
3. Launch Day: Execute public launch across Product Hunt, Reddit, and Twitter
4. Revenue Milestone: Reach first $1,000 monthly recurring revenue with verified retention
5. Automation & Scaling: Automate onboarding and establish predictable acquisition channel
---END FOYC MILESTONES---

---BEGIN FOYC TASKS---
- Identify 5 specific painful software complaints in targeted subreddits and forums
- Send 50 personalized cold emails or DMs to target decision makers
- Set up landing page with clear value proposition, pricing table, and Stripe checkout
- Build MVP with core problem-solving feature and zero superfluous fluff
- Set up PostHog telemetry to track activation funnel and user drop-off points
- Launch on Product Hunt and coordinate Day 1 community upvote campaign
- Record personalized 2-minute video onboarding message for every new signup
---END FOYC TASKS---

---BEGIN FOYC HABITS---
- Talk to 1 potential customer or user every single business day
- Spend 50% of the day on marketing/distribution, 50% on product development
- Review daily revenue, churn rate, and active trial conversions
---END FOYC HABITS---

---BEGIN FOYC PROJECTS---
1. QuickInvoice AI: Instant compliance invoice generator for international contractors
2. FeedBackPill: Micro-widget collecting in-app user testimonials for indie apps
---END FOYC PROJECTS---

---BEGIN FOYC RESOURCES---
- The Mom Test by Rob Fitzpatrick (Customer Discovery Book)
- MicroConf & Indie Hackers Community Archives (Practical Case Studies)
- Pieter Levels - Make Book (Bootstrapping Guide)
---END FOYC RESOURCES---

---BEGIN FOYC ASSUMPTIONS---
- User has capability to build or assemble web applications.
- Prepared to handle customer rejections and pivot quickly.
---END FOYC ASSUMPTIONS---`
  }
];
