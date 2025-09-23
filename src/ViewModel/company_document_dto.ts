import { IsBoolean, IsNumber, isNumber, IsString } from "class-validator";

export class company_document_dto {

  @IsNumber()
  company_id: number;
  @IsString()
  trade_license_document_path?: string;
  @IsString()
  company_document_path?: string;
  @IsString()
  establishment_card_front?: string;
    @IsString()
  establishment_card_back?: string;
  @IsString()
  trade_license_expiry_date?: string;
  @IsString()
  trade_license_number?: string;  
    @IsString()
    created_by:string;
  
    @IsString()
    created_on:string
  
    @IsString()
    updated_by:string
  
    @IsString()
    updated_on:string
  
  @IsBoolean()
  is_active:boolean
} 