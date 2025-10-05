// src/customer-user/customer-user.service.ts
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { shipment_request } from '../Models/shipment_request.entity';

import { Customer } from '../Models/customer.entity';
import { Shipment } from '../Models/shipment.entity';
import { shipping_detail } from '../Models/shipping_detail.entity';

import { courier_company } from '../Models/courier_company.entity';
import { ShipmentRequestDTO } from 'src/ViewModel/shipmentRequestDTO';
import { Response } from 'src/ViewModel/response';
import { SelectVehicleDTO } from 'src/ViewModel/SelectVehicleDTO';
import { RegularBookingDTO } from 'src/ViewModel/RegularBookingDTO';
import { customer_signup_dto } from 'src/ViewModel/customer_signup_dto';
import * as bcrypt from 'bcryptjs';
import { GetAllShipmentsCustomerDto } from 'src/ViewModel/get_all_shipment_customer_dto';
import { CustomerAddresses } from 'src/Models/customer_addresses.entity';
import { GetAddressesDto } from 'src/ViewModel/get-addresses.dto';
 import { parcel_details } from 'src/Models/parcel_detail.entity';
import { CreateFullShipmentDTO } from 'src/ViewModel/CreateShipmentRequestDto';
import {  DataSource } from 'typeorm'; // For transaction
import { Rating } from 'src/Models/ratings.entity';
import { CreateRatingDto } from 'src/ViewModel/CreateRatingDto';
import { Rider } from 'src/Models/rider.entity';
import { UploadPictureService } from 'src/upload-pictures/upload_picture/upload_picture.service';
import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { PaymentDTO } from 'src/ViewModel/PaymentDto';
import { PaymentTransaction } from 'src/Models/payment_transactions.entity';
import { UpdateCustomerProfileDto } from 'src/ViewModel/UpdateCustomerProfileDto';


@Injectable()
export class CustomerUserService {

