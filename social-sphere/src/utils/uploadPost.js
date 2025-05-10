import { db, storage } from "../configuration/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
        viewType: viewtype, // ✅ save the viewtype
        mediaURL,
        mediaType,
        userId,
        userSno,
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "posts"), postData);
    return docRef.id;
};
