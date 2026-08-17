const express = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All product routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductRequest:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - expiryDate
 *       properties:
 *         title:
 *           type: string
 *           example: Organic Greek Yogurt 500g
 *         upcCode:
 *           type: string
 *           example: "012345678905"
 *         category:
 *           type: string
 *           enum: [Groceries, Dairy, Bakery, Produce, Medicine, Cosmetics, Pantry]
 *           example: Dairy
 *         expiryDate:
 *           type: string
 *           format: date
 *           example: "2026-09-15"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         notes:
 *           type: string
 *           example: Keep refrigerated
 *     ProductResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65d4b8f3e21a9c0012345678
 *         userId:
 *           type: string
 *           example: 65d4b8f3e21a9c0012345670
 *         title:
 *           type: string
 *           example: Organic Greek Yogurt 500g
 *         upcCode:
 *           type: string
 *           example: "012345678905"
 *         category:
 *           type: string
 *           example: Dairy
 *         expiryDate:
 *           type: string
 *           format: date-time
 *         quantity:
 *           type: integer
 *           example: 2
 *         notes:
 *           type: string
 *           example: Keep refrigerated
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedProductsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Products retrieved successfully
 *         data:
 *           type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductResponse'
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 20
 *             totalPages:
 *               type: integer
 *               example: 3
 *             totalCount:
 *               type: integer
 *               example: 47
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List user's products with pagination, search, and filters
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page (max 50)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product title or UPC code
 *       - in: query
 *         name: expiryWithin
 *         schema:
 *           type: integer
 *         description: Filter products expiring within N days (e.g., 7, 30, 90)
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProductsResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (req, res, next) => productController.listProducts(req, res, next));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Product added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', (req, res, next) => productController.addProduct(req, res, next));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/ProductResponse'
 *       403:
 *         description: Unauthorized - Not the product owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', (req, res, next) => productController.editProduct(req, res, next));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       403:
 *         description: Unauthorized - Not the product owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', (req, res, next) => productController.deleteProduct(req, res, next));

module.exports = router;
