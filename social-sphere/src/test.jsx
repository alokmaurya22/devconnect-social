import React from "react";

const ProfilePage = () => {

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-brand-orange mb-4">Profile Section</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        View and update your personal information
                    </p>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-10">
                    {/* DP Section */}
                    <div className="flex flex-col items-center justify-center w-full md:w-1/3">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-brand-orange shadow-lg group-hover:scale-105 transition-all duration-300">
                                {image ? (
                                    <img
                                        src={image}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-neutral-700 text-sm text-gray-300">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <label
                                htmlFor="profileImage"
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-medium rounded-lg cursor-pointer transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h3m10-5V5a2 2 0 00-2-2H7a2 2 0 00-2 2v11a2 2 0 002 2h3l4 4 4-4h1a2 2 0 002-2z" />
                                </svg>
                                Upload New Photo
                            </label>
                            <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            <p className="mt-2 text-sm text-gray-400 text-center italic">
                                “A profile picture speaks before you do.”
                            </p>
                            <div className="mt-4 flex gap-6 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                <div className="text-center">
                                    <span className="block text-lg font-bold">120</span>
                                    Followers
                                </div>
                                <div className="text-center">
                                    <span className="block text-lg font-bold">85</span>
                                    Following
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {[
                            { name: "fullName", label: "Full Name" },
                            { name: "username", label: "Username" },
                            { name: "email", label: "Email", type: "email" },
                            { name: "location", label: "Location" },
                            { name: "website", label: "Website" },
                            { name: "interests", label: "Interests" },
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label
                                    htmlFor={field.name}
                                    className="text-sm font-medium mb-1"
                                >
                                    {field.label}
                                </label>
                                <input
                                    type={field.type || "text"}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className="bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange transition"
                                />
                            </div>
                        ))}

                        <div className="col-span-1 md:col-span-2">
                            <label className="text-sm font-medium mb-1 block">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio || ""}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange transition"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 mt-2">
                            <button
                                type="submit"
                                className="w-full bg-brand-orange text-white font-semibold py-2.5 rounded-lg hover:bg-brand-orange-hover transition text-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default ProfilePage;
