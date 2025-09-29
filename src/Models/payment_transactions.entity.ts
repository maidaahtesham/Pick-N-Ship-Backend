import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Shipment } from './shipment.entity';
 

@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shipment, (shipment) => shipment.id)
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  // @ManyToOne(() => CodPayment, (codPayment) => codPayment.id, { nullable: true })
  // @JoinColumn({ name: 'cod_payment_id' })
  // codPayment: CodPayment; // Optional, if you want to link COD payments specifically

  @Column({ type: 'enum', enum: ['credit_card', 'debit_card' ], nullable: true })
  paymentMethod: string; // e.g., 'credit_card', 'debit_card', etc.

  @Column({ length: 255, nullable: true })
  nameOnCard: string; // Name as entered by the customer

  @Column({ length: 50, nullable: true }) // Store a token or last 4 digits
  cardTokenOrLast4: string; // Token from payment gateway or masked card number (e.g., "****-1234")

  @Column({ type: 'float', nullable: false })
  amount: number; // Total amount paid

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending',
  })
  paymentStatus: string; // Track the payment lifecycle

  @Column({ type: 'text', nullable: true })
  transactionId: string; // Unique ID from payment gateway

  @Column({ length: 50, nullable: true })
  createdBy: string; // Customer or user ID who initiated payment

  @Column({ length: 50, nullable: true })
  updatedBy: string; // User who last updated (if applicable)

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedOn: Date;

  @Column({ type: 'boolean', default: null })
  status: boolean; // General status (active/inactive)
}