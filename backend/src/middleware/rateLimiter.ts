import { Request, Response, NextFunction } from 'express';

const ipRequests = new Map<string, { count: number; resetAt: number }>();

export const rateLimiter = (maxRequests = 100, windowMs = 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const entry = ipRequests.get(ip);

    if (!entry || now > entry.resetAt) {
      ipRequests.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please slow down and try again shortly.',
      });
      return;
    }

    next();
  };
};
