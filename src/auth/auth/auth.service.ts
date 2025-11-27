// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
 
import { AdminPortalService } from 'src/admin-portal/admin-portal.service';
import { CustomerUserService } from 'src/customer_user/customer_user.service';
import { VendorService } from 'src/vendor/vendor.service';
 
@Injectable()
export class AuthService {
  constructor(
private AdminPortalService:AdminPortalService,
private VendorService:VendorService,
private customerUserService:CustomerUserService,
    private jwtService: JwtService
  ) {}


  async login(user: any) {
    const payload = { username: user.email, sub: user.admin_id };
    return {
      access_token: this.jwtService.sign(payload),
       user,
    };
  }

   // auth.service.ts
async vendorlogin(user: any) {
  // Safely build permissions array (even if role or permissions are missing)
  const permissions = (user.role?.role_permissions || [])
    .filter((rp: any) => rp.permission) // extra safety
    .map((rp: any) => ({
      permission_id: rp.permission_id,
      permission: rp.permission.permission_name,
      module: rp.permission.module,
      access_level: rp.access_level, // view_only | add | edit | full_control
    }));

  // JWT Payload – only what you need for authentication & authorization
  const payload = {
    sub: user.id,
    email: user.email_address,
    name: `${user.first_name} ${user.last_name}`.trim(),
    role: user.role?.role_name || null,
    company_id: user.company?.company_id || null,
    permissions, // ← Your gold
    iat: Math.floor(Date.now() / 1000), // optional, but good practice
  };

  // Response sent to frontend
  return {
    access_token: this.jwtService.sign(payload),

    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email_address,
      phone_number: user.phone_number,
      is_email_verified: user.is_email_verified,
      is_profile_complete: user.is_profile_complete,
      status: user.status,
      createdOn: user.createdOn,
      updatedOn: user.updatedOn,

      // Full company details
      company: user.company
        ? {
            company_id: user.company.company_id,
            company_name: user.company.company_name,
            city: user.company.city,
            company_address: user.company.company_address,
            company_email_address: user.company.company_email_address,
            company_phone_number: user.company.company_phone_number,
            pns_account_full_name: user.company.pns_account_full_name,
            registeration_date: user.company.registeration_date,
            registeration_status: user.company.registeration_status,
            rejection_reason: user.company.rejection_reason,
            acceptance_reason: user.company.acceptance_reason,
            is_profile_complete: user.company.is_profile_complete,
          }
        : null,

      // Role info
      role: user.role
        ? {
            id: user.role.id,
            role_name: user.role.role_name,
            description: user.role.description,
          }
        : null,

      // Permissions – this is what your frontend will use to show/hide features
      permissions,
    },
  };
}

   async customerlogin(customer_user: any) {
    const payload = { username: customer_user.email, sub:customer_user.id };
    return {
      access_token: this.jwtService.sign(payload),
       customer_user,
    };
  }


}
