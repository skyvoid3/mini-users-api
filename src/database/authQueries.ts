// The common statements/queries for working with auth-related databases
import db from './index';
import { Session, UserPwdHash } from '../myTypes/types';

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

export const dbAddSession = (
    sessionId: string,
    userId: number,
    expiresAt: string,
): number | bigint => {
    const stmt = db.prepare(
        'INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)',
    );
    const result = stmt.run(sessionId, userId, expiresAt);
    return result.changes;
};

export const dbGetUserPwdHash = (id: number): string | undefined => {
    const stmt = db.prepare(
        'SELECT password_hash FROM user_auth WHERE user_id = ?',
    );
    const result = stmt.get(id) as UserPwdHash | undefined;

    return result?.password_hash;
};

export const dbGetSession = (userId: number): Session | undefined => {
    const stmt = db.prepare('SELECT * FROM sessions WHERE user_id = ?');
    const result = stmt.get(userId) as Session | undefined;

    return result;
};

export const dbDeleteSession = (sessionId: string): number => {
    const stmt = db.prepare('DELETE FROM sessions WHERE session_id = ?');
    const result = stmt.run(sessionId);
    return result.changes;
};

export const dbUpdateUserPwd = (newPwd: string, id: number): number => {
    const stmt = db.prepare(
        'UPDATE user_auth SET password_hash = ?, last_changed_at = CURRENT_TIMESTAMP WHERE user_id = ?',
    );
    const result = stmt.run(newPwd, id);
    return result.changes;
};

interface AuthQueries {
    dbAddNewUserAuth: (
        id: number | bigint,
        password_hash: string,
    ) => number | bigint;
    dbAddSession: (
        sessionId: string,
        userId: number,
        expiresAt: string,
    ) => number | bigint;
    dbGetUserPwdHash: (id: number) => string | undefined;
    dbGetSession: (userId: number) => Session | undefined;
    dbDeleteSession: (sessionId: string) => number;
    dbUpdateUserPwd: (newPwd: string, id: number) => number;
}

const authQueries: AuthQueries = {
    dbAddNewUserAuth,
    dbAddSession,
    dbGetUserPwdHash,
    dbGetSession,
    dbDeleteSession,
    dbUpdateUserPwd,
};

export default authQueries;
