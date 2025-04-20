import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { FaSmile, FaPaperPlane } from "react-icons/fa";

const MessageInput = ({ onSend }) => {
    const [message, setMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);

    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };

    const handleSubmit = () => {
        onSend(message);
        setMessage("");
    };

    return (
        <div className="mt-4 border-t pt-2 dark:border-gray-700">
            {showEmoji && (
                <div className="absolute bottom-16">
                    <Picker onEmojiClick={handleEmojiClick} theme="dark" />
                </div>
            )}
            <div className="flex items-center gap-2">
                <button onClick={() => setShowEmoji(!showEmoji)}>
                    <FaSmile className="text-xl text-brand-orange" />
                </button>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-dark-card"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-brand-orange text-white px-3 py-2 rounded hover:bg-orange-600 transition"
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
