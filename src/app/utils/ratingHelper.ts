/**
 * Helper functions for handling ratings
 */
export const ratingHelper = {
  /**
   * Calculate average rating from an array of reviews
   * @param reviews Array of review objects with a rating property
   * @returns Average rating value (0 if no reviews)
   */
  calculateAverage: <T extends { rating: number }>(reviews: T[]): number => {
    if (!reviews.length) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  },

  /**
   * Transform items (food spots, products, etc.) by adding rating stats
   * @param items Array of items with a reviews property
   * @returns Transformed items with rating stats
   */
  addRatingStats: <T extends { reviews: { rating: number }[] }>(
    items: T[],
  ): (Omit<T, 'reviews'> & {
    averageRating: number;
    reviewCount: number;
  })[] => {
    return items.map(item => {
      const averageRating = ratingHelper.calculateAverage(item.reviews);
      return {
        ...item,
        reviews: undefined,
        averageRating,
        reviewCount: item.reviews.length,
      };
    });
  },
};
