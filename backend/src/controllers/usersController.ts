import { Request, Response, NextFunction } from 'express';
import usersQueries from '../database/usersQueries';
import { HttpError } from '../middleware/error';
import {
    validateParamNumber,
    validatePwdPatchBody,
    validateUserPatchBody,
} from '../utils/validators';
import { AuthenticatedRequest, PasswordChange, User } from '../myTypes/types';
import authQueries from '../database/authQueries';
import { confirmUserPassword, hashUserPassword } from '../auth/hash';

/**
 * Get all users
 * @route GET /api/users
 * @query {number} limit - Number of users per page
 * ONLY FOR ADMIN
 */
export const getUsers = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const rawLimit = req.query.limit as string | undefined;
    try {
        const validated: number = validateParamNumber(rawLimit);

        const limit = validated ?? 10;

        const users = usersQueries.dbGetUsers(limit);
        res.json(users);
    } catch (err) {
        next(err);
    }
};

/**
 * Get user info
 * @route GET /api/users/me
 */
export const getUserInfo = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    try {
        if (!req.user) {
            next(new HttpError('Not Authenticated', 403));
            return;
        }

        const userId = req.user.id;

        const user: User | undefined = usersQueries.dbGetUserById(userId);

        if (user === undefined) {
            next(new HttpError('User Not Found', 404));
            return;
        }

        res.json(user);
    } catch (err) {
        next(err);
        return;
    }
};

/**
 * Change user information
 * @route PATCH /api/users/me
 */
export const changeUserInfo = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    try {
        if (!req.user) {
            next(new HttpError('Not Authenticated', 403));
            return;
        }

        const newUserInfo: User = validateUserPatchBody(req.body);

        const userId = req.user.id;

        const user: User | undefined = usersQueries.dbGetUserById(userId);

        if (user === undefined) {
            next(new HttpError('User Not Found', 404));
            return;
        }

        const updatedUser: User = { ...user, ...newUserInfo };

        const result = usersQueries.dbUpdateUser(userId, updatedUser);

        if (result !== 1) {
            next(new Error('Couldnt save users to db'));
        }

        res.json({ message: 'Updated Successfuly' });
    } catch (err) {
        next(err);
        return;
    }
};

/*
 * Delete user
 * @route DELETE /api/users/me
 */
export const deleteUser = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    try {
        if (!req.user) {
            next(new HttpError('Not Authenticated', 401));
            return;
        }

        const userId = req.user.id;

        const deleted = usersQueries.dbDeleteUser(userId);

        if (deleted !== 1) {
            next(new Error('Couldnt delete user from db'));
            return;
        }

        res.json({ message: 'User Deleted' });
    } catch (err) {
        next(err);
        return;
    }
};

/**
 * Change user password
 * @route PATCH users/me/password
 */
export const changeUserPassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const pwd: PasswordChange | undefined = validatePwdPatchBody(req.body);

        if (!pwd) {
            next(new HttpError('Bad Request Body', 400));
            return;
        }

        if (pwd.oldPassword === pwd.newPassword) {
            next(
                new HttpError(
                    'New Password Must Be Different from Old Password',
                ),
            );
            return;
        }

        if (!req.user) {
            next(new HttpError('Not Authorized', 401));
            return;
        }

        const userId = req.user.id;

        const oldPwdHash = authQueries.dbGetUserPwdHash(userId);

        if (!oldPwdHash) {
            next(new Error('Couldnt get user pwd from db'));
            return;
        }

        const valid = await confirmUserPassword(pwd.oldPassword, oldPwdHash);

        if (!valid) {
            next(new HttpError('Invalid Old Password', 400));
            return;
        }

        const newPwdHash = await hashUserPassword(pwd.newPassword);

        const inserted = authQueries.dbUpdateUserPwd(newPwdHash, userId);

        if (inserted !== 1) {
            next(new Error('Couldnt save new pwd to db'));
            return;
        }

        res.json({ message: 'Password Changed Successfuly' });
    } catch (err) {
        next(err);
        return;
    }
};

/**
 * Upload user avatar
 * @route POST users/me/upload-avatar
 */
export function uploadUserAvatar(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void {
    try {
        if (!req.user) {
            next(new HttpError('Not Authorized', 401));
            return;
        }

        const userId = req.user.id;

        if (!req.file) {
            next(new HttpError('No File Uploaded', 400));
            return;
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        const updated = usersQueries.dbAddUserAvatar(avatarUrl, userId);
        if (updated !== 1) {
            next(new Error('Couldnt upload avatar'));
            return;
        }

        res.json({ message: 'Avatar uploaded successfuly', avatarUrl });
    } catch (err) {
        next(err);
        return;
    }
}
