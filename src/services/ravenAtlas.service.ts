import axios from 'axios';
import AppConfig from '../config/app.config';
import logger from '../utils/logger';
import {
  ApiError,
  InsufficientFundsError,
  NotFoundError,
  ValidationError,
} from '../utils/errors';
import AccountRepository from '../repositories/account.repository';
import { Account } from '../types';
import TransactionService from './transaction.service';

interface TransferData {
  account_number: number;
  bank_code: number;
  amount: number;
  narration: string;
}

interface RavenResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface RavenTransferResponse {
  reference: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  message?: string;
}

interface RavenAccountResponse {
  account_name: string;
  account_number: string;
  bank_code: string;
}

interface RavenBankResponse {
  name: string;
  code: string;
}

interface RavenWebhookData {
  reference: string;
  account_number: number;
  amount: number;
  status: string;
  failure_reason?: string;
}

export class RavenAtlasService {
  private static instance: RavenAtlasService;
  private readonly client;

  private constructor(
    private accountRepository: AccountRepository,
    private transactionService: TransactionService
  ) {
    this.client = axios.create({
      baseURL: AppConfig.raven.apiUrl,
      headers: {
        Authorization: `Bearer ${AppConfig.raven.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        logger.error('Raven API Error:', {
          status: error.response?.status,
          data: error.response?.data,
        });
        throw new ApiError(
          `Raven API Error: ${
            (error.response?.data as any)?.message || error.message
          }`
        );
      }
    );
  }

  public static getInstance(
    accountRepository: AccountRepository,
    transactionService: TransactionService
  ): RavenAtlasService {
    if (!RavenAtlasService.instance) {
      RavenAtlasService.instance = new RavenAtlasService(
        accountRepository,
        transactionService
      );
    }
    return RavenAtlasService.instance;
  }

  async createVirtualAccount(
    userId: number,
    userEmail: string
  ): Promise<Account> {
    try {
      const response: any = await this.client.post('/virtual-accounts', {
        email: userEmail,
        name: `User-${userId}`,
      });

      const virtualAccountNumber = response.data.account_number;

      return this.accountRepository.create(userId, virtualAccountNumber);
    } catch (error) {
      throw new Error(`Failed to create virtual account: ${error.message}`);
    }
  }

  async initiateTransfer(
    transferData: TransferData,
    senderAccountNumber: number
  ) {
    try {
      if (senderAccountNumber === transferData.account_number) {
        throw new ValidationError(
          'Sender and receiver account numbers cannot be the same'
        );
      }

      const [senderAccount, receiverAccount] = await Promise.all([
        this.accountRepository.findByAccountNumber(senderAccountNumber),
        this.accountRepository.findByAccountNumber(transferData.account_number),
      ]);

      if (!senderAccount || !receiverAccount) {
        throw new NotFoundError('One or both accounts not found');
      }

      if (senderAccount.balance < transferData.amount) {
        throw new InsufficientFundsError();
      }

      const response = await this.client.post<
        RavenResponse<RavenTransferResponse>
      >('/transfers', transferData);

      logger.info('Transfer initiated:', {
        accountNumber: transferData.account_number,
        amount: transferData.amount,
        reference: response.data.data.reference,
      });

      const transaction = await this.transactionService.createTransfer(
        senderAccount,
        receiverAccount,
        transferData.amount
      );

      return transaction;
    } catch (error) {
      logger.error('Failed to initiate transfer:', {
        error,
        transferData,
      });
      throw error;
    }
  }

  async verifyAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<RavenAccountResponse> {
    try {
      const response = await this.client.get<
        RavenResponse<RavenAccountResponse>
      >(`/banks/accounts/verify`, {
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        },
      });

      return {
        account_name: response.data.data.account_name,
        account_number: response.data.data.account_number,
        bank_code: response.data.data.bank_code,
      };
    } catch (error) {
      logger.error('Failed to verify account:', {
        error,
        accountNumber,
        bankCode,
      });
      throw error;
    }
  }

  async getBanks(): Promise<RavenBankResponse[]> {
    try {
      const response = await this.client.get<
        RavenResponse<RavenBankResponse[]>
      >('/banks');
      return response.data.data.map((bank) => ({
        name: bank.name,
        code: bank.code,
      }));
    } catch (error) {
      logger.error('Failed to fetch banks:', error);
      throw error;
    }
  }

  async getTransferStatus(
    reference: string
  ): Promise<Pick<RavenTransferResponse, 'status' | 'message'>> {
    try {
      const response = await this.client.get<
        RavenResponse<RavenTransferResponse>
      >(`/transfers/${reference}`);

      return {
        status: response.data.data.status,
        message: response.data.data.message,
      };
    } catch (error) {
      logger.error('Failed to get transfer status:', {
        error,
        reference,
      });
      throw error;
    }
  }

  async handleWebhook(payload: {
    event: string;
    data: RavenWebhookData;
  }): Promise<void> {
    try {
      const { event, data } = payload;

      logger.info('Processing Raven webhook:', {
        event,
        reference: data.reference,
      });

      switch (event) {
        case 'transfer.success':
          await this.handleTransferSuccess(data);
          break;
        case 'transfer.failed':
          await this.handleTransferFailed(data);
          break;
        default:
          logger.warn('Unhandled webhook event:', event);
      }
    } catch (error) {
      logger.error('Failed to process webhook:', error);
      throw error;
    }
  }

  private async handleTransferSuccess(data: RavenWebhookData): Promise<void> {
    await this.accountRepository.updateBalanceByAccountNumber(
      data.account_number,
      data.amount
    );

    await this.transactionService.createDeposit(
      data.account_number,
      data.amount
    );

    logger.info('Transfer successful:', {
      reference: data.reference,
      amount: data.amount,
    });
  }

  private async handleTransferFailed(data: RavenWebhookData): Promise<void> {
    logger.error('Transfer failed:', {
      reference: data.reference,
      reason: data.failure_reason,
    });
  }
}

export default RavenAtlasService;
