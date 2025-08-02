import UserHeader from './UserHeader';
import UserDetails from './UserDetails';
import type { User } from '@/types';

type UserProfileProps = {
    user: User;
};

export default function UserProfile({ user }: UserProfileProps) {
    return (
        <div className="user-profile">
            <UserHeader user={user} />
            <UserDetails user={user} />
        </div>
    );
}
