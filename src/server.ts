import app from './app';
import logger from './utils/logger';
import AppConfig from './config/app.config';
import { cleanupService } from './config/dependencies';
import { db } from './config/database';

const port = AppConfig.server.port;

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  cleanupService.startJobs();
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down server...');

  // Stop cleanup jobs
  cleanupService.stopJobs();

  // Close server
  server.close(() => {
    logger.info('HTTP server closed');
  });

  // Close database connections
  try {
    await db.destroy();
    logger.info('Database connections closed');
  } catch (error) {
    logger.error('Error closing database connections:', error);
  }

  // Exit process
  process.exit(0);
};

// Handle termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default server;
