const productService = require('../services/product.service');

class ProductController {
  /**
   * List products with pagination, search, and filters
   * Route: GET /products
   * Query params: page, limit, search, expiryWithin
   */
  async listProducts(req, res) {
    try {
      const userId = req.user.id;
      const result = await productService.listProducts(userId, req.query);

      return res.status(200).json({
        status: 'success',
        message: 'Products retrieved successfully',
        data: result,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Internal Server Error',
      });
    }
  }

  /**
   * Add a new product
   * Route: POST /products
   */
  async addProduct(req, res) {
    try {
      const userId = req.user.id;
      const product = await productService.addProduct(userId, req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Product added successfully',
        data: { product },
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Internal Server Error',
      });
    }
  }

  /**
   * Update an existing product
   * Route: PUT /products/:id
   */
  async editProduct(req, res) {
    try {
      const userId = req.user.id;
      const productId = req.params.id;
      const product = await productService.editProduct(userId, productId, req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: { product },
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Internal Server Error',
      });
    }
  }

  /**
   * Delete a product
   * Route: DELETE /products/:id
   */
  async deleteProduct(req, res) {
    try {
      const userId = req.user.id;
      const productId = req.params.id;
      await productService.removeProduct(userId, productId);

      return res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Internal Server Error',
      });
    }
  }
}

module.exports = new ProductController();
