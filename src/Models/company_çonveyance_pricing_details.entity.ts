import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { shipping_detail } from "./shipping_detail.entity";
import { company_çonveyance_details } from "./company_conveyance_details.entity";

@Entity()

export class company_çonveyance_pricing_details {
@PrimaryGeneratedColumn()
  pricing_id: number;

  @ManyToOne(() => company_çonveyance_details,
    (conveyance) => conveyance.pricing,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'conveyance_id' })
  conveyance_detail: company_çonveyance_details;

  @Column({ type: 'enum', enum: ['small', 'medium', 'large'] })
  size: string;

  @Column('float')
  weight: number;

  @Column('float')
  width: number;

  @Column('float')
  length: number;

  @Column('float')
  height: number;

  @Column('float')
  baseFare: number;

  @Column('float')
  pricePerKm: number;

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