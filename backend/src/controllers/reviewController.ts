import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';

interface WeeklyReview {
  id: string;
  userId: string;
  reviewDate: string;
  accomplishments: string;
  blockers: string;
  lessons: string;
  nextPriorities: string;
  directionSatisfaction: 'satisfied' | 'hesitant' | 'reassessing';
  generatedSuggestions?: string[];
  createdAt: string;
}

const reviewStore = new Map<string, WeeklyReview[]>();

export const getReviews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const reviews = reviewStore.get(userId) || [];
  res.json({ success: true, reviews });
};

export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { accomplishments, blockers, lessons, nextPriorities, directionSatisfaction } = req.body;

  if (!accomplishments || !nextPriorities) {
    res.status(400).json({
      success: false,
      error: 'Accomplishments and next week priorities are required.',
    });
    return;
  }

  // Generate automated suggestions based on blockers
  const generatedSuggestions: string[] = [];
  if (blockers && blockers.length > 5) {
    generatedSuggestions.push(`Dedicate the first 45-min daily block on Monday exclusively to unblocking: "${blockers.slice(0, 60)}..."`);
  }
  generatedSuggestions.push('Schedule one checkpoint on Wednesday to evaluate progress before Sunday review.');

  const newReview: WeeklyReview = {
    id: `rev-${Date.now()}`,
    userId,
    reviewDate: new Date().toISOString().split('T')[0],
    accomplishments,
    blockers: blockers || '',
    lessons: lessons || '',
    nextPriorities,
    directionSatisfaction: directionSatisfaction || 'satisfied',
    generatedSuggestions,
    createdAt: new Date().toISOString(),
  };

  const userReviews = reviewStore.get(userId) || [];
  userReviews.unshift(newReview);
  reviewStore.set(userId, userReviews);

  res.status(201).json({
    success: true,
    review: newReview,
    message: 'Weekly reflection recorded successfully.',
  });
};
