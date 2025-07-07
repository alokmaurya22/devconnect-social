import React from "react";
import { useNavigate } from "react-router-dom";

// Tab Button
export const TabButton = ({ label, value, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(value)}
        className={`w-1/2 py-2 font-semibold text-center border-b-2 transition 
        ${activeTab === value
                ? "border-brand-orange text-brand-orange"
                : "border-transparent text-gray-500 dark:text-gray-400"
            }`}
    >
        {label}
    </button>
);
// Sidebar Item
export const SidebarItem = ({ icon, label }) => (
    <button className="flex items-center space-x-4 text-lg hover:text-brand-orange transition">
        <span className="text-base sm:text-sm md:text-base lg:text-lg "
        >{icon}</span>
        <span className="text-base sm:text-sm md:text-base lg:text-lg">{label}</span>
    </button>
);

// Trending Tag
export const TrendingItem = ({ tag, postId, onView }) => (
    <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
        <button
            className="bg-brand-orange text-white text-xs px-2 py-1 rounded-full hover:bg-brand-orange-hover transition ml-2"
            onClick={() => onView(postId)}
        >
            View
        </button>
    </div>
);

// Follow Suggestion
export const FollowSuggestion = ({ name, userId }) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{name}</span>
            <button
                className="bg-brand-orange text-white text-sm px-2 py-1 rounded-full hover:bg-brand-orange-hover transition"
                onClick={() => navigate(`/user/${userId}`)}
            >
                View
            </button>
        </div>
    );
};
