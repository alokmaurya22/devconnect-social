import React, { useEffect, useState } from "react";
import RightSidebar from "../components/homePageComponents/RightSidebar";
import LeftSidebarDesign from "../components/homePageComponents/LeftSidebarDesign";
import MainFeed from "../components/homePageComponents/MainFeed";
import CreatePostModel from "./CreatePostModel";
import { useGuestTimer } from "../context/GuestTimerContext";
import { useLocation, useNavigate } from "react-router-dom";
import AIChatModal from "./AI_chat";

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [showNotice, setShowNotice] = useState(true);
    const { setShowTimer, isAuthenticated } = useGuestTimer();
    const location = useLocation();
    const navigate = useNavigate();
    const isAIChatOpen = location.pathname === "/ai-chat";
    const handleCloseAIChat = () => navigate(-1);

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
                <div>
                    {/* Shown on small screens only */}
                    <div className="fixed top-[52px] left-0 w-full z-40 bg-white text-black dark:bg-black dark:text-white text-center py-1.5 text-sm font-semibold block md:hidden">
                        <span className="font-semibold text-xs sm:text-base">
                            Social-Sphere is in active development. Some features may be unstable.
                            <a href="https://forms.gle/pmYdvckr1QGJYGMo9" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer text-blue-600 dark:text-blue-400"> We’d love your feedback!</a>
                        </span>
                    </div>

                    {/* Shown on medium and larger screens only */}
                    <div className="fixed top-[52px] left-0 w-full z-40 bg-white text-black dark:bg-black dark:text-white text-center py-1.5 text-xs font-medium hidden md:block">
                        <span className="font-semibold text-xs">
                            Social-Sphere is currently under active development. Some features may not work as expected or may feel buggy. We appreciate your patience and
                            <a href="https://forms.gle/pmYdvckr1QGJYGMo9" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer text-blue-600 dark:text-blue-400"> would love to hear your feedback!</a>
                        </span>
                    </div>

                </div>
            )}

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300"></div>
            )}

            {/* ====================== MOBILE VIEW ====================== */}
            <div className={`block md:hidden ${showNotice ? "mt-[85px]" : ""}`}>
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
            {isAIChatOpen && (
                <AIChatModal open={true} onClose={handleCloseAIChat} />
            )}
        </>
    );
};

export default Home;
