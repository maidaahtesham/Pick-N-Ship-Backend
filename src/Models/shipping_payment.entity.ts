import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shipment } from "./shipment.entity";

@Entity()
export class shipping_payment {

  @PrimaryGeneratedColumn()
  shipping_payment_id: number;

  // Relation with shipment
  @ManyToOne(() => Shipment, (shipment) => shipment.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  // Standard delivery fees
  @Column({ type: 'numeric', nullable: true })
  standard_delivery_fees: number;

  // Platform Fee
  @Column({ type: 'numeric', nullable: true })
  platform_fee: number;

  // PNS Commission
  @Column({ type: 'numeric', nullable: true })
  pns_commission: number;

  // VAT
  @Column({ type: 'numeric', nullable: true })
  vat: number;

  // Total
  @Column({ type: 'numeric', nullable: true })
  total: number;

  
  @Column({type:'numeric' , nullable:true})
  sub_total: number;

  


  @Column({type:'boolean',  nullable:true})
  is_cod_submitted: boolean;

  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;


  @Column({type:'varchar', length:100, nullable:true})
    createdBy: string;


    @Column({type:'varchar', length:100, nullable:true})
    updatedBy: string;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedOn: Date;

  @Column({type:'boolean'})
  is_active: boolean;  
  


}
