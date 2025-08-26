import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { Customer } from 'src/Models/customer.entity';
import { Rider } from 'src/Models/rider.entity';
import { Shipment } from 'src/Models/shipment.entity';
import { Rating } from 'src/Models/ratings.entity';
import { shipment_request } from 'src/Models/shipment_request.entity';
import { CodPayment } from 'src/Models/cod_payment.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);

    console.log('👉 Starting courier dashboard seed...');

    // 1. Insert Customer
    const customer = new Customer();
    customer.firstname = 'Ali';
    customer.lastname = 'Khan';
    customer.email = 'ali.khan@example.com';
    customer.password = 'securepass';
    customer.user_type = 'regular';
    await dataSource.getRepository(Customer).save(customer);

    // 2. Insert Rider
    const rider = new Rider();
    rider.rider_name = 'Ahmed Rider';
    rider.phone_number = '03331234567';
    rider.vehicle_type = 'Bike';
    rider.est_free_time = '1 hour';
    rider.distance = 5.4;
    rider.availability_status = 'available';
    rider.assigned_jobs = 3;
    rider.rider_code = 'R123';
    rider.email = 'rider.ahmed@example.com';
    rider.licence_number = 'LIC-456789';
    rider.registration_number = 'REG-12345';
    rider.registration_datetime = new Date();
    rider.documents = 'CNIC, Licence';
    rider.shipmentRequests = []; // Initialize to avoid null issues
    rider.shipments = []; // Initialize to avoid null issues
    // rider.shipment is not assigned here since no shipment is assigned yet
    await dataSource.getRepository(Rider).save(rider);

    // 3. Insert Shipment
    const shipment = new Shipment();
    shipment.request_id = 1001;
    shipment.customer_id = customer.id;
    shipment.pickup_time = new Date();
    shipment.delivery_time = new Date();
    shipment.delivery_status = 'delivered';
    shipment.cod_amount = 1500.0;
    shipment.parcel_type = 'Document';
    shipment.sender_name = 'Ali Khan';
    shipment.receiver_name = 'Zara Ali';
    shipment.sender_phone = '03001234567';
    shipment.receiver_phone = '03211234567';
    shipment.shipment_type = 'Express';
    shipment.delivered_on = new Date();
    shipment.job_status = 'Completed';
    shipment.parcel_details = 'Confidential legal document';
    shipment.rider = rider; // Assign the rider to the shipment
    shipment.shipment_id_tag_no = 'SHIP-001';
    shipment.status=true // Assuming this is a unique identifier
    await dataSource.getRepository(Shipment).save(shipment);

    // 4. Insert Ratings
    const rating = new Rating();
    rating.shipment = shipment;
    rating.customer = customer;
    rating.rider = rider;
 
    rating.rider_behavior_score = "4.5";
    rating.on_time_delivery_score = "5.0";
    rating.affordability_score = "4.0";
    rating.review = 'Fast delivery and great service!';
    rating.created_at = new Date();
    await dataSource.getRepository(Rating).save(rating);


    
    // 5. Insert Shipment Request
    const shipmentRequest = new shipment_request();
    shipmentRequest.customer = customer;
    shipmentRequest.company = { company_id: 1 } as any; // Ideally, fetch real CourierCompany entity
    shipmentRequest.pickup_location = '123 Main St, City';
    shipmentRequest.dropoff_location = '456 Elm St, City';
    shipmentRequest.parcel_type = 'regular';
    shipmentRequest.package_size = 'medium';
    shipmentRequest.weight = 2.5;
    shipmentRequest.length = 30.0;
    shipmentRequest.height = 20.0;
    shipmentRequest.base_price = 500.0;
    shipmentRequest.request_date = new Date();
    shipmentRequest.pickup_time_slot = '10:00 AM - 12:00 PM';
    shipmentRequest.rider = rider; // Assign the rider to the shipment request
    shipmentRequest.payment_status = 'unpaid';
    shipmentRequest.sender_name = 'Ali Khan';
    shipmentRequest.receiver_name = 'Zara Ali';
    shipmentRequest.receiver_phone = '03211234567';
    shipmentRequest.special_instruction = 'Handle with care';
    shipmentRequest.status=true;
    await dataSource.getRepository(shipment_request).save(shipmentRequest);



// 6. Insert CodPayment
const codPayment = new CodPayment();
codPayment.cod_amount = 1500;
codPayment.payment_status = 'collected';
codPayment.collectedOn = new Date();
codPayment.amount_received = '1500';
codPayment.pending_amount = '0';
codPayment.retrieved_amount = '1500';
codPayment.sender_name = 'Ali Khan';
codPayment.delivered_on = new Date().toISOString().split('T')[0]; // e.g. '2025-07-21'

// Associations (Note: Fix OneToMany in CodPayment to ManyToOne if you're associating one-to-one)
codPayment.shipment = shipment;
codPayment.rider = rider; // Associate with the rider

// Optional: Associate courierCompany if you have a reference
codPayment.courierCompany = { company_id: 1 } as any;
console.log('🚚 Inserting CodPayment...');
await dataSource.getRepository(CodPayment).save(codPayment);
console.log('✅ CodPayment inserted');

// Update shipment to attach codPayment if needed
shipment.cod_payment = codPayment;
await dataSource.getRepository(Shipment).save(shipment);




    console.log('✅ Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();
