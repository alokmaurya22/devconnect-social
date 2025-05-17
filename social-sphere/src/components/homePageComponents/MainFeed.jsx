import React, { useState } from "react";
import Feed from "../Feed";
import { TabButton } from "./ImportantComponents";
import { useGuestTimer } from "../../context/GuestTimerContext";

const MainFeed = ({ onPostClick }) => {
    const [activeTab, setActiveTab] = useState("foryou");
    const { isAuthenticated, openLoginModal, setShowTimer } = useGuestTimer();

    const handleTabChange = (value) => {
        if (value === "following" && !isAuthenticated) {
            openLoginModal();
            setShowTimer(false);
            return;
        }
        setActiveTab(value);
    };

    return (
        <main className="w-full md:w-3/5 border-x border-gray-300 dark:border-gray-700 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 py-6 px-2 relative">

            {/* Tabs */}
            <div className="sticky top-0 z-10 bg-light-bg dark:bg-dark-bg py-1">
                <div className="flex justify-between">
                    <TabButton label="For You" value="foryou" activeTab={activeTab} setActiveTab={handleTabChange} />
                    <TabButton label="Following" value="following" activeTab={activeTab} setActiveTab={handleTabChange} />
                </div>
            </div>

            {/* Feed */}
            <Feed activeTab={activeTab} />

            {/* Spacer */}
            <div className="h-20"></div>
            {/* Create Post Button (Mobile View) */}
            <div className="fixed bottom-14 right-4 md:hidden z-50 group">
                <button
                    onClick={onPostClick}
                    className="bg-brand-orange text-white w-11 h-11 rounded-full shadow-lg hover:bg-orange-600 transition-colors text-2xl relative"
                    aria-label="Create Post"
                >
                    +
                </button>
            </div>


        </main>
    );
};

export default MainFeed;
