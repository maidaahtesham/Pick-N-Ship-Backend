import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class super_admin {
  @PrimaryGeneratedColumn()
  admin_id: number;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 20 })
  contact_phone: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 255, nullable: true })
  profile_picture_path: string;

}