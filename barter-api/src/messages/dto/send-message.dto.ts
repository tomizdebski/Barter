import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  lessonId: number;
}
