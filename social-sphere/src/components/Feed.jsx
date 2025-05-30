import React, { useEffect, useState, useRef, useCallback } from "react";
import PostCard from "./PostCard";
import { db } from "../configuration/firebaseConfig";
import { collection, getDocs, limit, orderBy, query, startAfter, getDoc, doc } from "firebase/firestore";
import { checkIfUserIsFollower } from "../utils/followUtils";

// Loader component jab data load ho raha hota hai
const Loader = () => (
    <div className="flex justify-center py-6">
        <div className="w-5 h-5 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const Feed = ({ activeTab }) => {
    const [posts, setPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const currentUserId = sessionStorage.getItem("userID");
    const observer = useRef();

    // Tab change hone par state reset karna & naye data fetch karna
    useEffect(() => {
        setPosts([]);
        setLastVisible(null);
        setHasMore(true);
        fetchInitialPosts();
    }, [activeTab]);

    // Initial posts fetch karne ka function
    const fetchInitialPosts = async () => {
        setIsLoading(true);

        const fetchedPosts = [];
        let lastDoc = null;

        // Jab 'foryou' tab ho to sirf ek baar try karega
        // 'following' tab me multiple tries (maxTries = 5) allow karega kyunki filter lagta hai
        const maxTries = activeTab === "foryou" ? 1 : 5;
        let tries = 0;

        // Jab tak 10 posts nahi mil jaati ya maxTries cross nahi ho jati
        while (fetchedPosts.length < 10 && tries < maxTries) {
            const postsQuery = lastDoc
                ? query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(10))
                : query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10));

            const snapshot = await getDocs(postsQuery);

            if (snapshot.empty) break;

            lastDoc = snapshot.docs[snapshot.docs.length - 1];
            tries++;

            // Har post ke associated user data ko fetch karna
            const postData = await Promise.all(
                snapshot.docs.map(async (docSnap) => {
                    const data = docSnap.data();

                    try {
                        const userDocRef = doc(db, "users", data.userId);
                        const userDoc = await getDoc(userDocRef);
                        const userData = userDoc.exists() ? userDoc.data() : {};

                        const { viewType, userId: postUserId } = data;

                        let shouldAdd = false;

                        if (activeTab === "foryou") {
                            // "foryou" tab me sirf public posts dikhni chahiye
                            shouldAdd = viewType === "EveryOne";
                        } else if (activeTab === "following") {
                            // "following" tab me real-time follower check karenge
                            if (["Followers", "FriendsOnly"].includes(viewType)) {
                                shouldAdd = await checkIfUserIsFollower(postUserId, currentUserId);
                            }
                        }

                        if (shouldAdd) {
                            return {
                                id: docSnap.id,
                                ...data,
                                username: userData.username,
                                fullName: userData.fullName,
                                profileDP: userData.dp
                            };
                        }
                    } catch (error) {
                        console.error("Error fetching user or checking follower:", error);
                    }

                    return null; // Agar condition match nahi hui ya koi error aaya
                })
            );


            // Valid posts list me add karna
            fetchedPosts.push(...postData.filter(Boolean));
        }

        // Final state update
        setPosts(fetchedPosts);
        setLastVisible(lastDoc);
        setHasMore(fetchedPosts.length >= 10 || tries >= maxTries);
        setIsLoading(false);
    };

    // Scroll hone par aur posts fetch karne ka function
    const fetchMorePosts = async () => {
        if (!lastVisible || isLoading) return;

        setIsLoading(true);

        const postsQuery = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(10)
        );

        const snapshot = await getDocs(postsQuery);
        if (snapshot.empty) {
            setHasMore(false);
            setIsLoading(false);
            return;
        }

        const postData = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();

                try {
                    const userDocRef = doc(db, "users", data.userId);
                    const userDoc = await getDoc(userDocRef);
                    const userData = userDoc.exists() ? userDoc.data() : {};

                    const { viewType, userId: postUserId } = data;

                    let shouldAdd = false;

                    if (activeTab === "foryou") {
                        // "foryou" tab me sirf public posts dikhni chahiye
                        shouldAdd = viewType === "EveryOne";
                    } else if (activeTab === "following") {
                        // "following" tab me real-time follower check karenge
                        if (["Followers", "FriendsOnly"].includes(viewType)) {
                            shouldAdd = await checkIfUserIsFollower(postUserId, currentUserId);
                        }
                    }

                    if (shouldAdd) {
                        return {
                            id: docSnap.id,
                            ...data,
                            username: userData.username,
                            fullName: userData.fullName,
                            profileDP: userData.dp
                        };
                    }
                } catch (error) {
                    console.error("Error fetching user or checking follower:", error);
                }

                return null; // Agar condition match nahi hui ya koi error aaya
            })
        );

        setPosts((prevPosts) => [...prevPosts, ...postData.filter(Boolean)]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === 10);
        setIsLoading(false);
    };

    // Last element ke reference ke liye intersection observer (infinite scroll)
    const lastPostRef = useCallback(
        (node) => {
            if (isLoading) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchMorePosts();
                }
            });

            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    return (
        <div className="space-y-4">

            {/* Jab koi post available na ho aur loading bhi na ho */}
            {posts.length === 0 && !isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                    No posts to show right now.
                </p>
            ) : (
                // Post list render karna
                posts.map((post, index) =>
                    index === posts.length - 1 ? (
                        <div ref={lastPostRef} key={post.id}>
                            <PostCard post={post} />
                        </div>
                    ) : (
                        <PostCard key={post.id} post={post} />
                    )
                )
            )}

            {/* Loader jab data fetch ho raha ho */}
            {isLoading && <Loader />}

            {/* Jab saara data load ho chuka ho */}
            {!hasMore && !isLoading && posts.length > 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    You’re all caught up!
                </p>
            )}
        </div>
    );
};

export default Feed;
