import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AcceptShipmentDto {
  @IsInt()
  @IsNotEmpty()
  companyId: number; // Courier company ID

  @IsInt()
  @IsNotEmpty()
  riderId: number; // Rider ID

  @IsString()
  @IsNotEmpty()
  acceptedBy: string; // User/employee accepting the shipment
}