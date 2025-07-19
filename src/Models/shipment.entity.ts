import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Rating } from './ratings.entity';
import { courier_company } from './courier_company.entity';

// Shipment Entity
@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courier_company_id: number;

  @Column()
  request_id: number;

  @Column()
  customer_id: number;

  @Column()
  rider_id: number;

  @Column()
  pickup_time: Date;

  @Column()
  delivery_time: Date;

  @Column()
  status: string;

  @Column('float')
  cod_amount: number;

  @Column()
  parcel_type: string;

  @Column()
  sender_name: string;

  @Column()
  receiver_name: string;

  @Column()
  sender_phone: string;

  @Column()
  receiver_phone: string;

  @Column()
  shipment_type: string;

  @Column()
  delivered_on: Date;

  @Column()
  job_status: string;

  @Column('text')
  parcel_details: string;

@OneToMany(() => Rating, (rating) => rating.shipment)
  ratings: Rating[];

@ManyToOne(() => courier_company, (company) => company.shipments)
@JoinColumn({ name: 'courier_company_id' })
courierCompany: courier_company;
}