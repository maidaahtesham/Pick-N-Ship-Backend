import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Rating } from './ratings.entity';
import { courier_company } from './courier_company.entity';
import { Rider } from './rider.entity';
import { CodPayment } from './cod_payment.entity';
import { Customer } from './customer.entity';
import { shipment_request } from './shipment_request.entity';
import { shipping_detail } from './shipping_detail.entity';

// Shipment Entity
@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;
 
 @Column()
  shipment_id_tag_no: string;

  @Column({nullable:true})
  request_id: number;

  @Column()
  customer_id: number;

  @Column()
  pickup_time: Date;

  @Column()
  delivery_time: Date;

  @Column()
  delivery_status: string;

  @Column('float')
  cod_amount: number;

  @Column()
  parcel_type: string;

  @Column()
  sender_name: string;

  @Column()
  receiver_name: string;

  @Column()
  sender_phone: string;

  @Column()
  receiver_phone: string;

  @Column()
  shipment_type: string;

  @Column()
  delivered_on: Date;

  @Column()
  job_status: string;

  @Column('text')
  parcel_details: string;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
createdOn: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
updatedOn: Date;

@Column({ name: 'createdBy', length: 50, nullable: true })
createdBy: string;

  @Column({length:50, nullable: true})
  updatedBy: string;

    @Column({ type: 'boolean', default: null })
  status: boolean;

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

@ManyToOne(() => shipping_detail, (shippingDetail) => shippingDetail.shipping_id, { nullable: true }) // New relationship
  @JoinColumn({ name: 'shipping_id' }) // Link to shipping_detail's shipping_id
  shippingDetail: shipping_detail;

}