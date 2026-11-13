import {
  CareerDashboardData,
  CareerDirection,
  Milestone,
  TaskItem,
  HabitItem,
  ProjectItem,
  ResourceItem,
  UserProfile,
  UserReflection,
} from '../types/career';
import { parseAndValidateFoycHandoff, FoycHandoff } from '../types/foyc-handoff';

export interface ParseResult {
  success: boolean;
  data?: CareerDashboardData;
  errors: string[];
  warnings: string[];
  canonicalHandoff?: FoycHandoff;
}

/**
 * Deterministic Handoff Parser
 * Prioritizes canonical JSON schema (FOYC_DASHBOARD_START ... FOYC_DASHBOARD_END)
 * with robust Zod validation, falling back gracefully to legacy text format if necessary.
 */
export function parseHandoffText(
  pastedText: string,
  existingProfile: UserProfile,
  existingReflection: UserReflection
): ParseResult {
  if (!pastedText || typeof pastedText !== 'string' || pastedText.trim().length < 20) {
    return {
      success: false,
      errors: ['The input is empty. Please paste your complete FOYC handoff block from ChatGPT.'],
      warnings: [],
    };
  }

  // 1. Try canonical JSON parsing first (Zod validated)
  const jsonResult = parseAndValidateFoycHandoff(pastedText);

  if (jsonResult.success && jsonResult.data) {
    const d = jsonResult.data;

    // Transform canonical schema into CareerDashboardData for dashboard template
    const dashboardData: CareerDashboardData = {
      profile: {
        preferredName: d.profile.preferred_name || existingProfile.preferredName || 'Explorer',
        ageRange: existingProfile.ageRange || '18-22',
        country: d.profile.country || existingProfile.country || 'Global',
        educationStatus: existingProfile.educationStatus || 'college-student',
        currentField: d.profile.current_field || existingProfile.currentField || 'Career Exploration',
        careerStage: existingProfile.careerStage || 'exploring',
        workExperience: d.profile.work_experience || existingProfile.workExperience || 'Not specified',
        preferredLanguage: existingProfile.preferredLanguage || 'English',
        availableHoursPerWeek: existingProfile.availableHoursPerWeek || 15,
      },
      reflection: existingReflection,
      direction: {
        primaryTitle: d.career_direction.primary_career_direction || 'Career Direction',
        summary: d.career_direction.career_description || '',
        matchReason: d.career_direction.why_this_direction_was_suggested || '',
        longTermGoal: d.long_term_goals || d.roadmap.long_term_goal || '',
        shortTermObjective: d.roadmap.short_term_goals?.[0] || '',
        alternativeTitles: d.career_direction.alternative_career_paths.map((p) =>
          typeof p === 'string' ? p : p.title
        ),
        fitScore: typeof d.career_direction.confidence_level === 'number'
          ? d.career_direction.confidence_level
          : parseInt(String(d.career_direction.confidence_level).replace(/\D/g, '') || '95', 10),
        strengths: d.strengths_and_skills?.existing_strengths?.length
          ? d.strengths_and_skills.existing_strengths
          : (d.strengths || []),
        existingSkills: d.strengths_and_skills?.current_technical_skills || (d.existing_skills || []),
        skillGaps: d.skill_gaps.map((sg) => sg.skill_name),
        detailedSkillGaps: d.skill_gaps,
        reassessmentQuestions: d.review_schedule?.reflection_questions || [],
        assumptions: d.assumptions || [],
        lastReassessedDate: new Date().toISOString().split('T')[0],
      } as any,
      milestones: (d.roadmap.milestones.length ? d.roadmap.milestones : (d.milestones || [])).map((m, idx) => ({
        id: m.id || `ms-${idx + 1}`,
        title: m.title,
        description: m.description,
        priority: (m.priority?.toLowerCase() === 'high' ? 'high' : m.priority?.toLowerCase() === 'low' ? 'low' : 'medium') as any,
        stage: (m.stage as any) || 'Foundation',
        estimatedDuration: m.target_duration || 'Weeks 1-4',
        targetDate: 'Week 4',
        completed: m.is_completed || false,
        associatedTasksCount: 3,
      })),
      tasks: d.tasks.map((t, idx) => ({
        id: t.id || `task-${idx + 1}`,
        title: t.title,
        description: t.description,
        category: 'Technical' as any,
        priority: (t.priority?.toLowerCase() === 'high' ? 'high' : t.priority?.toLowerCase() === 'low' ? 'low' : 'medium') as any,
        dueDate: t.due_date || 'Next Week',
        completed: t.is_completed || false,
        notes: t.related_milestone ? `Related milestone: ${t.related_milestone}` : undefined,
      })),
      habits: d.habits.map((h, idx) => ({
        id: h.id || `habit-${idx + 1}`,
        title: h.title,
        frequency: (h.frequency?.toLowerCase() === 'weekly' ? 'weekly' : 'daily') as any,
        targetDaysPerWeek: h.frequency?.toLowerCase() === 'weekly' ? 2 : 5,
        currentStreak: h.streak || 0,
        bestStreak: h.streak || 0,
        completedToday: h.completed_today || false,
        history: {},
        category: h.category || 'Focus',
      })),
      projects: d.projects.map((p, idx) => ({
        id: p.id || `proj-${idx + 1}`,
        title: p.title,
        description: p.description,
        skillsDeveloped: p.skills_developed || [],
        status: (p.status === 'completed' ? 'completed' : p.status === 'in_progress' ? 'in-progress' : 'planned') as any,
        targetDate: 'Month 3',
        projectUrl: p.github_url || p.live_demo_url || undefined,
      })),
      resources: d.resources.map((r, idx) => ({
        id: r.id || `res-${idx + 1}`,
        title: r.title,
        type: (['Documentation', 'Course', 'Book', 'Video', 'Practice', 'Certification'].includes(r.resource_type)
          ? r.resource_type
          : 'Documentation') as any,
        provider: 'Official Reference',
        url: r.url || '#',
        isVerified: r.is_verified ?? true,
        isFree: true,
      })),
    };

    return {
      success: true,
      data: dashboardData,
      errors: [],
      warnings: [],
      canonicalHandoff: d,
    };
  }

  // If JSON parsing failed with an explicit error
  if (jsonResult.error && pastedText.includes('FOYC_DASHBOARD_START')) {
    return {
      success: false,
      errors: [jsonResult.error],
      warnings: [],
    };
  }

  // 2. Legacy text delimiter parsing (backwards compatibility)
  function extractSection(text: string, tag: string): string | null {
    const regex = new RegExp(`---BEGIN FOYC ${tag}---([\\s\\S]*?)---END FOYC ${tag}---`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  const dirBlock = extractSection(pastedText, 'CAREER DIRECTION');
  const roadmapBlock = extractSection(pastedText, 'SKILL ROADMAP');
  const milestonesBlock = extractSection(pastedText, 'MILESTONES');
  const tasksBlock = extractSection(pastedText, 'TASKS');

  if (!dirBlock && !roadmapBlock && !tasksBlock) {
    return {
      success: false,
      errors: [
        jsonResult.error ||
          'Could not find standard FOYC handoff markers (FOYC_DASHBOARD_START ... FOYC_DASHBOARD_END). Make sure to request ChatGPT for your final handoff prompt and copy the complete block.',
      ],
      warnings: [],
    };
  }

  // Parse Career Direction from legacy text
  let primaryTitle = 'Modern Career Explorer';
  let summary = 'A customized development plan designed around your natural strengths and interests.';
  let matchReason = 'High alignment with your problem-solving interests.';
  let longTermGoal = 'Achieve professional mastery in 2-3 years.';
  let shortTermObjective = 'Master fundamental core competencies.';
  const alternativeTitles: string[] = [];
  const strengths: string[] = [];
  const skillGaps: string[] = [];

  if (dirBlock) {
    const lines = dirBlock.split('\n').map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (line.toLowerCase().startsWith('primary:') || line.toLowerCase().startsWith('primary direction:')) {
        primaryTitle = line.split(':')[1].trim().replace(/\*\*/g, '');
      } else if (line.toLowerCase().startsWith('summary:') || line.toLowerCase().startsWith('overview:')) {
        summary = line.split(':')[1].trim().replace(/\*\*/g, '');
      } else if (line.toLowerCase().startsWith('why:') || line.toLowerCase().startsWith('reason:')) {
        matchReason = line.split(':')[1].trim().replace(/\*\*/g, '');
      } else if (line.toLowerCase().startsWith('long-term goal:') || line.toLowerCase().startsWith('long term:')) {
        longTermGoal = line.split(':')[1].trim().replace(/\*\*/g, '');
      } else if (line.toLowerCase().startsWith('short-term objective:') || line.toLowerCase().startsWith('short term:')) {
        shortTermObjective = line.split(':')[1].trim().replace(/\*\*/g, '');
      } else if (line.toLowerCase().startsWith('alternative:') || line.toLowerCase().startsWith('alternatives:')) {
        alternativeTitles.push(...line.split(':')[1].split(',').map((s) => s.trim().replace(/\*\*/g, '')));
      } else if (line.toLowerCase().startsWith('strengths:')) {
        strengths.push(...line.split(':')[1].split(',').map((s) => s.trim().replace(/\*\*/g, '')));
      } else if (line.toLowerCase().startsWith('gaps:') || line.toLowerCase().startsWith('skill gaps:')) {
        skillGaps.push(...line.split(':')[1].split(',').map((s) => s.trim().replace(/\*\*/g, '')));
      }
    }
  }

  const legacyDashboardData: CareerDashboardData = {
    profile: existingProfile,
    reflection: existingReflection,
    direction: {
      primaryTitle,
      summary,
      matchReason,
      longTermGoal,
      shortTermObjective,
      alternativeTitles: alternativeTitles.length ? alternativeTitles : ['Adjacent Technical Role'],
      fitScore: 94,
      strengths: strengths.length ? strengths : ['Logical thinking', 'Continuous learning'],
      existingSkills: ['Problem Solving', 'Communication'],
      skillGaps: skillGaps.length ? skillGaps : ['Advanced system architecture'],
      detailedSkillGaps: skillGaps.map((g, idx) => ({
        skill_name: g,
        current_level: 'Beginner',
        target_level: 'Intermediate',
        priority: 'High',
        explanation: 'Identified during initial discovery.',
        recommended_learning_order: idx + 1,
      })),
      reassessmentQuestions: ['Are you still energized by this direction?'],
      assumptions: ['10-15 hours dedicated weekly commitment'],
      lastReassessedDate: new Date().toISOString().split('T')[0],
    } as any,
    milestones: [
      {
        id: 'ms-1',
        title: 'Foundation & Core Architecture',
        description: 'Master core tools and principles.',
        priority: 'high',
        stage: 'Foundation',
        estimatedDuration: 'Weeks 1-4',
        targetDate: 'Week 4',
        completed: true,
        associatedTasksCount: 3,
      },
      {
        id: 'ms-2',
        title: 'Practical Application & Projects',
        description: 'Build end-to-end projects demonstrating competence.',
        priority: 'high',
        stage: 'Practical Application',
        estimatedDuration: 'Weeks 5-10',
        targetDate: 'Week 10',
        completed: false,
        associatedTasksCount: 2,
      },
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Set up development workspace and core dependencies',
        description: 'Install required tools and configure editor.',
        category: 'Foundation',
        priority: 'high',
        completed: true,
        dueDate: 'Week 1',
      },
    ],
    habits: [
      {
        id: 'habit-1',
        title: '45 mins daily deep work session',
        frequency: 'daily',
        targetDaysPerWeek: 5,
        category: 'Skill Building',
        currentStreak: 3,
        bestStreak: 5,
        completedToday: true,
        history: {},
      },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Foundational Capstone System',
        description: 'Demonstrating core competency in chosen path.',
        skillsDeveloped: ['Architecture', 'Implementation'],
        status: 'in-progress',
        targetDate: 'Month 2',
      },
    ],
    resources: [
      {
        id: 'res-1',
        title: 'Official Documentation & Guides',
        type: 'Documentation',
        provider: 'Official Reference',
        url: '#',
        isVerified: true,
        isFree: true,
      },
    ],
  };

  return {
    success: true,
    data: legacyDashboardData,
    errors: [],
    warnings: ['Parsed via legacy text format. Recommended: update to FOYC_DASHBOARD_START JSON format.'],
  };
}
