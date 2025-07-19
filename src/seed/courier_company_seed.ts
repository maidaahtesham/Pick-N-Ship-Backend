import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { courier_company } from '../Models/courier_company.entity';


async function courier_company_seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);
    const repo = dataSource.getRepository(courier_company);

    console.log('👉 Starting courier company seed...');

    const data = [
      {
        company_name: 'Aramex',
        email_address: 'info@aramex.com',
        contact_phone: '1234567890',
        pns_account: 'PNS12345',
        trade_license_number: 'TLN-001',
        establishment_card: 'aramex-ec.pdf',
        establishment_date: '2023-01-15',
        registration_status: 'pending',
        conveyance_types: 'van',
        conveyance_details: 'small: 5kg, 30cm, 30cm, 30cm, AED 10',
        commission_rate: '5%',
        first_name: 'John',
        last_name: 'Doe',
        password: 'hashedpass123',
        address_line1: '123 Aramex St',
        address_line2: 'Suite 101',
        postal_code: '10001',
        country: 'USA',
        city: 'New York',
        logo: 'aramex-logo.png',
        rating: 4.5,
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        status: true,
      },
      {
        company_name: 'DHL Express',
        email_address: 'info@dhl.com',
        contact_phone: '9876543210',
        pns_account: 'PNS67890',
        trade_license_number: 'TLN-002',
        establishment_card: 'dhl-ec.pdf',
        establishment_date: '2023-02-10',
        registration_status: 'active',
        conveyance_types: 'truck',
        conveyance_details: 'large: 20kg, 60cm, 60cm, 60cm, AED 30',
        commission_rate: '5%',
        first_name: 'Jane',
        last_name: 'Smith',
        password: 'hashedpass456',
        address_line1: '456 DHL Ave',
        address_line2: 'Suite 202',
        postal_code: '20002',
        country: 'Germany',
        city: 'Berlin',
        logo: 'dhl-logo.png',
        rating: 4.8,
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        status: true,
      },
    ];

    const result = await repo.save(data);
    console.log('✅ Inserted Records:', result);

  } catch (error) {
    console.error('❌ Error seeding courier companies:', error.message);
    console.error(error);
  } finally {
    await app.close();
    console.log('🔒 DB connection closed.');
  }
}

courier_company_seed();
