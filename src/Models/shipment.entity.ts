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
import { parcel_details } from './parcel_detail.entity';

 
@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;
 
 @Column({unique:true, nullable:true})
  tracking_number: string;

 @Column({ type: 'varchar', length: 255, nullable: true })  
  pickup_location: string; 

    @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  })
  shipment_status: string;

  @Column({type:'enum',
  enum:['regular', 'bulk'], nullable:true
})
  parcel_type: string;


@Column({
    type: 'enum',
    enum: ['prepaid', 'cod'],
    default: 'prepaid',
  })
  payment_mode: 'prepaid' | 'cod';



 @Column({nullable:true})
 shipment_created_on: Date;  

  @Column({nullable:true})
  pickup_time: Date;  
 
 @Column({
    type: 'enum', nullable:true,
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  })
  payment_status: string; 



@Column({ default:false, type: 'boolean'  })
is_reviewed?: boolean;


  // @Column({
  //   type: 'enum',
  //   enum: ['small', 'medium', 'large', 'custom'], nullable:true
  // })
  // package_size: string;

  // @Column({type:'float', nullable:true})
  // weight: number;

  // @Column({type:'float' , nullable:true})
  // length: number;

  // @Column({type:'float' , nullable:true})
  // height: number;

  // @Column({ type: 'float', nullable: true })  
  // width: number;

// @Column({ type: 'text', nullable: true })
//   description: string;

//   @Column({type:'float'})
//   base_price: number;
//   @Column({ type: 'float', nullable: true })
//   cod_amount: number;
//   @Column({nullable:true})
//   receiver_name: string;
//   @Column({nullable:true})
//   receiver_phone: string;

//   @Column({ type: 'text', nullable: true })
//   special_instruction: string;

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
@JoinColumn({ name: 'rider_id' }) 
rider: Rider;

@ManyToOne(() => Customer, (customer) => customer.shipment) 
@JoinColumn({ name: 'customer_id' }) customer: Customer;

    @OneToMany(() => parcel_details, (parcel) => parcel.shipments, { cascade: true })
  parcels: parcel_details[];

@OneToOne(() => CodPayment, (codPayment) => codPayment.shipment, { cascade: true })
  cod_payment: CodPayment;

 

 


 

 

}