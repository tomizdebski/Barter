import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('signup')
  // async signup(@Body() dto: AuthDto) {
  //   return this.authService.signup(dto);
  // }

  @Post('signup')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads', // Miejsce na serwerze, gdzie plik będzie przechowywany
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename); // Zapisz plik z unikalną nazwą
        },
      }),
    }),
  )
  async signup(
    @Body() dto: SignUpDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    // Jeśli avatar jest przesyłany, dodajemy jego ścieżkę do DTO
    const avatarPath = avatar ? `uploads/${avatar.filename}` : null;

    const newUser = await this.authService.signup({
      ...dto,
      avatar: avatarPath, // Zapisujemy ścieżkę do awatara w bazie danych
    });

    return {
      message: 'User successfully registered',
      user: newUser,
    };
  }

  @Post('signin')
  async signin(@Body() dto: SigninDto, @Req() req, @Res() res) {
    return this.authService.signin(dto, req, res);
  }

  @Get('signout')
  async signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }

  @Get('me')
  async me(@Req() req) {
    return this.authService.me(req);
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: any) {
    console.log(file);
    return 'success';
  }
}
