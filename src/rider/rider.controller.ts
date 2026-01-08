import { BadRequestException, Body, Controller, HttpCode, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateQrSessionDto } from 'src/ViewModel/create-qr-session.dto';
import { RiderService } from './rider.service';
import { GetRegistrationDataDto } from 'src/ViewModel/get-registration-data.dto';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { CompleteProfileDto, ScanQrDto } from 'src/ViewModel/scan-qr.dto';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateRiderProfileDto } from 'src/ViewModel/update_rider_profile_dto';
import { ShippingPaymentDto } from 'src/ViewModel/shipping_payment_dto';

@Controller('api/rider')
export class RiderController {
  constructor(private readonly riderService:RiderService) {}

  // @UseGuards(JwtAuthGuard)
 @Post('create-qr-session')
  async create(@Body() data: CreateQrSessionDto) {
    return this.riderService.createQrSession(data);
  }
@UseGuards(JwtAuthGuard)
  @Post('get-registration-data')
  async getRegistrationData(@Body() getRegistrationDataDto: GetRegistrationDataDto) {
    return this.riderService.getRegistrationData(getRegistrationDataDto.sessionId);
  }
@Post('scan-qr')
  async scanQr(@Body() dto: ScanQrDto) {
    return this.riderService.validateQrAndGetCompany(dto.sessionId);
  }

  // @Post('complete-registration')
  // async completeRegistration(@Body() dto: CompleteProfileDto) {
  //   return this.riderService.completeSelfRegistration(dto);
  // }

@UseGuards(JwtAuthGuard)
@Post('approve-rider')
async approveRider(@Body() body: { riderId: number }) {
  if (!body.riderId) {
    return {
      success: false,
      message: "Rider ID is required",
    };
  }

  return this.riderService.approveRider(body.riderId);
}



@UseGuards(JwtAuthGuard)
@Post('update-rider-status')
async updateRiderStatus(
  @Body() body: { riderId: number; profile_status: string }
) {
  const { riderId, profile_status } = body;

  if (!riderId || !profile_status) {
    return {
      success: false,
      message: "riderId and profile_status are required",
    };
  }

  return this.riderService.updateRiderStatus(riderId, profile_status);
}



@Post('complete-registration')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'driving_license', maxCount: 1 },
    { name: 'vehicle_registration', maxCount: 1 },
    { name: 'emirates_id_front', maxCount: 1 },
    { name: 'emirates_id_back', maxCount: 1 },
  ]),
)
async completeRegistration(
  @Body() dto: CompleteProfileDto,
  @UploadedFiles() files: {
    driving_license?: Express.Multer.File[];
    vehicle_registration?: Express.Multer.File[];
    emirates_id_front?: Express.Multer.File[];
    emirates_id_back?: Express.Multer.File[];
  },
) {
  return this.riderService.completeSelfRegistration(dto, files);
}


@Post('upload-rider-documents')
@UseInterceptors(FilesInterceptor('documents', 10))
async uploadRiderDocuments(@UploadedFiles() files: Express.Multer.File[]) {
  if (!files || files.length === 0) {
    throw new BadRequestException('No files uploaded');
  }

  const urls = await Promise.all(
    files.map((file) => this.riderService.uploadDocumentToS3(file))
  );

  return {
    success: true,
    message: 'Documents uploaded successfully',
    urls,
  };
}


@Post('get-rider-profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Req() req: any) {
  const riderId = req.user.userId; // ✅ FIX HERE
  return this.riderService.getProfile(riderId);
}


@Post('update-rider-profile')
@UseGuards(JwtAuthGuard)
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'driving_license', maxCount: 1 },
    { name: 'vehicle_registration', maxCount: 1 },
    { name: 'emirates_id_front', maxCount: 1 },
    { name: 'emirates_id_back', maxCount: 1 },
  ]),
)
async updateRiderProfile(
  @Req() req,
  @Body() body: UpdateRiderProfileDto,
  @UploadedFiles()
  files: {
    driving_license?: Express.Multer.File[];
    vehicle_registration?: Express.Multer.File[];
    emirates_id_front?: Express.Multer.File[];
    emirates_id_back?: Express.Multer.File[];
  },
) {
  const riderId = req.user.sub;
  return this.riderService.updateRiderProfile(riderId, body, files);
}






// @Post('send-otp')
//   async sendOtp(@Body('phone') phone: string) {
//     return this.riderService.sendOtp(phone);
//   }

//   @Post('verify-otp')
//   async verifyOtp(@Body() body: { phone: string; code: string }) {
//     return this.riderService.verifyOtp(body);
//   }


// @Post('accept-job')
// async acceptJob(@Body('jobId') jobId: number, @Req() req: any) {
//   return this.riderService.acceptJob(jobId, req.user.riderId);
// }