  private s3Client: S3Client;
  constructor(
    @InjectRepository(shipment_request)
    private shipmentRequestRepository: Repository<shipment_request>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(shipping_detail)
    private shippingDetailRepository: Repository<shipping_detail>,
    @InjectRepository(courier_company)
    private courierCompanyRepository: Repository<courier_company>,
    @InjectRepository(CustomerAddresses)
    private addressRepository: Repository<CustomerAddresses>,
    @InjectRepository (parcel_details)
    private parcelDetailsRepository: Repository<parcel_details>,

       @InjectRepository (Rating)
    private ratingRepository: Repository<Rating>,

    @InjectRepository(Rider)
    private riderRepository:Repository<Rider>,

    @InjectRepository(UploadPictureService)
    private uploadPictureService: UploadPictureService,
    private configService: ConfigService,
    private dataSource: DataSource,  

  ) {

    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS configuration in .env file');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });}

  //   async createShipmentRequest(customerId: number, data: { pickup_location: string; parcel_type: 'regular' | 'bulk'; request_date?: string; dropoff_locations?: string[]; tracking_number:string; }): Promise<Response> {
  //   const resp = new Response();
  //   try {
  //     const customer = await this.customerRepository.findOne({ where: { id: customerId }, relations: ['company'] });
  //     if (!customer) {
  //       throw new BadRequestException('Customer not found');
  //     }

  //     const requestDate = data.request_date ? new Date(data.request_date) : new Date();
  //     if (isNaN(requestDate.getTime())) {
  //       throw new BadRequestException('Invalid request_date provided');
  //     }

  //     // Validate dropoff_locations for bulk
  //     if (data.parcel_type === 'bulk' && (!data.dropoff_locations || data.dropoff_locations.length < 2)) {
  //       throw new BadRequestException('Bulk shipment requires at least 2 dropoff locations');
  //     }
  //     if (data.parcel_type === 'regular' && data.dropoff_locations && data.dropoff_locations.length !== 1) {
  //       throw new BadRequestException('Regular shipment requires exactly 1 dropoff location');
  //     }

  //     const shipment = this.shipmentRepository.create({
  //       pickup_location: data.pickup_location,
  //       parcel_type: data.parcel_type,
  //       tracking_number:data.tracking_number,
  //       shipment_status: 'pending',
  //       payment_mode: 'prepaid',
  //       shipment_created_on: new Date(),
  //       pickup_time: requestDate,
  //       customer: customer,
  //       createdBy: 'system',
  //       updatedBy: 'system',
  //       status: true,
  //     });

  //     const savedShipment = await this.shipmentRepository.save(shipment);

  //     resp.success = true;
  //     resp.message = 'Shipment initialized successfully';
  //     resp.result = {
  //       shipment_id: savedShipment.id,
  //       pickup_location: savedShipment.pickup_location,
  //       parcel_type: savedShipment.parcel_type,
  //       dropoff_locations: data.dropoff_locations || [],
  //       request_date: requestDate,
  //       createdOn: savedShipment.createdOn,
  //       updatedOn: savedShipment.updatedOn,
  //     };
  //     resp.httpResponseCode = 200;
  //     resp.customResponseCode = '200 OK';
  //     return resp;
  //   } catch (error) {
  //     resp.success = false;
  //     resp.message = 'Failed to initialize shipment: ' + error.message;
  //     resp.httpResponseCode = 400;
  //     resp.customResponseCode = '400 Bad Request';
  //     return resp;
  //   }
  // }

  // async AddParcelDetails(customerId: number, shipmentId: number, data: { parcels: Array<{
  //   dropoff_location: string;
  //   description?: string;
  //   sender_name: string;
  //   sender_phone: string;
  //   receiver_name: string;
  //   receiver_phone: string;
  //   package_size: 'small' | 'medium' | 'large' | 'custom';
  //   weight: number;
  //   length: number;
  //   height: number;
  //   width?: number;
  //   parcel_photos?: string[];
  //   cod_amount?: number;
  //   base_price?: number;
  // }> }): Promise<Response> {
  //   const resp = new Response();
  //   try {
  //     const shipment = await this.shipmentRepository.findOne({
  //       where: { id: shipmentId },
  //       relations: ['customer', 'courierCompany'],
  //     });
  //     if (!shipment) {
  //       throw new BadRequestException('Shipment not found');
  //     }
  //     if (shipment.customer.id !== customerId) {
  //       throw new BadRequestException('Unauthorized access to shipment');
  //     }

  //      const expectedCount = shipment.parcel_type === 'bulk' ? data.parcels.length >= 2 : data.parcels.length === 1;
  //     if (!expectedCount) {
  //       throw new BadRequestException(`Invalid number of parcels for ${shipment.parcel_type} type`);
  //     }

  //     let totalCodAmount = 0;
  //     const parcelEntities: parcel_details[] = data.parcels.map((p) => {
  //       const parcel = this.parcelDetailsRepository.create({
  //         shipments: shipment,
  //         dropoff_location: p.dropoff_location,
  //         description: p.description || '',
  //         sender_name: p.sender_name,
  //         sender_phone: p.sender_phone,
  //         receiver_name: p.receiver_name,
  //         receiver_phone: p.receiver_phone,
  //         package_size: p.package_size,
  //         weight: p.weight,
  //         length: p.length,
  //         height: p.height,
  //         width: p.width ,
  //         parcel_photos: p.parcel_photos || [],
  //          createdBy: 'system',
  //         updatedBy: 'system',
  //         status: true,
  //       });
  //       totalCodAmount += (p.cod_amount || 0);
  //       return parcel;
  //     });

  //     const savedParcels = await this.parcelDetailsRepository.save(parcelEntities);

  //     // Update shipment with tracking and other details
  //     shipment.tracking_number = `SHIP-${shipmentId}-${Date.now()}`;
  //     await this.shipmentRepository.save(shipment);

  //     resp.success = true;
  //     resp.message = 'Shipment details created successfully';
  //     resp.result = {
  //       shipment_id: shipment.id,
  //       tracking_number: shipment.tracking_number,
  //       parcels: savedParcels.map((parcel) => ({
  //         parcel_id: parcel.parcel_id,
  //         dropoff_location: parcel.dropoff_location,
  //         package_size: parcel.package_size,
  //         weight: parcel.weight,
  //         // Include other fields as needed, exclude photos if sensitive
  //       })),
  //       total_cod_amount: totalCodAmount,
  //     };
  //     resp.httpResponseCode = 200;
  //     resp.customResponseCode = '200 OK';
  //     return resp;
  //   } catch (error) {
  //     resp.success = false;
  //     resp.message = 'Failed to create shipment details: ' + error.message;
  //     resp.httpResponseCode = 400;
  //     resp.customResponseCode = '400 Bad Request';
  //     return resp;
  //   }
  // }
  
// async createFullShipment(data: CreateFullShipmentDTO): Promise<Response> {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       const customer = await queryRunner.manager.findOne(Customer, {
//         where: { id: data.customerId },
//         relations: ['company'],
//       });
//       if (!customer) {
//         throw new BadRequestException('Customer not found');
//       }

//       const requestDate = data.request_date ? new Date(data.request_date) : new Date();
//       if (isNaN(requestDate.getTime())) {
//         throw new BadRequestException('Invalid request_date provided');
//       }
 

//       // Create shipment
//       const shipment = queryRunner.manager.create(Shipment, {
//         pickup_location: data.pickup_location,
//         parcel_type: data.parcel_type,
//         shipment_status: 'pending',
//         payment_mode: 'prepaid',
//         shipment_created_on: new Date(),
//         pickup_time: requestDate,
//         customer: customer,
//         createdBy: 'system',
//         updatedBy: 'system',
//         status: true,
//       });

//       const savedShipment = await queryRunner.manager.save(shipment);

//       // Add parcels
//       let totalCodAmount = 0;
//       const parcelEntities: parcel_details[] = data.parcels.map((p, i) => {
//         const parcel = queryRunner.manager.create(parcel_details, {
//           shipments: { id: savedShipment.id }, // Use ID for relation
//           dropoff_location: p.dropoff_location,
//           description: p.description || '',
//           sender_name: p.sender_name,
//           sender_phone: p.sender_phone,
//           receiver_name: p.receiver_name,
//           receiver_phone: p.receiver_phone,
//           package_size: p.package_size,
//           weight: p.weight,
//           length: p.length,
//           height: p.height,
//           width: p.width || undefined,  
//           // parcel_photos: p.parcel_photos || [],
//           cod_amount: p.cod_amount || 0,
//           createdBy: 'system',
//           updatedBy: 'system',
//           status: true,
//         });
//         totalCodAmount += (p.cod_amount || 0);
//         return parcel;
//       });

//       const savedParcels = await queryRunner.manager.save(parcel_details, parcelEntities);
//       const trackingNumber = `SHIP-${savedShipment.id}-${Date.now()}`;
 

//       // Update shipment with tracking_number
//       savedShipment.tracking_number = trackingNumber;
//       await queryRunner.manager.save(shipment);

//       await queryRunner.commitTransaction();

//       const resp = new Response();
//       resp.success = true;
//       resp.message = 'Full shipment created successfully';
//       resp.result = {
//         shipment_id: savedShipment.id,
//         tracking_number: savedShipment.tracking_number,
//         pickup_location: savedShipment.pickup_location,
//         parcel_type: savedShipment.parcel_type,
//         // dropoff_locations: data.dropoff_locations,
//         parcels: savedParcels.map((parcel) => ({
//           parcel_id: parcel.parcel_id,
//           dropoff_location: parcel.dropoff_location,
//           size: parcel.package_size,
//           length:parcel.length,
//           width:parcel.width,
//           height:parcel.height,
//           weight: parcel.weight,
          
          

//         })),
//         total_cod_amount: totalCodAmount,
//         request_date: requestDate,
//         createdOn: savedShipment.createdOn,
//         updatedOn: savedShipment.updatedOn,
//       };
//       resp.httpResponseCode = 200;
//       resp.customResponseCode = '200 OK';
//       return resp;

//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       const resp = new Response();
//       resp.success = false;
//       resp.message = 'Failed to create full shipment: ' + error.message;
//       resp.httpResponseCode = 400;
//       resp.customResponseCode = '400 Bad Request';
//       return resp;
//     } finally {
//       await queryRunner.release();
//     }
//   }

private async uploadParcelPhotos(
  parcelId: number,
  files: Express.Multer.File[],
  customerId: string,
  queryRunner: QueryRunner
): Promise<string[]> {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map(async (file) => {
    const Key = `uploads/${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: ObjectCannedACL.public_read, // Corrected to match AWS SDK casing
    };

    await this.s3Client.send(new PutObjectCommand(params));
    return `https://${this.configService.get<string>('S3_BUCKET_NAME')}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${Key}`;
  });

  const urls = await Promise.all(uploadPromises);
  const parcel = await queryRunner.manager.findOneOrFail(parcel_details, { where: { parcel_id: parcelId } });
  parcel.parcel_photos = [...(parcel.parcel_photos || []), ...urls];
  parcel.updatedBy = customerId ;
  parcel.updatedOn = new Date();
  await queryRunner.manager.save(parcel);
  return urls;
}

// async createFullShipmentUpdated(data: CreateFullShipmentDTO, files: Express.Multer.File[], customerId: string): Promise<Response> {
//   const queryRunner = this.dataSource.createQueryRunner();
//   await queryRunner.connect();
//   await queryRunner.startTransaction();

//   try {

// const rawCustomerId = (data.customerId || "").toString().trim();
// const cleanedCustomerId = rawCustomerId.replace(/['"]+/g, ""); // remove quotes
// const numericCustomerId = parseInt(cleanedCustomerId, 10);

// console.log({
//   raw: data.customerId,
//   afterTrim: rawCustomerId,
//   afterClean: cleanedCustomerId,
//   parsed: numericCustomerId,
// });

    
//     const customer = await queryRunner.manager.findOne(Customer, {
//       where: { id: numericCustomerId },
//       relations: ['company'],
//     });
// if (!customer) {
//       throw new BadRequestException(`Customer with ID ${numericCustomerId} not found`);
//     }

//     const requestDate = data.request_date ? new Date(data.request_date) : new Date();
//     if (isNaN(requestDate.getTime())) {
//       throw new BadRequestException('Invalid request_date provided');
//     }

//     // Create shipment
//     const shipment = queryRunner.manager.create(Shipment, {
//       pickup_location: data.pickup_location,
//       parcel_type: data.parcel_type,
//       shipment_status: 'pending',
//       payment_mode: 'prepaid',
//       payment_status: 'unpaid',
//       shipment_created_on: new Date(),
//       pickup_time: requestDate,
//       customer: { id: numericCustomerId },
//       createdOn: new Date(),
//       updatedOn: new Date(),
//       createdBy:  customerId ,
//       updatedBy: customerId ,
//       status: true,
    
//     });
//     console.log(customerId)
//     const savedShipment = await queryRunner.manager.save(shipment);

//     let totalCodAmount = 0;
//     const parcelEntities: parcel_details[] = [];
//     let fileIndex = 0;
//     const totalFiles = files.length;
//     const filesPerParcel = Math.floor(totalFiles / data.parcels.length) || 1;

//     for (const [index, p] of data.parcels.entries()) {
//       const startIdx = fileIndex;
//       const endIdx = Math.min(fileIndex + filesPerParcel, totalFiles);
//       const parcelFiles = files.slice(startIdx, endIdx);
//       fileIndex = endIdx;

//       const parcel = queryRunner.manager.create(parcel_details, {
//         shipments: savedShipment, // Set the relation to the saved Shipment entity
//         dropoff_location: p.dropoff_location,
//         description: p.description || '', // Handle undefined description
//         sender_name: p.sender_name,
//         sender_phone: p.sender_phone,
//         receiver_name: p.receiver_name,
//         receiver_phone: p.receiver_phone,
//         package_size: p.package_size,
//         weight: p.weight,
//         length: p.length,
//         height: p.height,
//         width: p.width || undefined, // Handle optional width
//         cod_amount: p.cod_amount || 0, // Handle optional cod_amount
//         createdBy: customerId ,
//         createdOn: new Date(),
//         updatedOn: new Date(),
//         updatedBy: customerId ,
//         status: true,
//       });

//       const savedParcel = await queryRunner.manager.save(parcel);

//       // if (parcelFiles.length > 0) {
//       //   const photoUrls = await this.uploadParcelPhotos(savedParcel.parcel_id, parcelFiles, customerId, queryRunner);
//       //   savedParcel.parcel_photos = photoUrls;
//       // }
//       parcel.parcel_photos=savedParcel.parcel_photos||[]
//       totalCodAmount += (p.cod_amount || 0);
//       parcelEntities.push(savedParcel);
//     }

//     const savedParcels = await queryRunner.manager.save(parcel_details, parcelEntities);
//     const trackingNumber = `SHIP-${savedShipment.id}-${Date.now()}`;

//     savedShipment.tracking_number = trackingNumber;
//     await queryRunner.manager.save(shipment);

//     await queryRunner.commitTransaction();

//     const resp = new Response();
//     resp.success = true;
//     resp.message = 'Full shipment created successfully';
//     resp.result = {
//       shipment_id: savedShipment.id,
//       tracking_number: savedShipment.tracking_number,
//       pickup_location: savedShipment.pickup_location,
//       parcel_type: savedShipment.parcel_type,
//       parcels: savedParcels.map((parcel) => ({
//         parcel_id: parcel.parcel_id,
//         dropoff_location: parcel.dropoff_location,
//         size: parcel.package_size,
//         length: parcel.length,
//         width: parcel.width,
//         height: parcel.height,
//         weight: parcel.weight,
//         parcel_photos: parcel.parcel_photos || [],
//       })),
//       total_cod_amount: totalCodAmount,
//       request_date: requestDate,
//       createdOn: savedShipment.createdOn,
//       updatedOn: savedShipment.updatedOn,
//     };
//     resp.httpResponseCode = 200;
//     resp.customResponseCode = '200 OK';
//     return resp;
//   } catch (error) {
//     await queryRunner.rollbackTransaction();
//     const resp = new Response();
//     resp.success = false;
//     resp.message = 'Failed to create full shipment: ' + error.message;
//     resp.httpResponseCode = 400;
//     resp.customResponseCode = '400 Bad Request';
//     return resp;
//   } finally {
//     await queryRunner.release();
//   }
// }
async createFullShipmentUpdated(
    data: CreateFullShipmentDTO 
   
  ): Promise<Response> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ✅ Clean customerId
      const numericCustomerId = parseInt(data.customerId.toString().trim(), 10);

      const customer = await queryRunner.manager.findOne(Customer, {
        where: { id: numericCustomerId },
        relations: ['company'],
      });

      if (!customer) {
        throw new BadRequestException(`Customer with ID ${numericCustomerId} not found`);
      }

      const requestDate = data.request_date ? new Date(data.request_date) : new Date();
      if (isNaN(requestDate.getTime())) {
        throw new BadRequestException('Invalid request_date provided');
      }

      // ✅ Create shipment
      const shipment = queryRunner.manager.create(Shipment, {
        pickup_location: data.pickup_location,
        parcel_type: data.parcel_type,
        shipment_status: 'pending',
        payment_mode: 'prepaid',
        payment_status: 'unpaid',
        shipment_created_on: new Date(),
        pickup_time: requestDate,
        customer: { id: numericCustomerId },
        createdOn: new Date(),
        updatedOn: new Date(),
        createdBy: data.customerId.toString(),
        updatedBy: data.customerId.toString(),
        status: true,
      });

      const savedShipment = await queryRunner.manager.save(shipment);

      let totalCodAmount = 0;
      const parcelEntities: parcel_details[] = [];

      for (const p of data.parcels) {
        const parcel = queryRunner.manager.create(parcel_details, {
          shipments: savedShipment,
          dropoff_location: p.dropoff_location,
          description: p.description || '',
          sender_name: p.sender_name,
          sender_phone: p.sender_phone,
          receiver_name: p.receiver_name,
          receiver_phone: p.receiver_phone,
          package_size: p.package_size,
          weight: p.weight,
          length: p.length,
          height: p.height,
          width: p.width || undefined,
          cod_amount: p.cod_amount || 0,
          parcel_photos: p.parcel_photos || [], // 👈 Directly save URLs
          createdBy: data.customerId.toString(),
          createdOn: new Date(),
          updatedOn: new Date(),
          updatedBy: data.customerId.toString(),
          status: true,
        });

        const savedParcel = await queryRunner.manager.save(parcel);

        totalCodAmount += p.cod_amount || 0;
        parcelEntities.push(savedParcel);
      }

      const savedParcels = await queryRunner.manager.save(parcel_details, parcelEntities);

      // ✅ Add tracking number
      const trackingNumber = `SHIP-${savedShipment.id}-${Date.now()}`;
      savedShipment.tracking_number = trackingNumber;
      await queryRunner.manager.save(shipment);

      await queryRunner.commitTransaction();

      const resp = new Response();
      resp.success = true;
      resp.message = 'Full shipment created successfully';
      resp.result = {
        shipment_id: savedShipment.id,
        tracking_number: savedShipment.tracking_number,
        pickup_location: savedShipment.pickup_location,
        parcel_type: savedShipment.parcel_type,
        parcels: savedParcels.map((parcel) => ({
          parcel_id: parcel.parcel_id,
          dropoff_location: parcel.dropoff_location,
          size: parcel.package_size,
          length: parcel.length,
          width: parcel.width,
          height: parcel.height,
          weight: parcel.weight,
          parcel_photos: parcel.parcel_photos || [], // 👈 return URLs
        })),
         
        total_cod_amount: totalCodAmount,
        request_date: requestDate,
        createdOn: savedShipment.createdOn,
        updatedOn: savedShipment.updatedOn,
      };
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      return resp;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const resp = new Response();
      resp.success = false;
      resp.message = 'Failed to create full shipment: ' + error.message;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 Bad Request';
      return resp;
    } finally {
      await queryRunner.release();
    }
  }
