import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import { sendResponse } from '../../utils/sendResponse';
import { UserRoles } from '../user/user.constant';
import { foodspotFilterableFields } from './foodspot.constants';
import { FoodSpotService } from './foodspot.service';

const getAllFoodSpots = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, foodspotFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  // Clean up empty string values to prevent Prisma validation errors
  Object.keys(filters).forEach(key => {
    if (filters[key] === '') {
      delete filters[key];
    }
  });

  const result = await FoodSpotService.getAllFoodSpots(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Food spots retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getFoodSpotById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FoodSpotService.getFoodSpotById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Food spot retrieved successfully',
    data: result,
  });
});

const getUserFoodSpots = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const filters = pick(req.query, foodspotFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  // Clean up empty string values to prevent Prisma validation errors
  Object.keys(filters).forEach(key => {
    if (filters[key] === '') {
      delete filters[key];
    }
  });

  const result = await FoodSpotService.getUserFoodSpots(
    userId,
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User food spots retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const createFoodSpot = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await FoodSpotService.createFoodSpot(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Food spot created successfully',
    data: result,
  });
});

const updateFoodSpot = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;
  const isAdmin = userRole === UserRoles.ADMIN;

  const result = await FoodSpotService.updateFoodSpot(
    id,
    userId,
    isAdmin,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Food spot updated successfully',
    data: result,
  });
});

const deleteFoodSpot = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;
  const isAdmin = userRole === UserRoles.ADMIN;

  await FoodSpotService.deleteFoodSpot(id, userId, isAdmin);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Food spot deleted successfully',
    data: null,
  });
});

const addReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await FoodSpotService.addReview(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review added successfully',
    data: result,
  });
});

const addVote = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await FoodSpotService.addVote(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vote recorded successfully',
    data: result,
  });
});

const getPendingFoodSpots = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await FoodSpotService.getPendingFoodSpots(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pending food spots retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateApprovalStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await FoodSpotService.updateApprovalStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Approval status updated successfully',
    data: result,
  });
});

export const FoodSpotController = {
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
