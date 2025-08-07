import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { courier_company } from 'src/Models/courier_company.entity';
import { super_admin } from 'src/Models/super_admin.entity';
import { Shipment } from 'src/Models/shipment.entity';
import { CodPayment } from 'src/Models/cod_payment.entity';
import { vendor_user } from 'src/Models/vendor_user.entity';
import { company_document } from 'src/Models/company_document.entity';
import { shipping_detail } from 'src/Models/shipping_detail.entity';

@Module({
      imports: [TypeOrmModule.forFeature([courier_company, super_admin, Shipment,CodPayment,vendor_user, company_document,shipping_detail])],
  
  controllers: [VendorController],
  providers: [VendorService],
  exports:[VendorService]
})
export class VendorModule {}
