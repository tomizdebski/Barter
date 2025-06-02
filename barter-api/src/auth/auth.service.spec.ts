import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should throw BadRequestException if user already exists', async () => {
      prismaService.users.findUnique = jest.fn().mockResolvedValue({ id: 1 });
      await expect(
        authService.signup({ email: 'test@test.com', password: 'password', firstName: 'John', lastName: 'Doe', avatar: '' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a new user if not exists', async () => {
      prismaService.users.findUnique = jest.fn().mockResolvedValue(null);
      prismaService.users.create = jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      const result = await authService.signup({ email: 'test@test.com', password: 'password', firstName: 'John', lastName: 'Doe', avatar: '' });
      expect(result).toEqual({
        message: 'signup was successful',
        user: {
          id: 1,
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      });
    });
  });

  describe('signin', () => {
    it('should throw BadRequestException if user not found', async () => {
      prismaService.users.findUnique = jest.fn().mockResolvedValue(null);

      const req = {} as any;
      const res = {
        send: jest.fn(),
        cookie: jest.fn(),
      } as any;

      await expect(
        authService.signin({ email: 'wrong@test.com', password: 'password' }, req, res),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if password does not match', async () => {
      prismaService.users.findUnique = jest.fn().mockResolvedValue({ password: await bcrypt.hash('differentPassword', 10) });

      const req = {} as any;
      const res = {
        send: jest.fn(),
        cookie: jest.fn(),
      } as any;

      await expect(
        authService.signin({ email: 'test@test.com', password: 'password' }, req, res),
      ).rejects.toThrow(BadRequestException);
    });

    it('should login successfully', async () => {
      const hashedPassword = await bcrypt.hash('password', 10);
      prismaService.users.findUnique = jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'avatar.png',
      });
      jwtService.signAsync = jest.fn().mockResolvedValue('mocked-jwt-token');

      const req = {} as any;
      const res = {
        send: jest.fn(),
        cookie: jest.fn(),
      } as any;

      await authService.signin({ email: 'test@test.com', password: 'password' }, req, res);

      expect(res.cookie).toHaveBeenCalledWith('token', 'mocked-jwt-token', expect.any(Object));
      expect(res.send).toHaveBeenCalledWith({ message: 'Logged in succesfully' });
    });
  });

  describe('signout', () => {
    it('should clear token cookie and send response', async () => {
      const req = {} as any;
      const res = {
        clearCookie: jest.fn(),
        send: jest.fn(),
      } as any;

      await authService.signout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.send).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
  });

  describe('me', () => {
    it('should return user object from request', async () => {
      const req = { user: { id: 1, email: 'test@test.com' } };
      expect(await authService.me(req as any)).toEqual(req.user);
    });
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'password';
      const hashed = await authService.hashPassword(password);
      expect(await bcrypt.compare(password, hashed)).toBe(true);
    });
  });

  describe('comparePassword', () => {
    it('should compare password correctly', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await authService.comparePassword({ password, hashedPassword });
      expect(result).toBe(true);
    });
  });

  describe('signToken', () => {
    it('should sign token correctly', async () => {
      jwtService.signAsync = jest.fn().mockResolvedValue('mocked-token');

      const result = await authService.signToken({
        id: '1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'avatar.png',
      });

      expect(result).toBe('mocked-token');
    });
  });
});
