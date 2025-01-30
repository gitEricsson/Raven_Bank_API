import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppConfig from '../config/app.config';

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized access: No token provided',
      });
    }

    const decoded = jwt.verify(token, AppConfig.jwt.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      switch (error.name) {
        case 'TokenExpiredError': {
          return res.status(403).json({
            status: false,
            message: 'Session expired!: Login and try again',
          });
        }
        case 'JsonWebTokenError': {
          return res.status(401).json({
            status: false,
            message: 'Invalid token!: Login and try again',
          });
        }
        case 'NotBeforeError': {
          return res.status(401).json({
            status: false,
            message: 'Inactive token!: Login and try again',
          });
        }
        default:
          return next(error);
      }
    }
  }
};
