import React, { useState, useRef } from "react";
import { uploadPost } from "../utils/uploadPost";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tag, setTag] = useState("");
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const postId = await uploadPost({ title, content, tag, file });
            console.log("Post uploaded with ID:", postId);
            alert("Post created successfully!");
            // Reset form
            setTitle("");
            setContent("");
            setTag("");
            setFile(null);
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4 py-10 text-text-light dark:text-text-dark transition-colors duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 sm:p-10">
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

                    {/* Tag someone */}
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

                    {/* File Upload with Drag & Drop */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Upload Image or Video</label>
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDragLeave}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className={`relative w-full border-2 ${dragActive ? "border-dashed border-brand-orange" : "border-gray-300 dark:border-gray-700"
                                } rounded-lg bg-light-card dark:bg-[#0c0c0c] px-4 py-6 text-center cursor-pointer hover:border-brand-orange transition`}
                            onClick={() => inputRef.current.click()}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {file ? `Selected: ${file.name}` : "Click or Drag & Drop to upload file"}
                            </p>
                        </div>
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

export default CreatePost;
