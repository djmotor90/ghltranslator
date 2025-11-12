import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './config/database.js';
import { config, validateConfig } from './config/env.js';
import { authenticateToken, errorHandler } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import accountRoutes from './routes/accounts.js';
import translationRoutes from './routes/translations.js';
import logger from './utils/logger.js';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
logger.info('Registering routes...');
app.use('/api/auth', authRoutes);
logger.info('Auth routes registered');
app.use('/api/accounts', accountRoutes);
logger.info('Accounts routes registered');
app.use('/api/translations', translationRoutes);
logger.info('Translation routes registered');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
logger.info('Health check endpoint registered');

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

async function startServer() {
  try {
    // Validate configuration
    validateConfig();
    logger.info('Configuration validated');

    // Connect to database
    await connectDatabase();
    logger.info('Database connected');

    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to start server: ${errorMessage}`, error);
    process.exit(1);
  }
}

startServer();

export default app;
