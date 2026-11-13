import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';

// Cache store for user dashboard plans
const userDashboardStore = new Map<string, any>();

export const getDashboardData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const data = userDashboardStore.get(userId);

  if (!data) {
    // Return default active template
    res.json({
      success: true,
      isDemo: true,
      message: 'Active session loaded from template cache.',
    });
    return;
  }

  res.json({ success: true, data });
};

export const transferAnonymousDraftToUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { approvedPlanDraft } = req.body;

  if (!approvedPlanDraft) {
    res.status(400).json({ success: false, error: 'No approved plan draft provided to transfer.' });
    return;
  }

  userDashboardStore.set(userId, {
    ...approvedPlanDraft,
    userId,
    savedAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'Approved career plan successfully saved to authenticated account.',
    userId,
  });
};

export const reassessDirection = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { newDirection, reason } = req.body;

  const current = userDashboardStore.get(userId);
  if (current && newDirection) {
    current.direction = {
      ...current.direction,
      primaryTitle: newDirection,
      lastReassessedDate: new Date().toLocaleDateString(),
    };
    userDashboardStore.set(userId, current);
  }

  res.json({
    success: true,
    message: 'Career direction successfully recalibrated.',
    newDirection,
  });
};
