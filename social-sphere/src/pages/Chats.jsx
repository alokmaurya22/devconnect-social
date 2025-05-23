import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Smile, Send, ArrowLeft } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { fetchChatUsers } from "../utils/chatUtils/userFetch";
import { db } from "../configuration/firebaseConfig";
const Chats = () => {
    const [messageText, setMessageText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const { chatUserID } = useParams();
    const inputRef = useRef(null);
    const emojiRef = useRef(null);
    const messageEndRef = useRef(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    // Load chat users + handle chatUserID
    useEffect(() => {
        const loadUsers = async () => {
            const loggedUserId = sessionStorage.getItem("userID");
            if (!loggedUserId) return;

            let users = await fetchChatUsers(loggedUserId);

            const exists = users.some(u => u.id === chatUserID);

            if (!exists && chatUserID && chatUserID !== loggedUserId) {
                try {
                    const snap = await getDoc(doc(db, "users", chatUserID));
                    if (snap.exists()) {
                        const data = snap.data();
                        users = [
                            {
                                id: chatUserID,
                                name: data.fullName || "Unnamed User",
                                dp: data.dp || `https://api.dicebear.com/7.x/thumbs/svg?seed=${chatUserID}`,
                            },
                            ...users,
                        ];
                    }
                } catch (err) {
                    console.error("Error fetching user from chatUserID:", err);
                }
            }

            setChatUsers(users);
            const selected = users.find(u => u.id === chatUserID);
            if (selected) setSelectedUser(selected);
        };

        loadUsers();
    }, [chatUserID]);

    const handleEmojiClick = (emojiData) => {
        setMessageText((prev) => prev + emojiData.emoji);
    };

    const handleSendMessage = () => {
        if (messageText.trim() === "") return;
        const newMessage = {
            id: messages.length + 1,
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSent: true,
        };
        setMessages((prev) => [...prev, newMessage]);
        setMessageText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-[calc(100vh-5rem)] md:h-[calc(100vh-5.6rem)] w-full bg-background text-foreground mt-8 relative">
            {/* Sidebar */}
            <div className={`w-full md:w-[300px] border-r dark:border-gray-800 bg-card flex flex-col ${selectedUser ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 border-b border-gray-300 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Message</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {chatUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => {
                                setSelectedUser(user);
                                setMessages([]);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${selectedUser?.id === user.id ? "border-brand-orange bg-muted/50" : "border-transparent"
                                } hover:border-brand-orange active:border-brand-orange active:bg-muted/70 cursor-pointer transition-all duration-200`}
                        >
                            <img
                                src={user.dp}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex flex-col overflow-hidden">
                                <div className="font-semibold truncate">{user.name}</div>
                                <div className="text-sm text-muted-foreground truncate">
                                    Start chatting...
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Section */}
            {selectedUser && (
                <div className="flex-1 flex flex-col mt-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-gray-800 bg-card font-semibold">
                        <button
                            className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
                            onClick={() => setSelectedUser(null)}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <img
                            src={selectedUser.dp}
                            alt={selectedUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{selectedUser.name}</span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-2 md:px-6 py-3 space-y-2 flex flex-col">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`max-w-[70%] rounded-xl px-4 py-2 text-sm shadow-sm ${msg.isSent
                                    ? "bg-brand-orange text-white self-end ml-auto"
                                    : "bg-blue-600 text-white self-start"
                                    }`}
                            >
                                {msg.text}
                                <div className="text-xs text-muted-foreground mt-1 text-right">
                                    {msg.time}
                                </div>
                            </div>
                        ))}
                        <div ref={messageEndRef} />
                    </div>

                    {/* Input */}
                    <div className="relative px-4 py-3 border-t dark:border-gray-800 bg-card">
                        {showEmojiPicker && (
                            <div
                                ref={emojiRef}
                                className="absolute bottom-20 left-4 z-50 w-[300px] rounded-xl shadow-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    emojiStyle="native"
                                    theme="auto"
                                    height={320}
                                    width={300}
                                    previewConfig={{ showPreview: false }}
                                    skinTonesDisabled
                                    lazyLoadEmojis
                                    searchDisabled
                                    suggestedEmojisMode="recent"
                                    emojiVersion="5.0"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <button
                                className="p-2 rounded-full hover:bg-muted transition-colors"
                                onClick={() => setShowEmojiPicker((prev) => !prev)}
                            >
                                <Smile className="w-5 h-5 text-brand-orange" />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type a message"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 rounded-xl px-4 py-2 text-sm bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:focus:border-transparent"
                            />
                            <button
                                className="p-2 rounded-full bg-brand-orange text-white hover:bg-orange-600 transition-colors"
                                onClick={handleSendMessage}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chats;
