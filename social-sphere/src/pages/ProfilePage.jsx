import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, query, where, getDocs, collection, } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../configuration/firebaseConfig";
import compressImage from '../utils/imageCompressor';
import { getFollowCounts } from "../utils/followUtils";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import { deletePost } from "../utils/uploadPost";

const ProfilePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        bio: "",
        location: "",
        website: "",
        interests: "",
        dp: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState("");
    const [currentUserData, setCurrentUserData] = useState("");

    // username availability states
    const [usernameStatus, setUsernameStatus] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [followCounts, setFollowCounts] = useState({
        followerCount: 0,
        followingCount: 0
    });

    // const userid = sessionStorage.getItem("userID");
    // console.log("User ID:", userid);


    const location = useLocation();
    const navigate = useNavigate();

    const handleConnectionsClick = (type) => {
        const uid = sessionStorage.getItem("userID");
        if (uid) {
            const basePath = location.pathname; // e.g., "/profile"
            const query = `?showModal=true&type=${type}&userId=${uid}`;
            navigate(`${basePath}${query}`);
        } else {
            console.warn("User ID not found in session storage");
        }
    };

    /*
    // purana code following followers ke liye bina model ka getConnections file ke liye
    const navigate = useNavigate();
    const handleConnectionsClick = (type) => {
        const uid = sessionStorage.getItem("userID");
        if (uid) {
            navigate(`/connections/${uid}?type=${type}`);
        } else {
            console.warn("User ID not found in session storage");
        }
    };
    */

    // fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            const uid = sessionStorage.getItem("userID");
            if (!uid) return;

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setCurrentUserData(userData);
                setFormData((prev) => ({ ...prev, ...userData }));
                if (userData.dp) setImage(userData.dp);
            } else {
                //console.log("No such user!");
            }
        };

        fetchUserData();
    }, []);

    //setup for important data
    const uid = sessionStorage.getItem("userID");
    const currentUsername = currentUserData.username;
    getFollowCounts(uid)
        .then(counts => {
            setFollowCounts({
                followerCount: counts.followerCount,
                followingCount: counts.followingCount
            });
        })
        .catch(error => {
            console.error("Failed to get follow counts:", error);
        });

    // fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            const uid = sessionStorage.getItem("userID");
            //console.log("User ID:", uid);
            if (!uid) return;

            const q = query(
                collection(db, "posts"),
                where("userId", "==", uid)
            );

            const querySnapshot = await getDocs(q);
            const postsArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            //console.log("Fetched Posts by User:", postsArray);
            setPosts(postsArray);
        };

        fetchPosts();
    }, []);

    // image change
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const maxFileSize = 0.08; // in MB
        if (file) {
            try {
                const compressedFile = await compressImage(file, maxFileSize);
                const compressedImageURL = URL.createObjectURL(compressedFile);
                setImageFile(compressedFile); // for upload
                setImage(compressedImageURL); // for preview
            } catch (error) {
                //console.error('Image compression error:', error);
            }
        }
    };


    // check username Availability
    const checkUsernameAvailability = async (
        username,
        setUsernameStatus,
        setIsUsernameAvailable,
        currentUsername
    ) => {
        //console.log(username, " and ", currentUsername);
        if (!username) {
            setUsernameStatus("Enter valid Username !");
            setIsUsernameAvailable(null);
            return false;
        }
        if (username.includes("@" || " ")) {
            setUsernameStatus("Username can't contain @");
            setIsUsernameAvailable(null);
            return false;
        }
        if (username === currentUsername) {
            setIsUsernameAvailable(true);
            return true;
        }
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setIsUsernameAvailable(true);
                return true;
            } else {
                setUsernameStatus("Username already taken!");
                setIsUsernameAvailable(false);
                return false;
            }
        } catch (err) {
            //console.error("Error checking username:", err);
            setUsernameStatus("Something went wrong!");
            return false;
        }
    };



    // submit profile form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = formData.username.toLowerCase();
        const isAvailable = await checkUsernameAvailability(
            username,
            setUsernameStatus,
            setIsUsernameAvailable,
            currentUsername
        );
        if (!isAvailable) return;
        setIsLoading(true); // Loader start
        try {
            const uid = sessionStorage.getItem("userID");
            if (!uid) return alert("User not logged in");

            const userRef = doc(db, "users", uid);
            let dpURL = formData.dp;

            if (imageFile) {
                const storageRef = ref(storage, `profilePictures/${uid}`);
                await uploadBytes(storageRef, imageFile);
                dpURL = await getDownloadURL(storageRef);
            }

            await updateDoc(userRef, {
                ...formData,
                username: username.trim().toLowerCase(),
                dp: dpURL,
            });

            alert("Profile updated successfully!");
        } catch (err) {
            //console.error("Update error:", err);
            alert("Error updating profile. Try again.");
        } finally {
            setIsLoading(false); // Loader stop
        }
    };


    // handle post actions
    const handlePostClick = (postId) => {
        //console.log("Clicked post with ID:", postId);
    };
    const handleEdit = (postId, postUserId) => {
        if (postUserId === uid) {
            const isConfirmed = window.confirm("Are you sure, you want to edit this post?");
            if (isConfirmed) {
                console.log("Editing Post ID", postId, "post.userId", postUserId, "LoggedIn user", uid);
                navigate(`/editpost/${postId}`);
            } else {
                console.log("User canceled the edit operation.");
            }
        } else {
            console.log("Post creater ", postUserId);
            console.log("Current User ", uid);
            console.log("You cannot edit this post. ");
        }
    };

    const handleDelete = (postId, postUserId) => {
        if (postUserId === uid) {
            const isConfirmed = window.confirm("Are you sure you want to delete this post?");
            if (isConfirmed) {
                console.log("Deleting Post ID", postId, "post.userId", postUserId, "LoggedIn user", uid);
                deletePost(postId);
            } else {
                console.log("User canceled the delete operation.");
            }
        } else {
            console.log("User", postUserId);
            console.log("Current User", uid);
            console.log("You cannot delete this post.");
        }
    };

    // input change
    const handleChange = (e) => {
        setUsernameStatus("");
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    // toggle submit button
    const handleSubmitButtonState = (shouldDisable) => {
        const btn = document.getElementById("save-btn");
        if (btn) {
            btn.disabled = shouldDisable;
            btn.classList.toggle("opacity-50", shouldDisable);
            btn.classList.toggle("cursor-not-allowed", shouldDisable);
        }
    };


    return (
        <div className="min-h-screen pt-8 pb-10 px-4 bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark transition-colors duration-300">
            {/*  Loader pehle hi return me conditionally dikhate hain */}
            {isLoading && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                    {/*  Outer Spinner */}
                    <div className="relative w-10 h-10">
                        <div className="absolute inset-0 border-[4px] border-orange-500 border-t-transparent rounded-full animate-spin" />
                        {/*  Inner Spinner (Reverse spin) */}
                        <div className="absolute inset-2 border-[3px] border-blue-500 border-t-transparent rounded-full animate-[spin_1s_linear_reverse_infinite]" />
                    </div>
                    <p className="mt-4 text-white text-lg font-semibold animate-pulse tracking-wide">Loading...</p>
                </div>
            )}
            <div className="max-w-6xl mx-auto py-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-brand-orange mb-4">Profile Section</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        View and update your personal information
                    </p>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-10">
                    {/* DP Section */}
                    <div className="flex flex-col items-center justify-center w-full md:w-1/3">
                        <div className="relative flex flex-col items-center group">
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
                                Pick Profile Picture
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
                            <div className="mt-4 flex gap-6 text-sm text-gray-600 dark:text-gray-300 font-medium justify-center">
                                <div className="text-center cursor-pointer" onClick={() => handleConnectionsClick('followers')}>
                                    <span className="block text-lg font-bold text-brand-orange">{followCounts.followerCount}</span>
                                    Followers
                                </div>
                                <div className="text-center cursor-pointer" onClick={() => handleConnectionsClick('followings')}>
                                    <span className="block text-lg font-bold text-brand-orange">{followCounts.followingCount}</span>
                                    Followings
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
                            { name: "fullName", label: "Full Name", disabled: false },
                            { name: "username", label: "Username", disabled: false },
                            { name: "email", label: "Email", type: "email", disabled: true },
                            { name: "location", label: "Location", disabled: false },
                            { name: "website", label: "Website", disabled: false },
                            { name: "interests", label: "Interests", disabled: false },
                        ].map((field) => (
                            field.name === "username" ? (

                                <div key={field.name} className="flex flex-col relative">
                                    <label htmlFor={field.name} className="text-sm font-medium mb-1">
                                        {field.label}
                                    </label>

                                    <input
                                        type={field.type || "text"}
                                        name={field.name}
                                        value={formData[field.name] || ""}
                                        onChange={(e) => {
                                            const value = e.target.value.toLowerCase();
                                            handleChange({ target: { name: e.target.name, value } });

                                            // Username validation
                                            if (field.name === "username") {
                                                const specialCharMatch = value.match(/[^a-zA-Z0-9._]/);
                                                const hasLetter = /[a-zA-Z]/.test(value);
                                                const hasNumber = /[0-9]/.test(value);
                                                const isBooleanish = ["0", "1", "true", "false"].includes(value);

                                                if (specialCharMatch) {
                                                    if (specialCharMatch[0] === " ") {
                                                        setUsernameStatus(`Username can't contain space.`);
                                                    } else {
                                                        setUsernameStatus(`Username can't contain  '${specialCharMatch[0]}'`);
                                                    }
                                                    setIsUsernameAvailable(false);
                                                    handleSubmitButtonState(true);
                                                    return;
                                                }

                                                if (isBooleanish) {
                                                    setUsernameStatus(`Username can't be '${value}'`);
                                                    setIsUsernameAvailable(false);
                                                    handleSubmitButtonState(true);
                                                    return;
                                                }

                                                if (!hasLetter || !hasNumber) {
                                                    setUsernameStatus("Username must include at least 1 letter and 1 number");
                                                    setIsUsernameAvailable(false);
                                                    handleSubmitButtonState(true);
                                                    return;
                                                }

                                                // Valid
                                                setUsernameStatus("");
                                                setIsUsernameAvailable(null);
                                                handleSubmitButtonState(false);
                                            }
                                        }}
                                        disabled={field.disabled}
                                        className={`bg-light-card dark:bg-[#0c0c0c] border ${usernameStatus && !isUsernameAvailable
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-700"
                                            } rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange transition`}
                                    />

                                    {usernameStatus && (
                                        <div className="flex items-center mt-1 text-xs text-red-500 gap-1">
                                            <span>{usernameStatus}</span>
                                            <div className="relative group">
                                                <span className="cursor-default font-bold text-sm">ⓘ</span>
                                                <div className="absolute w-max bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg z-50">
                                                    Only use letters (a–z), numbers (0–9), dot (.) and underscore (_). Avoid @, #, spaces, and boolean values.
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            ) : (
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
                                        disabled={field.disabled}
                                        className="bg-light-card dark:bg-[#0c0c0c] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange transition"
                                    />
                                </div>
                            )
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
                                id="save-btn"
                                type="submit"
                                className="w-full bg-brand-orange text-white font-semibold py-2.5 rounded-lg hover:bg-brand-orange-hover transition text-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>

                </div>

                {/* Dummy Posts */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Your Posts
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="relative bg-light-card dark:bg-[#1a1a1a] rounded-lg border border-gray-300 dark:border-gray-700 p-4 group"
                                    onClick={() => handlePostClick(post.id)}
                                >
                                    {/* Post Image */}
                                    <div className="w-full h-40 overflow-hidden rounded-lg">
                                        {post.mediaURL ? (
                                            <img
                                                src={post.mediaURL}
                                                alt="Post"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Post Title */}
                                    <h3 className="text-md font-semibold text-black dark:text-white mt-2 mb-1">
                                        {post.title || "Untitled Post"}
                                    </h3>

                                    {/* Post Description */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {post.content
                                            ? post.content.slice(0, 100) + "..."
                                            : "No content available"}
                                    </p>

                                    {/* Action Icons */}
                                    <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {/* Edit Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(post.id, post.userId);
                                            }}
                                            className="p-2 bg-brand-orange hover:bg-blue-600 hover:text-white text-blue-700 dark:hover:text-white rounded-full transition-all duration-200"
                                            title="Edit Post"
                                        >
                                            <FaEdit className="w-4 h-4" />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(post.id, post.userId);
                                            }}
                                            className="p-2 bg-brand-orange hover:bg-red-600 hover:text-white text-black dark:hover:text-white rounded-full transition-all duration-200"
                                            title="Delete Post"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No posts yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div >
    );
};

export default ProfilePage;
