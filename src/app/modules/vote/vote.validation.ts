import { z } from 'zod';

const createVoteValidationSchema = z.object({
  body: z.object({
    type: z.enum(['UPVOTE', 'DOWNVOTE'], {
      required_error: 'Vote type is required',
    }),
    foodSpotId: z.string({
      required_error: 'Food spot ID is required',
    }),
  }),
});

export const VoteValidation = {
  createVoteValidationSchema,
};
