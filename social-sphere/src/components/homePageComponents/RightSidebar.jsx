import React from "react";
import { TrendingItem, FollowSuggestion } from "./ImportantComponents";

const RightSidebar = () => {
    return (
        <>
            {/* Desktop View */}
            <aside className="hidden lg:block w-1/5 pl-4 space-y-6 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 py-12 md:px-8">
                <input
                    type="text"
                    placeholder="Search Trending"
                    className="w-full px-4 py-2 rounded-full bg-light-card dark:bg-dark-card border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />

                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4">
                    <h3 className="font-bold text-lg mb-3">What’s happening</h3>
                    <TrendingItem tag="#100DaysOfCode" />
                    <TrendingItem tag="#ReactJS" />
                    <TrendingItem tag="#OpenSource" />
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4">
                    <h3 className="font-bold text-lg mb-3">Who to follow</h3>
                    <FollowSuggestion name="Ananya Sharma" />
                    <FollowSuggestion name="Rohan Codes" />
                    <FollowSuggestion name="Priya Dev" />
                </div>
            </aside>

            {/* Mobile View */}
            <section className="block lg:hidden px-4 pb-10 space-y-6 py-24">
                <input
                    type="text"
                    placeholder="Search Trending"
                    className="w-full px-4 py-2 rounded-full bg-light-card dark:bg-dark-card border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />

                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4">
                    <h3 className="font-bold text-lg mb-3">What’s happening</h3>
                    <TrendingItem tag="#100DaysChallenge" />
                    <TrendingItem tag="#ReactJS" />
                    <TrendingItem tag="#India" />
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4 mb-6">
                    <h3 className="font-bold text-lg mb-3">Who to follow</h3>
                    <FollowSuggestion name="Alok Maurya" />
                    <FollowSuggestion name="Anuj Gupta" />
                    <FollowSuggestion name="Naveen Tiwari" />
                </div>
            </section>
        </>
    );
};

export default RightSidebar;
