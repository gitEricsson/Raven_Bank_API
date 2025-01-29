import axios from 'axios';
import { Transaction } from '../types';
import AppConfig from '../config/app.config';
import WebhookLogRepository from 'src/repositories/webhookLog.repository';

export class WebhookService {
  private static instance: WebhookService;
  private webhookLogRepository: WebhookLogRepository;

  private constructor(webhookLogRepository: WebhookLogRepository) {
    this.webhookLogRepository = webhookLogRepository;
  }

  public static getInstance(
    webhookLogRepository: WebhookLogRepository
  ): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService(webhookLogRepository);
    }
    return WebhookService.instance;
  }

  async notifyTransaction(transaction: Transaction): Promise<void> {
    try {
      await axios.post(
        AppConfig.webhook.url,
        { transaction },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': AppConfig.webhook.secret,
          },
        }
      );
    } catch (error) {
      console.error('Failed to send webhook notification:', error);
    }
  }

  async create(event: string, data: any): Promise<void> {
    try {
      // Log webhook event to database
      await this.webhookLogRepository.create(event, data);
    } catch (error) {
      console.error('Failed to create webhook log:', error);
    }
  }
}

export default WebhookService;
