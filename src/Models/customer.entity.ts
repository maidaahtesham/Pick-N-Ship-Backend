import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rating } from "./ratings.entity";
import { shipment_request } from "./shipment_request.entity";
import { courier_company } from "./courier_company.entity";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  user_type: string;

  @Column({ length: 20, nullable: true })
   phone_number: string;

  @OneToMany(() => Rating, (rating) => rating.customer)
    ratings: Rating[];

      @OneToMany(() => shipment_request, (shipment_request: shipment_request) => shipment_request.customer)
    shipment_request: shipment_request[];
    
@ManyToOne(() => courier_company, (company) => company.customer, { nullable: true })
  @JoinColumn({ name: 'courier_company_id' }) // Foreign key column
  company: courier_company;



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
