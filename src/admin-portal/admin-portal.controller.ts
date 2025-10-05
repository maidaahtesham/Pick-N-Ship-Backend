import { Controller, Get, Post, Body, Param, Delete, HttpCode, Query, NotFoundException, HttpStatus, UseGuards, Req, UseInterceptors, UploadedFile, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminPortalService } from './admin-portal.service';
import { edit_courier_company_dto } from '../ViewModel/edit_courier_company.dto';
import { Response } from '../ViewModel/response';
import { super_admin } from '../Models/super_admin.entity';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { admin_user } from 'src/ViewModel/admin-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/admin-portal')
export class AdminPortalController {
  constructor(private readonly adminPortalService: AdminPortalService) {}

@Post('create-super-admin')
  @HttpCode(200)
  async createSuperAdmin(@Body() data: Partial<super_admin>): Promise<Response> {
    return this.adminPortalService.createSuperAdmin(data);
  } 

 @UseGuards(JwtAuthGuard)
  @Post('update-password')
  @HttpCode(200)
  async updatePassword(@Body() data: { admin_id: number; newPassword: string }): Promise<any> {
    return this.adminPortalService.updatePassword(data);
  }


 @UseGuards(JwtAuthGuard)
 @Post('upload-profile-picture')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('profile_picture'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
     const filePath = await this.adminPortalService.saveFile(file);
    return { path: filePath };
  }

 @UseGuards(JwtAuthGuard)
@Post('get-superadmin-profile')
  @HttpCode(200)
  async getProfile(@Body() body: admin_user, @Req() req: Request): Promise<Response> {
     const admin_id = body.admin_id;
    return this.adminPortalService.getProfile(admin_id); }


 @UseGuards(JwtAuthGuard)
@Post('get-all-companies-details')
@HttpCode(200)
async getallCompanies(@Body() body: any): Promise<Response> {
  return await this.adminPortalService.getallCompaniesdetails(body);
}

 @UseGuards(JwtAuthGuard)
  @Post('get-company')
@HttpCode(200)
async getCompany(@Body() body: { companyId: number }): Promise<Response> {
  return await this.adminPortalService.getCompany(body.companyId);
}


 @UseGuards(JwtAuthGuard)
  @Post('edit-company')
  @HttpCode(200)
  async editCompany(@Body() data: edit_courier_company_dto): Promise<Response> {
    return await this.adminPortalService.editCompany(data);
  }

 @UseGuards(JwtAuthGuard)
  @Delete('delete-company/:companyId')
  @HttpCode(200)
  async deleteCompany(@Param('companyId') companyId: number): Promise<Response> {
    return await this.adminPortalService.deleteCompany(companyId);
  }

 @UseGuards(JwtAuthGuard)
@Post('update-company-status')
updateCompanyStatus(@Body() data: { company_id: number; status: 'pending'| 'active' | 'declined'; rejection_reason?: string ; acceptance_reason?: string}): Promise<Response> {
  return this.adminPortalService.updateCompanyStatus(data.company_id, data.status, data.rejection_reason, data.acceptance_reason);
}


 @UseGuards(JwtAuthGuard)
 @Post('get-commission')
 @HttpCode(200)
  async getCommission(@Body() body: { company_id: number; page?: number; limit?: number }): Promise<Response> {
    return this.adminPortalService.getCommission(body);
  }

 @UseGuards(JwtAuthGuard)
 @Post('set-commission')
  
  @UsePipes(new ValidationPipe({ transform: true }))
   async setCommission(@Body() body: { company_id: number; commission_type: string; commission_rate: string }[]) {
    console.log(body);
     return this.adminPortalService.setCommission(body);
  }
 


 @UseGuards(JwtAuthGuard)
@Post('get-ratings')
@HttpCode(200)
async getRatings(@Body() body: { companyId: number; page?: number; limit?: number }, @Res() response): Promise<Response> {
  const { companyId, page = 1, limit = 10 } = body;
  const result = await this.adminPortalService.getRatings(companyId, page, limit);
  return response.status(result.httpResponseCode).json(result);
}
 
 @UseGuards(JwtAuthGuard)
  @Post('search-companies')
searchCompanies(@Body() body: { company_name?: string; city?: string }) {
  return this.adminPortalService.searchCompanies(body.company_name, body.city);
}


 @UseGuards(JwtAuthGuard)
@Post('get-all-jobs')
getAllJobs(@Body() body: { page?: number; limit?: number; status?: string; search?: string }) {
  const { page = 1, limit = 10, status, search } = body;
  return this.adminPortalService.getAllJobs({ page, limit, status, search });
}


 
 @UseGuards(JwtAuthGuard)
@Post('shipment-overview')
async getShipmentOverview(@Body('id') id: number) {
  return this.adminPortalService.getShipmentOverview(id);
}


 @UseGuards(JwtAuthGuard)
@Post('cod')
async getAll(@Body() body: { 
  page?: number; 
  limit?: number; 
  company?: string;
  status?: string;
}) {
  const page = body.page ? +body.page : 1;
  const limit = body.limit ? +body.limit : 10;
  const company = body.company;
  const status = body.status; // optional

  return this.adminPortalService.getCodShipments(page, limit, company, status);
}




  // Get total COD summary (Receivable, Pending, Retrieved)
  
 @UseGuards(JwtAuthGuard)
  @Get('summary')
  async getSummary() {
    return this.adminPortalService.getCodSummary();
  }

 @UseGuards(JwtAuthGuard)
@Post('cod/mark-paid')
async markCodAsPaid(@Body() body: { codPaymentId: number }) {
  return this.adminPortalService.markCodAsPaid(body.codPaymentId);
}




}