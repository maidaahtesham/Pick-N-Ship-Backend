import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class customer_signup_dto{



@IsString()
  @MinLength(1)
  first_name: string;

  @IsString()
  @MinLength(1)
  last_name: string;

  @IsEmail()
  email_address: string;

  @IsString()
  @MinLength(6)
  password: string;   


  phone_number:string;

  @IsNumber()
  customer_id: number; 

  @IsString()
  user_type: string; // e.g., 'customer', 'admin', etc.

  is_email_verified:boolean;

  createdBy: string;
  createdOn: Date;
  updatedBy: string;

 


}