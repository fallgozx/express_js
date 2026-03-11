import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../shared/errors/http-error';
import logger from '../config/logger';

export const errorMiddleware = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error(err.message, {
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      timestamp: err.timestamp,
      statusCode: err.statusCode,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
    statusCode: 500,
  });
};

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new HttpError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
