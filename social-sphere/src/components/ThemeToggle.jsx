import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition duration-300"
            title="Toggle Theme"
        >
            {theme === "dark" ? (
                <FaSun className="text-[#FF7401] hover:text-[#e96b00] text-xl" />
            ) : (
                <FaMoon className="text-[#FF7401] hover:text-[#e96b00] text-xl" />
            )}
        </button>
    );
};
export default ThemeToggle;
