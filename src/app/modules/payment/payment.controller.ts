import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import { sendResponse } from '../../utils/sendResponse';
import { paymentFilterableFields } from './payment.constants';
import { PaymentService } from './payment.service';

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, paymentFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await PaymentService.getAllPayments(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getUserPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const filters = pick(req.query, paymentFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await PaymentService.getUserPayments(userId, filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User payments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSubscriptionPlans = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await PaymentService.getSubscriptionPlans();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Subscription plans retrieved successfully',
      data: result,
    });
  },
);

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const payload = {
    ...req.body,
    userId,
  };

  const result = await PaymentService.createPayment(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment initiated successfully',
    data: result,
  });
});

// Handle successful payment callback from SSL Commerz
const handleSuccessCallback = catchAsync(
  async (req: Request, res: Response) => {
    await PaymentService.verifyPayment({
      transactionId: req.query.tran_id as string,
      val_id: req.query.val_id as string,
    });
    // const result = await PaymentService.verifyPayment({
    //   transactionId: req.query.tran_id as string,
    //   val_id: req.query.val_id as string,
    // });

    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/payment/success`);
  },
);

// Handle IPN (Instant Payment Notification) from SSL Commerz
const handleIpn = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.verifyPayment({
    transactionId: req.body.tran_id as string,
    val_id: req.body.val_id as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment verified successfully',
    data: result,
  });
});

export const PaymentController = {
  getAllPayments,
  getUserPayments,
  getSubscriptionPlans,
  createPayment,
  handleSuccessCallback,
  handleIpn,
};
