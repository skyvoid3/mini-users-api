import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface User {
    username: string;
    fname: string;
    lname: string;
    email: string;
    avatarUrl: string;
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
    userId: number;
    passwordHash: string;
    lastChangedAt: string | null;
}

export interface NewUserAuth {
    userId: number;
    passwordHash: string;
}

export interface Credentials {
    username: string;
    password: string;
}

export interface UserPayload {
    id: number;
    username: string;
}

export interface UserPwdHash {
    passwordHash: string;
}

export interface Session {
    sessionId: string;
    userId: number;
    expiresAt: string;
    createdAt: string;
}

export interface LoginResponse {
    sessionId: string;
    accessToken: string;
    refreshToken: string;
    message: string;
}

export interface AuthenticatedRequest extends Request {
    user?: { id: number; username: string; [key: string]: any };
}

export interface RefreshPayload extends JwtPayload {
    sessionId: string;
    userId: number;
    username: string;
}

export interface PasswordChange {
    oldPassword: string;
    newPassword: string;
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
export const allowedKeysPwdChange = ['oldPassword', 'newPassword'];
