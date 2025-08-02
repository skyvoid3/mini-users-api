import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from './Users/Buttons/LogoutButton';

export default function Navbar() {
    const { userPayload } = useAuth();
    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                MyApp
            </Link>

            <div className="navlinks">
                {!userPayload ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                ) : (
                    <>
                        <Link to="profile">My Profile</Link>
                        <LogoutButton />
                    </>
                )}
            </div>
        </nav>
    );
}
