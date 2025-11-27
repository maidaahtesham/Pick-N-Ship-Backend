import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('admin_commission_settings')
export class admin_commission_settings {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['standard', 'sme','custom'], default: 'standard' })
  commission_type: string;

  @Column({ type: 'varchar', nullable: false })
  commission_rate: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedOn: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;


}
