import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";

@Entity()
export class CustomerAddresses {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.customer_addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ length: 255 })
  street: string;

   @Column({ length: 255, nullable: true })
  area: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 50, nullable: true })
  country: string;

  @Column({nullable:true})
  address:string


  @Column({ length: 255, nullable: true })
  building_name: string;

  @Column({ length: 255, nullable: true })
  apartment: string;

 @Column({ length:255, nullable: true })
  makani_number: string;

  @Column({ length: 50, nullable: true })
  nearest_landmark: string;

    @Column({ length: 50, nullable: true })
  address_type: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

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
}