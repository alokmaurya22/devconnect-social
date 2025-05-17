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
import { FaSignOutAlt, FaFire, FaUserPlus, FaUserLock, FaHome, FaMoon, FaSun } from "react-icons/fa";

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

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

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
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white dark:bg-white dark:text-black rounded opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow">
            {label}
        </span>
    );

    return (
        <nav className="w-full fixed top-0 left-0 z-50 px-6 md:px-12 py-2 flex justify-between items-center bg-transparent backdrop-blur-md">
            {/* Notice bar */}
            {!isSidebarOpen && (
                <div className="fixed top-[52px] left-0 w-full z-40 bg-yellow-400 text-black text-center py-1.5 text-sm font-semibold shadow-md">
                    <span className="font-semibold text-xs sm:text-base text-center">
                        Some features are under development. Stay tuned for updates!
                    </span>
                </div>
            )}

            <Link to="./" className="relative group mr-3 sm:mr-4">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-9 h-9 sm:w-9 sm:h-9 rounded-full object-cover mb-2 sm:mb-0"
                />
            </Link>

            {/* Mobile View: Show either Social Sphere or SearchBar based on authentication */}
            {/* Always visible on desktop */}
            <Link
                to="/"
                className="text-xl sm:text-2xl font-bold text-brand-orange hidden md:block"
            >
                Social Sphere
            </Link>

            {/* Only for mobile view (when NOT authenticated) */}
            {!isAuthenticated && (
                <Link
                    to="/"
                    className="text-xl sm:text-2xl font-bold text-brand-orange block md:hidden mb-2"
                >
                    Social Sphere
                </Link>
            )}

            {/* Mobile View: Search bar only when authenticated */}
            {isAuthenticated && (
                <div className="flex md:hidden flex-1 justify-center relative w-full max-w-md mb-2 py-0.75">
                    <SearchBar />
                </div>
            )}

            {/* Desktop View: SearchBar or GuestTimerDisplay */}
            <div className="hidden md:flex flex-1 mx-6 justify-center relative">
                {!isAuthenticated ? <GuestTimerDisplay /> : <SearchBar />}
            </div>


            {/* Right */}
            <div className="flex items-center space-x-4 mb-1 sm:mb-0">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className={`px-3 py-1 text-sm rounded font-semibold transition ${isLogin ? "bg-brand-orange text-white" : "bg-white text-brand-orange border border-brand-orange hover:bg-brand-orange  dark:bg-black dark:text-white hover:text-white dark:hover:bg-brand-orange"} `}>Login</Link>
                        <Link to="/signup" className={`hidden md:inline-block px-3 py-1 text-sm rounded font-semibold transition ${isSignup ? "bg-brand-orange text-white" : "bg-white text-brand-orange border border-brand-orange hover:bg-brand-orange hover:text-white dark:bg-black dark:text-white  dark:hover:bg-brand-orange"}`}>Sign Up</Link>
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
                            <button onClick={handleLogout}>
                                <FaSignOutAlt className="text-2xl text-brand-orange hover:scale-110 transition mt-1.5" />
                            </button>
                            <Tooltip label="Logout" />
                        </div>
                    </>
                )}
                <div className="relative group">
                    <button onClick={toggleTheme} className="text-brand-orange text-2xl hover:scale-110 transition mt-1.5 sm:mt-1">
                        {theme === "dark" ? <FaSun /> : <FaMoon />}
                    </button>
                    <Tooltip label={theme === "dark" ? "Light Mode" : "Dark Mode"} />
                </div>
                <button ref={hamburgerRef} className="block md:hidden text-2xl text-brand-orange mr-2 " onClick={toggleSidebar}>
                    <RxHamburgerMenu />
                </button>
            </div>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <div ref={sidebarRef} className="absolute top-full left-0 w-full bg-white/80 dark:bg-dark-card/80 backdrop-blur-md flex-col items-start p-4 md:hidden z-40">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/" className="w-full py-2 px-4 text-brand-orange font-semibold flex items-center gap-2">
                                <FaHome className="text-xl" /> Home
                            </Link>
                            <Link to="/login" className="w-full py-2 px-4 text-brand-orange font-semibold flex items-center gap-2">
                                <FaUserLock className="text-xl" /> Login
                            </Link>
                            <Link to="/signup" className="w-full py-2 px-4 text-brand-orange font-semibold flex items-center gap-2">
                                <FaUserPlus className="text-xl" /> SignUp
                            </Link>
                        </>
                    ) : (
                        <>
                            <SidebarNavigation
                                onClick={() => setIsSidebarOpen(false)}
                                setIsAuthenticated={setIsAuthenticated}
                                itemClass="w-full py-2 px-4 text-left text-brand-orange font-semibold"
                                wrapperClass="flex flex-col items-start"
                            />
                            <Link to="/trending" className="w-full py-2 px-4 text-brand-orange font-semibold flex items-center gap-2">
                                <FaFire className="text-xl" /> Trending
                            </Link>
                            <button onClick={() => { handleLogout(); setIsSidebarOpen(false); }} className="w-full py-2 px-5 text-brand-orange font-semibold flex items-center gap-2">
                                <FaSignOutAlt className="text-xl" /> Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
