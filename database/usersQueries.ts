// The common statements/queries for working with users database
import db from './index.js';
import { User } from '../myTypes/types.ts';

export const dbAddNewUser = (
    fname: string,
    lname: string,
    email: string,
): number | bigint => {
    const stmt = db.prepare(
        'INSERT INTO users (fname, lname, email) VALUES (?, ?, ?)',
    );
    const result = stmt.run(fname, lname, email);
    return result.lastInsertRowid;
};

export const getUserById = (id: number): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(id);
    return row as User | undefined;
};

export const getUsers = (limit: number): User[] | undefined => {
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
    fname: string,
    lname: string,
    email: string,
    id: number,
): number | bigint => {
    const stmt = db.prepare(
        `UPDATE users SET fname = ?, lname = ?, email = ? WHERE id = ?`,
    );
    const result = stmt.run(fname, lname, email, id);
    return result.changes;
};

interface UsersQueries {
    dbAddNewUser: (
        fname: string,
        lname: string,
        email: string,
    ) => number | bigint;
    getUserById: (id: number) => User | undefined;
    getUsers: (limit: number) => User[] | undefined;
    dbDeleteUser: (id: number) => number;
    dbUpdateUser: (
        fname: string,
        lname: string,
        email: string,
        id: number,
    ) => number | bigint;
}

const usersQueries: UsersQueries = {
    dbAddNewUser,
    getUserById,
    getUsers,
    dbDeleteUser,
    dbUpdateUser
};

export default usersQueries;
