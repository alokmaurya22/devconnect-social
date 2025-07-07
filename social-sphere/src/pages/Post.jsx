import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";
import PostCard from "../components/PostCard";

const Post = () => {
    const { postId } = useParams();
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

    if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;
    if (!post) return <div className="text-center py-10 text-gray-500">Post not found.</div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-light-bg dark:bg-dark-bg">
            <div className="w-full max-w-xl">
                <PostCard post={post} />
            </div>
        </div>
    );
};

export default Post; 