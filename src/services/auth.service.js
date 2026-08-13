const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDAO = require('../dao/user.dao');

class AuthService {
  /**
   * Register a new user
   * @param {Object} param0 
   * @returns {Promise<Object>} Object containing user info and JWT token
   */
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await userDAO.findUserByEmail(email);
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userDAO.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Authenticate a user and generate token
   * @param {Object} param0 
   * @returns {Promise<Object>} Object containing user info and JWT token
   */
  async login({ email, password }) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const user = await userDAO.findUserByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Helper function to generate JWT token
   * @param {Object} user 
   * @returns {string} JWT Token
   */
  generateToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET || 'default_jwt_secret_key';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    return jwt.sign(payload, secret, { expiresIn });
  }
}

module.exports = new AuthService();
