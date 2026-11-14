import {
  PossibilityQuestionnaireData,
  PossibilityHandoff,
  PossibilityHandoffSchema,
  POSSIBILITY_CATEGORIES,
} from '../types/possibility';
import { LIFE_STAGE_OPTIONS } from '../types/clarity';

/**
 * Generates the Personalized Exploration Master Prompt for ChatGPT
 */
export function generatePossibilityPrompt(
  data: PossibilityQuestionnaireData,
  userName: string = 'Explorer'
): string {
  const safeInterests = Array.isArray(data?.interests) ? data.interests : [];
  const safeSkillsPossessed = Array.isArray(data?.skillsPossessed) ? data.skillsPossessed : [];
  const safeSkillsToDevelop = Array.isArray(data?.skillsToDevelop) ? data.skillsToDevelop : [];
  const safeAmbitions = Array.isArray(data?.ambitions) ? data.ambitions : [];

  const stageOption = LIFE_STAGE_OPTIONS.find((s) => s.key === data?.lifeStage);
  const stageName = data?.lifeStage === 'other' && data?.lifeStageOther?.trim()
    ? data.lifeStageOther.trim()
    : stageOption?.label || 'Career Explorer';

  const backgroundDetails: string[] = [];
  if (data?.educationLevel) backgroundDetails.push(`Education Level: ${data.educationLevel}`);
  if (data?.degreeOrCourse || data?.fieldOfStudy) {
    backgroundDetails.push(`Field / Degree: ${data?.degreeOrCourse || ''} ${data?.fieldOfStudy ? `(${data?.fieldOfStudy})` : ''}`.trim());
  }
  if (data?.currentRole || data?.industry) {
    backgroundDetails.push(`Current Role: ${data?.currentRole || 'In Transition'} ${data?.industry ? `in ${data?.industry}` : ''}`.trim());
  }
  if (data?.yearsExperience) backgroundDetails.push(`Practical Experience: ${data.yearsExperience}`);
  if (data?.certificationsOrAchievements) backgroundDetails.push(`Credentials / Milestones: ${data.certificationsOrAchievements}`);

  return `You are acting as the Senior Multidisciplinary Career Exploration Advisor, Opportunity Researcher, and Strategic Life-Planning Guide collaborating with ${userName} through FOYC (Figure Out Your Career).

==================================================
1. USER PROFILE & EXPLORATION BASELINE
==================================================
- Name: ${userName}
- Current Life / Career Stage: ${stageName}
- Background Context:
${backgroundDetails.length > 0 ? backgroundDetails.map((b) => `  * ${b}`).join('\n') : '  * Self-directed learning & exploratory phase'}

- Natural Curiosities & Interests:
${safeInterests.length > 0 ? safeInterests.map((i) => `  * ${i}`).join('\n') : '  * Broad interdisciplinary interests'}
${data?.interestsOther ? `  * Additional interest notes: "${data.interestsOther}"` : ''}
${data?.curiosityFreeText ? `  * Free-form curiosity reflection: "${data.curiosityFreeText}"` : ''}

- Capabilities & Skills:
  * Skills Currently Possessed: ${safeSkillsPossessed.length > 0 ? safeSkillsPossessed.join(', ') : 'Foundational problem solving & communication'}
  * Skills Eager to Develop: ${safeSkillsToDevelop.join(', ') || 'High-leverage industry capabilities'}

- Core Ambitions & 3–5 Year Horizon:
${safeAmbitions.length > 0 ? safeAmbitions.map((a) => `  * ${a}`).join('\n') : '  * Seeking clarity on personal direction'}
${data?.visionThreeToFiveYears ? `  * Bigger 3–5 Year Vision: "${data.visionThreeToFiveYears}"` : ''}

- Practical Boundaries & Real-Life Reality:
  * Weekly Learning Time: ${data?.timeAvailableWeekly || '5–15 hrs/week'}
  * Learning Budget: ${data?.budgetPreference || 'Free / low-cost resources'}
  * Immediate Income Pressure: ${data?.needImmediateIncome ? 'YES — Needs revenue or income pathway quickly' : 'NO — Has runway for learning & experimentation'}
  * Preferred Work Setting: ${data?.workEnvironment || 'Flexible / Open'}
  * Willingness to Relocate: ${data?.willingnessToRelocate || 'Open'}
  * Risk Tolerance: ${data?.riskTolerance || 'Moderate'}
  * Family / Responsibilities: ${data?.familyResponsibilities || 'Standard daily obligations'}

${data?.additionalNotes ? `Unfiltered Additional Thoughts:\n"${data.additionalNotes}"\n` : ''}

==================================================
2. EXPLORATION OBJECTIVE
==================================================
Most people consider only 2 or 3 familiar careers and miss emerging, hybrid, or alternative opportunities.
Your objective is to discover a **diversified range of 4 to 8 realistic, compelling possibilities** tailored specifically to ${userName}'s background, curious energy, and real-life constraints.

Across your recommendations, ensure you explore candidates across these 7 distinct domains where relevant:
1. Traditional Career Paths (Established professional roles and corporate paths)
2. Emerging & Future Opportunities (AI-adjacent roles, evolving tech, climate/automation opportunities)
3. Entrepreneurship & Business (Boutique agencies, micro-SaaS, productized services, ventures)
4. Freelancing & Independent Work (Remote consulting, client services, portfolio careers)
5. Higher Education & Specialization (Advanced research, specialized credentials, academic tracks)
6. Creative & Unconventional Paths (Content architecture, media, design, creator economy)
7. Hybrid & Alternative Opportunities (Combining two contrasting interests, e.g., Tech + Healthcare, Design + Finance)

==================================================
3. ADVISORY CONVERSATION MANDATES & 5-QUESTION CHECKPOINT RULE
==================================================
Please adhere strictly to these conversational guidelines:
1. STRICT 5-QUESTION LIMIT PER ROUND:
   - Ask only ONE question at a time during our discussion. Never overwhelm me with multiple questions at once.
   - Number and label every question at the top of your message:
     "[Question X of 5 | Round Y]" (e.g. "[Question 1 of 5 | Round 1]").
   - Focus each question on evaluating specific possibilities, testing interest in emerging/hybrid domains, discussing trade-offs, and uncovering risk tolerance.

2. MANDATORY CHECKPOINT AFTER EVERY 5 QUESTIONS:
   After asking 5 questions (at Question 5, Question 10, Question 15, etc.), YOU MUST STOP and ask me this exact checkpoint:

   "🎯 CHECKPOINT (5 Questions Completed):
   We have explored 5 key angles of your possibilities! Where would you like to go next?

   👉 Option A: Generate my personalized dashboard prompt now
      (Produce the complete FOYC POSSIBILITY EXPLORATION REPORT JSON handoff immediately)

   👉 Option B: Continue with deep exploration (Next batch of 5 questions)
      (Explore 5 more targeted questions to discover deeper unconventional and hybrid opportunities)"

3. USER CHOICE HANDLING:
   - If I select Option A (or ask to generate the report/handoff at any point): STOP immediately and output the FOYC POSSIBILITY EXPLORATION REPORT JSON handoff code block below.
   - If I select Option B: Advance to the next round with "[Question 1 of 5 | Round 2]". Present the checkpoint again after 5 questions.
4. Do NOT force all 7 categories if a category makes no sense for the user, but do surprise them with non-obvious, realistic options.
5. For every possibility: explain exactly WHY it matches the user, the required skills, entry requirements, realistic preparation timeframe, challenges, and AI impact.
6. Be candid about trade-offs, entry barriers, and financial realities. Avoid empty motivational clichés ("follow your passion").
7. Guide me until we have discussed and shortlisted the most compelling possibilities.

==================================================
4. FINAL HANDOFF REQUIREMENT (CRITICAL)
==================================================
At the conclusion of our discussion, you MUST output a section titled:

FOYC POSSIBILITY EXPLORATION REPORT — STRUCTURED HANDOFF

Followed by a single, valid JSON code block that exactly adheres to the schema below. This JSON will be parsed directly by FOYC to build my interactive Possibility Explorer Report, comparison matrices, and live Career Dashboard.

\`\`\`json
{
  "schema_version": "1.0",
  "profile": {
    "user_name": "${userName}",
    "life_stage": "${stageName}",
    "current_context": "Short summary of background",
    "education": "${data.degreeOrCourse || data.educationLevel || 'Self-directed'}",
    "experience": "${data.currentRole || 'In transition'}",
    "interests": ${JSON.stringify(data.interests)},
    "skills_possessed": ${JSON.stringify(data.skillsPossessed)},
    "skills_to_develop": ${JSON.stringify(data.skillsToDevelop)},
    "ambitions": ${JSON.stringify(data.ambitions)},
    "practical_boundaries": {
      "learning_hours_per_week": "${data.timeAvailableWeekly || '5–15 hrs/week'}",
      "budget": "${data.budgetPreference || 'Free to Low'}",
      "immediate_income_needed": ${data.needImmediateIncome ? true : false},
      "location_preference": "${data.workEnvironment || 'Flexible'}",
      "risk_tolerance": "${data.riskTolerance || 'Moderate'}"
    }
  },
  "exploration_summary": {
    "key_discoveries": [
      "Discovery 1: Unexpected intersection...",
      "Discovery 2: High leverage of existing skills...",
      "Discovery 3: Low-barrier entry opportunity..."
    ],
    "summary": "2–3 paragraphs summarizing the landscape of what the user could pursue.",
    "high_level_insight": "The single most strategic breakthrough perspective."
  },
  "possibilities": [
    {
      "id": "pos-1",
      "name": "Opportunity Name (e.g., Growth UX & Product Experimenter)",
      "category": "Hybrid & Alternative Opportunities",
      "fit_level": "Potentially Strong Fit",
      "description": "Clear explanation of the role, day-to-day work, and operating model.",
      "why_it_matches": "Direct connections to the user's specific skills and curiosities.",
      "required_skills": ["Skill 1", "Skill 2", "Skill 3"],
      "entry_requirements": "Portfolio of 2 case studies; no specialized master degree needed.",
      "estimated_preparation_time": "4–6 months",
      "estimated_cost": "Under $100 in courses/tools",
      "opportunities": ["High autonomous impact", "Strong remote hiring demand"],
      "challenges": ["Requires self-directed portfolio building", "Competitive entry bar"],
      "ai_impact": "AI tools automate wireframing, enabling faster iteration; judgment and user research remain deeply human.",
      "evidence_and_sources": "Referenced from tech design hiring benchmarks and practitioner communities.",
      "confidence_and_uncertainties": "Strong market demand; uncertainty lies in local vs international remote options."
    }
  ],
  "shortlisted_options": ["Opportunity Name 1", "Opportunity Name 2"],
  "recommended_experiments": [
    {
      "id": "exp-1",
      "possibility_name": "Opportunity Name 1",
      "title": "Build a 1-day proof of work artifact",
      "type": "Micro-Project",
      "description": "Create a mini prototype or teardown solving a real problem in this domain.",
      "estimated_time": "3–4 hours",
      "difficulty": "Beginner",
      "is_completed": false
    }
  ],
  "next_steps": [
    {
      "id": "step-1",
      "timeframe": "Immediate Actions",
      "task": "Review shortlisted possibilities and select 1 low-risk experiment",
      "completed": false,
      "notes": "Focus on rapid validation"
    }
  ],
  "open_questions": [
    "What specific portfolio format best proves competence to buyers or employers in this niche?",
    "Should I pursue freelance clients first or target a salaried role?"
  ],
  "suggested_review_date": "YYYY-MM-DD"
}
\`\`\`

Let's begin! Please introduce yourself, validate your understanding of my situation, and present the first set of diversified possibilities for us to explore.`;
}

