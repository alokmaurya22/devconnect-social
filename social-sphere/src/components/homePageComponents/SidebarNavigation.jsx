import React from "react";
import {
    FaHome,
    FaHashtag,
    FaBell,
    FaEnvelope,
    FaBookmark,
    FaUser,
    FaSignOutAlt,
    FaRobot
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { SidebarItem } from "./ImportantComponents";

const navItems = [
    { path: "/home", label: "Home", icon: <FaHome /> },
    { path: "/explore", label: "Explore", icon: <FaHashtag /> },
    { path: "/notifications", label: "Notifications", icon: <FaBell /> },
    { path: "/chats", label: "Messages", icon: <FaEnvelope /> },
    { path: "/bookmarks", label: "Bookmarks", icon: <FaBookmark /> },
    { path: "/profile", label: "Profile", icon: <FaUser /> },
    { path: "/ai-chat", label: "Soli - AI", icon: <FaRobot /> },
];
const SidebarNavigation = ({ onClick, itemClass = "", wrapperClass = "" }) => {
    return (
        <div className={wrapperClass}>
            {navItems.map(({ path, label, icon }) => (
                <Link to={path} key={path} onClick={onClick} className={itemClass}>
                    <SidebarItem icon={icon} label={label} />
                </Link>
            ))}
        </div>
    );
};

export default SidebarNavigation;
