import { IsString, IsEmail, IsEnum, IsOptional, IsDate, MinLength } from 'class-validator';

export class vendorSignUpDTO{


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

   
  company_id: number;   


  phone_number:string;



  
}

 