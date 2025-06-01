import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { editPost, fetchPostForEdit } from "../utils/uploadPost";


const EditPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tag, setTag] = useState("");
    const [mediaURL, setMediaURL] = useState("");
    const [viewType, setViewType] = useState("public");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    console.log("Post ID:", postId);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await fetchPostForEdit(postId);
                setTitle(postData.title || "");
                setContent(postData.content || "");
                setTag(postData.tag || "");
                setMediaURL(postData.mediaURL || "");
                setViewType(postData.viewType || "public");
            } catch (error) {
                console.error("Error fetching post:", error);
                alert("Failed to load post data.");
            } finally {
                setLoading(false);
            }
        };

        if (postId) loadPost();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await editPost(postId, { title, content, tag, viewType });
            alert("Post updated successfully!");
            navigate("/profile");
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
                <p className="text-lg text-gray-600 dark:text-gray-300">Loading post...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4 py-10 text-text-light dark:text-text-dark transition-colors duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 sm:p-10">
                <h2 className="text-3xl font-bold text-brand-orange mb-6 text-center">
                    Edit Post
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Title</label>
                        <input
                            type="text"
                            placeholder="Enter your title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition text-sm"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Content</label>
                        <textarea
                            placeholder="What's on your mind?"
                            rows="5"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg resize-none bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition text-sm"
                            required
                        />
                    </div>

                    {/* Tag */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Tag Someone</label>
                        <input
                            type="text"
                            placeholder="@username"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition text-sm"
                        />
                    </div>

                    {/* Media Info (non-editable) */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Uploaded Media</label>
                        {mediaURL ? (
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                <a
                                    href={mediaURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-blue-600 hover:text-blue-800"
                                >
                                    View Media
                                </a>{" "}
                                — <span className="text-red-500">Media cannot be edited</span>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                No media uploaded.
                            </div>
                        )}
                    </div>

                    {/* View Type */}
                    <div>
                        <label className="block mb-1 text-xs sm:text-sm font-semibold">Who can view this post?</label>
                        <select
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition"
                        >
                            <option value="EveryOne">Everyone</option>
                            <option value="FriendsOnly">Friends Only</option>
                            <option value="Private">Only Me</option>
                            <option value="Draft">Save in Draft</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-brand-orange text-white font-semibold py-2.5 rounded-lg hover:bg-brand-orange-hover transition text-sm disabled:opacity-60"
                    >
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPost;