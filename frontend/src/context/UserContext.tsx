import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';
import type { User, UserPayload } from '@/types';
import api from '@/api';

// Check if in dev mode for error loggings
// Might find a better way for error logs later
const dev: boolean = import.meta.env.DEV;

type UserContextType = {
    user: User | null;
    loading: boolean;
    error: string | null;
    // TODO refreshUser: () => void
};

type UserProviderProps = {
    userPayload: UserPayload | null;
    children: ReactNode;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ userPayload, children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userPayload) {
            setUser(null);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        async function fetchUser() {
            try {
                const res = await api.get<User>('users/me');
                setUser(res.data);
            } catch (err) {
                if (dev) {
                    console.error(err);
                }
                setError('Something went wrong');
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [userPayload]);

    return (
        <UserContext.Provider value={{ user, loading, error }}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook for userContext
export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
