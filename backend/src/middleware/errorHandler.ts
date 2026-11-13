import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[FOYC Backend Error]', err?.message || err);

  const statusCode = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An internal server error occurred. Please try again later.'
      : err.message || 'Unknown error occurred.';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
