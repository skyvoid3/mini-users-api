type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
};

export default function SearchBar({
    value,
    onChange,
    onSearch,
}: SearchBarProps) {
    return (
        <input
            className="search-bar"
            placeholder="Search users by username..."
            type="text"
            aria-label="Search Users"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
    );
}
