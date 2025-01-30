import { Router } from 'express';
import { AccountController } from '../controllers/accountController';
import { accountService, ravenService } from '../config/dependencies';
import { guard } from '../config/dependencies';
import { Role } from '../types';
import { auth } from '../middleware/auth';

const router = Router();

const accountController: AccountController = new AccountController(
  accountService,
  ravenService
);

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */
router.post(
  '/',
  auth,
  guard.authorize([Role.USER]),
  accountController.createAccount.bind(accountController)
);

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts for authenticated user
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 */
router.get(
  '/',
  auth,
  guard.authorize([Role.USER]),
  accountController.getAccounts.bind(accountController)
);

/**
 * @swagger
 * /api/accounts/all:
 *   get:
 *     summary: Get all accounts (Admin only)
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 */
router.get(
  '/all',
  auth,
  guard.authorize([Role.ADMIN]),
  accountController.getAllAccounts.bind(accountController)
);

export default router;
