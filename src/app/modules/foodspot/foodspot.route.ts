import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendFileToCludinary';
import { UserRoles } from '../user/user.constant';
import { FoodSpotController } from './foodspot.controller';
import { FoodSpotValidation } from './foodspot.validation';

const router = express.Router();

router.get('/', FoodSpotController.getAllFoodSpots);

router.get('/:id', FoodSpotController.getFoodSpotById);

// User routes (require authentication)
router.post(
  '/',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  upload.single('image'),
  (req, res, next) => {
    if (req.file) {
      req.body.image = req.file.path;
    }
    next();
  },
  validateRequest(FoodSpotValidation.createFoodSpotValidationSchema),
  FoodSpotController.createFoodSpot,
);

router.get(
  '/user/my-food-spots',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  FoodSpotController.getUserFoodSpots,
);

router.patch(
  '/:id',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(FoodSpotValidation.updateFoodSpotValidationSchema),
  FoodSpotController.updateFoodSpot,
);

router.delete(
  '/:id',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  FoodSpotController.deleteFoodSpot,
);

router.post(
  '/:id/reviews',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(FoodSpotValidation.reviewValidationSchema),
  FoodSpotController.addReview,
);

router.post(
  '/:id/votes',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(FoodSpotValidation.voteValidationSchema),
  FoodSpotController.addVote,
);

router.get(
  '/admin/pending',
  auth(UserRoles.ADMIN),
  FoodSpotController.getPendingFoodSpots,
);

router.patch(
  '/admin/:id/approval',
  auth(UserRoles.ADMIN),
  validateRequest(FoodSpotValidation.approvalValidationSchema),
  FoodSpotController.updateApprovalStatus,
);

export const FoodSpotRoutes = router;
