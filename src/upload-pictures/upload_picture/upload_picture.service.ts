import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { parcel_details } from 'src/Models/parcel_detail.entity';
import { Response } from 'src/ViewModel/response';

@Injectable()
export class UploadPictureService {
  private s3Client: S3Client;

  constructor(
    @InjectRepository(parcel_details)
    private parcelRepository: Repository<parcel_details>,
    private configService: ConfigService,
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
    });
  }

  async uploadParcelPhotos(parcelId: number, files: Express.Multer.File[], userId: string): Promise<Response> {
    try {
      // Validate parcel exists and is active
      const parcel = await this.parcelRepository.findOne({
        where: { parcel_id: parcelId, status: true },
      });
      if (!parcel) throw new NotFoundException('Parcel not found');

      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      // Upload files to S3
      const uploadPromises = files.map(async (file) => {
        const Key = `uploads/${Date.now()}-${file.originalname}`;
        const params = {
          Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
          Key,
          Body: file.buffer,
          ContentType: file.mimetype,
         ACL: ObjectCannedACL.public_read,// Valid ObjectCannedACL value
        };

        await this.s3Client.send(new PutObjectCommand(params));
        return `https://${this.configService.get<string>('S3_BUCKET_NAME')}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${Key}`;
      });

      const urls = await Promise.all(uploadPromises);

      // Update parcel with new photo URLs
      parcel.parcel_photos = [...(parcel.parcel_photos || []), ...urls];
      parcel.updatedBy = userId;
      parcel.updatedOn = new Date();

      const updatedParcel = await this.parcelRepository.save(parcel);

      const resp = new Response(); // Fixed: Added parentheses
      resp.success = true;
      resp.message = 'Photos uploaded successfully';
      resp.result = {
        parcel_id: updatedParcel.parcel_id,
        parcel_photos: updatedParcel.parcel_photos,
      };
      resp.httpResponseCode = 201;
      resp.customResponseCode = '201 Created';
      return resp;

    } catch (error) {
      const resp = new Response();
      resp.success = false;
      resp.message = `Failed to upload photos: ${error.message}`;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 Bad Request';
      return resp;
    }
  }
}