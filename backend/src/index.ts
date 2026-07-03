import 'dotenv/config';
import { createApp } from './app';

const PORT = process.env.PORT ?? 3001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`G-Scores API is running on http://localhost:${PORT}`);
  console.log(`API Status: http://localhost:${PORT}/api/health`);
});

// Prevent Node process from crashing
// when database connection is lost
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
});

export default app;