import { Controller, Get, Post, Body, Param, Delete, HttpCode, Query, NotFoundException, HttpStatus, UseGuards } from '@nestjs/common';
import { AdminPortalService } from './admin-portal.service';
import { edit_courier_company_dto } from 'src/ViewModel/edit_courier_company.dto';
import { Response } from 'src/ViewModel/response';
import { super_admin } from 'src/Models/super_admin.entity';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/admin-portal')
export class AdminPortalController {
  constructor(private readonly adminPortalService: AdminPortalService) {}

@Post('create-super-admin')
  @HttpCode(200)
  async createSuperAdmin(@Body() data: Partial<super_admin>): Promise<Response> {
    return this.adminPortalService.createSuperAdmin(data);
  }

@Post('get-all-companies-details')
@HttpCode(200)
async getallCompanies(@Body() body: any): Promise<Response> {
  return await this.adminPortalService.getallCompaniesdetails(body);
}

  @Post('get-company')
@HttpCode(200)
async getCompany(@Body() body: { companyId: number }): Promise<Response> {
  return await this.adminPortalService.getCompany(body.companyId);
}


  @Post('edit-company')
  @HttpCode(200)
  async editCompany(@Body() data: edit_courier_company_dto): Promise<Response> {
    return await this.adminPortalService.editCompany(data);
  }

  @Delete('delete-company/:companyId')
  @HttpCode(200)
  async deleteCompany(@Param('companyId') companyId: number): Promise<Response> {
    return await this.adminPortalService.deleteCompany(companyId);
  }

@Post('update-company-status')
updateCompanyStatus(@Body() data: { company_id: number; status: 'pending'| 'accepted' | 'rejected'; rejection_reason?: string }) {
  return this.adminPortalService.updateCompanyStatus(data.company_id, data.status, data.rejection_reason);
}

  @Post('set-commission')
  setCommission(@Body() body: { company_id: number; commission_type: string; commission_rate?: string }) {
    return this.adminPortalService.setCommission(body);
  }

 

  @Post('search-companies')
searchCompanies(@Body() body: { company_name?: string; city?: string }) {
  return this.adminPortalService.searchCompanies(body.company_name, body.city);
}


//  @Get('get-all-jobs')
//   getAllJobs(
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 10,
//     @Query('status') status?: string,
//     @Query('search') search?: string,
//   ) {
//     return this.adminPortalService.getAllJobs({ page, limit, status, search });
//   }

@Post('get-all-jobs')
getAllJobs(@Body() body: { page?: number; limit?: number; status?: string; search?: string }) {
  const { page = 1, limit = 10, status, search } = body;
  return this.adminPortalService.getAllJobs({ page, limit, status, search });
}


//   @Post('overview')
// async getShipmentOverview(@Body('id') id: number) {
//   const overview = await this.adminPortalService.getShipmentOverview(id);
//   if (!overview) {
//     throw new NotFoundException('Shipment not found');
//   }
//   return overview;
// }

@Post('shipment-overview')
async getShipmentOverview(@Body('id') id: number) {
  return this.adminPortalService.getShipmentOverview(id);
}


@Post('cod')
async getAll(@Body() body: { page?: number; limit?: number; company?: string }) {
  const page = body.page ? +body.page : 1;
  const limit = body.limit ? +body.limit : 10;
  const company = body.company;
  return this.adminPortalService.getCodShipments(page, limit, company);
}



  // Get total COD summary (Receivable, Pending, Retrieved)
  @Get('summary')
  async getSummary() {
    return this.adminPortalService.getCodSummary();
  }

  // Mark a specific shipment as Paid
  @Post(':shipmentId/pay')
  @HttpCode(HttpStatus.OK)
  async markAsPaid(@Param('shipmentId') shipmentId: string) {
    await this.adminPortalService.markAsPaid(shipmentId);
    return { message: 'Shipment marked as paid' };
  }



}