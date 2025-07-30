import express, { Response } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { errorHandler } from './middleware/error.js';
import usersRouter from './routes/usersRoutes.js';
import devLogger from './middleware/logger.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import redoc from 'redoc-express';
import swaggerDocument from '../docs/swagger.json';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Options for avatar uploads
const uploadStaticOptions = {
    dotfiles: 'ignore', // don't serve hidden files (like .env)
    etag: true, // enable etags for cache validation
    extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'], // allowed image extensions only
    index: false, // disable directory indexing (no listing folders)
    lastModified: true, // set Last-Modified header for caching
    maxAge: '30d', // cache client-side for 30 days
    setHeaders(res: Response) {
        // Immutable cache because avatar URLs should be unique and versioned
        res.set('Cache-Control', 'public, max-age=2592000, immutable');
    },
};

// ALlow CORS for frontend
app.use(
    cors({
        origin: 'http://localhost:7171',
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    }),
);

// Swagger UI docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Redoc docs
app.get(
    '/docs',
    redoc({
        title: 'Mini Users Api Docs',
        specUrl: '/swagger.json',
    }),
);

// Serve swagger.json so Redoc can load it
app.get('/swagger.json', (req, res): void => {
    res.sendFile(path.join(__dirname, '..', 'docs', 'swagger.json'));
});

// Logger Middleware
app.use(devLogger);

// JSON Middleware
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Upload Files Middleware
app.use(
    '/uploads',
    express.static(path.join(__dirname, '..', 'uploads'), uploadStaticOptions),
);

// Router for users api
app.use('/api/users', usersRouter);

// Router for auth api
app.use('/api/auth', authRouter);

// Error Handling Middleware
app.use(errorHandler);

app.listen(7070, (): void => {
    console.log('\n=== Server Listening on localhost:7070 ===\n');
});
