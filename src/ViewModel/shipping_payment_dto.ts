 
export class ShippingPaymentDto {
  shipmentId: number;
  standard_delivery_fees: number;
  platform_fee: number;
  pns_commission: number;
  vat: number;
  total: number;
  sub_total: number;
  is_cod_submitted: boolean;
  createdBy?: string;
}
