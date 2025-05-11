import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserRoles } from '../user/user.constant';
import { FoodSpotController } from './foodspot.controller';
import { FoodSpotValidation } from './foodspot.validation';

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    FoodSpot:
 *      type: object
 *      required:
 *        - title
 *        - description
 *        - location
 *        - minPrice
 *        - maxPrice
 *        - category
 *        - image
 *      properties:
 *        id:
 *          type: string
 *          description: Auto-generated unique identifier
 *        title:
 *          type: string
 *          description: Title of the food spot
 *        description:
 *          type: string
 *          description: Detailed description of the food spot
 *        location:
 *          type: string
 *          description: Physical location/address of the food spot
 *        minPrice:
 *          type: number
 *          description: Minimum price of food items
 *        maxPrice:
 *          type: number
 *          description: Maximum price of food items
 *        category:
 *          type: string
 *          enum: [SNACKS, MEALS, SWEETS, DRINKS, BREAKFAST, LUNCH, DINNER, DESSERTS, STREET_FOOD]
 *          description: Category of the food spot
 *        image:
 *          type: string
 *          description: URL to the food spot image
 *        approvalStatus:
 *          type: string
 *          enum: [PENDING, APPROVED, REJECTED]
 *          description: Approval status of the food spot
 *        isPremium:
 *          type: boolean
 *          description: Whether this is a premium food spot
 *        rejectionReason:
 *          type: string
 *          description: Reason for rejection if applicable
 *        totalRating:
 *          type: number
 *          description: Sum of all ratings
 *        totalUpvotes:
 *          type: number
 *          description: Total number of upvotes
 *        totalDownvotes:
 *          type: number
 *          description: Total number of downvotes
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: Time when the record was created
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          description: Time when the record was last updated
 *      example:
 *        id: "123e4567-e89b-12d3-a456-426614174000"
 *        title: "Street Corner Shawarma"
 *        description: "Authentic Middle Eastern shawarma wraps and platters"
 *        location: "123 Street Corner, Gulshan, Dhaka"
 *        minPrice: 120
 *        maxPrice: 350
 *        category: "STREET_FOOD"
 *        image: "https://example.com/images/shawarma.jpg"
 *        approvalStatus: "APPROVED"
 *        isPremium: false
 *        totalRating: 4.5
 *        totalUpvotes: 27
 *        totalDownvotes: 3
 *
 *    Review:
 *      type: object
 *      required:
 *        - rating
 *        - comment
 *      properties:
 *        rating:
 *          type: number
 *          minimum: 1
 *          maximum: 5
 *          description: Rating from 1 to 5
 *        comment:
 *          type: string
 *          description: Review comment
 *      example:
 *        rating: 4.5
 *        comment: "Excellent food and friendly service!"
 *
 *    Vote:
 *      type: object
 *      required:
 *        - type
 *      properties:
 *        type:
 *          type: string
 *          enum: [UPVOTE, DOWNVOTE]
 *          description: Type of vote
 *      example:
 *        type: "UPVOTE"
 *
 *    ApprovalStatus:
 *      type: object
 *      required:
 *        - status
 *      properties:
 *        status:
 *          type: string
 *          enum: [APPROVED, REJECTED]
 *          description: New approval status
 *        rejectionReason:
 *          type: string
 *          description: Reason for rejection (required if status is REJECTED)
 *      example:
 *        status: "APPROVED"
 */

/**
 * @swagger
 * tags:
 *   name: FoodSpots
 *   description: Food spot management API
 */

/**
 * @swagger
 * /foodspots:
 *   get:
 *     summary: Get all food spots
 *     tags: [FoodSpots]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search in title, description, location
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FoodSpot'
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new food spot
 *     tags: [FoodSpots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - minPrice
 *               - maxPrice
 *               - category
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               minPrice:
 *                 type: number
 *               maxPrice:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [SNACKS, MEALS, SWEETS, DRINKS, BREAKFAST, LUNCH, DINNER, DESSERTS, STREET_FOOD]
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Food spot created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/FoodSpot'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/', FoodSpotController.getAllFoodSpots);

/**
 * @swagger
 * /foodspots/{id}:
 *   get:
 *     summary: Get a food spot by ID
 *     tags: [FoodSpots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food spot ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/FoodSpot'
 *       404:
 *         description: Food spot not found
 *       500:
 *         description: Server error
 */
router.get('/:id', FoodSpotController.getFoodSpotById);

// User routes (require authentication)
router.post(
  '/',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(FoodSpotValidation.createFoodSpotValidationSchema),
  FoodSpotController.createFoodSpot,
);

/**
 * @swagger
 * /foodspots/user/my-food-spots:
 *   get:
 *     summary: Get food spots created by the authenticated user
 *     tags: [FoodSpots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FoodSpot'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/user/my-food-spots',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  FoodSpotController.getUserFoodSpots,
);

/**
 * @swagger
 * /foodspots/{id}:
 *   patch:
 *     summary: Update a food spot
 *     tags: [FoodSpots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food spot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               minPrice:
 *                 type: number
 *               maxPrice:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [SNACKS, MEALS, SWEETS, DRINKS, BREAKFAST, LUNCH, DINNER, DESSERTS, STREET_FOOD]
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Food spot updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/FoodSpot'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Food spot not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a food spot
 *     tags: [FoodSpots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food spot ID
 *     responses:
 *       200:
 *         description: Food spot deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Food spot not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(FoodSpotValidation.updateFoodSpotValidationSchema),
  FoodSpotController.updateFoodSpot,
);

router.delete(
  '/:id',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  FoodSpotController.deleteFoodSpot,
);

/**
 * @swagger
 * /foodspots/{id}/reviews:
 *   post:
 *     summary: Add a review to a food spot
 *     tags: [FoodSpots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food spot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Food spot not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/reviews',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(FoodSpotValidation.reviewValidationSchema),
  FoodSpotController.addReview,
);

/**
 * @swagger
 * /foodspots/{id}/votes:
 *   post:
 *     summary: Add a vote to a food spot
 *     tags: [FoodSpots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food spot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vote'
 *     responses:
 *       201:
 *         description: Vote added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Food spot not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/votes',
  auth(UserRoles.USER, UserRoles.PREMIUM, UserRoles.ADMIN),
  validateRequest(FoodSpotValidation.voteValidationSchema),
  FoodSpotController.addVote,
);

/**
 * @swagger
 * /foodspots/admin/pending:
 *   get:
 *     summary: Get all pending food spots (Admin only)
 *     tags: [FoodSpots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FoodSpot'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  '/admin/pending',
  auth(UserRoles.ADMIN),
  FoodSpotController.getPendingFoodSpots,
);

/**
 * @swagger
 * /foodspots/admin/{id}/approval:
 *   patch:
 *     summary: Update approval status of a food spot (Admin only)
 *     tags: [FoodSpots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food spot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApprovalStatus'
 *     responses:
 *       200:
 *         description: Approval status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/FoodSpot'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Food spot not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/admin/:id/approval',
  auth(UserRoles.ADMIN),
  validateRequest(FoodSpotValidation.approvalValidationSchema),
  FoodSpotController.updateApprovalStatus,
);

export const FoodSpotRoutes = router;
