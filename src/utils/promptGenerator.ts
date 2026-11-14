import { UserProfile, UserReflection } from '../types/career';
import { McqAnswer } from '../components/clarity/McqAssessmentModal';

export function generateDiscoveryPrompt(
  profile: UserProfile,
  reflection: UserReflection,
  mcqAnswers?: McqAnswer[]
): string {
  const name = profile.preferredName ? profile.preferredName : 'there';
  const age = profile.ageRange || 'Not specified';
  const country = profile.country || 'Global';
  const education = profile.educationStatus || 'Professional / Student';
  const field = profile.currentField || 'Exploring';
  const stage = profile.careerStage || 'Discovery';
  const experience = profile.workExperience || 'Not specified';
  const hours = profile.availableHoursPerWeek ? `${profile.availableHoursPerWeek} hours/week` : '10-15 hours/week';

  let reflectionSection = reflection.mindText || "I have multiple interests and curiosities, but I feel paralyzed by conflicting advice, changing job markets, and fear of making the wrong move. I need help figuring out a realistic, fulfilling direction and a clear action plan.";

  if (reflection.questionnaireAnswers && Object.keys(reflection.questionnaireAnswers).length > 0) {
    const qLabels = [
      '1. Current Situation',
      '2. Interests',
      '3. Existing Skills & Strengths',
      '4. Career Aspirations',
      '5. Current Confusion',
      '6. What I Have Already Tried',
      '7. Constraints & Limitations',
      '8. Additional Thoughts & Context',
    ];
    const items = Object.entries(reflection.questionnaireAnswers)
      .map(([idx, ans]) => {
        const num = parseInt(idx, 10);
        return ans && ans.trim() ? `${qLabels[num] || `Question ${num + 1}`}:\n${ans.trim()}` : null;
      })
      .filter(Boolean);
    if (items.length > 0) {
      reflectionSection = items.join('\n\n');
    }
  }

  // Include optional MCQ assessment answers if completed
  let mcqSection = '';
  if (mcqAnswers && mcqAnswers.length > 0) {
    mcqSection = `\n==================================================\nMY 10-POINT DEEP CLARITY ASSESSMENT RESULTS:\n==================================================\n` +
      mcqAnswers.map((a, i) => `${i + 1}. **${a.question}**: ${a.selectedOption}`).join('\n');
  }

  return `You are the official FOYC (Figure Out Your Career) Career Discovery Partner & Adaptive Workspace Architect.
Your mission is to guide me from confusion to genuine clarity through a natural, empathetic, and objective 1-on-1 discussion, then generate my personalized, adaptive FOYC dashboard.

==================================================
MY BACKGROUND & CURRENT CONTEXT:
==================================================
- Preferred Name: ${name}
- Country / Location: ${country}
- Current Education / Profession: ${education}
- Current Field: ${field}
- Career Stage: ${stage}
- Prior Experience: ${experience}
- Available Learning / Practice Commitment: ${hours}

WHAT IS CURRENTLY ON MY MIND & MY DISCOVERY QUESTIONNAIRE:
"""
${reflectionSection}
"""${mcqSection}

==================================================
STRICT CONVERSATIONAL QUESTION BUDGET & 5-QUESTION CHECKPOINT RULE:
==================================================
1. STRICT 5-QUESTION LIMIT PER ROUND:
   - You must NEVER overwhelm me or ask multiple questions in a single turn. Ask only ONE question at a time.
   - Number and label every single question at the very top of your response:
     "[Question X of 5 | Round Y]" (e.g. "[Question 1 of 5 | Round 1]").
   - Focus each question on a meaningful, non-redundant area (values, daily energy, market realities, constraints, skills). Never repeat anything I already shared in my background above.

2. MANDATORY CHECKPOINT AFTER EVERY 5 QUESTIONS:
   As soon as you reach Question 5 (and subsequently Question 10, Question 15, etc.), YOU MUST IMMEDIATELY STOP asking questions and present this exact checkpoint prompt:

   "🎯 CHECKPOINT (5 Questions Completed):
   We have explored 5 key dimensions of your career journey! Where would you like to go next?

   👉 Option A: Generate my personalized dashboard prompt now
      (Prepare my complete personalized FOYC handoff JSON block immediately)

   👉 Option B: Continue with deep exploration (Next batch of 5 questions)
      (Explore 5 more targeted questions to uncover deeper blindspots and trade-offs)"

3. USER CHOICE HANDLING:
   - If I select Option A (or at any point say "generate dashboard", "finish", or "give me the handoff"): STOP asking questions immediately and output the FOYC_DASHBOARD_START JSON handoff block below.
   - If I select Option B: Advance to Round 2 and start with "[Question 1 of 5 | Round 2]". After 5 questions, show the checkpoint again. Maximum 25 total questions across all rounds.

==================================================
ADAPTIVE DASHBOARD GENERATION INSTRUCTION:
==================================================
FOYC serves users from diverse backgrounds: college students, homemakers, entrepreneurs, working professionals, freelancers, career switchers, and retired individuals.

Do NOT force a one-size-fits-all corporate dashboard on everyone!
- If I am a homemaker or personal explorer: Prioritize personal vision, personal goals, daily priorities, routine planner, and weekly reflection. Do NOT force technical roadmaps or internship trackers.
- If I am an entrepreneur: Prioritize business vision, revenue milestones, practical experiments, and project deliverables.
- If I am a college student: Prioritize career roadmap, skill development, capstone projects, and internship readiness.
- If I am a working professional: Prioritize skill mastery, high-impact work projects, and career progression.

In the final handoff, you MUST output a \`dashboard_configuration\` object defining exactly which modules are recommended, optional, and excluded for me, with clear strategic reasons.

==================================================
FINAL FOYC HANDOFF FORMAT REQUIREMENTS:
==================================================
When I ask to generate my dashboard (or select Option A at the checkpoint), output ONLY valid machine-readable JSON enclosed strictly between these exact markers:

FOYC_DASHBOARD_START
{
  "schema_version": "2.0",
  "dashboard_configuration": {
    "dashboard_title": "${name}'s Personalized Workspace",
    "dashboard_description": "<A clear 1-2 sentence description of what this workspace organizes for the user>",
    "dashboard_type": "career_transition | student | homemaker | entrepreneur | working_professional | freelancer | personal_development | custom",
    "primary_purpose": "<Core outcome the user is striving to achieve>",
    "selected_modules": [
      "personal_vision",
      "personal_goals",
      "career_roadmap",
      "daily_priorities",
      "habit_tracker",
      "focus_timer",
      "skills_learning",
      "projects",
      "weekly_review"
    ],
    "required_modules": [
      "personal_vision",
      "personal_goals",
      "daily_priorities"
    ],
    "optional_modules": [
      "projects",
      "resources",
      "career_comparison"
    ],
    "excluded_modules": [],
    "module_reasons": {
      "personal_vision": "Clarifies North Star and shields against decision fatigue.",
      "daily_priorities": "Organizes immediate weekly execution tasks into manageable steps.",
      "career_roadmap": "Provides tangible milestone checkpoints over the next 12 months."
    },
    "module_order": [
      "personal_vision",
      "personal_goals",
      "career_roadmap",
      "daily_priorities",
      "habit_tracker",
      "focus_timer",
      "skills_learning",
      "projects",
      "weekly_review"
    ],
    "dashboard_widgets": [
      "goal_summary",
      "focus_timer",
      "today_priorities",
      "habit_streak",
      "weekly_analytics"
    ],
    "theme": "green"
  },
  "profile": {
    "preferred_name": "${name}",
    "country": "${country}",
    "current_education_or_profession": "${education}",
    "current_career_stage": "${stage}",
    "work_experience": "${experience}",
    "current_field": "${field}"
  },
  "career_direction": {
    "primary_career_direction": "<Chosen primary title or ambition>",
    "career_description": "<2-3 sentence overview of this role/direction>",
    "why_this_direction_was_suggested": "<Objective rationale based on discussion>",
    "key_responsibilities": ["<Responsibility 1>", "<Responsibility 2>"],
    "expected_opportunities": ["<Opportunity 1>", "<Opportunity 2>"],
    "alternative_career_paths": [
      {
        "title": "<Alternative Path 1>",
        "description": "<Why it is a viable alternative>",
        "overlap_score": 85
      }
    ],
    "important_trade_offs": ["<Trade-off 1>", "<Trade-off 2>"],
    "confidence_level": 92
  },
  "strengths_and_skills": {
    "existing_strengths": ["<Strength 1>", "<Strength 2>"],
    "transferable_skills": ["<Skill 1>", "<Skill 2>"],
    "current_technical_skills": ["<Skill 1>", "<Skill 2>"],
    "current_professional_skills": ["<Skill 1>", "<Skill 2>"],
    "skills_to_improve": ["<Area 1>", "<Area 2>"]
  },
  "skill_gaps": [
    {
      "skill_name": "<Skill Name>",
      "current_level": "Beginner",
      "target_level": "Intermediate",
      "priority": "High",
      "explanation": "<Why mastering this is crucial>",
      "recommended_learning_order": 1
    }
  ],
  "long_term_goals": "<Clear 1-3 year ambition>",
  "roadmap": {
    "long_term_goal": "<1-3 year ambition>",
    "short_term_goals": ["<Month 1 goal>", "<Month 3 goal>", "<Month 6 goal>"],
    "milestones": [
      {
        "id": "ms-1",
        "title": "Foundation & Core Fundamentals",
        "description": "Establish baseline competencies and setup workflow.",
        "stage": "Foundation",
        "priority": "High",
        "target_duration": "Weeks 1-4",
        "is_completed": false
      },
      {
        "id": "ms-2",
        "title": "Applied Skills & Practice Sprint",
        "description": "Build first practical prototype demonstrating core principles.",
        "stage": "Skill Development",
        "priority": "High",
        "target_duration": "Month 2",
        "is_completed": false
      },
      {
        "id": "ms-3",
        "title": "Capstone Proof of Work & Showcase",
        "description": "Ship production-grade deliverable to prove market readiness.",
        "stage": "Practical Application",
        "priority": "Medium",
        "target_duration": "Months 3-4",
        "is_completed": false
      }
    ]
  },
  "tasks": [
    {
      "id": "task-1",
      "title": "Conduct discovery review and set weekly practice schedule",
      "description": "Block dedicated uninterrupted deep work hours.",
      "priority": "High",
      "due_date": "This Week",
      "is_completed": false
    },
    {
      "id": "task-2",
      "title": "Audit learning materials and begin Stage 1 practice",
      "description": "Focus strictly on proof-of-work rather than passive reading.",
      "priority": "High",
      "due_date": "Next Week",
      "is_completed": false
    }
  ],
  "habits": [
    {
      "title": "Daily Deep Work Practice",
      "frequency": "daily",
      "target_days_per_week": 6,
      "category": "Skill Mastery"
    },
    {
      "title": "Weekly Progress & Blocker Review",
      "frequency": "weekly",
      "target_days_per_week": 1,
      "category": "Reflection"
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "Initial Proof-of-Work Prototype",
      "description": "Deployable artifact validating primary competence to employers/clients.",
      "skills_developed": ["Core Domain Competence", "Project Architecture"],
      "status": "planned",
      "target_date": "Month 2"
    }
  ],
  "resources": [
    {
      "title": "Official Documentation & Core Reference",
      "type": "Documentation",
      "provider": "Primary Standard",
      "url": "https://developer.mozilla.org/",
      "is_free": true
    }
  ],
  "review_schedule": {
    "next_review_date": "<Date 30 days from now>",
    "reflection_questions": [
      "Did I complete my scheduled weekly deep work blocks?",
      "What concrete proof of work did I ship this month?"
    ]
  },
  "assumptions": [
    "User can commit ~${hours} consistently",
    "Pragmatic portfolio proof outweighs credentials in this domain"
  ]
}
FOYC_DASHBOARD_END
`;
}
