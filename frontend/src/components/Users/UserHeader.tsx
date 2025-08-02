import { useState } from 'react';
import type { User } from '@/types';

type UserHeaderProps = {
    user: User;
};

export default function UserHeader({ user }: UserHeaderProps) {
    const [avatarLaodError, setAvatarLoadError] = useState<boolean>(false);

    const avatarSrc = `${import.meta.env.VITE_API_URL}${user.avatarUrl}`;
    return (
        <div className="user-header">
            <img
                src={avatarLaodError ? '/default-avatar.png' : avatarSrc}
                alt={user.username}
                onError={() => setAvatarLoadError(true)}
            />
        </div>
    );
}
