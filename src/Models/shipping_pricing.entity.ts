import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { shipping_detail } from "./shipping_detail.entity";

@Entity()
export class shipping_pricing {
  @PrimaryGeneratedColumn()
  pricing_id: number;

  @ManyToOne(() => shipping_detail, (shipping) => shipping.pricing)
  @JoinColumn({ name: 'shipping_id' })
  shipping: shipping_detail;

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