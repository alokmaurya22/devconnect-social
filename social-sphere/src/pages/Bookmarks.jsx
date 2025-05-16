import React from "react";
import { Link } from "react-router-dom";

const UnderDevelopment = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark transition-colors duration-300 px-4">
            <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 sm:p-10 text-center">
                <h2 className="text-3xl font-bold text-brand-orange mb-4"> Under Development</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                    This page is currently under construction. We’re working hard to bring it to life!
                </p>

                <img
                    src="https://cdn-icons-png.flaticon.com/512/2784/2784461.png"
                    alt="Under Construction"
                    className="w-32 mx-auto mb-6 opacity-90 dark:invert"
                />

                <Link to="/home">
                    <button className="w-full bg-brand-orange text-white font-semibold py-2.5 rounded-lg hover:bg-brand-orange-hover transition text-sm">
                        Go to Home
                    </button>
                </Link>
            </div>
        </div>
    );
};
export default UnderDevelopment;
