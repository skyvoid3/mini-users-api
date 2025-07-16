import { Request, Response, NextFunction } from 'express';
import usersQueries from '../database/usersQueries';
import { HttpError } from '../middleware/error';
import {
    validateUserInput,
    validateParamNumber,
    validateUserBody,
    validateUserPatchBody,
    validateParamString,
} from '../utils';
import { User } from '../myTypes/types.ts';

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
    const validated: number | undefined = validateParamNumber(rawLimit);

    const limit = validated ?? 10;

    try {
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
    const id: number | undefined = validateParamNumber(req.params.id);

    if (id === undefined) {
        next(new HttpError('Invalid Id', 400));
        return;
    }

    try {
        const user: User | undefined = usersQueries.dbGetUserById(id);

        if (user === undefined) {
            next(new HttpError('User not found', 404));
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
    const username: string | undefined = validateParamString(
        req.params.username,
    );

    if (username === undefined) {
        next(new HttpError('User Not Found', 404));
        return;
    }

    try {
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
    }
};

/**
 * Create a new user
 * @route POST /api/users
 */
export const createUser = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const userBody: User | undefined = validateUserBody(req.body);

    if (userBody === undefined) {
        next(new HttpError('Invalid key names', 400));
        return;
    }

    const user = userBody;

    if (!validateUserInput(user.username, user.fname, user.lname, user.email)) {
        next(new HttpError('Invalid credentials', 400));
        return;
    }

    const result = usersQueries.dbAddNewUser(
        user.username,
        user.fname,
        user.lname,
        user.email,
    );

    console.log(`ID: ${result}`);

    res.json({ message: 'User created', user: user });
    return;
};

/*
 * Delete user by ID
 * @route DELETE /api/users/:id
 * @note  User must authenticate to delete
 */
export const deleteUserById = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const id: number | undefined = validateParamNumber(req.params.id);

    if (id === undefined) {
        next(new HttpError('Invalid Id', 400));
        return;
    }

    const deletedUser = usersQueries.dbDeleteUser(id);

    if (deletedUser > 0) {
        console.log(`User deleted. Id: ${id}`);
        res.status(204).end();
        return;
    } else {
        console.log(`Couldn't delete user. Id: ${id}`);
        next(new HttpError('User not found', 404));
        return;
    }
};

/**
 * Change user information
 * @route PATCH /api/users/:id
 */
export const changeUserInfoById = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const userBody: User | undefined = validateUserPatchBody(req.body);

    if (userBody === undefined) {
        next(new HttpError('Invalid input', 400));
        return;
    }

    const newUserInfo = userBody;

    const validId = validateParamNumber(req.params.id);

    if (validId === undefined) {
        next(new HttpError('Invalid Id', 400));
        return;
    }

    const id = validId;

    const existingUser = usersQueries.dbGetUserById(id);

    if (existingUser === undefined) {
        next(new HttpError('User Not Found', 404));
        return;
    }

    const updatedUser: User = { ...existingUser, ...newUserInfo };

    try {
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
        console.log(err);
        next(new HttpError('Internal error', 500));
        return;
    }

    console.log(updatedUser);
};
