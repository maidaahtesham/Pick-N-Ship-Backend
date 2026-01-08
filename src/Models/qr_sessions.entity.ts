// ../Models/qr_session.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { courier_company } from './courier_company.entity';
import { Rider } from './rider.entity';

@Entity()
export class qr_sessions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  session_id: string;

  @ManyToOne(() => courier_company, (company) => company.qr_sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: courier_company;

  @Column({ type: 'varchar', length: 255 })
  company_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rider_name: string;

// @ManyToOne(() => Rider, (rider) => rider.qr_sessions, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'rider_id' })
//   rider: Rider;

  @Column({ type: 'boolean', default: false })
  used: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP + interval '1 hour'" })
  expires_at: Date;

  // Optional audit fields if you want to keep the same as Rating entity
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  createdOn: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  updatedOn: Date;

  @Column({ length: 50, nullable: true })
  createdBy: string;

  @Column({ length: 50, nullable: true })
  updatedBy: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;
}
