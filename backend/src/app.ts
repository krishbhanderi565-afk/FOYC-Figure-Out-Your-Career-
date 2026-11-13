import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/api.js';

export const createApp = () => {
  const app = express();

  // Security: CORS configuration
  app.use(
    cors({
      origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id'],
    })
  );

  // Security: Body parser size limits (500kb max to prevent DoS)
  app.use(express.json({ limit: '500kb' }));
  app.use(express.urlencoded({ extended: true, limit: '500kb' }));

  // Security: Rate limiting
  app.use(rateLimiter(150, 60 * 1000));

  // Mount API Router
  app.use('/api', apiRoutes);

  // Fallback 404 for unknown endpoints
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found.' });
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};
