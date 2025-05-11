import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRoles } from '../user/user.constant';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';

const router = express.Router();

// Public routes
router.get('/', ReviewController.getAllReviews);
router.get('/:id', ReviewController.getReviewById);
router.get('/food-spot/:foodSpotId', ReviewController.getFoodSpotReviews);

// Protected routes
router.get(
  '/user/my-reviews',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  ReviewController.getUserReviews,
);

router.post(
  '/',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewController.createReview,
);

router.patch(
  '/:id',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(ReviewValidation.updateReviewValidationSchema),
  ReviewController.updateReview,
);

router.delete(
  '/:id',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  ReviewController.deleteReview,
);

export const ReviewRoutes = router;
