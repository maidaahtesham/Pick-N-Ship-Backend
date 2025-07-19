import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rating } from './ratings.entity';
import { shipment_request } from './shipment_request.entity';
import { text } from 'stream/consumers';
import { Shipment } from './shipment.entity';

@Entity()
export class courier_company {
  @PrimaryGeneratedColumn()
  company_id: number;

  @Column({ length: 100 })
  company_name: string;

  @Column({ length: 255, nullable: true })
  logo: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 20 })
  contact_phone: string;

    @Column({ length: 20, nullable: true })
  company_phone_number: string;

  @Column({ length: 20 })
  pns_account: string;

  @Column({ length: 50, nullable: true })
  trade_license_number: string;

  @Column({ type: 'date', nullable: true })
  trade_license_expiry_date: string;

  @Column({ length: 255, nullable: true })
  trade_license_document_path: string;

  @Column({ length: 255, nullable: true })
  company_document_path: string;

  @Column({ length: 255, nullable: true })
  establishment_card: string;

  @Column({ type: 'date' })
  establishment_date: string;

  @Column({ length: 255, nullable: true })
  establishment_details: string;

  @Column({
    type: 'enum',
    enum: ['active', 'pending', 'declined'],
    default: 'pending',
  })
  @Column({ length: 20, nullable: true })
  registration_status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registration_date: Date;

  @Column({
    type: 'enum',
    enum: ['bike', 'van', 'truck'],
  })
  conveyance_types: string;

  @Column({ type: 'text' })
  conveyance_details: string;

  @Column({
    type: 'enum',
    enum: ['standard', '10%', '5%', 'custom'],
  })
  commission_rate: string;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ length: 100 })
  email_address: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  address_line1: string;

  @Column({ length: 100, nullable: true })
  address_line2: string;

  @Column({ length: 20 })
  postal_code: string;

  @Column({ length: 50 })
  country: string;

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

}