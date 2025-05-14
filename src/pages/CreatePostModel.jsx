import React, { useState } from "react";
import { uploadPost } from "../utils/uploadPost";
import compressImage from '../utils/imageCompressor';
const CreatePostModel = ({ onClose }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tag, setTag] = useState("");
    const [file, setFile] = useState(null);
    const [viewType, setViewType] = useState("EveryOne"); // ✅ New field
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0];
        const maxFileSize = 0.28;
        if (selectedFile) {
            try {
                const compressedFile = await compressImage(selectedFile, maxFileSize);
                setFile(compressedFile); // for upload
                console.log('Image compression successfull for post:');
            } catch (error) {
                console.error('Image compression error for post:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Loader start
        try {
            const postId = await uploadPost({ title, content, tag, file, viewtype: viewType });
            const userId = sessionStorage.getItem("userID");

            console.log("✅ Post Uploaded!");
            console.log("Post ID:", postId);
            console.log("User ID:", userId);
            console.log("Post Data:", {
                title,
                content,
                tag,
                viewType,
                mediaFile: file?.name || "None",
            });

            alert("Post created successfully!");
            // Reset form
            setTitle("");
            setContent("");
            setTag("");
            setFile(null);
            setViewType("EveryOne");
            onClose(); // close modal after submit
        } catch (error) {
            console.error("❌ Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsLoading(false); // Loader end
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            {/* 🔁 Loader pehle hi return me conditionally dikhate hain */}
            {isLoading && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                    {/* 🔄 Outer Spinner */}
                    <div className="relative w-10 h-10">
                        <div className="absolute inset-0 border-[4px] border-orange-500 border-t-transparent rounded-full animate-spin" />
                        {/* 🔁 Inner Spinner (Reverse spin) */}
                        <div className="absolute inset-2 border-[3px] border-blue-500 border-t-transparent rounded-full animate-[spin_1s_linear_reverse_infinite]" />
                    </div>
                    <p className="mt-4 text-white text-lg font-semibold animate-pulse tracking-wide">Loading...</p>
                </div>
            )}
            <div className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 sm:p-10 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-red-500"
                >
                    ×
                </button>

                <h2 className="text-3xl font-bold text-brand-orange mb-6 text-center">
                    Create a New Post
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

                    {/* View Type */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Who can view this post?</label>
                        <select
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition text-sm"
                        >
                            <option value="EveryOne">Everyone</option>
                            <option value="FriendsOnly">Friends Only</option>
                            <option value="Private">Only Me</option>
                            <option value="Draft">Save in Draft</option>
                        </select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Upload Image or Video</label>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-brand-orange-hover transition"
                        />
                        {file && <p className="mt-1 text-xs text-gray-600">Selected: {file.name}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-brand-orange text-white font-semibold py-2.5 rounded-lg hover:bg-brand-orange-hover transition text-sm"
                    >
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModel;
