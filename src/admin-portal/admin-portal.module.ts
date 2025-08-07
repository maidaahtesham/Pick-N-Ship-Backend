import { Module } from '@nestjs/common';
import { AdminPortalController } from './admin-portal.controller';
import { AdminPortalService } from './admin-portal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { courier_company } from 'src/Models/courier_company.entity';
import { super_admin } from 'src/Models/super_admin.entity';
import { Shipment } from 'src/Models/shipment.entity';
import { CodPayment } from 'src/Models/cod_payment.entity';
import { shipping_detail } from 'src/Models/shipping_detail.entity';

@Module({
    imports: [TypeOrmModule.forFeature([courier_company, super_admin, Shipment,CodPayment,shipping_detail])],
  controllers: [AdminPortalController],
  providers: [AdminPortalService],
   exports: [AdminPortalService],
})
export class AdminPortalModule {}
