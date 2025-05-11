import { Payment, PaymentStatus, Prisma } from '@prisma/client';
import axios from 'axios';
import httpStatus from 'http-status';
import config from '../../config';
import prisma from '../../config/prisma';
import ApiError from '../../errors/ApiError';
import { calculateMeta, IPaginatedResponse } from '../../interface/common';
import {
  IPaginationOptions,
  paginationHelper,
} from '../../utils/paginationHelper';
import { QueryBuilder } from '../../utils/queryBuilder';
import { paymentSearchableFields } from './payment.constants';
import {
  ICreatePayment,
  IPaymentFilterRequest,
  IVerifyPayment,
} from './payment.interface';

// Sample subscription plans (in a real app, these would be stored in the database)
const subscriptionPlans = [
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    description: 'Monthly premium subscription',
    price: 499,
    currency: 'BDT',
    durationInDays: 30,
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    description: 'Yearly premium subscription with 2 months free',
    price: 4990,
    currency: 'BDT',
    durationInDays: 365,
  },
];

const getAllPayments = async (
  filters: IPaymentFilterRequest,
  options: IPaginationOptions,
): Promise<IPaginatedResponse<Payment>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  // Use QueryBuilder to build conditions
  const searchCondition = QueryBuilder.search(
    searchTerm,
    paymentSearchableFields,
  );
  const filterCondition = QueryBuilder.filter(filterData);

  // Combine all conditions
  const whereConditions = QueryBuilder.where([
    searchCondition,
    filterCondition,
  ]) as Prisma.PaymentWhereInput;

  // Execute queries with Promise.all for better performance
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.payment.count({ where: whereConditions }),
  ]);

  return {
    meta: calculateMeta(page, limit, total),
    data: payments,
  };
};

const getUserPayments = async (
  userId: string,
  filters: IPaymentFilterRequest,
  options: IPaginationOptions,
): Promise<IPaginatedResponse<Payment>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  // Use QueryBuilder to build conditions
  const searchCondition = QueryBuilder.search(
    searchTerm,
    paymentSearchableFields,
  );
  const filterCondition = QueryBuilder.filter(filterData);
  const userCondition = { userId };

  // Combine all conditions
  const whereConditions = QueryBuilder.where([
    searchCondition,
    filterCondition,
    userCondition,
  ]) as Prisma.PaymentWhereInput;

  // Execute queries with Promise.all for better performance
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.payment.count({ where: whereConditions }),
  ]);

  return {
    meta: calculateMeta(page, limit, total),
    data: payments,
  };
};

const getSubscriptionPlans = async () => {
  return subscriptionPlans;
};

const createPayment = async (payload: ICreatePayment) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Validate plan ID
  const plan = subscriptionPlans.find(p => p.id === payload.planId);
  if (!plan) {
    throw new Error('Invalid subscription plan');
  }

  // Generate a unique transaction ID
  const today = new Date();
  const transactionId = `FOOD-SPOT-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;

  // Create a pending payment record
  const payment = await prisma.payment.create({
    data: {
      userId: payload.userId,
      planId: payload.planId,
      amount: plan.price,
      currency: 'BDT',
      status: PaymentStatus.PENDING,
      paymentGatewayData: {},
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
      success_url: `${config.backend_url}/api/payments/success`,
      fail_url: `${config.frontend_url}/payment/failed`,
      cancel_url: `${config.frontend_url}/payment/cancelled`,
      ipn_url: `${config.backend_url}/api/payments/ipn`,
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

    // Update the payment record with payment gateway data
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentGatewayData: response.data,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      payment: updatedPayment,
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

const verifyPayment = async (data: IVerifyPayment) => {
  const { transactionId } = data;

  // Find payment by transaction ID
  const payment = await prisma.payment.findFirst({
    where: { transactionId },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  try {
    // Validate payment with SSL Commerz
    const response = await axios({
      method: 'GET',
      url: `${config.ssl.sslValidationApi}?val_id=${data.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`,
    });

    const verificationResult = response.data;

    // Update payment status based on verification result
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status:
          verificationResult.status === 'VALID'
            ? PaymentStatus.SUCCESS
            : PaymentStatus.FAILED,
        paymentGatewayData: {
          ...(payment.paymentGatewayData as Prisma.JsonObject),
          verificationData: verificationResult,
        },
      },
    });

    // If payment was successful, update user's premium status and subscription expiry
    if (updatedPayment.status === PaymentStatus.SUCCESS) {
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          isPremium: true,
          subscriptionExpiryDate: new Date(
            Date.now() + payment.durationInDays * 24 * 60 * 60 * 1000,
          ),
        },
      });
    }

    return updatedPayment;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Payment verification failed: ' + (error as Error).message,
    );
  }
};

export const PaymentService = {
  getAllPayments,
  getUserPayments,
  getSubscriptionPlans,
  createPayment,
  verifyPayment,
};
