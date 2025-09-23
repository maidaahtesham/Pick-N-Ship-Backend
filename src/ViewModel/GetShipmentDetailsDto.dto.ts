// First, define the DTO for the new endpoint in your DTO file (e.g., get-shipment-details.dto.ts)
import { IsString, IsNumber } from 'class-validator';

export class GetShipmentDetailsDto {
  @IsString()
  company_id: string;

  @IsNumber()
  shipment_id: number;
}