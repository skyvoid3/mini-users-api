import type { BackendError } from '@/types';
import { isAxiosError } from 'axios';

export function getSignupErrorMessage(err: unknown): string {
    let em = 'Something went wrong';

    if (isAxiosError(err)) {
        if (!err.response) {
            return 'Network issue. Please try again later';
        }

        const data = err.response.data;

        if (data && typeof data.message === 'string') {
            return friendlyErrorMessage(data as BackendError);
        }

        return em;
    }

    return em;
}

export function getLoginErrorMessage(err: unknown) {
    let em = 'Something went wrong';

    if (isAxiosError(err)) {
        if (!err.response) {
            return 'Network issue. Please try again later';
        }

        const data = err.response.data;

        if (data && typeof data.message === 'string') {
            if (err.status === 404) {
                return 'User Does Not Exist';
            }
            return 'Wrong username or password';
        }
    }
    return em;
}

export function friendlyErrorMessage(err: BackendError): string {
    const msg = err.message.toLowerCase();
    if (msg.includes('email')) {
        return 'The email is already in use. Do you want to log in instead?';
    } else if (msg.includes('username')) {
        return 'Username already exists';
    } else {
        return 'Error occurred';
    }
}
