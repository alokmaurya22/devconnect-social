import { db } from "../../configuration/firebaseConfig";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    setDoc,
    doc,
    getDocs
} from "firebase/firestore";

/**
 * Generates a consistent chat ID between two users
 * @param {string} user1 - First user ID
 * @param {string} user2 - Second user ID
 * @returns {string} Combined chat ID
 */
export const getChatId = (user1, user2) => {
    return [user1, user2].sort().join("_");
};

/**
 * Adds a user to messagedUsers subcollection
 * @param {string} userId - Current user ID
 * @param {string} otherUserId - Other user ID to add
 * @param {object} otherUserData - Other user's data (name, dp)
 */
export const addToMessagedUsers = async (userId, otherUserId, otherUserData) => {
    try {
        const userRef = doc(db, "users", userId, "messagedUsers", otherUserId);
        await setDoc(userRef, {
            userId: otherUserId,
            name: otherUserData.name || "Unknown User",
            dp: otherUserData.dp || `https://api.dicebear.com/7.x/thumbs/svg?seed=${otherUserId}`,
            lastMessaged: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error updating messagedUsers:", error);
        throw error;
    }
};

/**
 * Fetches all users the current user has messaged
 * @param {string} userId - Current user ID
 * @returns {Promise<Array>} List of messaged users
 */
export const fetchMessagedUsers = async (userId) => {
    try {
        const q = query(
            collection(db, "users", userId, "messagedUsers"),
            orderBy("lastMessaged", "desc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            userId: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching messaged users:", error);
        return [];
    }
};

/**
 * Sends a message and updates messagedUsers for both parties
 * @param {string} chatId - Chat ID between users
 * @param {object} message - Message content {text, senderId, receiverId}
 * @param {object} senderData - Sender's profile data {name, dp}
 * @param {object} receiverData - Receiver's profile data {name, dp}
 */
export const sendMessage = async (chatId, message, senderData, receiverData) => {
    try {
        // 1. Send the actual message
        const messagesRef = collection(db, "chats", chatId, "messages");
        const messageDoc = await addDoc(messagesRef, {
            ...message,
            createdAt: serverTimestamp(),
            status: 'sent' // Can be 'sent', 'delivered', or 'read'
        });

        // 2. Update sender's messagedUsers
        await addToMessagedUsers(
            message.senderId,
            message.receiverId,
            receiverData
        );

        // 3. Update receiver's messagedUsers
        await addToMessagedUsers(
            message.receiverId,
            message.senderId,
            senderData
        );

        return messageDoc.id;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

/**
 * Sets up real-time listener for messages in a chat
 * @param {string} chatId - Chat ID between users
 * @param {function} callback - Function to call with new messages
 * @returns {function} Unsubscribe function
 */
export const listenToMessages = (chatId, callback) => {
    try {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(
            messagesRef,
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        }, (error) => {
            console.error("Message listener error:", error);
        });

        return unsubscribe;
    } catch (error) {
        console.error("Error setting up message listener:", error);
        return () => { }; // Return empty function if setup fails
    }
};

/**
 * Updates message status (e.g., 'read')
 * @param {string} chatId - Chat ID
 * @param {string} messageId - Message ID
 * @param {string} status - New status ('delivered' or 'read')
 */
export const updateMessageStatus = async (chatId, messageId, status) => {
    try {
        const messageRef = doc(db, "chats", chatId, "messages", messageId);
        await setDoc(messageRef, { status }, { merge: true });
    } catch (error) {
        console.error("Error updating message status:", error);
        throw error;
    }
};