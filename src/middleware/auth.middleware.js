const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies the Bearer token from the Authorization header
 * and attaches the decoded user payload to req.user
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_jwt_secret_key';

    const decoded = jwt.verify(token, secret);

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired. Please log in again.',
      });
    }

    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Authentication failed.',
    });
  }
};

module.exports = authMiddleware;
