import { Router } from 'express';
import { WebhookController } from '../controllers/webhookController';
import {
  guard,
  ravenService,
  webhookLogRepository,
  webhookService,
} from '../config/dependencies';
import { Role } from '../types/enums';
import { auth } from '../middleware/auth';

const router = Router();

const webhookController: WebhookController = new WebhookController(
  webhookService,
  webhookLogRepository,
  ravenService
);

/**
 * @swagger
 * /api/webhooks:
 *   post:
 *     summary: Handle incoming webhooks
 *     tags: [Webhooks]
 *     security:
 *       - WebhookSecret: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *               - data
 *             properties:
 *               event:
 *                 type: string
 *                 enum: [transaction.completed, transaction.failed]
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 */
router.post('/', webhookController.handleWebhook.bind(webhookController));

/**
 * @swagger
 * /api/webhooks/logs:
 *   get:
 *     summary: Get webhook logs (Admin only)
 *     tags: [Webhooks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of webhook logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   event:
 *                     type: string
 *                   data:
 *                     type: object
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
router.get(
  '/logs',
  auth,
  guard.authorize([Role.ADMIN]),
  webhookController.getLogs.bind(webhookController)
);

export default router;
