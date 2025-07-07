import React, { useEffect, useState, useRef, useCallback } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../configuration/firebaseConfig";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

const Loader = () => (
    <div className="flex justify-center py-6">
        <div className="w-5 h-5 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const POSTS_PER_PAGE = 10;

const Bookmarks = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastVisible, setLastVisible] = useState(null);
    const observer = useRef();
    const userId = sessionStorage.getItem("userID");

    // Fetch initial posts
    useEffect(() => {
        const fetchInitialBookmarks = async () => {
            setLoading(true);
            setHasMore(true);
            setLastVisible(null);
            if (!userId) {
                setPosts([]);
                setLoading(false);
                return;
            }
            try {
                const savedPostsRef = collection(db, "users", userId, "savedPosts");
                const savedSnapshot = await getDocs(savedPostsRef);
                const savedPostIds = savedSnapshot.docs.map(doc => doc.id);
                if (savedPostIds.length === 0) {
                    setPosts([]);
                    setHasMore(false);
                    setLoading(false);
                    return;
                }
                // Fetch the first 10 posts, ordered by savedAt desc
                const savedDocs = savedSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => (b.savedAt?.toDate?.() || 0) - (a.savedAt?.toDate?.() || 0));
                const initialDocs = savedDocs.slice(0, POSTS_PER_PAGE);
                setLastVisible(initialDocs.length > 0 ? initialDocs[initialDocs.length - 1] : null);
                // Fetch post and user data for these
                const postPromises = initialDocs.map(async (savedDoc) => {
                    const postRef = doc(db, "posts", savedDoc.id);
                    const postSnap = await getDoc(postRef);
                    if (!postSnap.exists()) return null;
                    const postData = { id: postSnap.id, ...postSnap.data() };
                    // Fetch user info
                    const userRef = doc(db, "users", postData.userId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.exists() ? userSnap.data() : {};
                    return {
                        ...postData,
                        username: userData.username,
                        fullName: userData.fullName,
                        profileDP: userData.dp
                    };
                });
                const postsWithUser = (await Promise.all(postPromises)).filter(Boolean);
                setPosts(postsWithUser);
                setHasMore(savedDocs.length > POSTS_PER_PAGE);
            } catch {
                setPosts([]);
                setHasMore(false);
            }
            setLoading(false);
        };
        fetchInitialBookmarks();
    }, [userId]);

    // Infinite scroll logic
    const lastPostRef = useCallback(
        (node) => {
            if (loadingMore || loading || !hasMore) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new window.IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    fetchMorePosts();
                }
            });
            if (node) observer.current.observe(node);
        },
        [loadingMore, loading, hasMore]
    );

    // Fetch more posts
    const fetchMorePosts = async () => {
        setLoadingMore(true);
        if (!userId || !lastVisible) {
            setLoadingMore(false);
            setHasMore(false);
            return;
        }
        try {
            // Get all saved posts, sorted by savedAt desc
            const savedPostsRef = collection(db, "users", userId, "savedPosts");
            const savedSnapshot = await getDocs(savedPostsRef);
            const savedDocs = savedSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => (b.savedAt?.toDate?.() || 0) - (a.savedAt?.toDate?.() || 0));
            // Find the index of lastVisible
            const lastIndex = savedDocs.findIndex(doc => doc.id === lastVisible.id);
            const nextDocs = savedDocs.slice(lastIndex + 1, lastIndex + 1 + POSTS_PER_PAGE);
            if (nextDocs.length === 0) {
                setHasMore(false);
                setLoadingMore(false);
                return;
            }
            setLastVisible(nextDocs.length > 0 ? nextDocs[nextDocs.length - 1] : null);
            // Fetch post and user data for these
            const postPromises = nextDocs.map(async (savedDoc) => {
                const postRef = doc(db, "posts", savedDoc.id);
                const postSnap = await getDoc(postRef);
                if (!postSnap.exists()) return null;
                const postData = { id: postSnap.id, ...postSnap.data() };
                // Fetch user info
                const userRef = doc(db, "users", postData.userId);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.exists() ? userSnap.data() : {};
                return {
                    ...postData,
                    username: userData.username,
                    fullName: userData.fullName,
                    profileDP: userData.dp
                };
            });
            const postsWithUser = (await Promise.all(postPromises)).filter(Boolean);
            setPosts(prev => [...prev, ...postsWithUser]);
            setHasMore(nextDocs.length === POSTS_PER_PAGE);
        } catch {
            setHasMore(false);
        }
        setLoadingMore(false);
    };

    return (
        <div className="w-full min-h-screen bg-light-bg dark:bg-dark-bg flex flex-col items-center pt-10 px-2">
            <h1 className="text-3xl font-bold text-brand-orange mb-6">Bookmarked Posts</h1>
            {loading ? (
                <Loader />
            ) : posts.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                    You have no saved posts yet.
                </div>
            ) : (
                <div className="w-full max-w-2xl space-y-6">
                    {posts.map((post, idx) => {
                        const isLast = idx === posts.length - 1;
                        return (
                            <Link key={post.id} to={`/post/${post.id}`} className="block hover:scale-[1.01] transition-transform" ref={isLast ? lastPostRef : null}>
                                <PostCard post={post} />
                            </Link>
                        );
                    })}
                    {loadingMore && <Loader />}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
