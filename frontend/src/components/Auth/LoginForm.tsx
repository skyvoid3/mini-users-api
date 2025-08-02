import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '../../api';
import {
    validateLoginUsername,
    validateLoginPassword,
} from '../../utils/validation';
import { getLoginErrorMessage } from '@/utils/errorHandlers';

export default function LoginForm() {
    const navigate = useNavigate();
    const { login, userPayload, isAuthReady } = useAuth();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [errors, setErrors] = useState<{
        username: string;
        password: string;
    }>({
        username: '',
        password: '',
    });

    const [touched, setTouched] = useState<{
        username: boolean;
        password: boolean;
    }>({
        username: false,
        password: false,
    });

    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    useEffect(() => {
        if (isAuthReady && userPayload) {
            navigate('/profile', { replace: true });
        }
    }, [userPayload, navigate, isAuthReady]);

    if (!isAuthReady) {
        return null;
    }

    if (userPayload) {
        return null;
    }

    function handleBlur(field: 'username' | 'password') {
        setTouched((t) => ({ ...t, [field]: true }));
    }

    function validateFields() {
        return {
            username: validateLoginUsername(username),
            password: validateLoginPassword(password),
        };
    }

    function handleChange(field: 'username' | 'password', value: string) {
        if (field === 'username') {
            setUsername(value);
            setErrors((e) => ({
                ...e,
                username: validateLoginUsername(value),
            }));
        } else if (field === 'password') {
            setPassword(value);
            setErrors((e) => ({
                ...e,
                password: validateLoginPassword(value),
            }));
        }
    }

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormSubmitted(true);
        setSubmitError(null);
        setLoading(true);

        const fieldErrors = validateFields();
        setErrors(fieldErrors);

        if (Object.values(fieldErrors).some(Boolean)) {
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/login', { username, password });

            login(res.data.accessToken);

            setUsername('');
            setPassword('');
            setTouched({ username: false, password: false });
            setFormSubmitted(false);
            setErrors({ username: '', password: '' });
            navigate('/profile');
        } catch (err: unknown) {
            const em = getLoginErrorMessage(err);
            setSubmitError(em);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form
                className="login-submit-form"
                onSubmit={handleLogin}
                noValidate
            >
                <h2>Log In</h2>

                <input
                    type="text"
                    placeholder="Username"
                    className="login-username-input"
                    value={username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    onBlur={() => handleBlur('username')}
                />
                {(touched.username || formSubmitted) && errors.username && (
                    <p className="field-error">{errors.username}</p>
                )}
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    className="login-password-input"
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                />
                {(touched.password || formSubmitted) && errors.password && (
                    <p className="field-error">{errors.password}</p>
                )}
                <br />

                <button
                    className="login-submit-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Logging in…' : 'Log In'}
                </button>

                {submitError && (
                    <p className="form-error-message" role="alert">
                        {submitError}
                    </p>
                )}
            </form>

            <p className="switch-auth-link">
                Don’t have an account?{' '}
                <Link to="/signup" className="signup-link">
                    Sign up
                </Link>
            </p>
        </>
    );
}
