import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';

// If user is authenticated than redirect to the private page
export function PrivateRoute() {
    const { userPayload, isAuthReady } = useAuth();

    if (!isAuthReady) {
        return null;
    }

    return userPayload ? <Outlet /> : <Navigate to="/login" replace />;
}

// If user is not authenticated then redirect to login page
export function PublicRoute() {
    const { userPayload, isAuthReady } = useAuth();

    if (!isAuthReady) {
        return null;
    }

    return userPayload ? <Navigate to="/profile" replace /> : <Outlet />;
}

// This wrapper provides the protected routes with user payload
export function PrivateWrapper() {
    const { userPayload } = useAuth();
    return (
        <UserProvider userPayload={userPayload}>
            <Outlet />
        </UserProvider>
    );
}
