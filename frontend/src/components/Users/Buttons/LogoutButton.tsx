// /components/LogoutButton.tsx
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <button onClick={handleLogout} className="logout-button">
            Log Out
        </button>
    );
}
