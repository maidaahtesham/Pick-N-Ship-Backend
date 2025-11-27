import { Module } from '@nestjs/common';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { qr_sessions } from 'src/Models/qr_sessions.entity';
import { courier_company } from 'src/Models/courier_company.entity';
import { Rider } from 'src/Models/rider.entity';

@Module({
        imports: [TypeOrmModule.forFeature([courier_company, Rider, qr_sessions])],
  
  controllers: [RiderController],
  providers: [RiderService]
})
export class RiderModule {}
