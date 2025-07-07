import React, { useEffect, useState } from "react";
import { TrendingItem, FollowSuggestion } from "./ImportantComponents";
import { db } from "../../configuration/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import PostModal from "../modal/PostModal";

const RightSidebar = () => {
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    useEffect(() => {
        // Fetch top 3 trending posts by likes
        const fetchTrendingPosts = async () => {
            const postsSnapshot = await getDocs(collection(db, "posts"));
            const posts = await Promise.all(
                postsSnapshot.docs.map(async (docSnap) => {
                    const data = docSnap.data();
                    // Count likes
                    const likesSnapshot = await getDocs(collection(db, "posts", docSnap.id, "likes"));
                    return {
                        id: docSnap.id,
                        title: data.title || "(No Title)",
                        likeCount: likesSnapshot.size,
                    };
                })
            );
            // Sort by likeCount desc, take top 3
            const topTrending = posts.sort((a, b) => b.likeCount - a.likeCount).slice(0, 3);
            setTrendingPosts(topTrending);
        };

        // Fetch top 3 users by followers
        const fetchTopUsers = async () => {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const users = await Promise.all(
                usersSnapshot.docs.map(async (docSnap) => {
                    const data = docSnap.data();
                    // Count followers
                    const followersSnapshot = await getDocs(collection(db, "users", docSnap.id, "followers"));
                    return {
                        id: docSnap.id,
                        name: data.fullName || data.username || "Unknown",
                        followerCount: followersSnapshot.size,
                    };
                })
            );
            // Sort by followerCount desc, take top 3
            const top = users.sort((a, b) => b.followerCount - a.followerCount).slice(0, 3);
            setTopUsers(top);
        };

        fetchTrendingPosts();
        fetchTopUsers();
    }, []);

    const handleViewPost = (postId) => {
        setSelectedPostId(postId);
        setShowPostModal(true);
    };

    const handleClosePostModal = () => {
        setShowPostModal(false);
        setSelectedPostId(null);
    };

    return (
        <>
            {/* Desktop View */}
            <aside className="w-full md:flex flex-col md:w-[25%] lg:w-[22%]  h-[calc(100vh-6.1rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 mt-12 px-0 relative">
                <div className="block sm:hidden text-center">
                    <h1 className="text-2xl font-bold text-brand-orange mb-2">Trending Now</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Catch the latest topics making waves on Social Sphere
                    </p>
                </div>
                <input
                    type="text"
                    placeholder="Search Trending"
                    className="w-5/6 md:w-auto px-3 sm:px-4 py-2 sm:py-2 md:py-1 lg:py-1.5 rounded-full my-4 mx-auto sm:mx-4 block  focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />

                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4 mt-4 mx-6">
                    <h3 className="font-bold text-lg mb-3">What's happening</h3>
                    {trendingPosts.length === 0 ? (
                        <p className="text-sm text-gray-400">No trending posts.</p>
                    ) : (
                        trendingPosts.map((post) => (
                            <TrendingItem key={post.id} tag={post.title} postId={post.id} onView={handleViewPost} />
                        ))
                    )}
                </div>
                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4 mt-4 mx-6">
                    <h3 className="font-bold text-lg mb-3">Who to follow</h3>
                    {topUsers.length === 0 ? (
                        <p className="text-sm text-gray-400">No suggestions.</p>
                    ) : (
                        topUsers.map((user) => (
                            <FollowSuggestion key={user.id} name={user.name} userId={user.id} />
                        ))
                    )}
                </div>
            </aside>
            {showPostModal && (
                <PostModal postId={selectedPostId} onClose={handleClosePostModal} />
            )}
        </>
    );
};

export default RightSidebar;