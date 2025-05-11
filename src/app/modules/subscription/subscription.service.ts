import { PaymentStatus } from '@prisma/client';
import axios from 'axios';
import httpStatus from 'http-status';
import config from '../../config';
import prisma from '../../config/prisma';
import ApiError from '../../errors/ApiError';
import { UserService } from '../user/user.service';
import { SUBSCRIPTION_PLANS } from './subscription.const';
import { IPaymentCallback } from './subscription.interface';

// Get all subscription plans
const getSubscriptionPlans = async () => {
  return SUBSCRIPTION_PLANS;
};

// Get a specific subscription plan by ID
const getSubscriptionPlanById = async (planId: string) => {
  const plan = SUBSCRIPTION_PLANS.find(plan => plan.id === planId);

  if (!plan) {
    throw new Error('Subscription plan not found');
  }

  return plan;
};

// Initiate payment process for a subscription
const initiateSubscription = async (userId: string, planId: string) => {
  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Get subscription plan details
  const plan = await getSubscriptionPlanById(planId);

  // Generate transaction ID
  const today = new Date();
  const transactionId = `FOOD-SPOT-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;

  // Create a new payment record
  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      planId: plan.id,
      amount: plan.price,
      currency: 'BDT', // Bangladeshi Taka
      status: PaymentStatus.PENDING,
      durationInDays: plan.durationInDays,
      transactionId,
      paymentMethod: 'sslcommerz',
    },
  });

  // Prepare SSL Commerz payment request
  try {
    const sslData = {
      store_id: config.ssl.storeId,
      store_passwd: config.ssl.storePass,
      total_amount: plan.price,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${config.backend_url}/api/subscription/payment-callback`,
      fail_url: `${config.frontend_url}/subscription/failed`,
      cancel_url: `${config.frontend_url}/subscription/cancelled`,
      ipn_url: `${config.backend_url}/api/subscription/ipn`,
      shipping_method: 'No',
      product_name: `${plan.name} Subscription`,
      product_category: 'Subscription',
      product_profile: 'general',
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: 'Bangladesh',
      cus_add2: 'N/A',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: '01XXXXXXXXX', // Placeholder
      cus_fax: 'N/A',
      ship_name: 'N/A',
      ship_add1: 'N/A',
      ship_add2: 'N/A',
      ship_city: 'N/A',
      ship_state: 'N/A',
      ship_postcode: 1000,
      ship_country: 'N/A',
    };

    // Make payment request to SSL Commerz
    const response = await axios({
      method: 'post',
      url: config.ssl.sslPaymentApi,
      data: sslData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    // Update payment record with payment gateway data
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentGatewayData: response.data,
      },
    });

    return {
      payment: {
        id: payment.id,
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        currency: 'BDT',
      },
      paymentUrl: response.data.GatewayPageURL,
    };
  } catch (error) {
    // Update payment record if payment initiation fails
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
      },
    });

    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Payment initiation failed: ' + (error as Error).message,
    );
  }
};

// Handle payment callback from SSL Commerz
const handlePaymentCallback = async (callbackData: IPaymentCallback) => {
  const { status, transactionId } = callbackData;

  // Find the payment record by transaction ID
  const payment = await prisma.payment.findFirst({
    where: { transactionId },
    include: {
      user: true,
    },
  });

  if (!payment) {
    throw new Error('Payment record not found');
  }

  // Update payment status based on callback
  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status:
        status === 'success'
          ? PaymentStatus.SUCCESS
          : status === 'failed'
            ? PaymentStatus.FAILED
            : PaymentStatus.CANCELLED,
      transactionId: transactionId,
    },
  });

  // If payment is successful, update user's premium status
  if (status === 'success') {
    await UserService.updatePremiumStatus(
      payment.userId,
      true,
      payment.durationInDays,
    );

    return {
      status: 'success',
      message: 'Payment successful and premium status updated',
      payment: updatedPayment,
    };
  }

  return {
    status: status,
    message: `Payment ${status}`,
    payment: updatedPayment,
  };
};

// Validate SSL Commerz payment
const validatePayment = async (payload: Record<string, unknown>) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${config.ssl.sslValidationApi}?val_id=${payload.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`,
    });

    return response.data;
  } catch {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment validation failed!');
  }
};

// Get user subscription history
const getUserSubscriptionHistory = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return payments;
};

export const SubscriptionService = {
  getSubscriptionPlans,
  getSubscriptionPlanById,
  initiateSubscription,
  handlePaymentCallback,
  validatePayment,
  getUserSubscriptionHistory,
};
