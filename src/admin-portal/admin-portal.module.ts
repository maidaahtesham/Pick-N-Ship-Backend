import { Module } from '@nestjs/common';
import { AdminPortalController } from './admin-portal.controller';
import { AdminPortalService } from './admin-portal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { courier_company } from 'src/Models/courier_company.entity';
import { super_admin } from 'src/Models/super_admin.entity';
import { Shipment } from 'src/Models/shipment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([courier_company, super_admin, Shipment])],
  controllers: [AdminPortalController],
  providers: [AdminPortalService],
})
export class AdminPortalModule {}
