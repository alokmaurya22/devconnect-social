import React, { useState } from "react";
import Feed from "../Feed";
import { TabButton } from "./ImportantComponents";
import GuestTimerDisplay from "../../context/GuestTimerDisplay";
import { useGuestTimer } from "../../context/GuestTimerContext";

const MainFeed = ({ onPostClick }) => {
    const { isAuthenticated, openLoginModal, setShowTimer } = useGuestTimer();
    const [activeTab, setActiveTab] = useState("foryou");
    const { formattedTime, showTimer } = useGuestTimer();

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
            {isAuthenticated ? (
                <div className="fixed bottom-14 right-4 md:hidden z-50 group">
                    <button
                        onClick={onPostClick}
                        className="bg-brand-orange text-white w-11 h-11 rounded-full shadow-lg hover:bg-orange-600 transition-colors text-2xl relative"
                        aria-label="Create Post"
                    >
                        +
                    </button>
                </div>
            ) : (
                <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 z-50 w-full flex justify-center px-4 md:hidden">
                    <div className="flex items-center bg-orange-100 dark:bg-black text-orange-600 dark:text-orange-400 rounded-full px-4 py-2 shadow-md border border-orange-500 text-sm font-semibold gap-2 max-w-full whitespace-nowrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                        <span className="text-black dark:text-white">
                            Guest access ends in <span className="text-red-600 dark:text-white">🕒 {formattedTime.minutes}:{formattedTime.seconds.toString().padStart(2, "0")}</span>
                        </span>
                    </div>
                </div>
            )}

        </main >
    );
};

export default MainFeed;
