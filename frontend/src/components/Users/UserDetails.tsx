import type { User } from '@/types';

type UserDetailsProps = {
    user: User;
};

export default function UserDetails({ user }: UserDetailsProps) {
    const formattedDate = new Date(user.createdAt).toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        },
    );

    return (
        <section aria-label="User Details">
            <div className="user-details">
                <h2>User Details</h2>
                <dl>
                    <dt>First Name</dt>
                    <dd>{user.fname}</dd>

                    <dt>Last Name</dt>
                    <dd>{user.lname}</dd>

                    <dt>Email</dt>
                    <dd>{user.email}</dd>

                    <dt>Joined</dt>
                    <dd>{formattedDate}</dd>
                </dl>
            </div>
        </section>
    );
}
