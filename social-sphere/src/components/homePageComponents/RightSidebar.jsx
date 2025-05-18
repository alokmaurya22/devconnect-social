import React from "react";
import { TrendingItem, FollowSuggestion } from "./ImportantComponents";

const RightSidebar = () => {
    return (
        <>
            {/* Desktop View */}
            <aside className="w-full md:flex flex-col md:w-[25%] lg:w-[22%]  h-[calc(100vh-6.1rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 mt-12 px-0 relative">
                <div className="block sm:hidden text-center">
                    <h1 className="text-2xl font-bold text-brand-orange mb-2">Trending Now</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Catch the latest topics making waves on Social Sphere
                    </p>
                </div>
                <input
                    type="text"
                    placeholder="Search Trending"
                    className="w-5/6 md:w-auto px-3 sm:px-4 py-2 sm:py-2 md:py-1 lg:py-1.5 rounded-full my-4 mx-auto sm:mx-4 block  focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />

                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4 mt-4 mx-6">
                    <h3 className="font-bold text-lg mb-3">What’s happening</h3>
                    <TrendingItem tag="#100DaysChallenge" />
                    <TrendingItem tag="#ReactJS" />
                    <TrendingItem tag="#India" />
                </div>
                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4 mt-4 mx-6">
                    <h3 className="font-bold text-lg mb-3">Who to follow</h3>
                    <FollowSuggestion name="Anuj Gupta" />
                    <FollowSuggestion name="Alok Maurya" />
                    <FollowSuggestion name="Naveen Tiwari" />
                </div>
            </aside>
        </>
    );
};

export default RightSidebar;