// ../ViewModel/regular-booking.dto.ts
import { IsEnum, IsNumber, IsString, Length, IsOptional, IsArray, Min, Max } from 'class-validator';
import { Column } from 'typeorm';

enum PackageSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export class RegularBookingDTO {
  @IsNumber()
  request_id: number; // Link to the previous shipment request

  @IsEnum(PackageSize)
  package_size: string; // Predefined size

  @IsNumber()
  @Min(2)
  @Max(16) // Max weight limit
  weight: number; // Customer-entered weight

  @IsNumber()
  @IsOptional()
  length?: number; // Custom dimension (optional)

  @IsNumber()
  @IsOptional()
  width?: number; // Custom dimension (optional)

  @IsNumber()
  @IsOptional()
  height?: number; // Custom dimension (optional)

@Column({ type: 'text', array: true, nullable: true, default: () => 'ARRAY[]::text[]' })
parcel_photos: string[];

  @IsString()
  @IsOptional()
  special_instruction?: string;
}