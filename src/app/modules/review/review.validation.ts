import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    rating: z
      .number({
        required_error: 'Rating is required',
      })
      .min(1)
      .max(5),
    comment: z.string({
      required_error: 'Comment is required',
    }),
    foodSpotId: z.string({
      required_error: 'Food spot ID is required',
    }),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};
