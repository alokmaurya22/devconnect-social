import { db } from "../../configuration/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export const fetchChatUsers = async (userId) => {
    if (!userId) return [];

    try {
        const userSnap = await getDoc(doc(db, "users", userId));
        if (!userSnap.exists()) return [];

        //This will fetch all users who are following or followed by the user
        //const { followers = [], followings = [] } = userSnap.data();
        const { followers = [], followings = [] } = "";
        const uniqueIds = new Set([...followers, ...followings]);

        const messagedSnap = await getDocs(collection(db, "users", userId, "messagedUsers"));
        messagedSnap.forEach((doc) => uniqueIds.add(doc.id));

        const users = await Promise.all(
            Array.from(uniqueIds).map(async (uid) => {
                if (uid === userId) return null;
                try {
                    const uSnap = await getDoc(doc(db, "users", uid));
                    if (!uSnap.exists()) return null;

                    const data = uSnap.data();
                    const msgDoc = messagedSnap.docs.find((d) => d.id === uid);

                    return {
                        id: uid,
                        name: data.fullName || "Unnamed",
                        dp: data.dp || `https://api.dicebear.com/7.x/thumbs/svg?seed=${uid}`,
                        lastMessaged: msgDoc?.data()?.lastMessaged,
                        isFollowing: followings.includes(uid),
                    };
                } catch (err) {
                    console.error(`Error fetching user ${uid}:`, err);
                    return null;
                }
            })
        );

        return users
            .filter(Boolean)
            .sort((a, b) => {
                const getTime = (t) => (t?.toMillis ? t.toMillis() : 0);
                return getTime(b.lastMessaged) - getTime(a.lastMessaged);
            });
    } catch (err) {
        console.error("fetchChatUsers error:", err);
        return [];
    }
};
