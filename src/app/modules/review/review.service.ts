import { Prisma, Review } from '@prisma/client';
import prisma from '../../config/prisma';
import { calculateMeta, IPaginatedResponse } from '../../interface/common';
import {
  IPaginationOptions,
  paginationHelper,
} from '../../utils/paginationHelper';
import { QueryBuilder } from '../../utils/queryBuilder';
import { reviewSearchableFields } from './review.constants';
import {
  ICreateReview,
  IReviewFilterRequest,
  IUpdateReview,
} from './review.interface';

const getAllReviews = async (
  filters: IReviewFilterRequest,
  options: IPaginationOptions,
): Promise<IPaginatedResponse<Review>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  // Use QueryBuilder to build search and filter conditions
  const searchCondition = QueryBuilder.search(
    searchTerm,
    reviewSearchableFields,
  );
  const filterCondition = QueryBuilder.filter(filterData);

  // Combine all conditions
  const whereConditions = QueryBuilder.where([
    searchCondition,
    filterCondition,
  ]) as Prisma.ReviewWhereInput;

  // Execute queries with Promise.all for better performance
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
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
    prisma.review.count({ where: whereConditions }),
  ]);

  return {
    meta: calculateMeta(page, limit, total),
    data: reviews,
  };
};

const getReviewById = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
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
  });

  if (!review) {
    throw new Error('Review not found');
  }

  return review;
};

const getUserReviews = async (
  userId: string,
  filters: IReviewFilterRequest,
  options: IPaginationOptions,
): Promise<IPaginatedResponse<Review>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  // Use QueryBuilder to build conditions
  const searchCondition = QueryBuilder.search(
    searchTerm,
    reviewSearchableFields,
  );
  const filterCondition = QueryBuilder.filter(filterData);
  const userCondition = { userId };

  // Combine all conditions
  const whereConditions = QueryBuilder.where([
    searchCondition,
    filterCondition,
    userCondition,
  ]) as Prisma.ReviewWhereInput;

  // Execute queries with Promise.all for better performance
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
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
    prisma.review.count({ where: whereConditions }),
  ]);

  return {
    meta: calculateMeta(page, limit, total),
    data: reviews,
  };
};

const getFoodSpotReviews = async (
  foodSpotId: string,
  filters: IReviewFilterRequest,
  options: IPaginationOptions,
): Promise<IPaginatedResponse<Review>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  // Use QueryBuilder to build conditions
  const searchCondition = QueryBuilder.search(
    searchTerm,
    reviewSearchableFields,
  );
  const filterCondition = QueryBuilder.filter(filterData);
  const foodSpotCondition = { foodSpotId };

  // Combine all conditions
  const whereConditions = QueryBuilder.where([
    searchCondition,
    filterCondition,
    foodSpotCondition,
  ]) as Prisma.ReviewWhereInput;

  // Execute queries with Promise.all for better performance
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
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
    prisma.review.count({ where: whereConditions }),
  ]);

  return {
    meta: calculateMeta(page, limit, total),
    data: reviews,
  };
};

const createReview = async (payload: ICreateReview) => {
  // Check if the food spot exists
  const foodSpot = await prisma.foodSpot.findUnique({
    where: { id: payload.foodSpotId },
  });

  if (!foodSpot) {
    throw new Error('Food spot not found');
  }

  // Check if user already reviewed this food spot
  const existingReview = await prisma.review.findFirst({
    where: {
      foodSpotId: payload.foodSpotId,
      userId: payload.userId,
    },
  });

  if (existingReview) {
    throw new Error('You have already reviewed this food spot');
  }

  // Create the review
  const review = await prisma.review.create({
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

  // Update the total rating of the food spot
  await updateFoodSpotRating(payload.foodSpotId);

  return review;
};

const updateReview = async (
  id: string,
  userId: string,
  isAdmin: boolean,
  payload: IUpdateReview,
) => {
  // Check if review exists and belongs to the user (unless admin)
  const review = await prisma.review.findUnique({
    where: { id },
    select: { userId: true, foodSpotId: true },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  if (!isAdmin && review.userId !== userId) {
    throw new Error('Unauthorized: You do not own this review');
  }

  const result = await prisma.review.update({
    where: { id },
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

  // Update the total rating of the food spot
  await updateFoodSpotRating(review.foodSpotId);

  return result;
};

const deleteReview = async (id: string, userId: string, isAdmin: boolean) => {
  // Check if review exists and belongs to the user (unless admin)
  const review = await prisma.review.findUnique({
    where: { id },
    select: { userId: true, foodSpotId: true },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  if (!isAdmin && review.userId !== userId) {
    throw new Error('Unauthorized: You do not own this review');
  }

  // Delete the review
  await prisma.review.delete({ where: { id } });

  // Update the total rating of the food spot
  await updateFoodSpotRating(review.foodSpotId);

  return review;
};

// Helper function to update the food spot's rating
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

export const ReviewService = {
  getAllReviews,
  getReviewById,
  getUserReviews,
  getFoodSpotReviews,
  createReview,
  updateReview,
  deleteReview,
};
