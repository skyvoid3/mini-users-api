import db from './index';
import { NewUser, User, UserPayload } from '../myTypes/types';
import { SqliteError } from '../middleware/error';
import { dbAddNewUserAuth } from './authQueries';
import { toCamel, toCamelArray } from '../utils/toCamelCase';

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
            (err as any).code === 'SQLITE_CONSTRAINT_UNIQUE'
        ) {
            if (err.message.includes('users.username')) {
                throw new SqliteError('Username already exists');
            }
            if (err.message.includes('users.email')) {
                throw new SqliteError('Email already in use');
            }
        }
        throw err;
    }
};

export const dbAddUserWithAuth = (
    u: NewUser,
    password_hash: string,
): number | bigint => {
    const newUserId = dbAddNewUser(u.username, u.fname, u.lname, u.email);
    dbAddNewUserAuth(newUserId, password_hash);
    return newUserId;
};

export const dbAddUserAvatar = (url: string, id: number): number | bigint => {
    const stmt = db.prepare(
        'UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    );
    const result = stmt.run(url, id);
    return result.lastInsertRowid;
};

export const dbGetUserById = (id: number): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id);
    return toCamel<User>(user);
};

export const dbGetUserPayload = (username: string): UserPayload | undefined => {
    const stmt = db.prepare(
        'SELECT id, username FROM users WHERE username = ?',
    );
    const user = stmt.get(username);
    return toCamel<UserPayload>(user);
};

export const dbGetUserByUsername = (username: string): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username);
    return toCamel<User>(user);
};

export const dbGetUsers = (limit: number): User[] | undefined => {
    const stmt = db.prepare('SELECT * FROM users LIMIT ?');
    const users = stmt.all(limit);
    return toCamelArray<User>(users);
};

export const dbDeleteUser = (id: number): number => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes;
};

export const dbUpdateUser = (id: number, u: User): number | bigint => {
    const stmt = db.prepare(
        'UPDATE users SET username = ?, fname = ?, lname = ?, email = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    );
    const result = stmt.run(
        u.username,
        u.fname,
        u.lname,
        u.email,
        u.avatarUrl,
        id,
    );
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
    dbAddUserAvatar: (url: string, id: number) => number | bigint;
    dbGetUserByUsername: (username: string) => User | undefined;
    dbGetUserById: (id: number) => User | undefined;
    dbGetUserPayload: (username: string) => UserPayload | undefined;
    dbGetUsers: (limit: number) => User[] | undefined;
    dbDeleteUser: (id: number) => number;
    dbUpdateUser: (id: number, u: User) => number | bigint;
}

const usersQueries: UsersQueries = {
    dbAddNewUser,
    dbAddUserWithAuth,
    dbAddUserAvatar,
    dbGetUserById,
    dbGetUserPayload,
    dbGetUsers,
    dbGetUserByUsername,
    dbDeleteUser,
    dbUpdateUser,
};

export default usersQueries;
