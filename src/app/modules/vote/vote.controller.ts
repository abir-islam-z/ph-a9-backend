import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DecodedJWTPayload } from '../../interface/jwtdecoded';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import { sendResponse } from '../../utils/sendResponse';
import { voteFilterableFields } from './vote.constants';
import { VoteService } from './vote.service';

const getAllVotes = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, voteFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await VoteService.getAllVotes(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Votes retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getUserVotes = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as DecodedJWTPayload).id;
  const filters = pick(req.query, voteFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await VoteService.getUserVotes(userId, filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User votes retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getFoodSpotVotes = catchAsync(async (req: Request, res: Response) => {
  const { foodSpotId } = req.params;
  const filters = pick(req.query, voteFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await VoteService.getFoodSpotVotes(
    foodSpotId,
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Food spot votes retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const createOrUpdateVote = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as DecodedJWTPayload).id;
  const payload = {
    ...req.body,
    userId,
  };

  const result = await VoteService.createOrUpdateVote(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vote recorded successfully',
    data: result,
  });
});

const deleteVote = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as DecodedJWTPayload).id;
  const { foodSpotId } = req.params;

  await VoteService.deleteVote(userId, foodSpotId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vote deleted successfully',
    data: null,
  });
});

export const VoteController = {
  getAllVotes,
  getUserVotes,
  getFoodSpotVotes,
  createOrUpdateVote,
  deleteVote,
};
