import type { User } from '@/types';

export default function UserInfo({ fname, lname, email }: User) {
    return (
        <div className="user_info">
            <strong>
                {fname} {lname}
            </strong>
            <br />
            <small>{email}</small>
        </div>
    );
}