async createFullShipment(
  data: CreateFullShipmentDTO,
  files: Express.Multer.File[],
  customerId: string
): Promise<Response> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // ✅ customerId sanitize + validate
    const rawCustomerId = (data.customerId || "").toString().trim();
    const cleanedCustomerId = rawCustomerId.replace(/['"]+/g, "");
    const numericCustomerId = parseInt(cleanedCustomerId, 10);

    if (isNaN(numericCustomerId)) {
      throw new BadRequestException("Invalid customerId provided");
    }

    // ✅ Customer check
    const customer = await queryRunner.manager.findOne(Customer, {
      where: { id: numericCustomerId },
      relations: ["company"],
    });
    if (!customer) {
      throw new BadRequestException(`Customer with ID ${numericCustomerId} not found`);
    }

    // ✅ Request date
    const requestDate = data.request_date ? new Date(data.request_date) : new Date();
    if (isNaN(requestDate.getTime())) {
      throw new BadRequestException("Invalid request_date provided");
    }

    // ✅ Shipment create
    const shipment = queryRunner.manager.create(Shipment, {
      pickup_location: data.pickup_location,
      parcel_type: data.parcel_type,
      shipment_status: "pending",
      payment_mode: "prepaid",
      payment_status: data.payment_status || "unpaid",
      shipment_created_on: new Date(),
      pickup_time: requestDate,
      customer: { id: numericCustomerId },
      createdOn: new Date(),
      updatedOn: new Date(),
      createdBy: customerId,
      updatedBy: customerId,
      status: true,
    });
    const savedShipment = await queryRunner.manager.save(shipment);

    let totalCodAmount = 0;
    const parcelEntities: parcel_details[] = [];

    // ✅ Har parcel ko uski files assign karna
    for (const [index, p] of data.parcels.entries()) {
      const parcel = queryRunner.manager.create(parcel_details, {
        shipments: savedShipment,
        dropoff_location: p.dropoff_location,
        description: p.description || "",
        sender_name: p.sender_name,
        sender_phone: p.sender_phone,
        receiver_name: p.receiver_name,
        receiver_phone: p.receiver_phone,
        package_size: p.package_size,
        weight: p.weight,
        length: p.length,
        height: p.height,
        width: p.width,
        cod_amount: p.cod_amount || 0,
        createdBy: customerId,
        createdOn: new Date(),
        updatedOn: new Date(),
        updatedBy: customerId,
        status: true,
      });

      const savedParcel = await queryRunner.manager.save(parcel);

      // ✅ Parcel ke photos find karo by originalname match
      const parcelFiles = files.filter((f) =>
        (p.parcel_photos || []).includes(f.originalname)
      );

      if (parcelFiles.length > 0) {
        const photoUrls = await this.uploadParcelPhotos(
          savedParcel.parcel_id,
          parcelFiles,
          customerId,
          queryRunner
        );
        savedParcel.parcel_photos = photoUrls;
        await queryRunner.manager.save(savedParcel);
      }

      totalCodAmount += p.cod_amount || 0;
      parcelEntities.push(savedParcel);
    }

    // ✅ Tracking number assign
    const trackingNumber = `SHIP-${savedShipment.id}-${Date.now()}`;
    savedShipment.tracking_number = trackingNumber;
    await queryRunner.manager.save(savedShipment);

    await queryRunner.commitTransaction();

    // ✅ Response
    const resp = new Response();
    resp.success = true;
    resp.message = "Full shipment created successfully";
    resp.result = {
      shipment_id: savedShipment.id,
      tracking_number: savedShipment.tracking_number,
      pickup_location: savedShipment.pickup_location,
      parcel_type: savedShipment.parcel_type,
      parcels: parcelEntities.map((parcel) => ({
        parcel_id: parcel.parcel_id,
        dropoff_location: parcel.dropoff_location,
        size: parcel.package_size,
        length: parcel.length,
        width: parcel.width,
        height: parcel.height,
        weight: parcel.weight,
        parcel_photos: parcel.parcel_photos || [],
      })),
      total_cod_amount: totalCodAmount,
      request_date: requestDate,
      createdOn: savedShipment.createdOn,
      updatedOn: savedShipment.updatedOn,
    };
    resp.httpResponseCode = 200;
    resp.customResponseCode = "200 OK";
    return resp;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    const resp = new Response();
    resp.success = false;
    resp.message = "Failed to create full shipment: " + error.message;
    resp.httpResponseCode = 400;
    resp.customResponseCode = "400 Bad Request";
    return resp;
  } finally {
    await queryRunner.release();
  }
}






