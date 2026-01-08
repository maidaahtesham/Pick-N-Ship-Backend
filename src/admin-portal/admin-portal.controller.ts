import { Controller, Get, Post, Body, Param, Delete, HttpCode, Query, NotFoundException, HttpStatus, UseGuards, Req, UseInterceptors, UploadedFile, Res, UsePipes, ValidationPipe, UploadedFiles, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AdminPortalService } from './admin-portal.service';
import { edit_courier_company_dto } from '../ViewModel/edit_courier_company.dto';
import { Response } from '../ViewModel/response';
import { super_admin } from '../Models/super_admin.entity';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { admin_user } from 'src/ViewModel/admin-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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

//  @UseGuards(JwtAuthGuard)
//  @Post('set-commission')
  
//   @UsePipes(new ValidationPipe({ transform: true }))
//    async setCommission(@Body() body: { company_id: number; commission_type: string; commission_rate: string }[]) {
//     console.log(body);
//      return this.adminPortalService.setCommission(body);
//   }

@UseGuards(JwtAuthGuard)
@Post('update-admin-commission')
async updateAdminCommission(
  @Body() body: { commission_type: string; commission_rate: string }[]
) {
  console.log('Admin Commission Update Body:', body);
  return this.adminPortalService.updateAdminCommission(body);
}

 @UseGuards(JwtAuthGuard)
 @Post('get-admin-commission')
 @HttpCode(200)
  async getAdminCommission(@Body() body: {page?: number; limit?: number }): Promise<Response> {
    return this.adminPortalService.getAdminCommission(body);
  }

@Post('company-based-commission')
@HttpCode(200)
async companyBasedCommission(@Body() body: { company_id: number; rates: any[] }): Promise<Response> {
  return this.adminPortalService.companyBasedCommission(body);
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



  @UseGuards(JwtAuthGuard)
  @Post('get-admin-stats')
  @HttpCode(200)
  async getAdminStats(): Promise<Response> {
    return this.adminPortalService.getAdminStats();
  }

 @Post('check-email')
@HttpCode(200)
async checkEmail(@Body() body: { email: string }): Promise<Response> {
  return this.adminPortalService.checkEmail(body.email);
}

@Post('request-password-reset')
@HttpCode(200)
async requestReset(@Body() body: { email: string }): Promise<Response> {
  return this.adminPortalService.requestPasswordReset(body.email);
}

@Post('validate-reset-token')
@HttpCode(200)
async validateToken(@Body() body: { token: string }): Promise<Response> {
  return this.adminPortalService.validateResetToken(body.token);
}

@Post('reset-password')
@HttpCode(200)
async resetPassword(
  @Body() body: { token: string; newPassword: string; confirmPassword: string },
): Promise<Response> {
  return this.adminPortalService.resetPassword(body);
}


 @UseGuards(JwtAuthGuard)
  @Post('upload-files')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {

    console.log('=== UPLOAD DEBUG ===');           // ← ADD THIS
  console.log('req.user:', req.user);             // ← THIS WILL BE undefined!
  console.log('req.headers.authorization:', req.headers.authorization);

    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
if (!req.user || !req.user.userId) {
    throw new UnauthorizedException('User not authenticated - invalid/missing token');
  }
    const adminId = req.user.userId; // JWT user ID

    // Upload all files
    const urls = await Promise.all(
      files.map((file) => this.adminPortalService.uploadFileToS3(file)),
    );

    // Update first one as profile picture
    const updatedAdmin = await this.adminPortalService.updateProfilePicture(
      adminId,
      urls[0],
    );

    return {
      success: true,
      message: 'Files uploaded & profile updated',
      urls,
      updated_admin: updatedAdmin,
    };
  }




}