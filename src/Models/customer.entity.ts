import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rating } from "./ratings.entity";
import { shipment_request } from "./shipment_request.entity";
import { courier_company } from "./courier_company.entity";
import { CustomerAddresses } from "./customer_addresses.entity";
import { Shipment } from "./shipment.entity";
  
@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({unique:true})
  email: string;

  @Column()
  password: string;

  @Column()
  user_type: string;

  @Column({unique:true, length: 20, nullable: true })
   phone_number: string;

  @OneToMany(() => Rating, (rating) => rating.customer)
    ratings: Rating[];

      @OneToMany(() => Shipment, (shipment) => shipment.customer)
    shipment: Shipment[];
    
@ManyToOne(() => courier_company, (company) => company.customer, { nullable: true })
  @JoinColumn({ name: 'company_id' }) // Foreign key column
  company: courier_company;

@OneToMany(() => CustomerAddresses, (address) => address.customer)
customer_addresses: CustomerAddresses[];


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

@Column({type:'boolean', default: null})
is_email_verified:boolean;



  }
