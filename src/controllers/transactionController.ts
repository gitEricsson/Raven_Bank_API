import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import TransactionService from '../services/transaction.service';
import AccountService from '../services/account.service';
import RavenAtlasService from 'src/services/ravenAtlas.service';

export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private ravenAtlasService: RavenAtlasService,
    private accountService: AccountService
  ) {}

  // async deposit(req: Request, res: Response) {
  //   try {
  //     const { accountNumber, amount } = req.body;

  //     if (!accountNumber || !amount || amount <= 0) {
  //       return res.status(400).json({
  //         error: 'Account number and positive amount are required',
  //       });
  //     }

  //     const transaction = await this.transactionService.createDeposit(
  //       accountNumber,
  //       amount
  //     );
  //     return res.status(201).json(transaction);
  //   } catch (error) {
  //     return res.status(400).json({ error: (error as Error).message });
  //   }
  // }

  async transfer(req: AuthRequest, res: Response) {
    try {
      const {
        senderAccountNumber,
        receiverAccountNumber,
        bank_code,
        amount,
        narration,
      } = req.body;

      if (
        !senderAccountNumber ||
        !receiverAccountNumber ||
        !amount ||
        amount <= 0
      ) {
        return res.status(400).json({
          error:
            'Sender account, receiver account, and positive amount are required',
        });
      }

      const userAccounts = await this.accountService.getAccountsByUserId(
        req.user!.id
      );
      const isOwner = userAccounts.some(
        (account) => account.account_number === senderAccountNumber
      );

      if (!isOwner) {
        return res.status(403).json({
          error: 'You can only initiate transfers from your own accounts',
        });
      }

      const transaction = await this.ravenAtlasService.initiateTransfer(
        {
          account_number: receiverAccountNumber,
          bank_code: bank_code,
          amount,
          narration,
        },
        senderAccountNumber
      );

      return res.status(201).json(transaction);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getTransactionHistory(req: AuthRequest, res: Response) {
    try {
      const { accountNumber } = req.params;

      const userAccounts = await this.accountService.getAccountsByUserId(
        req.user!.id
      );
      const isOwner = userAccounts.some(
        (account) => account.account_number === accountNumber
      );

      if (!isOwner) {
        return res.status(403).json({
          error: 'You can only view transactions for your own accounts',
        });
      }

      const transactions = await this.transactionService.getTransactionHistory(
        +accountNumber
      );
      return res.json(transactions);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}
