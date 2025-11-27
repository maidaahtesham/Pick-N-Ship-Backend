import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class GetRegistrationDataDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsOptional()
  @IsBoolean()
  used?: boolean;
}
