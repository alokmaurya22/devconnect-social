import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../configuration/firebaseConfig";
import { getFollowers, getFollowings } from "../../utils/followUtils";
import { Link } from "react-router-dom";
import { FaUser, FaPaperPlane } from "react-icons/fa";
const FollowersFollowingContent = ({ userId, type }) => {
    const sessionUserId = sessionStorage.getItem("userID");
    const [selectedTab, setSelectedTab] = useState(type === "followings" ? "following" : "followers");
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch followers and followings
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedFollowers, fetchedFollowings] = await Promise.all([
                    getFollowers(userId),
                    getFollowings(userId),
                ]);
                setFollowers(fetchedFollowers);
                setFollowings(fetchedFollowings);
            } catch (err) {
                console.error("Error fetching followers/followings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    //  UserCard for each user
    const UserCard = ({ userId, followedAt }) => {
        const [userData, setUserData] = useState(null);

        useEffect(() => {
            const fetchUser = async () => {
                try {
                    const docSnap = await getDoc(doc(db, "users", userId));
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    }
                } catch (err) {
                    console.error("Error fetching user:", err);
                }
            };
            fetchUser();
        }, [userId]);

        if (!userData) return null;

        return (
            <div className="flex justify-between items-center p-3 rounded-lg 
                            bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                <div className="flex gap-3 items-center">
                    <img
                        src={userData.dp || `https://api.dicebear.com/7.x/thumbs/svg?seed=${userData.uid}`}
                        alt="dp"
                        className="w-10 h-10 rounded-full border-2 border-orange-500"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 dark:text-white">
                            {userData.fullName || userData.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">@{userData.username}</span>
                        {sessionUserId === userId && followedAt && (
                            <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                Followed on: {followedAt.toDate().toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    {/* View Profile Button */}
                    <Link
                        to={`/user/${userId}`}
                        className="p-2 rounded-full bg-orange-100  text-orange-500 
                   hover:bg-orange-200 dark:hover:bg-blue-500 transition"
                        title="View Profile"
                    >
                        <FaUser className="text-base" />
                    </Link>

                    {/* Chat Button */}
                    <Link
                        to={`/chats/${userId}`}
                        className=" hidden md:block p-2 rounded-full bg-orange-100 text-orange-500 
                   hover:bg-orange-200 dark:hover:bg-blue-500 transition"
                        title="Send Message"
                    >
                        <FaPaperPlane className="text-base" />
                    </Link>
                </div>
            </div>
        );
    };

    // Render list of followers or followings
    const renderUserList = (list) => {
        if (!list.length) {
            return (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                    No users found.
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-3 px-3 pb-4">
                {list.map((item, idx) => (
                    <UserCard key={idx} userId={item.userId} followedAt={item.followedAt} />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">

            {/*  Tabs Section */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setSelectedTab("followers")}
                    className={`flex-1 py-2 text-sm font-semibold transition-colors duration-200
                        ${selectedTab === "followers"
                            ? "border-b-2 border-orange-500 text-orange-500"
                            : "text-gray-500 dark:text-gray-400 hover:text-orange-400"}`}
                >
                    Followers
                </button>
                <button
                    onClick={() => setSelectedTab("following")}
                    className={`flex-1 py-2 text-sm font-semibold transition-colors duration-200
                        ${selectedTab === "following"
                            ? "border-b-2 border-orange-500 text-orange-500"
                            : "text-gray-500 dark:text-gray-400 hover:text-orange-400"}`}
                >
                    Following
                </button>
            </div>

            {/*  Scrollable content section inside modal */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 px-1 pt-2">
                {loading ? (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                        Loading...
                    </div>
                ) : selectedTab === "followers" ? (
                    renderUserList(followers)
                ) : (
                    renderUserList(followings)
                )}
            </div>
        </div>
    );
};

export default FollowersFollowingContent;