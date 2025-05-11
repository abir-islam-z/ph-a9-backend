import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DecodedJWTPayload } from '../../interface/jwtdecoded';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import { sendResponse } from '../../utils/sendResponse';
import { UserRoles } from '../user/user.constant';
import { reviewFilterableFields } from './review.constants';
import { ReviewService } from './review.service';

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await ReviewService.getAllReviews(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.getReviewById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  });
});

const getUserReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as DecodedJWTPayload).id;
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await ReviewService.getUserReviews(userId, filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User reviews retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getFoodSpotReviews = catchAsync(async (req: Request, res: Response) => {
  const { foodSpotId } = req.params;
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await ReviewService.getFoodSpotReviews(
    foodSpotId,
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Food spot reviews retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as DecodedJWTPayload).id;
  const payload = {
    ...req.body,
    userId,
  };

  const result = await ReviewService.createReview(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as DecodedJWTPayload).id;
  const userRole = (req.user as DecodedJWTPayload).role;
  const isAdmin = userRole === UserRoles.ADMIN;

  const result = await ReviewService.updateReview(
    id,
    userId,
    isAdmin,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as DecodedJWTPayload).id;
  const userRole = (req.user as DecodedJWTPayload).role;
  const isAdmin = userRole === UserRoles.ADMIN;

  await ReviewService.deleteReview(id, userId, isAdmin);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: null,
  });
});

export const ReviewController = {
  getAllReviews,
  getReviewById,
  getUserReviews,
  getFoodSpotReviews,
  createReview,
  updateReview,
  deleteReview,
};
