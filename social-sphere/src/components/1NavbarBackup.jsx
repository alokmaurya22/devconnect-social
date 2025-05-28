import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun, FaSearch, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GuestTimerDisplay from "../context/GuestTimerDisplay";
import { useGuestTimer } from "../context/GuestTimerContext";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";
import { HiOutlineLogout } from "react-icons/hi";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/logo_new.png";
import SidebarNavigation from "./homePageComponents/SidebarNavigation";
import UploadDummyPosts from "./UploadDummyPosts";
import { FaSignOutAlt, FaFire, FaUserPlus, FaUserLock, FaHome } from "react-icons/fa";
const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, setIsAuthenticated } = useGuestTimer();
    const location = useLocation();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const searchRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sidebarRef = useRef(null);
    const hamburgerRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                hamburgerRef.current &&
                !hamburgerRef.current.contains(event.target)
            ) {
                setIsSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        // Clean up when unmounting
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isSidebarOpen]);

    // 🔐 Logout
    const handleLogout = () => {
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate("/");
    };

    const isLogin = location.pathname === "/login";
    const isSignup = location.pathname === "/signup";

    // 🔍 Search with debounce
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSuggestions([]);
            return;
        }

        const debounceTimer = setTimeout(async () => {
            const querySnapshot = await getDocs(collection(db, "users"));
            const filtered = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                if (
                    data.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    data.username.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                    filtered.push({ name: data.fullName, userid: data.uid });
                }
            });

            setSuggestions(filtered);
        }, 800);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    //  Fetch profile DP from Firestore using uid from session
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
    //console.log((sessionStorage.getItem("userID")), profileImageUrl);

    const Tooltip = ({ label }) => (
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white dark:bg-white dark:text-black rounded opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow">
            {label}
        </span>
    );

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleSearchSubmit = () => {
        if (searchTerm.trim() !== "") {
            //console.log("Search submitted:", searchTerm);
        }
        setSuggestions([]);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearchSubmit();
    };
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name);
        setSuggestions([]);
        //console.log("User selected:", suggestion.name, "| ID:", suggestion.userid);
        // Use navigate to redirect to the UserProfilePage with the user's ID
        navigate(`/user/${suggestion.userid}`);
    };
    const clearSearch = () => {
        setSearchTerm("");
        setSuggestions([]);
    };
    const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <nav className="w-full fixed top-0 left-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center bg-transparent backdrop-blur-md">
            {/* Notice bar */}
            {!isSidebarOpen && (
                <div className="fixed top-[56px] left-0 w-full z-40 bg-yellow-400 text-black text-center py-1.5 text-sm font-semibold shadow-md">
                    <span className="font-semibold text-xs sm:text-base text-center">
                        Some features are under development. Stay tuned for updates!
                    </span>
                </div>
            )}

            <div className="relative group mr-1 sm:mr-4">
                <img src={logo} alt="Logo" className="w-9 h-9 sm:w-9 sm:h-9 rounded-full object-cover" />
            </div>
            <Link to="/" className="text-xl sm:text-2xl font-bold text-brand-orange">Social Sphere</Link>

            {/* Middle: Search */}
            <div className="flex-1 mx-6 hidden md:flex justify-center relative">
                {!isAuthenticated ? (
                    <GuestTimerDisplay />
                ) : (
                    <div className="relative w-full max-w-md group" ref={searchRef}>
                        <div className="flex items-center bg-white dark:bg-dark-card rounded-full px-4 py-2 shadow border border-gray-300 dark:border-gray-600 transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-orange">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    const rawValue = e.target.value;
                                    const cleanedValue = rawValue.startsWith('@') ? rawValue.slice(1) : rawValue;
                                    handleSearchChange({ target: { value: cleanedValue } });
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search ..."
                                className="flex-grow bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            />
                            {searchTerm && (
                                <button onClick={clearSearch} className="text-gray-500 dark:text-gray-400 mr-2">
                                    <FaTimes />
                                </button>
                            )}
                            <button onClick={handleSearchSubmit}>
                                <FaSearch className="text-gray-500 dark:text-gray-400 text-base" />
                            </button>
                        </div>
                        {suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-md mt-2 shadow-lg z-50 max-h-60 overflow-y-auto">
                                {suggestions.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionClick(item)}
                                        className="px-4 py-2 hover:bg-brand-orange hover:text-white cursor-pointer transition"
                                    >
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Right: Auth Icons */}
            <div className="flex items-center space-x-4">
                {!isAuthenticated ? (
                    <>
                        <Link
                            to="/login"
                            className={`px-3 sm:px-4 py-1 sm:py-1.5 text-sm sm:text-base rounded font-semibold transition ${isLogin
                                ? "bg-brand-orange text-white"
                                : "bg-white text-brand-orange border border-brand-orange hover:bg-light-card"
                                }`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className={`hidden md:inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-sm sm:text-base rounded font-semibold transition ${isSignup
                                ? "bg-brand-orange text-white"
                                : "bg-white text-brand-orange border border-brand-orange hover:bg-light-card"
                                }`}
                        >
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="relative group">
                            <Link to="/profile">
                                {profileImageUrl ? (
                                    <img
                                        src={profileImageUrl}
                                        alt="Profile"
                                        className="w-9 h-9 rounded-full object-cover border-2 border-brand-orange hover:scale-110 transition"
                                    />

                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
                                )}
                            </Link>
                            <Tooltip label="Profile" />
                        </div>
                        <div className="relative group hidden sm:block">
                            <button onClick={handleLogout}>
                                <HiOutlineLogout className="text-3xl text-brand-orange hover:scale-110 transition" />
                            </button>
                            <Tooltip label="Logout" />
                        </div>
                    </>
                )}
                <div className="relative group">
                    <button
                        onClick={toggleTheme}
                        className="text-brand-orange text-2xl transition duration-300 hover:scale-110"
                        aria-label="Toggle Theme"
                    >
                        {theme === "dark" ? <FaSun /> : <FaMoon />}
                    </button>
                    <Tooltip label={theme === "dark" ? "Light Mode" : "Dark Mode"} />
                </div>


                {/* 🟠 Hamburger for mobile only */}
                <button
                    ref={hamburgerRef}
                    className="block md:hidden text-2xl text-brand-orange mr-2"
                    onClick={toggleSidebar}
                    aria-label="Open Sidebar"
                >
                    <RxHamburgerMenu />
                </button>
            </div>
            {isSidebarOpen && (
                <div
                    ref={sidebarRef}
                    className="absolute top-full left-0 w-full bg-white/80 dark:bg-dark-card/80 backdrop-blur-md flex-col items-start p-4 md:hidden z-40"
                >
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/"
                                className="w-full py-2 text-left text-brand-orange font-semibold px-4 flex items-center gap-2 text-lg"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <FaHome className="text-xl" />
                                &nbsp;Home
                            </Link>
                            <Link
                                to="/login"
                                className="w-full py-2 text-left text-brand-orange font-semibold px-4 flex items-center gap-2 text-lg"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <FaUserLock className="text-xl" />
                                &nbsp;Login
                            </Link>
                            <Link
                                to="/signup"
                                className="w-full py-2 text-left text-brand-orange font-semibold px-4 flex items-center gap-2 text-lg"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <FaUserPlus className="text-xl" />
                                &nbsp;SignUp
                            </Link>
                        </>
                    ) : (
                        <>
                            <SidebarNavigation
                                onClick={() => setIsSidebarOpen(false)}
                                setIsAuthenticated={setIsAuthenticated}
                                itemClass="w-full py-2 text-left text-brand-orange font-semibold px-4"
                                wrapperClass="flex flex-col items-start"
                            />
                            <Link
                                to="/trending"
                                className="w-full py-2 text-left text-brand-orange font-semibold px-4 flex items-center gap-2 text-lg"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <FaFire className="text-xl" />
                                &nbsp;Trending
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsSidebarOpen(false);
                                }}
                                className="w-full py-2 text-left text-brand-orange font-semibold px-5 flex items-center gap-2 text-lg"
                            >
                                <FaSignOutAlt className="text-xl" />
                                &nbsp;Logout
                            </button>

                        </>
                    )}
                </div>
            )}



        </nav >

    );
};

export default Navbar;
