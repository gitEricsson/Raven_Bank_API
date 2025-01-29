import { Router } from 'express';
import { AccountController } from '../controllers/accountController';
import { accountService } from '../config/dependencies';
import { guard } from '../config/dependencies';
import { Role } from '../types';

const router = Router();

const accountController: AccountController = new AccountController(
  accountService
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
router.post('/', guard.authorize([Role.USER]), accountController.createAccount);

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
router.get('/', guard.authorize([Role.USER]), accountController.getAccounts);

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
  guard.authorize([Role.ADMIN]),
  accountController.getAllAccounts
);

export default router;
