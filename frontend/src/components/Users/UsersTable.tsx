import type { User } from '@/types';
import UserPhoto from './UserPhoto';

type UsersTableProps = {
    user: User;
};

export default function UsersTable({ user }: UsersTableProps) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Photo</th>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <UserPhoto username={user.username} />
                    </td>
                    <td>{user.username}</td>
                    <td>{user.fname}</td>
                    <td>{user.lname}</td>
                    <td>{user.email}</td>
                </tr>
            </tbody>
        </table>
    );
}
