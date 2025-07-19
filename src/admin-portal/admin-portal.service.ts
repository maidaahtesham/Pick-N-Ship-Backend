import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { courier_company } from 'src/Models/courier_company.entity';
import { Customer } from 'src/Models/customer.entity';
import { Shipment } from 'src/Models/shipment.entity';
import { super_admin } from 'src/Models/super_admin.entity';
import { courier_company_dto } from 'src/ViewModel/courier_company_dto';
import { edit_courier_company_dto } from 'src/ViewModel/edit_courier_company.dto';
import { Response } from 'src/ViewModel/response';
import { DataSource, ILike, Repository } from 'typeorm';

@Injectable()
export class AdminPortalService {
  constructor(
private dataSource: DataSource,
  @InjectRepository(courier_company)
  private companyRepository: Repository<courier_company>,

  @InjectRepository(super_admin)
  private superAdminRepository: Repository<super_admin>,

  
  @InjectRepository(Shipment)
  private shipmentRepository: Repository<Shipment>

) {}

  async createSuperAdmin(data: Partial<super_admin>): Promise<Response> {
  const resp: Response = {
    success: false,
    message: '',
    result: null,
    httpResponseCode: null,
    customResponseCode: '',
    count: 0
  };

  try {
    let admin: super_admin | null = null;

    // You can also use another unique field like username or contact_phone
    if (data.admin_id) {
      admin = await this.superAdminRepository.findOne({ where: { admin_id: data.admin_id } });
    } else if (data.email) {
      admin = await this.superAdminRepository.findOne({ where: { email: data.email } });
    }

    if (admin) {
      // Update existing record
      admin = this.superAdminRepository.merge(admin, data);
      await this.superAdminRepository.save(admin);
      resp.message = 'Super admin updated successfully';
    } else {
      // Insert new record
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

async getallCompaniesdetails(): Promise<Response> {
    const resp: Response = { success: false, message: '', result: null, httpResponseCode: null, customResponseCode: '', count: 0 };
    try {
    const companies = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.ratings', 'ratings')
      .where('company.status = :status', { status: true })
      .select([
        'company.company_id AS company_id',
        'company.company_name AS company_name',
        'company.contact_phone AS contact_phone',
        'company.email_address AS email_address',
        'company.registration_date AS registration_date',
        'company.registration_status AS status',
        'company.registration_date AS submission_date',
        `AVG(
      (
        CAST(ratings.rider_behavior_score AS FLOAT) +
        CAST(ratings.on_time_delivery_score AS FLOAT) +
        CAST(ratings.affordability_score AS FLOAT)
      ) / 3
    ) AS average_rating`
      ])
        .groupBy('company.company_id')
      .getRawMany();
    
      if (companies.length > 0) {
        resp.success = true;
        resp.httpResponseCode = 200;
        resp.customResponseCode = '200 OK';
        resp.message = 'Get Companies';
        resp.result = companies;
        resp.count = companies.length;
        return resp;
      }
      resp.success = false;
      resp.message = 'No records exist';
      return resp;
    } catch (ex) {
      resp.success = false;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 BadRequest';
      resp.message = `Failed to Get Companies : ${ex.message}`;
      resp.result = null;
      return resp;
    }
  }



  async getCompany(companyId: number): Promise<Response> {
    const resp: Response = { success: false, message: '', result: null, httpResponseCode: null, customResponseCode: '', count: 0 };
    try {
      const company = await this.companyRepository.findOne({
        where: { company_id: companyId, status: true },
        relations: ['ratings'], // Assuming relationships are defined
      });

      if (company) {     
 
        // Aggregate data
        const result = {
          company: {
            company_id: company.company_id,
            company_name: company.company_name,
            status: company.status,
            logo: company.logo,
            company_phone_number: company.company_phone_number,
            email_address: company.email_address,
            city: company.city,
            trade_license_number: company.trade_license_number,
            trade_license_expiry_date: company.trade_license_expiry_date,
            registration_date: company.registration_date,
            establishment_details: company.establishment_details,
            establishment_card: company.establishment_card,
            trade_license_document_path: company.trade_license_document_path,
            company_document_path: company.company_document_path,
          },
          ratings: company.ratings.map(rating => ({
            rating_id: rating.id,
            // rating_value: rating.rating_value,
 ratings: company.ratings.map(rating => {
  const avg = (
    (parseFloat(rating.rider_behavior_score) +
     parseFloat(rating.on_time_delivery_score) +
     parseFloat(rating.affordability_score)) / 3
  ).toFixed(1); // round to 1 decimal

  return {
    rating_id: rating.id,
    rating_value: avg,
    rider_behavior_score: rating.rider_behavior_score,
    on_time_delivery_score: rating.on_time_delivery_score,
    affordability_score: rating.affordability_score,
    review: rating.review,
    created_at: rating.created_at,
  };
}),

            rider_behavior_score: rating.rider_behavior_score,
            on_time_delivery_score: rating.on_time_delivery_score,
           
          })),
    
          };

        resp.success = true;
        resp.httpResponseCode = 200;
        resp.customResponseCode = '200 OK';
        resp.message = 'Get Company Details';
        resp.result = result;
        resp.count = 1; // Single company record
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
    const resp: Response = { success: false, message: '', result: null, httpResponseCode: null, customResponseCode: '', count: 0 };
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
    const resp: Response = { success: false, message: '', result: null, httpResponseCode: null, customResponseCode: '', count: 0 };
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
// async updateCompanyStatus({ company_id, status }: { company_id: number; status: string }) {
//     return this.companyRepository.update({ company_id }, { registration_status: status });
//   }

async updateCompanyStatus(
  company_id: number,
  status: 'accepted' | 'declined',
  rejection_reason?: string,
): Promise<Response> {
  const resp: Response = {
    success: false,
    message: '',
    result: null,
    httpResponseCode: null,
    customResponseCode: '',
    count: 0,
  };

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
    const updateData: any = { registration_status: status };
    if (status === 'declined') {
      updateData.rejection_reason = rejection_reason;
    }

    await this.companyRepository.update({ company_id }, updateData);

    resp.success = true;
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    resp.message =
      status === 'accepted'
        ? 'Congratulations, a new company has joined Pick n Ship platform!'
        : `Company application has been declined. Reason: ${rejection_reason}`;
    resp.result = { company_id, status };
    return resp;
  } catch (ex) {
    resp.httpResponseCode = 500;
    resp.customResponseCode = '500 InternalServerError';
    resp.message = `Failed to update status: ${ex.message}`;
    return resp;
  }
}


async setCommission({ company_id, commission_type, commission_rate }: any): Promise<Response> {
    const resp: Response = { success: false, message: '', result: null, httpResponseCode: null, customResponseCode: '', count: 0 };
    try {
        const company = await this.companyRepository.findOne({ where: { company_id } });
        if (!company) {
            resp.message = 'Company not found';
            resp.httpResponseCode = 404;
            resp.customResponseCode = '404 NotFound';
            return resp;
        }

        let commission_rate = "0";
       if (commission_type === 'standard') commission_rate = '10%';
else if (commission_type === 'sme') commission_rate = '5%';
else if (commission_type === 'custom' && commission_rate) commission_rate = commission_rate;

        await this.companyRepository.update({ company_id }, { commission_rate });
        resp.success = true;
        resp.message = 'Commission set successfully';
        resp.httpResponseCode = 200;
        resp.customResponseCode = '200 OK';
        resp.result = { company_id, commission_rate };
        return resp;
    } catch (ex) {
        resp.message = `Failed to set commission : ${ex.message}`;
        resp.httpResponseCode = 400;
        resp.customResponseCode = '400 BadRequest';
        return resp;
    }
}


async searchCompanies(query: string): Promise<Response> {
    const resp: Response = { success: false, message: '', result: null, httpResponseCode: null, customResponseCode: '', count: 0 };
    try {
      const companies = await this.companyRepository.find({
        where: [
          { company_name: ILike(`%${query}%`) },
          { city: ILike(`%${query}%`) },
        ],
        relations: ['ratings'], // Assuming relationships are defined
      });

      if (companies.length > 0) {
        resp.success = true;
        resp.httpResponseCode = 200;
        resp.customResponseCode = '200 OK';
        resp.message = 'Search Results';
        resp.result = companies;
        resp.count = companies.length;
        return resp;
      }
      resp.success = false;
      resp.message = 'No records found';
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

  async getAllJobs({ page, limit, status, search }) {
    const query = this.shipmentRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.courierCompany', 'company')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) query.andWhere('s.job_status = :status', { status });
    if (search) {
      query.andWhere(
        '(s.sender_name ILIKE :search OR s.receiver_name ILIKE :search OR company.company_name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}




