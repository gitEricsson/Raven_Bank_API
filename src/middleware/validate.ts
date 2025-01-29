import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ValidationError } from '../utils/errors';

export const validate = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      throw new ValidationError(errorMessage);
    }

    next();
  };
};
