import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { LoginResponse } from '../myTypes/types';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRATION = '24h';

export function generateJwtToken(id: number, username: string): LoginResponse   {

    const payload = {
        id: id,
        username: username
    };

    if (!JWT_SECRET_KEY) {
        throw new Error('Jwt Key Not Loaded');  
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION });

    const response: LoginResponse = {
        message: 'Verified',
        token,
    };

    return response;
}
