import { Module } from '@nestjs/common';
import { AdminPortalController } from './admin-portal.controller';
import { AdminPortalService } from './admin-portal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { courier_company } from '../Models/courier_company.entity';
import { super_admin } from '../Models/super_admin.entity';
import { Shipment } from '../Models/shipment.entity';
import { CodPayment } from '../Models/cod_payment.entity';
import { shipping_detail } from '../Models/shipping_detail.entity';
import { Rider } from '../Models/rider.entity';
import { Rating } from 'src/Models/ratings.entity';

@Module({
    imports: [TypeOrmModule.forFeature([courier_company, super_admin, Shipment,CodPayment,shipping_detail, Rider,Rating])],
  controllers: [AdminPortalController],
  providers: [AdminPortalService],
   exports: [AdminPortalService],
})
export class AdminPortalModule {}
