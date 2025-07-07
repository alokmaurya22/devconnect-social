import React, { useEffect, useState } from "react";
import { addComment, fetchComments } from "../utils/postActions";

const Comments = ({ postId, showInput }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const userId = sessionStorage.getItem("userID");
    const username = sessionStorage.getItem("username") || "Guest";

    useEffect(() => {
        setComments([]);
        setLastVisible(null);
        setHasMore(true);
        loadComments(true);
        // eslint-disable-next-line
    }, [postId]);

    const loadComments = async (reset = false) => {
        if (loading || (!reset && !hasMore)) return;
        setLoading(true);
        const res = await fetchComments(postId, reset ? null : lastVisible);
        setComments((prev) => reset ? res.comments : [...prev, ...res.comments]);
        setLastVisible(res.lastVisible || null);
        setHasMore(!!res.lastVisible);
        setLoading(false);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !userId) return;
        setAdding(true);
        await addComment(postId, userId, newComment.trim(), username);
        setNewComment("");
        // Reload comments (or prepend new one for better UX)
        loadComments(true);
        setAdding(false);
    };

    return (
        <div className="mt-4 border-t pt-3">
            {showInput && (
                <form onSubmit={handleAddComment} className="flex gap-2 mb-3">
                    <input
                        type="text"
                        className="flex-1 border rounded px-3 py-1 text-sm dark:bg-dark-bg dark:text-white"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={adding}
                    />
                    <button
                        type="submit"
                        className="bg-brand-orange text-white px-3 py-1 rounded disabled:opacity-50"
                        disabled={adding || !newComment.trim() || !userId}
                    >
                        {adding ? "Posting..." : "Post"}
                    </button>
                </form>
            )}
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {comments.length === 0 && !loading && (
                    <div className="text-gray-400 text-sm">No comments yet.</div>
                )}
                {comments.map((c) => (
                    <div key={c.id} className="bg-gray-100 dark:bg-dark-card rounded px-3 py-2">
                        <span className="font-semibold text-brand-orange mr-2">@{c.username}</span>
                        <span className="text-gray-700 dark:text-gray-200 text-sm">{c.text}</span>
                        <span className="block text-xs text-gray-400 mt-1">{c.timestamp && new Date(c.timestamp.seconds ? c.timestamp.seconds * 1000 : c.timestamp).toLocaleString()}</span>
                    </div>
                ))}
                {loading && <div className="text-gray-400 text-sm">Loading...</div>}
            </div>
            {hasMore && !loading && (
                <button
                    className="mt-2 text-blue-600 dark:text-blue-400 text-xs underline"
                    onClick={() => loadComments(false)}
                >
                    Load more
                </button>
            )}
        </div>
    );
};

export default Comments; 