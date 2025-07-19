import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { super_admin } from './Models/super_admin.entity';
import { courier_company } from './Models/courier_company.entity';
import { Customer } from './Models/customer.entity';
import { Rating } from './Models/ratings.entity';
import { Rider } from './Models/rider.entity';
import { Shipment } from './Models/shipment.entity';
import { shipment_request } from './Models/shipment_request.entity';
import { AdminPortalModule } from './admin-portal/admin-portal.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'AKDNeHRC',
      database: 'pick_n_ship',
      autoLoadEntities: true,
      synchronize: true,
      entities: [courier_company, super_admin, Customer, Rating, Rider, Shipment,shipment_request], // ✅ for dev only: auto creates tables
      migrations: ['dist/migrations/*.js'],
    
    }),
    AdminPortalModule,
 
    // other modules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
