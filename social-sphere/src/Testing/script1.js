import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, writeBatch } from "firebase/firestore";

// Firebase Configuration (directly in this script)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// List of user IDs to choose from
const userIDs = [
    "6NiQhdrIRrXpwXzpxCz47pj0Z2w1",
    "DOLsZvwpy5fJBmsWbT95jRNXUPG3",
    "MSuOjKC40IbowGrvQZMAioX9c3y2",
    "OcMcWDwNahRYGoM5F0btqQP8jdm2",
    "mRD4R4HsJIPdZt7uMLrWBbG1Dcc2",
    "qcmCzNboLFc7miLmdVDyRXNkGQq1",
    "vaDHAYf1wtQq1XtgIvj2xBHWCnW2",
];

// Function to get a random userID from the list
const getRandomUserId = () => {
    const randomIndex = Math.floor(Math.random() * userIDs.length);
    return userIDs[randomIndex];
};

// Function to update userID in all posts
const updatePostsUserId = async () => {
    const postsRef = collection(db, "posts");

    // Fetch all posts
    const querySnapshot = await getDocs(postsRef);

    // Initialize batch operation
    const batch = writeBatch(db);

    console.log(`Fetched ${querySnapshot.size} posts`);

    // Loop through each post and add the update to the batch
    querySnapshot.forEach((docSnap) => {
        const postRef = doc(db, "posts", docSnap.id);
        const newUserId = getRandomUserId(); // Get a random userID

        // Add update to the batch
        batch.update(postRef, { userId: newUserId });

        console.log(`Added post with ID ${docSnap.id} to batch with new userID: ${newUserId}`);
    });

    // Commit the batch update
    try {
        await batch.commit();
        console.log("All posts updated successfully!");
    } catch (error) {
        console.error("Error committing batch update: ", error);
    }
};

// Call the function to update the posts
updatePostsUserId();
