import React, { useEffect, useState } from "react";
import { FaHeart, FaRegComment, FaShare, FaBookmark, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logShare, savePostForUser, unsavePostForUser } from "../utils/postActions";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";

const PostCard = ({ post }) => {
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [liked, setLiked] = useState(false);
    const userId = sessionStorage.getItem("userID");

    useEffect(() => {
        const checkSaved = async () => {
            if (!userId) return;
            const savedRef = doc(db, "users", userId, "savedPosts", post.id);
            const snap = await getDoc(savedRef);
            setSaved(snap.exists());
        };
        checkSaved();
    }, [post.id, userId]);

    useEffect(() => {
        const checkLiked = async () => {
            if (!userId) return;
            const likeRef = doc(db, "posts", post.id, "likes", userId);
            const snap = await getDoc(likeRef);
            setLiked(snap.exists());
        };
        checkLiked();
    }, [post.id, userId]);

    const handleShare = async () => {
        const postUrl = `${window.location.origin}/post/${post.id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title || 'Social Sphere Post',
                    text: post.content || '',
                    url: postUrl,
                });
                await logShare(post.id, null);
            } catch {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(postUrl);
                alert('Post link copied to clipboard!');
                await logShare(post.id, null);
            } catch {
                alert('Failed to copy link.');
            }
        }
    };

    const handleShareToChat = () => {
        navigate(`/chats?sharePost=${post.id}`);
    };

    const handleSaveClick = async () => {
        if (!userId) return;
        if (saved) {
            setSaved(false);
            await unsavePostForUser(userId, post.id);
        } else {
            setSaved(true);
            await savePostForUser(userId, post.id, { title: post.title, content: post.content });
        }
    };

    const handleLikeClick = async () => {
        if (!userId) return;
        const likeRef = doc(db, "posts", post.id, "likes", userId);
        if (liked) {
            setLiked(false);
            await deleteDoc(likeRef);
        } else {
            setLiked(true);
            await setDoc(likeRef, { userId, likedAt: new Date() });
        }
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
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <FaUserCircle className="text-2xl text-gray-500 dark:text-gray-300" />
                    )}
                    <h3 className="font-semibold text-brand-orange cursor-pointer">
                        {post.fullName}
                        <span className="block text-blue-900 dark:text-blue-400 text-xs mt-0">
                            @{post.username}
                        </span>
                    </h3>
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
            <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-300 px-2">
                <div className="flex items-center gap-4">
                    <button
                        className={`flex items-center gap-1 transition duration-200 ${liked ? "text-red-500" : "hover:text-red-500"}`}
                        onClick={handleLikeClick}
                    >
                        <FaHeart className="text-base" />
                        <span>Like</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition">
                        <FaRegComment className="text-base" />
                        <span>Comment</span>
                    </button>
                    <div className="relative group">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1 hover:text-green-600 transition"
                        >
                            <FaShare className="text-base" />
                            <span>Share</span>
                        </button>
                        <div className="absolute left-0 mt-1 hidden group-hover:block bg-white dark:bg-dark-card border rounded shadow-lg z-10 min-w-[120px]">
                            <button
                                onClick={handleShareToChat}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Share to Chat
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    className={`flex items-center gap-1 transition ${saved ? "text-yellow-500" : "hover:text-blue-500 dark:hover:text-yellow-500"}`}
                    onClick={handleSaveClick}
                >
                    <FaBookmark className="text-base" />
                    <span>Save</span>
                </button>
            </div>
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
