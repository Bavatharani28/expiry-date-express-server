const authService = require('../services/auth.service');

class AuthController {
  /**
   * Controller for User Registration
   * Route: POST /auth/register
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });

      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
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
   * Controller for User Login
   * Route: POST /auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
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
}

module.exports = new AuthController();
