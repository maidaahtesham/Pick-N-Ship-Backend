import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllShipmentsDto {
  // Assuming customer_id is passed in the body for simplicity,
  // but in a real-world app, it should come from the authenticated user.
  @IsNumber()
  @Type(() => Number)
  company_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  status?: 'Pending' | 'Completed' | 'Cancelled';

  @IsOptional()
  @IsString()
  search?: string;
}

export class GetAllActiveShipmentsDto {
  // Assuming customer_id is passed in the body for simplicity,
  // but in a real-world app, it should come from the authenticated user.
  @IsNumber()
  @Type(() => Number)
  company_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  status?: 'Pending' | 'Completed'|'All' |"";

  @IsOptional()
  @IsString()
  search?: string;
}