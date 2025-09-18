import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rating } from "./ratings.entity";
import { shipment_request } from "./shipment_request.entity";
import { Shipment } from "./shipment.entity";
import { courier_company } from "./courier_company.entity";
import { CodPayment } from "./cod_payment.entity";
import { shipment_jobs } from "./shipment_jobs.entity";

@Entity()
export class Rider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true })
  rider_tag_id: string;

  @Column()
  rider_name: string;

  @Column()
  phone_number: string;

  @Column()
  vehicle_type: string;

  @Column()
  est_free_time: string;

  @Column('float')
  distance: number;

  @Column()
  availability_status: string;

  @Column()
  assigned_jobs: number;

  @Column()
  rider_code: string;

  @Column()
  email: string;

  @Column()
  licence_number: string;

  @Column()
  registration_number: string;

  @Column()
  registration_datetime: Date;

  @Column('text')
  documents: string;

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
  
  @OneToMany(() => Rating, (rating) => rating.rider)
    ratings: Rating[];

@OneToMany(() => shipment_request, (shipmentRequest) => shipmentRequest.rider)
  shipmentRequests: shipment_request[]; // Renamed to avoid naming conflict and follow convention

@OneToMany(() => Shipment, (shipment) => shipment.rider)
shipments: Shipment[];

@OneToMany(() => CodPayment, (codPayment) => codPayment.rider)
codPayments: CodPayment[]; // Assuming a rider can have multiple cod payments

@ManyToOne(() => courier_company, (company) => company.shipments)
 @JoinColumn({ name: 'company_id' }) company: courier_company;


    @OneToMany(() => shipment_jobs, (job) => job.rider)
    shipmentJobs: shipment_jobs[];

}

