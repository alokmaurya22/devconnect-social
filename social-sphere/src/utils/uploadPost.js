import { db, storage } from "../configuration/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, deleteDoc, } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject, } from "firebase/storage";

/**
 * Upload a new post with optional image or video
 */
export const uploadPost = async ({ title, content, tag, file, viewtype }) => {
    const userId = sessionStorage.getItem("userID");
    const userSno = sessionStorage.getItem("userSno");

    if (!userId || !userSno) throw new Error("User not authenticated.");

    const postUserId = `${userId}_${Date.now()}`;

    let mediaURL = "";
    let mediaType = "";

    if (file) {
        const fileExtension = file.name.split(".").pop();
        const newFileName = `${postUserId}.${fileExtension}`;
        const fileRef = ref(storage, `posts/${newFileName}`);

        await uploadBytes(fileRef, file);
        mediaURL = await getDownloadURL(fileRef);
        mediaType = file.type.startsWith("image") ? "image" : "video";
    }

    const postData = {
        postUserId,
        title,
        content,
        tag,
        viewType: viewtype,
        mediaURL,
        mediaType,
        userId,
        userSno,
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "posts"), postData);
    return docRef.id;
};

/**
 * Edit a post with new data (image won't be changed)
 * Adds 'editedAt' time
 */
export const editPost = async (postId, updatedData) => {
    if (!postId || !updatedData) throw new Error("Invalid input for editPost");

    const postRef = doc(db, "posts", postId);

    const updates = {
        ...updatedData,
        editedAt: serverTimestamp(), // Store edit time
    };

    await updateDoc(postRef, updates);
    return true;
};

/**
 * Fetch a post for pre-filling edit form
 */
export const fetchPostForEdit = async (postId) => {
    if (!postId) throw new Error("Post ID is required");

    const postRef = doc(db, "posts", postId);
    const snapshot = await getDoc(postRef);

    if (!snapshot.exists()) {
        throw new Error("Post not found");
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    };
};

/**
 * Delete post from Firestore and delete media file from Storage
 */
export const deletePost = async (postId) => {
    if (!postId) throw new Error("Post ID is required");
    //console.log("Deleting Post ID", postId, "utills code");
    //return false;
    const postRef = doc(db, "posts", postId);
    const snapshot = await getDoc(postRef);

    if (!snapshot.exists()) {
        throw new Error("Post not found");
    }

    const { mediaURL } = snapshot.data();

    // Try deleting from Storage if mediaURL exists
    if (mediaURL) {
        try {
            const fileRef = ref(storage, mediaURL);
            await deleteObject(fileRef);
        } catch (error) {
            console.warn("Warning: Could not delete media from storage.", error);
        }
    }

    // Finally delete the post from Firestore
    await deleteDoc(postRef);
    return true;
};


//old upload Post function
/*
export const uploadPost = async ({ title, content, tag, file, viewtype }) => {
    const userId = sessionStorage.getItem("userID");
    const userSno = sessionStorage.getItem("userSno");

    if (!userId || !userSno) throw new Error("User not authenticated.");

    const postUserId = `${userId}_${Date.now()}`;

    let mediaURL = "";
    let mediaType = "";

    if (file) {
        const fileExtension = file.name.split(".").pop();
        const newFileName = `${postUserId}.${fileExtension}`;
        const fileRef = ref(storage, `posts/${newFileName}`);

        await uploadBytes(fileRef, file);
        mediaURL = await getDownloadURL(fileRef);
        mediaType = file.type.startsWith("image") ? "image" : "video";
    }
    const postData = {
        postUserId,
        title,
        content,
        tag,
        viewType: viewtype,
        mediaURL,
        mediaType,
        userId,
        userSno,
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "posts"), postData);
    return docRef.id;
};
*/