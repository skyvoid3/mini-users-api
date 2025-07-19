// The common statements/queries for working with users database
import db from './index';
import { NewUser, User, UsernameId, UserPwdHash } from '../myTypes/types';
import { SqliteError } from '../middleware/error';

export const dbAddNewUser = (
    username: string,
    fname: string,
    lname: string,
    email: string,
): number | bigint => {
    try {
        const stmt = db.prepare(
            'INSERT INTO users (username, fname, lname, email) VALUES (?, ?, ?, ?)',
        );
        const result = stmt.run(username, fname, lname, email);
        return result.lastInsertRowid;
    } catch (err) {
        if (
            err instanceof Error &&
            (err as any).code === 'SQLITE_CONSTRAINT_UNIQUE' &&
            err.message.includes('users.username')
        ) {
            throw new SqliteError('Username already exists');
        } else if (
            err instanceof Error &&
            (err as any).code === 'SQLITE_CONSTRAINT_UNIQUE' &&
            err.message.includes('users.email')
        ) {
            throw new SqliteError('Email already in use');
        }
        throw err;
    }
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
    const newUserId = dbAddNewUser(u.username, u.fname, u.lname, u.email);

    const result = dbAddNewUserAuth(newUserId, password_hash);

    if (result !== 1) {
    }

    return newUserId;
};

export const dbGetUserById = (id: number): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id);
    return user as User | undefined;
};

export const dbGetUsernameAndId = (
    username: string,
): UsernameId | undefined => {
    const stmt = db.prepare(
        'SELECT id, username FROM users WHERE username = ?',
    );
    const user = stmt.get(username);
    return user as UsernameId | undefined;
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

export const dbGetUserPwdHash = (id: number): string | undefined => {
    const stmt = db.prepare(
        'SELECT password_hash FROM user_auth WHERE user_id = ?',
    );
    const pwd = stmt.get(id) as UserPwdHash | undefined;

    return pwd?.password_hash;
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
    dbAddUserWithAuth: (u: NewUser, password_hash: string) => number | bigint;
    dbGetUserByUsername: (username: string) => User | undefined;
    dbGetUserById: (id: number) => User | undefined;
    dbGetUserPwdHash: (id: number) => string | undefined;
    dbGetUsernameAndId: (username: string) => UsernameId | undefined;
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
    dbGetUsernameAndId,
    dbGetUsers,
    dbGetUserPwdHash,
    dbGetUserByUsername,
    dbDeleteUser,
    dbUpdateUser,
};

export default usersQueries;
