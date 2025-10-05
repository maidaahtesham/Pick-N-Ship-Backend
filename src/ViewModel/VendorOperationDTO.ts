export class VendorOperationDTO {
  company_id?: number;

  // Vendor fields
  vendor_id!: number;
  company_name: string;
  logo?: string;
  username: string;
  city: string;
  company_address?: string;
  company_phone_number?: string;
  pns_account_full_name?: string;
  is_profile_complete?: boolean;
  registeration_status?: string;
  registeration_date?: string;
  establishment_card_expiry_date:string; 
  company_email_address:string;
  created_by?: string;
  created_on?: Date;
  updated_by?: string;
  updated_on?: Date;
  status?: boolean;

  // Document fields (optional)
  trade_license_document_path?: string;
  company_document_path?: string;
  establishment_card_front?: string;
  establishment_card_back?: string;

  trade_license_expiry_date?: string;
  trade_license_number?: string;
}
