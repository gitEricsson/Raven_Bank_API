import { Knex } from 'knex';
import { db } from '../config/database';

export interface RefreshToken {
  id?: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class RefreshTokenRepository {
  private static instance: RefreshTokenRepository;

  private constructor() {}

  public static getInstance(): RefreshTokenRepository {
    if (!RefreshTokenRepository.instance) {
      RefreshTokenRepository.instance = new RefreshTokenRepository();
    }
    return RefreshTokenRepository.instance;
  }

  async create(
    userId: number,
    token: string,
    expiresAt: Date,
    trx?: Knex.Transaction
  ): Promise<RefreshToken> {
    const query = (trx || db)('refresh_tokens');
    const [tokenId] = await query.insert({
      user_id: userId,
      token,
      expires_at: expiresAt,
    });

    const createdToken = await this.findById(tokenId, trx);
    if (!createdToken) {
      throw new Error('Failed to create refresh token');
    }
    return createdToken;
  }

  async findById(
    id: number,
    trx?: Knex.Transaction
  ): Promise<RefreshToken | undefined> {
    return (trx || db)('refresh_tokens').where('id', id).first();
  }

  async findByToken(
    token: string,
    trx?: Knex.Transaction
  ): Promise<RefreshToken | undefined> {
    return (trx || db)('refresh_tokens').where('token', token).first();
  }

  async deleteByUserId(userId: number, trx?: Knex.Transaction): Promise<void> {
    await (trx || db)('refresh_tokens').where('user_id', userId).del();
  }

  async deleteExpired(trx?: Knex.Transaction): Promise<void> {
    await (trx || db)('refresh_tokens')
      .where('expires_at', '<', new Date())
      .del();
  }
}

export default RefreshTokenRepository;
