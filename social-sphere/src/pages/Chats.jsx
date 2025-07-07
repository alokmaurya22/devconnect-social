import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Smile, Send, ArrowLeft, Paperclip, Trash2 } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useChatLogic } from '../utils/chatUtils/chatLogic';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../configuration/firebaseConfig";
import compressImage from '../utils/imageCompressor';

const Chats = () => {
    const [messageText, setMessageText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { chatUserID } = useParams();
    const navigate = useNavigate();
    const messageEndRef = useRef(null);
    const emojiRef = useRef(null);
    const loggedUserId = sessionStorage.getItem('userID');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const [fileReady, setFileReady] = useState(false);
    const [imageModal, setImageModal] = useState({ open: false, url: '', name: '' });
    const [imageSending, setImageSending] = useState(false);

    const { handleSendMessage, useOutsideClick } = useChatLogic({ chatUserID, loggedUserId, chatUsers, setChatUsers, setSelectedUser, setMessages, selectedUser, setError: () => { }, setLoading, messageEndRef });

    useOutsideClick(emojiRef, setShowEmojiPicker);

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
                setError: () => { }
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileReady(false);
        }
    };

    useEffect(() => {
        if (selectedFile) setFileReady(true);
    }, [selectedFile]);

    const handleSendFile = async () => {
        if (!selectedFile) return;
        try {
            let fileToUpload = selectedFile;
            const isImage = selectedFile.type.startsWith('image');
            if (isImage) {
                setImageSending(true);
                fileToUpload = await compressImage(selectedFile, 0.3); // 0.3 MB max
            }
            const fileExtension = selectedFile.name.split('.').pop();
            const fileName = `${loggedUserId}_${Date.now()}.${fileExtension}`;
            const fileRef = ref(storage, `chatFiles/${fileName}`);
            await uploadBytes(fileRef, fileToUpload);
            const fileURL = await getDownloadURL(fileRef);
            handleSendMessage({
                messageText: isImage ? "[Image]" : "[File]",
                fileURL,
                fileType: selectedFile.type,
                fileName: selectedFile.name,
                selectedUser,
                loggedUserId,
                setMessageText,
                setError: () => { }
            });
        } catch {
            alert("Failed to upload file.");
        }
        setSelectedFile(null);
        setFileReady(false);
        setImageSending(false);
    };

    // Modal for image preview
    const ImageModal = ({ open, url, name, onClose }) => {
        if (!open) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-4 max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
                    <button className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-red-500" onClick={onClose}>&times;</button>
                    <img src={url} alt={name} className="max-w-full max-h-[70vh] mx-auto rounded" />
                    <div className="text-center text-xs text-gray-500 mt-2">{name}</div>
                </div>
            </div>
        );
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
                        {messages.map((msg, idx) => {
                            const isSent = msg.senderId === loggedUserId;
                            const prevMsg = messages[idx - 1];
                            const showAvatar = !isSent && (!prevMsg || prevMsg.senderId !== msg.senderId);
                            return (
                                <div key={msg.id} className={`flex ${isSent ? "justify-end" : "justify-start"} group transition-all duration-200`}>
                                    {!isSent && showAvatar && (
                                        <img
                                            src={selectedUser.dp}
                                            alt={selectedUser.name}
                                            className="w-7 h-7 rounded-full object-cover mr-2 self-end mb-1"
                                        />
                                    )}
                                    <div className={`max-w-[75%] rounded-xl px-4 py-1 text-sm md:text-base relative ${isSent ? "bg-brand-orange text-white" : "bg-blue-600 text-white"} shadow-sm transition-all duration-200`}>
                                        {msg.fileURL ? (
                                            msg.fileType && msg.fileType.startsWith('image') ? (
                                                <button
                                                    className="inline-flex items-center gap-2 px-4 py-1 rounded-lg bg-gradient-to-r from-orange-400 to-blue-500 text-white font-semibold shadow hover:from-orange-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition mb-1"
                                                    onClick={e => { e.preventDefault(); setImageModal({ open: true, url: msg.fileURL, name: msg.fileName || 'Image' }); }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5m-18 0A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 16.5m-18 0v-1.372a2.25 2.25 0 01.563-1.504l3.75-4.286a2.25 2.25 0 013.374 0l1.25 1.429m0 0l.75-.857a2.25 2.25 0 013.374 0l3.75 4.286a2.25 2.25 0 01.563 1.504V16.5m-9-5.25h.008v.008H12v-.008z" /></svg>
                                                    View Image
                                                </button>
                                            ) : (
                                                <a href={msg.fileURL} target="_blank" rel="noopener noreferrer" className="underline break-all block mb-1">{msg.fileName || 'Download file'}</a>
                                            )
                                        ) : (
                                            <p>{msg.text}</p>
                                        )}
                                        <div className="flex items-center justify-between mt-1">
                                            <span className={`text-xs ${isSent ? "text-orange-100" : "text-blue-100"}`}>{formatDateTime(msg.createdAt)}</span>
                                            {isSent && (
                                                <span className="ml-2">
                                                    {msg.status === 'read' ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                            {/* Placeholder for reactions */}
                                            <span className="ml-2 opacity-0 group-hover:opacity-100 transition cursor-pointer">😊</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messageEndRef} />
                    </div>

                    {/* Message Input */}
                    {selectedFile && (
                        <div className="flex items-center justify-between gap-2 mb-2 bg-gray-100 dark:bg-gray-800 p-2 px-4 rounded">
                            <div className="flex items-center gap-2">
                                {selectedFile.type.startsWith('image') ? (
                                    <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-16 h-16 object-cover rounded" />
                                ) : (
                                    <span className="text-sm">{selectedFile.name}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {!imageSending && (
                                    <>
                                        <button
                                            className="p-2 ml-2 rounded-full bg-red-500 text-white hover:bg-red-700 transition flex items-center justify-center"
                                            onClick={() => { setSelectedFile(null); setFileReady(false); }}
                                            title="Remove file"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            className={`px-3 py-1 rounded bg-brand-orange text-white font-semibold ml-2 transition ${fileReady ? 'hover:bg-orange-600' : 'opacity-50 cursor-not-allowed'}`}
                                            onClick={handleSendFile}
                                            disabled={!fileReady || imageSending}
                                        >
                                            Send
                                        </button>
                                    </>
                                )}
                            </div>
                            {/* Loading spinner for image sending */}
                            {selectedFile.type.startsWith('image') && imageSending && (
                                <div className="flex items-center ml-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-brand-orange"></div>
                                    <span className="ml-2 text-sm text-orange-600">Uploading...</span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="px-4 py-2 border-t border-border bg-card relative">
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
                                onClick={() => setShowEmojiPicker((v) => !v)}
                                title="Emoji"
                            >
                                <Smile className="w-5 h-5" />
                            </button>
                            <button
                                className="p-2 rounded-full hover:bg-muted transition"
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                title="Attach file"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <textarea
                                className="flex-1 resize-none rounded-lg border border-border px-3 py-1 text-sm bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange transition min-h-[32px] max-h-[80px]"
                                rows={1}
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ minHeight: '32px', maxHeight: '80px' }}
                            />
                            <button
                                className="p-2 rounded-full bg-brand-orange text-white hover:bg-orange-600 transition disabled:opacity-50"
                                onClick={() => handleSendMessage({ messageText, selectedUser, loggedUserId, setMessageText, setError: () => { } })}
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
            <ImageModal open={imageModal.open} url={imageModal.url} name={imageModal.name} onClose={() => setImageModal({ open: false, url: '', name: '' })} />
        </div>
    );
};

export default Chats;