import swaggerJsdoc from 'swagger-jsdoc';
import { EnvironmentConfig } from './env';

/**
 * OpenAPI paths in JSDoc are absolute from site root (e.g. /api/users).
 * Server URL must be the origin only — if it ends with /api, Swagger UI
 * would request /api/api/... and every route 404s.
 */
function swaggerServerOrigin(): string {
  const raw = EnvironmentConfig.API_URL.trim();
  const withoutApi = raw.replace(/\/api\/?$/i, '');
  return withoutApi || 'http://localhost:5000';
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Computer Care Junction',
      version: '1.0.0',
      description:
        'Complete API documentation for Computer Care Junction Backend with authentication, products, blogs, orders, tickets, and more',
      contact: {
        name: 'API Support',
        email: 'info@computercarejunction.in',
      },
    },
    servers: [
      {
        url: swaggerServerOrigin(),
        description: 'API origin (paths include /api/...)',
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

      responses: {
        BadRequest: {
          description: 'Bad request — validation failed, missing fields, or business rule conflict',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Bad Request',
                message: 'Validation failed: email must be a valid email address',
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized — missing or invalid Bearer token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Unauthorized',
                message: 'No authentication token provided',
              },
            },
          },
        },
        InvalidCredentials: {
          description: 'Invalid email or password',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Unauthorized',
                message: 'Invalid email or password',
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden — insufficient permissions for this action',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Forbidden',
                message: 'You do not have permission to perform this action',
              },
            },
          },
        },
        NotFound: {
          description: 'Requested resource does not exist',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Not Found',
                message: 'The requested resource could not be found',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Unexpected server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                error: 'Internal Server Error',
                message: 'An unexpected error occurred',
              },
            },
          },
        },
      },

      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Short error label',
            },
            message: {
              type: 'string',
              description: 'Human-readable detail (may be omitted in production)',
            },
          },
          example: {
            error: 'Bad Request',
            message: 'Invalid input data',
          },
        },

        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT access token',
            },
            user: { $ref: '#/components/schemas/User' },
          },
          example: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.signature',
            user: {
              id: '1',
              email: 'user@example.com',
              name: 'John Doe',
              phone: '+919876543210',
              role: 'admin',
              avatar: 'https://res.cloudinary.com/example/avatar.png',
              created_at: '2025-01-15T10:00:00.000Z',
            },
          },
        },

        RegisterResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
          example: {
            message: 'User registered successfully',
            user: {
              id: '42',
              email: 'newuser@example.com',
              name: 'Jane Doe',
              phone: '+919876543210',
              role: 'customer',
              avatar: '',
              created_at: '2025-01-15T10:00:00.000Z',
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
          example: {
            id: '1',
            email: 'admin@example.com',
            name: 'Admin User',
            phone: '+919876543210',
            role: 'admin',
            avatar: 'https://res.cloudinary.com/example/avatar.png',
            created_at: '2025-01-15T10:00:00.000Z',
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
          example: {
            id: '12',
            name: 'Wireless Mouse',
            slug: 'wireless-mouse',
            description: 'Ergonomic 2.4GHz mouse',
            price: 899.0,
            original_price: 1299.0,
            discount_percentage: 31,
            brand: 'Logitech',
            category: 'Peripherals',
            brand_category: 'Logitech — Peripherals',
            image: 'https://res.cloudinary.com/example/product.png',
            stock: 25,
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
          example: {
            id: '3',
            title: 'Laptop care tips',
            description: 'Keep your device running smoothly',
            content: '<p>Full HTML content...</p>',
            image: 'https://res.cloudinary.com/example/blog.jpg',
            author_id: '1',
            created_at: '2025-02-01T08:30:00.000Z',
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
          example: {
            id: '1001',
            user_id: '5',
            total_price: 4599.0,
            status: 'pending',
            created_at: '2025-03-10T14:22:00.000Z',
          },
        },

        UploadImageResponse: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Public URL of the uploaded image (e.g. Cloudinary)',
            },
          },
          example: {
            url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/folder/image.jpg',
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
          example: {
            id: '55',
            title: 'Printer not detected',
            description: 'USB printer shows offline in Windows',
            status: 'open',
            priority: 'medium',
            user_id: '5',
            created_at: '2025-03-12T09:15:00.000Z',
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