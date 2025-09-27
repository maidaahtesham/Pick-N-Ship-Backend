import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Shipment } from './shipment.entity';
import { courier_company } from './courier_company.entity';
 
@Entity('earnings')
export class earning {

  @PrimaryGeneratedColumn()
  earning_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  service_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  platform_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cod_return_amount: number;

  @Column({ type: 'date' })
  date: Date;

 
 

  @ManyToOne(()=> courier_company, company => company.earnings)
    @JoinColumn({ name: 'company_id' })
    company: courier_company;
}