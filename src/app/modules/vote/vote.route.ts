import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRoles } from '../user/user.constant';
import { VoteController } from './vote.controller';
import { VoteValidation } from './vote.validation';

const router = express.Router();

// Admin routes
router.get('/', auth(UserRoles.ADMIN), VoteController.getAllVotes);

// User routes
router.get(
  '/user/my-votes',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  VoteController.getUserVotes,
);

router.get('/food-spot/:foodSpotId', VoteController.getFoodSpotVotes);

router.post(
  '/',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(VoteValidation.createVoteValidationSchema),
  VoteController.createOrUpdateVote,
);

router.delete(
  '/:foodSpotId',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  VoteController.deleteVote,
);

export const VoteRoutes = router;
