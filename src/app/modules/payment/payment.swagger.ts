/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - planId
 *         - amount
 *         - durationInDays
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier for the payment
 *         userId:
 *           type: string
 *           description: ID of the user making the payment
 *         planId:
 *           type: string
 *           description: ID of the subscription plan
 *         amount:
 *           type: number
 *           description: Payment amount
 *         currency:
 *           type: string
 *           description: Payment currency code
 *           default: BDT
 *         paymentMethod:
 *           type: string
 *           description: Method of payment (e.g., SSL Commerz, Credit Card)
 *         transactionId:
 *           type: string
 *           description: Payment gateway transaction ID
 *         status:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED, CANCELLED]
 *           description: Current status of the payment
 *         durationInDays:
 *           type: number
 *           description: Duration of the subscription in days
 *         gatewayData:
 *           type: object
 *           description: Additional data from the payment gateway
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Time when the payment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Time when the payment was last updated
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         userId: "98765432-10fe-cba9-8765-4321fedcba98"
 *         planId: "c7c6e11a-23b0-4d1c-b76f-fab4705f2598"
 *         amount: 499
 *         currency: "BDT"
 *         paymentMethod: "SSL Commerz"
 *         transactionId: "SSLCZ_TXN_6421a54bc3167"
 *         status: "COMPLETED"
 *         durationInDays: 30
 *         createdAt: "2023-01-15T12:00:00Z"
 *         updatedAt: "2023-01-15T12:15:00Z"
 *
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
 *         price: 499
 *         durationInDays: 30
 *         features: ["Ad-free experience", "Priority support", "Premium food spots"]
 *         createdAt: "2023-01-01T00:00:00Z"
 *         updatedAt: "2023-01-01T00:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment and subscription plans API
 */

/**
 * @swagger
 * /payments/plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Payments]
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
 *                     $ref: '#/components/schemas/SubscriptionPlan'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments (Admin only)
 *     tags: [Payments]
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
 *                     $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /payments/my-payments:
 *   get:
 *     summary: Get authenticated user's payment history
 *     tags: [Payments]
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
 *                     $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /payments/create-payment:
 *   post:
 *     summary: Create a new payment to purchase a subscription
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *               - amount
 *               - durationInDays
 *             properties:
 *               planId:
 *                 type: string
 *                 description: ID of the subscription plan
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               currency:
 *                 type: string
 *                 description: Payment currency
 *                 default: BDT
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method
 *               durationInDays:
 *                 type: number
 *                 description: Duration of subscription in days
 *     responses:
 *       200:
 *         description: Payment initiated successfully
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
 *                   properties:
 *                     paymentUrl:
 *                       type: string
 *                       description: URL to redirect the user to complete payment
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /payments/success:
 *   get:
 *     summary: SSL Commerz payment success callback URL
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: transactionId
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment transaction ID
 *     responses:
 *       302:
 *         description: Redirect to success page
 *       400:
 *         description: Invalid transaction
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /payments/ipn:
 *   post:
 *     summary: SSL Commerz IPN (Instant Payment Notification) endpoint
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tran_id:
 *                 type: string
 *                 description: Transaction ID
 *               status:
 *                 type: string
 *                 description: Payment status
 *     responses:
 *       200:
 *         description: IPN processed successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
