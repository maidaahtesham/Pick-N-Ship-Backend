// src/customer-user/customer-user.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
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
import bcrypt from 'bcryptjs/umd/types';

@Injectable()
export class CustomerUserService {
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
  ) {}

     


  async createShipmentRequest(customerId: number, data: ShipmentRequestDTO): Promise<Response> {
    const resp: Response = { success: false, message: '', result: null, httpResponseCode: null, customResponseCode: '', count: 0 };

    try {
      const customer = await this.customerRepository.findOne({ where: { id: customerId }, relations: ['company'] });
      if (!customer) throw new BadRequestException('Customer not found');

      const requestDate = new Date(data.request_date);
      if (isNaN(requestDate.getTime())) throw new BadRequestException('Invalid request_date provided');

      const shipmentRequest = this.shipmentRequestRepository.create({
        customer,
        pickup_location: data.pickup_location,
        dropoff_location: data.dropoff_location,
        parcel_type: data.parcel_type,
        package_size: data.package_size,
        parcel_photos:data.parcel_photos,
        weight: data.weight,
        length: data.length,
        height: data.height,
        base_price: data.base_price,
        pickup_time_slot: data.pickup_time_slot,
        payment_status: data.payment_status || 'unpaid',
        sender_name: data.sender_name,
        receiver_name: data.receiver_name,
        receiver_phone: data.receiver_phone,
        special_instruction: data.special_instruction,
        shipment_status: data.shipment_status || 'pending',
        request_date: requestDate,
        createdBy: data.created_by || 'system',
        updatedBy: data.updated_by || 'system',
        createdOn: data.created_on ? new Date(data.created_on) : new Date(),
        updatedOn: data.updated_on ? new Date(data.updated_on) : new Date(),
        status: data.is_active !== undefined ? data.is_active : true,
        rider: data.rider || null,
        company: customer.company || null,
      });

      const savedRequests: shipment_request[] = await this.shipmentRequestRepository.save([shipmentRequest]);
      const savedRequest: shipment_request = savedRequests[0];

      const shipment = this.shipmentRepository.create({
        courier_company_id: savedRequest.company?.company_id || 1, // Default to company_id 1 if not set
         shipment_id_tag_no: `SHIP-${savedRequest.request_id}-${Date.now()}`,
        request_id: savedRequest.request_id,
        customer_id: customerId,
        pickup_time: requestDate,
        delivery_time: data.request_date,
        delivery_status: 'pending',
        cod_amount: 0,
        parcel_type: savedRequest.parcel_type,
        sender_name: savedRequest.sender_name,
        receiver_name: savedRequest.receiver_name,
        sender_phone: savedRequest.receiver_phone,
        receiver_phone: savedRequest.receiver_phone,
        shipment_type: 'regular',
        delivered_on: data.request_date,
        job_status: 'pending',
        parcel_details: savedRequest.special_instruction || '',
        rider: data.rider || null,
        createdBy: 'system',
        updatedBy: 'system',
        status: true,
        
      });
      await this.shipmentRepository.save(shipment);

      resp.success = true;
      resp.message = 'Shipment request created successfully';
      resp.result = {
        request_id: savedRequest.request_id,
        pickup_location: savedRequest.pickup_location,
        dropoff_location: savedRequest.dropoff_location,
        parcel_type: savedRequest.parcel_type,
        package_size: savedRequest.package_size,
        weight: savedRequest.weight,
        length: savedRequest.length,
        height: savedRequest.height,
        base_price: savedRequest.base_price,
        shipment_status: savedRequest.shipment_status,
        request_date: savedRequest.request_date,
        createdOn: savedRequest.createdOn,
        updatedOn: savedRequest.updatedOn,
        createdBy: savedRequest.createdBy,
        updatedBy: savedRequest.updatedBy,
      };
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      return resp;
    } catch (error) {
      resp.success = false;
      resp.message = 'Failed to create shipment request: ' + error.message;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 Bad Request';
      return resp;
    }
  }

  async createRegularBooking(customerId: number, data: RegularBookingDTO): Promise<Response> {
    const resp: Response = {
      success: false,
      message: '',
      result: null,
      httpResponseCode: null,
      customResponseCode: '',
      count: 0,
    };

    try {
      const shipmentRequest = await this.shipmentRequestRepository.findOne({ where: { request_id: data.request_id, customer: { id: customerId } } });
      if (!shipmentRequest) {
        throw new BadRequestException('Shipment request not found for the given customer');
      }

      shipmentRequest.parcel_type = 'regular';
      shipmentRequest.package_size = data.package_size;
      shipmentRequest.weight = data.weight;

      if (data.length || data.width || data.height) {
        shipmentRequest.length = data.length||0;
        shipmentRequest.width = data.width || 0;
        shipmentRequest.height = data.height||0;
      }

      shipmentRequest.parcel_photos = data.parcel_photos || null;
      shipmentRequest.special_instruction = data.special_instruction || shipmentRequest.special_instruction;
      shipmentRequest.updatedBy = 'system';
      shipmentRequest.updatedOn = new Date();

      const savedRequest: shipment_request = await this.shipmentRequestRepository.save(shipmentRequest);

      const shipment = await this.shipmentRepository.findOne({ where: { request_id: data.request_id } });
      if (shipment) {
        shipment.parcel_details = savedRequest.special_instruction || '';
        await this.shipmentRepository.save(shipment);
      }

      resp.success = true;
      resp.message = 'Regular booking created successfully';
      resp.result = {
        request_id: savedRequest.request_id,
        pickup_location: savedRequest.pickup_location,
        dropoff_location: savedRequest.dropoff_location,
        parcel_type: savedRequest.parcel_type,
        package_size: savedRequest.package_size,
        weight: savedRequest.weight,
        length: savedRequest.length,
        height: savedRequest.height,
        width: savedRequest.width,
        base_price: savedRequest.base_price,
        shipment_status: savedRequest.shipment_status,
        request_date: savedRequest.request_date,
        special_instruction: savedRequest.special_instruction,
        parcel_photos: savedRequest.parcel_photos,
        courier_company_id: savedRequest.company?.company_id || null,
        createdOn: savedRequest.createdOn,
        updatedOn: savedRequest.updatedOn,
        createdBy: savedRequest.createdBy,
        updatedBy: savedRequest.updatedBy,
      };
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      return resp;
    } catch (error) {
      resp.success = false;
      resp.message = 'Failed to create regular booking: ' + error.message;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 Bad Request';
      return resp;
    }
  }

  async selectVehicle(customerId: number, data: SelectVehicleDTO): Promise<Response> {
    const resp: Response = {
      success: false,
      message: '',
      result: null,
      httpResponseCode: null,
      customResponseCode: '',
      count: 0,
    };

    try {
      const shipmentRequest = await this.shipmentRequestRepository.findOne({
        where: { request_id: data.request_id, customer: { id: customerId } },
        relations: ['company'], // Load the company relation
      });
      if (!shipmentRequest) {
        throw new BadRequestException('Shipment request not found for the given customer');
      }

      // Fetch or create shipping_detail with proper company relationship
      let shippingDetail = await this.shippingDetailRepository.findOne({
        where: {
          conveyance_types: data.vehicle_type,
          company: { company_id: shipmentRequest.company?.company_id || 1 }, // Use company_id as the foreign key
        },
      });
      if (!shippingDetail) {
        const company = await this.courierCompanyRepository.findOne({ where: { company_id: shipmentRequest.company?.company_id || 1 } });
        if (!company) {
          throw new BadRequestException('Courier company not found');
        }
        shippingDetail = this.shippingDetailRepository.create({
          conveyance_types: data.vehicle_type,
          conveyance_details: `Details for ${data.vehicle_type}`,
          commission_rate: 'standard',
          company: company, // Use the full entity
        });
        shippingDetail = await this.shippingDetailRepository.save(shippingDetail);
      }

      // Update associated Shipment with shipping_detail
      const shipment = await this.shipmentRepository.findOne({ where: { request_id: data.request_id } });
      if (!shipment) {
        throw new BadRequestException('Shipment not found for the given request');
      }

      shipment.shippingDetail = shippingDetail;
      shipment.updatedBy = 'system';
      shipment.updatedOn = new Date();
      await this.shipmentRepository.save(shipment);

      resp.success = true;
      resp.message = 'Vehicle selected successfully';
      resp.result = {
        request_id: shipmentRequest.request_id,
        pickup_location: shipmentRequest.pickup_location,
        dropoff_location: shipmentRequest.dropoff_location,
        parcel_type: shipmentRequest.parcel_type,
        package_size: shipmentRequest.package_size,
        weight: shipmentRequest.weight,
        length: shipmentRequest.length,
        height: shipmentRequest.height,
        width: shipmentRequest.width,
        base_price: shipmentRequest.base_price,
        shipment_status: shipmentRequest.shipment_status,
        request_date: shipmentRequest.request_date,
        special_instruction: shipmentRequest.special_instruction,
        parcel_photos: shipmentRequest.parcel_photos,
        vehicle_type: shippingDetail.conveyance_types,
        conveyance_details: shippingDetail.conveyance_details,
        commission_rate: shippingDetail.commission_rate,
        createdOn: shipmentRequest.createdOn,
        updatedOn: shipmentRequest.updatedOn,
        createdBy: shipmentRequest.createdBy,
        updatedBy: shipmentRequest.updatedBy,
      };
      resp.httpResponseCode = 200;
      resp.customResponseCode = '200 OK';
      return resp;
    } catch (error) {
      resp.success = false;
      resp.message = 'Failed to select vehicle: ' + error.message;
      resp.httpResponseCode = 400;
      resp.customResponseCode = '400 Bad Request';
      return resp;
    }
  }
}