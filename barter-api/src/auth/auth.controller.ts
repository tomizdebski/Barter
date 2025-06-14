import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async signup(
    @Body() dto: SignUpDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const avatarPath = avatar ? `uploads/${avatar.filename}` : null;
    return this.authService.signup({ ...dto, avatar: avatarPath });
  }

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({ status: 200, description: 'User successfully signed in' })
  async signin(
    @Body() dto: SigninDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signin(dto, req, res);
  }

  @Post('signout')
  @ApiOperation({ summary: 'Sign out the user' })
  @ApiResponse({ status: 200, description: 'User signed out' })
  async signout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signout(req, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get currently authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user info' })
  async me(@Req() req: Request) {
    return this.authService.me(req);
  }

  @Delete('user/:email')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete user by email (for testing purposes)' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async deleteUserByEmail(@Param('email') email: string) {
    return this.authService.deleteByEmail(email);
  }
}
