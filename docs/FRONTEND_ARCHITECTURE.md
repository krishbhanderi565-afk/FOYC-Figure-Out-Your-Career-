# FOYC Frontend Architecture & Codebase Design

## 1. Technology Stack
- **Framework:** React 19 with TypeScript 7
- **Bundler:** Vite 8 (Sub-second HMR & optimized production bundling)
- **Styling:** Tailwind CSS v4 with `@tailwindcss/vite`
- **Routing:** React Router v7 (`react-router-dom`)
- **Iconography:** Lucide React
- **Animations:** Custom neo-editorial CSS transforms + Framer Motion primitives

---

## 2. Directory Hierarchy

```
src/
├── assets/                  # Static assets & illustrations
├── components/
│   ├── common/              # Global atomic UI components
│   │   ├── Navbar.tsx       # Brand header with mobile drawer
│   │   ├── Footer.tsx       # Accessible multi-column footer
│   │   ├── Button.tsx       # Neo-brutalist tactile button system
│   │   ├── Badge.tsx        # Pill badges with borders & dots
│   │   ├── Card.tsx         # Pastel & dark card containers
│   │   └── Highlight.tsx    # Signature inline yellow boxed text
│   ├── landing/             # 10 modular Landing Page sections
│   │   ├── HeroSection.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── WhyDifficultSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── WhoIsItForSection.tsx
│   │   ├── CareerPathsSection.tsx
│   │   ├── DashboardPreviewSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── FaqSection.tsx
│   │   └── CtaSection.tsx
│   └── dashboard/           # Dashboard shell & layout primitives
│       ├── DashboardLayout.tsx
│       ├── DashboardSidebar.tsx
│       └── DashboardHeader.tsx
├── context/
│   └── CareerContext.tsx    # Unified global state & LocalStorage sync
├── pages/
│   ├── LandingPage.tsx      # Stage 1: Public landing page
│   ├── OnboardingPage.tsx   # Stage 2: Basic personal background
│   ├── MindReflectionPage.tsx# Stage 3: "What's on your mind" input
│   ├── PromptReadyPage.tsx  # Stage 4: ChatGPT prompt synthesis
│   ├── HandoffImportPage.tsx# Stage 7: Paste ChatGPT handoff
│   ├── HandoffPreviewPage.tsx# Edit & approve parsed draft
│   ├── AuthPage.tsx         # Stage 8: Account creation / Demo login
│   └── dashboard/           # Full Personalized Dashboard Engine
│       ├── OverviewPage.tsx
│       ├── MyCareerPage.tsx
│       ├── RoadmapPage.tsx
│       ├── ChecklistPage.tsx
│       ├── HabitTrackerPage.tsx
│       ├── ProjectsPage.tsx
│       ├── ResourcesPage.tsx
│       ├── WeeklyReviewPage.tsx
│       └── SettingsPage.tsx
├── types/
│   └── career.ts            # Rock-solid TypeScript interfaces
└── utils/
    ├── promptGenerator.ts   # Empathetic ChatGPT coach prompt generator
    ├── handoffParser.ts     # Resilient parser for delimited blocks
    └── sampleHandoffs.ts    # 4 industry handoffs for rapid evaluation
```

---

## 3. Data Flow & Zero Walled Garden Philosophy
1. **Pre-Login Discovery:** Users can complete profile selection, reflection, prompt generation, and handoff import completely anonymously without an upfront account.
2. **ChatGPT External Integration:** FOYC generates an empathetic system prompt. Users chat inside their own ChatGPT account for total privacy and unlimited conversational depth.
3. **Structured Handoff Parsing:** FOYC parses standard delimited blocks (`---BEGIN FOYC CAREER DIRECTION---`, etc.) using regex and schema normalization, treating pasted text as untrusted user input.
4. **Local Persistence:** All state is automatically mirrored to `localStorage` (`foyc_profile`, `foyc_reflection`, `foyc_dashboard_data`), ensuring uninterrupted user sessions across page refreshes.
