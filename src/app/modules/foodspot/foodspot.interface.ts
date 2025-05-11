import {
  ApprovalStatus,
  FoodCategory,
  FoodSpot,
  Review,
  Vote,
  VoteType,
} from '@prisma/client';

export type TFoodSpot = FoodSpot;
export type TReview = Review;
export type TVote = Vote;

export interface IFoodSpotFilters {
  searchTerm?: string;
  category?: FoodCategory;
  minPrice?: number;
  maxPrice?: number;
  isPremium?: boolean;
}

export interface ICreateFoodSpot {
  title: string;
  description: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  category: FoodCategory;
  image: string;
  isPremium?: boolean;
}

export interface IUpdateFoodSpot {
  title?: string;
  description?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: FoodCategory;
  image?: string;
  isPremium?: boolean;
  approvalStatus?: ApprovalStatus;
  rejectionReason?: string;
}

export interface ICreateReview {
  rating: number;
  comment: string;
}

export interface ICreateVote {
  type: VoteType;
}

export interface IUpdateApproval {
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
}

export type IFoodspotFilterRequest = {
  searchTerm?: string;
  priceRange?: string;
  category?: string;
  averageRating?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
};
