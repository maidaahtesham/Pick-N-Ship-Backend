// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import Entities
import { courier_company } from './Models/courier_company.entity';
import { super_admin } from './Models/super_admin.entity';
import { Customer } from './Models/customer.entity';
import { Rating } from './Models/ratings.entity';
import { Rider } from './Models/rider.entity';
import { Shipment } from './Models/shipment.entity';
import { shipment_request } from './Models/shipment_request.entity';
import { CodPayment } from './Models/cod_payment.entity';

// Import Feature Modules
import { AuthModule } from './auth/auth.module';
import { AdminPortalModule } from './admin-portal/admin-portal.module';
import { VendorModule } from './vendor/vendor.module';
import { vendor_user } from './Models/vendor_user.entity';
import { company_document } from './Models/company_document.entity';
import { shipping_detail } from './Models/shipping_detail.entity';
import { CustomerUserModule } from './customer_user/customer_user.module';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({ isGlobal: true , 
      envFilePath: '.env',     load: [() => {
        console.log('Loading .env file:', process.env); // Debug log
        return process.env;
      }], }),

    AuthModule,
    AdminPortalModule,
    CustomerUserModule,
    VendorModule,
    // Async TypeORM configuration with debug logging
  TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
  
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST') || 'localhost',
      port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
      username: configService.get<string>('DB_USERNAME') || 'postgres',
      password: configService.get<string>('DB_PASSWORD')?.toString() || 'AKDNeHRC',
      database: configService.get<string>('DB_NAME') || 'pick_n_ship',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      
      entities: [
        courier_company,
        super_admin,
        Customer,
        Rating,
        Rider,
        Shipment,
        shipment_request,
        CodPayment,
        vendor_user,
        company_document,
        shipping_detail
      ],
      migrations: ['dist/migrations/*.ts'],
      migrationsRun: false, // Automatically run migrations on startup
    };
  },
}),

  ],
})
export class AppModule {}
