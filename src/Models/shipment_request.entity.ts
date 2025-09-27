
// ../Models/shipment_request.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { courier_company } from './courier_company.entity';
import { Customer } from './customer.entity';
import { Rider } from './rider.entity';
import { Shipment } from './shipment.entity';
import { parcel_details } from './parcel_detail.entity';

@Entity()
export class shipment_request {
  @PrimaryGeneratedColumn()
  request_id: number;

@Column({ type: 'varchar', length: 255, nullable: true })  
  pickup_location: string;

@Column({ type: 'varchar', length: 255, nullable: true })  
  dropoff_location: string;

  @Column({type:'enum', enum:['regular', 'bulk', 'contract'], nullable:true

  })
  parcel_type: string;

  @Column({
    type: 'enum',
    enum: ['small', 'medium', 'large'], nullable:true
  })
  package_size: string;

  @Column({type:'float', nullable:true})
  weight: number;

  @Column({type:'float' , nullable:true})
  length: number;

  @Column({type:'float' , nullable:true})
  height: number;

  @Column({ type: 'float', nullable: true })  
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
  rejection_reason: string;  

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
  sender_phone: string;

  @Column()
  receiver_name: string;

  @Column()
  receiver_phone: string;

  @Column({ type: 'text', nullable: true })
  special_instruction: string;

// @Column({ type: 'text', array: true, nullable: true, default: () => 'ARRAY[]::text[]' })
// parcel_photos: string[];

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

// @ManyToOne(() => Customer, (customer) => customer.shipment_request)  
// @JoinColumn({ name: 'customer_id' })
// customer: Customer;

@ManyToOne(() => Rider)
  @JoinColumn({ name: 'rider_id' })  
  rider: Rider;

 

  @ManyToOne(() => courier_company)
  @JoinColumn({ name: 'company_id' })  
  company: courier_company;

  //   @OneToMany(() => parcel_details, (parcel) => parcel.shipment_request, { cascade: true })
  // parcels: parcel_details[];
}