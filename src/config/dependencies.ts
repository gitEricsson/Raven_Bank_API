import UserRepository from '../repositories/auth.repository';
import AccountRepository from '../repositories/account.repository';
import TransactionRepository from '../repositories/transaction.repository';
import UserService from '../services/user.service';
import AccountService from '../services/account.service';
import TransactionService from '../services/transaction.service';
import WebhookService from '../services/webhook.service';
import TokenService from '../services/token.service';
import Guard from '../middleware/guard';
import { HashService } from '../utils/hashService';
import CleanupService from '../services/cleanup.service';
import RefreshTokenRepository from '../repositories/refreshToken.repository';
import WebhookLogRepository from '../repositories/webhookLog.repository';
import RavenAtlasService from '../services/ravenAtlas.service';
import { UserController } from '../controllers/userController';
import { AccountController } from '../controllers/accountController';
import { TransactionController } from '../controllers/transactionController';
import { WebhookController } from '../controllers/webhookController';

// Utils instances
export const hashService = new HashService();
export const guard = Guard.getInstance();

// Repository instances
export const userRepository = UserRepository.getInstance();
export const accountRepository = AccountRepository.getInstance();
export const transactionRepository = TransactionRepository.getInstance();
export const refreshTokenRepository = RefreshTokenRepository.getInstance();
export const webhookLogRepository = WebhookLogRepository.getInstance();

// Service instances
export const tokenService = TokenService.getInstance(refreshTokenRepository);
export const userService = UserService.getInstance(
  userRepository,
  hashService,
  tokenService
);
export const accountService = AccountService.getInstance(accountRepository);
export const webhookService = WebhookService.getInstance(webhookLogRepository);
export const transactionService = TransactionService.getInstance(
  accountRepository,
  transactionRepository,
  webhookService
);

// Payment gateway services
export const ravenService = RavenAtlasService.getInstance(
  accountRepository,
  transactionService
);

// Maintenance services
export const cleanupService = CleanupService.getInstance(
  refreshTokenRepository
);

// Auth dependencies
export const authDependencies: [Guard, UserRepository, TokenService] = [
  guard,
  userRepository,
  tokenService,
];

// Controller instances
export const userController = new UserController(userService);
export const accountController = new AccountController(
  accountService,
  ravenService
);
export const transactionController = new TransactionController(
  transactionService,
  ravenService,
  accountService
);
export const webhookController = new WebhookController(
  webhookService,
  webhookLogRepository,
  ravenService
);
