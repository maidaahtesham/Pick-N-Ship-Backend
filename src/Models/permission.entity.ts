import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { RolePermission } from "./role-permission.entity"


@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 100, unique: true })
  permission_name: string

  @Column({ type: "varchar", length: 100 })
  module: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "boolean", default: true })
  status: boolean

  @CreateDateColumn()
  created_on: Date

  @UpdateDateColumn()
  updated_on: Date

  @Column({ type: "varchar", length: 50, nullable: true })
  created_by: string

  @Column({ type: "varchar", length: 50, nullable: true })
  updated_by: string

  @OneToMany(
    () => RolePermission,
    (rp) => rp.permission,
    { cascade: true },
  )
  role_permissions: RolePermission[]
}
