import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../shared/errors/http-error';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1] || '';
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new UnauthorizedError('Invalid token');
    }

    req.user = decoded as { id: string; email: string };
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1] || '';
      const decoded = verifyToken(token);
      
      if (decoded) {
        req.user = decoded as { id: string; email: string };
      }
    }
    next();
  } catch (error) {
    next();
  }
};
