import { Module } from '@nestjs/common';
import { CustomerUserController } from './customer_user.controller';
import { CustomerUserService } from './customer_user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/Models/customer.entity';
import { shipment_request } from 'src/Models/shipment_request.entity';
import { Shipment } from 'src/Models/shipment.entity';
import { courier_company } from 'src/Models/courier_company.entity';
import { shipping_detail } from 'src/Models/shipping_detail.entity';

@Module({
        imports: [TypeOrmModule.forFeature([Customer,shipment_request,Shipment,courier_company,shipping_detail])],
  
  controllers: [CustomerUserController],
  providers: [CustomerUserService],
  exports:[CustomerUserService]
})
export class CustomerUserModule {}
