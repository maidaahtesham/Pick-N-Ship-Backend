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

    async vendorlogin(vendor_user: any) {
    const payload = { username: vendor_user.email, sub:vendor_user.admin_id };
    return {
      access_token: this.jwtService.sign(payload),
       vendor_user,
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
