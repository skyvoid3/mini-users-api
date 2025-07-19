import { Request, Response, NextFunction } from 'express';
import usersQueries from '../database/usersQueries';
import { HttpError } from '../middleware/error';
import {
    validateParamNumber,
    validateUserPatchBody,
    validateUsernameString,
} from '../utils/validators';
import { User } from '../myTypes/types';

/**
 * Get all users
 * @route GET /api/users
 * @query {number} limit - Number of users per page
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
 * Get user by ID
 * @route GET /api/users/:id
 * @query {boolean} name - If true, only the user's name will be returned
 * @query {boolean} email - If true, only the user's email will be returned
 */
export const getUserById = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    try {
        const id: number = validateParamNumber(req.params.id);

        const user: User | undefined = usersQueries.dbGetUserById(id);

        if (user === undefined) {
            next(new HttpError('User Not Found', 404));
            return;
        }

        const name = req.query.name === 'true';
        const email = req.query.email === 'true';

        if (name && email) {
            const result = {
                fname: user.fname,
                lname: user.lname,
                email: user.email,
            };
            res.json(result);
            return;
        }

        if (name && !email) {
            const result = {
                fname: user.fname,
                lname: user.lname,
            };
            res.json(result);
            return;
        }

        if (!name && email) {
            const result = {
                email: user.email,
            };
            res.json(result);
            return;
        }

        res.json(user);
    } catch (err) {
        next(err);
        return;
    }
};

/**
 * Get user by username
 * @route GET /api/users/:username
 */
export const getUserByUsername = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    try {
        const username: string = validateUsernameString(req.params.username);

        const user: User | undefined =
            usersQueries.dbGetUserByUsername(username);

        if (user === undefined) {
            next(new HttpError('User Not Found', 404));
            return;
        }

        res.json(user);
        return;
    } catch (err) {
        next(err);
        return;
    }
};

/*
 * Delete user by ID
 * @route DELETE /api/users/id/:id
 * @note  User must authenticate to delete
 */
export const deleteUserById = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    try {
        const id: number = validateParamNumber(req.params.id);

        const deletedUser = usersQueries.dbDeleteUser(id);

        if (deletedUser > 0) {
            console.log(`User Deleted. Id: ${id}`);
            res.status(204).end();
            return;
        } else {
            console.log(`Couldn't Delete User. Id: ${id}`);
            next(new HttpError('User Not Found', 404));
            return;
        }
    } catch (err) {
        next(err);
        return;
    }
};

/**
 * Change user information
 * @route PATCH /api/users/id/:id
 * This controller has issue that it can only change info by provided /id/:id and doesnt
 * support /users/:username path
 */
export const changeUserInfoById = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    try {
        const userBody: User = validateUserPatchBody(req.body);

        const newUserInfo = userBody;

        const id = validateParamNumber(req.params.id);

        const existingUser = usersQueries.dbGetUserById(id);

        if (existingUser === undefined) {
            next(new HttpError('User Not Found', 404));
            return;
        }

        const updatedUser: User = { ...existingUser, ...newUserInfo };

        const result = usersQueries.dbUpdateUser(
            updatedUser.username,
            updatedUser.fname,
            updatedUser.lname,
            updatedUser.email,
            id,
        );

        console.log(`Updated user ${result}`);

        res.json({ msg: 'Updated successfuly' });
    } catch (err) {
        next(err);
        return;
    }
};
