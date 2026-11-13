import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdminClient } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Authorization header missing or malformed.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Handle demo authentication token for instant local review
  if (token === 'demo-token' || token.startsWith('demo-user-')) {
    req.userId = '00000000-0000-0000-0000-000000000001';
    req.userEmail = 'alex.chen@example.com';
    return next();
  }

  const supabaseAdmin = getSupabaseAdminClient();
  if (supabaseAdmin) {
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !user) {
        res.status(401).json({ success: false, error: 'Invalid or expired session token.' });
        return;
      }
      req.userId = user.id;
      req.userEmail = user.email;
      return next();
    } catch (err) {
      res.status(401).json({ success: false, error: 'Authentication verification failed.' });
      return;
    }
  }

  // Fallback for development if keys are pending
  req.userId = '00000000-0000-0000-0000-000000000001';
  req.userEmail = 'developer@foyc.local';
  next();
};
