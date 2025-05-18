import React from "react";
import { useGuestTimer } from "../../context/GuestTimerContext";
import SidebarNavigation from "./SidebarNavigation";
import UploadDummyPosts from "../UploadDummyPosts";

const LeftSidebarDesign = ({ onPostClick }) => {
    const { isAuthenticated, openLoginModal, setShowTimer } = useGuestTimer();

    const handlePostClick = () => {
        if (!isAuthenticated) {
            setShowTimer(false);
            openLoginModal();
        } else {
            onPostClick();
        }
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-full md:flex flex-col md:w-[20%] lg:w-[15%]  h-[calc(100vh-6.1rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 mt-12">
                <SidebarNavigation
                    itemClass="w-full my-2"
                    wrapperClass="flex flex-col items-start py-2 px-auto mx-auto"
                />

                <button
                    onClick={handlePostClick}
                    className="mt-2 sm:mx-auto lg:mx-4 bg-brand-orange text-white px-3 py-2 w-max rounded-full font-medium hover:bg-brand-orange-hover transition"
                >

                    Create Post
                </button>
                {/* <UploadDummyPosts /> */}
            </aside>

            {/* Mobile Sidebar Drawer */}
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
                <aside
                    className="absolute top-0 left-0 w-3/4 max-w-xs bg-white dark:bg-gray-900 h-full py-6 space-y-6 overflow-y-auto"
                >
                    <button
                        onClick={handlePostClick}
                        className="mt-4 bg-brand-orange text-white px-10 py-2 w-max rounded-full font-medium hover:bg-brand-orange-hover transition"
                    >
                        Post
                    </button>
                    {/* <UploadDummyPosts /> */}
                </aside>
            </div>
        </>
    );
};
export default LeftSidebarDesign;