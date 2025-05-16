import React from "react";
import {
    FaHome,
    FaHashtag,
    FaBell,
    FaEnvelope,
    FaBookmark,
    FaUser,
    FaEllipsisH,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { SidebarItem } from "./ImportantComponents";
import { useGuestTimer } from "../../context/GuestTimerContext";
import UploadDummyPosts from "../UploadDummyPosts";


const LeftSidebar = ({ onPostClick }) => {
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
        <aside className="hidden md:flex flex-col w-1/5 space-y-6 pr-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 pt-12">
            {/* Sidebar Nav Links */}
            <Link to="/home">
                <SidebarItem icon={<FaHome />} label="Home" />
            </Link>
            <Link to="/explore">
                <SidebarItem icon={<FaHashtag />} label="Explore" />
            </Link>
            <Link to="/notifications">
                <SidebarItem icon={<FaBell />} label="Notifications" />
            </Link>
            <Link to="/chats">
                <SidebarItem icon={<FaEnvelope />} label="Messages" />
            </Link>
            <Link to="/bookmarks">
                <SidebarItem icon={<FaBookmark />} label="bookmarks" />
            </Link>
            <Link to="/profile">
                <SidebarItem icon={<FaUser />} label="Profile" />
            </Link>
            {/* 
            <Link to="/more">
                <SidebarItem icon={<FaEllipsisH />} label="More" />
            </Link>
            */}
            {/* POST BUTTON - triggers modal instead of page change */}
            <button
                onClick={handlePostClick}
                className="mt-4 bg-brand-orange text-white px-10 py-2 w-max rounded-full font-medium hover:bg-brand-orange-hover transition"
            >
                Post
            </button>

            {/* 🔧 Dummy Post Upload Button */}
            {/*<UploadDummyPosts />*/}


        </aside>
    );
};

export default LeftSidebar;
