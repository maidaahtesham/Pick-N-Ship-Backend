import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Role } from "./role.entity"
import { Permission } from "./permission.entity"

export enum PermissionLevel {
  VIEW_ONLY = "view_only",
  ADD = "add",
  EDIT = "edit",
  FULL_CONTROL = "full_control",
}

@Entity("role_permissions")
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => Role,
    (role) => role.role_name,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "role_id" })
  role: Role

  @Column()
  role_id: number

  @ManyToOne(
    () => Permission,
    (permission) => permission.role_permissions,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "permission_id" })
  permission: Permission

  @Column()
  permission_id: number

  @Column({
    type: "enum",
    enum: PermissionLevel,
    
  })
  access_level: PermissionLevel

  @Column({ type: "boolean", default: true })
  status: boolean

  @CreateDateColumn()
  assigned_on: Date

  @Column({ type: "varchar", length: 50, nullable: true })
  assigned_by: string

  @Column ({ type: "varchar", length: 50, nullable: true })
  updated_by: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: true })
  updated_on: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: true })
  created_on: Date

  @Column ({ type: "varchar", length: 50, nullable: true })
  created_by: string




}
