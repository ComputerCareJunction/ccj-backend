import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import db from './config/database';
import { EnvironmentConfig } from './config/env';
import { swaggerSpec } from './config/swagger';
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

class Server {
    private app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = EnvironmentConfig.PORT;
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddleware(): void {
        // Security middleware
        this.app.use(helmet());
        
        // CORS configuration - allow configured frontend URL and local development origins
        this.app.use(cors({
            origin: (origin, callback) => {
                // Allow requests with no origin (like mobile apps or curl requests)
                if (!origin) {
                    return callback(null, true);
                }

                // Always allow configured frontend URL
                if (origin === EnvironmentConfig.FRONTEND_URL) {
                    return callback(null, true);
                }

                // Allow localhost and local network IPs (for local development)
                // This allows access from local network even when backend is on Render
                if (origin.startsWith('http://localhost:') || 
                    origin.startsWith('http://127.0.0.1:') ||
                    origin.match(/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/) ||
                    origin.match(/^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/) ||
                    origin.match(/^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}:\d+$/)) {
                    return callback(null, true);
                }
                
                callback(new Error('Not allowed by CORS'));
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));

        // Body parsing middleware (default 100kb is too small for base64 images on products/blogs)
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Request logging
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });
    }

    private initializeRoutes(): void {
        // Health check endpoint
        this.app.get('/health', (req: Request, res: Response) => {
            res.json({ status: 'OK', message: 'Server is running' });
        });

        // Swagger API documentation
        this.app.use('/api-docs', swaggerUi.serve);
        this.app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                persistAuthorization: true,
                defaultModelsExpandDepth: -1,
            },
            customCss: [
                '.swagger-ui .topbar { display: none }',
                '.swagger-ui section.models { display: none !important; }',
            ].join('\n'),
        }));

        // API routes
        this.app.use('/api', routes);

        // 404 handler
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({ error: 'Route not found' });
        });
    }

    private initializeErrorHandling(): void {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error('Error:', err);
            const e = err as unknown as { status?: number; statusCode?: number };
            const status =
                typeof e.status === 'number'
                    ? e.status
                    : typeof e.statusCode === 'number'
                      ? e.statusCode
                      : 500;
            const httpStatus = status >= 400 && status < 600 ? status : 500;
            res.status(httpStatus).json({
                error: httpStatus === 500 ? 'Internal server error' : err.message || 'Request error',
                message: EnvironmentConfig.NODE_ENV === 'development' ? err.message : undefined,
            });
        });
    }

    public async start(): Promise<void> {
        try {
            // Test database connection (non-blocking - will retry)
            db.testConnection().then((connected) => {
                if (!connected) {
                    console.warn('⚠️  Database connection failed. Server will start but database features will not work.');
                    console.warn('   Please ensure MySQL is running and .env is configured correctly.');
                }
            }).catch((error) => {
                console.warn('⚠️  Database connection error:', error.message);
                console.warn('   Please ensure MySQL is running and .env is configured correctly.');
            });

            // Start server even if database connection fails
            const apiBase = EnvironmentConfig.API_URL.replace(/\/api\/?$/, '');
            const swaggerUrl = `${apiBase}/api-docs`;
            const dbName = db.getDatabaseName();

            this.app.listen(this.port, () => {
                console.log(`🚀 Server is running on port ${this.port}`);
                console.log(`📦 Environment: ${EnvironmentConfig.NODE_ENV}`);
                console.log(`🌐 Frontend URL: ${EnvironmentConfig.FRONTEND_URL}`);
                console.log(`📚 Swagger UI: ${swaggerUrl}`);
                console.log(`\n📝 Database: ${dbName} (MySQL). Run migrations against this database, e.g.:`);
                console.log(`   mysql -u <user> -p ${dbName} < migrations/001_initial_schema.sql`);
                console.log(`   Seed admin: npm run seed\n`);
            });
        } catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    }

    public async stop(): Promise<void> {
        await db.close();
        console.log('Server stopped');
    }
}

// Start server
const server = new Server();
server.start();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await server.stop();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await server.stop();
    process.exit(0);
});

