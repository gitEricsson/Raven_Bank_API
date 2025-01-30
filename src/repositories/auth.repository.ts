import { db } from '../config/database';
import { User } from '../types/interface';

export class UserRepository {
  private static instance: UserRepository;

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    const [userId] = await db('users').insert({
      email,
      password: hashedPassword,
    });

    const user = await this.findById(userId);
    if (!user) {
      throw new Error('Failed to create user');
    }
    return user;
  }

  async findById(id: number): Promise<User | undefined> {
    return db('users').where('id', id).first();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return db('users').where('email', email).first();
  }
}

export default UserRepository;
