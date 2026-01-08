import { Module } from '@nestjs/common';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { qr_sessions } from 'src/Models/qr_sessions.entity';
import { courier_company } from 'src/Models/courier_company.entity';
import { Rider } from 'src/Models/rider.entity';
import { Shipment } from 'src/Models/shipment.entity';
import { company_document } from 'src/Models/company_document.entity';
import { shipping_payment } from 'src/Models/shipping_payment.entity';

@Module({
        imports: [TypeOrmModule.forFeature([courier_company, Rider, qr_sessions,Shipment,company_document,shipping_payment])],
  
  controllers: [RiderController],
  providers: [RiderService],
  exports: [RiderService],
})
export class RiderModule {}
