// auth/auth.controller.ts
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminPortalService } from 'src/admin-portal/admin-portal.service';
import { VendorService } from 'src/vendor/vendor.service';
import { CustomerUserService } from 'src/customer_user/customer_user.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private adminPortalService:AdminPortalService, private vendorService:VendorService, private customerService:CustomerUserService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.adminPortalService.validateSuperAdmin(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('vendor-login')
  async vendorlogin(@Body() body: { email: string; password: string }) {
    const user = await this.vendorService.validateVendorUser(body.email, body.password);
    return this.authService.vendorlogin(user);

  }
@Post('customer-login')
  async customerLogin(@Body() body: { email: string; password: string })
  {
    const user = await this.customerService.validateCustomerUser(body.email, body.password);
    return this.authService.customerlogin(user);
  
  }
  }
