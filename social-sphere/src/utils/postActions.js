import { doc, collection, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, getDocs, query, where, addDoc, orderBy, limit, startAfter, deleteDoc } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";

export const toggleLike = async (postId, userId) => {
    const likeDocRef = doc(db, "posts", postId, "likes", userId);
    const docSnap = await getDoc(likeDocRef);

    if (docSnap.exists()) {
        // Unlike: directly delete
        await deleteDoc(likeDocRef);
    } else {
        // Like: add new doc
        await setDoc(likeDocRef, {
            userId,
            timestamp: new Date()
        });
    }
};

// Toggle Save (in user -> savedPosts array)
export const toggleSave = async (userId, postId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const savedPosts = userSnap.data().savedPosts || [];

    if (savedPosts.includes(postId)) {
        await updateDoc(userRef, {
            savedPosts: arrayRemove(postId)
        });
    } else {
        await updateDoc(userRef, {
            savedPosts: arrayUnion(postId)
        });
    }
};

// Log Share (subcollection)
export const logShare = async (postId, userId) => {
    const shareRef = doc(db, "posts", postId, "shares", userId);
    await setDoc(shareRef, {
        userId,
        timestamp: new Date()
    });
};

// Add comment
export const addComment = async (postId, userId, commentText, username) => {
    const commentRef = collection(db, "posts", postId, "comments");

    const newComment = {
        userId,
        username,
        text: commentText,
        timestamp: new Date()
    };

    await addDoc(commentRef, newComment);
};

// Fetch comments with pagination
export const fetchComments = async (postId, lastCommentDoc = null) => {
    let q = query(
        collection(db, "posts", postId, "comments"),
        orderBy("timestamp", "desc"),
        limit(5)
    );

    if (lastCommentDoc) {
        q = query(q, startAfter(lastCommentDoc));
    }

    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));

    return {
        comments,
        lastVisible: snapshot.docs[snapshot.docs.length - 1]
    };
};

// Check if user liked/saved/shared
export const checkPostActionStatus = async (postId, userId) => {
    if (!postId || !userId) {
        //console.warn("Invalid postId or userId passed to checkPostActionStatus");
        return {
            liked: false,
            shared: false,
            saved: false
        };
    }
    const likeRef = doc(db, "posts", postId, "likes", userId);
    const shareRef = doc(db, "posts", postId, "shares", userId);
    const userRef = doc(db, "users", userId);
    const [likeSnap, shareSnap, userSnap] = await Promise.all([
        getDoc(likeRef),
        getDoc(shareRef),
        getDoc(userRef)
    ]);

    const savedPosts = userSnap.exists() ? userSnap.data().savedPosts || [] : [];

    return {
        liked: likeSnap.exists(),
        shared: shareSnap.exists(),
        saved: savedPosts.includes(postId)
    };
};

// Get action count
export const getActionCount = async (postId, actionType) => {
    if (!postId || !actionType) {
        //console.warn("Invalid postId or actionType passed to getActionCount");
        return 0;
    }

    const subColRef = collection(db, "posts", postId, actionType);
    const snapshot = await getDocs(subColRef);
    return snapshot.size;
};


// Get users who did a specific action
export const getUsersByAction = async (postId, actionType) => {
    const subColRef = collection(db, "posts", postId, actionType);
    const snapshot = await getDocs(subColRef);
    const users = snapshot.docs.map((doc) => doc.data().userId);
    return users;
};
