import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Rating } from './ratings.entity';
import { courier_company } from './courier_company.entity';
import { Rider } from './rider.entity';
import { Customer } from './customer.entity';
import { shipment_request } from './shipment_request.entity';
import { shipping_detail } from './shipping_detail.entity';
import { CodPayment } from './cod_payment.entity';
import { shipment_jobs } from './shipment_jobs.entity';
import { earning } from './earnings.entity';
import { text } from 'stream/consumers';

// Shipment Entity
@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;
 
 @Column({unique:true, nullable:true})
  tracking_number: string;

  // @Column({nullable:true})
  // request_id: number; /*questionable*/ 

  // @Column()
  // customer_id: number;

  @Column({nullable:true})
  pickup_time: Date;  

  @Column({nullable:true})
  delivery_time: Date;  

  @Column({nullable:true})
  delivery_status: string; /*questionable*/

  @Column({nullable:true})
  cod_amount: number;  

  @Column({nullable:true})
  parcel_type: string;  

    @Column({nullable:true})
  parcel_details: string;

  @Column({nullable:true})
  parcel_size: string;

  @Column({nullable:true})
  pickup_address: string;

  @Column({nullable:true})
  delivery_address: string;

  @Column({nullable:true})
  sender_name: string;

  @Column({nullable:true})
  receiver_name: string;

  @Column({nullable:true})
  sender_phone: string;

  @Column({nullable:true})
  receiver_phone: string;

  @Column({nullable:true})
  payment_mode: string;

  @Column({nullable:true})
  delivered_on: Date;

  @Column({nullable:true})
  job_status: string;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
createdOn: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
updatedOn: Date;

@Column({ name: 'createdBy', length: 50, nullable: true })
createdBy: string;

  @Column({length:50, nullable: true})
  updatedBy: string;

@Column({ type: 'boolean', nullable: true })
status?: boolean;


@OneToMany(() => Rating, (rating) => rating.shipment)
  ratings: Rating[];

@ManyToOne(() => courier_company, (company) => company.shipments)
@JoinColumn({ name: 'company_id' })
courierCompany: courier_company;

@ManyToOne(() => Rider, (rider) => rider.shipments)
@JoinColumn({ name: 'rider_id' }) // This is important!
rider: Rider;

@ManyToOne(() => Customer, (customer) => customer.shipment_request) 
@JoinColumn({ name: 'customer_id' }) customer: Customer;



@OneToOne(() => CodPayment, (codPayment) => codPayment.shipment, { cascade: true })
  cod_payment: CodPayment;

@OneToOne(() => shipment_request, (request) => request.shipment)
@JoinColumn({ name: 'request_id' })
shipment_request: shipment_request;

@ManyToOne(() => shipping_detail, (detail) => detail.shipments, { nullable: true })
@JoinColumn({ name: 'shipping_id' })
shippingDetail: shipping_detail;


    @OneToMany(() => shipment_jobs, (job) => job.shipment)
    shipmentJobs: shipment_jobs[];

    
  @OneToMany(() => earning, (earning) => earning.shipment)
earnings: earning[];


}