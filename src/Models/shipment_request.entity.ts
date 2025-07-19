import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity'; // Assuming Customer entity exists
import { courier_company } from './courier_company.entity'; // Assuming CourierCompany entity exists
import { Rider } from './rider.entity'; // Assuming Rider entity exists

@Entity()
export class shipment_request {
  @PrimaryGeneratedColumn()
  request_id: number;

  @ManyToOne(() => Customer, (customer) => customer.shipment_request)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => courier_company, (company) => company.shipment_request)
  @JoinColumn({ name: 'company_id' })
  company: courier_company;

  @Column({ length: 255 })
  pickup_location: string;

  @Column({ length: 255 })
  dropoff_location: string;

  @Column({
    type: 'enum',
    enum: ['regular', 'bulk', 'large'],
  })
  parcel_type: string;

  @Column({
    type: 'enum',
    enum: ['small', 'medium', 'large'],
  })
  package_size: string;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'float' })
  length: number;

  @Column({ type: 'float' })
  height: number;

  @Column({ type: 'float' })
  base_price: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  request_date: Date;

  @Column({ length: 50 })
  pickup_time_slot: string;

@ManyToOne(() => Rider, (rider) => rider.shipmentRequests) // Inverse side of the relationship
  @JoinColumn({ name: 'assigned_rider_id' })
  rider: Rider;
  
  @Column({
    type: 'enum',
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  })
  payment_status: string;

  @Column({ length: 100 })
  sender_name: string;

  @Column({ length: 100 })
  receiver_name: string;

  @Column({ length: 20 })
  receiver_phone: string;

  @Column({ type: 'text', nullable: true })
  special_instruction: string;
}