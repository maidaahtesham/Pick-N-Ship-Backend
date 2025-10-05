import { Body, Controller, HttpCode, Inject, Post, UseGuards,Request, Req, ValidationPipe, Param, BadRequestException, UseInterceptors, UploadedFiles, Query, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { CustomerUserService } from './customer_user.service';
import { customer_signup_dto } from '../ViewModel/customer_signup_dto';
import { Response } from '../ViewModel/response';
import { JwtService } from '@nestjs/jwt';
import { ShipmentRequestDTO } from '../ViewModel/shipmentRequestDTO';
import { RegularBookingDTO } from '../ViewModel/RegularBookingDTO';
import { GetAllShipmentsCustomerDto } from 'src/ViewModel/get_all_shipment_customer_dto';
import { GetAddressesDto } from 'src/ViewModel/get-addresses.dto';
import { CreateFullShipmentDTO } from 'src/ViewModel/CreateShipmentRequestDto';
import { CreateRatingDto } from 'src/ViewModel/CreateRatingDto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { PaymentDTO } from 'src/ViewModel/PaymentDto';
import { UpdateCustomerProfileDto } from 'src/ViewModel/UpdateCustomerProfileDto';
 
// @UseGuards(JwtAuthGuard)

@Controller('api/customer-user')
export class CustomerUserController {
/**
 *
 */
constructor(private readonly customerUserService: CustomerUserService) {}
        
 
 
// @Post('create-shipment-request')
//   @HttpCode(200)
//   async step1(@Body(ValidationPipe) body: CreateShipmentRequestDto): Promise<Response> {
//     return this.customerUserService.createShipmentRequest(body.customerId, body);
//   }

//   @Post('add-parcel-detail/:shipmentId')
//   @HttpCode(200)
//   async step2(@Body(ValidationPipe) body: CompleteShipmentDTO, @Param('shipmentId') shipmentId: string): Promise<Response> {
//     const id = parseInt(shipmentId, 10);
//     if (isNaN(id)) {
//       throw new BadRequestException('Invalid shipmentId');
//     }
//     return this.customerUserService.AddParcelDetails(body.customerId, id, body);
//   }

// @UseGuards(JwtAuthGuard)
//  @Post('create-full-shipment')
//   @HttpCode(200)
//   async createFullShipment(@Body(ValidationPipe) body: CreateFullShipmentDTO): Promise<Response> {
//     return this.customerUserService.createFullShipment(body);
//   }

//updated one

// @Post('create-full-shipment-updated')
//   @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], multerOptions))
//   async createFullShipmentupdated(
//     @Body() body: CreateFullShipmentDTO,
//     @UploadedFiles() files: { files?: Express.Multer.File[] },
//   ): Promise<Response> {
//     return this.customerUserService.createFullShipmentUpdated(body, files.files || [], body.customerId);
//   }

//Active
@Post('create-full-shipment-updated')
  async createFullShipmentupdated(
    @Body() body: CreateFullShipmentDTO,
  ): Promise<Response> {
    return this.customerUserService.createFullShipmentUpdated(body );
  }
 
 @Post('create-full-shipment')
@UseInterceptors(
  FileFieldsInterceptor(
    [{ name: 'files', maxCount: 20 }], // max file count increase if needed
    multerOptions
  )
)
async createFullShipment(
  @Body() body: CreateFullShipmentDTO,
  @UploadedFiles() files: { files?: Express.Multer.File[] },
): Promise<Response> {
  // 👇 yahan ab JWT se nahi, frontend se bheje gaye customerId use hoga
  return this.customerUserService.createFullShipment(
    body,
    files.files || [],
    body.customerId
  );
}



@UseGuards(JwtAuthGuard)
@Post('get-courier-options')
  @HttpCode(200)
  async getCourierOptions(@Body(ValidationPipe) body: CreateFullShipmentDTO): Promise<Response> {
    try {
      return await this.customerUserService.getCourierOptions(body);
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve courier options: ${error.message}`);
    }
  }


  
//   @Post('create-shipment-request')
//    @UseGuards(JwtAuthGuard)
//  async createShipmentRequest(@Body() createShipmentRequestDto: CreateShipmentRequestDto ) {
//    const { customerId } = createShipmentRequestDto;
//     return this.customerUserService.createShipmentRequest(createShipmentRequestDto, customerId);
//   }


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
    @Post('add-address')
  async addAddress(@Body() body: any) {
    return this.customerUserService.addAddress(body);
  }


@UseGuards(JwtAuthGuard)
  @Post('get-addresses')
  async getAddresses(@Body() getAddressesDto: GetAddressesDto) {
    return this.customerUserService.getAddresses(getAddressesDto);
  }

@UseGuards(JwtAuthGuard)
@Post('get-address-detail')
async getAddressDetail(@Body() body: { address_id: number; customer_id: number }) {
  return this.customerUserService.getAddressDetail(body);
}


@UseGuards(JwtAuthGuard)
@Post('edit-address')
  async editAddress(@Body() body: any) {
    const { customer_id, address_id } = body;
    if (!customer_id || !address_id || isNaN(parseInt(address_id))) {
      throw new BadRequestException('Invalid customer_id or address_id');
    }
    return this.customerUserService.editAddress(customer_id, parseInt(address_id), body);
  }

@UseGuards(JwtAuthGuard)
@Post('delete-address')
  async deleteAddress(@Body() body: any) {
    const { customer_id, address_id } = body;
    if (!customer_id || !address_id || isNaN(parseInt(address_id))) {
      throw new BadRequestException('Invalid customer_id or address_id');
    }
    return this.customerUserService.deleteAddress(customer_id, parseInt(address_id));
  }

@UseGuards(JwtAuthGuard)
  @Post('create-rating')
  async createRating(@Body() createRatingDto: CreateRatingDto ): Promise<Response> {
 
    return this.customerUserService.createRating(createRatingDto );
  }


@Post('make-payment')
  async makePayment(@Body() paymentDTO: PaymentDTO, @Query('shipmentId') shipmentId: number): Promise<any> {
    try {
      const paymentResult = await this.customerUserService.processPayment(shipmentId, paymentDTO);
      return {
        success: true,
        message: 'Payment processed successfully',
        data: paymentResult,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to process payment',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


@Post('update-profile')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 1 }])) // Limit to 1 file
  @HttpCode(200)
  async updateCustomerProfile(
    @Body() data: UpdateCustomerProfileDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
  ): Promise<Response> {
    data.files = files.files || [];
    return this.customerUserService.updateCustomerProfile(data, data.customerId.toString()); // Pass customerId as string
  }



 


}
