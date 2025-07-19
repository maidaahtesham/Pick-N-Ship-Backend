import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rating } from "./ratings.entity";
import { shipment_request } from "./shipment_request.entity";

@Entity()
export class Rider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_id: number;

  @Column()
  rider_name: string;

  @Column()
  phone_number: string;

  @Column()
  vehicle_type: string;

  @Column()
  est_free_time: string;

  @Column('float')
  distance: number;

  @Column()
  availability_status: string;

  @Column()
  assigned_jobs: number;

  @Column()
  rider_code: string;

  @Column()
  email: string;

  @Column()
  licence_number: string;

  @Column()
  registration_number: string;

  @Column()
  registration_datetime: Date;

  @Column('text')
  documents: string;
  
  @OneToMany(() => Rating, (rating) => rating.rider)
    ratings: Rating[];

@OneToMany(() => shipment_request, (shipmentRequest) => shipmentRequest.rider)
  shipmentRequests: shipment_request[]; // Renamed to avoid naming conflict and follow convention
}