async getCourierOptions(data: CreateFullShipmentDTO): Promise<Response> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    if (!data.parcels || data.parcels.length === 0) {
      throw new BadRequestException('At least one parcel is required');
    }

    const parcel = data.parcels[0];  
    const packageSize = parcel.package_size;
    if (!['small', 'medium', 'large','custom'].includes(packageSize)) {
      throw new BadRequestException('Invalid package size');
    }

     const companies = await queryRunner.manager
      .createQueryBuilder(courier_company, 'company')
      .leftJoinAndSelect('company.company_conveyance_details', 'conveyance')
      .leftJoinAndSelect('conveyance.pricing', 'pricing')
      .where('conveyance.conveyance_types = :type', { type: 'bike' })
      .andWhere('conveyance.is_active = :active', { active: true })
      .andWhere('company.status = :status', { status: true })
      .andWhere('company.registeration_status=:registeration_status',{registeration_status:'Active'})
      .andWhere('pricing.is_active = :pricingActive', { pricingActive: true })
      .getMany();

    if (!companies.length) {
      throw new BadRequestException('No courier companies with bike conveyance found');
    }

    const courierOptions = await Promise.all(companies.map(async (company) => {
      const conveyance = company.company_conveyance_details.find(c => c.conveyance_types === 'bike');
      if (!conveyance || !conveyance.pricing) return null;

      // Match pricing by package_size (not dimensions for now)
      const pricing = conveyance.pricing.find(p => p.size === packageSize && p.is_active === true);
      if (!pricing) return null;

      const baseFare = pricing.baseFare;
      const platformFee = baseFare * 0.1; // 10% platform fee
      const pnsCommission = baseFare * 0.05; // 5% PNS commission
      const vat = (baseFare + platformFee + pnsCommission) * 0.05; // 5% VAT
      const total = baseFare + platformFee + pnsCommission + vat;

      // Get average rating
      const ratings = await this.ratingRepository
        .createQueryBuilder('rating')
        .select('AVG(rating.stars)', 'avgRating')
        .where('rating.company_id = :companyId', { companyId: company.company_id })
        .getRawOne();
      const avgRating = ratings.avgRating ? Number(ratings.avgRating).toFixed(1) : '0.0';

      const estimatedDeliveryTime = '30 Mins';

      return {
        company_id:company.company_id,
        logo: company.logo || '',
        name: company.company_name,
        rating: Number(avgRating),
        estimated_delivery_time: estimatedDeliveryTime,
        price: `${total.toFixed(2)}`,
        payment_details: {
          standard_delivery_fees: `${baseFare.toFixed(2)} `,
          subtotal: `${baseFare.toFixed(2)} `,
          platform_fee: `${platformFee.toFixed(2)}`,
          pns_commission_5: `${pnsCommission.toFixed(2)}`,
          vat_5_percent: `${vat.toFixed(2)}`,
          total: `${total.toFixed(2)}`,
        },
      };
    }));

    const validOptions = courierOptions.filter(option => option !== null);
    if (!validOptions.length) {
      throw new BadRequestException('No valid pricing options available for the selected package size');
    }

    const resp = new Response();
    resp.success = true;
    resp.message = 'Courier options retrieved successfully';
    resp.result = { companies: validOptions };
    resp.httpResponseCode = 200;
    resp.customResponseCode = '200 OK';
    return resp;

  } catch (error) {
    const resp = new Response();
    resp.success = false;
    resp.message = 'Failed to retrieve courier options: ' + error.message;
    resp.httpResponseCode = 400;
    resp.customResponseCode = '400 Bad Request';
    return resp;
  } finally {
    await queryRunner.release();
  }
}

