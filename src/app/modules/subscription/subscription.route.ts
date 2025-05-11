import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRoles } from '../user/user.constant';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionValidation } from './subscription.validation';

const router = express.Router();

// Public routes
router.get('/plans', SubscriptionController.getSubscriptionPlans);
router.get('/plans/:id', SubscriptionController.getSubscriptionPlanById);

// Payment callback routes (public because payment gateway calls them)
router.get('/payment-callback', SubscriptionController.handlePaymentCallback);
router.post('/ipn', SubscriptionController.validatePayment); // SSL Commerz IPN endpoint

// Authenticated routes
router.post(
  '/initiate',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(SubscriptionValidation.initiateSubscriptionValidationSchema),
  SubscriptionController.initiateSubscription,
);

router.get(
  '/history',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  SubscriptionController.getUserSubscriptionHistory,
);

export const SubscriptionRoutes = router;
