import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun, FaSignOutAlt, FaSearch, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GuestTimerDisplay from "../context/GuestTimerDisplay";
import { useGuestTimer } from "../context/GuestTimerContext";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";
import { HiOutlineLogout } from "react-icons/hi";

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, setIsAuthenticated } = useGuestTimer();
    const location = useLocation();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const searchRef = useRef(null);

    // 🔐 Logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.clear(); // clear session info
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
                //console.log(data);
                // Check if the fullName or username contains the search term (case-insensitive)
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
            console.log("Search submitted:", searchTerm);
        }
        setSuggestions([]);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearchSubmit();
    };
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name);
        setSuggestions([]);
        console.log("User selected:", suggestion.name, "| ID:", suggestion.userid);
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
            <Link to="/" className="text-2xl font-bold text-brand-orange">Dev Connect</Link>

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
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Search DevConnect..."
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
                            className={`px-4 py-1.5 rounded font-semibold transition ${isLogin
                                ? "bg-brand-orange text-white"
                                : "bg-white text-brand-orange border border-brand-orange hover:bg-light-card"
                                }`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className={`px-4 py-1.5 rounded font-semibold transition ${isSignup
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
                        <div className="relative group">
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
            </div>
        </nav>
    );
};

export default Navbar;