//   async createShipmentRequest(customerId: number, data: ShipmentRequestDTO): Promise<Response> {
//     const resp= new Response();

//     try {
//       const customer = await this.customerRepository.findOne({ where: { id: customerId }, relations: ['company'] });
//       if (!customer) throw new BadRequestException('Customer not found');

//       const requestDate = new Date(data.request_date);
//       if (isNaN(requestDate.getTime())) throw new BadRequestException('Invalid request_date provided');

//       const shipmentRequest = this.shipmentRequestRepository.create({
//         // customer,
//         pickup_location: data.pickup_location,
//         dropoff_location: data.dropoff_location,
//         parcel_type: data.parcel_type,
//         package_size: data.package_size,
//         parcel_photos:data.parcel_photos,
//         weight: data.weight,
//         length: data.length,
//         height: data.height,
//         base_price: data.base_price,
//         pickup_time_slot: data.pickup_time_slot,
//         payment_status: data.payment_status || 'unpaid',
//         sender_name: data.sender_name,
//         receiver_name: data.receiver_name,
//         receiver_phone: data.receiver_phone,
//         // sender_phone: data.se,
//         special_instruction: data.special_instruction,
//         shipment_status: data.shipment_status || 'pending',
//         request_date: requestDate,
//         createdBy: data.created_by || 'system',
//         updatedBy: data.updated_by || 'system',
//         createdOn: data.created_on ? new Date(data.created_on) : new Date(),
//         updatedOn: data.updated_on ? new Date(data.updated_on) : new Date(),
//         status: data.is_active !== undefined ? data.is_active : true,
//         rider: data.rider || null,
//         company: customer.company || null,
//       });

