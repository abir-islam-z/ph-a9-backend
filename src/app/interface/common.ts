export interface IMetaResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  meta: IMetaResponse;
  data: T[];
}

/**
 * Calculates metadata for paginated responses
 * @param page Current page number
 * @param limit Items per page
 * @param total Total number of items
 * @returns Metadata object for pagination
 */
export const calculateMeta = (
  page: number,
  limit: number,
  total: number,
): IMetaResponse => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};
