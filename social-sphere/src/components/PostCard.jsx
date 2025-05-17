import React, { useEffect, useState } from "react";
import { FaHeart, FaRegComment, FaShare, FaBookmark, FaUserCircle, } from "react-icons/fa";
import { useGuestTimer } from "../context/GuestTimerContext";
import { toggleLike, toggleSave, logShare, addComment, fetchComments, checkPostActionStatus, getActionCount, getUsersByAction, } from "../utils/postActions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";
import { followUser } from "../utils/followUtils";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
    const { isAuthenticated, openLoginModal, setShowTimer } = useGuestTimer();
    const [showFollowButton, setShowFollowButton] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [comments, setComments] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [actionStatus, setActionStatus] = useState({
        liked: post.liked || false,
        saved: post.saved || false,
    });
    const [actionCounts, setActionCounts] = useState({
        likes: 1,
        comments: 0,
        shares: 0,
        saves: 0,
    });

    const [liked, setLiked] = useState(actionStatus.liked || false);
    useEffect(() => {
        if (actionStatus.liked) {
            setLiked(true);
        }
    }, [actionStatus.liked])

    const currentUserId = sessionStorage.getItem("userID");
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            const [counts, status] = await Promise.all([
                getActionCount(post.id),
                checkPostActionStatus(post.id, currentUserId),
            ]);
            setActionCounts(counts);
            setActionStatus(status);
        };
        init();
    }, [post.id, currentUserId]);

    useEffect(() => {
        const checkFollowingStatus = async () => {
            if (!isAuthenticated || !currentUserId || currentUserId === post.userId) return;
            const userSnap = await getDoc(doc(db, "users", currentUserId));
            const isFollowing = (userSnap.data().followings || []).includes(post.userId);
            setShowFollowButton(!isFollowing);
        };
        checkFollowingStatus();
    }, [isAuthenticated, post.userId]);

    const handleFollowUser = async () => {
        const success = await followUser(currentUserId, post.userId);
        if (success) setShowFollowButton(false);
    };

    const handleLikeClick = () => {
        setLiked(prev => !prev); // toggle the local liked state
        handleAction("Like"); // jo tumhara backend/parent function hai wo bhi call karo
    };

    const handleAction = async (actionName) => {
        if (!isAuthenticated) {
            openLoginModal();
            setShowTimer(false);
            return;
        }

        switch (actionName) {
            case "Like":
                const liked = await toggleLike(post.id, currentUserId);
                //console.log("liked", liked);

                setActionStatus((prev) => ({
                    ...prev,
                    liked, //  Ye turant local state update karega
                }));
                setActionCounts((prev) => ({
                    ...prev,
                    likes: liked ? prev.likes + 1 : Math.max(prev.likes - 1, 0),
                }));
                break;


            case "Comment":
                setShowComments(!showComments);
                if (!showComments && comments.length === 0) {
                    loadComments();
                }
                break;

            case "Share":
                await logShare(post.id, currentUserId);
                setActionCounts((prev) => ({
                    ...prev,
                    shares: prev.shares + 1,
                }));
                break;

            case "Save":
                const saved = await toggleSave(currentUserId, post.id);
                setActionStatus((prev) => ({ ...prev, saved }));
                setActionCounts((prev) => ({
                    ...prev,
                    saves: prev.saves + (saved ? 1 : -1),
                }));
                break;
        }
    };

    const loadComments = async () => {
        const { newComments, last, hasMore } = await fetchComments(post.id, lastVisible);
        setComments((prev) => [...prev, ...newComments]);
        setLastVisible(last);
        setHasMoreComments(hasMore);
    };

    const handleCommentSubmit = async () => {
        if (commentInput.trim() === "") return;
        const newComment = await addComment(post.id, currentUserId, commentInput);
        setComments((prev) => [newComment, ...prev]);
        setCommentInput("");
        setActionCounts((prev) => ({ ...prev, comments: prev.comments + 1 }));
    };

    const handleUserClick = (userId) => {
        navigate(`/user/${userId}`);
    };

    const postTime = post.createdAt?.toDate
        ? timeAgo(post.createdAt.toDate())
        : "Just now";

    //console.log("Post: ", post);


    return (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4">
            {/* Top: User Info */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {post.profileDP ? (
                        <img
                            src={post.profileDP}
                            alt="User DP"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <FaUserCircle className="text-2xl text-gray-500 dark:text-gray-300" />
                    )}
                    <h3 className="font-semibold text-brand-orange">
                        {post.fullName} {/*post.userId*/}
                        <span className="block text-blue-900 dark:text-blue-400 text-xs mt-0">
                            @{post.username}{/*post.id*/}
                        </span>
                    </h3>
                    {showFollowButton && (
                        <button
                            onClick={handleFollowUser}
                            className="text-xs bg-green-500 text-black font-semibold border border-green-900 px-2 py-0.5 rounded hover:bg-orange-200 transition"
                        >
                            Follow
                        </button>
                    )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{postTime}</span>
            </div>

            {/* Title */}
            {post.title && (
                <h2 className="text-pretty font-semibold text-gray-900 dark:text-white inline-block relative mb-1 ml-2">
                    {post.title}
                    <span className="block h-[2px] w-full bg-brand-orange absolute bottom-0 left-0"></span>
                </h2>
            )}

            {/* Content */}
            <p className="text-sm sm:text-base mb-2 ml-2">{post.content}</p>

            {/* Media */}
            {post.mediaURL && (
                <div className="w-full aspect-video overflow-hidden rounded-lg mt-2">
                    <img
                        src={post.mediaURL}
                        alt="Post visual"
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-300 px-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLikeClick}
                        className={`flex items-center gap-1 transition duration-200 ${liked ? "text-red-500" : " hover:text-red-500"
                            }`}
                    >
                        <FaHeart className="text-base" />
                        <span>Like</span>

                        <span>{/*actionCounts.saves*/}</span>
                    </button>




                    <button
                        onClick={() => handleAction("Comment1")}
                        className="flex items-center gap-1 hover:text-blue-500 transition"
                    >
                        <FaRegComment className="text-base" />
                        <span>Comment</span>
                    </button>

                    <button
                        onClick={() => handleAction("Share")}
                        className="flex items-center gap-1 hover:text-green-600 transition"
                    >
                        <FaShare className="text-base" />
                        <span>Share</span>
                    </button>
                </div>

                <button
                    onClick={() => handleAction("Save")}
                    className={`flex items-center gap-1 transition ${actionStatus.saved ? "text-yellow-500" : "hover:text-yellow-500"}`}
                >
                    <FaBookmark className="text-base" />
                    <span>Save</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 border-t pt-3">
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="flex-1 border rounded px-3 py-1 text-sm dark:bg-dark-bg"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            className="px-3 py-1 bg-brand-orange text-white rounded hover:bg-orange-600 transition text-sm"
                        >
                            Post
                        </button>
                    </div>
                    <div>
                        {comments.map((cmt, index) => (
                            <div
                                key={index}
                                className="mb-2 p-2 rounded bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                onClick={() => handleUserClick(cmt.userId)}
                            >
                                <span className="font-semibold text-brand-orange">{cmt.username}</span>
                                <p className="text-sm">{cmt.text}</p>
                            </div>
                        ))}
                        {hasMoreComments && (
                            <button
                                onClick={loadComments}
                                className="text-blue-500 text-sm mt-2 hover:underline"
                            >
                                Load more comments
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

export default PostCard;
