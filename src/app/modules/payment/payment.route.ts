import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRoles } from '../user/user.constant';
import { PaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = express.Router();

// Public routes
router.get('/plans', PaymentController.getSubscriptionPlans);

// Admin routes
router.get('/', auth(UserRoles.ADMIN), PaymentController.getAllPayments);

// User routes
router.get(
  '/my-payments',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  PaymentController.getUserPayments,
);

router.post(
  '/create-payment',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(PaymentValidation.createPaymentValidationSchema),
  PaymentController.createPayment,
);

// SSL Commerz success callback
router.get('/success', PaymentController.handleSuccessCallback);

// SSL Commerz IPN (Instant Payment Notification)
router.post('/ipn', PaymentController.handleIpn);

export const PaymentRoutes = router;
