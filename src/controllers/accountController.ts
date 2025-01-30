import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import AccountService from '../services/account.service';
import RavenAtlasService from '../services/ravenAtlas.service';

export class AccountController {
  constructor(
    private accountService: AccountService,
    private ravenAtlasService: RavenAtlasService
  ) {}

  async createAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const account = await this.ravenAtlasService.createVirtualAccount(
        req.user!.id,
        req.user!.email,
        req.user!.firstName,
        req.user!.lastName,
        req.user!.phone,
        req.body.amount || 0
      );
      return res.status(201).json(account);
    } catch (error) {
      return next(error);
    }
  }

  async getAccounts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const accounts = await this.accountService.getAccountsByUserId(
        req.user!.id
      );
      return res.json(accounts);
    } catch (error) {
      return next(error);
    }
  }

  async getAllAccounts(_req: Request, res: Response, next: NextFunction) {
    try {
      const accounts = await this.accountService.getAllAccounts();
      return res.json(accounts);
    } catch (error) {
      return next(error);
    }
  }
}
