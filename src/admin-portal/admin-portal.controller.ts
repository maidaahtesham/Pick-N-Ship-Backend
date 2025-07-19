import { Controller, Get, Post, Body, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { AdminPortalService } from './admin-portal.service';
import { courier_company_dto } from 'src/ViewModel/courier_company_dto';
import { edit_courier_company_dto } from 'src/ViewModel/edit_courier_company.dto';
import { Response } from 'src/ViewModel/response';
import { super_admin } from 'src/Models/super_admin.entity';


@Controller('api/admin-portal')
export class AdminPortalController {
  constructor(private readonly adminPortalService: AdminPortalService) {}

  @Post('create-super-admin')
  @HttpCode(200)
  async createSuperAdmin(@Body() data: Partial<super_admin>): Promise<Response> {
    return this.adminPortalService.createSuperAdmin(data);
  }


@Get('get-all-companies-details')
  @HttpCode(200)
  async getallCompanies(): Promise<Response> {
    return await this.adminPortalService.getallCompaniesdetails();
  }

  @Get('get-company')
  @HttpCode(200)
  async getCompany(@Query('companyId') companyId: number): Promise<Response> {
    return await this.adminPortalService.getCompany(companyId);
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
updateCompanyStatus(@Body() data: { company_id: number; status: 'accepted' | 'declined'; rejection_reason?: string }) {
  return this.adminPortalService.updateCompanyStatus(data.company_id, data.status, data.rejection_reason);
}

  @Post('set-commission')
  setCommission(@Body() body: { company_id: number; commission_type: string; commission_rate?: string }) {
    return this.adminPortalService.setCommission(body);
  }

  @Get('search-companies')
  searchCompanies(@Query('query') query: string) {
    return this.adminPortalService.searchCompanies(query);
  }

 @Get('get-all-jobs')
  getAllJobs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminPortalService.getAllJobs({ page, limit, status, search });
  }




}