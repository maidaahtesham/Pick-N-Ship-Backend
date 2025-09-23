import { Body, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs'; // ✅


import { company_document } from '../Models/company_document.entity';
import { courier_company } from '../Models/courier_company.entity';
import { Customer } from '../Models/customer.entity';
import { Rider } from '../Models/rider.entity';
import { Shipment } from '../Models/shipment.entity';
import { shipping_detail } from '../Models/shipping_detail.entity';

import { super_admin } from '../Models/super_admin.entity';
import { edit_courier_company_dto } from '../ViewModel/edit_courier_company.dto';
import { PaginatedResponse, Response } from '../ViewModel/response';
import { DataSource, ILike, Or, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CodPayment } from 'src/Models/cod_payment.entity';
import { company_commission_rate } from 'src/Models/company_commission_rate.entity';
import { Rating } from 'src/Models/ratings.entity';
@Injectable()
export class AdminPortalService {
  constructor(
private dataSource: DataSource,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,

  @InjectRepository(courier_company)
  private companyRepository: Repository<courier_company>,

  @InjectRepository(super_admin)
  private superAdminRepository: Repository<super_admin>,

  
  @InjectRepository(Shipment)
  private shipmentRepository: Repository<Shipment>,

   
  @InjectRepository(CodPayment)
  private codPaymentRepository: Repository<CodPayment>,

  
  @InjectRepository(shipping_detail)
  private shipmentDetailsRepository: Repository<shipping_detail>,


@InjectRepository(company_commission_rate)
  private companyCommissionRateRepository: Repository<company_commission_rate>
) {}



async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    return bcrypt.hash(password, salt); // Hash the password
  }

  async createSuperAdmin(data: Partial<super_admin>): Promise<Response> {
 
  const resp = new Response();

  try {
   // Validate email for all requests
    if (!data.email) {
      throw new Error('Email is required');
    }
     if (!data.admin_id && !data.password) {
      throw new Error('Password is required for creating a new super admin');
    }

    let admin: super_admin | null = null;

     if (data.admin_id) {
      admin = await this.superAdminRepository.findOne({ where: { admin_id: data.admin_id } });
    } else if (data.email) {
      admin = await this.superAdminRepository.findOne({ where: { email: data.email } });
    }

    if (admin) {
       if (data.password) {
        data.password = await this.hashPassword(data.password);
      }
      admin = this.superAdminRepository.merge(admin, data);
      await this.superAdminRepository.save(admin);
      resp.message = 'Super admin updated successfully';
    } else {
       if (!data.password) {
        throw new Error('Password is required for creating a new super admin');
      }
      data.password = await this.hashPassword(data.password);
      admin = this.superAdminRepository.create(data);
      await this.superAdminRepository.save(admin);
      resp.message = 'Super admin inserted successfully';
    }

    resp.success = true;
    resp.result = admin;
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    return resp;
  } catch (error) {
    resp.success = false;
    resp.message = 'Failed to insert/update super admin: ' + error.message;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 Bad Request';
    return resp;
  }
}


async updatePassword(data: { admin_id: number; newPassword: string }): Promise<Response> {
  const resp = new Response();

  try {
    const { admin_id, newPassword } = data; // Correctly destructure the single object
    
    // Check if newPassword is a valid string before proceeding
    if (typeof newPassword !== 'string' || newPassword.length === 0) {
      resp.message = 'Invalid password provided';
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 BadRequest';
      return resp;
    }

    // 1. Find the admin by ID
    const admin = await this.superAdminRepository.findOne({ where: { admin_id } });
    if (!admin) {
      resp.message = 'Admin not found';
      resp.httpResponseCode = 404;
      resp.customResponseCode = '404 NotFound';
      return resp;
    }

    // 2. Hash the new password
    // Ensure that newPassword is not null or undefined here
    const hashedNewPassword = await this.hashPassword(newPassword);

    // 3. Update the password in the database
    admin.password = hashedNewPassword;
    admin.updatedOn = new Date();
    await this.superAdminRepository.save(admin);

    resp.success = true;
    resp.message = 'Password updated successfully';
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    resp.result = null;
    return resp;
  } catch (error: any) {
    resp.success = false;
    resp.message = `Failed to update password: ${error.message}`;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 BadRequest';
    return resp;
  }
}
 





async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate a unique file name
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    // Save the file to the server's disk
    fs.writeFileSync(filePath, file.buffer);

    // Return the URL or relative path to the file
    // Note: The client will need a separate endpoint to serve these static files
    return `/uploads/${fileName}`; 
  }

