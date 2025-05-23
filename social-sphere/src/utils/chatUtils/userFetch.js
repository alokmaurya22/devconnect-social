// src/utils/chatHelpers.js
import { db } from "../../configuration/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

/**
 * Get unique user objects from followers and following list
 * @param {string} userId - The current user's Firestore UID
 * @returns {Promise<Array>} - List of user objects: { id, name, dp }
 */
export const fetchChatUsers = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) return [];
        console.log(userDoc.data());


        const { followers = [], followings = [] } = userDoc.data();
        const uniqueUserIds = Array.from(new Set([...followers, ...followings]));

        const userDetails = await Promise.all(
            uniqueUserIds.map(async (uid) => {
                const userSnap = await getDoc(doc(db, "users", uid));
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    return {
                        id: uid,
                        name: data.fullName || "Unnamed User",
                        dp: data.dp || `https://api.dicebear.com/7.x/thumbs/svg?seed=${uid}`,
                    };
                }
                return null;
            })
        );

        return userDetails.filter(Boolean);
    } catch (error) {
        console.error("Error fetching chat users:", error);
        return [];
    }
};
