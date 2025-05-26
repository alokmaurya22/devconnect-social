// src/logic/chatLogic.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { fetchChatUsers } from './userFetch';
import { getChatId, sendMessage, listenToMessages, addToMessagedUsers } from './chatService';
import { db } from '../../configuration/firebaseConfig';

export const useChatLogic = ({ chatUserID, loggedUserId, chatUsers, setChatUsers, setSelectedUser, setMessages, selectedUser, setError, setLoading, messageEndRef }) => {
    const navigate = useNavigate();

    // Load chat users
    useEffect(() => {
        const loadUsers = async () => {
            if (!loggedUserId) return;
            try {
                setLoading(true);
                const users = await fetchChatUsers(loggedUserId);
                setChatUsers(users);
                if (chatUserID) {
                    const match = users.find((u) => u.id === chatUserID);
                    if (match) setSelectedUser(match);
                }
            } catch (err) {
                console.error('Error loading users:', err);
                setError('Failed to load contacts');
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, [loggedUserId]);

    // If user from URL not in chatUsers, fetch directly
    useEffect(() => {
        const fetchUserById = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', chatUserID));
                if (!userDoc.exists()) return navigate('/chats');
                const data = userDoc.data();

                const newUser = {
                    id: chatUserID,
                    name: data.fullName || 'Unknown',
                    dp: data.dp || `https://api.dicebear.com/7.x/thumbs/svg?seed=${chatUserID}`,
                    lastMessaged: new Date()
                };

                await addToMessagedUsers(loggedUserId, chatUserID, {
                    name: newUser.name,
                    dp: newUser.dp
                });

                // setChatUsers((prev) => [newUser, ...prev]);
                setChatUsers((prev) => {
                    const exists = prev.find(u => u.id === chatUserID);
                    return exists ? prev : [newUser, ...prev];
                });
                setSelectedUser(newUser);
            } catch (err) {
                console.error('Error loading direct user:', err);
                setError('Failed to load chat');
            } finally {
                setLoading(false);
            }
        };
        if (chatUserID && loggedUserId && !chatUsers.find((u) => u.id === chatUserID)) {
            fetchUserById();
        }
    }, [chatUserID, loggedUserId, chatUsers]);

    // Realtime message ek chat ke liye lana hai , jab bhi koi message aata hai to show ho jaye chat me
    useEffect(() => {
        if (!selectedUser || !loggedUserId) return;

        const chatId = getChatId(loggedUserId, selectedUser.id);
        const stopListeningToMessages = listenToMessages(chatId, (newMessages) => {
            setMessages(newMessages);
            if (newMessages.length > 0) {
                const lastMessage = newMessages[newMessages.length - 1];
                setChatUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === selectedUser.id
                            ? { ...user, lastMessaged: lastMessage.createdAt }
                            : user
                    )
                );
            }
        });

        return stopListeningToMessages;
    }, [selectedUser, loggedUserId]);

    // Auto-scroll to bottom
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [setMessages]);

    // Close emoji picker on outside click
    const handleOutsideClick = (emojiRef, setShowEmojiPicker) => {
        useEffect(() => {
            const handler = (e) => {
                if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                    setShowEmojiPicker(false);
                }
            };
            document.addEventListener('mousedown', handler);
            return () => document.removeEventListener('mousedown', handler);
        }, []);
    };

    // Send message
    const handleSendMessage = async ({
        messageText,
        selectedUser,
        loggedUserId,
        setMessageText,
        setError
    }) => {
        if (!messageText.trim() || !selectedUser || !loggedUserId) return;
        try {
            const currentUserDoc = await getDoc(doc(db, 'users', loggedUserId));
            const currentUserData = currentUserDoc.data();

            await sendMessage(
                getChatId(loggedUserId, selectedUser.id),
                {
                    text: messageText,
                    senderId: loggedUserId,
                    receiverId: selectedUser.id
                },
                {
                    name: currentUserData?.fullName || 'You',
                    dp: currentUserData?.dp || ''
                },
                {
                    name: selectedUser.name,
                    dp: selectedUser.dp
                }
            );

            setMessageText('');
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
        }
    };

    return {
        handleSendMessage,
        handleOutsideClick
    };
};
