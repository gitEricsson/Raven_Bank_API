import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { ValidationError } from '../utils/errors';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  handler: (_req: Request, _res: Response) => {
    throw new ValidationError('Rate limit exceeded');
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 failed login attempts per hour
  message: 'Too many login attempts, please try again later',
  handler: (_req: Request, _res: Response) => {
    throw new ValidationError('Too many login attempts');
  },
});
