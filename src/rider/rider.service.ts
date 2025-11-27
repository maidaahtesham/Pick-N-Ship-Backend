import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { courier_company } from 'src/Models/courier_company.entity';
import { qr_sessions } from 'src/Models/qr_sessions.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreateQrSessionDto } from 'src/ViewModel/create-qr-session.dto';
import { Response } from 'src/ViewModel/response';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { v4 as uuidv4 } from 'uuid';
import { Rider } from 'src/Models/rider.entity';

@Injectable()
export class RiderService {

constructor(
   @InjectRepository(qr_sessions)
    private readonly qrSessionRepo: Repository<qr_sessions>,

    @InjectRepository(courier_company)
    private readonly companyRepository: Repository<courier_company>,

    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,

) {
    
    
}
async createQrSession(dto: CreateQrSessionDto): Promise<Response> {
    const resp = new Response();
    try {
        const { companyId, riderId } = dto;
        
        // Check company exists
        const company = await this.companyRepository.findOne({
            where: { company_id: companyId },
        });

        if (!company) {
            throw new Error('Company not found');
        };
        
        // Assuming your Rider entity uses 'id' as the primary key column name
        const rider = await this.riderRepository.findOne({
            where: { id: riderId },
        });

        if (!rider) {
            throw new Error('Rider not found');
        }

        // Create a new session
        const newSession = this.qrSessionRepo.create({
            session_id: uuidv4().toString(),
            expires_at: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 mins
            company: company, // assign courier_company relation
            company_name: dto.companyName,
            
            rider: rider, // ✅ CORRECTED: Use 'rider' (the entity property)
            
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
      where: { session_id: sessionId, expires_at: MoreThan(new Date()) },
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

}


