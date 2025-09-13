import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    return bcrypt.hash(password, salt); // Hash the password
  }

  /* CREATE Vendor User */
  async createVendorUser(data: vendorSignUpDTO): Promise<Response> {
    const resp= new Response();
    try {
      if (!data.email_address || !data.password) {
        throw new Error('Email and password are required');
      }

      let vendor: vendor_user | null = null;

      if (data.id) {
        vendor = await this.vendorRepository.findOne({ where: { id: data.id } });
      } else if (data.email_address) {
        vendor = await this.vendorRepository.findOne({ where: { email_address: data.email_address } });
      }
      const company= await this.courierCompanyRepository.findOne({where:{ company_id:data.company_id}})

if (!company) {
  throw new Error(`Company with id ${data.company_id} not found`);
}
      if (vendor) {
        // Update existing record
        if (data.password) {
          // Hash the password if provided
          data.password = await this.hashPassword(data.password);
        }

        // Update existing record with mapped fields
        vendor = this.vendorRepository.merge(vendor, {
          first_name: data.first_name,
          last_name: data.last_name,
          email_address: data.email_address,
          password: data.password,
          phone_number:data.phone_number,
          status:true,
          company

        });
        await this.vendorRepository.save(vendor);
        resp.message = 'Vendor user updated successfully';
      } else {
        // Insert new record
        const hashedPassword = await this.hashPassword(data.password);
        const newVendor = this.vendorRepository.create({
          first_name: data.first_name,
          last_name: data.last_name,
          email_address: data.email_address,
          password: hashedPassword,
          phone_number:data.phone_number,
          status:true,
          
        });
        vendor = await this.vendorRepository.save(newVendor);
        resp.message = 'Vendor user inserted successfully';
      }

      resp.success = true;
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
    return this.vendorRepository.findOne({ where: { email_address } });
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
        establishment_card: data.establishment_card,
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
    const resp= new Response();
    try {
      const company = await this.courierCompanyRepository.findOne({ where: { company_id: data.company_id } });
      if (!company) throw new Error('Company not found');

      const newShipping = this.shippingDetailRepository.create({
        company,
        conveyance_types: data.conveyance_types,
        conveyance_details: data.conveyance_details,
        commission_rate: data.commission_rate,
        createdOn:data.created_on,
        updatedOn:data.updated_on,

      });
      const shipping = await this.shippingDetailRepository.save(newShipping);
      resp.success = true;
      resp.message = 'Shipping details added successfully';
      resp.result = shipping;
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

 

// async addVendorDetails(data: vendorDetailsDTO): Promise<Response> {
//     const resp: Response = {
//       success: false,
//       message: '',
//       result: null,
//       httpResponseCode: null,
//       customResponseCode: '',
//       count: 0,
//     };

//     try {
//       let courier_company: courier_company | null = null;

//       if (data.company_id) {
//         // Update existing record
//         courier_company = await this.courierCompanyRepository.findOne({ where: { company_id: data.company_id } });
//         if (!courier_company) {
//           throw new Error('Vendor not found');
//         }

//         // Update with mapped fields
//         courier_company = this.courierCompanyRepository.merge(courier_company, {
//           company_name: data.company_name,
//           logo: data.logo,
//           username:data.username,
//           city: data.city,
//           company_phone_number: data.company_phone_number,
//           pns_account_full_name:data.pns_account_full_name,        
//           establishment_date:data.establishment_date,
//           conveyance_types:data.conveyance_types,
//           conveyance_details:data.conveyance_details
//         });
//         await this.courierCompanyRepository.save(courier_company);
//         resp.message = 'Vendor details updated successfully';
//       } else {
//        const newVendorDetails = this.courierCompanyRepository.create({
//           company_name: data.company_name,
//           logo: data.logo,
//           username:data.username,
//           city: data.city,
//           company_address:data.company_address,
//           company_phone_number: data.company_phone_number,
//           pns_account_full_name: data.pns_account_full_name,
//           contact_phone: data.contact_phone,
//           establishment_date:data.establishment_date,
//           conveyance_types:data.conveyance_types,
//           conveyance_details:data.conveyance_details,
//           status: true, 
//         });
//         courier_company = await this.courierCompanyRepository.save(newVendorDetails);
//         resp.message = 'Vendor details inserted successfully';
//       }

//       resp.success = true;
//       resp.result = courier_company;
//       resp.httpResponseCode = 200;
//       resp.customResponseCode = '200 OK';
//       return resp;
//     } catch (error) {
//       resp.success = false;
//       resp.message = 'Failed to insert/update vendor details: ' + error.message;
//       resp.httpResponseCode = 400;
//       resp.customResponseCode = '400 Bad Request';
//       return resp;
//     }
//   }
  async getActiveJobs(data: { company_id: number }): Promise<Response> {
    const resp= new Response();
    try {
      const shipments = await this.shipmentRepository.find({
      where: { courierCompany: { company_id: data.company_id } },  
        relations: ['rider', 'shipment_request', 'shipment_request.customer'],
      });

      // Enhance shipment data with customer full name
      const enrichedShipments = shipments.map(shipment => ({
        ...shipment,
        customerName: shipment.shipment_request?.customer
          ? `${shipment.shipment_request.customer.firstname} ${shipment.shipment_request.customer.lastname}`
          : shipment.sender_name,
      }));

      resp.success = true;
      resp.message = 'Active jobs fetched successfully';
      resp.result = enrichedShipments;
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      resp.count = enrichedShipments.length;
      return resp;
    } catch (error) {
      resp.success = false;
      resp.message = 'Failed to fetch active jobs: ' + error.message;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 Bad Request';
      return resp;
    }
  }
}






