// src/chatService.js
import { db } from "../../configuration/firebaseConfig";
import {
    collection,
    doc,
    setDoc,
    getDocs,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore";

export const getChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
};

export const sendMessage = async (chatId, messageData) => {
    const messageRef = doc(collection(db, "chats", chatId, "messages"));
    await setDoc(messageRef, messageData);
};

export const listenToMessages = (chatId, callback) => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        callback(messages);
    });
};

export const getAllUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => doc.data());
};