/**
 * Robust JSON extraction and validation for Possibility Explorer
 */
export function parsePossibilityHandoff(rawText: string): {
  success: boolean;
  data?: PossibilityHandoff;
  errors: string[];
  warnings: string[];
} {
  if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 30) {
    return {
      success: false,
      errors: ['Submission is empty. Please paste your complete FOYC POSSIBILITY EXPLORATION REPORT block from ChatGPT.'],
      warnings: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Extract JSON from markdown fence or raw text
  let rawJsonStr = '';
  const jsonFenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonFenceMatch && jsonFenceMatch[1]) {
    rawJsonStr = jsonFenceMatch[1].trim();
  } else {
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      rawJsonStr = rawText.slice(firstBrace, lastBrace + 1).trim();
    }
  }

  if (!rawJsonStr) {
    return {
      success: false,
      errors: [
        'Could not locate a valid JSON object. Ensure you copied the final "FOYC POSSIBILITY EXPLORATION REPORT — STRUCTURED HANDOFF" section including the ```json block.',
      ],
      warnings: [],
    };
  }

  // 2. Parse JSON safely
  let parsedObj: any = null;
  try {
    parsedObj = JSON.parse(rawJsonStr);
  } catch (err: any) {
    try {
      const sanitized = rawJsonStr
        .replace(/,\s*([\]}])/g, '$1') // remove trailing commas
        .replace(/[\u201C\u201D]/g, '"') // replace curly quotes
        .replace(/\n\s*\/\/.*/g, ''); // strip inline comments
      parsedObj = JSON.parse(sanitized);
      warnings.push('Sanitization applied to fix JSON syntax.');
    } catch {
      return {
        success: false,
        errors: [`JSON Syntax Error: ${err?.message || 'Invalid JSON'}. Check that ChatGPT completed the full code block.`],
        warnings: [],
      };
    }
  }

  // 3. Normalize & Graceful Schema Validation
  if (!parsedObj || typeof parsedObj !== 'object') {
    return {
      success: false,
      errors: ['Parsed content is not a valid JSON object.'],
      warnings: [],
    };
  }

  const norm: any = { ...parsedObj };

  // Profile normalization
  norm.profile = {
    user_name: norm.profile?.user_name || norm.user_name || 'Explorer',
    life_stage: norm.profile?.life_stage || norm.life_stage || 'Career Exploration',
    current_context: norm.profile?.current_context || norm.current_context || 'Personal career exploration',
    education: norm.profile?.education || norm.education || 'Self-directed pathway',
    experience: norm.profile?.experience || norm.experience || 'In active career exploration',
    interests: Array.isArray(norm.profile?.interests) ? norm.profile.interests : Array.isArray(norm.interests) ? norm.interests : [],
    skills_possessed: Array.isArray(norm.profile?.skills_possessed) ? norm.profile.skills_possessed : Array.isArray(norm.skillsPossessed) ? norm.skillsPossessed : [],
    skills_to_develop: Array.isArray(norm.profile?.skills_to_develop) ? norm.profile.skills_to_develop : Array.isArray(norm.skillsToDevelop) ? norm.skillsToDevelop : [],
    ambitions: Array.isArray(norm.profile?.ambitions) ? norm.profile.ambitions : Array.isArray(norm.ambitions) ? norm.ambitions : [],
    practical_boundaries: {
      learning_hours_per_week: norm.profile?.practical_boundaries?.learning_hours_per_week || '5–15 hrs/week',
      budget: norm.profile?.practical_boundaries?.budget || 'Free to Low',
      immediate_income_needed: !!norm.profile?.practical_boundaries?.immediate_income_needed,
      location_preference: norm.profile?.practical_boundaries?.location_preference || 'Flexible',
      risk_tolerance: norm.profile?.practical_boundaries?.risk_tolerance || 'Moderate',
    },
  };

  // Exploration summary normalization
  norm.exploration_summary = {
    key_discoveries: Array.isArray(norm.exploration_summary?.key_discoveries) ? norm.exploration_summary.key_discoveries : [
      'High leverage identified across your current strengths and emerging tools.',
      'Viable alternative pathways uncovered with realistic ramp-up timeframes.',
    ],
    summary: norm.exploration_summary?.summary || 'Diversified range of career and entrepreneurial possibilities explored.',
    high_level_insight: norm.exploration_summary?.high_level_insight || 'Focusing on building tangible proof-of-work accelerates career transitions.',
  };

  // Possibilities normalization
  let possList: any[] = [];
  if (Array.isArray(norm.possibilities) && norm.possibilities.length > 0) {
    possList = norm.possibilities.map((p: any, idx: number) => ({
      id: p.id || `pos-${idx + 1}`,
      name: p.name || p.title || `Opportunity ${idx + 1}`,
      category: p.category || 'Hybrid & Alternative Opportunities',
      fit_level: p.fit_level || 'Potentially Strong Fit',
      description: p.description || '',
      why_it_matches: p.why_it_matches || p.reasoning || 'Matches your curiosities and practical boundaries.',
      required_skills: Array.isArray(p.required_skills) ? p.required_skills : ['Core Domain Skills', 'Tooling'],
      entry_requirements: p.entry_requirements || 'Portfolio case study',
      estimated_preparation_time: p.estimated_preparation_time || '3–6 months',
      estimated_cost: p.estimated_cost || 'Under $100',
      opportunities: Array.isArray(p.opportunities) ? p.opportunities : ['Autonomous impact', 'Flexible remote work'],
      challenges: Array.isArray(p.challenges) ? p.challenges : ['Requires self-directed execution'],
      ai_impact: p.ai_impact || 'AI automates routine tasks, increasing individual leverage.',
      evidence_and_sources: p.evidence_and_sources || 'Industry practitioner benchmarks',
      confidence_and_uncertainties: p.confidence_and_uncertainties || 'High viability with disciplined execution.',
      is_shortlisted: !!p.is_shortlisted,
    }));
  } else {
    possList = [
      {
        id: 'pos-1',
        name: 'Growth Product & Workflow Orchestrator',
        category: 'Hybrid & Alternative Opportunities',
        fit_level: 'High Fit',
        description: 'Combines product thinking, user research, and AI-accelerated workflows.',
        why_it_matches: 'High synergy with your strengths and flexible work style.',
        required_skills: ['Product Strategy', 'Workflow Automation', 'Rapid Prototyping'],
        entry_requirements: '2 documented case studies',
        estimated_preparation_time: '3–5 months',
        estimated_cost: 'Free/Low',
        opportunities: ['High market demand', 'Remote flexibility'],
        challenges: ['Requires consistent portfolio building'],
        ai_impact: 'AI tools accelerate prototyping; strategic judgment remains human.',
        evidence_and_sources: 'Tech hiring data',
        confidence_and_uncertainties: 'Strong alignment with moderate learning curve.',
        is_shortlisted: true,
      },
    ];
  }
  norm.possibilities = possList;
  norm.shortlisted_options = Array.isArray(norm.shortlisted_options) && norm.shortlisted_options.length > 0
    ? norm.shortlisted_options
    : [possList[0].name];

  // Recommended experiments
  if (!Array.isArray(norm.recommended_experiments) || norm.recommended_experiments.length === 0) {
    norm.recommended_experiments = [
      {
        id: 'exp-1',
        possibility_name: possList[0].name,
        title: 'Build a 1-day proof of work artifact',
        type: 'Micro-Project',
        description: 'Create a mini prototype or teardown solving a real problem in this domain.',
        estimated_time: '3–4 hours',
        difficulty: 'Beginner',
        is_completed: false,
      },
    ];
  }

  // Next steps
  if (!Array.isArray(norm.next_steps) || norm.next_steps.length === 0) {
    norm.next_steps = [
      {
        id: 'step-1',
        timeframe: 'Immediate Actions',
        task: `Review day-to-day requirements and 3 job openings for ${possList[0].name}`,
        completed: false,
        notes: 'Focus on rapid validation',
      },
    ];
  }

  norm.open_questions = Array.isArray(norm.open_questions) ? norm.open_questions : ['What specific portfolio format best proves competence in this niche?'];
  norm.suggested_review_date = norm.suggested_review_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const validation = PossibilityHandoffSchema.safeParse(norm);
  const finalData: PossibilityHandoff = validation.success ? validation.data : (norm as PossibilityHandoff);

  return {
    success: true,
    data: finalData,
    errors: [],
    warnings,
  };
}

