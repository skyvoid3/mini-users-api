import express, { Response } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { errorHandler } from './middleware/error.js';
import usersRouter from './routes/usersRoutes.js';
import devLogger from './middleware/logger.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Options for static files
const staticOptions = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['html', 'htm', 'css', 'js'],
    index: false,
    setHeaders(res: Response): void {
        res.set('Cache-Control', 'public, immutable, max-age=31536000');
    },
};

// Logger Middleware
app.use(devLogger);

// JSON Middleware
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Static Files Middleware
app.use('/static', express.static(path.join(__dirname, 'public'), staticOptions));

app.get('/', (_req, res): void => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Router for users api
app.use('/api/users', usersRouter);


// Router for auth api
app.use('/api/auth', authRouter);

// Error Handling Middleware
app.use(errorHandler);

app.listen(7070, (): void => {
    console.log('\n=== Server Listening on localhost:7070 ===\n');
});
