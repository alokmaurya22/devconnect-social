import React, { useEffect, useState } from "react";
import { FaHeart, FaRegComment, FaShare, FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logShare, savePostForUser, unsavePostForUser } from "../utils/postActions";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";

const PostActions = ({ post, onCommentClick }) => {
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

    return (
        <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-300 px-2">
            <div className="flex items-center gap-4">
                <button
                    className={`flex items-center gap-1 transition duration-200 ${liked ? "text-red-500" : "hover:text-red-500"}`}
                    onClick={handleLikeClick}
                >
                    <FaHeart className="text-base" />
                    <span>Like</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500 transition" onClick={onCommentClick}>
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
    );
};

export default PostActions; 