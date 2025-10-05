// src/seed/unifiedSeed.ts
import { DataSource, DeepPartial } from 'typeorm';
import { courier_company } from '../Models/courier_company.entity';
import { company_document } from '../Models/company_document.entity';
import { shipping_detail } from '../Models/shipping_detail.entity';
import { vendor_user } from '../Models/vendor_user.entity';
import { Customer } from '../Models/customer.entity';
import { Rider } from '../Models/rider.entity';
import { shipment_request } from '../Models/shipment_request.entity';
import { Shipment } from '../Models/shipment.entity';
import { CodPayment } from 'src/Models/cod_payment.entity';

// Export the DataSource instance for CLI use
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'AKDNeHRC',
  database: process.env.DB_NAME || 'pick_n_ship',
  synchronize: false, // Set to true temporarily if tables need creation
  logging: true,
  entities: ['../Models/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
});

async function unifiedSeed() {
  try {
    await AppDataSource.initialize();
    console.log('👉 Starting unified seed...');

    // Start a transaction
    await AppDataSource.query('BEGIN');

    // Repositories
    const courierRepo = AppDataSource.getRepository(courier_company);
    const documentRepo = AppDataSource.getRepository(company_document);
    const shippingRepo = AppDataSource.getRepository(shipping_detail);
    const vendorRepo = AppDataSource.getRepository(vendor_user);
    const customerRepo = AppDataSource.getRepository(Customer);
    const riderRepo = AppDataSource.getRepository(Rider);
    const requestRepo = AppDataSource.getRepository(shipment_request);
    const shipmentRepo = AppDataSource.getRepository(Shipment);
    const codPaymentRepo = AppDataSource.getRepository(CodPayment);

    // Seed courier_company
    const companies = [
      {
        company_name: 'Aramex',
        logo: 'aramex-logo.png',
        username: 'aramex_user',
        city: 'New York',
        company_address: '123 Aramex St, Suite 101',
        company_phone_number: '1234567890',
        pns_account_full_name: 'PNS12345',
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        status: true,
        rejection_reason: undefined,
      },
      {
        company_name: 'DHL Express',
        username: 'dhl_user',
        logo: 'dhl-logo.png',
        city: 'Berlin',
        company_address: '456 DHL Ave, Suite 202',
        company_phone_number: '9876543210',
        pns_account_full_name: 'PNS67890',
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        status: true,
        rejection_reason: undefined,
      },
    ] as DeepPartial<courier_company>[];
    const savedCompanies = await courierRepo.save(companies);
    console.log('✅ Inserted Companies:', savedCompanies);

    // Seed company_document
    const documents = [
      {
        company: { company_id: savedCompanies[0].company_id } as DeepPartial<courier_company>,
        trade_license_document_path: 'aramex-tl.pdf',
        company_document_path: undefined,
        establishment_card_front: 'aramex-ec.pdf',
        establishment_card_back: 'aramex-ec.pdf',
        trade_license_expiry_date: '2026-01-15',
        trade_license_number: 'TLN-001',
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        is_active: true,
      },
      {
        company: { company_id: savedCompanies[1].company_id } as DeepPartial<courier_company>,
        trade_license_document_path: 'dhl-tl.pdf',
        company_document_path: undefined,
        establishment_card: 'dhl-ec.pdf',
        trade_license_expiry_date: '2026-02-10',
        trade_license_number: 'TLN-002',
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        is_active: true,
      },
    ] as DeepPartial<company_document>[];
    const savedDocuments = await documentRepo.save(documents);
    console.log('✅ Inserted Documents:', savedDocuments);

    // Seed shipping_detail
    const shippingDetails = [
      {
        company: { company_id: savedCompanies[0].company_id } as DeepPartial<courier_company>,
        conveyance_types: 'van',
        conveyance_details: 'small: 5kg, 30cm, 30cm, 30cm, AED 10',
        commission_rate: '5%',
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        company: { company_id: savedCompanies[1].company_id } as DeepPartial<courier_company>,
        conveyance_types: 'truck',
        conveyance_details: 'large: 20kg, 60cm, 60cm, 60cm, AED 30',
        commission_rate: '5%',
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ] as DeepPartial<shipping_detail>[];
    const savedShippingDetails = await shippingRepo.save(shippingDetails);
    console.log('✅ Inserted Shipping Details:', savedShippingDetails);

    // Seed vendor_user
    const vendors = [
      {
        company: { company_id: savedCompanies[0].company_id } as DeepPartial<courier_company>,
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john.doe@aramex.com',
        password: 'hashedpass123',
        phone_number: '1234567890',
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        status: true,
      },
      {
        company: { company_id: savedCompanies[1].company_id } as DeepPartial<courier_company>,
        first_name: 'Jane',
        last_name: 'Smith',
        email_address: 'jane.smith@dhl.com',
        password: 'hashedpass456',
        phone_number: '9876543210',
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        status: true,
      },
    ] as DeepPartial<vendor_user>[];
    const savedVendors = await vendorRepo.save(vendors);
    console.log('✅ Inserted Vendors:', savedVendors);

    // Seed Customer
    const customers = [
      {
        firstname: 'Alice',
        lastname: 'Johnson',
        email: 'alice.johnson@example.com',
        password: 'hashedpass789',
        user_type: 'individual',
        phone_number: '1234567890',
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        status: true,
      },
      {
        firstname: 'Bob',
        lastname: 'Smith',
        email: 'bob.smith@example.com',
        password: 'hashedpass012',
        user_type: 'individual',
        phone_number: '9876543210',
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        status: true,
      },
    ] as DeepPartial<Customer>[];
    const savedCustomers = await customerRepo.save(customers);
    console.log('✅ Inserted Customers:', savedCustomers);

    // Seed Rider
    const riders = [
      {
       rider_name: "Rider One",
    phone_number: "03011234567",
    vehicle_type: "Bike",
    est_free_time: "2025-01-10T12:00:00Z",
    distance: 0,
    availability_status: true,
    is_available:true,
    is_job_assigned:false,
    profile_status:"active",    
    rider_code: "RDR001",
    email: "rider1@tcs.com",
    licence_number: "LIC123456",
    registration_number: "REG98765",
    registration_datetime: new Date(),
    documents: "",
    createdBy: "system",
    updatedBy: "system",
    status: true,      },
      {
        rider_name: 'Sara Rider',
        phone_number: '9876543210',
        vehicle_type: 'van',
        est_free_time: '2025-07-31 15:00:00',
        distance: 0,
        availability_status: 'available',
        assigned_jobs: 0,
        rider_code: 'RIDER002',
        email: 'sara.rider@dhl.com',
        licence_number: 'LIC002',
        registration_number: 'REG002',
        registration_datetime: new Date(),
        documents: 'licence.pdf',
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        status: true,
        company: { company_id: savedCompanies[1].company_id } as DeepPartial<courier_company>,
      },
    ] as DeepPartial<Rider>[];
    const savedRiders = await riderRepo.save(riders);
    console.log('✅ Inserted Riders:', savedRiders);

 const requests = [
      {
        request_id: undefined, // Auto-increment or let DB handle
        customer: { id: savedCustomers[0].id } as DeepPartial<Customer>,
        company: { company_id: savedCompanies[0].company_id } as DeepPartial<courier_company>,
        pickup_location: '123 Main St, New York',
        dropoff_location: '456 Elm St, New York',
        parcel_type: 'regular',
        package_size: 'small',
        weight: 5.0,
        length: 30,
        height: 30,
        base_price: 10.0,
        status: 'accepted',
        request_date: new Date(),
        pickup_time_slot: '14:00-16:00',
        rider: { id: savedRiders[0].id } as DeepPartial<Rider>,
        payment_status: 'paid',
        sender_name: 'Alice Johnson',
        receiver_name: 'Bob Smith',
        receiver_phone: '9876543210',
        special_instruction: undefined,
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        request_id: undefined,
         company: { company_id: savedCompanies[1].company_id } as DeepPartial<courier_company>,
        pickup_location: '789 Oak St, Berlin',
        // dropoff_location: '101 Pine St, Berlin',
        parcel_type: 'large',
        package_size: 'large',
        weight: 20.0,
        length: 60,
        height: 60,
        base_price: 30.0,
        request_date: new Date(),
        pickup_time_slot: '15:00-17:00',
        rider: { id: savedRiders[1].id } as DeepPartial<Rider>,
        payment_status: 'paid',
        sender_name: 'Bob Smith',
        receiver_name: 'Alice Johnson',
        receiver_phone: '1234567890',
        special_instruction: undefined,
        createdBy: 'system',
        updatedBy: 'system',
        createdOn: new Date(),
        updatedOn: new Date(),
        status:true
      },
    ] as DeepPartial<shipment_request>[];
    const savedRequests = await requestRepo.save(requests);
    console.log('✅ Inserted Shipment Requests:', savedRequests);

    // Seed shipment with valid request_id
   const shipments: DeepPartial<Shipment>[] = [
  {
    tracking_number: 'SHIP001',
     customer: { id: savedCustomers[0].id }, // relation instead of customer_id
    pickup_time: new Date('2025-07-31T14:00:00'),
  
    // cod_amount: 50.0,
    parcel_type: 'regular',
 
 
 
 
 
     createdBy: 'system',
    updatedBy: 'system',
    createdOn: new Date(),
    updatedOn: new Date(),
    status: true,
    courierCompany: { company_id: savedCompanies[0].company_id },
    rider: { id: savedRiders[0].id },
  },
  {
    tracking_number: 'SHIP002',
     customer: { id: savedCustomers[1].id },
    pickup_time: new Date('2025-07-31T15:00:00'),
     // delivery_status: 'delivered',
    // cod_amount: 100.0,
    parcel_type: 'large',
 
     createdBy: 'system',
    updatedBy: 'system',
    createdOn: new Date(),
    updatedOn: new Date(),
    status: true,
    courierCompany: { company_id: savedCompanies[1].company_id },
    rider: { id: savedRiders[0].id },
  },
];

const savedShipments = await shipmentRepo.save(shipments);
console.log('✅ Inserted Shipments:', savedShipments);

// Update shipment_request with shipment reference
 
await requestRepo.save(savedRequests);
console.log('✅ Updated Shipment Requests with shipment:', savedRequests);

     console.log('✅ Inserted Shipments:', savedShipments);

    // Update shipment_request with shipment reference
  
    await requestRepo.save(savedRequests);
    console.log('✅ Updated Shipment Requests with shipment:', savedRequests);

    // ... (rest of the seeding for cod_payment remains the same)

    await AppDataSource.query('COMMIT');
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    console.error(error);
    await AppDataSource.query('ROLLBACK');
  } finally {
    // Do not destroy the connection here to allow migration generation to proceed
    console.log('🔒 DB connection closed.');
  }
}

unifiedSeed().catch(console.error);