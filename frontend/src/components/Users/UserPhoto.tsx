type UserPhotoProps = {
    username: string;
};
export default function UserPhoto({ username }: UserPhotoProps) {
    return (
        <img
            src={`https://via.placeholder.com/40?text=${username[0].toUpperCase()}`}
            alt={username}
        />
    );
}
