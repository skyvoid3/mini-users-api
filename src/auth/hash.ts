import bcrypt from 'bcrypt';

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
