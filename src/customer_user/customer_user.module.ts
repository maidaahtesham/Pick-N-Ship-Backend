import { Module } from '@nestjs/common';
import { CustomerUserController } from './customer_user.controller';
import { CustomerUserService } from './customer_user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/Models/customer.entity';
import { shipment_request } from 'src/Models/shipment_request.entity';

@Module({
        imports: [TypeOrmModule.forFeature([Customer,shipment_request])],
  
  controllers: [CustomerUserController],
  providers: [CustomerUserService],
  exports:[CustomerUserService]
})
export class CustomerUserModule {}
