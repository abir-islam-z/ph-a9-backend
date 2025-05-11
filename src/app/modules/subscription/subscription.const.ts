export const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Premium',
    price: 199,
    durationInDays: 30,
    features: [
      'Access to all premium food spots',
      'Write unlimited reviews',
      'Premium user badge',
      'No ads',
    ],
  },
  {
    id: 'quarterly',
    name: 'Quarterly Premium',
    price: 499,
    durationInDays: 90,
    features: [
      'Access to all premium food spots',
      'Write unlimited reviews',
      'Premium user badge',
      'No ads',
      'Priority support',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly Premium',
    price: 1499,
    durationInDays: 365,
    features: [
      'Access to all premium food spots',
      'Write unlimited reviews',
      'Premium user badge',
      'No ads',
      'Priority support',
      'Early access to new features',
    ],
  },
];

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;