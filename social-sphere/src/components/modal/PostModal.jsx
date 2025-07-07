import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configuration/firebaseConfig";
import PostCard from "../PostCard";

const PostModal = ({ postId, onClose }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            const postRef = doc(db, "posts", postId);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
                setPost({ id: postSnap.id, ...postSnap.data() });
            }
            setLoading(false);
        };
        if (postId) fetchPost();
    }, [postId]);

    if (!postId) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 w-full max-w-lg relative">
                <button
                    className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-brand-orange"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : post ? (
                    <PostCard post={post} />
                ) : (
                    <div className="text-center py-10 text-gray-500">Post not found.</div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default PostModal; 