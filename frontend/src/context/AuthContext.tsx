import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/types';
import { jwtDecode } from 'jwt-decode';
import api from '@/api';

type AuthContextType = {
    token: string | null;
    user: User | null;
    isAuthReady: boolean;
    login: (token: string) => void;
    logout: () => Promise<void>;
};

// Check if in development so errors go in dev console
const dev: boolean = import.meta.env.DEV;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<User>(token);
                setUser(decoded);
            } catch (err) {
                if (dev) {
                    console.error('Invalid token', err);
                }
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [token]);

    useEffect(() => {
        async function refreshToken() {
            try {
                const res = await api.post('/auth/refresh');
                const freshToken = res.data?.accessToken;
                if (freshToken) {
                    setToken(freshToken);
                } else {
                    setToken(null);
                    setUser(null);
                }
            } catch (err) {
                if (dev) {
                    console.error('Token refresh failed:', err);
                }
                setToken(null);
                setUser(null);
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
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
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
            value={{ token, user, isAuthReady, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider');
    }
    return context;
}