//       const savedRequests: shipment_request[] = await this.shipmentRequestRepository.save([shipmentRequest]);
//       const savedRequest: shipment_request = savedRequests[0];

//       const shipment = this.shipmentRepository.create({
//   tracking_number: `SHIP-${savedRequest.request_id}-${Date.now()}`,
//   request: { request_id: savedRequest.request_id } as any, // ✅ correct relation name
//   customer: { user_id: customerId } as any, // ✅ entity field is `user_id` not `id`
//   pickup_time: requestDate,
//   delivery_time: new Date(data.request_date),
//   tracking_status: 'awaiting_pickup', // ✅ replace delivery_status
//   // cod_amount: 0,
//   parcel_type: savedRequest.parcel_type,
//   sender_name: savedRequest.sender_name,
//   receiver_name: savedRequest.receiver_name,
//   receiver_phone: savedRequest.receiver_phone,
//   payment_mode: 'regular',
//   delivered_on: new Date(data.request_date),
//   job_status: 'pending',
//   parcel_details: savedRequest.special_instruction || '',
//   rider: data.rider ? { rider_id: data.rider.id } as any : null,
//   courierCompany: savedRequest.company ? { company_id: savedRequest.company.company_id } as any : null,
//   createdBy: 'system',
//   updatedBy: 'system',
//   status: true,
// });

 

//       await this.shipmentRepository.save(shipment);

