import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rating } from "./ratings.entity";
import { shipment_request } from "./shipment_request.entity";

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

  @OneToMany(() => Rating, (rating) => rating.customer)
    ratings: Rating[];

      @OneToMany(() => shipment_request, (shipment_request: shipment_request) => shipment_request.customer)
    shipment_request: shipment_request[];
}
