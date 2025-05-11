# Street Food Finder API

A comprehensive REST API for a street food discovery application built with Express.js, TypeScript, and PostgreSQL.

## Features

- User authentication and authorization with JWT
- Food spot management (CRUD operations)
- Review and voting system
- Premium content access control
- Payment integration (Shurjopay)
- API documentation with Swagger
- Error handling and validation
- Role-based access control (admin/user/premium)

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Payment**: Shurjopay integration
- **File Storage**: Cloudinary
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```
# ENV
NODE_ENV=development

# Server Config
PORT=5000

#  DB
DATABASE_URL="postgresql://user:password@localhost:5432/streetfoodfinder?schema=public"

# JWT
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=your_access_secret_key
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Shurjopay config
SP_ENDPOINT=shurjopay_endpoint
SP_USERNAME=shurjopay_username
SP_PASSWORD=shurjopay_password
SP_PREFIX=shurjopay_prefix
SP_RETURN_URL=return_url
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Start the development server:

```bash
npm run start:dev
```

7. Production build:

```bash
npm run build
npm run start:prod
```

## API Documentation

The API documentation is available through Swagger UI at:

```
http://localhost:5000/api-docs
```

You can also access the raw OpenAPI specification at:

```
http://localhost:5000/api-docs.json
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get access token
- `POST /api/v1/auth/change-password` - Change user password (requires authentication)
- `POST /api/v1/auth/refresh-token` - Refresh access token (requires refresh token)

### Food Spots

- `GET /api/v1/foodspots` - Get all food spots
- `GET /api/v1/foodspots/:id` - Get a food spot by ID
- `POST /api/v1/foodspots` - Add a new food spot (requires authentication)
- `PATCH /api/v1/foodspots/:id` - Update a food spot (requires ownership or admin)
- `DELETE /api/v1/foodspots/:id` - Delete a food spot (requires ownership or admin)
- `POST /api/v1/foodspots/:id/reviews` - Add a review to a food spot
- `POST /api/v1/foodspots/:id/votes` - Add a vote to a food spot

### Admin Routes

- `GET /api/v1/foodspots/admin/pending` - Get all pending food spots (admin only)
- `PATCH /api/v1/foodspots/admin/:id/approval` - Update approval status (admin only)

### Subscriptions

- `POST /api/v1/subscription/create-payment` - Create a payment for premium subscription
- `GET /api/v1/subscription/verify-payment` - Verify payment status

### Project Structure

```
src/
  app/
    builder/                 # Query builder for database queries
    config/                  # Application configuration
      swagger.ts            # Swagger configuration
    errors/                  # Error handling utilities
    interface/               # TypeScript interfaces
    middlewares/             # Express middlewares
    modules/                 # Feature modules (auth, users, foodspots, etc.)
    routes/                  # API routes
    templates/               # HTML templates
    utils/                   # Utility functions
  app.ts                     # Express app setup
  server.ts                  # Server entry point
```

### Deployment

The Application is deployed on Vercel. To deploy the application, follow these steps:

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy to Vercel:
   ```bash
   vercel
   ```
