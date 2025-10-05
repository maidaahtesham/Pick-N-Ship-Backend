import { Body, Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { courier_company } from '../Models/courier_company.entity';
import { Response } from '../ViewModel/response';
import { vendorSignUpDTO } from '../ViewModel/vendorSignUpDTO.dto';
import { vendorDetailsDTO } from '../ViewModel/vendorDetailsDTO.dto';
import { company_document_dto } from '../ViewModel/company_document_dto';
import { shipping_detail_dto } from '../ViewModel/shipping_detail_dto';
import { Shipment } from '../Models/shipment.entity';
import { GetAllActiveShipmentsDto, GetAllShipmentsDto } from 'src/ViewModel/get_all_shipment_dto';
import { GetShipmentDetailsDto } from 'src/ViewModel/GetShipmentDetailsDto.dto';
import { VendorOperationDTO } from 'src/ViewModel/VendorOperationDTO';
import { profile_status_update_dto } from 'src/ViewModel/profile_status_update_dto';
import { GetAllShipmentsVendorDto } from 'src/ViewModel/get_all_shipment_customer_dto';
import { AcceptShipmentDto } from 'src/ViewModel/accept-shipmentDto';


@Controller('api/vendor')
export class VendorController {
constructor (private readonly vendorService:VendorService)
{}

@Post('create-vendor-user')
@HttpCode(200)
async createVendorUser(@Body() data:vendorSignUpDTO): Promise<Response>{
    return this.vendorService.createVendorUser(data);
}


@UseGuards(JwtAuthGuard)
@Post('add-vendor-details')
  @HttpCode(200)
  async addVendorDetails(@Body() data: vendorDetailsDTO): Promise<Response> {
    return this.vendorService.addVendorDetails(data);
  }
@UseGuards(JwtAuthGuard)
  @Post('add-company-documents')
  @HttpCode(200)
  async addCompanyDocuments(@Body() data: company_document_dto): Promise<Response> {
    return this.vendorService.addCompanyDocuments(data);
  }



@UseGuards(JwtAuthGuard)
@Post('add-vendor-complete-details')
@HttpCode(200)
async addVendorCompleteDetails(
  @Body() data: VendorOperationDTO,
): Promise<Response> {
  return this.vendorService.addVendorCompleteDetails(data);
}


@UseGuards(JwtAuthGuard)
@Post('add-shipping-details')
@HttpCode(200)
async addShippingDetails(@Body() data: shipping_detail_dto): Promise<Response> {
  return this.vendorService.addShippingDetails(data);
}

  @UseGuards(JwtAuthGuard)
  @Post('get-all-jobs')
  async getAllJobs(
    @Body()
    body: {
      company_id: number;
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    },
  ) {
    const { company_id, page, limit, status, search } = body;

    // Directly call the service method with the company_id from the body
    const result = await this.vendorService.getAllJobsByCompany({
      companyId: company_id,
      page,
      limit,
      status,
      search,
    });

    return result;
  }
  // @UseGuards(JwtAuthGuard)
  // @Post('get-all-shipments')
  // async getAllShipments(@Body() getAllShipmentsDto: GetAllShipmentsDto) {
  //   return this.vendorService.getAllShipments(getAllShipmentsDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('get-all-shipments')
  async getAllShipments(@Body() getAllShipmentsDto: GetAllShipmentsVendorDto) {
    return this.vendorService.getAllShipments(getAllShipmentsDto);
  }


  @UseGuards(JwtAuthGuard)
  @Post('get-all-active-shipments')
  async getAllActiveShipments(@Body() getAllActiveShipmentsDto: GetAllActiveShipmentsDto ) {
    return this.vendorService.getAllActiveShipments(getAllActiveShipmentsDto);
  }

  
@UseGuards(JwtAuthGuard)
@Post('all-riders')
async getAllRiders(@Body() body: any) {
  const { page, perPage, search, sortBy, sortOrder, companyId } = body;
  
  return this.vendorService.getAllRiders(
    page,
    perPage,
    sortBy,
    sortOrder,
    search,
    companyId,
  );
}

@UseGuards(JwtAuthGuard)
@Post('get-list-of-all-available-riders')
async getAllAvailableRiders(@Body() body: any) {
  const { page, perPage, search, sortBy, sortOrder, companyId } = body;
  
  return this.vendorService.getAllAvailableRiders(
    page,
    perPage,
    sortBy,
    sortOrder,
    search,
    companyId,
  );
}

@UseGuards(JwtAuthGuard)
@Post('shipment/cod')
async getShipmentCod(@Body() body: { 
  shipmentId?: number | null; 
  company_id?: number | null;
  status?: string | null;
  page?: number;
  limit?: number;
}) {
  const page = body.page && body.page > 0 ? body.page : 1;
  const limit = body.limit && body.limit > 0 ? body.limit : 10;

  return this.vendorService.getShipmentCodDetails(
 
    body.company_id ?? null,
    body.status ?? null,
    page,
    limit,
  );
}

@UseGuards(JwtAuthGuard)
@Post('cod/mark-received')
async markCodAsReceived(@Body() body: { shipmentId: number }) {
  return this.vendorService.markShipmentAsReceived(body.shipmentId);
}

@UseGuards(JwtAuthGuard)
@Post('get-shipment-details')
async getShipmentDetails(@Body() getShipmentDetailsDto: GetShipmentDetailsDto) {
  return this.vendorService.getShipmentDetails(getShipmentDetailsDto);
}
// @UseGuards(JwtAuthGuard)
// @Post('get-dashboard-stats')
//   async getStats(@Body('companyId') companyId: number) {
//     return this.vendorService.getDashboardStats(companyId);
//   }

@UseGuards(JwtAuthGuard)
@Post('get-shipment-details-by-Id')
  async getShipmentDetailsbyId(@Body('shipmentId') shipmentId: number) {
    return this.vendorService.getShipmentDetailsById(shipmentId);
  }

// @UseGuards(JwtAuthGuard)
// @Post('update-profile-status') 
// async updateProfileStatus(
//   @Body() data:profile_status_update_dto): Promise<Response> {
//   return this.vendorService.updateProfileStatus(data);
// }

@Post(':shipmentId/accept')
  @HttpCode(200)
  async acceptShipment(
    @Param('shipmentId') shipmentId: number,
    @Body() acceptShipmentDto: AcceptShipmentDto,
  ): Promise<Response> {
    return this.vendorService.acceptShipment(shipmentId, acceptShipmentDto);
  }


@UseGuards(JwtAuthGuard)
@Post('assign-job')
async assignJobToRider(
  @Body() body: { 
    shipmentId: number; 
    riderId?: number; 
    companyId?: number; 
    autoAssign?: boolean; 
    pickup_time?: Date;
  }
) {
  const { shipmentId, riderId, companyId, autoAssign, pickup_time } = body;
  return this.vendorService.assignRiderToJob(shipmentId, riderId, companyId, autoAssign, pickup_time);
}



}
