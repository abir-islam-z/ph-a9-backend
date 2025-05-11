import { ApprovalStatus, FoodSpot, Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { calculateMeta, IPaginatedResponse } from '../../interface/common';
import {
  IPaginationOptions,
  paginationHelper,
} from '../../utils/paginationHelper';
import { QueryBuilder } from '../../utils/queryBuilder';
import { ratingHelper } from '../../utils/ratingHelper';
import { foodspotSearchableFields } from './foodspot.constants';
import {
  ICreateFoodSpot,
  ICreateReview,
  ICreateVote,
  IFoodspotFilterRequest,
  IUpdateApproval,
  IUpdateFoodSpot,
} from './foodspot.interface';

const getAllFoodSpots = async (
  filters: IFoodspotFilterRequest,
  options: IPaginationOptions,
): Promise<IPaginatedResponse<FoodSpot>> => {
  const { searchTerm, priceRange, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const searchCondition = QueryBuilder.search(
    searchTerm,
    foodspotSearchableFields,
  );
  const filterCondition = QueryBuilder.filter(filterData);

  let priceRangeCondition = {};
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);
    if (minPrice && maxPrice) {
      priceRangeCondition = {
        OR: [{ minPrice: { gte: minPrice } }, { maxPrice: { lte: maxPrice } }],
      };
    }
  }

  const approvalCondition = { approvalStatus: ApprovalStatus.APPROVED };

  const whereConditions = QueryBuilder.where([
    searchCondition,
    filterCondition,
    priceRangeCondition,
    approvalCondition,
  ]) as Prisma.FoodSpotWhereInput;

  const [foodSpots, total] = await Promise.all([
    prisma.foodSpot.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
          },
        },
      },
    }),
    prisma.foodSpot.count({ where: whereConditions }),
  ]);

  const foodSpotsWithRating = ratingHelper.addRatingStats(foodSpots);

  return {
    meta: calculateMeta(page, limit, total),
    data: foodSpotsWithRating,
  };
};

const getFoodSpotById = async (id: string) => {
  const foodSpot = await prisma.foodSpot.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!foodSpot) {
    throw new Error('Food spot not found');
  }

  const averageRating = ratingHelper.calculateAverage(foodSpot.reviews);

  return {
    ...foodSpot,
    averageRating,
    reviewCount: foodSpot.reviews.length,
  };
};

const getUserFoodSpots = async (
  userId: string,
  filters: IFoodspotFilterRequest,
  options: IPaginationOptions,
): Promise<IPaginatedResponse<FoodSpot>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const searchCondition = QueryBuilder.search(
    searchTerm,
    foodspotSearchableFields,
  );
  const filterCondition = QueryBuilder.filter(filterData);
  const userCondition = { creatorId: userId };

  const whereConditions = QueryBuilder.where([
    searchCondition,
    filterCondition,
    userCondition,
  ]) as Prisma.FoodSpotWhereInput;

  const [foodSpots, total] = await Promise.all([
    prisma.foodSpot.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        reviews: {
          select: {
            id: true,
            rating: true,
          },
        },
      },
    }),
    prisma.foodSpot.count({ where: whereConditions }),
  ]);

  const foodSpotsWithRating = ratingHelper.addRatingStats(foodSpots);

  return {
    meta: calculateMeta(page, limit, total),
    data: foodSpotsWithRating,
  };
};

