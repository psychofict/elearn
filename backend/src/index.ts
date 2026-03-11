import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import settingsRoutes from './routes/settings.js';
import analyticsRoutes from './routes/analytics.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'elearn-api', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`eLearn API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
