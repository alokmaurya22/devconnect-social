import React, { useEffect, useState } from "react";
import RightSidebar from "../components/homePageComponents/RightSidebar";
import LeftSidebarDesign from "../components/homePageComponents/LeftSidebarDesign";
import MainFeed from "../components/homePageComponents/MainFeed";
import CreatePostModel from "./CreatePostModel";
import { useGuestTimer } from "../context/GuestTimerContext";

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [showNotice, setShowNotice] = useState(true);
    const { setShowTimer, isAuthenticated } = useGuestTimer();

    useEffect(() => {
        setShowTimer(!isAuthenticated);
    }, [isAuthenticated]);

    // notice timer
    const noticeTimer = 20000;
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotice(false);
        }, noticeTimer);

        // Prevent unwanted scrollbar
        document.body.style.overflowY = "hidden";

        return () => {
            clearTimeout(timer);
            document.body.style.overflowY = "auto"; // restore
        };
    }, []);

    // Restore scroll after notice hides
    useEffect(() => {
        if (!showNotice) {
            document.body.style.overflowY = "auto";
        }
    }, [showNotice]);

    const handlePostClick = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            {/* ======= NOTICE BAR ======= */}
            {showNotice && (
                <div className="fixed top-[52px] left-0 w-full z-40 bg-yellow-400 text-black text-center py-1.5 text-sm font-semibold shadow-md transition-opacity duration-300">
                    <span className="font-semibold text-xs sm:text-base">
                        Some features are under development. Stay tuned for updates!
                    </span>
                </div>
            )}

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300"></div>
            )}

            {/* ====================== MOBILE VIEW ====================== */}
            <div className={`block md:hidden ${showNotice ? "mt-[65px]" : ""}`}>
                <MainFeed onPostClick={handlePostClick} />
            </div>

            {/* ===================== DESKTOP VIEW ====================== */}
            <div className={`hidden md:flex w-full px-8 gap-8 ${showNotice ? "mt-[42px]" : ""}`}>
                {/* Left Sidebar */}
                <LeftSidebarDesign onPostClick={handlePostClick} />

                {/* Main Feed */}
                <MainFeed onPostClick={handlePostClick} />

                {/* Right Sidebar */}
                <RightSidebar onPostClick={handlePostClick} />
            </div>

            {/* ===================== CREATE POST MODAL ====================== */}
            {showModal && <CreatePostModel onClose={handleCloseModal} />}
        </>
    );
};

export default Home;
