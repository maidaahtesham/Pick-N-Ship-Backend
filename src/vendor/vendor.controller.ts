import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { courier_company } from '../Models/courier_company.entity';
import { Response } from '../ViewModel/response';
import { vendorSignUpDTO } from '../ViewModel/vendorSignUpDTO.dto';
import { vendorDetailsDTO } from '../ViewModel/vendorDetailsDTO.dto';
import { company_document_dto } from '../ViewModel/company_document_dto';
import { shipping_detail_dto } from '../ViewModel/shipping_detail_dto';
import { Shipment } from '../Models/shipment.entity';
import { GetAllShipmentsDto } from 'src/ViewModel/get_all_shipment_dto';


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
  @UseGuards(JwtAuthGuard)
  @Post('get-all-shipments')
  async getAllShipments(@Body() getAllShipmentsDto: GetAllShipmentsDto) {
    return this.vendorService.getAllShipments(getAllShipmentsDto);
  }
  
  @UseGuards(JwtAuthGuard)
@Post('all-riders')
  async getAllRiders(@Body() body: any) {
    const { page, perPage, search, sortBy, sortOrder } = body;
    
     return this.vendorService.getAllRiders(
      page,
      perPage,  
      sortBy,
      sortOrder,
      search,
    );
  }

}
