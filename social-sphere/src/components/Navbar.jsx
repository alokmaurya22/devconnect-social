import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GuestTimerDisplay from "../context/GuestTimerDisplay";
import { useGuestTimer } from "../context/GuestTimerContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/logo_new.png";
import SidebarNavigation from "./homePageComponents/SidebarNavigation";
import SearchBar from "./SearchBar";
import { FaSignOutAlt, FaFire, FaUserPlus, FaUserLock, FaHome, FaMoon, FaSun, FaRobot } from "react-icons/fa";

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, setIsAuthenticated } = useGuestTimer();
    const location = useLocation();
    const navigate = useNavigate();
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const hamburgerRef = useRef(null);

    const isLogin = location.pathname === "/login";
    const isSignup = location.pathname === "/signup";

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target) &&
                hamburgerRef.current &&
                !hamburgerRef.current.contains(e.target)
            ) {
                setIsSidebarOpen(false);
            }
        };
        if (isSidebarOpen) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isSidebarOpen]);

    useEffect(() => {
        const uid = sessionStorage.getItem("userID");
        const fetchProfileImage = async () => {
            if (uid) {
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProfileImageUrl(userData.dp || null);
                }
            }
        };
        if (isAuthenticated) fetchProfileImage();
    }, [isAuthenticated]);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate("/");
    };

    const Tooltip = ({ label }) => (
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white dark:bg-white dark:text-black rounded opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
            {label}
        </span>
    );
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-light-bg dark:bg-dark-bg px-4 md:px-8 lg:px-12 py-1.5">
            <div className="flex items-center justify-between gap-2 md:gap-6">
                {/* Left Section: Logo */}
                <Link to="./" className="flex-shrink-0 group  xs:flex sm:block">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-7 h-7 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                </Link>

                {/* Center Section: Title or Search/Timer */}
                <div className="flex-1 flex items-center justify-center gap-4 md:gap-8">
                    {/* Title on md+ screens */}
                    <Link
                        to="/"
                        className="hidden md:inline-block text-xl sm:text-2xl font-bold text-brand-orange whitespace-nowrap"
                    >
                        Social Sphere
                    </Link>

                    {/* Title on mobile when not authenticated */}
                    {!isAuthenticated && (
                        <Link
                            to="/"
                            className="md:hidden text-xl sm:text-2xl font-bold text-brand-orange whitespace-nowrap"
                        >
                            Social Sphere
                        </Link>
                    )}

                    {/* Mobile search bar when authenticated */}
                    {isAuthenticated && (
                        <div className="flex md:hidden flex-1 max-w-md mx-2">
                            <SearchBar />
                        </div>
                    )}

                    {/* Desktop SearchBar or GuestTimerDisplay */}
                    <div className="hidden md:flex flex-1 justify-center">
                        {!isAuthenticated ? <GuestTimerDisplay /> : <SearchBar />}
                    </div>
                </div>

                {/* Right Section: Buttons */}
                <div className="flex items-center gap-5 md:gap-8">
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className={`md:inline-block px-3 py-1 text-base rounded font-semibold transition whitespace-nowrap ${isLogin
                                    ? "bg-brand-orange text-white"
                                    : "bg-white text-brand-orange border border-brand-orange hover:bg-brand-orange hover:text-white dark:bg-black dark:text-white dark:hover:bg-brand-orange"
                                    }`}
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className={`hidden md:inline-block px-3 py-1 text-base rounded font-semibold transition whitespace-nowrap ${isSignup
                                    ? "bg-brand-orange text-white"
                                    : "bg-white text-brand-orange border border-brand-orange hover:bg-brand-orange hover:text-white dark:bg-black dark:text-white dark:hover:bg-brand-orange"
                                    }`}
                            >
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="relative group hidden md:block">
                                <Link to="/profile">
                                    {profileImageUrl ? (
                                        <img
                                            src={profileImageUrl}
                                            alt="Profile"
                                            className="w-9 h-9 rounded-full object-cover border-2 border-brand-orange hover:scale-110 transition"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-gray-300 animate-pulse" />
                                    )}
                                </Link>
                                <Tooltip label="Profile" />
                            </div>
                            <div className="relative group hidden sm:block">
                                <button onClick={handleLogout} aria-label="Logout">
                                    <FaSignOutAlt className="text-2xl text-brand-orange hover:scale-110 transition mt-1.5" />
                                </button>
                                <Tooltip label="Logout" />
                            </div>
                        </>
                    )}
                    <div className="relative group">
                        <button
                            onClick={toggleTheme}
                            className="text-brand-orange text-2xl hover:scale-110 transition mt-1.5 sm:mt-1"
                            aria-label={theme === "dark" ? "Light Mode" : "Dark Mode"}
                        >
                            {theme === "dark" ? <FaSun /> : <FaMoon />}
                        </button>
                        <Tooltip label={theme === "dark" ? "Light Mode" : "Dark Mode"} />
                    </div>

                    {/* Hamburger menu for mobile */}
                    <button
                        ref={hamburgerRef}
                        className="block md:hidden text-2xl text-brand-orange"
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                    >
                        <RxHamburgerMenu />
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {
                isSidebarOpen && (
                    <div
                        ref={sidebarRef}
                        className="absolute top-full left-0 w-full bg-white/90 dark:bg-dark-card/90 backdrop-blur-md flex flex-col items-start p-4 md:hidden z-40"
                    >
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="w-full py-2 px-4 text-brand-orange font-semibold flex items-center gap-2 whitespace-nowrap"
                                >
                                    <FaHome className="text-xl" /> Home
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="w-full py-2 px-4 text-brand-orange font-semibold flex items-center gap-2 whitespace-nowrap"
                                >
                                    <FaUserLock className="text-xl" /> Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="w-full py-2 px-4 text-brand-orange font-semibold flex items-center gap-2 whitespace-nowrap"
                                >
                                    <FaUserPlus className="text-xl" /> SignUp
                                </Link>
                                <Link
                                    to="/ai-chat"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="w-full py-2 px-4 text-brand-orange font-semibold flex items-center gap-2 whitespace-nowrap"
                                >
                                    <FaRobot className="text-xl" />Soli - AI
                                </Link>
                            </>
                        ) : (
                            <>
                                <SidebarNavigation
                                    onClick={() => setIsSidebarOpen(false)}
                                    setIsAuthenticated={setIsAuthenticated}
                                    itemClass="w-full py-2 px-4 text-left text-brand-orange font-semibold whitespace-nowrap"
                                    wrapperClass="flex flex-col items-start"
                                />
                                <Link
                                    to="/trending"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="w-full py-2 px-4 text-brand-orange flex items-center gap-2 whitespace-nowrap text-base sm:text-sm md:text-base font-semibold lg:text-lg"
                                >
                                    <FaFire className="text-base sm:text-sm md:text-base lg:text-lg" />
                                    &nbsp;&nbsp;Trending
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsSidebarOpen(false);
                                    }}
                                    className="w-full py-2 px-5 text-brand-orange flex items-center gap-2 whitespace-nowrap text-base sm:text-sm md:text-base font-semibold lg:text-lg"
                                >
                                    <FaSignOutAlt className="text-base sm:text-sm md:text-base lg:text-lg" /> &nbsp;&nbsp;Logout
                                </button>
                            </>
                        )}
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
