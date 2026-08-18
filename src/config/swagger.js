const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const serverUrl =
  process.env.SERVER_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${process.env.PORT || 5001}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expiry Date Manager API',
      version: '1.0.0',
      description:
        'REST API documentation for Expiry Date Manager application including AuthN/AuthZ and product/inventory management.',
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './server.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
