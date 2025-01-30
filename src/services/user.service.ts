import { User } from '../types/interface';
import UserRepository from '../repositories/auth.repository';
import HashService from '../utils/hashService';
import TokenService from './token.service';
import { UnauthorizedError, ValidationError } from '../utils/errors';

export class UserService {
  private static instance: UserService;

  private constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
    private tokenService: TokenService
  ) {}

  public static getInstance(
    userRepository: UserRepository,
    hashService: HashService,
    tokenService: TokenService
  ): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService(
        userRepository,
        hashService,
        tokenService
      );
    }
    return UserService.instance;
  }

  async signup(
    email: string,
    password: string
  ): Promise<{
    user: Omit<User, 'password'>;
    token: string;
    refreshToken: string;
  }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    const hashedPassword = await this.hashService.hash(password);
    const user = await this.userRepository.create(email, hashedPassword);

    const { password: _, ...userWithoutPassword } = user;
    const token = this.tokenService.generateAccessToken(userWithoutPassword);
    const refreshToken = await this.tokenService.generateRefreshToken(
      userWithoutPassword
    );

    return { user: userWithoutPassword, token, refreshToken };
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    user: Omit<User, 'password'>;
    token: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await this.hashService.compare(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = this.tokenService.generateAccessToken(userWithoutPassword);
    const refreshToken = await this.tokenService.generateRefreshToken(
      userWithoutPassword
    );

    return { user: userWithoutPassword, token, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const decoded = await this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(decoded.id);

      if (!user) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const { password: _, ...userWithoutPassword } = user;
      return this.tokenService.generateAccessToken(userWithoutPassword);
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }
}

export default UserService;
