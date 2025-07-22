import bcrypt from 'bcrypt';
import { HttpError } from '../middleware/error';

const SALT_CYCLES = 10;

// Returning hashed password
export async function hashUserPassword(raw_pass: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(SALT_CYCLES);
        const hashed_password = await bcrypt.hash(raw_pass, salt);
        return hashed_password;
    } catch (err) {
        console.error('Hash Password Fail', err);
        throw err as Error;
    }
}

// Validating the password
export async function confirmUserPassword(
    raw_pwd: string,
    pwd_hash: string,
): Promise<boolean> {
    if (pwd_hash === undefined) {
        throw new HttpError('User Not Found', 404);
    }
    let isValid: boolean = await bcrypt.compare(raw_pwd, pwd_hash);

    return isValid;
}
