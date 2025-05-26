// src/utils/chatService.js
import { db } from "../../configuration/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, setDoc, doc, } from "firebase/firestore";

// Function to generate a unique chat ID alphabetically sorted and joined with (_)
export const getChatId = (user1, user2) => [user1, user2].sort().join("_");

// Function to add a user to the messagedUsers subcollection, for recent chats show
export const addToMessagedUsers = async (userId, otherUserId, { name, dp }) => {
    if (!userId || !otherUserId) return;
    try {
        await setDoc(
            doc(db, "users", userId, "messagedUsers", otherUserId),
            {
                name,
                dp,
                userId: otherUserId,
                lastMessaged: serverTimestamp(),
            },
            { merge: true }
        );
    } catch (err) {
        console.error("Error updating messagedUsers:", err);
        throw err;
    }
};


// Function to send a message into a chat
export const sendMessage = async (chatId, message, senderData, receiverData) => {
    try {
        const messagesRef = collection(db, "chats", chatId, "messages");
        await addDoc(messagesRef, {
            ...message,
            createdAt: serverTimestamp(),
            status: "sent",
        });

        await Promise.all([
            addToMessagedUsers(message.senderId, message.receiverId, receiverData),
            addToMessagedUsers(message.receiverId, message.senderId, senderData),
        ]);
    } catch (err) {
        console.error("Error sending message:", err);
        throw err;
    }
};

// Function to update to messages in a chat. jab bhi koi message add/update/delete hota hai specific chat ke andar, to ye real-time mein update krta hai
export const listenToMessages = (chatId, callback) => {
    if (!chatId) return () => { };
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(
        q,
        (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().createdAt?.toMillis() || Date.now(),
            }));
            callback(messages);
        },
        (err) => {
            console.error("Message listener error:", err);
        }
    );
};
