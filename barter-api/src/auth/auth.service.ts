import { PrismaService } from 'prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constans';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    const { email, password, avatar, firstName, lastName } = dto;
  
    const foundUser = await this.prisma.users.findUnique({ where: { email } });
    if (foundUser) {
      throw new BadRequestException("User already exists");
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
      message: "signup was successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    };
  }
  

  async signin(dto: AuthDto, req: Request, res: Response) {
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
    });

    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('token', token);

    return res.send({ message: 'Logged in succesfully' });
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out successfully' });
  }

  async me(req: Request) {
    const { user } = req as any;
    return user;
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async comparePassword(args: { password: string; hashedPassword: string }) {
    const { password, hashedPassword } = args;
    return bcrypt.compare(password, hashedPassword);
  }

  async signToken(args: { id: string; email: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
}
