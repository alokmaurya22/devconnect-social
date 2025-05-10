import React, { useState } from "react";

const usersMock = [
    { id: "u1", name: "Aman Sharma" },
    { id: "u2", name: "Priya Desai" },
    { id: "u3", name: "Ravi Kumar" },
];

const UserList = ({ onSelectUser }) => {
    const [search, setSearch] = useState("");

    const filteredUsers = usersMock.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <input
                type="text"
                placeholder="Search users..."
                className="w-full px-3 py-2 mb-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-card text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="space-y-2">
                {filteredUsers.map(user => (
                    <li
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                        className="p-2 rounded cursor-pointer hover:bg-orange-100 dark:hover:bg-dark-card border dark:border-gray-700"
                    >
                        {user.name}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default UserList;
