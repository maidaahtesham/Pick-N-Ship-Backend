import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs'; // ✅

import { CodPayment } from 'src/Models/cod_payment.entity';
import { company_document } from 'src/Models/company_document.entity';
import { courier_company } from 'src/Models/courier_company.entity';
import { Customer } from 'src/Models/customer.entity';
import { Rider } from 'src/Models/rider.entity';
import { Shipment } from 'src/Models/shipment.entity';
import { shipping_detail } from 'src/Models/shipping_detail.entity';

import { super_admin } from 'src/Models/super_admin.entity';
import { edit_courier_company_dto } from 'src/ViewModel/edit_courier_company.dto';
import { Response } from 'src/ViewModel/response';
import { DataSource, ILike, Or, Repository } from 'typeorm';

@Injectable()
export class AdminPortalService {
  constructor(
private dataSource: DataSource,
  @InjectRepository(courier_company)
  private companyRepository: Repository<courier_company>,

  @InjectRepository(super_admin)
  private superAdminRepository: Repository<super_admin>,

  
  @InjectRepository(Shipment)
  private shipmentRepository: Repository<Shipment>,

   
  @InjectRepository(CodPayment)
  private codPaymentRepository: Repository<CodPayment>,

  
  @InjectRepository(shipping_detail)
  private shipmentDetailsRepository: Repository<shipping_detail>

) {}
async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    return bcrypt.hash(password, salt); // Hash the password
  }
