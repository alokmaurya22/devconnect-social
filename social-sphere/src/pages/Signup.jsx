import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGuestTimer } from "../context/GuestTimerContext";
import { signUpUser } from "../utils/authFunctions";

const SignUp = () => {
    const navigate = useNavigate();
    const { setShowTimer, setIsAuthenticated } = useGuestTimer();

    useEffect(() => {
        setShowTimer(false); // Page khulte hi timer hatao
    }, [setShowTimer]);

    const [formData, setFormData] = useState({
        fullName: '', // Changed from 'name' to 'fullName'
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState(''); // Renamed to 'errorMessage'
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Pass the formData to signUpUser
        signUpUser(
            formData,
            () => {
                // Success callback
                console.log("User signed up successfully!");
                setIsAuthenticated(true);
                setShowTimer(false);
                navigate("/home");
            },
            (error) => {
                // Error callback
                setErrorMessage(error); // Set error message
                console.error("Signup error:", error);
            }
        );

        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark transition-colors duration-300 px-4">
            <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-brand-orange mb-6 text-center">Create Account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block mb-1 font-medium">Full Name</label>
                        <input
                            type="text"
                            name="fullName" // This field now uses 'fullName'
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Your Name"
                            className="w-full px-4 py-2 rounded bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 rounded bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 rounded bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
                    )}

                    {/* Google Login */}
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className="flex items-center gap-3 px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-light-card dark:bg-[#0c0c0c] hover:border-brand-orange hover:bg-white dark:hover:bg-[#1a1a1a] transition w-full justify-center"
                        >
                            <FcGoogle className="text-xl" />
                            <span className="text-sm font-medium text-black dark:text-white">Sign Up with Google</span>
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-brand-orange text-white font-semibold py-2 rounded hover:bg-brand-orange-hover transition"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Login Redirect */}
                <p className="text-sm mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login">
                        <span className="text-brand-orange hover:underline cursor-pointer">Login</span>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
