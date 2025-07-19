export class courier_company_dto {
  company_name: string;
  logo?: string;
  city: string;
  contact_phone: string;
  pns_account: string;
  trade_license_number: string;
  establishment_card?: string;
  establishment_date: string;
  registration_status?: 'active' | 'pending' | 'declined';
  conveyance_types: 'bike' | 'van' | 'truck';
  conveyance_details: string;
  commission_rate: 'standard' | '5%' | '8%' | 'custom';
  first_name: string;
  last_name: string;
  email_address: string;
  password: string;
  address_line1: string;
  address_line2?: string;
  postal_code: string;
  country: string;
  createdBy?: string;
  updatedBy?: string;
  createdOn?: Date;
  updatedOn?: Date;
}   