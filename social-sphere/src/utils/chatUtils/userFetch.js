// src/utils/chatHelpers.js
import { db } from "../../configuration/firebaseConfig";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

/**
 * Get all users the current user has interacted with (followers + following + messaged users)
 * @param {string} userId - The current user's Firestore UID
 * @returns {Promise<Array>} - List of user objects: { id, name, dp, lastMessaged? }
 */
export const fetchChatUsers = async (userId) => {
    try {
        // 1. First get basic user data
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) return [];

        const { followers = [], followings = [] } = userDoc.data();
        const uniqueUserIds = new Set([...followers, ...followings]);

        // 2. Get users from messagedUsers subcollection
        const messagedUsersRef = collection(db, "users", userId, "messagedUsers");
        const messagedUsersSnap = await getDocs(messagedUsersRef);

        messagedUsersSnap.forEach(doc => {
            uniqueUserIds.add(doc.id); // Add all messaged users to the set
        });

        // 3. Fetch details for all unique users in parallel
        const users = await Promise.all(
            Array.from(uniqueUserIds).map(async (uid) => {
                try {
                    // Skip if it's the current user
                    if (uid === userId) return null;

                    const userSnap = await getDoc(doc(db, "users", uid));
                    if (!userSnap.exists()) return null;

                    const data = userSnap.data();

                    // Check if user exists in messagedUsers for lastMessaged timestamp
                    let lastMessaged = null;
                    const messagedUserDoc = messagedUsersSnap.docs.find(d => d.id === uid);
                    if (messagedUserDoc) {
                        lastMessaged = messagedUserDoc.data().lastMessaged;
                    }

                    return {
                        id: uid,
                        name: data.fullName || "Unnamed User",
                        dp: data.dp || `https://api.dicebear.com/7.x/thumbs/svg?seed=${uid}`,
                        lastMessaged,
                        // Add any other relevant fields
                    };
                } catch (error) {
                    console.error(`Error fetching user ${uid}:`, error);
                    return null;
                }
            })
        );

        // 4. Sort by lastMessaged (newest first) then by name
        return users.filter(Boolean).sort((a, b) => {
            // Users with lastMessaged come first
            if (a.lastMessaged && !b.lastMessaged) return -1;
            if (!a.lastMessaged && b.lastMessaged) return 1;

            // Both have lastMessaged - sort by timestamp
            if (a.lastMessaged && b.lastMessaged) {
                return b.lastMessaged.toMillis() - a.lastMessaged.toMillis();
            }

            // Fallback to alphabetical
            return a.name.localeCompare(b.name);
        });

    } catch (error) {
        console.error("Error in fetchChatUsers:", error);
        return [];
    }
};