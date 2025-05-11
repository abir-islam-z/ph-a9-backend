/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionPlan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the subscription plan
 *         name:
 *           type: string
 *           description: Name of the subscription plan
 *         description:
 *           type: string
 *           description: Detailed description of the plan
 *         price:
 *           type: number
 *           description: Price of the subscription plan
 *         durationInDays:
 *           type: number
 *           description: Duration of the plan in days
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: List of features included in the plan
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the plan was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the plan was last updated
 *       example:
 *         id: "c7c6e11a-23b0-4d1c-b76f-fab4705f2598"
 *         name: "Premium Monthly"
 *         description: "Access to all premium features for one month"
 *         price: 9.99
 *         durationInDays: 30
 *         features: ["Ad-free experience", "Priority support", "Download content"]
 *         createdAt: "2023-01-01T00:00:00Z"
 *         updatedAt: "2023-01-01T00:00:00Z"
 *
 *     SubscriptionHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the subscription transaction
 *         userId:
 *           type: string
 *           description: ID of the user who purchased the subscription
 *         planId:
 *           type: string
 *           description: ID of the subscription plan purchased
 *         transactionId:
 *           type: string
 *           description: Payment gateway transaction ID
 *         status:
 *           type: string
 *           enum: [INITIATED, PENDING, SUCCESS, FAILED, CANCELLED]
 *           description: Status of the subscription transaction
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: When the subscription starts
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: When the subscription ends
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the transaction was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the transaction was last updated
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         userId: "123e4567-e89b-12d3-a456-426614174000"
 *         planId: "c7c6e11a-23b0-4d1c-b76f-fab4705f2598"
 *         transactionId: "txn_12345"
 *         status: "SUCCESS"
 *         startDate: "2025-01-01T00:00:00Z"
 *         endDate: "2025-02-01T00:00:00Z"
 *         createdAt: "2025-01-01T00:00:00Z"
 *         updatedAt: "2025-01-01T00:00:00Z"
 *
 *     InitiateSubscription:
 *       type: object
 *       required:
 *         - planId
 *       properties:
 *         planId:
 *           type: string
 *           description: ID of the subscription plan to purchase
 *       example:
 *         planId: "c7c6e11a-23b0-4d1c-b76f-fab4705f2598"
 */

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription plan and payment management
 */

/**
 * @swagger
 * /subscriptions/plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of subscription plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubscriptionPlan'
 */

/**
 * @swagger
 * /subscriptions/plans/{id}:
 *   get:
 *     summary: Get subscription plan by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscription plan ID
 *     responses:
 *       200:
 *         description: Subscription plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SubscriptionPlan'
 *       404:
 *         description: Subscription plan not found
 */

/**
 * @swagger
 * /subscriptions/initiate:
 *   post:
 *     summary: Initiate a subscription purchase
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InitiateSubscription'
 *     responses:
 *       200:
 *         description: Subscription initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentUrl:
 *                       type: string
 *                       description: URL to redirect user for payment
 *       400:
 *         description: Bad request
 *       404:
 *         description: Subscription plan not found
 */

/**
 * @swagger
 * /subscriptions/history:
 *   get:
 *     summary: Get user's subscription history
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubscriptionHistory'
 */

/**
 * @swagger
 * /subscriptions/payment-callback:
 *   get:
 *     summary: Handle payment gateway callback
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: query
 *         name: order_id
 *         schema:
 *           type: string
 *         description: Order ID from payment gateway
 *       - in: query
 *         name: payment_status
 *         schema:
 *           type: string
 *         description: Payment status from gateway
 *     responses:
 *       302:
 *         description: Redirect to success or failure page
 */
