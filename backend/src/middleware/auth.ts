import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { HttpError } from './error';
import { AuthenticatedRequest } from '../myTypes/types';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// JWT Autentication
export function JWTAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.set('WWW-Authenticate', 'Bearer realm="Users API"');
        res.status(401).send('Authentication Required');
        return;
    }

    if (!JWT_SECRET_KEY) {
        next(new Error('Failed to load jwt secret key'));
        return;
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as {
            id: number;
            username: string;
            [key: string]: any;
        };
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        next(new HttpError('Invalid Token', 401));
        return;
    }
}
