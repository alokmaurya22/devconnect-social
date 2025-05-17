import React, { useState } from "react";
import { uploadPost } from "../utils/uploadPost";
import compressImage from '../utils/imageCompressor';

const CreatePostModel = ({ onClose }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tag, setTag] = useState("");
    const [file, setFile] = useState(null);
    const [viewType, setViewType] = useState("EveryOne");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0];
        const maxFileSize = 0.28;
        if (selectedFile) {
            try {
                const compressedFile = await compressImage(selectedFile, maxFileSize);
                setFile(compressedFile);
                console.log('Image compression successfull for post:');
            } catch (error) {
                console.error('Image compression error for post:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const postId = await uploadPost({ title, content, tag, file, viewtype: viewType });
            alert("Post created successfully!");
            setTitle("");
            setContent("");
            setTag("");
            setFile(null);
            setViewType("EveryOne");
            onClose();
        } catch (error) {
            console.error(" Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2 sm:px-0">
            {isLoading && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="relative w-10 h-10">
                        <div className="absolute inset-0 border-[4px] border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-2 border-[3px] border-blue-500 border-t-transparent rounded-full animate-[spin_1s_linear_reverse_infinite]" />
                    </div>
                    <p className="mt-4 text-white text-base sm:text-lg font-semibold animate-pulse tracking-wide">Loading...</p>
                </div>
            )}

            <div className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-xl p-5 sm:p-8 md:p-10 relative text-sm sm:text-base">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-xl sm:text-2xl font-bold text-gray-500 hover:text-red-500"
                >
                    ×
                </button>

                <h2 className="text-2xl sm:text-3xl font-bold text-brand-orange mb-4 sm:mb-6 text-center">
                    Create New Post
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block mb-1 text-xs sm:text-sm font-semibold">Title</label>
                        <input
                            type="text"
                            placeholder="Enter your title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-xs sm:text-sm font-semibold">Content</label>
                        <textarea
                            placeholder="What's on your mind?"
                            rows="4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg resize-none bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-xs sm:text-sm font-semibold">Tag Someone</label>
                        <input
                            type="text"
                            placeholder="@username"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition"
                        />
                    </div>

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

                    <div>
                        <label className="block mb-1 text-xs sm:text-sm font-semibold">Upload Image or Video</label>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="block w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-brand-orange-hover transition"
                        />
                        {file && <p className="mt-1 text-xs text-gray-600">Selected: {file.name}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-orange text-white font-semibold py-2 sm:py-2.5 rounded-lg hover:bg-brand-orange-hover transition"
                    >
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModel;