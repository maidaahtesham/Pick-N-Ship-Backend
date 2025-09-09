// src/models/ratings.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Shipment } from './shipment.entity';
import { Customer } from './customer.entity';
import { Rider } from './rider.entity';
import { courier_company } from './courier_company.entity';


@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })  // 1 to 5
  stars: number;

@ManyToOne(() => Shipment, (shipment) => shipment.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  @ManyToOne(() => Customer, (customer) => customer.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
  
  @ManyToOne(() => Rider, (rider) => rider.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rider_id' })
  rider: Rider;

  @ManyToOne(() => courier_company, (company) => company.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: courier_company;

  @Column('text')
  rider_behavior_score: string;

  @Column('text')
  on_time_delivery_score: string;

  @Column('text')
  affordability_score: string;

  @Column({ nullable: true })
  review: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
createdOn: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
updatedOn: Date;

  @Column({length:50, nullable: true})
  createdBy: string;

  @Column({length:50, nullable: true})
  updatedBy: string;

@Column({ type: 'boolean', default: null })
status: boolean;



}
