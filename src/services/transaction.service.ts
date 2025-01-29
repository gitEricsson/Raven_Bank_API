import { Account, Transaction } from '../types';
import AccountRepository from '../repositories/account.repository';
import TransactionRepository from '../repositories/transaction.repository';
import WebhookService from './webhook.service';
import { withTransaction } from '../utils/db';
import { NotFoundError, ValidationError } from '../utils/errors';

export class TransactionService {
  private static instance: TransactionService;

  private constructor(
    private accountRepository: AccountRepository,
    private transactionRepository: TransactionRepository,
    private webhookService: WebhookService
  ) {}

  public static getInstance(
    accountRepository: AccountRepository,
    transactionRepository: TransactionRepository,
    webhookService: WebhookService
  ): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService(
        accountRepository,
        transactionRepository,
        webhookService
      );
    }
    return TransactionService.instance;
  }

  async createDeposit(
    accountNumber: number,
    amount: number
  ): Promise<Transaction> {
    return withTransaction(async (trx) => {
      const account = await this.accountRepository.findByAccountNumber(
        accountNumber,
        trx
      );
      if (!account) {
        throw new NotFoundError('Account not found');
      }

      if (amount <= 0) {
        throw new ValidationError('Amount must be positive');
      }

      const transaction = await this.transactionRepository.create(
        account.id!,
        account.id!,
        amount,
        'DEPOSIT',
        trx
      );

      await this.transactionRepository.updateStatus(
        transaction.id!,
        'COMPLETED',
        trx
      );

      const completedTransaction: Transaction = {
        ...transaction,
        status: 'COMPLETED' as 'COMPLETED',
      };

      await this.webhookService.notifyTransaction(transaction);

      return completedTransaction;
    });
  }

  async createTransfer(
    senderAccount: Account,
    receiverAccount: Account,
    amount: number
  ): Promise<Transaction> {
    return withTransaction(async (trx) => {
      const transaction = await this.transactionRepository.create(
        senderAccount.id!,
        receiverAccount.id!,
        amount,
        'TRANSFER',
        trx
      );

      await this.accountRepository.updateBalance(
        senderAccount.id!,
        senderAccount.balance - amount,
        trx
      );
      await this.accountRepository.updateBalance(
        receiverAccount.id!,
        receiverAccount.balance + amount,
        trx
      );

      await this.transactionRepository.updateStatus(
        transaction.id!,
        'COMPLETED',
        trx
      );

      const completedTransaction: Transaction = {
        ...transaction,
        status: 'COMPLETED',
      };

      await this.webhookService.notifyTransaction(transaction);

      return completedTransaction;
    });
  }

  async getTransactionHistory(accountNumber: number): Promise<Transaction[]> {
    const account = await this.accountRepository.findByAccountNumber(
      accountNumber
    );
    if (!account) {
      throw new NotFoundError('Account not found');
    }

    return this.transactionRepository.findByAccountId(account.id!);
  }
}

export default TransactionService;
