import { Rating } from "../Models/ratings.entity";
import { DataSource } from "typeorm";

export async function seedRatings(ds: DataSource) {
  const repo = ds.getRepository(Rating);

  const exists = await repo.findOne({ where: { id: 1 } });
  if (exists) {
    console.log("⚠️ Rating already exists, skipping...");
    return;
}

  // const rating = repo.create({
  //   id: 1,
  //   stars: 5,
  //   shipment: { shipment_id: 1 } as any,
  //   customer: { customer_id: 1 } as any,
  //   rider: { rider_id: 1 } as any,
  //   company: { company_id: 1 } as any,
  //   rider_behavior_score: "Excellent",
  //   on_time_delivery_score: "On time",
  //   affordability_score: "Affordable",
  //   review: "Great service!",
  //   createdBy: "system",
  //   updatedBy: "system",
  //   created_at: new Date(),
  //   createdOn: new Date(),
  //   updatedOn: new Date(),
  //   status: true,
  // });

  // await repo.save(rating);
  // console.log("✅ Rating seeded!");
}
