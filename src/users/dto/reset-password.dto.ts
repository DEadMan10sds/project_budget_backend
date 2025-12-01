import { IsNumber, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsStrongPassword()
  newPassword: string;

  @IsNumber()
  token: number;
}
