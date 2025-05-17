import React from "react";
import { FaSignOutAlt, FaFire, FaUserPlus, FaUserLock, FaHome, FaMoon, FaSun } from "react-icons/fa";
const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-light-bg dark:bg-dark-bg text-gray-600 dark:text-gray-400 text-sm py-4 border-t dark:border-gray-700 z-50">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                <p>&copy; {new Date().getFullYear()} <span className="font-semibold text-brand-orange"><a href="./">Social Sphere</a></span>. All rights reserved.</p>
                <div className="hidden sm:flex gap-4">
                    <p className="font-semibold text-brand-orange">Developer - </p>
                    <a href="https://alokdata.netlify.app/" className="hover:text-brand-orange transition">Website</a>
                    <a href="https://www.linkedin.com/in/alok22/" className="hover:text-brand-orange transition">LinkedIn</a>
                    <a href="https://github.com/alokmaurya22" className="hover:text-brand-orange transition">GitHub</a>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
