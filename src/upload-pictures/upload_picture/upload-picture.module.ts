import { Module } from '@nestjs/common';
import { UploadPictureService } from './upload_picture.service';
import { UploadPictureController } from './upload_picture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { parcel_details } from 'src/Models/parcel_detail.entity';

@Module({
imports: [TypeOrmModule.forFeature([parcel_details])],
  providers: [UploadPictureService],
  controllers: [UploadPictureController],

})
export class UploadPictureModule {




}
