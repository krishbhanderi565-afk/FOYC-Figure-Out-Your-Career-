import { Request, Response } from 'express';

export const generatePrompt = async (req: Request, res: Response): Promise<void> => {
  const { profile, reflection } = req.body;

  if (!reflection || typeof reflection.mindText !== 'string') {
    res.status(400).json({
      success: false,
      error: 'A personal reflection with your thoughts or confusion is required.',
    });
    return;
  }

  const name = profile?.preferredName || 'there';
  const age = profile?.ageRange || 'not specified';
  const country = profile?.country || 'Global';
  const education = profile?.educationStatus || 'flexible background';
  const field = profile?.currentField || 'general discipline';
  const stage = profile?.careerStage || 'exploring';
  const experience = profile?.workExperience || 'none mentioned';
  const hours = profile?.availableHoursPerWeek ? `${profile.availableHoursPerWeek} hrs/week` : 'flexible';

  const prompt = `You are the official FOYC (Figure Out Your Career) Career Discovery Partner & Pragmatic Career Coach.
Your mission is to guide me from career confusion to genuine career clarity through a natural, empathetic, and objective 1-on-1 discussion.

MY BACKGROUND & CONTEXT:
- Name: ${name}
- Age: ${age}
- Location: ${country}
- Background: ${education}
- Current Field: ${field}
- Career Stage: ${stage}
- Experience: ${experience}
- Dedicated Commitment: ${hours}

WHAT IS CURRENTLY ON MY MIND:
"""
${reflection.mindText}
"""

CRITICAL COACHING RULES:
1. Speak naturally like a senior mentor who truly cares about my personal success.
2. Ask only ONE focused follow-up question per message. Do not overwhelm me with questionnaires.
3. Understand my authentic interests, motivations, existing skills, and real-life constraints.
4. Explore and compare 2 to 3 realistic career directions. Avoid unrealistic promises.
5. At the end of the discussion, explicitly ask:
   "Would you like me to prepare your personalized FOYC Career Dashboard Prompt? This will organize everything we discussed into FOYC's dashboard format so you can create your personalized career roadmap, checklist and habit tracker."
6. Offer clear YES and NO options.
7. ONLY when I reply "YES", output the final structured FOYC HANDOFF JSON block strictly between:
   FOYC_DASHBOARD_START
   { ... JSON ... }
   FOYC_DASHBOARD_END

Please start by warmly greeting me and asking me your first question.`;

  res.json({
    success: true,
    prompt,
    characterCount: prompt.length,
    handoffMarkers: {
      start: 'FOYC_DASHBOARD_START',
      end: 'FOYC_DASHBOARD_END',
    },
  });
};
