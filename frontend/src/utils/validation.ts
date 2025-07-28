import { usrnameRegex, nameRegex, emailRegex } from '@/types';

export function validateUsername(username: string): string {
    if (!username.trim()) return 'Username is required';
    if (!usrnameRegex.test(username)) return 'Invalid username format';
    if (username.length < 3) return 'Username must be at least 3 characters';
    return '';
}

export function validateEmail(email: string): string {
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
}

export function validateName(name: string, label = 'Name'): string {
    if (!name.trim()) return `${label} is required`;
    if (!nameRegex.test(name)) return 'Invalid name format';
    return '';
}

export function validatePassword(password: string): string {
    if (!password) {
        return 'Password is required';
    }

    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength || !hasUppercase || !hasNumber || !hasSpecial) {
        return 'Password must be at least 8 characters and include an uppercase letter, a number, and a special character.';
    }

    return '';
}
