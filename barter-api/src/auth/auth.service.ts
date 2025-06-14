import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/constans';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: SignUpDto) {
    const { email, password, avatar, firstName, lastName } = dto;

    const foundUser = await this.prisma.users.findUnique({ where: { email } });
    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        avatar: avatar || null,
        firstName,
        lastName,
      },
    });

    return {
      message: 'User successfully registered',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        avatar: newUser.avatar,
      },
    };
  }

  async signin(dto: SigninDto, req: Request, res: Response) {
  const { email, password } = dto;

  const foundUser = await this.prisma.users.findUnique({ where: { email } });
  if (!foundUser) {
    throw new BadRequestException('User not found');
  }

  const isMatch = await this.comparePassword({
    password,
    hashedPassword: foundUser.password,
  });

  if (!isMatch) {
    throw new BadRequestException('Invalid password');
  }

  const token = await this.signToken({
    id: foundUser.id.toString(),
    email: foundUser.email,
    firstName: foundUser.firstName ?? undefined,
    lastName: foundUser.lastName ?? undefined,
    avatar: foundUser.avatar,
  });

  if (!token) {
    throw new ForbiddenException();
  }

  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: isProd,       // ❗️niewidoczne w JS na produkcji
    secure: isProd,         // ❗️HTTPS
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    message: 'Logged in successfully',
    accessToken: token,
  };
}


  async signout(req: Request, res: Response) {
  const isProd = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    httpOnly: isProd,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
}


  async me(req: Request) {
  const user = req.user as { id: string };

  if (!user?.id) throw new ForbiddenException('No user ID in token');

  const dbUser = await this.prisma.users.findUnique({
    where: { id: parseInt(user.id) },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });

  if (!dbUser) {
    throw new NotFoundException('User not found in database');
  }

  return dbUser;
}


  async deleteByEmail(email: string) {
    return this.prisma.users.delete({
      where: { email },
    });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(args: { password: string; hashedPassword: string }) {
    const { password, hashedPassword } = args;
    return bcrypt.compare(password, hashedPassword);
  }

  async signToken(user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
  }) {
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatar || null,
    };

    return this.jwt.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: '7d',
    });
  }
}
