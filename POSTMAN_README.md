# API Testing with Postman

This folder contains Postman collection and environment files for testing the Food Spot API.

## Files

- `postman_collection.json`: Contains all API endpoints organized by module
- `postman_environment.json`: Contains environment variables like baseUrl and token

## How to Use

1. Install [Postman](https://www.postman.com/downloads/)
2. Import the collection file (`postman_collection.json`)
3. Import the environment file (`postman_environment.json`)
4. Select the "Food Spot API Environment" from the environment dropdown
5. Start testing the API endpoints

## Authentication

For protected endpoints, you need to:

1. Use the "Login User" endpoint to authenticate
2. Copy the token from the response
3. Paste it into the `token` environment variable

## API Endpoint Categories

All API endpoints follow the format `/api/v1/{resource}`, for example:

- **Auth**: `/api/v1/auth/login`, `/api/v1/auth/register`, etc.
- **Food Spots**: Create, read, update, delete food spots
- **Reviews**: Add and view reviews for food spots
- **Votes**: Upvote/downvote food spots
- **Payments**: Create and manage payments
- **Subscription**: Manage user subscriptions
- **Users**: User profile management

## Base URL

The default base URL is set to `http://localhost:5000`. You can change this in the environment variables if your server runs on a different host or port.
