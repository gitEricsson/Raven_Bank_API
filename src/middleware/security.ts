import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import AppConfig from '../config/app.config';

// Rate limiting configuration
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});

// CORS configuration
export const corsOptions = {
  origin: AppConfig.server.baseURL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600,
};

// Security headers middleware
export const securityHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
};

// Combine all security middleware
export const securityMiddleware = [
  helmet(),
  hpp(),
  cors(corsOptions),
  limiter,
  securityHeaders,
];
