import 'dotenv/config';
import { createApp } from './app';

const PORT = process.env.PORT ?? 3001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`G-Scores API is running on http://localhost:${PORT}`);
  console.log(`API Status: http://localhost:${PORT}/api/health`);
});

export default app;