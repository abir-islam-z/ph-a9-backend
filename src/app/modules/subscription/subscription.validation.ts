import { z } from 'zod';

const initiateSubscriptionValidationSchema = z.object({
  body: z.object({
    planId: z.string({
      required_error: 'Subscription plan ID is required',
    }),
  }),
});

export const SubscriptionValidation = {
  initiateSubscriptionValidationSchema,
};