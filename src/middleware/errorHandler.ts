import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode?: number;
  status?: string;

  constructor(message: string, statusCode?: number, status?: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Internal Server Error';

  // Log error for debugging
  console.error('Error:', {
    statusCode,
    status,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404, 'not found');
  next(error);
};

