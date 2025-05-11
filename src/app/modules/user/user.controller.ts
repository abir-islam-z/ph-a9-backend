import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import { sendResponse } from '../../utils/sendResponse';
import { userFilterableFields } from './user.constants';
import { UserService } from './user.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await UserService.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getUserById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.updateUser(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const updatePremiumStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { isPremium, subscriptionDuration } = req.body;

  const result = await UserService.updatePremiumStatus(
    userId,
    isPremium,
    subscriptionDuration,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User premium status ${isPremium ? 'activated' : 'deactivated'} successfully`,
    data: result,
  });
});

const checkAndUpdateExpiredSubscriptions = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.checkAndUpdateExpiredSubscriptions();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully updated ${result.updated} expired subscriptions`,
      data: result,
    });
  },
);

export const UserController = {
  getAllUsers,
  getUserById,
  updateUser,
  updatePremiumStatus,
  checkAndUpdateExpiredSubscriptions,
};
