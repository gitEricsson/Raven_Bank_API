import { Knex } from 'knex';
import { db } from '../config/database';

export interface WebhookLog {
  id?: number;
  event: string;
  data: Record<string, any>;
  created_at?: Date;
}

export class WebhookLogRepository {
  private static instance: WebhookLogRepository;

  private constructor() {}

  public static getInstance(): WebhookLogRepository {
    if (!WebhookLogRepository.instance) {
      WebhookLogRepository.instance = new WebhookLogRepository();
    }
    return WebhookLogRepository.instance;
  }

  async create(
    event: string,
    data: Record<string, any>,
    trx?: Knex.Transaction
  ): Promise<WebhookLog> {
    const query = (trx || db)('webhook_logs');
    const [logId] = await query.insert({
      event,
      data: JSON.stringify(data),
    });

    const log = await this.findById(logId, trx);
    if (!log) {
      throw new Error('Failed to create webhook log');
    }
    return log;
  }

  async findById(
    id: number,
    trx?: Knex.Transaction
  ): Promise<WebhookLog | undefined> {
    const log = await (trx || db)('webhook_logs').where('id', id).first();
    if (log) {
      log.data = JSON.parse(log.data);
    }
    return log;
  }

  async getLogs(limit = 100): Promise<WebhookLog[]> {
    const logs = await db('webhook_logs')
      .orderBy('created_at', 'desc')
      .limit(limit);
    return logs.map((log) => ({
      ...log,
      data: JSON.parse(log.data),
    }));
  }
}

export default WebhookLogRepository;
