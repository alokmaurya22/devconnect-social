import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Smile, Send, ArrowLeft } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useChatLogic } from '../utils/chatUtils/chatLogic';

const Chats = () => {
    const [messageText, setMessageText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { chatUserID } = useParams();
    const navigate = useNavigate();
    const messageEndRef = useRef(null);
    const emojiRef = useRef(null);
    const loggedUserId = sessionStorage.getItem('userID');

    const { handleSendMessage, handleOutsideClick } = useChatLogic({ chatUserID, loggedUserId, chatUsers, setChatUsers, setSelectedUser, setMessages, selectedUser, setError, setLoading, messageEndRef });

    handleOutsideClick(emojiRef, setShowEmojiPicker);

    const handleEmojiClick = (emojiData) => {
        setMessageText((prev) => prev + emojiData.emoji);
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp?.toDate) return '';
        const date = timestamp.toDate();
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatRelativeTime = (timestamp) => {
        let date;
        if (timestamp?.toDate) date = timestamp.toDate();
        else if (timestamp instanceof Date) date = timestamp;
        else return '';

        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short'
            });
        }
    };

    const sortUsers = (a, b) => {
        const getTime = (timestamp) =>
            timestamp?.toDate ? timestamp.toDate().getTime() : timestamp?.getTime?.() || 0;
        return getTime(b.lastMessaged) - getTime(a.lastMessaged);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage({
                messageText,
                selectedUser,
                loggedUserId,
                setMessageText,
                setError
            });
        }
    };

    return (
        <div className="flex h-[calc(100vh-5rem)] md:h-[calc(100vh-5.6rem)] w-full bg-background text-foreground mt-9 relative">
            {/* Sidebar */}
            <div className={`w-full md:w-[300px] border-r border-border bg-card flex flex-col ${selectedUser ? "hidden md:flex" : "flex"} mt-1`}>
                <div className="px-5 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Messages</h2>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-orange"></div>
                    </div>
                ) : chatUsers.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                        No chats available
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto px-2 py-2">
                        {[...chatUsers].sort(sortUsers).map((user) => (
                            <div
                                key={user.id}
                                onClick={() => {
                                    setSelectedUser(user);
                                    navigate(`/chats/${user.id}`);
                                }}
                                className={`flex items-center px-4 py-2 cursor-pointer rounded-lg transition-colors duration-200 border 
                    ${selectedUser?.id === user.id
                                        ? "bg-orange-100 border-orange-500 dark:bg-orange-900/30"
                                        : "hover:bg-muted/50 hover:border-orange-500 border-transparent"}`}
                            >
                                <img
                                    src={user.dp}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full mr-3 object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user.lastMessaged ? formatRelativeTime(user.lastMessaged) : "New conversation"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Chat Area */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
                        <button
                            className="md:hidden p-2 rounded-full hover:bg-muted transition"
                            onClick={() => {
                                setSelectedUser(null);
                                navigate("/chats");
                            }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <img
                            src={selectedUser.dp}
                            alt={selectedUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{selectedUser.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                {messages.length > 0
                                    ? `Last active: ${formatDateTime(messages[messages.length - 1].createdAt)}`
                                    : "Online"}
                            </p>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-background">
                        {messages.map((msg) => {
                            const isSent = msg.senderId === loggedUserId;
                            return (
                                <div key={msg.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[75%] rounded-xl px-4 py-1 text-sm md:text-base ${isSent ? "bg-brand-orange text-white" : "bg-blue-600 text-white"}`}>
                                        <p>{msg.text}</p>
                                        <p className={`text-xs mt-1 ${isSent ? "text-orange-100" : "text-blue-100"}`}>
                                            {formatDateTime(msg.createdAt)}
                                            {isSent && (
                                                <span className="ml-2">
                                                    {msg.status === 'read' ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messageEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="px-4 py-3 border-t border-border bg-card relative">
                        {showEmojiPicker && (
                            <div ref={emojiRef} className="absolute bottom-16 left-4 z-50">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    emojiStyle="native"
                                    theme="auto"
                                    height={350}
                                    width={300}
                                    previewConfig={{ showPreview: false }}
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <button
                                className="p-2 rounded-full hover:bg-muted transition"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <Smile className="w-5 h-5 text-brand-orange" />
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 rounded-xl px-4 py-2 text-sm bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:focus:border-transparent"
                                autoFocus
                            />
                            <button
                                className="p-2 rounded-full bg-brand-orange text-white hover:bg-orange-600 transition disabled:opacity-50"
                                onClick={() => handleSendMessage({ messageText, selectedUser, loggedUserId, setMessageText, setError })}
                                disabled={!messageText.trim()}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 items-center justify-center bg-card">
                    <div className="text-center px-6 py-10 max-w-md">
                        <h3 className="text-xl font-medium mb-2">No chat selected</h3>
                        <p className="text-muted-foreground">
                            {chatUsers.length > 0
                                ? "Select a conversation from the sidebar"
                                : "You don't have any conversations yet"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chats;