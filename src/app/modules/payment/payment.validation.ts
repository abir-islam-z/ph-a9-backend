import { z } from 'zod';

const createPaymentValidationSchema = z.object({
  body: z.object({
    planId: z.string({
      required_error: 'Plan ID is required',
    }),
    amount: z.number({
      required_error: 'Amount is required',
    }),
    currency: z.string().optional(),
    paymentMethod: z.string().optional(),
    durationInDays: z.number({
      required_error: 'Duration in days is required',
    }),
  }),
});

const verifyPaymentValidationSchema = z.object({
  body: z.object({
    transactionId: z.string({
      required_error: 'Transaction ID is required',
    }),
  }),
});

export const PaymentValidation = {
  createPaymentValidationSchema,
  verifyPaymentValidationSchema,
};
