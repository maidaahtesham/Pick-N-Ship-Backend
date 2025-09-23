export interface  GetShipmentDetailsByIdDto{
  shipmentId: string;
  date: string;
  parcelType: string;
  parcelSize: string;
  parcelWeight: string;
  parameters: string;
  amount: string;
  shipmentStatus: string;
  shipmentType: string;
  customerName: string;
  customerNumber: string;
  senderName: string;
  senderNumber: string;
  receiverName: string;
  receiverPhoneNumber: string;
  assignedRider: string;
  pickUpTime: string;
  deliveredTime: string;
  isCodReceived: boolean;
  pickupLocation: string;
  dropOffLocation: string;
  parcelDetailDescription: string;
  parcelPhotos: string[];
  companyDetails: object;
  orderTracking: {
    awaiting: { status: string; time: string };
    pickup: { status: string; time: string };
    inTransit: { status: string; time: string };
    outForDelivery: { status: string; time: string };
    delivered: { status: string; time: string };
    codCollected: { status: string; time: string };
  };
  vehicleType: string;
  paymentDetails: {
    standardDeliveryFees: number;
    subtotal: number;
    platformFees: number;
    vat: number;
    total: number;
  };
  codMarkedAsReceivedByAdmin: { status: string; time: string };
}