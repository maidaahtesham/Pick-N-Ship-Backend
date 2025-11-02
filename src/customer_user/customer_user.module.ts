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
import { parcel_details } from 'src/Models/parcel_detail.entity';
import { Rating } from 'src/Models/ratings.entity';
import { Rider } from 'src/Models/rider.entity';
import { UploadPictureService } from 'src/upload-pictures/upload_picture/upload_picture.service';
 
 import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
            imports: [TypeOrmModule.forFeature([Rating,Customer,shipment_request,Shipment,courier_company,shipping_detail, CustomerAddresses,parcel_details,Rider,UploadPictureService, ]),
  JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // 1 day expiration for email verification
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CustomerUserController],
  providers: [CustomerUserService ],
  exports:[CustomerUserService]
})
export class CustomerUserModule {}
