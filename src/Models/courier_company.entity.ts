import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Rating } from './ratings.entity';
import { shipment_request } from './shipment_request.entity';
import { text } from 'stream/consumers';
import { Shipment } from './shipment.entity';
import { CodPayment } from './cod_payment.entity';
import { company_document } from './company_document.entity';
import { shipping_detail } from './shipping_detail.entity';
import { vendor_user } from './vendor_user.entity';
import { Customer } from './customer.entity';


@Entity()
export class courier_company {
  @PrimaryGeneratedColumn()
  company_id: number;

  @Column({ length: 100 })
  company_name: string;

    @Column({ length: 50 })
  username: string;

  @Column({ length: 255, nullable: true })
  logo: string;

  @Column({ length: 50 })
  city: string;
  
  @Column({length:100, nullable:true})
  company_address:string;

      @Column({ length: 20, nullable: true })
  company_email_address: string;

    @Column({ length: 20, nullable: true })
  company_phone_number: string;

  @Column({ length: 20, nullable: true })
  pns_account_full_name: string;

 @Column({ length: 20, nullable: true })
  registeration_date: string;

   @Column({ length: 20, nullable: true })
  registeration_status: string;

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

@Column({ type: 'text', nullable: true })
rejection_reason: string;

  @OneToMany(() => Rating, (rating) => rating.company)
    ratings: Rating[];
  @OneToMany(() => shipment_request, (shipment_request) => shipment_request.company)
    shipment_request: shipment_request[];

    @OneToMany(() => Shipment, (shipment) => shipment.courierCompany)
    shipments: Shipment[];

    @OneToMany(()=> CodPayment, (codPayment) => codPayment.courierCompany)
    codPayments: CodPayment[];

    @OneToMany(() => company_document, (document) => document.company)
  company_document: company_document[];

  @OneToMany(() => shipping_detail, (shipping) => shipping.company)
  shippingDetails: shipping_detail[];

  @OneToMany(()=> vendor_user,(vendor_user) => vendor_user.company)
  vendorUser: vendor_user[];


  @OneToMany(()=> Customer,(Customer)=> Customer.company , { nullable: true })
customer: Customer[];


}

