import { doc, getDoc, deleteDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";
import { serverTimestamp } from "firebase/firestore";

// logic to Follow a user
/**
 * Follow a user using subcollections for scalability.
 * @param {string} loggedUserID - ID of the currently logged-in user.
 * @param {string} searchedUserID - ID of the user to follow.
 * @returns {boolean} - True if follow was successful oteherwise false.
 */
export const followUser = async (loggedUserID, searchedUserID) => {
    try {
        if (loggedUserID === searchedUserID) return false;

        const loggedUserFollowingRef = doc(db, `users/${loggedUserID}/followings`, searchedUserID);
        const searchedUserFollowerRef = doc(db, `users/${searchedUserID}/followers`, loggedUserID);

        // Store the user ID with timestamp in both subcollections
        await setDoc(loggedUserFollowingRef, {
            userId: searchedUserID,
            followedAt: serverTimestamp(),
        });

        await setDoc(searchedUserFollowerRef, {
            userId: loggedUserID,
            followedAt: serverTimestamp(),
        });

        return true;
    } catch (error) {
        console.error("Error following user:", error);
        return false;
    }
};


// logic to Unfollow a user
/**
 * Unfollow a user using subcollections (followers & followings).
 * @param {string} loggedUserID - ID of the logged-in user
 * @param {string} searchedUserID - ID of the user to unfollow
 * @returns {boolean}
 */
export const unfollowUser = async (loggedUserID, searchedUserID) => {
    try {
        if (loggedUserID === searchedUserID) return false;

        const loggedUserFollowingRef = doc(db, `users/${loggedUserID}/followings`, searchedUserID);
        const searchedUserFollowerRef = doc(db, `users/${searchedUserID}/followers`, loggedUserID);

        // Delete following entry from logged-in user's subcollection
        await deleteDoc(loggedUserFollowingRef);

        // Delete follower entry from searched user's subcollection
        await deleteDoc(searchedUserFollowerRef);

        return true;
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return false;
    }
};

// logic to check follow status
/**
 * Check if loggedUser is following searchedUser using subcollections.
 * @param {string} loggedUserID - ID of the logged-in user
 * @param {string} searchedUserID - ID of the user being checked
 * @returns {boolean}
 */
export const checkIfFollowing = async (loggedUserID, searchedUserID) => {
    try {
        if (!loggedUserID || !searchedUserID || loggedUserID === searchedUserID) return false;

        const followingDocRef = doc(db, `users/${loggedUserID}/followings`, searchedUserID);
        const followingSnap = await getDoc(followingDocRef);

        return followingSnap.exists();
    } catch (error) {
        console.error("Error checking follow status:", error);
        return false;
    }
};

//Retrieves all followers of a user with their IDs and timestamps
/**
 * Retrieves all followers of a user with their IDs and timestamps.
 * @param {string} userID - ID of the user whose followers are to be retrieved.
 * @returns {Promise<Array<{userId: string, followedAt: Timestamp}>>} - A promise that resolves to an array of follower objects, each containing the userId and followedAt timestamp. Returns an empty array if there are no followers or an error occurs.
 */
export const getFollowers = async (userID) => {
    try {
        const followersCollectionRef = collection(db, `users/${userID}/followers`);
        const followersSnapshot = await getDocs(followersCollectionRef);

        const followers = followersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                userId: data.userId,
                followedAt: data.followedAt,
            };
        });

        return followers;
    } catch (error) {
        console.error("Error getting followers:", error);
        return [];
    }
};

//Retrieves all followings of a user with their IDs and timestamps.
/**
 * Retrieves all followings of a user with their IDs and timestamps.
 * @param {string} userID - ID of the user whose followings are to be retrieved.
 * @returns {Promise<Array<{userId: string, followedAt: Timestamp}>>} - A promise that resolves to an array of following objects, each containing the userId and followedAt timestamp. Returns an empty array if there are no followings or an error occurs.
 */
export const getFollowings = async (userID) => {
    try {
        const followingsCollectionRef = collection(db, `users/${userID}/followings`);
        const followingsSnapshot = await getDocs(followingsCollectionRef);

        const followings = followingsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                userId: data.userId,
                followedAt: data.followedAt,
            };
        });

        return followings;
    } catch (error) {
        console.error("Error getting followings:", error);
        return [];
    }
};

/*
// How can we use these functions
const userID = "someUserID";

getFollowers(userID)
  .then(followers => {
    console.log("Followers:", followers);
    // followers will be an array of objects like:
    // [{ userId: "user1", followedAt: Timestamp }, { userId: "user2", followedAt: Timestamp }, ...]
  })
  .catch(error => {
    console.error("Failed to get followers:", error);
  });

getFollowings(userID)
  .then(followings => {
    console.log("Following:", followings);
    // followings will be an array of objects like:
    // [{ userId: "userA", followedAt: Timestamp }, { userId: "userB", followedAt: Timestamp }, ...]
  })
  .catch(error => {
    console.error("Failed to get followings:", error);
  });
*/

//Retrieves the follower and following counts for a user
/**
 * Gets the follower and following counts for a user.
 * @param {string} userID - The ID of the user.
 * @returns {Promise<{ followerCount: number, followingCount: number }>} An object containing the follower and following counts.  Returns { followerCount: 0, followingCount: 0 } on error.
 */
export const getFollowCounts = async (userID) => {
    try {
        const followersCollectionRef = collection(db, `users/${userID}/followers`);
        const followingsCollectionRef = collection(db, `users/${userID}/followings`);

        const [followersSnapshot, followingsSnapshot] = await Promise.all([
            getDocs(followersCollectionRef),
            getDocs(followingsCollectionRef),
        ]);

        const followerCount = followersSnapshot.size; // Use .size to get the number of documents
        const followingCount = followingsSnapshot.size; // Use .size to get the number of documents

        return { followerCount, followingCount };
    } catch (error) {
        console.error("Error getting follow counts:", error);
        return { followerCount: 0, followingCount: 0 };
    }
};