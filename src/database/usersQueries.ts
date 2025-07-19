// The common statements/queries for working with users database
import db from './index';
import { NewUser, User } from '../myTypes/types';
import { HttpError } from '../middleware/error';

export const dbAddNewUser = (
    username: string,
    fname: string,
    lname: string,
    email: string,
): number | bigint => {
    const stmt = db.prepare(
        'INSERT INTO users (username, fname, lname, email) VALUES (?, ?, ?, ?)',
    );
    const result = stmt.run(username, fname, lname, email);
    return result.lastInsertRowid;
};

export const dbAddNewUserAuth = (
    id: number | bigint,
    password_hash: string,
): number | bigint => {
    const stmt = db.prepare(
        'INSERT INTO user_auth (user_id, password_hash) VALUES (?, ?)',
    );
    const result = stmt.run(id, password_hash);
    return result.changes;
};

export const dbAddUserWithAuth = (
    u: NewUser,
    password_hash: string,
    ): number | bigint => {
    const newUserId = dbAddNewUser(
        u.username,
        u.fname,
        u.lname,
        u.email,
    );

    const result = dbAddNewUserAuth(newUserId, password_hash);

    if (result !== 1) {
        throw new HttpError('Failed to save user', 500);
    }

    return newUserId;
};

export const dbGetUserById = (id: number): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id);
    return user as User | undefined;
};

export const dbGetUserByUsername = (username: string): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username);
    return user as User | undefined;
};

export const dbGetUsers = (limit: number): User[] | undefined => {
    const stmt = db.prepare('SELECT * FROM users LIMIT ?');
    const users = stmt.all(limit);
    return users as User[] | undefined;
};

export const dbDeleteUser = (id: number): number => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes;
};

export const dbUpdateUser = (
    username: string,
    fname: string,
    lname: string,
    email: string,
    id: number,
): number | bigint => {
    const stmt = db.prepare(
        `UPDATE users SET username = ?, fname = ?, lname = ?, email = ? WHERE id = ?`,
    );
    const result = stmt.run(username, fname, lname, email, id);
    return result.changes;
};

interface UsersQueries {
    dbAddNewUser: (
        username: string,
        fname: string,
        lname: string,
        email: string,
    ) => number | bigint;
    dbAddNewUserAuth: (
        id: number | bigint,
        password_hash: string,
    ) => number | bigint;
    dbAddUserWithAuth: (
        u: NewUser,
        password_hash: string,
    ) => number | bigint;
    dbGetUserByUsername: (username: string) => User | undefined;
    dbGetUserById: (id: number) => User | undefined;
    dbGetUsers: (limit: number) => User[] | undefined;
    dbDeleteUser: (id: number) => number;
    dbUpdateUser: (
        username: string,
        fname: string,
        lname: string,
        email: string,
        id: number,
    ) => number | bigint;
}

const usersQueries: UsersQueries = {
    dbAddNewUser,
    dbAddNewUserAuth,
    dbAddUserWithAuth,
    dbGetUserById,
    dbGetUsers,
    dbGetUserByUsername,
    dbDeleteUser,
    dbUpdateUser,
};

export default usersQueries;
