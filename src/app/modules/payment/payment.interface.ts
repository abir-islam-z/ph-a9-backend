import { Payment, PaymentStatus } from '@prisma/client';

export type TPayment = Payment;

export interface IPaymentFilters {
  searchTerm?: string;
  status?: PaymentStatus;
  userId?: string;
  planId?: string;
}

export interface ICreatePayment {
  userId: string;
  planId: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  durationInDays: number;
}

export interface IVerifyPayment {
  transactionId: string;
  val_id?: string; // SSL Commerz validation ID
}

export interface IPaymentPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationInDays: number;
}

export type IPaymentFilterRequest = {
  searchTerm?: string;
  status?: PaymentStatus;
  userId?: string;
  planId?: string;
};

// SSL Commerz payment response
export interface ISSLPaymentResponse {
  status: string;
  tran_date: string;
  tran_id: string;
  val_id: string;
  amount: string;
  store_amount: string;
  card_type: string;
  card_no: string;
  currency: string;
  bank_tran_id: string;
  card_issuer: string;
  card_brand: string;
  error?: string;
  GatewayPageURL?: string;
}
