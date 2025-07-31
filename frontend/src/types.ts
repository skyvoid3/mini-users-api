export type User = {
    username: string;
    fname: string;
    lname: string;
    email: string;
    avatarUrl: string;
};

// Used in SignupForm component to display error messages for input fields
export type SignupFieldErrors = {
    username: string;
    fname: string;
    lname: string;
    email: string;
    password: string;
    repeatPassword: string;
};

// Used in SignupForm component to display whether field was touched in the process or not
export type SignupFieldTouched = {
    username: boolean;
    fname: boolean;
    lname: boolean;
    email: boolean;
    password: boolean;
    repeatPassword: boolean;
};

// Backend will send error message which can be server errors not related to UX.
// errorHandler checks is string containts 'Username' or 'Email' and send messages
// based on that. !!The logic will be improved later or live availibility checks
// will be added!!.
export type BackendError = {
    message: string;
};

export const nameRegex = /^\p{L}+$/u;
export const usrnameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;
export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{}|;:'",.<>/?]).{8,}$/;
