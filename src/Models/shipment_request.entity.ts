
// ../Models/shipment_request.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { courier_company } from './courier_company.entity';
import { Customer } from './customer.entity';
import { Rider } from './rider.entity';
import { Shipment } from './shipment.entity';

@Entity()
export class shipment_request {
  @PrimaryGeneratedColumn()
  request_id: number;

@Column({ type: 'varchar', length: 255, nullable: true }) // Allow null initially
  pickup_location: string;

@Column({ type: 'varchar', length: 255, nullable: true }) // Allow null initially
  dropoff_location: string;

  @Column({type:'enum', enum:['regular', 'bulk', 'contract'], nullable:true

  })
  parcel_type: string;

  @Column({
    type: 'enum',
    enum: ['small', 'medium', 'large'], nullable:true
  })
  package_size: string;

  @Column({type:'float'})
  weight: number;

  @Column({type:'float'})
  length: number;

  @Column({type:'float'})
  height: number;

  @Column({ type: 'float', nullable: true }) // Custom width
  width: number;

@Column({ type: 'text', nullable: true })
  description: string;

  @Column({type:'float'})
  base_price: number;
@Column({
    type: 'enum',
    enum: ['prepaid', 'cod'],
    default: 'prepaid',
  })
  payment_mode: 'prepaid' | 'cod';

  @Column({ type: 'float', nullable: true })
  cod_amount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  })
  shipment_status: string;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string; // If rejected, store reason
  
  @Column({ type: 'timestamp' })
  request_date: Date;

  @Column({length:50, nullable:true})
  pickup_time_slot: string;

  @Column({
    type: 'enum',
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  })
  payment_status: string;

  @Column()
  sender_name: string;

  @Column()
  receiver_name: string;

  @Column()
  receiver_phone: string;

  @Column({ type: 'text', nullable: true })
  special_instruction: string;

@Column({ type: 'text', array: true, nullable: true, default: () => 'ARRAY[]::text[]' })
parcel_photos: string[];

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;

  @Column({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;

  @Column({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP'})
  updatedOn: Date;

  @Column({ type: 'boolean', default: null })
  status: boolean;

@ManyToOne(() => Customer, (customer) => customer.shipment_request) // Add inverse side if needed
@JoinColumn({ name: 'customer_id' })
customer: Customer;

@ManyToOne(() => Rider)
  @JoinColumn({ name: 'rider_id' }) // Ensure this matches the DB column name
  rider: Rider;

  @OneToOne(() => Shipment, (shipment) => shipment.request) // Non-owning side
  shipment: Shipment;

  @ManyToOne(() => courier_company)
  @JoinColumn({ name: 'company_id' }) // Ensure this matches the DB column name
  company: courier_company;
}