export class ScanQrDto {
  sessionId: string; // From QR code
}

export class CompleteProfileDto {
  sessionId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicleType: string;
  vehicle_brand:string;
  registeration_year:string;
  driving_license_document_url:string;
  vehicle_registeration_document:string;
  emirates_id_front:string;
  emirates_id_back:string;
  is_number_verified:boolean;  
  licenseNumber: string;
  registrationNumber: string; 
}