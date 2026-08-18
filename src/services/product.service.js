const productDAO = require('../dao/product.dao');

class ProductService {
  /**
   * List products for a user with pagination, search, and filter
   * @param {string} userId
   * @param {Object} queryParams - { search, expiryWithin, page, limit }
   * @returns {Promise<Object>} { products, page, totalPages, totalCount }
   */
  async listProducts(userId, queryParams = {}) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit, 10) || 20));
    const search = queryParams.search || '';
    const expiryWithin = queryParams.expiryWithin || null;

    const filterOpts = { search, expiryWithin, page, limit };

    const [products, totalCount] = await Promise.all([
      productDAO.findProductsByUser(userId, filterOpts),
      productDAO.countProductsByUser(userId, filterOpts),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
      products,
      page,
      limit,
      totalPages,
      totalCount,
    };
  }

  /**
   * Add a new product for a user
   * @param {string} userId
   * @param {Object} body - Product data from request body
   * @returns {Promise<Object>} Created product
   */
  async addProduct(userId, body) {
    const { title, upcCode, category, expiryDate, quantity, price, notes } = body;

    if (!title || !title.trim()) {
      const error = new Error('Product title is required');
      error.statusCode = 400;
      throw error;
    }

    if (!expiryDate) {
      const error = new Error('Expiry date is required');
      error.statusCode = 400;
      throw error;
    }

    const productData = {
      userId,
      title: title.trim(),
      upcCode: upcCode ? upcCode.trim() : '',
      category: category || 'Groceries',
      expiryDate: new Date(expiryDate),
      quantity: parseInt(quantity, 10) || 1,
      price: parseFloat(price) || 0,
      notes: notes ? notes.trim() : '',
    };

    return await productDAO.createProduct(productData);
  }

  /**
   * Edit an existing product (with ownership verification)
   * @param {string} userId
   * @param {string} productId
   * @param {Object} body - Fields to update
   * @returns {Promise<Object>} Updated product
   */
  async editProduct(userId, productId, body) {
    // Verify the product exists and belongs to this user
    const existing = await productDAO.findProductById(productId);

    if (!existing) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (existing.userId.toString() !== userId.toString()) {
      const error = new Error('Unauthorized: You do not own this product');
      error.statusCode = 403;
      throw error;
    }

    // Build update object only with provided fields
    const updateData = {};
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.upcCode !== undefined) updateData.upcCode = body.upcCode.trim();
    if (body.category !== undefined) updateData.category = body.category;
    if (body.expiryDate !== undefined) updateData.expiryDate = new Date(body.expiryDate);
    if (body.quantity !== undefined) updateData.quantity = parseInt(body.quantity, 10) || 1;
    if (body.price !== undefined) updateData.price = parseFloat(body.price) || 0;
    if (body.notes !== undefined) updateData.notes = body.notes.trim();

    if (Object.keys(updateData).length === 0) {
      const error = new Error('No fields to update');
      error.statusCode = 400;
      throw error;
    }

    return await productDAO.updateProduct(productId, updateData);
  }

  /**
   * Remove a product (with ownership verification)
   * @param {string} userId
   * @param {string} productId
   * @returns {Promise<Object>} Deleted product
   */
  async removeProduct(userId, productId) {
    const existing = await productDAO.findProductById(productId);

    if (!existing) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (existing.userId.toString() !== userId.toString()) {
      const error = new Error('Unauthorized: You do not own this product');
      error.statusCode = 403;
      throw error;
    }

    return await productDAO.deleteProduct(productId);
  }
}

module.exports = new ProductService();
