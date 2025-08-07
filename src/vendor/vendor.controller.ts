import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { courier_company } from 'src/Models/courier_company.entity';
import { Response } from 'src/ViewModel/response';
import { vendorSignUpDTO } from 'src/ViewModel/vendorSignUpDTO.dto';
import { vendorDetailsDTO } from 'src/ViewModel/vendorDetailsDTO.dto';
import { company_document_dto } from 'src/ViewModel/company_document_dto';
import { shipping_detail_dto } from 'src/ViewModel/shipping_detail_dto';
import { Shipment } from 'src/Models/shipment.entity';


@UseGuards(JwtAuthGuard)
@Controller('api/vendor')
export class VendorController {
constructor (private readonly vendorService:VendorService)
{}

@Post('create-vendor-user')
@HttpCode(200)
async createVendorUser(@Body() data:vendorSignUpDTO): Promise<Response>{
    return this.vendorService.createVendorUser(data);
}

@Post('add-vendor-details')
  @HttpCode(200)
  async addVendorDetails(@Body() data: vendorDetailsDTO): Promise<Response> {
    return this.vendorService.addVendorDetails(data);
  }

  @Post('add-company-documents')
  @HttpCode(200)
  async addCompanyDocuments(@Body() data: company_document_dto): Promise<Response> {
    return this.vendorService.addCompanyDocuments(data);
  }

  @Post('add-shipping-details')
  @HttpCode(200)
  async addShippingDetails(@Body() data: shipping_detail_dto): Promise<Response> {
    return this.vendorService.addShippingDetails(data);
  }

  @Post('active-jobs')
  async getActiveJobs(@Body() data: { company_id: number }): Promise<Response> {
    return this.vendorService.getActiveJobs(data);
  }
 


}
