import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import {
    validateUsername,
    validateEmail,
    validatePassword,
    validateName,
    validateRepeatPassword,
} from '../../utils/validation';
import type { SignupFieldErrors, SignupFieldTouched } from '@/types';
import { getSignupErrorMessage } from '@/utils/errorHandlers';
import { useAuth } from '@/context/AuthContext';

export default function SignupForm() {
    const navigate = useNavigate();

    const { userPayload, isAuthReady } = useAuth();

    const [username, setUsername] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [errors, setErrors] = useState<SignupFieldErrors>({
        username: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    const [touched, setTouched] = useState<SignupFieldTouched>({
        username: false,
        fname: false,
        lname: false,
        email: false,
        password: false,
        repeatPassword: false,
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

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

    function validateAllFields() {
        return {
            username: validateUsername(username),
            fname: validateName(fname, 'First name'),
            lname: validateName(lname, 'Last name'),
            email: validateEmail(email),
            password: validatePassword(password),
            repeatPassword: validateRepeatPassword(password, repeatPassword),
        };
    }

    function handleChange(field: keyof typeof errors, value: string) {
        switch (field) {
            case 'username':
                setUsername(value);
                setErrors((e) => ({ ...e, username: validateUsername(value) }));
                break;
            case 'fname':
                setFname(value);
                setErrors((e) => ({
                    ...e,
                    fname: validateName(value, 'First name'),
                }));
                break;
            case 'lname':
                setLname(value);
                setErrors((e) => ({
                    ...e,
                    lname: validateName(value, 'Last name'),
                }));
                break;
            case 'email':
                setEmail(value);
                setErrors((e) => ({ ...e, email: validateEmail(value) }));
                break;
            case 'password':
                setPassword(value);
                setErrors((e) => ({ ...e, password: validatePassword(value) }));
                break;
            case 'repeatPassword':
                setRepeatPassword(value);
                setErrors((e) => ({
                    ...e,
                    repeatPassword: validateRepeatPassword(password, value),
                }));
                break;
        }
    }

    function handleBlur(field: keyof typeof touched) {
        setTouched((t) => ({ ...t, [field]: true }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormSubmitted(true);
        setSubmitError(null);

        const fieldErrors = validateAllFields();
        setErrors(fieldErrors);

        if (Object.values(fieldErrors).some(Boolean)) return;

        try {
            await api.post('/auth/signup', {
                username,
                fname,
                lname,
                email,
                password,
            });

            // Cleanup
            setUsername('');
            setFname('');
            setLname('');
            setEmail('');
            setPassword('');
            setRepeatPassword('');
            setTouched({
                username: false,
                fname: false,
                lname: false,
                email: false,
                password: false,
                repeatPassword: false,
            });
            setFormSubmitted(false);
            setErrors({
                username: '',
                fname: '',
                lname: '',
                email: '',
                password: '',
                repeatPassword: '',
            });

            navigate('/login');
        } catch (err: unknown) {
            const em = getSignupErrorMessage(err);
            setSubmitError(em);
        }
    }

    return (
        <>
            <form
                className="signup-submit-form"
                onSubmit={handleSubmit}
                noValidate
            >
                <h2>Sign Up</h2>

                <input
                    className="signup-username-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    onBlur={() => handleBlur('username')}
                />
                {(touched.username || formSubmitted) && errors.username && (
                    <p className="field-error">{errors.username}</p>
                )}
                <br />

                <input
                    className="signup-fname-input"
                    type="text"
                    placeholder="First Name"
                    value={fname}
                    onChange={(e) => handleChange('fname', e.target.value)}
                    onBlur={() => handleBlur('fname')}
                />
                {(touched.fname || formSubmitted) && errors.fname && (
                    <p className="field-error">{errors.fname}</p>
                )}
                <br />

                <input
                    className="signup-lname-input"
                    type="text"
                    placeholder="Last Name"
                    value={lname}
                    onChange={(e) => handleChange('lname', e.target.value)}
                    onBlur={() => handleBlur('lname')}
                />
                {(touched.lname || formSubmitted) && errors.lname && (
                    <p className="field-error">{errors.lname}</p>
                )}
                <br />

                <input
                    className="signup-email-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                />
                {(touched.email || formSubmitted) && errors.email && (
                    <p className="field-error">{errors.email}</p>
                )}
                <br />

                <input
                    className="signup-password-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                />
                {(touched.password || formSubmitted) && errors.password && (
                    <p className="field-error">{errors.password}</p>
                )}
                <br />

                <input
                    className="signup-repeat-password-input"
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) =>
                        handleChange('repeatPassword', e.target.value)
                    }
                    onBlur={() => handleBlur('repeatPassword')}
                />
                {(touched.repeatPassword || formSubmitted) &&
                    errors.repeatPassword && (
                        <p className="field-error">{errors.repeatPassword}</p>
                    )}
                <br />

                <button className="signup_submit_button" type="submit">
                    Sign Up
                </button>

                {submitError && (
                    <p className="form-error-message" role="alert">
                        {submitError}
                    </p>
                )}
            </form>

            <p className="switch-auth-link">
                Already have an account?{' '}
                <Link to="/login" className="login-link">
                    Log in
                </Link>
            </p>
        </>
    );
}
