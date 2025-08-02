import UserProfile from '../components/Users/UserProfile';
import { useUser } from '@/context/UserContext';

const dev: boolean = import.meta.env.DEV;

export default function ProfilePage() {
    const { user, loading, error } = useUser();

    if (loading) return <p>Loading your profile..</p>;
    if (error) {
        if (dev) {
            console.error(error);
        }
        return <p>Something went wrong</p>;
    }

    if (!user) {
        return <p>Unable to load user data</p>;
    }

    return (
        <div className="profile-page">
            <UserProfile user={user} />
        </div>
    );
}
