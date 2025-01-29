import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import {
  accountService,
  ravenService,
  transactionService,
} from '../config/dependencies';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { transactionSchemas } from '../validations/schemas';

const router = Router();

const transactionController: TransactionController = new TransactionController(
  transactionService,
  ravenService,
  accountService
);

/**
 * @swagger
 * /api/transactions/deposit:
 *   post:
 *     summary: Deposit money into an account
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - amount
 *             properties:
 *               accountNumber:
 *                 type: string
 *               amount:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Deposit successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
// router.post(
//   '/deposit',
//   validate(transactionSchemas.deposit),
//   transactionController.deposit
// );

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     summary: Transfer money between accounts
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderAccountNumber
 *               - receiverAccountNumber
 *               - amount
 *             properties:
 *               senderAccountNumber:
 *                 type: string
 *               receiverAccountNumber:
 *                 type: string
 *               amount:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
router.post(
  '/transfer',
  auth,
  validate(transactionSchemas.transfer),
  transactionController.transfer
);

/**
 * @swagger
 * /api/transactions/{accountNumber}/history:
 *   get:
 *     summary: Get transaction history for an account
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get(
  '/:accountNumber/history',
  auth,
  transactionController.getTransactionHistory
);

export default router;
