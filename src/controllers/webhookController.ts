import { Request, Response, NextFunction } from 'express';
import WebhookLogRepository from '../repositories/webhookLog.repository';
import RavenAtlasService from '../services/ravenAtlas.service';
import { UnauthorizedError } from '../utils/errors';
import AppConfig from '../config/app.config';
// import logger from '../utils/logger';
import WebhookService from 'src/services/webhook.service';

export class WebhookController {
  constructor(
    private webhookService: WebhookService,
    private webhookLogRepository: WebhookLogRepository,
    private ravenService: RavenAtlasService
  ) {}

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const webhookSecret = req.headers['x-webhook-secret'];

      if (webhookSecret !== AppConfig.webhook.secret) {
        throw new UnauthorizedError('Invalid webhook secret');
      }

      const { event, data } = req.body;

      // Log webhook event to database
      await this.webhookService.create(event, data);

      // Process webhook with Raven service
      await this.ravenService.handleWebhook({ event, data });

      return res.json({ received: true });
    } catch (error) {
      return next(error);
    }
  }

  async getLogs(_req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await this.webhookLogRepository.getLogs();
      return res.json(logs);
    } catch (error) {
      return next(error);
    }
  }
}

// async function handleTransactionCompleted(data: any) {
//   logger.info('Transaction completed:', data);
// }

// async function handleTransactionFailed(data: any) {
//   logger.info('Transaction failed:', data);
// }
