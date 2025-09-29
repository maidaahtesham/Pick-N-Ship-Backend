import { Controller, Post, UploadedFiles, UseInterceptors, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { multerOptions } from 'src/config/multer.config';
import { Response } from 'src/ViewModel/response';
import { UploadPictureService } from './upload_picture.service';

@Controller('upload-picture')
@UseGuards(JwtAuthGuard)
export class UploadPictureController {
  constructor(private readonly uploadPictureService: UploadPictureService) {}

  @Post('upload-photos/:parcelId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], multerOptions))
  async uploadParcelPhotos(
    @Param('parcelId') parcelId: string,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Request() req,
  ): Promise<Response> {
    const id = parseInt(parcelId, 10);
    if (isNaN(id)) throw new BadRequestException('Invalid parcel ID');
    const userId = req.user.sub; // Assuming JWT payload includes sub as user ID
    return this.uploadPictureService.uploadParcelPhotos(id, files.files || [], userId);
  }
}