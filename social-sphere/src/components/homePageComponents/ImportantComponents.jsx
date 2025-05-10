import React from "react";

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
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
    </button>
);

// Trending Tag
export const TrendingItem = ({ tag }) => (
    <p className="text-sm text-gray-700 dark:text-gray-300 hover:underline cursor-pointer mb-2">
        {tag}
    </p>
);

// Follow Suggestion
export const FollowSuggestion = ({ name }) => (
    <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{name}</span>
        <button className="bg-brand-orange text-white text-sm px-2 py-1 rounded-full hover:bg-brand-orange-hover transition">
            Follow
        </button>
    </div>
);
