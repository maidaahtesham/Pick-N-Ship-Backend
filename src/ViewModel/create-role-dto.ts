export class CreateRoleDto {
  role_name: string;
  description?: string;
  created_by: string; // not createdBy
  created_on?: Date;
  permissions: number[]; // not array of objects
}
