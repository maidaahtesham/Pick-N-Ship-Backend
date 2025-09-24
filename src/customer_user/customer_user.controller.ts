import { Body, Controller, HttpCode, Inject, Post, UseGuards,Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { CustomerUserService } from './customer_user.service';
import { customer_signup_dto } from '../ViewModel/customer_signup_dto';
import { Response } from '../ViewModel/response';
import { JwtService } from '@nestjs/jwt';
import { ShipmentRequestDTO } from '../ViewModel/shipmentRequestDTO';
import { RegularBookingDTO } from '../ViewModel/RegularBookingDTO';
import { GetAllShipmentsCustomerDto } from 'src/ViewModel/get_all_shipment_customer_dto';
import { GetAddressesDto } from 'src/ViewModel/get-addresses.dto';

// @UseGuards(JwtAuthGuard)

@Controller('api/customer-user')
export class CustomerUserController {
/**
 *
 */
constructor(private readonly customerUserService: CustomerUserService) {}
        
 
 
// @Post('shipment-request')
//   @HttpCode(200)
//   async createShipmentRequest(@Request() req, @Body() body: ShipmentRequestDTO): Promise<Response> {
//     const customerId = req.user.sub; // Assuming JWT payload includes sub as customerId
//     return this.customerUserService.createShipmentRequest(customerId, body);
//   }


@Post('create-regular-booking')
@HttpCode(200)
async createRegularBooking(@Request() req, @Body() body: RegularBookingDTO): Promise<Response> {
  const customerId = req.user.sub;
  return this.customerUserService.createRegularBooking(customerId, body);
}


@Post('create-customer-user')
@HttpCode(200)
async createCustomerUser(@Body() data:customer_signup_dto): Promise<Response>{
    return this.customerUserService.createCustomerUser(data);
}


  @UseGuards(JwtAuthGuard)
  @Post('get-all-shipments')
  async getAllShipments(@Body() getAllShipmentsDto: GetAllShipmentsCustomerDto) {
    return this.customerUserService.getAllShipments(getAllShipmentsDto);
  }
@UseGuards(JwtAuthGuard)
  @Post('get-addresses')
  async getAddresses(@Body() getAddressesDto: GetAddressesDto) {
    return this.customerUserService.getAddresses(getAddressesDto);
  }
}
