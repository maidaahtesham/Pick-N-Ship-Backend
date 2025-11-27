// src/ViewModel/create-qr-session.dto.ts

import { IsNotEmpty, IsNumber } from "class-validator";
import { Type } from "class-transformer"; // 💡 Import Type

export class CreateQrSessionDto {
    @IsNotEmpty()
    @Type(() => Number) // 💡 Explicitly force conversion from string to number
    @IsNumber() 
    readonly companyId: number; // Must be type number

    companyName: string;
    riderName?: string;
    
    @IsNotEmpty()
    @Type(() => Number) // 💡 Explicitly force conversion from string to number
    @IsNumber() 
    readonly riderId: number; // Must be type number

    used?: boolean;
    createdBy?: string;
}