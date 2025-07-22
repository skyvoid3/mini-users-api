import { User, NewUser, Credentials, allowedKeysCreds } from '../myTypes/types';
import { InputError } from '../middleware/error';
import {
    nameRegex,
    usrnameRegex,
    emailRegex,
    allowedKeys,
    allowedKeysAuth,
    passwordRegex,
} from '../myTypes/types';

// This function checks if the input for creating a new user is valid
// and doesnt containt any unwanted data
export function validateUserInput(u: NewUser): NewUser {
    u.username = u.username.trim();
    u.fname = u.fname.trim();
    u.lname = u.lname.trim();
    u.email = u.email.trim().toLowerCase();

    if (!u.username || !u.fname || !u.lname || !u.email) {
        throw new InputError('All fields must be filled');
    }

    if (u.username.length > 30 || u.username.length < 3) {
        throw new InputError('Username should be between 3 and 30 characters');
    }

    if (u.fname.length > 20 || u.lname.length > 20) {
        throw new InputError(
            'First and last names must be at most 20 characters',
        );
    }

    if (!usrnameRegex.test(u.username)) {
        throw new InputError('Username contains invalid characters');
    }

    if (!nameRegex.test(u.fname) || !nameRegex.test(u.lname)) {
        throw new InputError('Name contains invalid characters');
    }

    const [local, domain] = u.email.split('@');
    if (
        !local ||
        !domain ||
        local.length > 64 ||
        domain.length > 253 ||
        u.email.length > 254 ||
        !emailRegex.test(u.email)
    ) {
        throw new InputError('Invalid email address');
    }

    if (!u.password) {
        throw new InputError('Password is required');
    }

    validateUserPassword(u.password);

    return u;
}

//TODO Maybe make a single funcion that validates any number of keys
function validateSingleField(key: string, value: string | undefined): string {
    if (value === undefined) {
        throw new InputError('Invalid Input');
    }

    value = value.trim();

    switch (key) {
        case 'username':
            if (
                usrnameRegex.test(value) &&
                value.length <= 30 &&
                value.length >= 3
            ) {
                return value;
            } else {
                throw new InputError('Username Not Allowed');
            }

        case 'fname':
        case 'lname':
            if (nameRegex.test(value) && value.length <= 20) {
                return value;
            } else {
                throw new InputError('Invalid Name Fields');
            }

        case 'email':
            const [local, domain] = value.split('@');
            if (
                !!local &&
                !!domain &&
                local.length <= 64 &&
                domain.length <= 253 &&
                value.length <= 254
            ) {
                return value;
            } else {
                throw new InputError('Invalid Email');
            }
        default:
            throw new InputError('Something Went Wrong');
    }
}

// Parse :id or query params to validate that input is valid number
export function validateParamNumber(param: string | undefined): number {
    const minLimit = 10;
    if (param !== undefined) {
        if (param.includes('.')) {
            throw new InputError('Invalid Input: Expected A Number');
        }
    } else if (param === undefined) {
        return minLimit;
    }

    const numberParam = Number(param);

    if (isNaN(numberParam) || numberParam < 0) {
        throw new InputError('Invalid Input: Expected A Number');
    }

    return numberParam;
}

// Validate and trim Username before accepting
export function validateUsernameString(param: string | undefined): string {
    if (param === undefined) {
        throw new InputError('Invalid Username: Expected A String');
    }

    const trimmedParam = param.trim();

    if (trimmedParam.length < 3 || trimmedParam.length > 30) {
        throw new InputError(
            'Invalid Username: Must Be Within The Allowed Range',
        );
    }

    if (!usrnameRegex.test(trimmedParam)) {
        throw new InputError(
            'Invalid Username: Contains Disallowed Characters',
        );
    }

    return trimmedParam;
}

// Validate that JSON body sent to create new user is valid
// This function takes and returns User info with sensitive data
export function validateNewUserBody(user: object): NewUser {
    const inputKeys = Object.keys(user);

    if (inputKeys.length !== 5) {
        throw new InputError('Please Provide All Required Fields');
    }

    for (const key of inputKeys) {
        if (!allowedKeysAuth.includes(key)) {
            throw new InputError('Invalid Field Names Provided');
        }
    }

    return user as NewUser;
}

export function validateUserPassword(pwd: string): void {
    if (!passwordRegex.test(pwd)) {
        throw new InputError(
            'Password must be at least 8 characterslong and include an uppercase letter, a number, and a special character.',
        );
    }
    return;
}

// Validate that JSON body for changing existing user data is valid
export function validateUserPatchBody(user: object): User {
    const inputKeys = Object.keys(user);

    if (inputKeys.length === 0 || inputKeys.length > 4) {
        throw new InputError('Please Provide Correct Nubmer Of Fields');
    }

    for (const key of inputKeys) {
        if (!allowedKeys.includes(key)) {
            throw new InputError('Invalid Field Names Provided');
        }

        const value = (user as any)[key];
        const validatedKeys = validateSingleField(key, value);

        (user as any)[key] = validatedKeys;
    }

    return user as User;
}

function validateLoginFields(creds: Credentials): void {
    const u = creds.username.trim();
    const psw = creds.password;

    if (!usrnameRegex.test(u) || !u || u.length > 30 || u.length < 3) {
        throw new InputError('Wrong Username Format');
    }

    if (!passwordRegex.test(psw)) {
        throw new InputError('Wrong Password Format');
    }
}

export function validateLoginBody(creds: object): Credentials {
    const inputKeys = Object.keys(creds);

    if (inputKeys.length !== 2) {
        throw new InputError('Wrong number of fields');
    }

    for (const key of inputKeys) {
        if (!allowedKeysCreds.includes(key)) {
            throw new InputError('Wrong field names');
        }
    }

    validateLoginFields(creds as Credentials);

    return creds as Credentials;
}