async getProfile(admin_id: number, token?: string): Promise<Response> {
    const resp = new Response();

    try {
      const admin = await this.superAdminRepository.findOne({ where: { admin_id } });
      if (!admin) {
        throw new NotFoundException('Super admin not found');
      }

      resp.success = true;
      resp.result = admin;
      resp.message = 'Profile fetched successfully';
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      return resp;
    } catch (error) {
      resp.success = false;
      resp.message = 'Failed to fetch profile: ' + error.message;
      resp.httpResponseCode = error instanceof NotFoundException ? 404 : 401;
      resp.customResponseCode = error instanceof NotFoundException ? '404 Not Found' : '401 Unauthorized';
      return resp;
    }
  }



  // async findByEmail(email: string): Promise<super_admin | null> {
  //   return this.superAdminRepository.findOne({ where: { email } });
  // }
  async findByEmail(email: string): Promise<super_admin | null> { 
  return this.superAdminRepository.findOne({
    where: { email },
    relations: ['company'],  
  });
}


  async validateSuperAdmin(email: string, password: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password: userPassword, ...result } = user;  
    return result;
  }
 
 
async getallCompaniesdetails(body: any): Promise<Response> {
  const { search, status, sortBy, sortOrder, page = 1, limit = 10 } = body;
  const resp=new Response();


  try {
    // Map frontend sortBy to database column names
    const sortByMap: { [key: string]: string } = {
      registeration_date: 'company.registeration_date',
      submission_date: 'company.registeration_date', // Handle frontend's submission_date
      company_name: 'company.company_name',
      status: 'company.registeration_status',
    };
    const mappedSortBy = sortByMap[sortBy] || 'company.registeration_date'; // Default to registeration_date

    const query = this.companyRepository
      .createQueryBuilder('company')
      .leftJoin('company.ratings', 'rating')
      .select([
        'company.company_id AS company_id',
        'company.company_name AS company_name',
        'company.company_phone_number AS contact_phone',
        'company.company_email_address AS email_address',
        'company.registeration_date AS submission_date',
        'company.registeration_status AS status',
      ])
      .addSelect('AVG(rating.stars)', 'average_rating')
      .groupBy('company.company_id');

    // Status filter (optional)
    if (status && status !== 'All') {
      query.andWhere('company.registeration_status = :status', { status });
    }

    // Search filter
    if (search) {
      query.andWhere(
        '(LOWER(company.company_name) LIKE LOWER(:search) OR LOWER(company.company_email_address) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Sorting
    if (sortBy) {
      query.orderBy(mappedSortBy, sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
    } else {
      query.orderBy('company.registeration_date', 'DESC'); // Default sort
    }

    // Pagination
    query.skip((page - 1) * limit).take(limit);

    // Get raw results (includes aliases like submission_date)
    const companies = await query.getRawMany();

    // Get total count for pagination
    const totalCountQuery = this.companyRepository.createQueryBuilder('company');
    if (status && status !== 'All') {
      totalCountQuery.andWhere('company.registeration_status = :status', { status });
    }
    if (search) {
      totalCountQuery.andWhere(
        '(LOWER(company.company_name) LIKE LOWER(:search) OR LOWER(company.company_email_address) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    const totalCount = await totalCountQuery.getCount();

    if (companies.length > 0) {
      resp.success = true;
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      resp.message = 'Companies fetched successfully';
      resp.result = companies;
      resp.count = totalCount;
    } else {
      resp.message = 'No records exist';
      resp.count = 0;
    }

    return resp;
  } catch (ex) {
    resp.success = false;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 BadRequest';
    resp.message = `Failed to Get Companies: ${ex.message}`;
    resp.result = null;
    return resp;
  }
}


// async getCompany(companyId: number): Promise<Response> {
//   const resp=new Response();

//   try {
//     const company = await this.companyRepository.findOne({
//       where: { company_id: companyId, status: true },
//       relations: ['ratings','vendorUser', 'company_document', 'shipping_details'],

//     });
//   if (company) {
//       // Fetch email_address from vendor_user
//       // const email_address = company.vendorUser ? company.vendorUser : null;
//       const email_address = company.vendorUser?.[0]?.email_address || null;

//    const documentDetails: Partial<company_document> = company.company_document?.[0] || {};
//       const result = {
//         company: {
//           company_id: company.company_id,
//           company_name: company.company_name,
//           status: company.status,
//           logo: company.logo,
//           company_phone_number: company.company_phone_number,
//           email_address: company.company_email_address || email_address,
//           city: company.city,
//           trade_license_number: documentDetails.trade_license_number,
//           trade_license_expiry_date: documentDetails.trade_license_expiry_date,
//           establishment_card: documentDetails.establishment_card,
//           trade_license_document_path: documentDetails.trade_license_document_path,
//           company_document_path: documentDetails.company_document_path,
//         },
//         ratings: company.ratings.map(rating => {
//           const avg = (
//             (parseFloat(rating.rider_behavior_score) +
//              parseFloat(rating.on_time_delivery_score) +
//              parseFloat(rating.affordability_score)) / 3
//           ).toFixed(1); // round to 1 decimal

//           return {
//             rating_id: rating.id,
//             rating_value: avg,
//             rider_behavior_score: rating.rider_behavior_score,
//             on_time_delivery_score: rating.on_time_delivery_score,
//             affordability_score: rating.affordability_score,
//             review: rating.review,
//             created_at: rating.created_at,
//           };
//         }),
//       };

//       resp.success = true;
//       resp.httpResponseCode = 200;
//       resp.customResponseCode = '200 OK';
//       resp.message = 'Get Company Details';
//       resp.result = result;
//       resp.count = 1; // Single company record
//       return resp;
//     }

//     resp.success = false;
//     resp.message = 'Company record does not exist';
//     return resp;

//   } catch (ex) {
//     resp.success = false;
//     resp.httpResponseCode = 400;
//     resp.customResponseCode = '400 BadRequest';
//     resp.message = `Failed to Get Company : ${ex.message}`;
//     resp.result = null;
//     return resp;
//   }
// }

async getCompany(companyId: number): Promise<Response> {
  const resp = new Response();

  try {
    const company = await this.companyRepository.findOne({
      where: { company_id: companyId, status: true },
      relations: [
         'vendorUser',
        'company_document',
        'company_conveyance_details',
        'company_conveyance_details.pricing',
        'commissionRates'     
       ],
    });

    if (company) {
      const email_address = company.vendorUser?.[0]?.email_address || null;
      const documentDetails: Partial<company_document> = company.company_document?.[0] || {};

      // ✅ Group conveyance details by type
      const conveyanceGrouped = company.company_conveyance_details.reduce((acc, detail) => {
        if (!acc[detail.conveyance_types]) {
          acc[detail.conveyance_types] = [];
        }

        // Pricing list
        const pricingList = detail.pricing?.map(p => ({
          pricing_id: p.pricing_id,
          size: p.size,
          weight: p.weight,
          width: p.width,
          length: p.length,
          height: p.height,
          baseFare: p.baseFare,
          pricePerKm: p.pricePerKm,
        })) || [];

        acc[detail.conveyance_types].push({
          conveyance_id: detail.id,

          is_active: detail.is_active,
          pricing: pricingList,
        });

        return acc;
      }, {} as Record<string, any[]>);

// const getRatingLabel = (score: number): string => {
//   if (score >= 80) return 'Great';
//   if (score >= 50) return 'Good';
//   return 'Poor';
// };
      const result = {
        company: {
          company_id: company.company_id,
          company_name: company.company_name,
          status: company.status,
          logo: company.logo,
          company_phone_number: company.company_phone_number,
          email_address: company.company_email_address || email_address,
          city: company.city,
          trade_license_number: documentDetails.trade_license_number,
          trade_license_expiry_date: documentDetails.trade_license_expiry_date,
          establishment_card: documentDetails.establishment_card_front+"-"+ documentDetails.establishment_card_back,
          trade_license_document_path: documentDetails.trade_license_document_path,
          company_document_path: documentDetails.company_document_path,
          company_status: company.registeration_status,
          
        },
// ratings: company.ratings.map(rating => {
//     const avg = (
//       (rating.rider_behavior_score +
//         rating.on_time_delivery_score +
//         rating.affordability_score) / 3 / 20 // Convert 0-100 to 0-5 scale
//     ).toFixed(1);

//     return {
//       rating_id: rating.id,
//       rating_value: avg,
//       rider_behavior_score: `${rating.rider_behavior_score}% (${getRatingLabel(rating.rider_behavior_score)})`,
//       on_time_delivery_score: `${rating.on_time_delivery_score}% (${getRatingLabel(rating.on_time_delivery_score)})`,
//       affordability_score: `${rating.affordability_score}% (${getRatingLabel(rating.affordability_score)})`,
//       review: rating.review,
//       created_at: rating.created_at,
//       customer_name: rating.customer?.firstname || null, // Assuming Customer entity has a 'name' field
//     };
//   }),
        company_commission_rate: company.commissionRates.map(company_commission_rate=> {
          return {
            id: company_commission_rate.id,
            commission_type: company_commission_rate.commission_type,
            commission_rate: company_commission_rate.commission_rate,
            createdOn: company_commission_rate.createdOn,
            updatedOn: company_commission_rate.updatedOn,
          };

        }) ,


        conveyanceDetails: conveyanceGrouped,
      };

      resp.success = true;
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      resp.message = 'Get Company Details';
      resp.result = result;
      resp.count = 1;
      return resp;
    }

    resp.success = false;
    resp.message = 'Company record does not exist';
    return resp;
  } catch (ex) {
    resp.success = false;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 BadRequest';
    resp.message = `Failed to Get Company : ${ex.message}`;
    resp.result = null;
    return resp;
  }
}



  async editCompany(data: edit_courier_company_dto): Promise<Response> {
    const resp=new Response();
    try {
      const company = await this.companyRepository.findOne({ where: { company_id: data.company_id, status: true } });
      if (company) {
        Object.assign(company, {
          ...data,
          registration_date: new Date(),
        });
        await this.companyRepository.save(company);
        resp.success = true;
        resp.httpResponseCode = 200;
        resp.customResponseCode = '200 OK';
        resp.message = 'Edit Successfully';
        resp.result = `companyId : ${company.company_id}`;
        return resp;
      }
      resp.success = false;
      resp.message = 'record does not exist';
      return resp;
    } catch (ex) {
      resp.success = false;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 BadRequest';
      resp.message = `Failed to edit : ${ex.message}`;
      resp.result = null;
      return resp;
    }
  }

  async deleteCompany(companyId: number): Promise<Response> {
    const resp= new Response();
    try {
      const company = await this.companyRepository.findOne({ where: { company_id: companyId, status: true } });
      if (company) {
        company.status = false;
        await this.companyRepository.save(company);
        resp.success = true;
        resp.httpResponseCode = 200;
        resp.customResponseCode = '200 OK';
        resp.message = 'Data Deleted Successfully';
        resp.result = `companyId : ${company.company_id}`;
        return resp;
      }
      resp.success = false;
      resp.message = 'record does not exist';
      return resp;
    } catch (ex) {
      resp.success = false;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 BadRequest';
      resp.message = `Failed to delete : ${ex.message}`;
      resp.result = null;
      return resp;
    }
  }
 

async updateCompanyStatus(
  company_id: number,
  status: 'pending' | 'active' | 'declined',
  rejection_reason?: string,
  acceptance_reason?: string
): Promise<Response> {
  const resp = new Response();
  try {
    const company = await this.companyRepository.findOne({ where: { company_id } });

    if (!company) {
      resp.httpResponseCode = 404;
      resp.customResponseCode = '404 NotFound';
      resp.message = 'Company not found';
      return resp;
    }

    // If declining, rejection_reason must be provided
    if (status === 'declined' && !rejection_reason) {
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 BadRequest';
      resp.message = 'Rejection reason is required when declining a company';
      return resp;
    }

    // Prepare update data
    const updateData: any = { registeration_status: status };

    if (status === 'declined') {
      updateData.rejection_reason = rejection_reason;
      updateData.acceptance_reason = null; // clear acceptance reason
    } else if (status === 'active') {
      updateData.acceptance_reason = acceptance_reason;
      updateData.rejection_reason = null; // clear old rejection reason
    } else if (status === 'pending') {
      // optional: clear both if pending
      updateData.acceptance_reason = null;
      updateData.rejection_reason = null;
    }

    await this.companyRepository.update({ company_id }, updateData);

    resp.success = true;
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    resp.message =
      status === 'active'
        ? 'Congratulations, a new company has joined Pick n Ship platform!'
        : status === 'declined'
          ? `Company application has been declined. Reason: ${rejection_reason}`
          : 'Company status updated to pending';
    resp.result = { company_id, status };
    return resp;
  } catch (ex) {
    resp.httpResponseCode = 500;
    resp.customResponseCode = '500 InternalServerError';
    resp.message = `Failed to update status: ${ex.message}`;
    return resp;
  }


}
 async getCommission({
    company_id,
    page = 1,
    limit = 10,
  }: {
    company_id: number;
    page?: number;
    limit?: number;
  }): Promise<Response> {
    const resp = new Response();

    try {
      // Validate company existence
      const company = await this.companyRepository.findOne({ where: { company_id } });
      if (!company) {
        resp.message = 'Company not found';
        resp.httpResponseCode = 404;
        resp.customResponseCode = '404 NotFound';
        return resp;
      }

      // Calculate pagination parameters
      const skip = (page - 1) * limit;
      const take = limit;

      // Fetch paginated commission rates
      const [commissions, total] = await this.companyCommissionRateRepository.findAndCount({
        where: { company: { company_id }, status: true },
        skip,
        take,
      });

      // Prepare default rates if no commissions exist
      const defaultRates = [
        { company_id, commission_type: 'standard', commission_rate: '10%' },
        { company_id, commission_type: 'sme', commission_rate: '5%' },
      ];

      // If no commissions exist, return default rates (considering pagination)
      // if (!commissions || commissions.length === 0) {
      //   const paginatedDefaults = defaultRates.slice(skip, skip + take);
      //   resp.success = true;
      //   resp.message = 'No commission rates set, returning defaults';
      //   resp.httpResponseCode = 200;
      //   resp.customResponseCode = '200 OK';
      //   resp.result = {
      //     data: paginatedDefaults,
      //     pagination: {
      //       total: defaultRates.length,
      //       page,
      //       limit,
      //       totalPages: Math.ceil(defaultRates.length / limit),
      //     },
      //   };
      //   return resp;
      // }

      // Map commissions to the expected response format
      const result = commissions.map((commission) => ({
        company_id,
        commission_type: commission.commission_type,
        commission_rate: commission.commission_rate,
      }));

      // Ensure standard and sme are included, using defaults if missing
 const mergedRates = defaultRates.map((defaultRate) => {
  const existing = result.find((r) => r.commission_type === defaultRate.commission_type);
  return existing || defaultRate;
});
const paginatedResult = mergedRates.slice(skip, skip + take);

resp.success = true;
resp.message = 'Commission rates retrieved successfully';
resp.httpResponseCode = 200;
resp.customResponseCode = '200 OK';
resp.result = {
  data: paginatedResult,
  pagination: {
    total: mergedRates.length, // Total is now the length of the merged rates
    page,
    limit,
    totalPages: Math.ceil(mergedRates.length / limit),
  },
};
return resp;
    } catch (ex) {
      resp.message = `Failed to fetch commission rates: ${ex.message}`;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 BadRequest';
      return resp;
    }
  }

// src/admin-portal/admin-portal.service.ts

async setCommission(rates: { company_id: number; commission_type: string; commission_rate: string }[]): Promise<Response> {
  const resp = new Response();

  try {
    for (const rateData of rates) {
      const { company_id, commission_type, commission_rate } = rateData;
      
      // Corrected: Filter using the 'company' relation and its nested 'company_id'
      const existingCommission = await this.companyCommissionRateRepository.findOne({
        where: {
          company: { company_id: company_id }, // This is the correct syntax for relations
          commission_type: commission_type,
        },
      });

      if (!existingCommission) {
        const company = await this.companyRepository.findOne({ where: { company_id } });
        if (!company) {
          resp.message = 'Company not found';
          resp.httpResponseCode = 404;
          resp.customResponseCode = '404 NotFound';
          return resp;
        }

        const newCommissionRate = this.companyCommissionRateRepository.create({
          ...rateData,
          company,
          createdOn: new Date(),
          updatedOn: new Date(),
          createdBy: 'admin',
          updatedBy: 'admin',
          status: true,
        });
        await this.companyCommissionRateRepository.save(newCommissionRate);
      } else {
        // Corrected: Update using the 'company' relation and 'commission_type'
        await this.companyCommissionRateRepository.update(
          { company: { company_id: company_id }, commission_type: commission_type },
          { commission_rate, updatedOn: new Date(), updatedBy: 'admin', status: true }
        );
      }
    }
    
    resp.success = true;
    resp.message = 'Commission rates updated successfully';
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    resp.result = rates;
    return resp;

  } catch (ex: any) {
    resp.message = `Failed to set commission: ${ex.message}`;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 BadRequest';
    return resp;
  }
}

async searchCompanies(company_name?: string, city?: string): Promise<Response> {
    const resp= new Response();


  try {
    const whereConditions: any[] = [];

    if (company_name) {
      whereConditions.push({ company_name: ILike(`%${company_name}%`) });
    }

    if (city) {
      whereConditions.push({ city: ILike(`%${city}%`) });
    }

    const companies = await this.companyRepository.find({
      where: whereConditions.length > 0 ? whereConditions : undefined,
      relations: ['ratings'], // if relation exists
    });

    if (companies.length > 0) {
      resp.success = true;
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      resp.message = 'Search Results';
      resp.result = companies;
      resp.count = companies.length;
    } else {
      resp.success = false;
      resp.httpResponseCode = 404;
      resp.customResponseCode = '404 NotFound';
      resp.message = 'No records found';
    }

    return resp;
  } catch (ex) {
    resp.success = false;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 BadRequest';
    resp.message = `Failed to search companies : ${ex.message}`;
    resp.result = null;
    return resp;
  }
}
async getRatings(companyId: number, page: number = 1, limit: number = 10): Promise<Response> {
  const resp = new Response();
  const skip = (page - 1) * limit;

  try {
    // 1) Individual ratings with pagination
 const [ratings, total] = await this.ratingRepository
  .createQueryBuilder('rating')
  .leftJoinAndSelect('rating.customer', 'customer')
  .leftJoinAndSelect('rating.rider', 'rider')
  .leftJoin('rating.shipment', 'shipment')
  .where('rating.company_id = :companyId AND rating.status = :status', { companyId, status: true })
  .skip(skip)
  .take(limit)
  .getManyAndCount();


    // 2) Overall aggregation for company
    const overall = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.stars)', 'avg_stars')
      .addSelect('AVG(rating.rider_behavior_score)', 'avg_rider_behavior')
      .addSelect('AVG(rating.on_time_delivery_score)', 'avg_on_time_delivery')
      .addSelect('AVG(rating.affordability_score)', 'avg_affordability')
      .addSelect('COUNT(rating.id)', 'total_reviews')
      .where('rating.company_id = :companyId AND rating.status = :status', { companyId, status: true })
      .getRawOne();

    if (ratings.length > 0) {
      const getRatingLabel = (score: number): string => {
        if (score >= 80) return 'Great';
        if (score >= 50) return 'Good';
        return 'Poor';
      };

     const result = {
      overall: {
      avgStars: overall.avg_stars ? parseFloat(overall.avg_stars).toFixed(1) : "0.0",
          // Raw scores
         avgRiderBehaviorScore: overall.avg_rider_behavior ? parseFloat(overall.avg_rider_behavior).toFixed(0) : "0",
          avgOnTimeDeliveryScore: overall.avg_on_time_delivery ? parseFloat(overall.avg_on_time_delivery).toFixed(0) : "0",
          avgAffordabilityScore: overall.avg_affordability ? parseFloat(overall.avg_affordability).toFixed(0) : "0",
          // Calculated labels
          avgRiderBehaviorLabel: overall.avg_rider_behavior ? getRatingLabel(parseFloat(overall.avg_rider_behavior)) : "Poor",
          avgOnTimeDeliveryLabel: overall.avg_on_time_delivery ? getRatingLabel(parseFloat(overall.avg_on_time_delivery)) : "Poor",
         avgAffordabilityLabel: overall.avg_affordability ? getRatingLabel(parseFloat(overall.avg_affordability)) : "Poor",
          totalReviews: parseInt(overall.total_reviews, 10) || 0
   },
         ratings: ratings.map(rating => ({
          rating_id: rating.id,
           rating_value: rating.stars,
         // Raw scores
         rider_behavior_score: rating.rider_behavior_score,
        on_time_delivery_score: rating.on_time_delivery_score,
         affordability_score: rating.affordability_score,
  // Calculated labels
  rider_behavior_label: getRatingLabel(rating.rider_behavior_score),
  on_time_delivery_label: getRatingLabel(rating.on_time_delivery_score),
   affordability_label: getRatingLabel(rating.affordability_score),
   review: rating.review || 'No review provided',
  created_at: rating.created_at,
  customer_name: `${rating.customer?.firstname || ''} ${rating.customer?.lastname || ''}`.trim() || null,
  rider_name: rating.rider?.rider_name || null,
  })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };

      resp.success = true;
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      resp.message = 'Ratings retrieved successfully';
      resp.result = result;
      resp.count = total;
      return resp;
    }

    // Agar koi rating nahi mili
    resp.success = false;
    resp.httpResponseCode = 404;
    resp.customResponseCode = '404 Not Found';
    resp.message = 'No ratings found for this company';
    resp.result = null;
    return resp;

  } catch (ex) {
    resp.success = false;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 BadRequest';
    resp.message = `Failed to retrieve ratings: ${ex.message}`;
    resp.result = null;
    return resp;
  }
}

// async getAllJobs({ page, limit, status, search }) {
//   const query = this.shipmentRepository
//     .createQueryBuilder('s')
//     .leftJoinAndSelect('s.courierCompany', 'company')
//     .leftJoinAndSelect('s.rider', 'rider') // <-- Join rider to access rider_name
//     .skip((page - 1) * limit)
//     .take(limit);

//   if (status) {
//     query.andWhere('s.job_status = :status', { status });
//   }

//   if (search) {
//     query.andWhere(
//       `(s.sender_name ILIKE :search 
//         OR s.receiver_name ILIKE :search 
//         OR company.company_name ILIKE :search 
//         OR rider.rider_name ILIKE :search)`, // <-- Rider name added to search
//       { search: `%${search}%` },
//     );
//   }

//   const [data, total] = await query.getManyAndCount();

//   return {
//     data,
//     total,
//     currentPage: page,
//     totalPages: Math.ceil(total / limit),
//   };
// }

async getAllJobs({ page, limit, status, search }) {
  try {
    const query = this.shipmentRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.courierCompany', 'company')
      .leftJoinAndSelect('s.rider', 'rider')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      query.andWhere('s.job_status = :status', { status });
    }

    if (search) {
      query.andWhere(
        `(s.sender_name ILIKE :search 
          OR s.receiver_name ILIKE :search 
          OR company.company_name ILIKE :search 
          OR rider.rider_name ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    // ORDER BY latest created shipments first (optional)
    query.orderBy('s.createdOn', 'DESC');

    const [data, total] = await query.getManyAndCount();

    return {
      success: true,
      message: 'Jobs fetched successfully',
      data: {
        jobs: data,
        pagination: {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          limit,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message,
    };
  }
}




// async getShipmentOverview(id: number) {
//   return this.shipmentRepository.findOne({
//     where: { id },
//     relations: ['courierCompany', 'rider', 'cod_payment'],
//     select: {
//       id: true,
//       status: true,
//       parcel_type: true,
//       payment_mode: true,
//       pickup_time: true,
//       delivery_time: true,
//       receiver_name: true,
//       sender_name: true,
//       tracking_number: true,
//       createdOn: true,
//       sender_phone: true,
//       receiver_phone: true,
//       courierCompany: { company_name: true },
//       rider: { rider_name: true, vehicle_type: true },
//       cod_payment: { amount_received: true, pending_amount: true, cod_amount: true },
//     },
//   });
// }    




async getShipmentOverview(@Body('id') id: number): Promise<Response> {
  const resp=new Response()
 
  try {
    const overview = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['courierCompany', 'rider', 'cod_payment'],
      select: {
        id: true,
        status: true,
        parcel_type: true,
        payment_mode: true,
        pickup_time: true,
        delivery_time: true,
        receiver_name: true,
        sender_name: true,
        tracking_number: true,
        createdOn: true,
        sender_phone: true,
        receiver_phone: true,
        courierCompany: { company_name: true },
        rider: { rider_name: true, vehicle_type: true },
  cod_payment: { id: true, cod_amount: true, payment_status: true, is_paid_to_company: true, is_remitted_to_pns: true }
      },
    });

    if (overview) {
      resp.success = true;
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      resp.message = 'Shipment overview fetched successfully';
      resp.result = overview;
    } else {
      resp.success = false;
      resp.httpResponseCode = 404;
      resp.customResponseCode = '404 NotFound';
      resp.message = 'Shipment not found';
    }
  } catch (ex) {
    resp.success = false;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 BadRequest';
    resp.message = `Failed to fetch shipment overview: ${ex.message}`;
    resp.result = null;
  }

  return resp;
}

async getCodShipments(page: number, limit: number, courier_company?: string, status?: string) {
  const query = this.codPaymentRepository
    .createQueryBuilder('cod_payment')
    .leftJoinAndSelect('cod_payment.shipment', 'shipment')
    .leftJoinAndSelect('cod_payment.courierCompany', 'courierCompany')
    .leftJoinAndSelect('cod_payment.rider', 'rider');

  query.andWhere('shipment.payment_mode = :mode', { mode: 'COD' });


  // Company filter (optional)
  if (courier_company) {
    query.andWhere('courierCompany.company_name = :courier_company', { courier_company });
  }

  // Status filter (optional) → agar body me bheja ho
  if (status) {
    query.andWhere('cod_payment.payment_status = :status', { status });
  }

  const [data, total] = await query
    .orderBy('cod_payment.createdOn', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    total,
    page,
    limit,
  };
}


  // Get total COD amounts (receivable, pending, retrieved)
  async getCodSummary(): Promise<{ receivable: number; pending: number; retrieved: number }> {
    const receivable = await this.codPaymentRepository
      .createQueryBuilder()
      .select('SUM(cod_amount)', 'total')
      .getRawOne();

    const pending = await this.codPaymentRepository
      .createQueryBuilder()
      .where('payment_status = :status', { status: 'Pending' })
      .select('SUM(cod_amount)', 'total')
      .getRawOne();

    const retrieved = await this.codPaymentRepository
      .createQueryBuilder()
      .where('payment_status = :status', { status: 'Paid' })
      .select('SUM(cod_amount)', 'total')
      .getRawOne();

    return {
      receivable: Number(receivable?.total || 0),
      pending: Number(pending?.total || 0),
      retrieved: Number(retrieved?.total || 0),
    };
  }

async markCodAsPaid(codPaymentId: number) {
  const codPayment = await this.codPaymentRepository.findOne({
    where: { id: codPaymentId },
  });

  if (!codPayment) {
    throw new NotFoundException(`COD Payment with id ${codPaymentId} not found`);
  }

  // ✅ Update status to "paid"
  codPayment.payment_status = 'paid';
  codPayment.updatedOn = new Date();

  await this.codPaymentRepository.save(codPayment);

  return {
    success: true,
    message: `COD Payment ID ${codPaymentId} marked as Paid successfully.`,
    data: codPayment,
  };
}


  



  }