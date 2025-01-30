import { Request, Response } from 'express';
import UserService from '../services/user.service';

export class UserController {
  constructor(private userService: UserService) {}

  async signup(req: Request, res: Response) {
    try {
      const { firstName, lastName, phone, email, password } = req.body;
      if (!firstName || !lastName || !phone || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const result = await this.userService.signup(
        firstName,
        lastName,
        phone,
        email,
        password
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      return res.json(result);
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const newToken = await this.userService.refreshToken(refreshToken);
      return res.json({ token: newToken });
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  }
}
