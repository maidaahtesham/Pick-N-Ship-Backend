import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";

export class ParcelDetailDto {
  @IsString()
  dropoff_location: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sender_name: string;

  @IsOptional()
  @IsString()
  sender_phone: string;

  @IsOptional()
  @IsString()
  receiver_name: string;

  @IsOptional()
  @IsString()
  receiver_phone: string;

  @IsEnum(['small', 'medium', 'large', 'custom'])
  package_size: 'small' | 'medium' | 'large' | 'custom';

  @IsOptional()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsNumber()
  length: number;

  @IsOptional()
  @IsNumber()
  height: number;

  @IsOptional()
  @IsOptional()
  @IsNumber()
  width?: number;

@IsArray()
  @IsOptional()
  parcel_photos?: string[];

  @IsOptional()
  @IsNumber()
  cod_amount?: number;

  @IsOptional()
  @IsNumber()
  base_price?: number;
}

// export class CreateShipmentRequestDto {
//   @IsNumber()
//   customerId: number;

//   @IsString()
//   pickup_location: string;

//    @IsString()
//   tracking_number: string;

//   @IsEnum(['regular', 'bulk'])
//   parcel_type: 'regular' | 'bulk';

//   @IsOptional()
//   @IsString()
//   request_date?: string;

//   @IsOptional()
//   @IsArray()
//   @ValidateIf(o => o.parcel_type === 'bulk')
//   @IsString({ each: true })
//   dropoff_locations?: string[];

 
// }

// export class CompleteShipmentDTO {
//   @IsNumber()
//   customerId: number;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => ParcelDetailDto)
//   parcels: ParcelDetailDto[];
// }

export class CreateFullShipmentDTO {
@IsString()
  @ValidateIf((o) => /^\d+$/.test(o.customerId)) // Ensures it's a numeric string
  customerId: string;

  @IsString()
  pickup_location: string;

  @IsEnum(['regular', 'bulk'])
  parcel_type: 'regular' | 'bulk';

  @IsOptional()
  @IsString()
  request_date?: string;

    @IsOptional()
  @IsString()
  payment_status?: string;

  // @IsArray()
  // @IsString({ each: true })
  // @ValidateIf(o => o.parcel_type === 'regular' && o.dropoff_locations?.length === 1)
  // @ValidateIf(o => o.parcel_type === 'bulk' && o.dropoff_locations?.length >= 2)
  // @Type(() => String)
  // dropoff_locations: string[];

   @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParcelDetailDto)
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return [];
    }
  })
  parcels: ParcelDetailDto[];
}