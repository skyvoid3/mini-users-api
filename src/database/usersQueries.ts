// The common statements/queries for working with users database
import db from './index.js';
import { User } from '../myTypes/types.ts';

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
    dbGetUserById,
    dbGetUsers,
    dbGetUserByUsername,
    dbDeleteUser,
    dbUpdateUser,
};

export default usersQueries;
