import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { courier_company } from 'src/Models/courier_company.entity';
import { qr_sessions } from 'src/Models/qr_sessions.entity';
import { Between, MoreThan, Not, Repository } from 'typeorm';
import { CreateQrSessionDto } from 'src/ViewModel/create-qr-session.dto';
import { Response } from 'src/ViewModel/response';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { v4 as uuidv4 } from 'uuid';
import { Rider } from 'src/Models/rider.entity';
import { CompleteProfileDto } from 'src/ViewModel/scan-qr.dto';
import * as bcrypt from 'bcryptjs'; // ✅
import { Shipment } from 'src/Models/shipment.entity';
import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UpdateRiderProfileDto } from 'src/ViewModel/update_rider_profile_dto';
import { company_document } from 'src/Models/company_document.entity';
import { ShippingPaymentDto } from 'src/ViewModel/shipping_payment_dto';
import { shipping_payment } from 'src/Models/shipping_payment.entity';

@Injectable()
export class RiderService {
   private s3Client = new S3Client({
      region: process.env.AWS_REGION,
        credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
constructor(
   @InjectRepository(qr_sessions)
    private readonly qrSessionRepo: Repository<qr_sessions>,

    @InjectRepository(courier_company)
    private readonly companyRepository: Repository<courier_company>,

  @InjectRepository(company_document)
    private companyDocumentRepository: Repository<company_document>,

    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,


    @InjectRepository(Shipment)
    private readonly shipmentRepository:Repository<Shipment>,


    @InjectRepository(shipping_payment)
    private readonly shippingPaymentRepository: Repository<shipping_payment>,

) {
    
    
}
async createQrSession(dto: CreateQrSessionDto): Promise<Response> {
    const resp = new Response();
    try {
        const { companyId } = dto;
        
        // Check company exists
        const company = await this.companyRepository.findOne({
            where: { company_id: companyId },
        });

        if (!company) {
            throw new Error('Company not found');
        };
        
        // Assuming your Rider entity uses 'id' as the primary key column name
        // const rider = await this.riderRepository.findOne({
        //     where: { id: riderId },
        // });

        // if (!rider) {
        //     throw new Error('Rider not found');
        // }

        // Create a new session
        const newSession = this.qrSessionRepo.create({
            session_id: uuidv4().toString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 5 mins
            company: company, // assign courier_company relation
            company_name: dto.companyName,
            
            // rider: rider, // ✅ CORRECTED: Use 'rider' (the entity property)
            
            rider_name: dto.riderName,
            used: dto.used,
            created_at: new Date(),
            status: true,
            createdOn: new Date(),
            createdBy: dto.createdBy,
            updatedOn: new Date(),
        });

        const saved = await this.qrSessionRepo.save(newSession);

        resp.success = true;
        resp.message = 'QR Session created successfully';
        resp.result = saved;
        resp.httpResponseCode = 200;
        resp.customResponseCode = '200 OK';
        return resp;
    } catch (error) {
        resp.success = false;
        resp.message = 'Error creating QR Session: ' + error.message;
        resp.result = null;
        resp.httpResponseCode = 500;
        resp.customResponseCode = '500 INTERNAL SERVER ERROR';
        return resp;
    }
}
  async getRegistrationData(sessionId: string) {
    const resp=new Response();
    try {
    const session = await this.qrSessionRepo.findOne({
      where: { session_id: sessionId },
      relations: ['company'],
    });

    if (!session) return { success: false, error: 'Invalid or expired QR code' };
    if (session.used) return { success: false, error: 'This QR code has already been used' };


      resp.success= true,
      resp.result= {
        sessionId: session.session_id,
        companyId: session.company.company_id,
        companyName: session.company_name,
        riderName: session.rider_name,
        createdAt: session.created_at,
        expiresAt: session.expires_at,
      },
        resp.message='QR Session data retrieved successfully',
        resp.httpResponseCode=200,
        resp.customResponseCode='200 OK';
        return resp;
        } catch (error) {
      resp.success=false,
      resp.message='Error retrieving QR Session data: '+error.message,       
      resp.result=null,
      resp.httpResponseCode=500,
      resp.customResponseCode='500 INTERNAL SERVER ERROR';
        return resp;
    };
  }

async validateQrAndGetCompany(sessionId: string) {
    const session = await this.qrSessionRepo.findOne({
      where: { session_id: sessionId,  used: false },
      relations: ['company'],
    });

    if (!session) throw new BadRequestException('Invalid or expired QR code');

    return {
      success: true,
      company: {
        name: session.company_name,
        logo: session.company.logo,
        
      },
      Rider:{
        name:session.rider_name
      },
      sessionId: session.session_id,
    };
  }
async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    return bcrypt.hash(password, salt); // Hash the password
  }
  
  
  async findByEmail(email: string): Promise<Rider | null> {
    return this.riderRepository.findOne({ where: { email } });
  }

async validateRiderUser(email: string, password: string): Promise<any> {
  const user = await this.findByEmail(email);

  // 1️⃣ USER NOT FOUND
  if (!user || !user.password) {
    return {
      success: false,
      message: 'Invalid credentials',
      data: null,
    };
  }

  // 2️⃣ PASSWORD CHECK FIRST!
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return {
      success: false,
      message: 'Invalid credentials',
      data: null,
    };
  }

  // 3️⃣ ACCOUNT INACTIVE
  if (user.status === false) {
    return {
      success: false,
      message: 'Your account is inactive. Please contact support.',
      data: null,
    };
  }

  // 4️⃣ PROFILE NOT APPROVED
  if (user.profile_status !== 'active') {
    return {
      success: false,
      message: 'Your profile is not approved yet. Please contact support.',
      data: null,
    };
  }

  // 5️⃣ SUCCESS
  const { password: pw, ...cleanUser } = user;

  return {
    success: true,
    message: "Login successful",
    data: cleanUser,
  };
}


//     async uploadDocumentToS3(file: Express.Multer.File): Promise<string> {
//   if (!file) throw new BadRequestException('No file provided');

//   const Key = `rider-documents/${Date.now()}-${file.originalname}`;

//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: 'public-read' as ObjectCannedACL,
//   };

//   await this.s3Client.send(new PutObjectCommand(params));

//   return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
// }

//   // Step 2: Final submission
//   async completeSelfRegistration(dto: CompleteProfileDto) {
//   // 1. Validate active QR session (not used + not expired)
//   const session = await this.qrSessionRepo.findOne({
//     where: {
//       session_id: dto.sessionId,
//       used: false,
//       expires_at: MoreThan(new Date()),
//     },
//     relations: ['company'],
//   });

//   if (!session) {
//     throw new BadRequestException('Session expired or invalid');
//   }

//   // 2. Prevent duplicate registration (email or phone)
//   const exists = await this.riderRepository.findOne({
//     where: [{ email: dto.email }, { phone_number: dto.phone }],
//   });

//   if (exists) {
//     throw new BadRequestException('This rider already exists');
//   }

//   // 3. Hash password
//   dto.password = await this.hashPassword(dto.password);

//   // 4. Create Rider object (FIXED TYPES)
//   const rider = this.riderRepository.create({
//     rider_name: dto.name,
//     email: dto.email,
//     password: dto.password,
//     phone_number: dto.phone,
//     rider_code: 'PNS' + Date.now().toString().slice(-6),

//     vehicle_type: dto.vehicleType,
//     vehicle_brand: dto.vehicle_brand,
//     registration_year: Number(dto.registeration_year), // FIXED TYPE

//     licence_number: dto.licenseNumber,
//     registration_number: dto.registrationNumber,

//     // Required fields stored separately
//     // driving_licence_document_url: dto.driving_licence_document_url,
//     // vehicle_registeration_document: dto.vehicle_registeration_document,
//     // emirates_id_front: dto.emirates_id_front,
//     // emirates_id_back: dto.emirates_id_back,

//     // Also stored inside a JSON object
//     documents: JSON.stringify({
//       driving_license_document_url: dto.driving_license_document_url,
//       vehicle_registeration_document: dto.vehicle_registeration_document,
//       emirates_id_front: dto.emirates_id_front,
//       emirates_id_back: dto.emirates_id_back,
//     }),

//     company: session.company,

//     availability_status: true,
//     is_available: true,

//     is_number_verified: Boolean(dto.is_number_verified), // FIXED TYPE

//     profile_status: 'pending', // or 'pending' based on your logic
//     status: false, // rider must be approved manually?

//     registration_datetime: new Date(),
//   });

//   // 5. Save rider
//   const saved = await this.riderRepository.save(rider);

//   // 6. Mark QR Session as used
//   session.used = true;
//   await this.qrSessionRepo.save(session);

//   // 7. Response
//   return {
//     success: true,
//     message: 'Registration completed successfully!',
//     rider: {
//       id: saved.id,
//       name: saved.rider_name,
//       code: saved.rider_code,
//       profile_status: saved.profile_status,
//       status: saved.status,
//     },
//   };
// }


async completeSelfRegistration(
  dto: CompleteProfileDto,
  files: Record<string, Express.Multer.File[]>
) {
  // Prepare object
  let documentUrls: {
  driving_license_document_url: string | null;
  vehicle_registeration_document: string | null;
  emirates_id_front: string | null;
  emirates_id_back: string | null;
} = {
  driving_license_document_url: null,
  vehicle_registeration_document: null,
  emirates_id_front: null,
  emirates_id_back: null,
};


  if (files.driving_license) {
    documentUrls.driving_license_document_url =
      await this.uploadDocumentToS3(files.driving_license[0]);
  }

  if (files.vehicle_registration) {
    documentUrls.vehicle_registeration_document =
      await this.uploadDocumentToS3(files.vehicle_registration[0]);
  }

  if (files.emirates_id_front) {
    documentUrls.emirates_id_front =
      await this.uploadDocumentToS3(files.emirates_id_front[0]);
  }

  if (files.emirates_id_back) {
    documentUrls.emirates_id_back =
      await this.uploadDocumentToS3(files.emirates_id_back[0]);
  }
  const session = await this.qrSessionRepo.findOne({
    where: {
      session_id: dto.sessionId,
      used: false,
      expires_at: MoreThan(new Date()),
    },
    relations: ['company'],
  });

  if (!session) {
    throw new BadRequestException('Session expired or invalid');
  }

  // 2. Prevent duplicate registration (email or phone)
  const exists = await this.riderRepository.findOne({
    where: [{ email: dto.email }, { phone_number: dto.phone }],
  });

  if (exists) {
    throw new BadRequestException('This rider already exists');
  }

  // 3. Hash password
  dto.password = await this.hashPassword(dto.password);

  // Save rider with JSON
  const rider = this.riderRepository.create({
    // ... rest of fields
        rider_name: dto.name,
    email: dto.email,
    password: dto.password,
    phone_number: dto.phone,
    rider_code: 'PNS' + Date.now().toString().slice(-6),

    vehicle_type: dto.vehicleType,
    vehicle_brand: dto.vehicle_brand,
    registration_year: Number(dto.registeration_year), // FIXED TYPE

    licence_number: dto.licenseNumber,
    registration_number: dto.registrationNumber,

     
    

    company: session.company,

    availability_status: true,
    is_available: true,

    is_number_verified: Boolean(dto.is_number_verified), // FIXED TYPE

    profile_status: 'pending', // or 'pending' based on your logic
    status: false, // rider must be approved manually?

    registration_datetime: new Date(),

    documents: JSON.stringify(documentUrls),
  });

  const saved = await this.riderRepository.save(rider);

  return {
    success: true,
    message: 'Registration completed successfully',
    rider: saved,
  };
}

async uploadDocumentToS3(file: Express.Multer.File): Promise<string> {
  if (!file) throw new BadRequestException('No file provided');

  const Key = `rider-documents/${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read' as ObjectCannedACL,
  };

  await this.s3Client.send(new PutObjectCommand(params));

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
}



async approveRider(riderId: number) {
  // 1. Fetch rider
  const rider = await this.riderRepository.findOne({
    where: { id: riderId },
  });

  if (!rider) {
    return {
      success: false,
      message: "Rider not found",
    };
  }

  // 2. Update status fields
  rider.profile_status = 'active';   // previously 'pending'
  rider.status = true;               // rider is now approved
  rider.updatedOn = new Date();
  rider.updatedBy = 'system';        // or admin name if needed

  // 3. Save
  await this.riderRepository.save(rider);

  return {
    success: true,
    message: "Rider approved successfully",
    data: {
      riderId: rider.id,
      profile_status: rider.profile_status,
      status: rider.status
    }
  };
}


async updateRiderStatus(riderId: number, profile_status: string) {
  // 1. Fetch rider
  const rider = await this.riderRepository.findOne({
    where: { id: riderId },
  });

  if (!rider) {
    return {
      success: false,
      message: "Rider not found",
    };
  }

  // 2. Validate profile_status
  const allowedStatuses = ["active", "pending", "declined", "blocked"];
  if (!allowedStatuses.includes(profile_status)) {
    return {
      success: false,
      message: "Invalid profile_status value",
    };
  }

  // 3. If status is blocked → check job assigned
  if (profile_status === "blocked") {
    if (rider.is_job_assigned === true) {
      return {
        success: false,
        message: "A job is currently assigned to this rider. You cannot block this rider.",
      };
    }
  }

  // 4. Update fields
  rider.profile_status = profile_status;
  rider.updatedOn = new Date();
  rider.updatedBy = "admin/system";
  
  // status field: true for active, false for others
  rider.status = profile_status === "active";
  rider.is_available = profile_status === "active";
  rider.availability_status = profile_status === "active";

  // 5. Save changes
  await this.riderRepository.save(rider);

  return {
    success: true,
    message: `Rider status updated to ${profile_status}`,
    data: {
      riderId: rider.id,
      profile_status: rider.profile_status,
      status: rider.status,
    },
  };
}

 
  async sendOtp(phone: string) {
    await this.twilioService.sendOtp(phone);
    return { success: true, message: 'OTP sent' };
  }

// rider.service.ts
async verifyOtp(dto: { phone: string; code: string }) {
  const isValid = await this.twilioService.verifyOtp(dto.phone, dto.code);
  if (!isValid) throw new BadRequestException('Invalid or expired OTP');
  return { success: true, message: 'OTP verified' };
}

// Inside RiderService class
private twilioService = {
  verifyOtp: async (phone: string, code: string) => code === '123456',
  sendOtp: async (phone: string) => console.log('Mock OTP sent to', phone),
};






// async acceptJob(jobId: number, riderId: number): Promise<any> {
//   const job = await this..findOne({
//     where: { id: jobId, rider: { id: riderId }, status: 'assigned' },
//   });

//   if (!job) throw new BadRequestException('Job not found or already accepted');

//   job.status = 'accepted';
//   job.accepted_at = new Date();
//   await this.jobRepo.save(job);

//   await this.riderRepo.update(riderId, { is_job_assigned: true });

//   return { success: true, message: 'Job accepted!' };
// }


async getRiderShipments(riderId: number, body: any) {
  const { date, status, paymentMode } = body;

  const whereConditions: any = {
    rider: { id: riderId }
  };

  if (status) whereConditions.shipment_status = status;

  if (paymentMode) whereConditions.payment_mode = paymentMode; // 👈 NEW FILTER

  if (date) {
    const start = new Date(date + " 00:00:00");
    const end = new Date(date + " 23:59:59");
    whereConditions.pickup_time = Between(start, end);
  }

  const shipments = await this.shipmentRepository.find({
    where: whereConditions,
    relations: ['parcels'],
    order: { pickup_time: 'DESC' }
  });

  const formatted = shipments.map((s) => {
    const firstParcel = s.parcels?.[0];

    return {
      shipment_id: s.id,
      tracking_number: s.tracking_number,
      pickup_location: s.pickup_location,
      dropoff_location: firstParcel?.dropoff_location || null,
      start_time: s.pickup_time,
      end_time: "",
      status: s.shipment_status,
      payment_mode: s.payment_mode   // 👈 Include in response if needed
    };
  });

  return {
    success: true,
    shipments: formatted
  };
}



async getTodayDeliveries(riderId: number, date: string) {
  let start = new Date();
  let end = new Date();

  if (date) {
    start = new Date(date + " 00:00:00");
    end = new Date(date + " 23:59:59");
  }

  const count = await this.shipmentRepository.count({
    where: {
      rider: { id: riderId },
      pickup_time: Between(start, end)
    }
  });

  return {
    success: true,
    deliveries: count
  };
}


async getEarningsSummary(riderId: number, date: string) {
const shipments = await this.getShipmentsByDate(riderId, { date });

  let codAmount = 0;
  let prepaidAmount = 0;

  shipments.forEach(s => {
    const parcel = s.parcels?.[0];
    if (s.payment_mode === 'cod') codAmount += parcel?.cod_amount || 0;
    if (s.payment_mode === 'prepaid') prepaidAmount += parcel?.cod_amount || 0;
  });

  return {
    success: true,
    summary: {
      totalAmount: codAmount + prepaidAmount,
      codAmount,
      prepaidAmount
    }
  };
}



async getCodShipments(riderId: number, date: string) {
const shipments = await this.getShipmentsByDate(riderId, { date });

  const codShipments = shipments
    .filter(s => s.payment_mode === 'cod')
    .map(s => {
      const parcel = s.parcels?.[0];

      return {
        shipment_id: s.id,
        tracking_number: s.tracking_number,
        amount: parcel?.cod_amount || 0,
        pickup_time: s.pickup_time,
        pickup_location: s.pickup_location,
        dropoff_location: parcel?.dropoff_location || null,
        status:
          s.payment_status === 'paid'
            ? 'Paid to Courier'
            : 'Pending Handover'
      };
    });

  return {
    success: true,
    codShipments
  };
}

async getPrepaidShipments(riderId: number, date: string) {
const shipments = await this.getShipmentsByDate(riderId, { date });

  const prepaid = shipments
    .filter(s => s.payment_mode === 'prepaid')
    .map(s => {
      const parcel = s.parcels?.[0];

      return {
        shipment_id: s.id,
        tracking_number: s.tracking_number,
        amount: parcel?.cod_amount || 0,
        pickup_time: s.pickup_time,
        pickup_location: s.pickup_location,
        dropoff_location: parcel?.dropoff_location || null
      };
    });

  return {
    success: true,
    prepaidShipments: prepaid
  };
}




// private async getShipmentsByDate(riderId: number, date: string) {
//   let start = new Date();
//   let end = new Date();

//   if (date) {
//     start = new Date(date + " 00:00:00");
//     end = new Date(date + " 23:59:59");
//   }

//   return this.shipmentRepository.find({
//     where: {
//       rider: { id: riderId },
//       pickup_time: Between(start, end)
//     },
//     relations: ['parcels'],
//     order: { pickup_time: 'DESC' }
//   });
// }

private async getShipmentsByDate(
  riderId: number,
  filter: { startTime?: string; endTime?: string; date?: string }
) {
  let start: Date;
  let end: Date;

  // 1️⃣ Custom time range
  if (filter.startTime && filter.endTime) {
    start = new Date(filter.startTime);
    end = new Date(filter.endTime);
  }

  // 2️⃣ Date only - FIXED (UTC-safe)
  else if (filter.date) {
    start = new Date(`${filter.date}T00:00:00.000Z`);
    end   = new Date(`${filter.date}T23:59:59.999Z`);
  }

  // 3️⃣ Default to today (UTC-safe)
  else {
    const today = new Date().toISOString().split("T")[0];
    start = new Date(`${today}T00:00:00.000Z`);
    end   = new Date(`${today}T23:59:59.999Z`);
  }

  return this.shipmentRepository.find({
    where: {
      rider: { id: riderId },
      pickup_time: Between(start, end),
    },
    relations: ['parcels'],
    order: { pickup_time: 'DESC' },
  });
}
async getProfile(riderId: number) {
    console.log('SERVICE RECEIVED riderId >>>', riderId);

  const rider = await this.riderRepository.findOne({
    where: { id: riderId },
     relations: ['company'],
  });

  if (!rider) throw new NotFoundException('Rider not found');
  const { password, company, ...safeRider } = rider;

  return {
    success: true,
    data: {
      ...rider,
      documents: rider.documents ? JSON.parse(rider.documents) : {},
     company: company
        ? {
            company_id: company.company_id,
            company_name: company.company_name,
            logo: company.logo,
            company_address: company.company_address,
            contact_number: company.company_phone_number,
            email: company.company_email_address,
            pns_account_full_name: company.pns_account_full_name,
          }
        : null,
    
    
    },
  };
}


async updateRiderProfile(
  riderId: number,
  dto: UpdateRiderProfileDto,
  files: {
    driving_license?: Express.Multer.File[];
    vehicle_registration?: Express.Multer.File[];
    emirates_id_front?: Express.Multer.File[];
    emirates_id_back?: Express.Multer.File[];
  },
) {
  const rider = await this.riderRepository.findOne({
    where: { id: riderId },
  });

  if (!rider) throw new NotFoundException('Rider not found');

  const existingDocs = rider.documents ? JSON.parse(rider.documents) : {};
  const updatedDocs: any = { ...existingDocs };

  // Upload only new files
  if (files.driving_license) {
    updatedDocs.driving_license_document_url =
      await this.uploadDocumentToS3(files.driving_license[0]);
  }

  if (files.vehicle_registration) {
    updatedDocs.vehicle_registeration_document =
      await this.uploadDocumentToS3(files.vehicle_registration[0]);
  }

  if (files.emirates_id_front) {
    updatedDocs.emirates_id_front =
      await this.uploadDocumentToS3(files.emirates_id_front[0]);
  }

  if (files.emirates_id_back) {
    updatedDocs.emirates_id_back =
      await this.uploadDocumentToS3(files.emirates_id_back[0]);
  }

  // Update rider fields
  rider.rider_name = dto.name;
  rider.email = dto.email;
  rider.phone_number = dto.phone;
  rider.vehicle_type = dto.vehicleType;
  rider.vehicle_brand = dto.vehicle_brand;
  rider.registration_number = dto.registrationNumber;
  rider.licence_number = dto.licenseNumber;
  rider.registration_year = Number(dto.registration_year);

  rider.documents = JSON.stringify(updatedDocs);

  await this.riderRepository.save(rider);

  return {
    success: true,
    message: 'Profile updated successfully',
    data: rider,
  };
}

async updateRiderAvailibilityStatus(riderId: number, isProfileActive: boolean) {
  const rider = await this.riderRepository.findOne({
    where: { id: riderId },
  });

  if (!rider) {
    throw new NotFoundException(`Rider with ID ${riderId} not found`);
  }

  // If trying to deactivate but rider has a job assigned → ERROR
if (!isProfileActive && rider.is_job_assigned === true) {
  throw new BadRequestException({
    success: false,
    message: 'Job is currently assigned to this rider. Rider availability cannot be changed.',
    data: {
      rider_id: rider.id,
      is_profile_active: rider.availability_status,
      profile_status: rider.profile_status,
      is_available: rider.is_available,
    },
  });
}


  rider.is_available = isProfileActive; // frontend toggle
  rider.updatedOn = new Date();
 

  await this.riderRepository.save(rider);

  return {
    success: true,
   message: `You are now ${
  isProfileActive ? 'available for jobs' : 'unavailable for jobs'
}.`,

    data: {
      rider_id: rider.id,
      is_profile_active: rider.availability_status,
      profile_status: rider.profile_status,
      is_available: rider.is_available,
    },
  };
}
private calculatePricing(pricing, packageSize: string) {
  if (!['small', 'medium', 'large'].includes(packageSize)) {
    throw new BadRequestException('Invalid package size');
  }

  const matchedPricing = pricing.find(p => p.size === packageSize && p.is_active === true);
  if (!matchedPricing) {
    throw new BadRequestException(`No active pricing found for package size: ${packageSize}`);
  }

  const baseFare = matchedPricing.baseFare;
  const platformFee = baseFare * 0.1; // 10% platform fee
  const pnsCommission = baseFare * 0.05; // 5% commission
  const vat = (baseFare + platformFee + pnsCommission) * 0.05; // 5% VAT
  const total = baseFare + platformFee + pnsCommission + vat;

  return {
    standardDeliveryFees: baseFare,
    platformFee,
    pnsCommission,
    vat,
    total,
  };
}

 
async getShipmentDetailsByIdForRider(shipmentId: number, riderId: number) {
  try {
    const shipment = await this.shipmentRepository.findOne({
      where: { id: shipmentId, rider: { id: riderId } }, // Critical security check
      relations: [
        'rider',
        'customer',
        'cod_payment',
        'parcels',
        'courierCompany',
        'courierCompany.company_conveyance_details',
        'courierCompany.company_conveyance_details.pricing',
        'courierCompany.commissionRates',
      ],
    });

    if (!shipment) {
      return {
        result: null,
        success: false,
        message: 'Shipment not found or access denied',
        httpResponseCode: 404,
        customResponseCode: '404 Not Found',
      };
    }

    const rider = shipment.rider;
    const customer = shipment.customer || null;
    const codPayment = shipment.cod_payment || null;
    const company = shipment.courierCompany || null;
    const parcels = shipment.parcels || [];

    // Payment Details Calculation (same as vendor)
    let paymentDetails = {
      standardDeliveryFees: 0,
      platformFee: 0,
      pnsCommission: 0,
      vat: 0,
      total: 0,
    };

    if (company && company.company_conveyance_details?.length && parcels.length > 0) {
      const packageSize = parcels[0]?.package_size;
      const vehicleType = rider?.vehicle_type || 'bike';
      const conveyance = company.company_conveyance_details.find(
        c => c.conveyance_types.toLowerCase() === vehicleType.toLowerCase()
      );

      if (conveyance && conveyance.pricing) {
        try {
          paymentDetails = this.calculatePricing(conveyance.pricing, packageSize);
        } catch (error) {
          return {
            result: null,
            success: false,
            message: 'Pricing calculation failed: ' + error.message,
            httpResponseCode: 400,
            customResponseCode: '400 Bad Request',
          };
        }
      }
    }

    // Optional: Fetch company documents if needed (you may skip for rider if not required)
    const companyDocuments = company
      ? await this.companyDocumentRepository.find({
          where: { company_id: company.company_id },
        })
      : [];

    return {
      result: {
        shipment_id: shipment.id,
        rider_id: rider?.id || null, // This is the new field you wanted
        tracking_number: shipment.tracking_number || '',
        pickup_location: shipment.pickup_location || '',
        parcel_type: shipment.parcel_type || '',
        parcels: parcels.map(p => ({
          parcel_id: p.parcel_id,
          dropoff_location: p.dropoff_location,
          size: p.package_size,
          length: p.length,
          width: p.width,
          height: p.height,
          weight: p.weight,
          description: p.description || '',
          sender_name: p.sender_name || '',
          sender_phone: p.sender_phone || '',
          receiver_name: p.receiver_name || '',
          receiver_phone: p.receiver_phone || '',
          parcel_photos: p.parcel_photos || [],
        })),
        total_cod_amount: codPayment?.cod_amount ?? 0,
        createdOn: shipment.createdOn || null,
        updatedOn: shipment.updatedOn || null,
        shipment_status: shipment.shipment_status || '',
        shipment_type: shipment.payment_mode || '',
        customer: customer
          ? {
              id: customer.id,
              name: `${customer.firstname} ${customer.lastname}`,
              phone_number: customer.phone_number,
            }
          : null,
        rider: rider
          ? {
              id: rider.id,
              name: rider.rider_name,
              vehicle_type: rider.vehicle_type,
            }
          : null,
        companyDetails: company
          ? {
              company_id: company.company_id,
              company_name: company.company_name,
              documents: companyDocuments.map(doc => ({
                establishment_card_document: [
                  {
                    side_front: 'front',
                    file_front: doc.establishment_card_front,
                    side_back: 'back',
                    file_back: doc.establishment_card_back,
                  },
                ],
                establishment_card_expiry_date: doc.trade_license_expiry_date,
              })),
            }
          : null,
        paymentDetails,
      },
      httpResponseCode: 200,
      customResponseCode: '200 OK',
      message: 'Shipment details fetched successfully',
      success: true,
    };
  } catch (error) {
    return {
      result: null,
      httpResponseCode: 500,
      customResponseCode: '500 Internal Server Error',
      message: `Error fetching shipment details: ${error.message}`,
      success: false,
    };
  }
}
async getContactDetails(riderId: number) {
    try {
      const rider = await this.riderRepository.findOne({
        where: { id: riderId },
        relations: ['company'], // This loads the associated courier_company
      });

      if (!rider || !rider.company) {
        return {
          success: false,
          message: 'No associated vendor/company found for this rider',
          httpResponseCode: 404,
          customResponseCode: '404 Not Found',
          result: null,
        };
      }

      const company: courier_company = rider.company;

      return {
        success: true,
        message: 'Vendor contact details fetched successfully',
        httpResponseCode: 200,
        customResponseCode: '200 OK',
        result: {
          phone_number: company.company_phone_number
            ? `+971 ${company.company_phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}`
            : null,
          raw_phone: company.company_phone_number
            ? `+971${company.company_phone_number}`
            : null,
          email: company.company_email_address || null,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch vendor contact: ' + error.message,
        httpResponseCode: 500,
        customResponseCode: '500 Internal Server Error',
        result: null,
      };
    }
  }



  async updateShipmentStatus(
    riderId: number,
    shipmentId: number,
    shipment_status: string,
  ) {
    // Validate Rider
    const rider = await this.riderRepository.findOne({
      where: { id: riderId },
    });

    if (!rider) {
      throw new NotFoundException(`Rider with ID ${riderId} not found`);
    }

    // Validate Shipment
    const shipment = await this.shipmentRepository.findOne({
      where: { id: shipmentId },
      relations: ['rider'],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${shipmentId} not found`);
    }

    // Shipment must belong to the rider
    if (shipment.rider?.id !== riderId) {
      throw new BadRequestException(
        `This shipment is not assigned to the rider`,
      );
    }

    // Validate status flow rules (optional)
    const allowedStatuses = [
      'pending',
      'accepted',
      'declined',
      'assigned',
      'in_progress',
      'completed',

    ];

    if (!allowedStatuses.includes(shipment_status)) {
      throw new BadRequestException(`Invalid shipment status: ${shipment_status}`);
    }

    // Update Shipment Status
    shipment.shipment_status = shipment_status;
    shipment.updatedOn = new Date();

    await this.shipmentRepository.save(shipment);

    // Also update rider job assignment if delivered or cancelled
    if (['completed', 'declined'].includes(shipment_status)) {
      rider.is_job_assigned = false;
      rider.is_available = true;
      await this.riderRepository.save(rider);
    }

    return {
      message: 'Shipment status updated successfully',
      shipmentId,
      newStatus: shipment_status,
    };
  }



