import { db } from "../../configuration/firebaseConfig";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "firebase/firestore";

// Generate consistent chat ID between two users
export const getChatId = (user1, user2) => {
    return [user1, user2].sort().join("_");
};

// Send a message to the correct Firestore path
export const sendMessage = async (chatId, message) => {
    try {
        // Correct path: chats/{chatId}/messages
        const messagesRef = collection(db, "chats", chatId, "messages");
        await addDoc(messagesRef, {
            ...message,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw error; // Re-throw for handling in UI
    }
};

// Listen to messages with proper error handling
export const listenToMessages = (chatId, setMessages) => {
    try {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(
            messagesRef,
            orderBy("createdAt", "asc") // Show oldest first at top
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
        }, (error) => {
            console.error("Message listener error:", error);
        });

        return unsubscribe;
    } catch (error) {
        console.error("Error setting up listener:", error);
        return () => { }; // Return empty function if setup fails
    }
};