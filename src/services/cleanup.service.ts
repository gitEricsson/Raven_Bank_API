import { CronJob } from 'cron';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import logger from '../utils/logger';

export class CleanupService {
  private static instance: CleanupService;
  private refreshTokenCleanupJob: CronJob;

  private constructor(private refreshTokenRepository: RefreshTokenRepository) {
    // Run cleanup every day at midnight
    this.refreshTokenCleanupJob = new CronJob('0 0 * * *', () => {
      this.cleanupExpiredTokens();
    });
  }

  public static getInstance(
    refreshTokenRepository: RefreshTokenRepository
  ): CleanupService {
    if (!CleanupService.instance) {
      CleanupService.instance = new CleanupService(refreshTokenRepository);
    }
    return CleanupService.instance;
  }

  startJobs(): void {
    this.refreshTokenCleanupJob.start();
    logger.info('Cleanup jobs started');
  }

  stopJobs(): void {
    this.refreshTokenCleanupJob.stop();
    logger.info('Cleanup jobs stopped');
  }

  private async cleanupExpiredTokens(): Promise<void> {
    try {
      await this.refreshTokenRepository.deleteExpired();
      logger.info('Expired refresh tokens cleaned up');
    } catch (error) {
      logger.error('Error cleaning up expired refresh tokens:', error);
    }
  }
}

export default CleanupService;
