import { Body, Controller, HttpCode, Inject, Post, UseGuards,Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { CustomerUserService } from './customer_user.service';
import { customer_signup_dto } from 'src/ViewModel/customer_signup_dto';
import { Response } from 'src/ViewModel/response';
import { JwtService } from '@nestjs/jwt';
import { ShipmentRequestDTO } from 'src/ViewModel/shipmentRequestDTO';
import { RegularBookingDTO } from 'src/ViewModel/RegularBookingDTO';

@UseGuards(JwtAuthGuard)

@Controller('api/customer-user')
export class CustomerUserController {
/**
 *
 */
constructor(private readonly customerUserService: CustomerUserService) {}
        
 
 
@Post('shipment-request')
  @HttpCode(200)
  async createShipmentRequest(@Request() req, @Body() body: ShipmentRequestDTO): Promise<Response> {
    const customerId = req.user.sub; // Assuming JWT payload includes sub as customerId
    return this.customerUserService.createShipmentRequest(customerId, body);
  }


@Post('create-regular-booking')
@HttpCode(200)
async createRegularBooking(@Request() req, @Body() body: RegularBookingDTO): Promise<Response> {
  const customerId = req.user.sub;
  return this.customerUserService.createRegularBooking(customerId, body);
}


}
