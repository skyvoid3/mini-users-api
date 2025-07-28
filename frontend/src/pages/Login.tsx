import { useState } from 'react';

export default function LoginForm() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<Error | null>(null);

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError(new Error('Please provide all required fields'));
            return;
        }

        try {
            const res = await fetch('http://localhost:7070/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const errData: Error = await res.json();
                throw new Error(errData.message || 'Login Failed');
            }

            const data = await res.json();

            console.log('Signup succesful', data);

            setUsername('');
            setPassword('');
        } catch (err) {
            setError(
                err instanceof Error ? err : new Error('Something went wrong'),
            );
        }
    }
    return (
        <form className="login-submit-form" onSubmit={handleLogin}>
            <h2>Log In</h2>
            <input
                type="text"
                placeholder="Username"
                className="login-username-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />

            <input
                type="password"
                placeholder="Password"
                className="login-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />

            <button className="login-submit-button" type="submit">
                Log In
            </button>

            {error && <p className="form-error-message">{error.message}</p>}
        </form>
    );
}
