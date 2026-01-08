// src/auth/dto/vendor-login.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RiderLoginDto {
@IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;                      // ← Change to "email"

  @IsString()
  @IsNotEmpty()
  password: string;
}