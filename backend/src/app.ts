import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import scoreRoutes from './routes/scores';

export function createApp(): Application {
  const app = express();

  // Middlewares
  app.use(cors({
    origin: process.env.FRONTEND_URL ?? '*',
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
  }));
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  // app.use('/api/scores', scoreRoutes);

  // 404 Route
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  });

  return app;
}
