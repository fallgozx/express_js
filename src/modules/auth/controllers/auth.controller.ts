import type { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

export const authController = {
 

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  
};

export default authController;
