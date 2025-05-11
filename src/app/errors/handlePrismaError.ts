import { Prisma } from '@prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  let statusCode = 400;
  let message = 'Database error occurred';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Database operation failed',
    },
  ];

  // Handle specific Prisma error codes
  // Reference: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
  switch (err.code) {
    case 'P2002': // Unique constraint failed
      statusCode = 409; // Conflict
      message = 'Duplicate entry error';
      errorSources = [
        {
          path: (err.meta?.target as string[])?.join('.') || '',
          message: `Unique constraint violation. The value already exists.`,
        },
      ];
      break;

    case 'P2003': // Foreign key constraint failed
      statusCode = 400;
      message = 'Foreign key constraint failed';
      errorSources = [
        {
          path: (err.meta?.field_name as string) || '',
          message: `Foreign key constraint failed on the field: ${err.meta?.field_name as string}`,
        },
      ];
      break;

    case 'P2025': // Record not found
      statusCode = 404;
      message = 'Record not found';
      errorSources = [
        {
          path: err.meta?.modelName?.toString() || '',
          message:
            err.meta?.cause?.toString() ||
            'The requested record does not exist',
        },
      ];
      break;

    case 'P2023': // Inconsistent column data
      statusCode = 400;
      message = 'Data validation error';
      errorSources = [
        {
          path: '',
          message: 'Invalid input data format',
        },
      ];
      break;
      break;

    case 'P2014': // The provided value violates a required relation
      statusCode = 400;
      message = 'Invalid relation';
      errorSources = [
        {
          path: err.meta?.relation_name?.toString() || '',
          message: `Invalid relation: ${err.meta?.relation_name?.toString() || 'relation error'}`,
        },
      ];
      break;

    case 'P2015': // Related record not found
      statusCode = 404;
      message = 'Related record not found';
      errorSources = [
        {
          path: '',
          message: `Related record not found: ${err.meta?.details || ''}`,
        },
      ];
      break;

    default:
      statusCode = 500;
      message = 'Database error';
      errorSources = [
        {
          path: '',
          message:
            err.message || 'Something went wrong with the database operation',
        },
      ];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaError;
