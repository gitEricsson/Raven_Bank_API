import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import UserService from 'src/services/user.service';

export class TokenController {
  constructor(private authService: UserService) {}

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      const newToken = await this.authService.refreshToken(refreshToken);
      return res.json({ token: newToken });
    } catch (error) {
      return next(error);
    }
  }
}
