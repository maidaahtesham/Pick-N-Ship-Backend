import { shipping_detail } from '../Models/shipping_detail.entity';
import { DataSource } from 'typeorm';

export async function seedShippingDetails (ds: DataSource) {
    const repo = ds.getRepository(shipping_detail);
  const exists = await repo.findOne({ where: { shipping_id: 1 } });
  if (exists) {
    console.log("⚠️ Shipping Details already exists, skipping...");
    return;
  }
    const shipping_details = [
      {
        shipping_id: 1,
        company_id: 1,
        conveyance_types: 'bike',
        conveyance_details: 'Yamaha FZ',
        commission_rate: '10%',
        createdOn: new Date(),
        updatedOn: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
        is_active: true,
    },
          ];

    await repo.save(shipping_details);
    console.log('✅ Shipping Details seeded successfully!');
  }
