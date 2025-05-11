/**
 * @swagger
 * components:
 *   schemas:
 *     Vote:
 *       type: object
 *       required:
 *         - type
 *         - foodSpotId
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier for the vote
 *         type:
 *           type: string
 *           enum: [UPVOTE, DOWNVOTE]
 *           description: Type of vote (upvote or downvote)
 *         foodSpotId:
 *           type: string
 *           description: ID of the food spot being voted on
 *         userId:
 *           type: string
 *           description: ID of the user who cast the vote
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Time when the vote was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Time when the vote was last updated
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         type: "UPVOTE"
 *         foodSpotId: "123e4567-e89b-12d3-a456-426614174000"
 *         userId: "98765432-10fe-cba9-8765-4321fedcba98"
 *         createdAt: "2023-01-15T12:00:00Z"
 *         updatedAt: "2023-01-15T12:00:00Z"
 *
 *     CreateVote:
 *       type: object
 *       required:
 *         - type
 *         - foodSpotId
 *       properties:
 *         type:
 *           type: string
 *           enum: [UPVOTE, DOWNVOTE]
 *           description: Type of vote
 *         foodSpotId:
 *           type: string
 *           description: ID of the food spot to vote on
 *       example:
 *         type: "UPVOTE"
 *         foodSpotId: "123e4567-e89b-12d3-a456-426614174000"
 */

/**
 * @swagger
 * tags:
 *   name: Votes
 *   description: Vote management API
 */

/**
 * @swagger
 * /votes:
 *   get:
 *     summary: Get all votes (Admin only)
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
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
 *                     $ref: '#/components/schemas/Vote'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create or update a vote
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVote'
 *     responses:
 *       200:
 *         description: Vote created or updated successfully
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
 *                   $ref: '#/components/schemas/Vote'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Food spot not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /votes/user/my-votes:
 *   get:
 *     summary: Get all votes cast by the authenticated user
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
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
 *                     $ref: '#/components/schemas/Vote'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /votes/food-spot/{foodSpotId}:
 *   get:
 *     summary: Get all votes for a specific food spot
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: foodSpotId
 *         schema:
 *           type: string
 *         required: true
 *         description: Food Spot ID
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
 *                     $ref: '#/components/schemas/Vote'
 *       404:
 *         description: Food spot not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /votes/{foodSpotId}:
 *   delete:
 *     summary: Delete a user's vote for a specific food spot
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodSpotId
 *         schema:
 *           type: string
 *         required: true
 *         description: Food Spot ID
 *     responses:
 *       200:
 *         description: Vote deleted successfully
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
 *       404:
 *         description: Vote not found
 *       500:
 *         description: Server error
 */
