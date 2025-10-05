 
export class PaymentDTO {
  paymentMethod: string; // e.g., 'credit_card', 'debit_card'
  nameOnCard: string;
  cardNumber?: string; // Optional, depending on gateway
  expiryDate?: string; // Optional
  cvv?: string; // Optional
  customerId: number; // To track who made the payment
 
  companyId: number; // Added for courier company

 
}