async getTodaysDeliveries(riderId: number) {
  // 1. Get today's date in YYYY-MM-DD format (local time)
  // We use this to ensure we are searching for "Dec 20" specifically.
 
  const today = new Date();
  const dateString = today.getFullYear() + '-' + 
                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(today.getDate()).padStart(2, '0');
console.log(`Searching for Rider ID: ${riderId} on Date: ${dateString}`);
  // 2. Execute the query using the cast to DATE
  const deliveriesToday = await this.shipmentRepository
    .createQueryBuilder('s')
    .where('s.rider_id = :riderId', { riderId })
    .andWhere('s.shipment_status != :status', { status: 'declined' })
    .andWhere('s.pickup_time IS NOT NULL')
    // We cast the DB column to DATE and compare it to our date string
    .andWhere('s.pickup_time::DATE = :today', { today: dateString })
    .getCount();

  return {
    success: true,
    message: 'Today deliveries fetched successfully',
    data: {
      deliveriesToday,
    },
  };
}

 
 
async getTotalAmount(riderId: number) {
  const result = await this.shipmentRepository
    .createQueryBuilder('s')
    .innerJoin('s.shipping_payment', 'sp')
    .select('COALESCE(SUM(sp.total), 0)', 'totalAmount')
    .where('s.rider_id = :riderId', { riderId })
    .andWhere('sp.is_active = true')
    .getRawOne();

  return {
    success: true,
    data: {
      totalAmount: Number(result.totalAmount),
    },
  };
}