@Post('get-rider-shipments')
@UseGuards(JwtAuthGuard)
async getRiderShipments(@Body() body: any) {
  const { riderId, date, status, paymentMode } = body;

  if (!riderId) {
    return {
      success: false,
      message: "Rider ID is required",
    };
  }

  return this.riderService.getRiderShipments(riderId, { date, status, paymentMode });
}


 @UseGuards(JwtAuthGuard)
@Post('get-today-deliveries-count')
async getTodayDeliveries(@Body() body: any) {
  const { riderId, date } = body;

  if (!riderId) {
    return { success: false, message: "Rider ID is required" };
  }

  return this.riderService.getTodayDeliveries(riderId, date);
}



@UseGuards(JwtAuthGuard)
@Post('get-earnings-summary')
async getEarningsSummary(@Body() body: any) {
  const { riderId, date } = body;

  if (!riderId) {
    return { success: false, message: "Rider ID is required" };
  }

  return this.riderService.getEarningsSummary(riderId, date);
}

@UseGuards(JwtAuthGuard)
@Post('get-cod-shipments')
async getCodShipments(@Body() body: any) {
  const { riderId, date } = body;

  if (!riderId) {
    return { success: false, message: "Rider ID is required" };
  }

  return this.riderService.getCodShipments(riderId, date);
}




@UseGuards(JwtAuthGuard)
@Post('get-prepaid-shipments')
async getPrepaidShipments(@Body() body: any) {
  const { riderId, date } = body;

  if (!riderId) {
    return { success: false, message: "Rider ID is required" };
  }

  return this.riderService.getPrepaidShipments(riderId, date);
}
@UseGuards(JwtAuthGuard)
  @Post('update-rider-availibility-status')
  @HttpCode(200)
  async updateAvailabilityStatus(
    @Body() body: { riderId: number; isProfileActive: boolean }
  ) {
    return this.riderService.updateRiderAvailibilityStatus(body.riderId, body.isProfileActive);
  }




@UseGuards(JwtAuthGuard)
  @Post('get-shipment-details-by-id')
  async getShipmentDetailsById(
    @Body('shipmentId') shipmentId: number,
    @Req() req, 
  ) {
    const riderId = req.user.id; 
    return this.riderService.getShipmentDetailsByIdForRider(shipmentId, riderId);
  }


@UseGuards(JwtAuthGuard)
@Post('fetch-contact-details')
async getContactDetails(@Req() req) {
  const riderId = req.user.id;
  return this.riderService.getContactDetails(riderId);
}



@UseGuards(JwtAuthGuard)
  @Post('update-shipment-status')
  @HttpCode(200)
  async updateShipmentStatus(
    @Body()
    body: {
      riderId: number;
      shipmentId: number;
      shipment_status:
        | 'pending'
        | 'accepted'
        | 'declined'
        | 'assigned'
        | 'in_progress'
        | 'completed'

    },
  ) {
    return this.riderService.updateShipmentStatus(
      body.riderId,
      body.shipmentId,
      body.shipment_status,
    );
  }

@UseGuards(JwtAuthGuard)
@Post('todays-deliveries')
async getTodaysDeliveries(@Req() req) {
    // Debugging: This will show you exactly what is coming from the Guard
    console.log('User Object from Guard:', req.user); 

    // Common fix: Some guards use .id, others use .sub or .userId
    const riderId = req.user?.id || req.user?.userId || req.user?.sub;

    if (!riderId) {
        return {
            success: false,
            message: 'Rider ID not found in request. Check your Auth Guard.'
        };
    }

    return this.riderService.getTodaysDeliveries(riderId);
}

@UseGuards(JwtAuthGuard)
 @Post('total-amount')
async getTotalAmount(@Req() req) {
  const riderId = req.user.userId;
  return this.riderService.getTotalAmount(riderId);
}
@UseGuards(JwtAuthGuard)
@Post('cash-collected')
async getCashCollected(@Req() req) {
   const riderId = req.user.userId; 
  return this.riderService.getCashCollected(riderId);
}
@UseGuards(JwtAuthGuard)
@Post('prepaid-amount')
async getPrepaidAmount(@Req() req) {
  const riderId = req.user.userId;
  return this.riderService.getPrepaidAmount(riderId);
}


@UseGuards(JwtAuthGuard)
@Post('cod-shipments')
async getCodShipmentsCount(@Req() req) {
  const riderId = req.user.userId;
  return this.riderService.getCodShipmentsCount(riderId);
}

// rider.controller.ts (or shipping-payment.controller)
@UseGuards(JwtAuthGuard)
@Post('create-shipping-payment')
async createShippingPayment(
  @Body() body: ShippingPaymentDto,
  @Req() req,
) {
    // 👈 Set created-by automatically

  return this.riderService.createShippingPayment({
    ...body,
   
  });
}

@UseGuards(JwtAuthGuard)
  @Post('update-password')
  @HttpCode(200)
  async updatePassword(@Body() data: { rider_id: number; newPassword: string }): Promise<any> {
    return this.riderService.updatePassword(data);
  }



}
