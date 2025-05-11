import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRoles } from './user.constant';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

// Admin routes
router.get('/', auth(UserRoles.ADMIN), UserController.getAllUsers);
router.get('/:id', auth(UserRoles.ADMIN), UserController.getUserById);

router.patch(
  '/:id',
  auth(UserRoles.ADMIN),
  validateRequest(UserValidation.updateUserStatus),
  UserController.updateUser,
);

// Premium subscription management (admin only)
router.patch(
  '/:id/premium-status',
  auth(UserRoles.ADMIN),
  validateRequest(UserValidation.updatePremiumStatus),
  UserController.updatePremiumStatus,
);

// Note: Removed the /profile/me route as the getMyProfile method doesn't exist in UserController

export const UserRoutes = router;
