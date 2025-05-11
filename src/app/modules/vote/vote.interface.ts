import { Vote, VoteType } from '@prisma/client';

export type TVote = Vote;

export interface IVoteFilters {
  type?: VoteType;
  userId?: string;
  foodSpotId?: string;
}

export interface ICreateVote {
  type: VoteType;
  userId: string;
  foodSpotId: string;
}

export type IVoteFilterRequest = {
  type?: VoteType;
  userId?: string;
  foodSpotId?: string;
};
