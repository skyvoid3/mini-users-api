// The common statements/queries for working with users database
import db from './index';
import { NewUser, User, UsernameId } from '../myTypes/types';
import { SqliteError } from '../middleware/error';
import { dbAddNewUserAuth } from './authQueries';

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

export const dbDeleteUser = (id: number): number => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes;
};

export const dbUpdateUser = (id: number, u: User): number | bigint => {
    const stmt = db.prepare(
        'UPDATE users SET username = ?, fname = ?, lname = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    );
    const result = stmt.run(u.username, u.fname, u.lname, u.email, id);
    return result.changes;
};

interface UsersQueries {
    dbAddNewUser: (
        username: string,
        fname: string,
        lname: string,
        email: string,
    ) => number | bigint;
    dbAddUserWithAuth: (u: NewUser, password_hash: string) => number | bigint;
    dbGetUserByUsername: (username: string) => User | undefined;
    dbGetUserById: (id: number) => User | undefined;
    dbGetUsernameAndId: (username: string) => UsernameId | undefined;
    dbGetUsers: (limit: number) => User[] | undefined;
    dbDeleteUser: (id: number) => number;
    dbUpdateUser: (id: number, u: User) => number | bigint;
}

const usersQueries: UsersQueries = {
    dbAddNewUser,
    dbAddUserWithAuth,
    dbGetUserById,
    dbGetUsernameAndId,
    dbGetUsers,
    dbGetUserByUsername,
    dbDeleteUser,
    dbUpdateUser,
};

export default usersQueries;
