import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { shipment_request } from "./shipment_request.entity";
import { Shipment } from "./shipment.entity";

@Entity()
export class parcel_details {
  @PrimaryGeneratedColumn()
  parcel_id: number;

  @ManyToOne(() => Shipment, shipment => shipment.parcels)
  @JoinColumn({ name: 'shipment_id' })
shipments: Shipment;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dropoff_location: string;

@Column({ type: 'text', nullable: true })
  description: string;

  @Column({nullable:true})
  sender_name: string;


  @Column({nullable:true})
  sender_phone: string;

  @Column()
  receiver_name: string;

  @Column()
  receiver_phone: string;

  @Column({ type: 'enum', enum: ['small', 'medium', 'large' ,'custom'], nullable: true })
  package_size: string;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'float' })
  length: number;

  @Column({ type: 'float' })
  height: number;

  @Column({ type: 'float', nullable: true })
  width: number;

  @Column({ type: 'text', array: true, nullable: true, default: () => 'ARRAY[]::text[]' })
  parcel_photos: string[];

   @Column({ type: 'float', nullable: true })
  cod_amount: number;

    @Column()
  createdBy: string;

  @Column()
  updatedBy: string;

  @Column({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;

  @Column({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP'})
  updatedOn: Date;

  @Column({ type: 'boolean', default: null })
  status: boolean;
}