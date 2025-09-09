import { DataSource } from "typeorm";
import { Rider } from "../Models/rider.entity";
import { courier_company } from "../Models/courier_company.entity";

export async function seedRider(ds: DataSource) {
  const riderRepo = ds.getRepository(Rider);
  const companyRepo = ds.getRepository(courier_company);

  const company = await companyRepo.findOne({ where: { company_name: "TCS" } });
  if (!company) {
    console.log("⚠️ Courier company not found, run courier_company seed first!");
    return;
  }

  const exists = await riderRepo.findOne({ where: { email: "rider1@tcs.com" } });
  if (exists) {
    console.log("⚠️ Rider already exists, skipping...");
    return;
  }

  const rider = riderRepo.create({
    rider_name: "Rider One",
    phone_number: "03011234567",
    vehicle_type: "Bike",
    est_free_time: "2025-01-10T12:00:00Z",
    distance: 0,
    availability_status: "true",
    assigned_jobs: 0,
    rider_code: "RDR001",
    email: "rider1@tcs.com",
    licence_number: "LIC123456",
    registration_number: "REG98765",
    registration_datetime: new Date(),
    documents: "",
    createdBy: "system",
    updatedBy: "system",
    status: true,
  });

  await riderRepo.save(rider);
  console.log("✅ Rider seeded!");
}
