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

   @Column({ length: 250 })
  role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
createdOn: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
updatedOn: Date;

  @Column({length:50, nullable: true})
  createdBy: string;

  @Column({length:50, nullable: true})
  updatedBy: string;

  @Column({ type: 'boolean', default: null })
  is_active: boolean;

  


}