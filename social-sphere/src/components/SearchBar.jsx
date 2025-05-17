// components/SearchBar.js
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ isMobile = false }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const searchRef = useRef(null);
    const navigate = useNavigate();

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
        navigate(`/user/${suggestion.userid}`);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setSuggestions([]);
    };

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            className={`relative w-full ${isMobile ? "px-2" : "mx-0"} ${isMobile ? "max-w-full" : "max-w-md"} group`}
            ref={searchRef}
        >
            <div className="flex items-center bg-white dark:bg-dark-card rounded-full px-3 py-2 shadow border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-brand-orange">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        const rawValue = e.target.value;
                        const cleanedValue = rawValue.startsWith("@") ? rawValue.slice(1) : rawValue;
                        handleSearchChange({ target: { value: cleanedValue } });
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search ..."
                    className="flex-grow bg-transparent outline-none text-sm sm:text-base text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                <ul className="absolute top-full left-0 right-0 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-md mt-2 shadow-lg z-50 max-h-60 overflow-y-auto text-sm sm:text-base">
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

    );
};

export default SearchBar;
