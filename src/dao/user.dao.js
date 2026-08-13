const User = require('../models/user.model');

class UserDAO {
  /**
   * Create a new user in the database
   * @param {Object} userData 
   * @returns {Promise<Object>} Created user document
   */
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find a user by email address
   * @param {string} email 
   * @returns {Promise<Object|null>} Found user document or null
   */
  async findUserByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  /**
   * Find a user by ID
   * @param {string} id 
   * @returns {Promise<Object|null>} Found user document or null
   */
  async findUserById(id) {
    return await User.findById(id);
  }
}

module.exports = new UserDAO();
