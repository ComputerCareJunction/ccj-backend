import swaggerJsdoc from 'swagger-jsdoc';
import { EnvironmentConfig } from './env';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CCJ Backend API',
      version: '1.0.0',
      description:
        'Complete API documentation for CCJ Backend with authentication, products, blogs, orders, tickets, and more',
      contact: {
        name: 'API Support',
        email: 'support@ccj.com',
      },
    },
    servers: [
      {
        url: `${EnvironmentConfig.API_URL}`,
        description: 'Current environment',
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Local development server',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },

      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            message: {
              type: 'string',
              description: 'Detailed error message',
            },
          },
        },

        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID' },
            email: { type: 'string', description: 'User email' },
            name: { type: 'string', description: 'User name' },
            phone: { type: 'string', description: 'User phone number' },
            role: {
              type: 'string',
              enum: ['admin', 'sub_user', 'employee'],
              description: 'User role',
            },
            avatar: {
              type: 'string',
              description: 'User avatar URL',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            original_price: { type: 'number' },
            discount_percentage: { type: 'number' },
            brand: { type: 'string' },
            category: { type: 'string' },
            brand_category: { type: 'string' },
            image: { type: 'string' },
            stock: { type: 'number' },
          },
        },

        Blog: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            content: { type: 'string' },
            image: { type: 'string' },
            author_id: { type: 'string' },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user_id: { type: 'string' },
            total_price: { type: 'number' },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'cancelled'],
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: {
              type: 'string',
              enum: ['open', 'in_progress', 'closed'],
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
            },
            user_id: { type: 'string' },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ['./src/routes/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);