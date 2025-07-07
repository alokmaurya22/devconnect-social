import React, { useState, useEffect } from "react";
import { FaHeart, FaRegComment, FaShare, FaBookmark, FaUserCircle } from "react-icons/fa";
import PostActions from "./PostActions";
import Comments from "./Comments";
import { followUser, checkIfFollowing } from "../utils/followUtils";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
    const [showComments, setShowComments] = useState(false);
    const [showFollow, setShowFollow] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const userId = sessionStorage.getItem("userID");
    const navigate = useNavigate();

    useEffect(() => {
        let ignore = false;
        const checkFollow = async () => {
            if (!userId || !post.userId || userId === post.userId) {
                setShowFollow(false);
                return;
            }
            const isFollowing = await checkIfFollowing(userId, post.userId);
            if (!ignore) setShowFollow(!isFollowing);
        };
        checkFollow();
        return () => { ignore = true; };
    }, [userId, post.userId]);

    const handleFollow = async () => {
        setFollowLoading(true);
        await followUser(userId, post.userId);
        setShowFollow(false);
        setFollowLoading(false);
    };

    const goToUserProfile = () => {
        if (post.userId) navigate(`/user/${post.userId}`);
    };

    const postTime = post.createdAt?.toDate
        ? timeAgo(post.createdAt.toDate())
        : "Just now";

    return (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4 mx-4">
            {/* Top: User Info */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {post.profileDP ? (
                        <img
                            src={post.profileDP}
                            alt="User DP"
                            className="w-8 h-8 rounded-full object-cover cursor-pointer"
                            onClick={goToUserProfile}
                        />
                    ) : (
                        <FaUserCircle className="text-2xl text-gray-500 dark:text-gray-300 cursor-pointer" onClick={goToUserProfile} />
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-brand-orange text-lg cursor-pointer" onClick={goToUserProfile}>{post.fullName}</span>
                            {showFollow && (
                                <button
                                    className="px-1 py-0 text-sm font-medium bg-green-500 hover:bg-green-600 text-black rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition disabled:opacity-60"
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                >
                                    {followLoading ? "Following..." : "Follow"}
                                </button>
                            )}
                        </div>
                        <span className="block text-blue-900 dark:text-blue-400 text-sm mt-0 cursor-pointer" onClick={goToUserProfile}>@{post.username}</span>
                    </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{postTime}</span>
            </div>

            {/* Title */}
            {post.title && (
                <h2 className="text-pretty font-semibold text-gray-900 dark:text-white inline-block relative mb-1 ml-2">
                    {post.title}
                    <span className="block h-[2px] w-full bg-brand-orange absolute bottom-0 left-0"></span>
                </h2>
            )}

            {/* Content */}
            <p className="text-sm sm:text-base mb-2 ml-2 text-gray-900 dark:text-white">{post.content}</p>

            {/* Media */}
            {post.mediaURL && (
                <div className="w-full aspect-video overflow-hidden rounded-lg mt-2">
                    <img
                        src={post.mediaURL}
                        alt="Post visual"
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Action Buttons */}
            <PostActions post={post} onCommentClick={() => setShowComments((v) => !v)} />
            {showComments && <Comments postId={post.id} showInput={true} />}
        </div>
    );
};

const timeAgo = (inputDate) => {
    const now = new Date();
    const date = new Date(inputDate);
    const diffMs = now - date;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (minutes < 2) {
        return "Just now";
    } else if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (days < 7) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (days < 30) {
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (days < 365) {
        return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
        return `${years} year${years > 1 ? "s" : ""} ago`;
    }
};

export default PostCard;
