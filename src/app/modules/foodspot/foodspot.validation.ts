import { z } from 'zod';
import { FOOD_CATEGORIES, VOTE_TYPES } from './foodspot.const';

const createFoodSpotValidationSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
  location: z.string({
    required_error: 'Location is required',
  }),
  minPrice: z
    .union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => val >= 0, {
      message: 'Minimum price must be a positive number',
    }),

  maxPrice: z
    .union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => val >= 0, {
      message: 'Maximum price must be a positive number',
    }),
  image: z.string({
    required_error: 'Image is required',
  }),
  category: z.enum([...FOOD_CATEGORIES] as [string, ...string[]], {
    required_error: 'Category is required',
  }),
  isPremium: z.boolean().optional(),
});

const updateFoodSpotValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  category: z.enum([...FOOD_CATEGORIES] as [string, ...string[]]).optional(),
  image: z.string().optional(),
  isPremium: z.boolean().optional(),
});

const reviewValidationSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string({
    required_error: 'Comment is required',
  }),
});

const voteValidationSchema = z.object({
  type: z.enum([...VOTE_TYPES] as [string, ...string[]], {
    required_error: 'Vote type is required',
  }),
});
const approvalValidationSchema = z.object({
  approvalStatus: z.enum(['APPROVED', 'REJECTED'], {
    required_error: 'Approval status is required',
  }),
  rejectionReason: z.string().optional(),
});

export const FoodSpotValidation = {
  createFoodSpotValidationSchema,
  updateFoodSpotValidationSchema,
  reviewValidationSchema,
  voteValidationSchema,
  approvalValidationSchema,
};
