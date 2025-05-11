/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';

/**
 * A utility for building consistent query conditions with type safety
 */
export class QueryBuilder {
  /**
   * Builds search conditions for text fields
   * @param searchTerm The search term to look for
   * @param searchableFields Array of field names to search in
   * @returns A Prisma condition object for the search
   */
  static search(
    searchTerm: string | undefined,
    searchableFields: string[],
  ): Prisma.PrismaClientKnownRequestError | object {
    if (!searchTerm) return {};

    return {
      OR: searchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    };
  }

  /**
   * Builds filter conditions based on provided filter object
   * @param filterData Object containing filter key-value pairs
   * @returns A Prisma condition object for filtering
   */
  static filter(filterData: Record<string, unknown>): object {
    if (Object.keys(filterData).length === 0) return {};

    const validFilters = Object.entries(filterData).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined,
    );

    if (validFilters.length === 0) return {};

    return {
      AND: validFilters.map(([key, value]) => ({
        [key]: {
          equals: value,
        },
      })),
    };
  }

  /**
   * Builds a combined where condition from multiple conditions
   * @param conditions Array of condition objects
   * @returns A single combined where condition
   */
  static where(conditions: object[]): object {
    const validConditions = conditions.filter(
      condition => Object.keys(condition).length > 0,
    );

    return validConditions.length > 0 ? { AND: validConditions } : {};
  }

  /**
   * Builds a date range condition
   * @param fieldName The date field name
   * @param startDate Starting date
   * @param endDate Ending date
   * @returns A Prisma condition object for date range
   */
  static dateRange(
    fieldName: string,
    startDate?: string | Date,
    endDate?: string | Date,
  ): object {
    const conditions = [];

    if (startDate) {
      conditions.push({
        [fieldName]: {
          gte: new Date(startDate),
        },
      });
    }

    if (endDate) {
      conditions.push({
        [fieldName]: {
          lte: new Date(endDate),
        },
      });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  }

  /**
   * Builds a number range condition
   * @param fieldName The number field name
   * @param min Minimum value
   * @param max Maximum value
   * @returns A Prisma condition object for number range
   */
  static numberRange(fieldName: string, min?: number, max?: number): object {
    const conditions = [];

    if (min !== undefined) {
      conditions.push({
        [fieldName]: {
          gte: min,
        },
      });
    }

    if (max !== undefined) {
      conditions.push({
        [fieldName]: {
          lte: max,
        },
      });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  }
}
