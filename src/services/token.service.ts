import jwt from 'jsonwebtoken';
import { addDays } from 'date-fns';
import AppConfig from '../config/app.config';
import { User } from '../types/interface';
import RefreshTokenRepository from '../repositories/refreshToken.repository';
import { UnauthorizedError } from '../utils/errors';
import { withTransaction } from '../utils/db';

export class TokenService {
  private static instance: TokenService;

  private constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  public static getInstance(
    refreshTokenRepository: RefreshTokenRepository
  ): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService(refreshTokenRepository);
    }
    return TokenService.instance;
  }

  generateAccessToken(user: Omit<User, 'password'>): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      AppConfig.jwt.ACCESS_TOKEN_SECRET,
      { expiresIn: AppConfig.jwt.ACCESS_TOKEN_EXPIRY } as jwt.SignOptions
    );
  }

  async generateRefreshToken(user: Omit<User, 'password'>): Promise<string> {
    return withTransaction(async (trx) => {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        AppConfig.jwt.REFRESH_TOKEN_SECRET
      );

      const expiresAt = addDays(new Date(), 7); // 7 days from now

      await this.refreshTokenRepository.deleteByUserId(user.id!, trx);
      await this.refreshTokenRepository.create(user.id!, token, expiresAt, trx);

      return token;
    });
  }

  async verifyRefreshToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, AppConfig.jwt.REFRESH_TOKEN_SECRET);
      const storedToken = await this.refreshTokenRepository.findByToken(token);

      if (!storedToken || storedToken.expires_at < new Date()) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async revokeRefreshToken(userId: number): Promise<void> {
    await this.refreshTokenRepository.deleteByUserId(userId);
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository.deleteExpired();
  }
}

export default TokenService;
