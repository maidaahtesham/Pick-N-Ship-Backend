import { Customer } from '../Models/customer.entity';
import { courier_company } from '../Models/courier_company.entity';
import { Shipment } from '../Models/shipment.entity';
import { DataSource } from 'typeorm';
import { Rider } from '../Models/rider.entity';
import { shipping_detail } from '../Models/shipping_detail.entity';

export async function seedShipments(dataSource: DataSource) {
  const shipmentRepo = dataSource.getRepository(Shipment);

  // Check if shipment with id 1 already exists
  const exists = await shipmentRepo.findOne({ where: { id: 3 } });
  if (exists) {
    console.log("⚠️ Shipment already exists, skipping...");
    return;
  }

  const company = await dataSource.getRepository(courier_company).findOne({ where: { company_id: 1 } });
  const customer = await dataSource.getRepository(Customer).findOne({ where: { id: 4 } });
  const rider = await dataSource.getRepository(Rider).findOne({ where: { id: 1 } });
  const shippingDetail = await dataSource.getRepository(shipping_detail).findOne({ where: { shipping_id: 1 } });

  if (!company || !customer) {
    throw new Error('⚠️ Seed failed: Please insert at least 1 company & 1 customer before seeding Shipments.');
  }

const shipments =[
    {
    shipment_id_tag_no: 'SHIP001',
    request_id: 1,
    customer_id: customer.id,
    customer: customer,
    courier_company_id: company.company_id,
    courierCompany: company,

    pickup_time: new Date(),
    delivery_time: new Date(), // +2 hrs
    delivery_status: 'Pending',
    cod_amount: 1000,
    parcel_type: 'Box',
    sender_name: 'Ali Khan',
    receiver_name: 'Ahmed Raza',
    sender_phone: '03001234567',
    receiver_phone: '03219876543',
    shipment_type: 'Express',
    delivered_on:new Date(), // +2 hrs,
    job_status: 'Processing',
    parcel_details: 'Electronics package',
    createdOn:new Date(), // +2 hrs,
    updatedOn:new Date(), // +2 hrs
    createdBy: 'seed-script',
    updatedBy: 'seed-script',
    status: true,

    rider: rider ?? undefined,
    shippingDetail: shippingDetail?? undefined,

},];

 

  await shipmentRepo.save(shipments);
  console.log('✅ Shipments seeded successfully');
}
