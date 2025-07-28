import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    validateUsername,
    validateEmail,
    validatePassword,
    validateName,
} from '../utils/validation';

export default function SignupForm() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [errors, setErrors] = useState({
        username: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
    });

    const [touched, setTouched] = useState({
        username: false,
        fname: false,
        lname: false,
        email: false,
        password: false,
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    function validateAllFields() {
        return {
            username: validateUsername(username),
            fname: validateName(fname, 'First name'),
            lname: validateName(lname, 'Last name'),
            email: validateEmail(email),
            password: validatePassword(password),
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

        const hasErrors = Object.values(fieldErrors).some(Boolean);
        if (hasErrors) return;

        try {
            const res = await fetch('http://localhost:7070/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    fname,
                    lname,
                    email,
                    password,
                }),
            });

            if (!res.ok) {
                let errorMessage = 'Signup failed. Please try again.';
                try {
                    const errData = await res.json();
                    if (errData?.message) errorMessage = errData.message;
                } catch {}
                throw new Error(errorMessage);
            }

            setUsername('');
            setFname('');
            setLname('');
            setEmail('');
            setPassword('');
            setTouched({
                username: false,
                fname: false,
                lname: false,
                email: false,
                password: false,
            });
            setFormSubmitted(false);
            setErrors({
                username: '',
                fname: '',
                lname: '',
                email: '',
                password: '',
            });
            navigate('/login');
        } catch (err: any) {
            setSubmitError(err.message || 'Signup failed. Please try again.');
        }
    }

    return (
        <form className="signup-submit-form" onSubmit={handleSubmit} noValidate>
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

            <button className="signup_submit_button" type="submit">
                Sign Up
            </button>

            {submitError && (
                <p className="form-error-message" role="alert">
                    {submitError}
                </p>
            )}
        </form>
    );
}
