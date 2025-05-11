export const FOOD_CATEGORIES = [
  'SNACKS',
  'MEALS',
  'SWEETS',
  'DRINKS',
  'BREAKFAST',
  'LUNCH',
  'DINNER',
  'DESSERTS',
  'STREET_FOOD',
] as const;

export const FoodCategories = {
  SNACKS: 'SNACKS' as const,
  MEALS: 'MEALS' as const,
  SWEETS: 'SWEETS' as const,
  DRINKS: 'DRINKS' as const,
  BREAKFAST: 'BREAKFAST' as const,
  LUNCH: 'LUNCH' as const,
  DINNER: 'DINNER' as const,
  DESSERTS: 'DESSERTS' as const,
  STREET_FOOD: 'STREET_FOOD' as const,
};

export const APPROVAL_STATUS = [
  'PENDING',
  'APPROVED',
  'REJECTED',
] as const;

export const ApprovalStatus = {
  PENDING: 'PENDING' as const,
  APPROVED: 'APPROVED' as const,
  REJECTED: 'REJECTED' as const,
};

export const VOTE_TYPES = ['UPVOTE', 'DOWNVOTE'] as const;

export const VoteTypes = {
  UPVOTE: 'UPVOTE' as const,
  DOWNVOTE: 'DOWNVOTE' as const,
};