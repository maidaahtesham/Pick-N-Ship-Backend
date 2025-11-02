import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 100, unique: true })
  role_name: string

  @Column({ type: "text", nullable: true })
  description: string

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
}
