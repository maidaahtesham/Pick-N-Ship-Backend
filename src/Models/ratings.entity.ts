// ../Models/ratings.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Shipment } from './shipment.entity';
import { Customer } from './customer.entity';
import { Rider } from './rider.entity';
import { courier_company } from './courier_company.entity';


@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' ,nullable:true })  // 1 to 5
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

 @Column({ type: 'decimal', precision: 5, scale: 2 ,nullable:true}) // Store as 0-100
  rider_behavior_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 ,nullable:true}) // Store as 0-100
  on_time_delivery_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 , nullable:true}) // Store as 0-100
  affordability_score: number;

  @Column({ nullable: true })
  review: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
createdOn: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
updatedOn: Date;

  @Column({length:50, nullable: true})
  createdBy: string;

  @Column({length:50, nullable: true})
  updatedBy: string;

@Column({ type: 'boolean', default: true })
status: boolean;



}
