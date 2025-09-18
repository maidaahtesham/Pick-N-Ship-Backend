import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Shipment } from './shipment.entity';
import { Rider } from './rider.entity';
 
@Entity('shipment_jobs')
export class shipment_jobs {

  @PrimaryGeneratedColumn()
  job_id: number;

  @Column({
    type: 'enum',
    enum: ['assigned', 'picked_up', 'delivered'],
    default: 'assigned',
  })
  job_status: string;

  @Column({ type: 'timestamp', nullable: true })
  assigned_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  picked_up_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date;

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

 
  @ManyToOne(() => Shipment, shipment => shipment.shipmentJobs)
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;
  
   
  @ManyToOne(() => Rider, rider => rider.shipmentJobs)
  @JoinColumn({ name: 'rider_id' })
  rider: Rider;
}