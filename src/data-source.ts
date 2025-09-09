import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { courier_company } from './Models/courier_company.entity';
import { super_admin } from './Models/super_admin.entity';
import { Customer } from './Models/customer.entity';
import { Rating } from './Models/ratings.entity';
import { Rider } from './Models/rider.entity';
import { Shipment } from './Models/shipment.entity';
import { shipment_request } from './Models/shipment_request.entity';
import { CodPayment } from './Models/cod_payment.entity';
import { vendor_user } from './Models/vendor_user.entity';
import { company_document } from './Models/company_document.entity';
import { shipping_detail } from './Models/shipping_detail.entity';

config(); // load .env

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
super_admin,
Customer,
Rating,
Rider,
Shipment,
shipment_request,
CodPayment,
courier_company,
vendor_user,
company_document,
shipping_detail

  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // 🚨 very important for migrations
  logging: true,
});
