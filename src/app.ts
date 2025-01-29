import express from 'express';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/auth.routes';
import accountRoutes from './routes/account.routes';
import transactionRoutes from './routes/transaction.routes';
import webhookRoutes from './routes/webhook.routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import { requestLogger, errorLogger } from './middleware/logging';
import { securityMiddleware } from './middleware/security';
import { specs } from './docs/swagger';

const app = express();

// Security middleware
app.use(securityMiddleware);

// Basic middleware
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
app.use(requestLogger);

// Rate limiting
app.use(apiLimiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/users', authLimiter, userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorLogger);
app.use(errorHandler);

// Handle 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
