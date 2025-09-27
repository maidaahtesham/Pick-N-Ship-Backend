import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { company_document } from '../Models/company_document.entity';
import { courier_company } from '../Models/courier_company.entity';
import { Shipment } from '../Models/shipment.entity';
import { shipping_detail } from '../Models/shipping_detail.entity';
import { vendor_user } from '../Models/vendor_user.entity';
import { company_document_dto } from '../ViewModel/company_document_dto';
import { Response } from '../ViewModel/response';
import { shipping_detail_dto } from '../ViewModel/shipping_detail_dto';
import { vendorDetailsDTO } from '../ViewModel/vendorDetailsDTO.dto';
import { vendorSignUpDTO } from '../ViewModel/vendorSignUpDTO.dto';
import { DataSource, Repository } from 'typeorm';
import { Rider } from 'src/Models/rider.entity';
import { GetAllActiveShipmentsDto, GetAllShipmentsDto } from 'src/ViewModel/get_all_shipment_dto';
import { CodPayment } from 'src/Models/cod_payment.entity';
import { GetShipmentDetailsDto } from 'src/ViewModel/GetShipmentDetailsDto.dto';
import { VendorOperationDTO } from 'src/ViewModel/VendorOperationDTO';
import { Rating } from 'src/Models/ratings.entity';
import { Customer } from 'src/Models/customer.entity';
import { GetShipmentDetailsByIdDto } from 'src/ViewModel/get_shipment_detail_by_id_dto';
import { company_çonveyance_details } from 'src/Models/company_conveyance_details.entity';
import { company_çonveyance_pricing_details } from 'src/Models/company_çonveyance_pricing_details.entity';
import { profile_status_update_dto } from 'src/ViewModel/profile_status_update_dto';

