export interface User {
    username: string;
    fname: string;
    lname: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface NewUser {
    username: string;
    fname: string;
    lname: string;
    email: string;
    password: string;   
}
export interface UserAuth {
    user_id: number;
    password_hash: string;
    last_changed_at: string | null;
}

export interface NewUserAuth {
    user_id: number;
    password_hash: string;
}

export const nameRegex = /^[a-zA-Z]+$/;
export const usrnameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;
export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{}|;:'",.<>/?]).{8,}$/;
export const allowedKeys = ['username', 'fname', 'lname', 'email'];
export const allowedKeysAuth = [
    'username',
    'fname',
    'lname',
    'email',
    'password',
];
