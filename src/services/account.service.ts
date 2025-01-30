import { Account } from '../types/interface';
import AccountRepository from '../repositories/account.repository';
import { NotFoundError } from '../utils/errors';

export class AccountService {
  private static instance: AccountService;

  private constructor(private accountRepository: AccountRepository) {}

  public static getInstance(
    accountRepository: AccountRepository
  ): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService(accountRepository);
    }
    return AccountService.instance;
  }

  async getAccountsByUserId(userId: number): Promise<Account[]> {
    return this.accountRepository.findByUserId(userId);
  }

  async getAccountByNumber(accountNumber: number): Promise<Account> {
    const account = await this.accountRepository.findByAccountNumber(
      accountNumber
    );
    if (!account) {
      throw new NotFoundError('Account not found');
    }
    return account;
  }

  async getAllAccounts(): Promise<Account[]> {
    return this.accountRepository.findAll();
  }
}

export default AccountService;
