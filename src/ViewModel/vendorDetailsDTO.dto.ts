import { IsString, IsOptional, MinLength, IsDate, isString, isBoolean, IsBoolean, IS_NUMBER, IsInt } from 'class-validator';

export class vendorDetailsDTO{

  @IsInt()
  company_id: number;

  @IsString()
  @MinLength(1)
  company_name: string;

  @IsString()
  @MinLength(1)
  username:string;

  @IsString()
  @IsOptional()
  logo?: string;
 

  @IsString()
  @MinLength(1)
  city: string;

  @IsString()
  company_address:string;

  @IsString()
  @IsOptional()
  company_phone_number?: string;

  @IsString()
  @MinLength(1)
  pns_account_full_name: string;

  @IsString()
  created_by:string;

  @IsString()
  created_on:string

  @IsString()
  updated_by:string

  @IsString()
  updated_on:string

@IsBoolean()
 status:boolean
}