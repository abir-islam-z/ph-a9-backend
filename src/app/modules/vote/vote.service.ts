import { Prisma, Vote, VoteType } from '@prisma/client';
import prisma from '../../config/prisma';
import { calculateMeta, IPaginatedResponse } from '../../interface/common';
import {
  IPaginationOptions,
  paginationHelper,
} from '../../utils/paginationHelper';
import { QueryBuilder } from '../../utils/queryBuilder';
import { ICreateVote, IVoteFilterRequest } from './vote.interface';

const getAllVotes = async (
  filters: IVoteFilterRequest,
  options: IPaginationOptions,
): Promise<IPaginatedResponse<Vote>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const filterCondition = QueryBuilder.filter(filters);

  // Combine all conditions
  const whereConditions = QueryBuilder.where([
    filterCondition,
  ]) as Prisma.VoteWhereInput;

  // Execute queries with Promise.all for better performance
  const [votes, total] = await Promise.all([
    prisma.vote.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        foodSpot: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
      },
    }),
    prisma.vote.count({ where: whereConditions }),
  ]);

  return {
    meta: calculateMeta(page, limit, total),
    data: votes,
  };
};

const getUserVotes = async (
  userId: string,
  filters: IVoteFilterRequest,
  options: IPaginationOptions,
): Promise<IPaginatedResponse<Vote>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const filterCondition = QueryBuilder.filter(filters);
  const userCondition = { userId };

  // Combine all conditions
  const whereConditions = QueryBuilder.where([
    filterCondition,
    userCondition,
  ]) as Prisma.VoteWhereInput;

  // Execute queries with Promise.all for better performance
  const [votes, total] = await Promise.all([
    prisma.vote.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        foodSpot: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
      },
    }),
    prisma.vote.count({ where: whereConditions }),
  ]);

  return {
    meta: calculateMeta(page, limit, total),
    data: votes,
  };
};

const getFoodSpotVotes = async (
  foodSpotId: string,
  filters: IVoteFilterRequest,
  options: IPaginationOptions,
): Promise<IPaginatedResponse<Vote>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const filterCondition = QueryBuilder.filter(filters);
  const foodSpotCondition = { foodSpotId };

  // Combine all conditions
  const whereConditions = QueryBuilder.where([
    filterCondition,
    foodSpotCondition,
  ]) as Prisma.VoteWhereInput;

  // Execute queries with Promise.all for better performance
  const [votes, total] = await Promise.all([
    prisma.vote.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.vote.count({ where: whereConditions }),
  ]);

  return {
    meta: calculateMeta(page, limit, total),
    data: votes,
  };
};

const createOrUpdateVote = async (payload: ICreateVote) => {
  // Check if the food spot exists
  const foodSpot = await prisma.foodSpot.findUnique({
    where: { id: payload.foodSpotId },
  });

  if (!foodSpot) {
    throw new Error('Food spot not found');
  }

  // Check if the user already voted on this food spot
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_foodSpotId: {
        userId: payload.userId,
        foodSpotId: payload.foodSpotId,
      },
    },
  });

  let result;

  // If an existing vote is found, update it or delete it if it's the same type
  if (existingVote) {
    // If same vote type, remove the vote (toggle functionality)
    if (existingVote.type === payload.type) {
      result = await prisma.vote.delete({
        where: {
          userId_foodSpotId: {
            userId: payload.userId,
            foodSpotId: payload.foodSpotId,
          },
        },
      });

      // Update vote counts
      await updateFoodSpotVotes(payload.foodSpotId);
      return { message: 'Vote removed', data: result };
    } else {
      // If different vote type, update the vote
      result = await prisma.vote.update({
        where: {
          userId_foodSpotId: {
            userId: payload.userId,
            foodSpotId: payload.foodSpotId,
          },
        },
        data: {
          type: payload.type,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }
  } else {
    // If no existing vote, create a new one
    result = await prisma.vote.create({
      data: {
        ...payload,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Update vote counts
  await updateFoodSpotVotes(payload.foodSpotId);

  return result;
};

const deleteVote = async (userId: string, foodSpotId: string) => {
  // Check if vote exists
  const vote = await prisma.vote.findUnique({
    where: {
      userId_foodSpotId: {
        userId,
        foodSpotId,
      },
    },
  });

  if (!vote) {
    throw new Error('Vote not found');
  }

  // Delete the vote
  await prisma.vote.delete({
    where: {
      userId_foodSpotId: {
        userId,
        foodSpotId,
      },
    },
  });

  // Update vote counts
  await updateFoodSpotVotes(foodSpotId);

  return vote;
};

// Helper function to update food spot vote counts
const updateFoodSpotVotes = async (foodSpotId: string) => {
  const votes = await prisma.vote.findMany({
    where: { foodSpotId },
  });

  const totalUpvotes = votes.filter(
    vote => vote.type === VoteType.UPVOTE,
  ).length;
  const totalDownvotes = votes.filter(
    vote => vote.type === VoteType.DOWNVOTE,
  ).length;

  await prisma.foodSpot.update({
    where: { id: foodSpotId },
    data: {
      totalUpvotes,
      totalDownvotes,
    },
  });
};

export const VoteService = {
  getAllVotes,
  getUserVotes,
  getFoodSpotVotes,
  createOrUpdateVote,
  deleteVote,
};
