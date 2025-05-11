import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { FoodSpotRoutes } from '../modules/foodspot/foodspot.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { SubscriptionRoutes } from '../modules/subscription/subscription.route';
import { UserRoutes } from '../modules/user/user.route';
import { VoteRoutes } from '../modules/vote/vote.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/foodspots',
    route: FoodSpotRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/votes',
    route: VoteRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/subscription',
    route: SubscriptionRoutes,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
