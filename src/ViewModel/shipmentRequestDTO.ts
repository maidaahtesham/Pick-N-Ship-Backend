// ../ViewModel/shipment-request.dto.ts
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Length, IsOptional, isDate, IS_DATE, IsDate, IsBoolean } from 'class-validator';
import { courier_company } from '../Models/courier_company.entity';
import { Rider } from '../Models/rider.entity';
import { JoinColumn, ManyToOne } from 'typeorm';

enum ParcelType {
  REGULAR = 'regular',
  BULK = 'bulk',
  CONTRACT= 'contract',
}

enum PackageSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

enum PaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

enum ShipmenStatus{
PENDING='pending',
ACCEPTED='accepted',
DECLINED='declined'

}


export class ShipmentRequestDTO {
  @IsString()
  @Length(1, 255)
  pickup_location: string;

  @IsString()
  @Length(1, 255)
  dropoff_location: string;

  @IsEnum(ParcelType)
  parcel_type: string;

  @IsEnum(PackageSize)
  package_size: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  length: number;

  @IsNumber()
  height: number;

  @IsNumber()
  base_price: number;

  @IsString()
  @Length(1, 50)
  pickup_time_slot: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: string;

  @IsEnum(ShipmenStatus)
  @IsOptional()
  shipment_status?: string;


  @IsString()
  @Length(1, 100)
  sender_name: string;

  @IsString()
  @Length(1, 100)
  receiver_name: string;

  @IsString()
  @Length(1, 20)
  receiver_phone: string;

  @IsString()
  @IsOptional()
  special_instruction?: string;

@IsDate({ message: 'request_date must be a valid date string' })
  @Transform(({ value }) => {
    if (value === undefined || value === null) return new Date();
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date; // Fallback to current date if invalid
  }, { toClassOnly: true })
  request_date: Date;

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

  parcel_photos?: string[];


  @ManyToOne(() => Rider)
    @JoinColumn({ name: 'rider_id' }) // Ensure this matches the DB column name
    rider: Rider;
    
      @ManyToOne(() => courier_company)
      @JoinColumn({ name: 'company_id' }) // Ensure this matches the DB column name
      company: courier_company;

}