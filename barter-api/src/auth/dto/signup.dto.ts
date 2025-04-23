import { IsNotEmpty, IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password must be between 3 and 20 characters' })
  public password: string;

  @IsOptional()
  public avatar?: string | null;
}