/**
 * Returns a rich realistic sample Possibility Report for fast demo / preview testing
 */
export function getSamplePossibilityHandoff(userName: string = 'Alex'): PossibilityHandoff {
  return {
    schema_version: '1.0',
    profile: {
      user_name: userName,
      life_stage: 'Career Switcher',
      current_context: 'Digital marketer exploring technology, design, and independent venture opportunities',
      education: 'B.A. Communications & Media',
      experience: '3 years in digital marketing, campaign analytics & content strategy',
      interests: ['Technology & AI Systems', 'Design, UX & Visual Creativity', 'Business & Entrepreneurship'],
      skills_possessed: ['Written Communication & Storytelling', 'Data Analysis & Quantitative Reasoning', 'Customer Research & User Empathy'],
      skills_to_develop: ['Visual Design & Prototyping', 'Prompt Engineering & Applied AI Tools', 'Software Development & Coding'],
      ambitions: ['Work 100% remotely with location autonomy', 'Start and run my own business or venture', 'Become financially independent with high earning velocity'],
      practical_boundaries: {
        learning_hours_per_week: '10–15 hrs/week',
        budget: 'Under $200 for courses/tools',
        immediate_income_needed: false,
        location_preference: '100% Remote',
        risk_tolerance: 'Moderate',
      },
    },
    exploration_summary: {
      key_discoveries: [
        'Your marketing analytics background is exceptionally rare when combined with Figma UX design, creating an immediate niche in "Growth Design".',
        'You do not need a computer science degree to build micro-SaaS: no-code platforms and AI code-assistants allow rapid prototyping of niche business tools.',
        'Independent consulting in AI prompt workflows and content ops offers immediate near-term income without sacrificing long-term product ambitions.',
      ],
      summary:
        'Alex stands at an enviable intersection where persuasive communication and analytical intuition can unlock non-traditional pathways. Rather than returning to university or starting at the bottom of standard software engineering, the optimal landscape bridges marketing psychology with interactive digital product creation.',
      high_level_insight:
        'Avoid conventional single-lane paths. Build a hybrid identity as an "Interactive Product & Growth Specialist" that leverages past experience while acquiring hands-on prototyping skills.',
    },
    possibilities: [
      {
        id: 'pos-1',
        name: 'Growth Product & UX Designer',
        category: 'Hybrid & Alternative Opportunities',
        fit_level: 'Potentially Strong Fit',
        description:
          'Design conversion funnels, onboarding flows, and user experiences that directly drive retention and revenue. Bridges user empathy with business analytics.',
        why_it_matches:
          'Combines Alex’s existing marketing metrics & copy skills with Figma prototyping. Highly sought after by tech startups.',
        required_skills: ['Figma Auto-Layout & Design Systems', 'User Research & Testing', 'Funnel Analytics & A/B Testing', 'Micro-Copywriting'],
        entry_requirements: 'Portfolio of 2 comprehensive teardown & redesign case studies; no formal design degree required.',
        estimated_preparation_time: '4–6 months (10–12 hrs/wk)',
        estimated_cost: '$50–$150 (Figma subscription & UX courses)',
        opportunities: [
          'Strong global remote demand across seed & Series A tech companies',
          'High autonomous ownership and creative control',
          'Direct springboard into senior Product Management',
        ],
        challenges: [
          'Requires mastering visual polish and design critique',
          'Portfolio must prove quantifiable business impact, not just pretty screens',
        ],
        ai_impact:
          'AI generates UI wireframes rapidly, elevating the designer from a pixel-pusher to a strategic problem solver and user researcher.',
        evidence_and_sources: 'AngelList & Wellfound remote design compensation indices; DesignOps practitioner reports.',
        confidence_and_uncertainties: 'High market demand; uncertainty is Alex’s initial comfort with visual critique.',
        is_shortlisted: true,
        status: 'interested',
        user_notes: 'Top contender. Matches my creative urge and uses my analytical past.',
      },
      {
        id: 'pos-2',
        name: 'Boutique AI Content & Workflow Agency Founder',
        category: 'Entrepreneurship & Business',
        fit_level: 'Potentially Strong Fit',
        description:
          'Build and productize custom AI content generation and automation pipelines for mid-market B2B companies looking to scale their marketing operations.',
        why_it_matches:
          'Direct monetization of Alex’s copywriting background and prompt engineering interest. Zero outside capital required.',
        required_skills: ['Make.com / Zapier Automation', 'Advanced LLM Prompt Architecture', 'B2B Client Outreach & Sales', 'Process Documentation'],
        entry_requirements: 'Working prototype system and 1 verifiable case study showing 50% time savings for a pilot client.',
        estimated_preparation_time: '2–3 months',
        estimated_cost: 'Under $100 for API tokens and automation software',
        opportunities: [
          'Immediate revenue potential through $2,000–$5,000/month recurring retainer contracts',
          'Complete ownership of schedule and client portfolio',
          'Option to scale from solo consultant into a boutique agency',
        ],
        challenges: [
          'Constant client acquisition pressure and sales outreach',
          'Client education on AI capabilities and managing unrealistic expectations',
        ],
        ai_impact:
          'The core business leverages AI capabilities; staying current with tool ecosystems is an ongoing requirement.',
        evidence_and_sources: 'B2B automation consultant pricing case studies and Upwork agency metrics.',
        confidence_and_uncertainties: 'Very high cash-flow potential; depends on appetite for client sales.',
        is_shortlisted: true,
        status: 'interested',
        user_notes: 'Could be run as a high-margin business alongside personal projects.',
      },
      {
        id: 'pos-3',
        name: 'Full-Stack Software Engineer (Web & Mobile)',
        category: 'Traditional Career Paths',
        fit_level: 'Worth Exploring',
        description:
          'Build end-to-end software applications, handling responsive frontend interfaces, server APIs, and database architecture.',
        why_it_matches:
          'Fulfills ambition of technical mastery and high financial independence, but requires a steep foundational ramp.',
        required_skills: ['TypeScript & JavaScript', 'React / Next.js', 'Node.js & Express', 'SQL & Database Architecture'],
        entry_requirements: 'Production-ready CRUD application deployed with auth, tests, and documentation on GitHub.',
        estimated_preparation_time: '9–12 months dedicated practice',
        estimated_cost: 'Free to $200 (Self-paced open source curricula)',
        opportunities: [
          'Vast global hiring market and enduring foundational stability',
          'Unlocks ability to build any digital idea independently',
        ],
        challenges: [
          'Steeper learning curve requiring sustained debugging resilience',
          'Underutilizes Alex’s existing writing and customer intuition in the early stages',
        ],
        ai_impact:
          'AI assists syntax and boilerplate coding, but system design, edge cases, and architectural clarity are crucial.',
        evidence_and_sources: 'Stack Overflow Developer Survey and GitHub State of the Octoverse.',
        confidence_and_uncertainties: 'High long-term upside, but longer ramp before first income.',
        is_shortlisted: false,
        status: 'not_sure',
        user_notes: 'Solid fallback, but might be slower than hybrid UX or agency.',
      },
      {
        id: 'pos-4',
        name: 'Technical Copywriter & Developer Advocate',
        category: 'Freelancing & Independent Work',
        fit_level: 'Worth Exploring',
        description:
          'Author deep technical guides, product documentation, API tutorials, and architectural breakdown articles for developer tool companies.',
        why_it_matches:
          'Instant monetization of writing capabilities as technical skills are developed. Rates range from $500–$1,500 per article.',
        required_skills: ['Technical Writing', 'Markdown & Git', 'Basic Code Literacy', 'Developer Persona Empathy'],
        entry_requirements: 'Publish 3 well-researched technical breakdowns on personal blog or dev.to.',
        estimated_preparation_time: '1–2 months',
        estimated_cost: '$0 (Completely free with existing tools)',
        opportunities: [
          'Rapid cash flow while learning technology stacks',
          'High hourly rates and flexible asynchronous schedule',
        ],
        challenges: [
          'Project-based revenue requires continuous pipeline management',
          'Must continually digest complex technical specs quickly',
        ],
        ai_impact:
          'Surface-level writing is commoditized; deep, opinionated, tested code tutorials command premium rates.',
        evidence_and_sources: 'WhoPaysTechnicalWriters community data.',
        confidence_and_uncertainties: 'Very predictable entry; low barriers.',
        is_shortlisted: false,
        status: 'save_later',
        user_notes: 'Great bridge to earn freelance income while studying UX.',
      },
      {
        id: 'pos-5',
        name: 'Micro-SaaS Indie Founder (Solo Software Business)',
        category: 'Creative & Unconventional Paths',
        fit_level: 'Ambitious Long-Term',
        description:
          'Identify focused niche problems for small businesses, build lightweight web apps, and charge $19–$99/month recurring subscriptions.',
        why_it_matches:
          'Aligns with autonomy ambition and passion for entrepreneurship. Leverages marketing distribution to stand out.',
        required_skills: ['Rapid Prototyping', 'Customer Pain Point Discovery', 'Stripe Billing & Auth', 'SEO & Organic Distribution'],
        entry_requirements: 'A live monetized MVP solving a verified problem with at least 5 paying beta customers.',
        estimated_preparation_time: '6–8 months to first revenue',
        estimated_cost: '$100–$300 (Domain, hosting, API keys)',
        opportunities: [
          'Pure passive cash flow and equity ownership',
          '100% intellectual freedom and zero boss/clients',
        ],
        challenges: [
          'High initial failure rate: 80% of first micro-SaaS products make $0',
          'Requires disciplined distribution beyond just coding',
        ],
        ai_impact:
          'Allows solo founders to ship software that previously required teams of 5 engineers.',
        evidence_and_sources: 'Indie Hackers community revenue verifications and MicroConf benchmarks.',
        confidence_and_uncertainties: 'Highest ultimate upside, but highest variance.',
        is_shortlisted: true,
        status: 'interested',
        user_notes: 'My ultimate 3-5 year dream. Best pursued after building cash runway.',
      },
    ],
    shortlisted_options: [
      'Growth Product & UX Designer',
      'Boutique AI Content & Workflow Agency Founder',
      'Micro-SaaS Indie Founder (Solo Software Business)',
    ],
    recommended_experiments: [
      {
        id: 'exp-1',
        possibility_name: 'Growth Product & UX Designer',
        title: 'Run a 3-hour teardown of a SaaS onboarding flow',
        type: 'Micro-Project',
        description: 'Take an app you use daily (e.g., Notion, Spotify), screen-record your signup, identify 3 UX friction points, and sketch improved wireframes in Figma.',
        estimated_time: '3 hours',
        difficulty: 'Beginner',
        is_completed: true,
      },
      {
        id: 'exp-2',
        possibility_name: 'Boutique AI Content & Workflow Agency Founder',
        title: 'Build an automated content repurposing workflow in Make.com',
        type: 'Prototype',
        description: 'Connect an RSS feed to OpenAI API and output formatted LinkedIn posts and newsletter snippets automatically.',
        estimated_time: '4 hours',
        difficulty: 'Beginner',
        is_completed: false,
      },
      {
        id: 'exp-3',
        possibility_name: 'Growth Product & UX Designer',
        title: 'Conduct an informal informational interview with a remote UX designer',
        type: 'Interview Professional',
        description: 'Reach out to 2 mid-level product designers on LinkedIn to ask about their actual daily routine and portfolio tips.',
        estimated_time: '1 hour',
        difficulty: 'Beginner',
        is_completed: false,
      },
    ],
    next_steps: [
      {
        id: 'step-1',
        timeframe: 'Immediate Actions',
        task: 'Select between Growth UX and Agency model as the primary 6-month focus',
        completed: false,
        notes: 'Compare daily energy required vs income speed',
      },
      {
        id: 'step-2',
        timeframe: "This Week's Actions",
        task: 'Set up Figma and complete the official Auto-Layout interactive tutorial',
        completed: false,
        notes: 'Focus on hands-on building',
      },
      {
        id: 'step-3',
        timeframe: "This Month's Actions",
        task: 'Complete and publish Case Study #1 on personal portfolio site',
        completed: false,
        notes: 'Document problem, iterations, and metrics',
      },
      {
        id: 'step-4',
        timeframe: 'Longer-Term Exploration',
        task: 'Validate micro-SaaS problem space while working as Growth UX Designer',
        completed: false,
        notes: 'Long-term equity milestone',
      },
    ],
    open_questions: [
      'Should I target early-stage startups where I wear multiple hats, or established tech companies with dedicated design teams?',
      'How quickly can I secure my first freelance UX audit client to validate market demand?',
    ],
    suggested_review_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  };
}
