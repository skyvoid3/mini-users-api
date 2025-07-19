import { Request, Response, NextFunction } from 'express';
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
    UsernameId,
} from '../myTypes/types';
import { HttpError } from '../middleware/error';
import { generateJwtToken } from '../utils/jwtToken';

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

        const pwd_hash = usersQueries.dbGetUserPwdHash(user.id);

        if (pwd_hash === undefined) {
            next(new HttpError('Invalid username or password', 401));
            return;
        }

        const valid = await confirmUserPassword(
            creds.password,
            user.id,
            pwd_hash,
        );

        if (!valid) {
            next(new HttpError('Invalid username or password', 401));
            return;
        }

        const response: LoginResponse = generateJwtToken(
            user.id,
            user.username,
        );

        res.json(response);
    } catch (err) {
        next(err);
        return;
    }
}
