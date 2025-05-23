import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Smile, Send, ArrowLeft } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { fetchChatUsers } from "../utils/chatUtils/userFetch";
import { db } from "../configuration/firebaseConfig";
import { getChatId, sendMessage, listenToMessages, fetchMessagedUsers } from "../utils/chatUtils/chatService";

const Chats = () => {
    const [messageText, setMessageText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [chatUsers, setChatUsers] = useState([]);
    const [messagedUsers, setMessagedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { chatUserID } = useParams();
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const emojiRef = useRef(null);
    const messageEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Load chat users and messaged users
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const loggedUserId = sessionStorage.getItem("userID");
                if (!loggedUserId) {
                    throw new Error("No user logged in");
                }

                // Fetch both regular chat users and messaged users
                const [users, messaged] = await Promise.all([
                    fetchChatUsers(loggedUserId),
                    fetchMessagedUsers(loggedUserId)
                ]);

                // Combine and deduplicate users
                const allUsers = [...users];
                messaged.forEach(messagedUser => {
                    if (!users.some(u => u.id === messagedUser.userId)) {
                        allUsers.push({
                            id: messagedUser.userId,
                            name: messagedUser.name,
                            dp: messagedUser.dp,
                            lastMessaged: messagedUser.lastMessaged
                        });
                    }
                });

                setChatUsers(allUsers);
                setMessagedUsers(messaged);

                // Select user from URL if valid
                if (chatUserID) {
                    const userToSelect = allUsers.find(u => u.id === chatUserID);
                    if (userToSelect) {
                        setSelectedUser(userToSelect);
                    } else {
                        navigate("/chats", { replace: true });
                    }
                }
            } catch (err) {
                console.error("Error loading users:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [chatUserID, navigate]);

    // Set up message listener when user is selected
    useEffect(() => {
        let unsubscribe = () => { };

        if (selectedUser) {
            try {
                const loggedUserId = sessionStorage.getItem("userID");
                if (!loggedUserId) return;

                const chatId = getChatId(loggedUserId, selectedUser.id);
                unsubscribe = listenToMessages(chatId, setMessages);
            } catch (err) {
                console.error("Error setting up message listener:", err);
                setError("Failed to load messages");
            }
        }

        return () => unsubscribe();
    }, [selectedUser]);

    const handleEmojiClick = (emojiData) => {
        setMessageText(prev => prev + emojiData.emoji);
        inputRef.current.focus();
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedUser) return;

        try {
            const loggedUserId = sessionStorage.getItem("userID");
            if (!loggedUserId) return;

            // Get current user data
            const currentUserDoc = await getDoc(doc(db, "users", loggedUserId));
            const currentUserData = currentUserDoc.data();

            const chatId = getChatId(loggedUserId, selectedUser.id);
            const newMessage = {
                text: messageText,
                senderId: loggedUserId,
                receiverId: selectedUser.id,
            };

            await sendMessage(
                chatId,
                newMessage,
                {
                    name: currentUserData.fullName || "You",
                    dp: currentUserData.dp || ""
                },
                {
                    name: selectedUser.name,
                    dp: selectedUser.dp
                }
            );
            setMessageText("");
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Failed to send message");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp?.toDate) return "";
        const date = timestamp.toDate();
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatRelativeTime = (timestamp) => {
        if (!timestamp?.toDate) return "";
        const now = new Date();
        const date = timestamp.toDate();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
            });
        } else if (diffInHours < 48) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short"
            });
        }
    };

    const loggedUserId = sessionStorage.getItem("userID");

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-5rem)] md:h-[calc(100vh-5.6rem)] w-full bg-background text-foreground mt-8 relative">
            {/* Sidebar */}
            <div className={`w-full md:w-[300px] border-r dark:border-gray-800 bg-card flex flex-col ${selectedUser ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 border-b border-gray-300 dark:border-gray-800">
                    <h2 className="text-lg font-semibold">Messages</h2>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-orange"></div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        {/* Messaged Users Section */}
                        {messagedUsers.length > 0 && (
                            <div className="p-2 space-y-1">
                                <p className="text-xs text-muted-foreground px-3 py-1">Recent conversations</p>
                                {messagedUsers.map(user => (
                                    <div
                                        key={user.userId}
                                        onClick={() => {
                                            setSelectedUser({
                                                id: user.userId,
                                                name: user.name,
                                                dp: user.dp
                                            });
                                            navigate(`/chats/${user.userId}`);
                                        }}
                                        className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedUser?.id === user.userId ? "bg-muted" : "hover:bg-muted/50"}`}
                                    >
                                        <img
                                            src={user.dp}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {formatRelativeTime(user.lastMessaged)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* All Contacts Section */}
                        <div className="p-2 space-y-1">
                            <p className="text-xs text-muted-foreground px-3 py-1">All contacts</p>
                            {chatUsers
                                .filter(user => !messagedUsers.some(m => m.userId === user.id))
                                .map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            navigate(`/chats/${user.id}`);
                                        }}
                                        className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedUser?.id === user.id ? "bg-muted" : "hover:bg-muted/50"}`}
                                    >
                                        <img
                                            src={user.dp}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {user.lastMessaged ? formatRelativeTime(user.lastMessaged) : "Not contacted yet"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Area */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-gray-800 bg-card">
                        <button
                            className="md:hidden p-2 rounded-full hover:bg-muted"
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
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                <p>No messages yet</p>
                                <p className="text-sm">Send your first message!</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isSent = msg.senderId === loggedUserId;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[75%] rounded-xl px-4 py-2 ${isSent
                                                ? "bg-brand-orange text-white"
                                                : "bg-blue-600 text-white"
                                                }`}
                                        >
                                            <p>{msg.text}</p>
                                            <p className={`text-xs mt-1 ${isSent
                                                ? "text-orange-100"
                                                : "text-blue-100"
                                                }`}>
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
                            })
                        )}
                        <div ref={messageEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-t dark:border-gray-800 bg-card relative">
                        {showEmojiPicker && (
                            <div
                                ref={emojiRef}
                                className="absolute bottom-16 left-4 z-50"
                            >
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
                                className="p-2 rounded-full hover:bg-muted"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <Smile className="w-5 h-5 text-brand-orange" />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 rounded-xl px-4 py-2 bg-background border border-input focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                autoFocus
                            />
                            <button
                                className="p-2 rounded-full bg-brand-orange text-white hover:bg-orange-600 disabled:opacity-50"
                                onClick={handleSendMessage}
                                disabled={!messageText.trim()}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-card">
                    <div className="text-center p-6 max-w-md">
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