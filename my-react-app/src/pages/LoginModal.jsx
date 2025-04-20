import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { loginUser } from "../utils/authFunctions"; // ✅ Real login function

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        loginUser(
            formData,
            () => {
                // ✅ On successful login
                onLoginSuccess();
                setMessage("✅ Logged in successfully!");
                onClose(); // ✅ Close the modal
                setTimeout(() => setMessage(""), 3000);
            },
            (errorMessage) => {
                // ❌ On error
                setMessage("❌ " + errorMessage);
                setTimeout(() => setMessage(""), 4000);
            }
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
            <div className="w-full max-w-md px-4">
                <div className="w-full bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 sm:p-10">
                    <h2 className="text-3xl font-bold text-brand-orange mb-6 text-center">
                        Login to continue..
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-black dark:text-white">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition text-sm text-black dark:text-white"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-black dark:text-white">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition text-sm text-black dark:text-white"
                                required
                            />
                        </div>

                        {/* Google Login */}
                        <div className="flex items-center justify-center">
                            <button
                                type="button"
                                className="flex items-center gap-3 px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-light-card dark:bg-[#0c0c0c] hover:border-brand-orange hover:bg-white dark:hover:bg-[#1a1a1a] transition w-full justify-center"
                            >
                                <FcGoogle className="text-xl" />
                                <span className="text-sm font-medium text-black dark:text-white">
                                    Login with Google
                                </span>
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-brand-orange text-white font-semibold py-2.5 rounded-lg hover:bg-brand-orange-hover transition text-sm"
                        >
                            Login
                        </button>
                    </form>

                    {/* Response Message */}
                    {message && (
                        <p className="mt-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                            {message}
                        </p>
                    )}

                    {/* Sign up redirect */}
                    <p className="text-sm mt-5 text-center text-black dark:text-white">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup">
                            <span className="text-brand-orange hover:underline cursor-pointer">
                                Sign Up
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")
    );
};

export default LoginModal;
