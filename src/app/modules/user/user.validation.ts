import { z } from 'zod';
import { USER_ROLES } from './user.constant';

const userUpdate = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
});

const updateUserStatus = z.object({
  body: z.object({
    isBlocked: z.boolean().optional(),
    role: z.enum([...USER_ROLES] as [string, ...string[]]).optional(),
  }),
});

const updatePremiumStatus = z.object({
  body: z.object({
    isPremium: z.boolean({
      required_error: 'isPremium status is required',
    }),
    subscriptionDuration: z.number().positive().optional(),
  }),
});

export type TUserUpdate = z.infer<typeof userUpdate>;
export type TUpdateUserStatus = z.infer<typeof updateUserStatus.shape.body>;

export const UserValidation = {
  userUpdate,
  updateUserStatus,
  updatePremiumStatus,
};
