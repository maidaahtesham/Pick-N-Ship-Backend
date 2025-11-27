import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateQrSessionDto } from 'src/ViewModel/create-qr-session.dto';
import { RiderService } from './rider.service';
import { GetRegistrationDataDto } from 'src/ViewModel/get-registration-data.dto';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';

@Controller('api/rider')
export class RiderController {
  constructor(private readonly riderService:RiderService) {}

  @UseGuards(JwtAuthGuard)
 @Post('create-qr-session')
  async create(@Body() data: CreateQrSessionDto) {
    return this.riderService.createQrSession(data);
  }
@UseGuards(JwtAuthGuard)
  @Post('get-registration-data')
  async getRegistrationData(@Body() getRegistrationDataDto: GetRegistrationDataDto) {
    return this.riderService.getRegistrationData(getRegistrationDataDto.sessionId);
  }



}
