"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = __importDefault(require("./config/database"));
const env_1 = require("./config/env");
const envPath = path_1.default.resolve(process.cwd(), '.env');
dotenv_1.default.config({ path: envPath });
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = env_1.EnvironmentConfig.PORT;
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddleware() {
        // Security middleware
        this.app.use((0, helmet_1.default)());
        // CORS configuration - allow configured frontend URL and local development origins
        this.app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                // Allow requests with no origin (like mobile apps or curl requests)
                if (!origin) {
                    return callback(null, true);
                }
                // Always allow configured frontend URL
                if (origin === env_1.EnvironmentConfig.FRONTEND_URL) {
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
        // Body parsing middleware
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Request logging
        this.app.use((req, res, next) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });
    }
    initializeRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({ status: 'OK', message: 'Server is running' });
        });
        // API routes
        this.app.use('/api', routes_1.default);
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({ error: 'Route not found' });
        });
    }
    initializeErrorHandling() {
        this.app.use((err, req, res, next) => {
            console.error('Error:', err);
            res.status(500).json({
                error: 'Internal server error',
                message: env_1.EnvironmentConfig.NODE_ENV === 'development' ? err.message : undefined,
            });
        });
    }
    async start() {
        try {
            // Test database connection (non-blocking - will retry)
            database_1.default.testConnection().then((connected) => {
                if (connected) {
                    console.log('✅ Database connection established');
                }
                else {
                    console.warn('⚠️  Database connection failed. Server will start but database features will not work.');
                    console.warn('   Please ensure PostgreSQL is running and .env is configured correctly.');
                }
            }).catch((error) => {
                console.warn('⚠️  Database connection error:', error.message);
                console.warn('   Please ensure PostgreSQL is running and .env is configured correctly.');
            });
            // Start server even if database connection fails
            this.app.listen(this.port, () => {
                console.log(`🚀 Server is running on port ${this.port}`);
                console.log(`📦 Environment: ${env_1.EnvironmentConfig.NODE_ENV}`);
                console.log(`🌐 Frontend URL: ${env_1.EnvironmentConfig.FRONTEND_URL}`);
                console.log(`\n📝 Note: Ensure PostgreSQL is running and database is set up.`);
                console.log(`   Run migrations: psql -U postgres -d ccj_db -f migrations/001_initial_schema.sql`);
                console.log(`   Seed admin: npm run seed\n`);
            });
        }
        catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    }
    async stop() {
        await database_1.default.close();
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
//# sourceMappingURL=server.js.map