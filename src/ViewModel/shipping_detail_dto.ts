import { IsBoolean, IsEnum, IsNumber, isNumber, IsString } from "class-validator";

export class shipping_detail_dto {
  @IsNumber()
    company_id: number;
  conveyance_types: 'bike' | 'van' | 'truck';
  @IsString()
  conveyance_details: string;
  commission_rate: 'standard' | '10%' | '5%' | 'custom';  
    @IsString()
    created_by:string;
  
    @IsString()
    created_on:string
  
    @IsString()
    updated_by:string
  
    @IsString()
    updated_on:string

}