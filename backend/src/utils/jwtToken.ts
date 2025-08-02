import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
    LoginResponse,
    RefreshPayload,
    User,
    UserPayload,
} from '../myTypes/types';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRATION = '30d';
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;

export function generateJwtToken(
    id: number,
    u: UserPayload,
    sessionId?: string,
): LoginResponse {
    if (!JWT_SECRET_KEY || !JWT_REFRESH_KEY) {
        throw new Error('Jwt Keys Not Loaded');
    }
    const accessPayload: UserPayload = {
        id,
        username: u.username,
    };

    const finalSessionId = sessionId || uuidv4();

    const refreshPayload: RefreshPayload = {
        userId: id,
        username: u.username,
        sessionId: finalSessionId,
    };

    const accessToken = jwt.sign(accessPayload, JWT_SECRET_KEY, {
        expiresIn: '1h',
    });
    const refreshToken = jwt.sign(refreshPayload, JWT_REFRESH_KEY, {
        expiresIn: JWT_EXPIRATION,
    });

    const response: LoginResponse = {
        sessionId: finalSessionId,
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: 'Verified',
    };

    return response;
}
