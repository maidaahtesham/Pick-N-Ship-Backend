import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { courier_company } from './courier_company.entity';
import { shipping_pricing } from './shipping_pricing.entity';
import { company_çonveyance_pricing_details } from './company_çonveyance_pricing_details.entity';

@Entity('company_commission_rate')
export class company_commission_rate {

@PrimaryGeneratedColumn()
  id: number;

   @Column({
    type: 'enum',
    enum: ['standard', 'sme', 'custom'],
    default: 'standard',
  })
  commission_type: string;

  @Column({ type: 'varchar', nullable: true })
  commission_rate: string;

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


  @ManyToOne(() => courier_company, (company) => company.commissionRates)
  @JoinColumn({ name: 'company_id' })  
  company: courier_company;


}