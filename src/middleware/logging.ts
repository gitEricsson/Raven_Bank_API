import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request processed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
    });
  });

  next();
};

export const errorLogger = (
  error: Error,
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next(error);
};
