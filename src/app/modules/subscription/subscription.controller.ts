import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { IPaymentCallback } from './subscription.interface';
import { SubscriptionService } from './subscription.service';

// Get all subscription plans
const getSubscriptionPlans = catchAsync(
  async (_req: Request, res: Response) => {
    const plans = await SubscriptionService.getSubscriptionPlans();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Subscription plans retrieved successfully',
      data: plans,
    });
  },
);

// Get a specific subscription plan by ID
const getSubscriptionPlanById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const plan = await SubscriptionService.getSubscriptionPlanById(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Subscription plan retrieved successfully',
      data: plan,
    });
  },
);

// Initiate a subscription payment
const initiateSubscription = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user!;
  const { planId } = req.body;

  const result = await SubscriptionService.initiateSubscription(id, planId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Subscription payment initiated successfully',
    data: result,
  });
});

// Handle payment callback from SSL Commerz
const handlePaymentCallback = catchAsync(
  async (req: Request, res: Response) => {
    // Extract data from SSL Commerz callback
    const callbackData = {
      transactionId: req.query.tran_id as string,
      status: req.query.status === 'VALID' ? 'success' : 'failed',
    };

    await SubscriptionService.handlePaymentCallback(
      callbackData as unknown as IPaymentCallback,
    );

    // Redirect to frontend based on payment status
    if (callbackData.status === 'success') {
      res.redirect(`${process.env.FRONTEND_URL}/subscription/success`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/subscription/failed`);
    }
  },
);

// Validate SSL Commerz IPN (Instant Payment Notification)
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.validatePayment(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment validated successfully',
    data: result,
  });
});

// Get user's subscription history
const getUserSubscriptionHistory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.user!;
    const history = await SubscriptionService.getUserSubscriptionHistory(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Subscription history retrieved successfully',
      data: history,
    });
  },
);

export const SubscriptionController = {
  getSubscriptionPlans,
  getSubscriptionPlanById,
  initiateSubscription,
  handlePaymentCallback,
  validatePayment,
  getUserSubscriptionHistory,
};
