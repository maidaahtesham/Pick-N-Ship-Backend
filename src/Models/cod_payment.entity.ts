import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shipment } from "./shipment.entity";
import { courier_company } from "./courier_company.entity";
import { Rider } from "./rider.entity";

@Entity()
export class CodPayment {
  // Define your entity properties here
    @PrimaryGeneratedColumn()
  id: number;
@Column({})
cod_amount: number;

@Column({length: 50})
payment_status: string;

@Column({type:'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
collectedOn: Date;

@Column({length: 255 })
amount_received: string;

@Column({length: 255, nullable: true })
pending_amount: string;

@Column({length: 255, nullable: true })
retrieved_amount: string;

@Column({length: 255, nullable: true })
sender_name: string;

@Column({length: 255, nullable: true })
delivered_on:string;

 @Column({ type: 'boolean', default: false })
  is_paid_to_company: boolean;

  @Column({ type: 'boolean', default: false })
  is_remitted_to_pns: boolean;

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
  
@ManyToOne(() => Rider, (rider) => rider.codPayments)
@JoinColumn({ name: 'rider_id' })
rider: Rider;

// @OneToOne(() => Shipment, (shipment) => shipment.cod_payment)
// @JoinColumn({ name: 'shipment_id' })
// shipment: Shipment;

@OneToOne(() => Shipment, (shipment) => shipment.cod_payment)
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

@ManyToOne(() => courier_company, (company) => company.codPayments)
@JoinColumn({ name: 'courier_company_id' }) // 👈 Better naming
courierCompany: courier_company;



}
