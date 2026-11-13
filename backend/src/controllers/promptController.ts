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
  const language = profile?.preferredLanguage || 'English';

  const prompt = `You are a world-class, empathetic, and objective career discovery mentor working with FOYC (Figure Out Your Career).
Your goal is to guide me from career confusion to career clarity.

CRITICAL INSTRUCTIONS FOR CHATGPT:
1. Do NOT generate a final career plan or overwhelming list immediately.
2. Adopt a conversational, supportive, and non-judgmental tone.
3. Ask me ONE clear question at a time to explore my thoughts, strengths, and underlying hesitation.
4. Progressively guide me through these 5 phases:
   - Phase A: Deeply understand my situation, passions, and core motivations.
   - Phase B: Identify my authentic strengths and transferable skills.
   - Phase C: Unpack the root causes of my confusion and misconceptions.
   - Phase D: Explore and contrast 2 to 3 realistic, high-potential career paths.
   - Phase E: Help me choose a clear primary direction and design immediate micro-experiments.
5. Once we reach clarity and I am satisfied with our chosen direction, explicitly ask me:
   "Would you like me to create your personalized FOYC Career Dashboard Handoff Prompt? This will organize everything we discussed into a structured career roadmap, learning checklist, milestones and habit tracker that you can import directly into FOYC."
6. ONLY when I reply "YES" or confirm, output the final structured FOYC HANDOFF BLOCK using the exact delimited markers:
   ---BEGIN FOYC CAREER DIRECTION---
   ---BEGIN FOYC SKILL ROADMAP---
   ---BEGIN FOYC MILESTONES---
   ---BEGIN FOYC TASKS---
   ---BEGIN FOYC HABITS---
   ---BEGIN FOYC PROJECTS---
   ---BEGIN FOYC RESOURCES---
   ---BEGIN FOYC ASSUMPTIONS---

MY BACKGROUND & CONTEXT:
- Name: ${name}
- Age bracket: ${age}
- Location/Country: ${country}
- Education/Status: ${education}
- Current Field/Discipline: ${field}
- Career Stage: ${stage}
- Prior Experience: ${experience}
- Dedicated Learning Time: ${hours}
- Preferred Language: ${language}

WHAT'S CURRENTLY ON MY MIND & MY RAW CONFUSION:
"""
${reflection.mindText}
"""

Please start by warmly greeting me and asking me your first question to understand my core dilemma.`;

  res.json({
    success: true,
    prompt,
    characterCount: prompt.length,
  });
};
