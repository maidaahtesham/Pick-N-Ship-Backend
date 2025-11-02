import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCustomerProfileDto {
  @IsString()
  @IsNotEmpty()
  customerId: string; // Required field from form-data

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEmail()
  @IsOptional()
  email_address?: string;

  @IsPhoneNumber( )
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  user_type?: string;

  @IsBoolean()
  @IsOptional()
  is_email_verified?: boolean;

  @IsOptional()
  date_of_birth?: Date;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  gender?: string;


  country?: string;





  @IsOptional()
  files?: Express.Multer.File[]; // For profile image upload
}