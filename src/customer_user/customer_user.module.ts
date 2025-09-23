import { Module } from '@nestjs/common';
import { CustomerUserController } from './customer_user.controller';
import { CustomerUserService } from './customer_user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../Models/customer.entity';
import { shipment_request } from '../Models/shipment_request.entity';
import { Shipment } from '../Models/shipment.entity';
import { courier_company } from '../Models/courier_company.entity';
import { shipping_detail } from '../Models/shipping_detail.entity';
import { CustomerAddresses } from 'src/Models/customer_addresses.entity';
 
@Module({
            imports: [TypeOrmModule.forFeature([Customer,shipment_request,Shipment,courier_company,shipping_detail, CustomerAddresses])],

  controllers: [CustomerUserController],
  providers: [CustomerUserService],
  exports:[CustomerUserService]
})
export class CustomerUserModule {}
