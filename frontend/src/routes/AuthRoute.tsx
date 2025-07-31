import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function PrivateRoute() {
    const { user, isAuthReady } = useAuth();

    if (!isAuthReady) {
        return null;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function PublicRoute() {
    const { user, isAuthReady } = useAuth();

    if (!isAuthReady) {
        return null;
    }

    return user ? <Navigate to="/profile" replace /> : <Outlet />;
}
