import { useAuth } from '@/context/AuthContext';
import { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserHeader() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [avatarLaodError, setAvatarLoadError] = useState<boolean>(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        try {
            setLoading(true);
            navigate('/login');
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error(err);
            }
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleSignupRedirect = () => {
        try {
            setLoading(true);
            navigate('/signup');
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error(err);
            }
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div>
                <p>You Are Not Logged In</p>
                <button
                    className="login-redirect"
                    onClick={handleLoginRedirect}
                    disabled={loading}
                >
                    Log In
                </button>
                <button
                    className="signup-redirect"
                    onClick={handleSignupRedirect}
                    disabled={loading}
                >
                    Sign up
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>
        );
    }

    const avatarSrc = `${import.meta.env.VITE_API_URL}${user.avatarUrl}`;
    return (
        <div className="user-header">
            <img
                src={avatarLaodError ? '/default-avatar.png' : avatarSrc}
                alt={user.username}
                onError={() => setAvatarLoadError(true)}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}