/*CREATE SUPER ADMIN */
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
    if (!data.email || !data.password) {
        throw new Error('Email and password are required');
      }

    let admin: super_admin | null = null;

    if (data.admin_id) {
      admin = await this.superAdminRepository.findOne({ where: { admin_id: data.admin_id } });
    } else if (data.email) {
      admin = await this.superAdminRepository.findOne({ where: { email: data.email } });
    }

    if (admin) {
      // Update existing record
        if (data.password) {
          // Hash the password if provided
          data.password = await this.hashPassword(data.password);
        }

      // Update existing record
      admin = this.superAdminRepository.merge(admin, data);
      await this.superAdminRepository.save(admin);
      resp.message = 'Super admin updated successfully';
    } else {
      // Insert new record
         // Hash the password for new admin
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
  async findByEmail(email: string): Promise<super_admin | null> {
    return this.superAdminRepository.findOne({ where: { email } });
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



//   async getCompany(companyId: number): Promise<Response> {
//     const resp: Response = { success: false, message: '', result: null, httpResponseCode: null, customResponseCode: '', count: 0 };
//     try {
//       const company = await this.companyRepository.findOne({
//         where: { company_id: companyId, status: true },
//         relations: ['ratings'],
//       });

//       if (company) {     
 
//         // Aggregate data
//         const result = {
//           company: {
//             company_id: company.company_id,
//             company_name: company.company_name,
//             status: company.status,
//             logo: company.logo,
//             company_phone_number: company.company_phone_number,
//             email_address: company.email_address,
//             city: company.city,
//             trade_license_number: company.trade_license_number,
//             trade_license_expiry_date: company.trade_license_expiry_date,
//             registration_date: company.registration_date,
//             establishment_details: company.establishment_details,
//             establishment_card: company.establishment_card,
//             trade_license_document_path: company.trade_license_document_path,
//             company_document_path: company.company_document_path,
//           },
//           ratings: company.ratings.map(rating => ({
//             rating_id: rating.id,
//             // rating_value: rating.rating_value,
//  ratings: company.ratings.map(rating => {
//   const avg = (
//     (parseFloat(rating.rider_behavior_score) +
//      parseFloat(rating.on_time_delivery_score) +
//      parseFloat(rating.affordability_score)) / 3
//   ).toFixed(1); // round to 1 decimal

//   return {
//     rating_id: rating.id,
//     rating_value: avg,
//     rider_behavior_score: rating.rider_behavior_score,
//     on_time_delivery_score: rating.on_time_delivery_score,
//     affordability_score: rating.affordability_score,
//     review: rating.review,
//     created_at: rating.created_at,
//   };
// }),

//             rider_behavior_score: rating.rider_behavior_score,
//             on_time_delivery_score: rating.on_time_delivery_score,
           
//           })),
    
//           };

//         resp.success = true;
//         resp.httpResponseCode = 200;
//         resp.customResponseCode = '200 OK';
//         resp.message = 'Get Company Details';
//         resp.result = result;
//         resp.count = 1; // Single company record
//         return resp;
//       }
//       resp.success = false;
//       resp.message = 'Company record does not exist';
//       return resp;
//     } catch (ex) {
//       resp.success = false;
//       resp.httpResponseCode = 400;
//       resp.customResponseCode = '400 BadRequest';
//       resp.message = `Failed to Get Company : ${ex.message}`;
//       resp.result = null;
//       return resp;
//     }
//   }

async getCompany(companyId: number): Promise<Response> {
  const resp: Response = {
    success: false,
    message: '',
    result: null,
    httpResponseCode: null,
    customResponseCode: '',
    count: 0
  };

  try {
    const company = await this.companyRepository.findOne({
      where: { company_id: companyId, status: true },
      relations: ['ratings','vendor_user', 'company_document', 'shipment_detail'],
    });
  if (company) {
      // Fetch email_address from vendor_user
      const email_address = company.vendorUser ? company.vendorUser : null;

   const documentDetails: Partial<company_document> = company.company_document?.[0] || {};
      const result = {
        company: {
          company_id: company.company_id,
          company_name: company.company_name,
          status: company.status,
          logo: company.logo,
          company_phone_number: company.company_phone_number,
          email_address: email_address,
          city: company.city,
          trade_license_number: documentDetails.trade_license_number,
          trade_license_expiry_date: documentDetails.trade_license_expiry_date,
          establishment_card: documentDetails.establishment_card,
          trade_license_document_path: documentDetails.trade_license_document_path,
          company_document_path: documentDetails.company_document_path,
        },
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
    // Check if shipping details exist for the company
    const existingShippingDetail = await this.shipmentDetailsRepository.findOne({ where: { company: { company_id } } });

    let updatedCommissionRate = "0";
    // Determine the commission rate based on commission_type
    if (commission_type === 'standard') updatedCommissionRate = '10%';
    else if (commission_type === 'sme') updatedCommissionRate = '5%';
    else if (commission_type === 'custom' && commission_rate) updatedCommissionRate = commission_rate;

    if (!existingShippingDetail) {
      // Create new shipping detail if it doesn't exist
      const company = await this.companyRepository.findOne({ where: { company_id } });
      if (!company) {
        resp.message = 'Company not found';
        resp.httpResponseCode = 404;
        resp.customResponseCode = '404 NotFound';
        return resp;
      }

      const newShippingDetail = this.shipmentDetailsRepository.create({
        company,
        conveyance_types: 'bike', // Default value, adjust as needed
        conveyance_details: '',   // Default value, adjust as needed
        commission_rate: updatedCommissionRate,
      });
      await this.shipmentDetailsRepository.save(newShippingDetail);
      resp.success = true;
      resp.message = 'Commission set and shipping detail created successfully';
      resp.httpResponseCode = 201;
      resp.customResponseCode = '201 Created';
      resp.result = { company_id, commission_rate: updatedCommissionRate };
    } else {
      // Update existing shipping detail
      await this.shipmentDetailsRepository.update({ shipping_id: existingShippingDetail.shipping_id }, { commission_rate: updatedCommissionRate });
      resp.success = true;
      resp.message = 'Commission updated successfully';
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      resp.result = { company_id, commission_rate: updatedCommissionRate };
    }

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
    .leftJoinAndSelect('s.rider', 'rider') // <-- Join rider to access rider_name
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
        OR rider.rider_name ILIKE :search)`, // <-- Rider name added to search
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


//  async getShipmentOverview(id: number) {
//     return this.shipmentRepository.findOne({
//       where: { id },
//       relations: ['courierCompany', 'rider', 'cod_payment'],
//       select: {
//         id: true,
//         status: true,
//         parcel_type: true,
//         shipment_type: true,
//         pickup_time: true,
//         delivery_time: true,
//         receiver_name: true,
//         sender_name: true,
//         shipment_id_tag_no: true,
//         createdOn: true,
//         sender_phone: true,
//         receiver_phone: true,
//         courierCompany: { company_name: true },
//         rider: { rider_name: true, vehicle_type: true },
//         cod_payment: { amount_received: true, pending_amount: true, cod_amount: true },
//       },
//     });
//   }

async getShipmentOverview(id: number) {
  return this.shipmentRepository.findOne({
    where: { id },
    relations: ['courierCompany', 'rider', 'cod_payment'],
    select: {
      id: true,
      status: true,
      parcel_type: true,
      shipment_type: true,
      pickup_time: true,
      delivery_time: true,
      receiver_name: true,
      sender_name: true,
      shipment_id_tag_no: true,
      createdOn: true,
      sender_phone: true,
      receiver_phone: true,
      courierCompany: { company_name: true },
      rider: { rider_name: true, vehicle_type: true },
      cod_payment: { amount_received: true, pending_amount: true, cod_amount: true },
    },
  });
}    
// async getCodShipments(page: number, limit: number, courier_company?: string) {
//     const query = this.codPaymentRepository.createQueryBuilder('shipment');

//     if (courier_company) {
//       query.andWhere('shipment.sender_name = :courier_company OR shipment.receiver_name = :courier_company', { courier_company});
//     }

//     const [data, total] = await query
//       .skip((page - 1) * limit)
//       .take(limit)
//       .getManyAndCount();

//     return { data, total };
//   }

async getCodShipments(page: number, limit: number, courier_company?: string) {
  const query = this.codPaymentRepository
    .createQueryBuilder('cod_payment')
    .leftJoinAndSelect('cod_payment.shipment', 'shipment');

  const [data, total] = await query
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return { data, total };
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

  // Mark a shipment as paid
async markAsPaid(shipmentId: string): Promise<void> {
const codPayment = await this.codPaymentRepository.findOne({
  where: { shipment: { id: Number(shipmentId) } },
  relations: ['shipment'],
});

if (!codPayment) throw new NotFoundException('Shipment not found');

codPayment.payment_status = 'Paid';
codPayment.collectedOn = new Date();

await this.codPaymentRepository.save(codPayment);

  }


  
//  async validateSuperAdmin(email: string, pass: string): Promise<any> {
//     const user = await this.findByEmail(email);
//     if (user && await bcrypt.compare(pass, user.password)) {
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//   }



  }