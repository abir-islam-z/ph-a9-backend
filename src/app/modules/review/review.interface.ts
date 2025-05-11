import { Review } from '@prisma/client';

export type TReview = Review;

export interface IReviewFilters {
  searchTerm?: string;
  rating?: number;
  userId?: string;
  foodSpotId?: string;
}

export interface ICreateReview {
  rating: number;
  comment: string;
  userId: string;
  foodSpotId: string;
}

export interface IUpdateReview {
  rating?: number;
  comment?: string;
}

export type IReviewFilterRequest = {
  searchTerm?: string;
  rating?: number;
  userId?: string;
  foodSpotId?: string;
};
