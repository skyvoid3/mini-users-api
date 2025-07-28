import { useState } from 'react';
import type { User } from '@/types';
import SearchBar from './SearchBar';
import UsersTable from './UsersTable';

const token = 'aa';

export default function Users() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSearch() {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);
        setFoundUser(null);

        try {
            const response = await fetch(
                `http://localhost:7070/api/users/${searchTerm}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('User not found');
                }
                throw new Error(
                    `Error ${response.status}: ${response.statusText}`,
                );
            }

            const data: User = await response.json();
            setFoundUser(data);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="users">
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
            />
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {foundUser && <UsersTable user={foundUser} />}
        </div>
    );
}
