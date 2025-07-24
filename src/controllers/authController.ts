import { Request, Response, NextFunction } from 'express';
import authQueries from '../database/authQueries';
import usersQueries from '../database/usersQueries';
import {
    validateUserInput,
    validateNewUserBody,
    validateLoginBody,
} from '../utils/validators';
import { confirmUserPassword, hashUserPassword } from '../auth/hash';
import {
    Credentials,
    LoginResponse,
    NewUser,
    RefreshPayload,
    UsernameId,
    Session,
    AuthenticatedRequest,
} from '../myTypes/types';
import { HttpError } from '../middleware/error';
import { generateJwtToken } from '../utils/jwtToken';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;

/**
 * Sign up new user
 * @route POST /api/auth/signup
 */
export async function createUser(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const userBody: NewUser = validateNewUserBody(req.body);

        const user = validateUserInput(userBody);

        const hashedPassword = await hashUserPassword(user.password);

        const newUserId = usersQueries.dbAddUserWithAuth(user, hashedPassword);

        console.log(`ID: ${newUserId}`);

        res.status(201).json({
            message: 'User created',
            username: user.username,
        });
    } catch (err) {
        next(err);
        return;
    }
}

/**
 * User Login
 * @route POST /api/auth/login
 */
export async function loginUser(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const creds: Credentials = validateLoginBody(req.body);

        const user: UsernameId | undefined = usersQueries.dbGetUsernameAndId(
            creds.username,
        );

        if (user === undefined) {
            next(new HttpError('Invalid username or password', 401));
            return;
        }

        const pwd_hash = authQueries.dbGetUserPwdHash(user.id);

        if (pwd_hash === undefined) {
            next(new HttpError('Invalid username or password', 401));
            return;
        }

        const valid = await confirmUserPassword(creds.password, pwd_hash);

        if (!valid) {
            next(new HttpError('Invalid username or password', 401));
            return;
        }

        const { accessToken, refreshToken }: LoginResponse = generateJwtToken(
            user.id,
            user.username,
        );

        const decodedRefresh = jwt.decode(refreshToken) as RefreshPayload;

        const { sessionId, exp } = decodedRefresh;

        if (!sessionId || !exp || typeof exp !== 'number') {
            next(new Error('Couldnt get sessionId'));
            return;
        }

        const expiresAt = new Date(exp * 1000).toISOString();

        const inserted = authQueries.dbAddSession(
            sessionId,
            user.id,
            expiresAt,
        );

        if (inserted !== 1) {
            next(new Error('Couldnt save sessionId'));
        }

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        }).json({ message: 'Login successful', accessToken });
    } catch (err) {
        next(err);
        return;
    }
}

/**
 * Logout User
 * @route POST api/auth/logout
 * Deletes session from db and invalidates access and refresh tokens
 */
export function logoutUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void {
    try {
        if (!JWT_REFRESH_KEY) {
            next(new Error('Coudlnt load JWT keys'));
            return;
        }

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            res.json({ message: 'Logged Out' });
            return;
        }

        const payload = jwt.verify(
            refreshToken,
            JWT_REFRESH_KEY,
        ) as RefreshPayload;
        const sessionId = payload.sessionId;

        const deleted = authQueries.dbDeleteSession(sessionId);

        if (!deleted) {
            next(new Error('Couldnt delete session from db'));
            return;
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        res.json({ message: 'Logged Out' });
    } catch (err) {
        next(err);
        return;
    }
}

/**
 * Issue new access tokens
 * @route POST api/auth/refresh
 */
export function refreshLogin(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    try {
        if (!JWT_REFRESH_KEY) {
            next(new Error('Couldnt load refresh key'));
            return;
        }

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            next(new HttpError('No Refresh Token Found', 401));
            return;
        }

        const payload = jwt.verify(
            refreshToken,
            JWT_REFRESH_KEY,
        ) as RefreshPayload;

        const { sessionId, id, username } = payload;

        // Swapping names so my program doesnt DIE
        const userId = id;

        if (!sessionId) {
            next(new HttpError('Invalid Refresh Token', 401));
            return;
        }

        const session: Session | undefined = authQueries.dbGetSession(userId);

        if (session === undefined || session.session_id !== sessionId) {
            next(new HttpError('Session Not Found Or Revoked', 403));
            return;
        }

        const isExpired = new Date(session.expires_at).getTime() < Date.now();

        if (isExpired) {
            const expiredDeleted = authQueries.dbDeleteSession(sessionId);
            if (expiredDeleted !== 1) {
                next(new Error('Expired session was not deleted from db'));
                return;
            }
            next(new HttpError('Session Expired', 401));
            return;
        }

        const rotatedDeleted = authQueries.dbDeleteSession(sessionId);
        if (rotatedDeleted !== 1) {
            next(new Error('Session was not deleted from db'));
            return;
        }

        const newSessionId = uuidv4();

        const response = generateJwtToken(userId, username, newSessionId);

        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString();

        const inserted = authQueries.dbAddSession(
            newSessionId,
            userId,
            expiresAt,
        );
        if (inserted !== 1) {
            next(new Error('Couldnt save new session to db'));
            return;
        }

        res.cookie('refreshToken', response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        }).json({ accessToken: response.accessToken });
    } catch (err) {
        next(err);
        return;
    }
}
