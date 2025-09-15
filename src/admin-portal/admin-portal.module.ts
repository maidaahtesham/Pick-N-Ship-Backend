import { Module } from '@nestjs/common';
import { AdminPortalController } from './admin-portal.controller';
import { AdminPortalService } from './admin-portal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { courier_company } from '../Models/courier_company.entity';
import { super_admin } from '../Models/super_admin.entity';
import { Shipment } from '../Models/shipment.entity';

import { shipping_detail } from '../Models/shipping_detail.entity';
import { Rider } from '../Models/rider.entity';
import { Rating } from 'src/Models/ratings.entity';
import { shipping_pricing } from 'src/Models/shipping_pricing.entity';
import { CodPayment } from 'src/Models/cod_payment.entity';
import { company_çonveyance_details } from 'src/Models/company_conveyance_details.entity';
import { company_çonveyance_pricing_details } from 'src/Models/company_çonveyance_pricing_details.entity';

@Module({
    imports: [TypeOrmModule.forFeature([courier_company, super_admin, Shipment,CodPayment,shipping_detail, Rider,Rating,shipping_pricing,company_çonveyance_details,company_çonveyance_pricing_details])],
  controllers: [AdminPortalController],
  providers: [AdminPortalService],
   exports: [AdminPortalService],
})
export class AdminPortalModule {}
