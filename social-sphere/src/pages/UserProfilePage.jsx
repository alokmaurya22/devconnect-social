import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";
import { FaComment } from "react-icons/fa";
import { followUser, unfollowUser, checkIfFollowing, getFollowCounts, checkIfUserIsFollower } from "../utils/followUtils";
import PostCard from "../components/PostCard";

const UserProfilePage = () => {
    const { userId: searchedUserID } = useParams();
    const [userData, setUserData] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [isFollower, setIsFollower] = useState(false);
    const loggedUserID = sessionStorage.getItem("userID");
    const [visibleCount, setVisibleCount] = useState(10);

    const navigate = useNavigate();
    const location = useLocation();

    const handleConnectionsClick = (type) => {
        if (searchedUserID) {
            const basePath = location.pathname;
            const query = `?showModal=true&type=${type}&userId=${searchedUserID}`;
            navigate(`${basePath}${query}`);
        } else {
            console.warn("User ID not found in session storage");
        }
    };
    const fetchUserData = async () => {
        if (!searchedUserID) return;

        const userDocRef = doc(db, "users", searchedUserID);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);
        }
    };

    const fetchFollowCounts = async () => {
        if (!searchedUserID) return;

        const { followerCount, followingCount } = await getFollowCounts(searchedUserID);
        setFollowersCount(followerCount);
        setFollowingCount(followingCount);
    };

    const updateFollowStatus = async () => {
        if (loggedUserID && searchedUserID && loggedUserID !== searchedUserID) {
            const result = await checkIfFollowing(loggedUserID, searchedUserID);
            setIsFollowing(result);
        }
    };

    const checkFollowerStatus = async () => {
        if (!loggedUserID || !searchedUserID || loggedUserID === searchedUserID) {
            setIsFollower(false);
            return;
        }
        const follower = await checkIfUserIsFollower(searchedUserID, loggedUserID);
        setIsFollower(follower);
    };

    const fetchPosts = async () => {
        setPostsLoading(true);
        const q = query(collection(db, "posts"), where("userId", "==", searchedUserID));
        const querySnapshot = await getDocs(q);
        let postsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Filter posts by viewType
        postsArray = postsArray.filter(post => {
            if (post.viewType === "EveryOne") return true;
            if (post.viewType === "FriendsOnly") return isFollower;
            return false; // Hide Private or Draft
        });
        setPosts(postsArray);
        setPostsLoading(false);
    };

    useEffect(() => {
        fetchUserData();
        fetchFollowCounts();
        updateFollowStatus();
        fetchPosts();
        checkFollowerStatus();
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
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark px-4">
            <div className="max-w-6xl mx-auto pt-24 pb-12">
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-6">

                    {/* Left Section - Profile Image and Follow Info */}
                    <div className="flex flex-col items-center justify-center w-full md:w-1/3 space-y-6">
                        <div className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-brand-orange shadow-lg group-hover:scale-105 transition-all duration-300">
                            <img
                                src={userData.dp || `https://api.dicebear.com/7.x/thumbs/svg?seed=${userData.uid}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-300 font-medium">
                            <div className="text-center cursor-pointer" onClick={() => handleConnectionsClick('followers')}>
                                <span className="block text-lg font-bold text-brand-orange">{followersCount}</span>
                                Followers
                            </div>
                            <div className="text-center cursor-pointer" onClick={() => handleConnectionsClick('followings')}>
                                <span className="block text-lg font-bold text-brand-orange">{followingCount}</span>
                                Followings
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
                                    onClick={() => navigate(`/chats/${searchedUserID}`)}
                                    className="bg-blue-500 dark:bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-700 transition-colors"
                                >
                                    <FaComment className="text-xl" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Section - Profile Info */}
                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-semibold text-black dark:text-white text-center md:text-left">
                            {userData.fullName}{" "}
                            <span className="text-sm text-gray-500">[{userData.username}]</span>
                        </h2>

                        <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{userData.bio}</p>

                        <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                            <strong>Location:</strong> {userData.location}
                        </p>

                        <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                            <strong>Website:</strong>{" "}
                            <a
                                href={userData.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                {userData.website}
                            </a>
                        </p>

                        <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                            <strong>Interests:</strong> {userData.interests}
                        </p>

                        {/* Go to Home Button */}
                        <div className="pt-4 flex justify-center md:justify-start">
                            <button
                                onClick={() => navigate("/home")}
                                className="bg-brand-orange text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-brand-orange-hover transition-all text-sm"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>

                {/* User's Posts Section */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-6 md:p-8 mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        {userData.fullName}'s Posts
                    </h2>
                    {postsLoading ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">Loading posts...</div>
                    ) : posts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2">
                                {posts.slice(0, visibleCount).map((post) => (
                                    <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-[#181818] p-2" key={post.id}>
                                        <PostCard post={post} />
                                    </div>
                                ))}
                            </div>
                            {visibleCount < posts.length && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        className="px-4 py-2 bg-brand-orange text-white rounded shadow hover:bg-brand-orange-hover transition"
                                        onClick={() => setVisibleCount(v => v + 10)}
                                    >
                                        Show more
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No posts to show.</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default UserProfilePage;