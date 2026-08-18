const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const setupSwagger = require('./src/config/swagger');
const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');

dotenv.config();

// Connect to MongoDB (Atlas or local fallback)
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration (supports Netlify URL or permissive fallback)
const allowedOrigins = process.env.CORS_ORIGIN || process.env.CLIENT_URL;
app.use(
  cors({
    origin: allowedOrigins
      ? allowedOrigins.split(',').map((url) => url.trim())
      : '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger Documentation UI
setupSwagger(app);

// API Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Health Check Routes (for Render, uptime monitors, etc.)
app.get(['/', '/health'], (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Expiry Date Manager API is active and healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    docs: '/api-docs',
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs available at /api-docs`);
});

module.exports = app;
