import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGuestTimer } from "../context/GuestTimerContext";
import { loginUser } from "../utils/authFunctions"; // ✅ Import login function

const Login = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated, setShowTimer } = useGuestTimer();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        setShowTimer(false);
    }, [setShowTimer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        loginUser(
            formData,
            () => {
                setIsAuthenticated(true);
                setShowTimer(false);
                navigate("/home");
            },
            (errorMessage) => {
                alert("Login failed: " + errorMessage);
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark transition-colors duration-300 px-4 sm:px-6">
            <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6 sm:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-orange mb-6 text-center">
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition text-sm"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-lg bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange hover:border-brand-orange transition text-sm"
                            required
                        />
                    </div>

                    {/* Google Login */}
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className="flex items-center gap-3 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-light-card dark:bg-[#0c0c0c] hover:border-brand-orange hover:bg-white dark:hover:bg-[#1a1a1a] transition w-full justify-center"
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
    );
};

export default Login;
