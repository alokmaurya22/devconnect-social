import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";

/**
 * Follow a user
 * @param {string} loggedUserID - ID of the logged-in user
 * @param {string} searchedUserID - ID of the user to follow
 */
export const followUser = async (loggedUserID, searchedUserID) => {
    try {
        if (loggedUserID === searchedUserID) return false;

        const loggedUserRef = doc(db, "users", loggedUserID);
        const searchedUserRef = doc(db, "users", searchedUserID);

        // Add searchedUserID to loggedUser's followings
        await updateDoc(loggedUserRef, {
            followings: arrayUnion(searchedUserID),
        });

        // Add loggedUserID to searchedUser's followers
        await updateDoc(searchedUserRef, {
            followers: arrayUnion(loggedUserID),
        });

        return true;
    } catch (error) {
        console.error("Error following user:", error);
        return false;
    }
};

/**
 * Unfollow a user
 * @param {string} loggedUserID - ID of the logged-in user
 * @param {string} searchedUserID - ID of the user to unfollow
 */
export const unfollowUser = async (loggedUserID, searchedUserID) => {
    try {
        if (loggedUserID === searchedUserID) return false;

        const loggedUserRef = doc(db, "users", loggedUserID);
        const searchedUserRef = doc(db, "users", searchedUserID);

        // Remove searchedUserID from loggedUser's followings
        await updateDoc(loggedUserRef, {
            followings: arrayRemove(searchedUserID),
        });

        // Remove loggedUserID from searchedUser's followers
        await updateDoc(searchedUserRef, {
            followers: arrayRemove(loggedUserID),
        });

        return true;
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return false;
    }
};

/**
 * Check if userA is following userB
 * @param {string} loggedUserID - Logged-in user ID
 * @param {string} searchedUserID - Profile being viewed
 */
export const checkIfFollowing = async (loggedUserID, searchedUserID) => {
    try {
        if (!loggedUserID || !searchedUserID || loggedUserID === searchedUserID) return false;

        const loggedUserRef = doc(db, "users", loggedUserID);
        const loggedUserSnap = await getDoc(loggedUserRef);

        if (!loggedUserSnap.exists()) return false;

        const data = loggedUserSnap.data();
        return data.followings?.includes(searchedUserID) || false;
    } catch (error) {
        console.error("Error checking follow status:", error);
        return false;
    }
};