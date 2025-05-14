import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";
import { FaComment } from "react-icons/fa";
import { followUser, unfollowUser, checkIfFollowing } from "../utils/followUtils";

const UserProfilePage = () => {
    const { userId: searchedUserID } = useParams();
    const [userData, setUserData] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const loggedUserID = sessionStorage.getItem("userID");

    const fetchUserData = async () => {
        if (!searchedUserID) return;

        const userDocRef = doc(db, "users", searchedUserID);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);

            setFollowersCount(data.followers?.length || 0);
            setFollowingCount(data.followings?.length || 0);
        }
    };

    const updateFollowStatus = async () => {
        if (loggedUserID && searchedUserID && loggedUserID !== searchedUserID) {
            const result = await checkIfFollowing(loggedUserID, searchedUserID);
            setIsFollowing(result);
        }
    };

    useEffect(() => {
        fetchUserData();
        updateFollowStatus();
    }, [searchedUserID]);

    const handleFollow = async () => {
        const success = await followUser(loggedUserID, searchedUserID);
        if (success) {
            setIsFollowing(true);
            setFollowersCount((prev) => prev + 1);
        }
    };

    const handleUnfollow = async () => {
        const success = await unfollowUser(loggedUserID, searchedUserID);
        if (success) {
            setIsFollowing(false);
            setFollowersCount((prev) => prev - 1);
        }
    };

    if (!userData) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark">
            <div className="max-w-6xl mx-auto pt-24 pb-12">
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center justify-center w-full md:w-1/3 space-y-6">
                        <div className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-brand-orange shadow-lg group-hover:scale-105 transition-all duration-300">
                            <img
                                src={userData.dp || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-300 font-medium">
                            <div className="text-center">
                                <span className="block text-lg font-bold">{followersCount}</span>
                                Followers
                            </div>
                            <div className="text-center">
                                <span className="block text-lg font-bold">{followingCount}</span>
                                Following
                            </div>
                        </div>

                        {loggedUserID !== searchedUserID && (
                            <div className="w-full flex justify-center gap-4 mt-4">
                                {isFollowing ? (
                                    <button
                                        onClick={handleUnfollow}
                                        className="w-28 bg-red-500 text-white py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Unfollow
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleFollow}
                                        className="w-28 bg-blue-500 text-white py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Follow
                                    </button>
                                )}

                                <button
                                    onClick={() => console.log("Message Clicked")}
                                    className="bg-blue-500 dark:bg-blue-500 text-white dark:text-white rounded-lg p-2 hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                                >
                                    <FaComment className="text-xl" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-semibold text-black dark:text-white">
                            {userData.fullName} <span className="text-sm text-gray-500">[{userData.username}]</span>
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{userData.bio}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Location: </strong>{userData.location}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Website: </strong>
                            <a href={userData.website} className="text-blue-500 hover:underline">{userData.website}</a>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Interests: </strong>{userData.interests}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