//       resp.success = true;
//       resp.message = 'Shipment request created successfully';
//       resp.result = {
//         request_id: savedRequest.request_id,
//         pickup_location: savedRequest.pickup_location,
//         dropoff_location: savedRequest.dropoff_location,
//         parcel_type: savedRequest.parcel_type,
//         package_size: savedRequest.package_size,
//         weight: savedRequest.weight,
//         length: savedRequest.length,
//         height: savedRequest.height,
//         base_price: savedRequest.base_price,
//         shipment_status: savedRequest.shipment_status,
//         request_date: savedRequest.request_date,
//         createdOn: savedRequest.createdOn,
//         updatedOn: savedRequest.updatedOn,
//         createdBy: savedRequest.createdBy,
//         updatedBy: savedRequest.updatedBy,
//       };
//       resp.httpResponseCode = 200;
//       resp.customResponseCode = '200 OK';
//       return resp;
//     } catch (error) {
//       resp.success = false;
//       resp.message = 'Failed to create shipment request: ' + error.message;
//       resp.httpResponseCode = 400;
//       resp.customResponseCode = '400 Bad Request';
//       return resp;
//     }
//   }

 

 

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    return bcrypt.hash(password, salt); // Hash the password
  }

  async createCustomerUser(data: customer_signup_dto): Promise<Response> {
    const resp= new Response();
    try {
      if (!data.email_address || !data.password) {
        throw new Error('Email and password are required');
      }

      let customer: Customer | null = null;

      

      if (data.customer_id) {
        customer = await this.customerRepository.findOne({ where: { id: data.customer_id  } });
      } else if (data.email_address) {
        customer = await this.customerRepository.findOne({ where: { email: data.email_address } });
      }

      if (customer) {
        // Update existing record
        if (data.password) {
          // Hash the password if provided
          data.password = await this.hashPassword(data.password);
        }

        // Update existing record with mapped fields
        customer = this.customerRepository.merge(customer, {
          firstname: data.first_name,
          lastname: data.last_name,
          email: data.email_address,
          password: data.password,
          user_type: data.user_type,
          phone_number: data.phone_number || customer.phone_number,
          createdBy: data.createdBy,
          createdOn: data.createdOn,
          updatedOn: new Date(),
          updatedBy: data.updatedBy,          
          is_email_verified:data.is_email_verified,
          
          status:true
        });
        await this.customerRepository.save(customer);
        resp.message = 'Customer user updated successfully';
      } else {
        // Insert new record
        const hashedPassword = await this.hashPassword(data.password);

        const newCustomer = this.customerRepository.create({
          firstname: data.first_name,
          lastname: data.last_name,
          email: data.email_address,
          password: hashedPassword,
          user_type: data.user_type,
          phone_number: data.phone_number,
          createdBy: data.createdBy,
          createdOn: data.createdOn || new Date(),
          updatedBy: data.updatedBy,
          updatedOn: new Date(),
          is_email_verified:data.is_email_verified,
          status:true,
      


          
        });
        customer = await this.customerRepository.save(newCustomer);
        resp.message = 'Customer user inserted successfully';
      }

      resp.success = true;
      resp.result = customer;
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

  async findByEmail(email: string): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { email } });
  }

  async validateCustomerUser(email: string, password: string): Promise<any> {
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


async getAllShipments({
    customer_id,
    page = 1,
    limit = 10,
    status,
    search,
  }: GetAllShipmentsCustomerDto) {
    try {
       const query = this.shipmentRepository
        .createQueryBuilder('shipment')
         .leftJoinAndSelect('shipment.customer', 'customer')
         .leftJoinAndSelect('shipment.parcels','parcels')
         .leftJoinAndSelect('shipment.rider', 'rider')
        .leftJoinAndSelect('shipment.courierCompany', 'company')
         .where('shipment.customer_id = :customerId', { customerId: customer_id });

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



// async getAddresses({ customer_id, page = 1, limit = 10 }: GetAddressesDto) {
//     try {
//       const query = this.addressRepository
//         .createQueryBuilder('address')
//         .where('address.customer_id = :customerId', { customerId: customer_id });

//       query.skip((page - 1) * limit).take(limit);

//       const [data, total] = await query.getManyAndCount();

//       return {
//         success: true,
//         message: 'Addresses fetched successfully',
//         data: {
//           addresses: data,
//           pagination: {
//             total,
//             currentPage: page,
//             totalPages: Math.ceil(total / limit),
//             limit,
//           },
//         },
//       };
//     } catch (error) {
//       console.error('Error fetching addresses:', error);
//       return {
//         success: false,
//         message: 'Failed to fetch addresses',
//         error: error.message,
//       };
//     }
//   }
async addAddress(data: any): Promise<CustomerAddresses> {
    const customer = await this.customerRepository.findOne({
      where: { id: data.customer_id },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const address = this.addressRepository.create({
      customer: customer,
      street: data.street,
      city: data.city,
      country: data.country,
      building_name: data.building_name,
      apartment: data.apartment,
      makani_number: data.makani_number,
      nearest_landmark: data.nearest_landmark,
      address_type: data.address_type,
      area:data.area,
      is_default: data.is_default || false,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      status: true, // Ensure new address is active
    });

    return this.addressRepository.save(address);
  }

  async getAddresses({ customer_id, page = 1, limit = 10 }: GetAddressesDto) {
    try {
      const query = this.addressRepository
        .createQueryBuilder('address')
        .where('address.customer_id = :customerId', { customerId: customer_id })
        .andWhere('address.status = :status', { status: true }); // Fetch only active addresses

      query.skip((page - 1) * limit).take(limit);

      const [data, total] = await query.getManyAndCount();

      return {
        success: true,
        message: 'Addresses fetched successfully',
        data: {
          addresses: data,
          pagination: {
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            limit,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return {
        success: false,
        message: 'Failed to fetch addresses',
        error: error.message,
      };
    }
  }
async getAddressDetail(data: { address_id: number; customer_id: number }) {
  const address = await this.addressRepository.findOne({
    where: {
      id: data.address_id,
      customer: { id: data.customer_id }
    },
    relations: ['customer'],
  });

  if (!address) throw new NotFoundException('Address not found');

  return {
    httpResponseCode: 200,
    customResponseCode: 'ADDRESS_DETAIL_FETCHED',
    success: true,
    message: 'Address detail fetched successfully',
    data: address,
  };
}

  async editAddress(customerId: number, addressId: number, data: any): Promise<CustomerAddresses> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const address = await this.addressRepository.findOne({
      where: { id: addressId, customer: { id: customerId }, status: true },
    });

    if (!address) throw new NotFoundException('Address not found');

    this.addressRepository.merge(address, {
      street: data.street,
      city: data.city,
      country: data.country,
      building_name: data.building_name,
      apartment: data.apartment,
      makani_number: data.makani_number,
      nearest_landmark: data.nearest_landmark,
      address_type: data.address_type,
      area:data.area,
      is_default: data.is_default || address.is_default,
      updatedBy: data.updatedBy,
      updatedOn: new Date(),
    });

    return this.addressRepository.save(address);
  }

  async deleteAddress(customerId: number, addressId: number): Promise<CustomerAddresses> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const address = await this.addressRepository.findOne({
      where: { id: addressId, customer: { id: customerId }, status: true },
    });

    if (!address) throw new NotFoundException('Address not found');

    address.status = false;
    address.updatedOn = new Date();

    return this.addressRepository.save(address);
  }



async createRating(createRatingDto: CreateRatingDto): Promise<Response> {
    try {
      // Validate foreign keys
      const shipment = await this.shipmentRepository.findOne({
        where: { id: createRatingDto.shipment_id, status: true },
      });
      if (!shipment) throw new NotFoundException('Shipment not found');

      const customer = await this.customerRepository.findOne({
        where: { id: createRatingDto.customer_id, status: true },
      });
      if (!customer) throw new NotFoundException('Customer not found');

      const rider = await this.riderRepository.findOne({
        where: { id: createRatingDto.rider_id, status: true },
      });
      if (!rider) throw new NotFoundException('Rider not found');

      const company = await this.courierCompanyRepository.findOne({
        where: { company_id: createRatingDto.company_id, status: true },
      });
      if (!company) throw new NotFoundException('Company not found');

      // Create new rating
      const rating = this.ratingRepository.create({
        stars: createRatingDto.stars,
        rider_behavior_score: createRatingDto.rider_behavior_score,
        on_time_delivery_score: createRatingDto.on_time_delivery_score,
        affordability_score: createRatingDto.affordability_score,
        review: createRatingDto.review,
        shipment: shipment,
        customer: customer,
        rider: rider,
        company: company,
        createdBy: createRatingDto.customer_id.toString(),  
        updatedBy: createRatingDto.customer_id.toString(), 
        status: true,
      });

      const savedRating = await this.ratingRepository.save(rating);
  await this.shipmentRepository.update(
      { id: shipment.id },
      { is_reviewed: true }
    );
      const resp = new Response();
      resp.success = true;
      resp.message = 'Rating submitted successfully';
      resp.result = { rating_id: savedRating.id };
      resp.httpResponseCode = 201;
      resp.customResponseCode = '201 Created';
      return resp;

    } catch (error) {
      const resp = new Response();
      resp.success = false;
      resp.message = `Failed to submit rating: ${error.message}`;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 Bad Request';
      return resp;
    }
  }



  async   processPayment(shipmentId: number, paymentDTO: PaymentDTO): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const shipment = await queryRunner.manager.findOneOrFail(Shipment, {
        where: { id: shipmentId },
        relations: ['parcels', 'courierCompany', 'cod_payment'],
      });

     
      const totalAmount = this.calculateTotalAmount(shipment);
      const paymentBreakdown = {
        base_price: shipment.parcels.reduce((sum, parcel) => sum + (parcel.cod_amount || 0), 0),
        cod_amount: shipment.payment_mode === 'cod' ? totalAmount : 0,
        total: totalAmount,
      };

      if (!paymentDTO.paymentMethod || !paymentDTO.nameOnCard) {
        throw new Error('Payment method and name on card are required');
      }

      // Mock payment gateway (replace with real integration)
      const paymentSuccess = await this.processPaymentGateway(paymentDTO, totalAmount);
      if (!paymentSuccess) {
        throw new Error('Payment gateway rejected the transaction');
      }
    const courierCompany = await queryRunner.manager.findOneOrFail(courier_company, {
      where: { company_id: paymentDTO.companyId },
    });
 

    shipment.courierCompany = courierCompany;
  
    shipment.shipment_status = 'pending';
    shipment.payment_status = 'paid';
    shipment.updatedOn = new Date();
    shipment.updatedBy = paymentDTO.customerId.toString();



    await queryRunner.manager.save(shipment);
      // Create payment transaction record
      const paymentTransaction = queryRunner.manager.create(PaymentTransaction, {
        shipment,
        paymentMethod: paymentDTO.paymentMethod,
        nameOnCard: paymentDTO.nameOnCard,
        cardTokenOrLast4: '****-1234', // Mocked; replace with gateway token
        amount: totalAmount,
        paymentStatus: 'success',
        transactionId: `TXN-${Date.now()}`, // Mocked; replace with gateway transaction ID
        createdBy: paymentDTO.customerId.toString(),
        updatedBy: paymentDTO.customerId.toString(),
      });
      await queryRunner.manager.save(paymentTransaction);

      // Update shipment
      shipment.payment_status = 'paid'; // Add payment_status column if not present
      shipment.updatedOn = new Date();
      shipment.updatedBy = paymentDTO.customerId.toString();
      await queryRunner.manager.save(shipment);

      // Update COD payment if applicable
      if (shipment.payment_mode === 'cod' && shipment.cod_payment) {
        shipment.cod_payment.payment_status = 'paid';
        shipment.cod_payment.collectedOn = new Date();
        shipment.cod_payment.updatedBy = paymentDTO.customerId.toString();
        shipment.cod_payment.updatedOn = new Date();
        await queryRunner.manager.save(shipment.cod_payment);
      }

      await queryRunner.commitTransaction();

      return {
        shipmentId: shipment.id,
        tracking_number: shipment.tracking_number,
        payment_status: shipment.payment_status,
        courier_company_id: shipment.courierCompany.company_id,
 
        payment_breakdown: paymentBreakdown,
        payment_method: paymentDTO.paymentMethod,
        transaction_id: paymentTransaction.transactionId,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private calculateTotalAmount(shipment: Shipment): number {
    return shipment.parcels.reduce((sum, parcel) => sum + (parcel.cod_amount || 0), 0);
  }

  private async processPaymentGateway(paymentDTO: PaymentDTO, amount: number): Promise<boolean> {
    // Replace with actual payment gateway integration (e.g., Stripe)
    return true; // Mock success
  }


private async uploadProfileImage(
    customerId: number,
    file: Express.Multer.File,
    queryRunner: QueryRunner,
  ): Promise<string> {
    if (!file) {
      return '';
    }

    const Key = `profile/${customerId}/${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key,
      Body: file.buffer,
      ContentType: file.mimetype,
     ACL: ObjectCannedACL.public_read,
    };

    await this.s3Client.send(new PutObjectCommand(params));
    return `https://${this.configService.get<string>('S3_BUCKET_NAME')}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${Key}`;
  }

  async updateCustomerProfile(data: UpdateCustomerProfileDto, customerId: string): Promise<Response> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
  const rawCustomerId = (data.customerId || "").toString().trim();
const cleanedCustomerId = rawCustomerId.replace(/['"]+/g, ""); // remove quotes
const numericCustomerId = parseInt(cleanedCustomerId, 10);

console.log({
  raw: data.customerId,
  afterTrim: rawCustomerId,
  afterClean: cleanedCustomerId,
  parsed: numericCustomerId,
});
      const customer = await queryRunner.manager.findOneOrFail(Customer, {
        where: { id: numericCustomerId },
      });
      if (!customer) {
        throw new BadRequestException(`Customer with ID ${numericCustomerId} not found`);
      }

      // Update customer fields
      const updatedCustomer = queryRunner.manager.merge(Customer, customer, {
        firstname: data.first_name || customer.firstname,
        lastname: data.last_name || customer.lastname,
        email: data.email_address || customer.email,
        phone_number: data.phone_number || customer.phone_number,
        user_type: data.user_type || customer.user_type,
        is_email_verified: data.is_email_verified ?? customer.is_email_verified,
        updatedOn: new Date(),
        updatedBy: customerId,
      });

      // Handle profile image upload
      if (data.files && data.files.length > 0) {
        if (data.files.length > 1) {
          throw new BadRequestException('Only one profile image is allowed');
        }
        const profileImageUrl = await this.uploadProfileImage(numericCustomerId, data.files[0], queryRunner);
        updatedCustomer.profile_image_url = profileImageUrl;
      }

      await queryRunner.manager.save(updatedCustomer);

      await queryRunner.commitTransaction();

      const resp = new Response();
      resp.success = true;
      resp.message = 'Customer profile updated successfully';
      resp.result = {
        id: updatedCustomer.id,
        firstname: updatedCustomer.firstname,
        lastname: updatedCustomer.lastname,
        email: updatedCustomer.email,
        phone_number: updatedCustomer.phone_number,
        user_type: updatedCustomer.user_type,
        is_email_verified: updatedCustomer.is_email_verified,
        profile_image_url: updatedCustomer.profile_image_url,
        createdOn: updatedCustomer.createdOn,
        updatedOn: updatedCustomer.updatedOn,
      };
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      return resp;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const resp = new Response();
      resp.success = false;
      resp.message = 'Failed to update customer profile: ' + error.message;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 Bad Request';
      return resp;
    } finally {
      await queryRunner.release();
    }
  }

}