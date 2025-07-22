import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface User {
    username: string;
    fname: string;
    lname: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface NewUser {
    username: string;
    fname: string;
    lname: string;
    email: string;
    password: string;
}
export interface UserAuth {
    user_id: number;
    password_hash: string;
    last_changed_at: string | null;
}

export interface NewUserAuth {
    user_id: number;
    password_hash: string;
}

export interface Credentials {
    username: string;
    password: string;
}

export interface UsernameId {
    id: number;
    username: string;
}

export interface UserPwdHash {
    password_hash: string;
}

export interface Session {
    session_id: string;
    user_id: number;
    expires_at: string;
    created_at: string;
}

export interface LoginResponse {
    sessionId: string,
    accessToken: string;
    refreshToken: string;
    message: string;
}

export interface AuthenticatedRequest extends Request {
    user?: { id: number; username: string, [key: string]: any };
}

export interface RefreshPayload extends JwtPayload {
    sessionId: string;
    userId: number;
    username: string;
}

export const nameRegex = /^\p{L}+$/u;
export const usrnameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;
export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{}|;:'",.<>/?]).{8,}$/;
export const allowedKeys = ['username', 'fname', 'lname', 'email'];
export const allowedKeysAuth = [
    'username',
    'fname',
    'lname',
    'email',
    'password',
];
export const allowedKeysCreds = ['username', 'password'];
