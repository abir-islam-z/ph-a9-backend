import { Prisma, UserRole } from '@prisma/client';
import prisma from '../../config/prisma';
import {
  IPaginationOptions,
  paginationHelper,
} from '../../utils/paginationHelper';
import { QueryBuilder } from '../../utils/queryBuilder';
import { userSearchableFields } from './user.constants';
import { IUserFilterRequest } from './user.interface';

const getAllUsers = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
) => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  // Use QueryBuilder to build search and filter conditions
  const searchCondition = QueryBuilder.search(searchTerm, userSearchableFields);
  const filterCondition = QueryBuilder.filter(filterData);
  const whereConditions = QueryBuilder.where([
    searchCondition,
    filterCondition,
  ]);

  // Execute queries
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions as Prisma.UserWhereInput,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        isPremium: true,
        subscriptionExpiryDate: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where: whereConditions as Prisma.UserWhereInput }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: users,
  };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBlocked: true,
      isPremium: true,
      subscriptionExpiryDate: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          foodSpots: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateUser = async (
  id: string,
  data: {
    name?: string;
    isBlocked?: boolean;
    role?: UserRole;
  },
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBlocked: true,
      isPremium: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Update user subscription status
const updatePremiumStatus = async (
  userId: string,
  isPremium: boolean,
  subscriptionDuration = 30, // Default 30 days
) => {
  const subscriptionExpiryDate = new Date();
  subscriptionExpiryDate.setDate(
    subscriptionExpiryDate.getDate() + subscriptionDuration,
  );

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      isPremium,
      role: isPremium ? 'PREMIUM' : 'USER',
      subscriptionExpiryDate: isPremium ? subscriptionExpiryDate : null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isPremium: true,
      subscriptionExpiryDate: true,
    },
  });

  return updatedUser;
};

// Check and update expired premium subscriptions
const checkAndUpdateExpiredSubscriptions = async () => {
  const now = new Date();

  const expiredUsers = await prisma.user.findMany({
    where: {
      isPremium: true,
      subscriptionExpiryDate: {
        lt: now,
      },
    },
  });

  if (expiredUsers.length > 0) {
    await prisma.user.updateMany({
      where: {
        id: {
          in: expiredUsers.map(user => user.id),
        },
      },
      data: {
        isPremium: false,
        role: 'USER',
        subscriptionExpiryDate: null,
      },
    });

    return { updated: expiredUsers.length };
  }

  return { updated: 0 };
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  updatePremiumStatus,
  checkAndUpdateExpiredSubscriptions,
};
