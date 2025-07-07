import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/authFunctions";
import { loginWithGoogle } from "../utils/authFunctions";
import { useGuestTimer } from "../context/GuestTimerContext";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { setShowTimer, secondsLeft } = useGuestTimer();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        navigate("/", { replace: true });
        setTimeout(() => {
            onClose();
            setShowTimer(true);
        }, 20);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        loginUser(
            formData,
            () => {
                onLoginSuccess();
                setMessage("Logged in successfully!");
                handleClose();
                setTimeout(() => setMessage(""), 3000);
            },
            (errorMessage) => {
                setMessage("❌ Something went wrong!");
                console.log(errorMessage);
                setTimeout(() => setMessage(""), 4000);
            }
        );
    };

    const handleGoogleLogin = () => {
        loginWithGoogle(
            () => {
                onLoginSuccess();
                setMessage("Logged in with Google!");
                handleClose();
                setTimeout(() => setMessage(""), 3000);
            },
            (error) => {
                setMessage("❌ Google login failed: " + error);
                setTimeout(() => setMessage(""), 4000);
            }
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md px-2 sm:px-4">
            <div className="w-full max-w-sm sm:max-w-md">
                <div className="w-full bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6 sm:p-10 relative">

                    {/* ❌ Close Button */}
                    {secondsLeft > 0 && (
                        <button
                            className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-brand-orange"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    )}

                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-orange mb-6 text-center">
                        Login to continue..
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                        <div className="relative">
                            <label className="block text-sm font-semibold text-black dark:text-white">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 pr-11 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition text-sm text-black dark:text-white"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute top-9 right-3 text-gray-500 hover:text-brand-orange"
                                tabIndex={-1}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Google Login */}
                        <div className="flex items-center justify-center">
                            <button
                                type="button"
                                className="flex items-center gap-3 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-light-card dark:bg-[#0c0c0c] hover:border-brand-orange hover:bg-white dark:hover:bg-[#1a1a1a] transition w-full justify-center"
                                onClick={handleGoogleLogin}
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
                        <Link
                            to="/signup"
                            onClick={handleClose}
                            className="text-brand-orange hover:underline cursor-pointer"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")
    );
};

export default LoginModal;
