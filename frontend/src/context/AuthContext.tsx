import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserPayload } from '@/types';
import { jwtDecode } from 'jwt-decode';
import api, { syncAccessToken } from '@/api';

type AuthContextType = {
    token: string | null;
    userPayload: UserPayload | null;
    isAuthReady: boolean;
    login: (token: string) => void;
    logout: () => Promise<void>;
};

// Check if in development so errors go in dev console
const dev: boolean = import.meta.env.DEV;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [userPayload, setUserPayload] = useState<UserPayload | null>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

    // When token changes state this effect activates and tries to set the user payload
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<UserPayload>(token);
                setUserPayload(decoded);
            } catch (err) {
                if (dev) {
                    console.error('Invalid token', err);
                }
                setUserPayload(null);
            }
        } else {
            setUserPayload(null);
        }
    }, [token]);

    // Used on every page load or reload to get new accessToken
    useEffect(() => {
        async function refreshToken() {
            try {
                const res = await api.post('/auth/refresh');
                const freshToken = res.data?.accessToken;
                if (freshToken) {
                    setToken(freshToken);
                    syncAccessToken(freshToken);
                } else {
                    setToken(null);
                    setUserPayload(null);
                }
            } catch (err) {
                if (dev) {
                    console.error('Token refresh failed:', err);
                }
                setToken(null);
                syncAccessToken(null);
                setUserPayload(null);
            } finally {
                setIsAuthReady(true);
            }
        }

        refreshToken();
    }, []);

    const login = (newToken: string) => {
        if (!newToken || typeof newToken !== 'string' || !newToken.trim()) {
            throw new Error('Invalid token provided to login()');
        }
        setToken(newToken);
        syncAccessToken(newToken);
    };

    // Logout the user and delete session from db
    const logout = async () => {
        setToken(null);
        syncAccessToken(null);
        setUserPayload(null);
        try {
            await api.post('/auth/logout');
        } catch (err) {
            if (dev) {
                console.error(err);
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{ token, userPayload, isAuthReady, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for authContext
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider');
    }
    return context;
}
