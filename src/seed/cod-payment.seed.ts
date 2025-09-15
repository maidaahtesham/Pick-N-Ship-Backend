// src/seeds/cod-payment.seed.ts

import { CodPayment } from "src/Models/cod_payment.entity";
import { courier_company } from "../Models/courier_company.entity";
import { Rider } from "../Models/rider.entity";
import { Shipment } from "../Models/shipment.entity";
import { DataSource } from "typeorm";


export const seedCodPayments = async (dataSource: DataSource) => {
  const codPaymentRepo = dataSource.getRepository(CodPayment);

  // Relations
  const riderRepo = dataSource.getRepository(Rider);
  const shipmentRepo = dataSource.getRepository(Shipment);
  const companyRepo = dataSource.getRepository(courier_company);

  const riders = await riderRepo.find();
  const shipments = await shipmentRepo.find();
  const companies = await companyRepo.find();

  const codPayments = [
    {
      cod_amount: 500,
      payment_status: "Collected",
      collectedOn: new Date(),
      amount_received: "500",
      pending_amount: "0",
      retrieved_amount: "0",
      sender_name: "Ali Khan",
      delivered_on: new Date().toISOString(),

      rider: riders[0],
      shipment: shipments[0],
      courierCompany: companies[0],
    },
    {
      cod_amount: 750,
      payment_status: "Pending",
      collectedOn: new Date(),
      amount_received: "500",
      pending_amount: "250",
      retrieved_amount: "0",
      sender_name: "Ahmed Raza",
      delivered_on: new Date().toISOString(),

      rider: riders[1],
      shipment: shipments[1],
      courierCompany: companies[1],
    },
  ];

  await codPaymentRepo.save(codPayments);

  console.log("✅ CodPayments seeded successfully!");
};
