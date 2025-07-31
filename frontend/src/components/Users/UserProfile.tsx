import UserHeader from './UserHeader';
import UserDetails from './UserDetails';
import LogoutButton from './Buttons/LogoutButton';

export default function UserProfile() {
    return (
        <div className="user-profile">
            <UserHeader />
            <UserDetails />
            <LogoutButton />
        </div>
    );
}
