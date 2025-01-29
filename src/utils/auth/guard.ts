import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppConfig from '../../config/app.config';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { Role } from '../../types';

export class Guard {
  private static instance: Guard;

  private constructor() {}

  public static getInstance(): Guard {
    if (!Guard.instance) {
      Guard.instance = new Guard();
    }
    return Guard.instance;
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, AppConfig.jwt.ACCESS_TOKEN_SECRET);
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }

  authorize(roles: Role[] = []) {
    return (req: Request, _res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
          throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = this.verifyToken(token);

        if (roles.length && !roles.includes(decoded.role)) {
          throw new ForbiddenError('Insufficient permissions');
        }

        (req as any).user = decoded;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

export default Guard;
