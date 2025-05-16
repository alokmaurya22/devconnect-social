import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Create context
const ThemeContext = createContext();

// 2. Custom hook for easier usage
export const useTheme = () => useContext(ThemeContext);

// 3. Provider component
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage for theme preference
        const savedTheme = localStorage.getItem("devconnect-theme");
        return savedTheme ? savedTheme : "light";
    });
    // Update <html> class for Tailwind to react
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("devconnect-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
