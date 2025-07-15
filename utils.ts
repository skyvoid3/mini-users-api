import { User } from './myTypes/types.ts';


// This function checks if the input for creating a new user is valid
// and doesnt containt any unwanted data
export function validateUserInput(
    fname: string,
    lname: string,
    email: string,
): boolean {

    try {
    fname = fname.trim();
    lname = lname.trim();
    email = email.trim();
    } catch {
        return false;
    }

    const testName = /^[a-zA-Z]+$/;

    if (fname.length > 20 || lname.length > 20) return false;

    if (!testName.test(fname) || !testName.test(lname)) {
        return false;
    }

    const testEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (email.length > 254) return false;

    if (!testEmail.test(email)) {
        return false;
    }

    const [local, domain] = email.split('@');
    if (!local || !domain || local.length > 64 || domain.length > 253) {
        return false;
    }

    return true;
}

// Parse :id or query params to validate that input is valid number
export function validateParamNumber(param: string | undefined): number | undefined {
    if (typeof param === 'string') {
        if (param.includes('.')) {
            return undefined;
        }
    }

    const numberParam = Number(param);

    if (isNaN(numberParam) || numberParam < 0) {
        return undefined;
    }

    return numberParam;
}

// Validate that JSON body sent to create new user is valid
export function validateUserBody(user: object): User | undefined {
    
    const inputKeys = Object.keys(user);

    if (inputKeys.length !== 3) {
        return undefined;
    }

    const allowedKeys = ['fname', 'lname', 'email'];


    for (const key of inputKeys) {
        if (!allowedKeys.includes(key)) {
            return undefined;
        }
    }

    return user as User;
}

// Validate that JSON body to change existing user data is valid
export function validateUserPatchBody(user: object): User | undefined {
    
    const inputKeys = Object.keys(user);

    if (inputKeys.length === 0 || inputKeys.length > 3) {
        return undefined;
    }

    const allowedKeys = ['fname', 'lname', 'email'];


    for (const key of inputKeys) {
        if (!allowedKeys.includes(key)) {
            return undefined;
        }
    }

    return user as User;
}