const createFoodSpot = async (userId: string, payload: ICreateFoodSpot) => {
  const data = {
    ...payload,
    creatorId: userId,
    approvalStatus: ApprovalStatus.PENDING,
  };

  const result = await prisma.foodSpot.create({
    data,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};

const updateFoodSpot = async (
  id: string,
  userId: string,
  isAdmin: boolean,
  payload: IUpdateFoodSpot,
) => {
  const foodSpot = await prisma.foodSpot.findUnique({
    where: { id },
    select: { creatorId: true, approvalStatus: true },
  });

  if (!foodSpot) {
    throw new Error('Food spot not found');
  }

  if (!isAdmin && foodSpot.creatorId !== userId) {
    throw new Error('Unauthorized: You do not own this food spot');
  }

  const data: IUpdateFoodSpot = { ...payload };
  if (foodSpot.approvalStatus === ApprovalStatus.APPROVED && !isAdmin) {
    data.approvalStatus = ApprovalStatus.PENDING;
  }

  const result = await prisma.foodSpot.update({
    where: { id },
    data,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};

const deleteFoodSpot = async (id: string, userId: string, isAdmin: boolean) => {
  const foodSpot = await prisma.foodSpot.findUnique({
    where: { id },
    select: { creatorId: true },
  });

  if (!foodSpot) {
    throw new Error('Food spot not found');
  }

  if (!isAdmin && foodSpot.creatorId !== userId) {
    throw new Error('Unauthorized: You do not own this food spot');
  }

  await prisma.$transaction([
    prisma.review.deleteMany({ where: { foodSpotId: id } }),
    prisma.vote.deleteMany({ where: { foodSpotId: id } }),
    prisma.foodSpot.delete({ where: { id } }),
  ]);

  return foodSpot;
};

const addReview = async (
  foodSpotId: string,
  userId: string,
  payload: ICreateReview,
) => {
  const foodSpot = await prisma.foodSpot.findUnique({
    where: { id: foodSpotId },
  });

  if (!foodSpot) {
    throw new Error('Food spot not found');
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      foodSpotId,
      userId,
    },
  });

  if (existingReview) {
    throw new Error('You have already reviewed this food spot');
  }

  const review = await prisma.review.create({
    data: {
      ...payload,
      userId,
      foodSpotId,
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

  await updateFoodSpotRating(foodSpotId);

  return review;
};

const addVote = async (
  foodSpotId: string,
  userId: string,
  payload: ICreateVote,
) => {
  const foodSpot = await prisma.foodSpot.findUnique({
    where: { id: foodSpotId },
  });

  if (!foodSpot) {
    throw new Error('Food spot not found');
  }

  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_foodSpotId: {
        userId,
        foodSpotId,
      },
    },
  });

  if (existingVote) {
    if (existingVote.type === payload.type) {
      await prisma.vote.delete({
        where: {
          userId_foodSpotId: {
            userId,
            foodSpotId,
          },
        },
      });

      await updateFoodSpotVotes(foodSpotId);
      return { message: 'Vote removed' };
    } else {
      const vote = await prisma.vote.update({
        where: {
          userId_foodSpotId: {
            userId,
            foodSpotId,
          },
        },
        data: {
          type: payload.type,
        },
      });

      await updateFoodSpotVotes(foodSpotId);
      return vote;
    }
  } else {
    const vote = await prisma.vote.create({
      data: {
        type: payload.type,
        userId,
        foodSpotId,
      },
    });

    await updateFoodSpotVotes(foodSpotId);
    return vote;
  }
};

const updateFoodSpotRating = async (foodSpotId: string) => {
  const reviews = await prisma.review.findMany({
    where: { foodSpotId },
    select: { rating: true },
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  await prisma.foodSpot.update({
    where: { id: foodSpotId },
    data: {
      totalRating,
    },
  });
};

const updateFoodSpotVotes = async (foodSpotId: string) => {
  const votes = await prisma.vote.findMany({
    where: { foodSpotId },
  });

  const totalUpvotes = votes.filter(vote => vote.type === 'UPVOTE').length;
  const totalDownvotes = votes.filter(vote => vote.type === 'DOWNVOTE').length;

  await prisma.foodSpot.update({
    where: { id: foodSpotId },
    data: {
      totalUpvotes,
      totalDownvotes,
    },
  });
};

const getPendingFoodSpots = async (
  options: IPaginationOptions,
): Promise<IPaginatedResponse<FoodSpot>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const pendingCondition = { approvalStatus: ApprovalStatus.PENDING };

  const [foodSpots, total] = await Promise.all([
    prisma.foodSpot.findMany({
      where: pendingCondition,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.foodSpot.count({ where: pendingCondition }),
  ]);

  return {
    meta: calculateMeta(page, limit, total),
    data: foodSpots,
  };
};

const updateApprovalStatus = async (id: string, payload: IUpdateApproval) => {
  const { approvalStatus, rejectionReason } = payload;

  const foodSpot = await prisma.foodSpot.findUnique({
    where: { id },
  });

  if (!foodSpot) {
    throw new Error('Food spot not found');
  }

  if (approvalStatus === ApprovalStatus.REJECTED && !rejectionReason) {
    throw new Error('Rejection reason is required');
  }

  const result = await prisma.foodSpot.update({
    where: { id },
    data: {
      approvalStatus,
      rejectionReason:
        approvalStatus === ApprovalStatus.REJECTED ? rejectionReason : null,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};

export const FoodSpotService = {
  getAllFoodSpots,
  getFoodSpotById,
  getUserFoodSpots,
  createFoodSpot,
  updateFoodSpot,
  deleteFoodSpot,
  addReview,
  addVote,
  getPendingFoodSpots,
  updateApprovalStatus,
};