@Injectable()
export class VendorService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(vendor_user)
    private vendorRepository: Repository<vendor_user>,

    @InjectRepository(courier_company)
    private courierCompanyRepository: Repository<courier_company>,

    @InjectRepository(company_document)
    private companyDocumentRepository: Repository<company_document>,

    @InjectRepository(shipping_detail)
    private shippingDetailRepository: Repository<shipping_detail>,

    
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,

    @InjectRepository(Rider)
    private riderRepository: Repository<Rider>,

    @InjectRepository(CodPayment)
    private codPaymentRepository: Repository<CodPayment>,


    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,


    @InjectRepository (Customer)
    private customerRepository: Repository<Customer>,

    @InjectRepository (company_çonveyance_details)
    private companyConveyanceDetailsRepository:Repository<company_çonveyance_details>,

    @InjectRepository(company_çonveyance_pricing_details)
    private companyConveyancePricingReposiory:Repository<company_çonveyance_pricing_details>

  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    return bcrypt.hash(password, salt); // Hash the password
  }

  
 async createVendorUser(data: vendorSignUpDTO): Promise<Response> {
  const resp = new Response();
  try {
    if (!data.email_address || !data.password) {
      throw new Error('Email and password are required');
    }

    const hashedPassword = await this.hashPassword(data.password);

    // Create vendor user without company (signup stage)
    const newVendor = this.vendorRepository.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email_address: data.email_address,
      password: hashedPassword,
      phone_number: data.phone_number,
      status: true,
      company: undefined, // skip karo signup ke time
    });

    const vendor = await this.vendorRepository.save(newVendor);

    resp.success = true;
    resp.message = 'Vendor user inserted successfully';
    resp.result = vendor;
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    return resp;
  } catch (error) {
    resp.success = false;
    resp.message = 'Failed to insert/update vendor user: ' + error.message;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 Bad Request';
    return resp;
  }
}


  async findByEmail(email_address: string): Promise<vendor_user | null> {
    return this.vendorRepository.findOne({ where: { email_address } , relations: ['company']});
  }

  async validateVendorUser(email: string, password: string): Promise<any> {
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



  async addVendorDetails(data: vendorDetailsDTO): Promise<Response> {
    const resp= new Response();
  try {
    // Convert string dates to Date objects
    const createdOn = new Date(data.created_on);
    const updatedOn = new Date(data.updated_on);

    // Find the company by company_id
    let company = await this.courierCompanyRepository.findOne({ where: { company_id: data.company_id } }); // Parse string to number

    if (company) {
      // Update existing company
      company = this.courierCompanyRepository.merge(company, {
        company_name: data.company_name,
        logo: data.logo,
        username: data.username,
        city: data.city,
        company_address: data.company_address,
        company_phone_number: data.company_phone_number,
        pns_account_full_name: data.pns_account_full_name,
        updatedBy: data.updated_by,
        updatedOn: updatedOn,
        status: data.status,
      });
      await this.courierCompanyRepository.save(company);
      resp.message = 'Vendor details updated successfully';
    } else {
      // Create new company
      const newCompany = this.courierCompanyRepository.create({
        company_name: data.company_name,
        logo: data.logo,
        username: data.username,
        city: data.city,
        company_address: data.company_address,
        company_phone_number: data.company_phone_number,
        pns_account_full_name: data.pns_account_full_name,
        createdBy: data.created_by,
        createdOn: createdOn,
        updatedBy: data.updated_by,
        updatedOn: updatedOn,
        status: data.status,
      });
      company = await this.courierCompanyRepository.save(newCompany);
      resp.message = 'Vendor details inserted successfully';
    }

    resp.success = true;
    resp.result = company;
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    return resp;
  } catch (error) {
    resp.success = false;
    resp.message = 'Failed to insert/update vendor details: ' + error.message;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 Bad Request';
    return resp;
  }
}

  async addCompanyDocuments(data: company_document_dto): Promise<Response> {
    const resp= new Response();
    try {
      const company = await this.courierCompanyRepository.findOne({ where: { company_id: data.company_id } });
      if (!company) throw new Error('Company not found');

      const newDocument = this.companyDocumentRepository.create({
        company,
        trade_license_document_path: data.trade_license_document_path,
        company_document_path: data.company_document_path,
        establishment_card_front: data.establishment_card_front,
        establishment_card_back:data.establishment_card_back,
        trade_license_expiry_date: data.trade_license_expiry_date,
        trade_license_number: data.trade_license_number,
        createdOn:data.created_on,
        createdBy:data.created_by,
        updatedOn:data.updated_on,
        updatedBy:data.updated_by,
        is_active:true
      });
      const document = await this.companyDocumentRepository.save(newDocument);
      resp.success = true;
      resp.message = 'Company documents added successfully';
      resp.result = document;
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      return resp;
    } catch (error) {
      resp.success = false;
      resp.message = 'Failed to add company documents: ' + error.message;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 Bad Request';
      return resp;
    }
  }
 

async addShippingDetails(data: shipping_detail_dto): Promise<Response> {
  const resp = new Response();
  try {
    const company = await this.courierCompanyRepository.findOne({
      where: { company_id: data.company_id },
    });
    if (!company) throw new Error('Company not found');

    const savedConveyances: (company_çonveyance_details & { pricing: company_çonveyance_pricing_details[] })[] = [];

    for (const conveyance of data.conveyance_types) {
      // 👀 check if conveyance already exists
      const existingConveyance = await this.companyConveyanceDetailsRepository.findOne({
        where: {
          company: { company_id: data.company_id },
          conveyance_types: conveyance.type,
        },
      });

      if (existingConveyance) {
        // 🚫 skip insert, return already exists
        resp.success = false;
        resp.message = `Conveyance '${conveyance.type}' already exists for this company`;
        resp.httpResponseCode = 400;
        resp.customResponseCode = '400 Bad Request';
        return resp;
      }

      // 🆕 insert new conveyance
      const newConveyance = this.companyConveyanceDetailsRepository.create({
        company,
        conveyance_types: conveyance.type,
        conveyance_details: conveyance.details,
        createdOn: data.created_on,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        is_active: true,
      });

      const insertedConveyance = await this.companyConveyanceDetailsRepository.save(newConveyance);

      // 🆕 insert pricing
      const pricingEntities = conveyance.pricing.map((pricing) =>
        this.companyConveyancePricingReposiory.create({
          conveyance_detail: insertedConveyance,
          size: pricing.size,
          weight: pricing.weight,
          width: pricing.width,
          length: pricing.length,
          height: pricing.height,
          baseFare: pricing.baseFare,
          pricePerKm: pricing.pricePerKm,
          createdOn: data.created_on,
          createdBy: data.createdBy,
          updatedOn: data.updated_on,
          updatedBy: data.updatedBy,
          is_active: true,
        })
      );

      await this.companyConveyancePricingReposiory.insert(pricingEntities);

      savedConveyances.push({
        ...insertedConveyance,
        pricing: pricingEntities,
      });
    }

    resp.success = true;
    resp.message = 'Shipping details inserted successfully';
    resp.result = savedConveyances;
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    return resp;
  } catch (error) {
    resp.success = false;
    resp.message = 'Failed to add shipping details: ' + error.message;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 Bad Request';
    return resp;
  }
}



 

 
  async getActiveJobs({ companyId, page, limit, status, search }) {
  try {
    const query = this.shipmentRepository
      .createQueryBuilder('s')
      .where('s.company_id = :companyId', { companyId }) // This line filters by company
      .leftJoinAndSelect('s.rider', 'rider') // Join to get rider details
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      query.andWhere('s.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        `(s.sender_name ILIKE :search OR 
          s.receiver_name ILIKE :search OR 
          rider.name ILIKE :search)`, // Search by sender, receiver, or rider name
        { search: `%${search}%` },
      );
    }

    query.orderBy('s.created_at', 'DESC');

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
 

async getAllJobsByCompany({ companyId, page, limit, status, search }) {
    try {
        const query = this.shipmentRepository
            .createQueryBuilder('s')
            // Add the join to the Customer entity
            .leftJoinAndSelect('s.customer', 'customer')
            .leftJoinAndSelect('s.rider', 'rider')
            .leftJoinAndSelect('s.courierCompany', 'company')
            .where('s.courierCompany = :companyId', { companyId })
            .skip((page - 1) * limit)
            .take(limit);

        if (status) {
            query.andWhere('s.job_status = :status', { status });
        }

        if (search) {
            query.andWhere(
                `(s.sender_name ILIKE :search OR 
                  s.receiver_name ILIKE :search OR 
                  rider.rider_name ILIKE :search OR // Use rider.rider_name based on your rider entity
                  customer.firstname ILIKE :search OR // Search by customer name
                  customer.lastname ILIKE :search)`,
                { search: `%${search}%` },
            );
        }

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
  async getAllShipments({
    company_id,
    page = 1,
    limit = 10,
    status,
    search,
  }: GetAllShipmentsDto) {
    try {
       const query = this.shipmentRepository
        .createQueryBuilder('shipment')
         .leftJoinAndSelect('shipment.customer', 'customer')
         .leftJoinAndSelect('shipment.rider', 'rider')
        .leftJoinAndSelect('shipment.courierCompany', 'company')
         .where('shipment.company_id = :companyId', { companyId: company_id });

       if (status) {
        query.andWhere('shipment.job_status = :status', { status });
      }

       if (search) {
        query.andWhere(
          `(shipment.tracking_number ILIKE :search OR
            shipment.sender_name ILIKE :search OR
            shipment.receiver_name ILIKE :search OR
            rider.rider_name ILIKE :search)`,
          { search: `%${search}%` },
        );
      }

       query.orderBy('shipment.createdOn', 'DESC');

       query.skip((page - 1) * limit).take(limit);

       const [data, total] = await query.getManyAndCount();

      return {
        success: true,
        message: 'Shipments fetched successfully',
        data: {
          shipments: data,
          pagination: {
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            limit,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching customer shipments:', error);
      return {
        success: false,
        message: 'Failed to fetch shipments',
        error: error.message,
      };
    }

  }


 async getAllActiveShipments({
  company_id,
  page = 1,
  limit = 10,
  status,
  search,
}: GetAllActiveShipmentsDto) {
  try {
    const query = this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.customer', 'customer')
      .leftJoinAndSelect('shipment.rider', 'rider')
      .leftJoinAndSelect('shipment.courierCompany', 'company')
      .where('shipment.company_id = :companyId', { companyId: company_id })
      .andWhere('shipment.job_status NOT IN (:...excludedStatuses)', { excludedStatuses: ['Cancelled'] });

    // Filter by status (completed or pending) if provided
    if (status) {
      query.andWhere('shipment.job_status IN (:...statuses)', { statuses: ['completed', 'pending'] });
      if (status !== 'All'  ) {
        query.andWhere('shipment.job_status = :status', { status });
      }
    }

    // Handle search functionality
    if (search) {
      query.andWhere(
        `(shipment.tracking_number ILIKE :search OR
          shipment.sender_name ILIKE :search OR
          shipment.receiver_name ILIKE :search OR
          rider.rider_name ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    query.orderBy('shipment.createdOn', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      success: true,
      message: 'Shipments fetched successfully',
      data: {
        shipments: data,
        pagination: {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          limit,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching customer shipments:', error);
    return {
      success: false,
      message: 'Failed to fetch shipments',
      error: error.message,
    };
  }
}


async getAllRiders(
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'id',
  sortOrder: 'ASC' | 'DESC' = 'ASC',
  search: string = '',
  companyId: number,
) {
  const query = this.riderRepository.createQueryBuilder('rider');

  // Handle search functionality
  if (search) {
    query.where('LOWER(rider.rider_name) LIKE LOWER(:search)', { search: `%${search}%` })
         .orWhere('LOWER(rider.email) LIKE LOWER(:search)', { search: `%${search}%` })
         .orWhere('LOWER(rider.licence_number) LIKE LOWER(:search)', { search: `%${search}%` })
         .orWhere('LOWER(rider.vehicle_type) LIKE LOWER(:search)', { search: `%${search}%` });
  }

  // Apply companyId filter
  if (companyId) {
    query.andWhere('rider.company_id = :companyId', { companyId });
  }

  // Apply sorting
  query.orderBy(`rider.${sortBy}`, sortOrder);

  // Apply pagination
  query.skip((page - 1) * limit).take(limit);

  const [data, total] = await query.getManyAndCount();

  return { data, total };
}


async getShipmentCodDetails(
  company_id?: number | null,
  status?: string | null,
  page = 1,
  limit = 10,
): Promise<Response> {
  const resp = new Response();

  try {
 
    if (!company_id) {
      resp.success = true;
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      resp.message = 'CompanyId is required to fetch COD shipments';
      resp.result = [];
      resp.count = 0;
      return resp;
    }

    const query = this.shipmentRepository
  .createQueryBuilder('shipment')
  .leftJoinAndSelect('shipment.cod_payment', 'cod_payment')
  .leftJoinAndSelect('cod_payment.rider', 'rider')
  .leftJoinAndSelect('shipment.courierCompany', 'courierCompany')
  .leftJoinAndSelect('cod_payment.courierCompany', 'paymentCompany')
  .where('courierCompany.company_id = :company_id', { company_id})
  .andWhere('shipment.payment_mode = :mode', { mode: 'COD' });


 
    if (status && status.trim() !== '') {
      query.andWhere('cod_payment.payment_status = :status', { status });
    }

    // ✅ Pagination
    const [data, total] = await query
      .orderBy('shipment.createdOn', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    resp.success = true;
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    resp.message = 'Shipment COD list fetched successfully';
    resp.result = data;
    resp.count = total;

    return resp;
  } catch (ex) {
    resp.success = false;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 BadRequest';
    resp.message = `Failed to fetch Shipment COD list: ${ex.message}`;
    resp.result = [];
    resp.count = 0;
    return resp;
  }
}








async markShipmentAsReceived(shipmentId: number): Promise<Response> {
  const resp = new Response();

  try {
     const shipment = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.cod_payment', 'cod_payment')
      .where('shipment.id = :shipmentId', { shipmentId })
      .getOne();

    // if (!shipment || !shipment.cod_payment) {
    //   throw new NotFoundException(`Shipment with id ${shipmentId} or its COD payment not found`);
    // }

    // // const codPayment = shipment.cod_payment;

    // // Update status to "received"
    // codPayment.is_paid_to_company = true;
    // codPayment.updatedOn = new Date();

    // await this.codPaymentRepository.save(codPayment);

    resp.success = true;
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    resp.message = `Shipment ID ${shipmentId} marked as Received successfully.`;
    resp.result = shipment;
    resp.count = 1;

    return resp;
  } catch (ex) {
    resp.success = false;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 BadRequest';
    resp.message = `Failed to mark Shipment as Received: ${ex.message}`;
    resp.result = [];
    resp.count = 0;
    return resp;
  }
}

 async getShipmentDetails({
  company_id,
  shipment_id,
}: GetShipmentDetailsDto) {
  try {
    const query = this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.customer', 'customer')
      .leftJoinAndSelect('shipment.rider', 'rider')
      .leftJoinAndSelect('shipment.courierCompany', 'company')
      .where('shipment.company_id = :companyId', { companyId: company_id })
      .andWhere('shipment.id = :shipmentId', { shipmentId: shipment_id });

    const data = await query.getOne();

    if (!data) {
      return {
        success: false,
        message: 'Shipment not found',
      };
    }

    return {
      success: true,
      message: 'Shipment details fetched successfully',
      data,
    };
  } catch (error) {
    console.error('Error fetching shipment details:', error);
    return {
      success: false,
      message: 'Failed to fetch shipment details',
      error: error.message,
    };
  }
}

async addVendorCompleteDetails(data: VendorOperationDTO): Promise<Response> {
  const resp = new Response();
  try {
    const createdOn = data.created_on ? new Date(data.created_on) : new Date();
    const updatedOn = data.updated_on ? new Date(data.updated_on) : new Date();

    // Step 1: Vendor find karo
    const vendor = await this.vendorRepository.findOne({
      where: { id: data.vendor_id },
      relations: ['company'],
    });

    if (!vendor) {
      throw new Error('Vendor user not found');
    }

     let company: courier_company | null = null;

    if (data.company_id) {
       company = await this.courierCompanyRepository.findOne({
        where: { company_id: data.company_id },
      });

      if (!company) {
        throw new Error('Company not found with given ID');
      }

      this.courierCompanyRepository.merge(company, {
        company_name: data.company_name,
        logo: data.logo,
        username: data.username,
        city: data.city,
        company_address: data.company_address,
        company_phone_number: data.company_phone_number,
        pns_account_full_name: data.pns_account_full_name,
        is_profile_complete: data.is_profile_complete,
        updatedBy: data.updated_by,
        updatedOn,
        status: true,
      });

      company = await this.courierCompanyRepository.save(company);
      resp.message = 'Vendor details updated successfully';
    } else {
      // create case
      const newCompany = this.courierCompanyRepository.create({
        company_name: data.company_name,
        logo: data.logo,
        username: data.username,
        city: data.city,
        company_address: data.company_address,
        company_phone_number: data.company_phone_number,
        pns_account_full_name: data.pns_account_full_name,
        is_profile_complete: data.is_profile_complete,
        registeration_status: 'pending',
        registeration_date: new Date().toDateString(),
        createdBy: data.created_by,
        createdOn,
        updatedBy: data.updated_by,
        updatedOn,
        status: data.status ?? true,
      });

      company = await this.courierCompanyRepository.save(newCompany);
      resp.message = 'Vendor details inserted successfully';
    }

     vendor.company = company!;
    await this.vendorRepository.save(vendor);

     if (
      data.trade_license_document_path ||
      data.company_document_path ||
      data.establishment_card_front ||
      data.trade_license_number
    ) {
      const newDocument = this.companyDocumentRepository.create({
        company: company!,
        trade_license_document_path: data.trade_license_document_path,
        company_document_path: data.company_document_path,
        establishment_card_front: data.establishment_card_front,
        establishment_card_back: data.establishment_card_back,
        trade_license_expiry_date: data.trade_license_expiry_date,
        trade_license_number: data.trade_license_number,
        establishment_card_expiry_date:data.establishment_card_expiry_date,
        createdOn,
        createdBy: data.created_by,
        updatedOn,
        updatedBy: data.updated_by,
        is_active: true,
      });

      const document = await this.companyDocumentRepository.save(newDocument);
      resp.message += ' & company documents added successfully';
      resp.result = { company, vendor, document };
    } else {
      resp.result = { company, vendor };
    }

    resp.success = true;
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    return resp;
  } catch (error) {
    resp.success = false;
    resp.message =
      'Failed to insert/update vendor details: ' + (error as Error).message;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 Bad Request';
    return resp;
  }
}






// async getDashboardStats(companyId: number) {
//   const [active, pending, delayed, delivered, earning, overallRatingRaw] = await Promise.all([
//     this.shipmentRepository.count({
//       where: [
//         { courierCompany: { company_id: companyId }, job_status: 'Active' },
//         { courierCompany: { company_id: companyId }, job_status: 'In Progress' },
//       ],
//     }),
//     this.shipmentRepository.count({
//       where: [
//         { courierCompany: { company_id: companyId }, job_status: 'Pending' },
//         { courierCompany: { company_id: companyId }, job_status: 'pending' },
//       ],
//     }),
//     this.shipmentRepository.count({
//       where: [
//         { courierCompany: { company_id: companyId }, job_status: 'Delayed' },
//         { courierCompany: { company_id: companyId }, job_status: 'Cancelled' },
//       ],
//     }),
//     this.shipmentRepository.count({
//       where: [
//         { courierCompany: { company_id: companyId }, job_status: 'Delivered' },
//         { courierCompany: { company_id: companyId }, job_status: 'Completed' },
//       ],
//     }),

//     // ✅ Earning
//     this.shipmentRepository
//       .createQueryBuilder('s')
//       .leftJoin('s.cod_payment', 'cp')
//       .select('COALESCE(SUM(cp.cod_amount), 0)', 'total')
//       .where('s.company_id = :companyId', { companyId })
//       .andWhere('s.job_status IN (:...jobStatuses)', { jobStatuses: ['Delivered', 'Completed'] })
//       .andWhere('cp.payment_status = :status', { status: 'paid' })
//       .getRawOne<{ total: string }>(),

//     // ✅ Overall Rating
//     this.ratingRepository
//       .createQueryBuilder('rating')
//       .select('AVG(rating.stars)', 'avg_stars')
//       .addSelect('AVG(rating.rider_behavior_score)', 'avg_rider_behavior')
//       .addSelect('AVG(rating.on_time_delivery_score)', 'avg_on_time_delivery')
//       .addSelect('AVG(rating.affordability_score)', 'avg_affordability')
//       .addSelect('COUNT(rating.id)', 'total_reviews')
//       .where('rating.company_id = :companyId', { companyId })
//       .andWhere('rating.status = :status', { status: true })
//       .getRawOne<{
//         avg_stars: string | null;
//         avg_rider_behavior: string | null;
//         avg_on_time_delivery: string | null;
//         avg_affordability: string | null;
//         total_reviews: string | null;
//       }>(),
//   ]);

//   // ✅ Ensure safe object
//   const overallRating = overallRatingRaw || {
//     avg_stars: '0',
//     avg_rider_behavior: '0',
//     avg_on_time_delivery: '0',
//     avg_affordability: '0',
//     total_reviews: '0',
//   };

//   const getRatingLabel = (score: number): string => {
//     if (score >= 80) return 'Great';
//     if (score >= 50) return 'Good';
//     return 'Poor';
//   };

//   return {
//     active,
//     pending,
//     delayed,
//     delivered,
//     earning: earning?.total ? parseFloat(earning.total) : 0,
//     rating: overallRating.avg_stars ? parseFloat(overallRating.avg_stars).toFixed(1) : '0.0',
//     overallRating: {
//       avgStars: parseFloat(overallRating.avg_stars || '0').toFixed(1),
//       avgRiderBehaviorScore: parseFloat(overallRating.avg_rider_behavior || '0').toFixed(0),
//       avgOnTimeDeliveryScore: parseFloat(overallRating.avg_on_time_delivery || '0').toFixed(0),
//       avgAffordabilityScore: parseFloat(overallRating.avg_affordability || '0').toFixed(0),
//       avgRiderBehaviorLabel: getRatingLabel(parseFloat(overallRating.avg_rider_behavior || '0')),
//       avgOnTimeDeliveryLabel: getRatingLabel(parseFloat(overallRating.avg_on_time_delivery || '0')),
//       avgAffordabilityLabel: getRatingLabel(parseFloat(overallRating.avg_affordability || '0')),
//       totalReviews: parseInt(overallRating.total_reviews || '0', 10),
//     },
//   };
// }



// async getShipmentDetailsById(shipmentId: number) {
//   try {
//     // Fetch shipment with all relevant relations
//     const shipment = await this.shipmentRepository.findOne({
//       where: { id: shipmentId },
//       relations: [
//         'rider',
//         'customer',
//         'cod_payment',
//         'courierCompany',
//         // 'courierCompany.shippingDetails',
//         'courierCompany.commissionRates',
//       ],
//     });

//     if (!shipment) throw new Error('Shipment not found');

//     const rider = shipment.rider || null;
//     const customer = shipment.customer || null;
//     const codPayment = shipment.cod_payment || null;
//     const company = shipment.courierCompany || null;

//     // ---------------------------
//     // Dynamic Delivery Fees Logic
//     // ---------------------------
//  // Dynamic Delivery Fees Logic
// let paymentDetails = {
//   standardDeliveryFees: 0,
//   subtotal: 0,
//   platformFees: 0,
//   vat: 0,
//   pnsCommission: 0,
//   total: 0,
// };

// if (company && rider) {
//   const vehicleType = rider.vehicle_type.toLowerCase();

//   const conveyanceDetail = await this.companyConveyanceDetailsRepository
//     .createQueryBuilder('conveyance')
//     .leftJoinAndSelect('conveyance.pricing', 'pricing')
//     .where('conveyance.company_id = :companyId', { companyId: company.company_id })
//     .andWhere('conveyance.conveyance_types = :vehicleType', { vehicleType })
//     .getOne();

//   if (conveyanceDetail) {
//     const pricing = conveyanceDetail.pricing.find(p => p.size === shipment.package_size);

//     if (pricing) {
//       const baseFare = pricing.baseFare || 0;
//       const distanceFare = (rider.distance || 0) * (pricing.pricePerKm || 0);

//       const standardDeliveryFees = baseFare + distanceFare;

//       // Commission calculation as percentage (for PNS info only)
//       const commissionRate = parseFloat(company.commissionRates?.[0]?.commission_rate || '0'); // e.g., 10
//       const pnsCommission = standardDeliveryFees * (commissionRate / 100);

//       const subtotal = standardDeliveryFees;
//       const platformFees = 1; // example platform fee
//       const vat = Math.ceil(subtotal * 0.06); // 6% VAT
//       const total = subtotal + platformFees + vat; // **exclude commission**

//       paymentDetails = {
//         standardDeliveryFees,
//         subtotal,
//         platformFees,
//         vat,
//         pnsCommission,
//         total,
//       };
//     }
//   }
// }

//   const companyDocuments = await this.companyDocumentRepository.find({
//       where: { company_id: company?.company_id },
//     });
  
    // const shipmentDetails: GetShipmentDetailsByIdDto = {
    //   shipmentId: shipment.tracking_number || '',
    //   date: shipment.createdOn?.toISOString().split('T')[0] || '',
    //   parcelType: shipment.parcel_type || '',
 
    //   parcelWeight: '', // compute if needed
    //    amount: codPayment?.cod_amount?.toString() || '',
    //    shipmentType: shipment.payment_mode || '',
    //   customerName: customer ? `${customer.firstname} ${customer.lastname}` : '',
    //   customerNumber: customer?.phone_number || '',
    //   senderName: shipment.sender_name || '',
    //   senderNumber: shipment.sender_phone || '',
    //   receiverName: shipment.receiver_name || '',
    //   receiverPhoneNumber: shipment.receiver_phone || '',
    //   assignedRider: rider?.rider_name || '',
    //   pickUpTime: shipment.pickup_time?.toLocaleTimeString() || '',
    //    isCodReceived: codPayment?.payment_status === 'paid',
  
    //   parcelPhotos: [], // Fetch if available
    //   companyDetails: { company_name: company?.company_name || '' ,
    //   documents: companyDocuments.map(doc=>({
    //    establishment_card_document: [
    //         { side_front: 'front', file_front: doc.establishment_card_front,
    //           side_back:'back', file_back:doc.establishment_card_back
    //         },  
    //       ],
    //       establishment_card_expiry_date: doc.trade_license_expiry_date,
    //     })),
    //   },
      // orderTracking: {
      //   awaiting: { status: 'Completed', time: shipment.createdOn?.toLocaleString() || '' },
      //   pickup: { status: 'Completed', time: shipment.pickup_time?.toLocaleString() || '' },
      //   inTransit: { status: 'Completed', time: shipment.updatedOn?.toLocaleString() || '' },
      //   outForDelivery: { status: 'Pending', time: '' },
      //    codCollected: { status: codPayment?.payment_status || 'Pending', time: codPayment?.collectedOn?.toLocaleString() || '' },
      // },
      // vehicleType: rider?.vehicle_type || '',
    //   paymentDetails,
    //   codMarkedAsReceivedByAdmin: { status: 'Pending', time: '' }, // handle admin logic if needed
    // };


    //   return shipmentDetails;
    // } catch (error) {
    //   throw new Error(`Error fetching shipment details: ${error.message}`);
    // }
// }  
// async updateProfileStatus(data:profile_status_update_dto): Promise<Response> {
//   const resp = new Response();
//   try {
//     const company = await this.courierCompanyRepository.findOne({
//       where: { company_id: data.company_id },
//     });

//     if (!company) {
//       throw new Error('Company not found');
//     }

//     company.is_profile_complete = data.isProfileComplete;
//     company.updatedOn = new Date();
//     company.updatedBy = data.updated_by; 

//     await this.courierCompanyRepository.save(company);

//     resp.success = true;
//     resp.message = `Profile status updated successfully to ${data}`;
//     resp.result = { company_id: data.company_id, is_profile_complete: data.isProfileComplete};
//     resp.httpResponseCode = 200;
//     resp.customResponseCode = '200 OK';
//     return resp;
//   } catch (error) {
//     resp.success = false;
//     resp.message = 'Failed to update profile status: ' + error.message;
//     resp.httpResponseCode = 400;
//     resp.customResponseCode = '400 Bad Request';
//     return resp;
//   }
// }


// } 
  }
 