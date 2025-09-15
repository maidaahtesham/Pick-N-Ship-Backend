import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { courier_company } from './courier_company.entity';
import { shipping_pricing } from './shipping_pricing.entity';
import { company_çonveyance_pricing_details } from './company_çonveyance_pricing_details.entity';

@Entity()
export class company_çonveyance_details {

@PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => courier_company, (company) => company.shipping_details)
  @JoinColumn({ name: 'company_id' })  
  company: courier_company;

  @OneToMany(() => company_çonveyance_pricing_details,
    (pricing) => pricing.conveyance_detail,
    { cascade: true }
  )
  pricing: company_çonveyance_pricing_details[];

  @Column({
    type: 'enum',
    enum: ['bike', 'van', 'truck'],
  })
  conveyance_types: string;

  @Column({ type: 'text' })
  conveyance_details: string;

  // @Column({
  //   type: 'enum',
  //   enum: ['standard', '10%', '5%', 'custom'],
  // })
  // commission_rate: string;


  @Column({ type: 'varchar', nullable: true })
  commission_rate: string;


    @Column({ type: 'varchar', nullable: true })
  commission_type: string;
  
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