import {
  Body,
  Controller,
  Get,
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
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Sign up with optional avatar upload',
    type: SignUpDto,
  })
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
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const avatarPath = avatar ? `uploads/${avatar.filename}` : null;

    const newUser = await this.authService.signup({
      ...dto,
      avatar: avatarPath,
    });

    return {
      message: 'User successfully registered',
      user: newUser,
    };
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({ status: 200, description: 'User successfully signed in' })
  async signin(@Body() dto: SigninDto, @Req() req, @Res() res) {
    return this.authService.signin(dto, req, res);
  }

  @Get('signout')
  @ApiOperation({ summary: 'Sign out the user' })
  @ApiResponse({ status: 200, description: 'User signed out' })
  async signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req) {
    return this.authService.me(req);
  }
}
