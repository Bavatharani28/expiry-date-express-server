const Product = require('../models/product.model');

class ProductDAO {
  /**
   * Create a new product in the database
   * @param {Object} productData
   * @returns {Promise<Object>} Created product document
   */
  async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  /**
   * Find products for a specific user with pagination, search, and date filtering
   * @param {string} userId - The owner's user ID
   * @param {Object} options - Query options
   * @param {string} [options.search] - Text search query (title or UPC)
   * @param {number} [options.expiryWithin] - Filter products expiring within N days
   * @param {number} [options.page] - Page number (1-indexed)
   * @param {number} [options.limit] - Items per page
   * @returns {Promise<Array>} Array of product documents
   */
  async findProductsByUser(userId, { search, expiryWithin, page = 1, limit = 20 } = {}) {
    const query = { userId };

    // Text search filter
    if (search && search.trim()) {
      // Use regex for partial matching (more flexible than $text for partial words)
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { upcCode: searchRegex },
      ];
    }

    // Expiry date range filter
    if (expiryWithin && !isNaN(expiryWithin)) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const futureDate = new Date(now);
      futureDate.setDate(futureDate.getDate() + parseInt(expiryWithin, 10));

      query.expiryDate = {
        $lte: futureDate,
      };
    }

    const skip = (page - 1) * limit;

    return await Product.find(query)
      .sort({ expiryDate: 1 }) // Nearest expiry first
      .skip(skip)
      .limit(limit)
      .lean();
  }

  /**
   * Count total products matching filters for pagination metadata
   * @param {string} userId
   * @param {Object} options - Same filter options as findProductsByUser
   * @returns {Promise<number>} Total count
   */
  async countProductsByUser(userId, { search, expiryWithin } = {}) {
    const query = { userId };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { upcCode: searchRegex },
      ];
    }

    if (expiryWithin && !isNaN(expiryWithin)) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const futureDate = new Date(now);
      futureDate.setDate(futureDate.getDate() + parseInt(expiryWithin, 10));

      query.expiryDate = {
        $lte: futureDate,
      };
    }

    return await Product.countDocuments(query);
  }

  /**
   * Find a single product by its ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async findProductById(id) {
    return await Product.findById(id).lean();
  }

  /**
   * Update a product by ID
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Object|null>} Updated product document
   */
  async updateProduct(id, updateData) {
    return await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  /**
   * Delete a product by ID
   * @param {string} id
   * @returns {Promise<Object|null>} Deleted product document
   */
  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id).lean();
  }
}

module.exports = new ProductDAO();
