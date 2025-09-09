import { DataSource } from "typeorm";
import { courier_company } from "../Models/courier_company.entity";

export async function seedCourierCompany(ds: DataSource) {
  const repo = ds.getRepository(courier_company);

  const exists = await repo.findOne({ where: { company_name: "TCS" } });
  if (exists) {
    console.log("⚠️ Courier company already exists, skipping...");
    return;
  }

  const company = repo.create({
    company_name: "TCS",
    username: "tcs_admin",
    city: "Lahore",
    company_address: "Main Boulevard, Lahore",
    company_email_address: "tcs@example.com",
    company_phone_number: "0421234567",
    pns_account_full_name: "TCS Pakistan",
    registeration_date: "2025-01-01",
    registeration_status: "approved",
    status: true,
  });

  await repo.save(company);
  console.log("✅ Courier company seeded!");
}
