// src/models/ratings.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Shipment } from './shipment.entity';
import { Customer } from './customer.entity';
import { Rider } from './rider.entity';
import { courier_company } from './courier_company.entity';


@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shipment, (shipment) => shipment.ratings)
  shipment: Shipment;

  @ManyToOne(() => Customer, (customer) => customer.ratings)
  customer: Customer;

  @ManyToOne(() => Rider, (rider) => rider.ratings)
  rider: Rider;

  @ManyToOne(() => courier_company, (company) => company.ratings)
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
}
