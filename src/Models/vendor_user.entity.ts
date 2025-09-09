import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rating } from "./ratings.entity";
import { shipment_request } from "./shipment_request.entity";
import { courier_company } from "./courier_company.entity";

@Entity()
export class  vendor_user{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email_address: string;

  @Column()
  password: string;

  @Column({ nullable:true})
  phone_number: string;
  
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

@ManyToOne(() => courier_company, (company) => company.vendorUser) 
@JoinColumn({ name: 'company_id' }) 
company: courier_company;
}
