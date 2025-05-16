import React, { useState } from "react";
import Feed from "../Feed";
import { TabButton } from "./ImportantComponents";
import { useGuestTimer } from "../../context/GuestTimerContext";

const MainFeed = () => {
    const [activeTab, setActiveTab] = useState("foryou");

    const { isAuthenticated, openLoginModal, setShowTimer } = useGuestTimer();

    const handleTabChange = (value) => {
        if (value === "following" && !isAuthenticated) {
            openLoginModal();     // Show login modal
            setShowTimer(false);  // Pause timer
            return;
        }
        setActiveTab(value);
    };

    return (
        <main className="w-full md:w-3/5 border-x border-gray-300 dark:border-gray-700 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 py-6 px-2">
            {/* <main className="w-full md:w-3/5 border-x border-gray-300 dark:border-gray-700 px-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 py-8"> */}
            <div className="sticky top-0 z-10 bg-light-bg dark:bg-dark-bg py-1">
                <div className="flex justify-between">
                    <TabButton label="For You" value="foryou" activeTab={activeTab} setActiveTab={handleTabChange} />
                    <TabButton label="Following" value="following" activeTab={activeTab} setActiveTab={handleTabChange} />
                </div>
            </div>
            {/* Feed content */}
            <Feed activeTab={activeTab} />
            {/* Extra spacing so last post is not hidden behind the fixed footer */}
            <div className="h-20"></div>
        </main>
    );
};

export default MainFeed;
