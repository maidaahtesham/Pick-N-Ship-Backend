import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { courier_company } from './courier_company.entity';

@Entity()
export class shipping_detail {
  @PrimaryGeneratedColumn()
  shipping_id: number;


  @ManyToOne(() => courier_company, (company) => company.shipping_details)
  @JoinColumn({ name: 'company_id' })  
  company: courier_company;

  @Column({
    type: 'enum',
    enum: ['bike', 'van', 'truck'],
  })
  conveyance_types: string;

  @Column({ type: 'text' })
  conveyance_details: string;

  @Column({
    type: 'enum',
    enum: ['standard', '10%', '5%', 'custom'],
  })
  commission_rate: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdOn: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  updatedOn: Date;

  @Column({length:50, nullable: true})
  createdBy: string;

  @Column({length:50, nullable: true})
  updatedBy: string;

  @Column()
  is_active: boolean;

}