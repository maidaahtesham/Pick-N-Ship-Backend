// src/dto/create-rating.dto.ts
import { IsNumber, IsOptional, IsString, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRatingDto {
  @IsNumber()
 
  stars: number;

  @IsNumber()
 
  rider_behavior_score: number;

  @IsNumber()
 
  on_time_delivery_score: number;

  @IsNumber()
 
  affordability_score: number;

  @IsString()
  @IsOptional()
  review?: string;

  @IsNumber()
  shipment_id: number;

  @IsNumber()
  customer_id: number;

  @IsNumber()
  rider_id: number;

  @IsNumber()
  company_id: number;
}