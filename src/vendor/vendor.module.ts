import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { courier_company } from '../Models/courier_company.entity';
import { super_admin } from '../Models/super_admin.entity';
import { Shipment } from '../Models/shipment.entity';
import { CodPayment } from '../Models/cod_payment.entity';
import { vendor_user } from '../Models/vendor_user.entity';
import { company_document } from '../Models/company_document.entity';
import { shipping_detail } from '../Models/shipping_detail.entity';
import { Rider } from 'src/Models/rider.entity';
import { Rating } from 'src/Models/ratings.entity';
import { Customer } from 'src/Models/customer.entity';
import { company_çonveyance_details } from 'src/Models/company_conveyance_details.entity';

@Module({
      imports: [TypeOrmModule.forFeature([courier_company, super_admin, Shipment,CodPayment,vendor_user, company_document,shipping_detail,Rider,Rating,Customer,company_çonveyance_details])],
  
  controllers: [VendorController],
  providers: [VendorService],
  exports:[VendorService]
})
export class VendorModule {}
