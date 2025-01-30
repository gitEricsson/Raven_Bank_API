import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppConfig from '../config/app.config';

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, AppConfig.jwt.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      switch (error.name) {
        case 'TokenExpiredError': {
          error.message = 'Session expired!: Login and try again';
          res.status(403).json({
            status: false,
            message: error.message,
          });
          break;
        }
        case 'JsonWebTokenError': {
          error.message = 'Invalid token!: Login and try again';
          res.status(401).json({
            status: false,
            message: error.message,
          });
          break;
        }
        case 'NotBeforeError': {
          error.message = 'Inactive token!: Login and try again';
          res.status(401).json({
            status: false,
            message: error.message,
          });
          break;
        }
        default:
          next(error);
          break;
      }
    }
    res.status(401).json({ error: 'Please authenticate' });
  }
};
