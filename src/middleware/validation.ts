import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        });

        throw new AppError(
          `Validation error: ${errorMessages.join(', ')}`,
          400
        );
      }
      next(error);
    }
  };
};

