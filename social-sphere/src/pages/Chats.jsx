import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

const dummyUsers = [
    { id: 1, name: "John Doe", lastMessage: "Hey, how are you?" },
    { id: 2, name: "Jane Smith", lastMessage: "Let's catch up soon!" },
    { id: 3, name: "Michael Scott", lastMessage: "That's what she said!" },
];

const Chats = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [messageInput, setMessageInput] = useState("");

    const filteredUsers = dummyUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            console.log("Send message:", messageInput);
            setMessageInput("");
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px-56px)] bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark transition-colors duration-300 flex">
            {/* Sidebar: User List */}
            <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-card p-4 overflow-y-auto">
                <div className="flex items-center gap-2 bg-light-card dark:bg-[#0c0c0c] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-brand-orange mb-4">
                    <FaSearch className="text-gray-500 dark:text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-transparent focus:outline-none text-sm w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`cursor-pointer px-4 py-3 rounded-lg transition border border-transparent ${selectedUser?.id === user.id
                                ? "bg-brand-orange text-white"
                                : "hover:border-brand-orange dark:hover:border-brand-orange"
                                }`}
                        >
                            <h4 className="font-semibold">{user.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {user.lastMessage}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-card shadow">
                            <h3 className="text-xl font-semibold text-brand-orange">
                                Chat with {selectedUser.name}
                            </h3>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto bg-light-bg dark:bg-dark-bg">
                            {/* Messages go here */}
                            <div className="text-gray-500 dark:text-gray-400 italic">
                                Start a conversation with {selectedUser.name}...
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-card">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-brand-orange text-white p-3 rounded-lg hover:bg-brand-orange-hover transition"
                                >
                                    <IoSend />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-light-bg dark:bg-dark-bg">
                        <p className="text-gray-500 dark:text-gray-400 italic">
                            Select a user to start chatting
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chats;
