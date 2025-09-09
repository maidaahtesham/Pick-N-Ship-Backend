import { DataSource } from "typeorm";
import dataSource from "../data-source"; // yeh aapka AppDataSource (jahan DB config hoti hai)
import { seedCourierCompany } from "./courier-company.seed";
import { seedRider } from "./rider.seed";
import { seedCompanyDocument } from "./company-document.seed";
import { seedShippingDetails } from "./shipping-detail.seed";
import { seedRatings } from "./ratings.seed";
import { seedShipments } from "./shipment.seed";
import { seedShipmentRequests } from "./shipment_request.seed";
import { seedCodPayments } from "./cod-payment.seed";


async function runSeed() {
  const ds: DataSource = await dataSource.initialize();

  console.log("🌱 Starting database seeding...");

  // await seedSuperAdmin(ds);
  // await seedCourierCompany(ds);
  // await seedCustomer(ds);
  await seedCourierCompany(ds);
  await seedRider(ds);
  await seedCompanyDocument(ds);
  await seedShippingDetails(ds);
  await seedRatings(ds);
  await seedShipments(ds);
  await seedShipmentRequests(ds);
  await seedCodPayments(ds); 
  
  console.log("✅ Seeding completed!");
  await ds.destroy();
}

runSeed().catch((err) => {
  console.error("❌ Seeding error:", err);
});
