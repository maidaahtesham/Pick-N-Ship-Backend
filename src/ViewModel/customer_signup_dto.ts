import { IsEmail, IsNumber, IsString, MinLength } from "class-validator";

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




}