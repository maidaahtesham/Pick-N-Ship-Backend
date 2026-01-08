import { forwardRef, Module } from '@nestjs/common';
import { AdminPortalController } from './admin-portal.controller';
import { AdminPortalService } from './admin-portal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { courier_company } from '../Models/courier_company.entity';
import { super_admin } from '../Models/super_admin.entity';
import { Shipment } from '../Models/shipment.entity';

import { shipping_detail } from '../Models/shipping_detail.entity';
import { Rider } from '../Models/rider.entity';
import { Rating } from 'src/Models/ratings.entity';
import { shipping_pricing } from 'src/Models/shipping_pricing.entity';
import { CodPayment } from 'src/Models/cod_payment.entity';
import { company_çonveyance_details } from 'src/Models/company_conveyance_details.entity';
import { company_çonveyance_pricing_details } from 'src/Models/company_çonveyance_pricing_details.entity';
import { company_commission_rate } from 'src/Models/company_commission_rate.entity';
import { admin_commission_settings } from 'src/Models/admin_commission_settings.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from 'src/Models/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([courier_company, super_admin, Shipment,CodPayment,shipping_detail, Rider,Rating,shipping_pricing,company_çonveyance_details,company_çonveyance_pricing_details, company_commission_rate,admin_commission_settings,ConfigModule,Role]),
    // forwardRef(() => AuthModule), 
     MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SUPER_ADMIN_RESET_SECRET') || 'fallback-secret',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),

  ],
  controllers: [AdminPortalController],
  providers: [AdminPortalService],
   exports: [AdminPortalService],
})
export class AdminPortalModule {}
