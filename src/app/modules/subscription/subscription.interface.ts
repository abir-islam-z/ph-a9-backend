export interface ISubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationInDays: number;
  features: string[];
}

export interface IPaymentInitiate {
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
}

export interface IPaymentCallback {
  status: 'success' | 'failed' | 'cancelled';
  transactionId: string;
  val_id?: string; // SSL Commerz validation ID
}

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
