import { Request, Response } from 'express';
import crypto from 'crypto';

interface AnonymousSession {
  sessionId: string;
  profileData: any;
  originalReflection: string;
  generatedPrompt?: string;
  approvedPlanDraft?: any;
  status: 'active' | 'handoff_imported' | 'converted_to_user';
  createdAt: number;
  expiresAt: number;
}

// In-memory sessions store
const sessionsMap = new Map<string, AnonymousSession>();

export const createOrGetSession = async (req: Request, res: Response): Promise<void> => {
  const headerVal = req.headers['x-session-id'];
  const existingId = typeof headerVal === 'string' ? headerVal : undefined;

  if (existingId && sessionsMap.has(existingId)) {
    const session = sessionsMap.get(existingId)!;
    res.json({ success: true, session });
    return;
  }

  const sessionId = crypto.randomUUID();
  const newSession: AnonymousSession = {
    sessionId,
    profileData: {},
    originalReflection: '',
    status: 'active',
    createdAt: Date.now(),
    expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
  };

  sessionsMap.set(sessionId, newSession);
  res.status(201).json({ success: true, session: newSession });
};

export const updateSession = async (req: Request, res: Response): Promise<void> => {
  const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const { profileData, originalReflection, approvedPlanDraft } = req.body;

  let session = sessionsMap.get(sessionId);
  if (!session) {
    session = {
      sessionId,
      profileData: {},
      originalReflection: '',
      status: 'active',
      createdAt: Date.now(),
      expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
    };
    sessionsMap.set(sessionId, session);
  }

  if (profileData) session.profileData = { ...session.profileData, ...profileData };
  if (originalReflection !== undefined) session.originalReflection = originalReflection;
  if (approvedPlanDraft) session.approvedPlanDraft = approvedPlanDraft;

  res.json({ success: true, session });
};

export const getSessionDraft = async (req: Request, res: Response): Promise<void> => {
  const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const session = sessionsMap.get(sessionId);

  if (!session) {
    res.status(404).json({ success: false, error: 'Discovery session not found or expired.' });
    return;
  }

  res.json({ success: true, session });
};
