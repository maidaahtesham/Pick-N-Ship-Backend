// src/ViewModel/select-vehicle.dto.ts
import { IsEnum, IsNumber, IsString, Length, IsOptional, IsArray, Min, Max } from 'class-validator';
import { Column } from 'typeorm';

enum VehicleType {
  BIKE = 'bike',
  VAN = 'van',
  TRUCK = 'truck',
}

export class SelectVehicleDTO {
    @IsNumber()
    request_id: number; // Link to the previous shipment request

  @IsEnum(VehicleType)
  vehicle_type: string; // Selected vehicle type

  @Column({
    type: 'enum',
    enum: ['standard', '10%', '5%', 'custom'],
  })
  commission_rate: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdOn: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  updatedOn: Date;

}