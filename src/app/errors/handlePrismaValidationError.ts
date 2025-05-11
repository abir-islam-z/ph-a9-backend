import { TGenericErrorResponse } from '../interface/error';

/**
 * Handles Prisma validation errors by parsing the error message to extract useful information
 */
const handlePrismaValidationError = (err: Error): TGenericErrorResponse => {
  const statusCode = 400;
  const message = 'Validation error in database query';

  // Extract the model name and field name from the error message if possible
  let errorMessage = err.message;
  let path = '';

  // Try to extract model name from the error message
  const modelMatch = errorMessage.match(
    /Invalid.*invocation in\n.*\/(.*?)\.ts/,
  );
  if (modelMatch && modelMatch[1]) {
    path = modelMatch[1];
  }

  // For empty string in enum fields, provide more helpful message
  if (
    errorMessage.includes('Invalid value for argument `equals`') &&
    errorMessage.includes('Expected')
  ) {
    const enumTypeMatch = errorMessage.match(/Expected ([A-Za-z]+)/);
    const enumType = enumTypeMatch ? enumTypeMatch[1] : 'enum value';

    errorMessage = `Invalid or empty value provided for ${enumType} field. Please provide a valid enum value or remove the parameter from your request.`;
  }

  return {
    statusCode,
    message,
    errorSources: [
      {
        path,
        message: errorMessage,
      },
    ],
  };
};

export default handlePrismaValidationError;