async getCashCollected(riderId: number) {
  const result = await this.shipmentRepository
    .createQueryBuilder('s')
    .innerJoin('s.shipping_payment', 'sp')
    .select('COALESCE(SUM(sp.total), 0)', 'cashCollected')
    .where('s.rider_id = :riderId', { riderId })
    .andWhere('s.payment_mode = :mode', { mode: 'cod' })
    .andWhere('sp.is_active = true')
    .getRawOne();

  return {
    success: true,
    data: {
      cashCollected: Number(result.cashCollected),
    },
  };
}


async getPrepaidAmount(riderId: number) {
  const result = await this.shipmentRepository
    .createQueryBuilder('s')
    .innerJoin('s.shipping_payment', 'sp')
    .select('COALESCE(SUM(sp.total), 0)', 'prepaidAmount')
    .where('s.rider_id = :riderId', { riderId })
    .andWhere('s.payment_mode = :mode', { mode: 'prepaid' })
    .andWhere('sp.is_active = true')
    .getRawOne();

  return {
    success: true,
    data: {
      prepaidAmount: Number(result.prepaidAmount),
    },
  };
}


async getCodShipmentsCount(riderId: number) {
  try {
    const shipments = await this.shipmentRepository.find({
      where: {
        rider: { id: riderId },
        payment_mode: 'cod',
      },
      relations: [
        'parcels',
        'cod_payment',
        'shipping_payment', // Now we can show accurate earnings per shipment
      ],
      order: { createdOn: 'DESC' },
    });

    const formatted = shipments.map((s) => {
      const pickupTime = s.pickup_time ? new Date(s.pickup_time) : null;
      const estimatedDropoff = pickupTime
        ? new Date(pickupTime.getTime() + 30 * 60 * 1000)
        : null;

      // Use real values from shipping_payment
      const payment = s.shipping_payment?.[0]; // assuming one-to-one

      return {
        shipment_id: s.id,
        tracking_number: s.tracking_number || '',
        pickup_location: s.pickup_location || '',
        dropoff_location: s.parcels?.[0]?.dropoff_location || '',
        cod_amount: s.cod_payment?.cod_amount || 0,
        rider_earnings: payment
          ? {
              standard_delivery_fees: Number(payment.standard_delivery_fees || 0),
              platform_fee: Number(payment.platform_fee || 0),
              pns_commission: Number(payment.pns_commission || 0),
              vat: Number(payment.vat || 0),
              sub_total: Number(payment.sub_total || 0),
              total_rider_gets: Number(payment.total || 0), // This is what rider actually earns
            }
          : {
              standard_delivery_fees: 0,
              platform_fee: 0,
              pns_commission: 0,
              vat: 0,
              sub_total: 0,
              total_rider_gets: 0,
            },
        status: s.cod_payment?.is_paid_to_courier
          ? 'Paid to Courier'
          : 'Pending Handover',
        time_range: pickupTime
          ? {
              from: pickupTime.toISOString(),
              to: estimatedDropoff?.toISOString() || null,
            }
          : null,
        createdOn: s.createdOn?.toISOString() || null,
      };
    });

    // return {
    //   result: {
    //     codShipments: formatted,
    //     totalCount: formatted.length,
    //   },
    //   success: true,
    //   message: 'COD shipments with earnings fetched successfully',
    //   httpResponseCode: 200,
    //   customResponseCode: '200 OK',
    // };
    return {
      sucess: true,
      message: 'COD shipments with earnings fetched successfully',
      data: {
        codShipments: formatted,
        totalCount: formatted.length,
      },
    };
  } catch (error) {
    return {
      result: null,
      success: false,
      message: `Failed to fetch COD shipments: ${error.message}`,
      httpResponseCode: 500,
      customResponseCode: '500 Internal Server Error',
    };
  }
}

 async createShippingPayment(dto: ShippingPaymentDto) {
  const shipment = await this.shipmentRepository.findOne({
    where: { id: dto.shipmentId },
  });

  if (!shipment) {
    throw new NotFoundException(`Shipment with ID ${dto.shipmentId} not found`);
  }

  const payment = this.shippingPaymentRepository.create({
    shipment: shipment,
    standard_delivery_fees: dto.standard_delivery_fees,
    platform_fee: dto.platform_fee,
    pns_commission: dto.pns_commission,
    vat: dto.vat,
    total: dto.total,
    sub_total: dto.sub_total,
    is_cod_submitted: dto.is_cod_submitted,
    createdBy: dto.createdBy || 'system',
    updatedBy: dto.createdBy || 'system',
    is_active: true,
  });

  await this.shippingPaymentRepository.save(payment);

  return {
    success: true,
    message: 'Shipping payment entry created successfully',
    data: payment,
  };
}


async updatePassword(data: { rider_id: number; newPassword: string }): Promise<Response> {
  const resp = new Response();

  try {
    const { rider_id, newPassword } = data; // Correctly destructure the single object
    
    // Check if newPassword is a valid string before proceeding
    if (typeof newPassword !== 'string' || newPassword.length === 0) {
      resp.message = 'Invalid password provided';
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 BadRequest';
      return resp;
    }

    // 1. Find the admin by ID
    const rider = await this.riderRepository.findOne({ where: { id: rider_id } });
    if (!rider) {
      resp.message = 'Rider found';
      resp.httpResponseCode = 404;
      resp.customResponseCode = '404 NotFound';
      return resp;
    }

    // 2. Hash the new password
    // Ensure that newPassword is not null or undefined here
    const hashedNewPassword = await this.hashPassword(newPassword);

    // 3. Update the password in the database
    rider.password = hashedNewPassword;
    rider.updatedOn = new Date();
    await this.riderRepository.save(rider);

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
 


}


