import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class PricingDto {
  @IsString()
  size: 'small' | 'medium' | 'large';

  @IsNumber()
  weight: number;

  @IsNumber()
  width: number;

  @IsNumber()
  length: number;

  @IsNumber()
  height: number;

  @IsNumber()
  baseFare: number;

  @IsNumber()
  pricePerKm: number;
}

class ConveyanceDto {
  @IsString()
  type: string;

  @IsString()
  details: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PricingDto)
  pricing: PricingDto[];
}

export class shipping_detail_dto {
  @IsNumber()
  company_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConveyanceDto)
  conveyance_types: ConveyanceDto[];

  @IsDateString()
  created_on: string;   // <-- string hona chahiye, JSON se Date string aati hai

  @IsOptional()
  @IsDateString()
  updated_on?: string;

  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}
