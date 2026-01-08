// auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminPortalService } from 'src/admin-portal/admin-portal.service';
import { VendorService } from 'src/vendor/vendor.service';
import { CustomerUserService } from 'src/customer_user/customer_user.service';
import { VendorLoginDto } from 'src/ViewModel/vendor-login.dto';
import { RiderLoginDto } from 'src/ViewModel/rider-login.dto';
import { RiderService } from 'src/rider/rider.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private adminPortalService:AdminPortalService, private vendorService:VendorService, private customerService:CustomerUserService, private riderService:RiderService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.adminPortalService.validateSuperAdmin(body.email, body.password);
    return this.authService.login(user);
  }

  // @Post('vendor-login')
  // async vendorlogin(@Body() body: { email: string; password: string }) {
  //   const user = await this.vendorService.validateVendorUser(body.email, body.password);
  //   return this.authService.vendorlogin(user);

  // }

// auth.controller.ts
@Post('vendor-login')
async vendorlogin(@Body() body: VendorLoginDto) {
  const user = await this.vendorService.validateVendorUser(body.email, body.password);
  return this.authService.vendorlogin(user);
}

@Post('customer-login')
  async customerLogin(@Body() body: { email: string; password: string })
  {
    const user = await this.customerService.validateCustomerUser(body.email, body.password);
    return this.authService.customerlogin(user);
  
  }

@Post('rider-login')
async riderlogin(@Body() body: RiderLoginDto) {
  const user = await this.riderService.validateRiderUser(body.email, body.password);

  // ❌ If login failed → return error response (DO NOT call authService)
  if (user.success === false) {
    return user;
  }

  // ✅ Valid login → call auth service
  return this.authService.riderlogin(user.data);
}




  
  }
