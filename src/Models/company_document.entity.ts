import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { courier_company } from './courier_company.entity';

@Entity()
export class company_document {
  @PrimaryGeneratedColumn()
  document_id: number;

  @Column()
  company_id: number;

  // Relation mapped to same column
  @ManyToOne(() => courier_company, (company) => company.company_document)
  @JoinColumn({ name: 'company_id' })   // ✅ same column use hoga
  company: courier_company;

  @Column({ length: 255, nullable: true })
  trade_license_document_path: string;

  @Column({ length: 255, nullable: true })
  company_document_path: string;

  @Column({ length: 255, nullable: true })
  establishment_card: string;

  @Column({ type: 'date', nullable: true })
  trade_license_expiry_date: string;

  @Column({ length: 50, nullable: true })
  trade_license_number: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdOn: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  updatedOn: Date;

    @Column({length:50, nullable: true})
  createdBy: string;

  @Column({length:50, nullable: true})
  updatedBy: string;

  @Column()
  is_active: boolean;
}