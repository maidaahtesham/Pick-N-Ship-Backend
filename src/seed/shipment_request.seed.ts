// src/seed/shipment_request.seed.ts
import { DataSource } from 'typeorm';
import { shipment_request } from '../Models/shipment_request.entity';
import { Customer } from '../Models/customer.entity';
import { courier_company } from '../Models/courier_company.entity';
import { Rider } from '../Models/rider.entity';

export async function seedShipmentRequests(dataSource: DataSource) {
  const repo = dataSource.getRepository(shipment_request);

  // Check if request with id 1 already exists
  const exists = await repo.findOne({ where: { request_id: 1 } });
  if (exists) {
    console.log("⚠️ Shipment Request already exists, skipping...");
    return;
  }

  // Load dependencies
  const customer = await dataSource.getRepository(Customer).findOne({ where: { id: 4 } });
  const company = await dataSource.getRepository(courier_company).findOne({ where: { company_id: 1 } });
  const rider = await dataSource.getRepository(Rider).findOne({ where: { id: 1 } });

  if (!customer || !company) {
    throw new Error("⚠️ Seed failed: Please insert at least 1 customer and 1 courier company before seeding shipment requests.");
  }

  const request = [
    {
    pickup_location: "Karachi, Pakistan",
    dropoff_location: "Lahore, Pakistan",
    parcel_type: "regular",
    package_size: "medium",
    weight: 5.5,
    length: 30,
    height: 20,
    width: 15,
    base_price: 1200,
    shipment_status: "pending",
    request_date: new Date(),
    pickup_time_slot: "9AM - 12PM",
    payment_status: "unpaid",
    sender_name: "Ali Khan",
    receiver_name: "Ahmed Raza",
    receiver_phone: "03219876543",
    special_instruction: "Handle with care",
    parcel_photos: ["photo1.jpg", "photo2.jpg"],
    createdBy: "seed-script",
    updatedBy: "seed-script",
    createdOn:new Date(),
    updatedOn:new Date(),
    status: true,
    customer,
    company,
    rider
  },];

  await repo.save(request);
  console.log("✅ Shipment Request seeded successfully");
}
