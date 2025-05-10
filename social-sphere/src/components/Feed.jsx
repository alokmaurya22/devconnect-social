import React, { useEffect, useState, useRef, useCallback } from "react";
import PostCard from "./PostCard";
import { db } from "../configuration/firebaseConfig";
import { collection, getDocs, limit, orderBy, query, startAfter, getDoc, doc } from "firebase/firestore";

// Simple loader component jab data load ho raha ho
const Loader = () => (
    <div className="flex justify-center py-6">
        <div className="w-5 h-5 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const Feed = ({ activeTab }) => {
    const [posts, setPosts] = useState([]); // post list ka state
    const [lastVisible, setLastVisible] = useState(null); // last document for pagination
    const [hasMore, setHasMore] = useState(true); // check karega ki aur posts available hain ya nahi
    const [isLoading, setIsLoading] = useState(false); // loading indicator ke liye
    const currentUserId = sessionStorage.getItem("userID"); // current logged-in user ka ID

    // jab bhi tab change ho (foryou ya following), posts reset karo
    useEffect(() => {
        setPosts([]);
        setLastVisible(null);
        setHasMore(true);
        fetchInitialPosts(); // naye tab ke hisaab se data fetch karo
    }, [activeTab]);

    // Initial post load karne ka function
    const fetchInitialPosts = async () => {
        setIsLoading(true);
        const fetchedPosts = [];
        let lastDoc = null;
        const maxTries = activeTab === "foryou" ? 1 : 5; // following tab me zyada try karega
        let tries = 0;

        // 10 posts tak data fetch karne ki koshish karta hai
        while (fetchedPosts.length < 10 && tries < maxTries) {
            const q = lastDoc
                ? query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(10))
                : query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10));

            const snapshot = await getDocs(q);
            if (snapshot.empty) break;

            lastDoc = snapshot.docs[snapshot.docs.length - 1];
            tries++;

            // Har post ke user ka data parallel fetch karo
            const postData = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                try {
                    const userDocRef = doc(db, "users", data.userId);
                    const userDoc = await getDoc(userDocRef);
                    const userData = userDoc.exists() ? userDoc.data() : {};

                    // Tab ke hisaab se filter lagana
                    const shouldAdd =
                        activeTab === "foryou"
                            ? data.viewType === "EveryOne" // har user ke liye visible
                            : data.viewType === "Followers" &&
                            Array.isArray(userData.followers) &&
                            userData.followers.includes(currentUserId); // sirf followers ke liye

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
                    console.error("Error fetching user:", error);
                }
                return null; // agar user nahi mila ya kuch error aaya to skip karo
            }));

            fetchedPosts.push(...postData.filter(Boolean)); // valid posts add karo
        }

        // Final state update
        setPosts(fetchedPosts);
        setLastVisible(lastDoc);
        setHasMore(fetchedPosts.length >= 10 || tries >= maxTries); // agar aur data ho to load hone do
        setIsLoading(false);
    };

    // Scroll ke time pe aur data fetch karne ka function
    const fetchMorePosts = async () => {
        if (!lastVisible || isLoading) return;
        setIsLoading(true);

        const q = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(10)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            setHasMore(false); // agar data khatam ho gaya
            setIsLoading(false);
            return;
        }

        const postData = await Promise.all(snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            try {
                const userDoc = await getDoc(doc(db, "users", data.userId));
                const userData = userDoc.exists() ? userDoc.data() : {};

                const shouldAdd =
                    activeTab === "foryou"
                        ? data.viewType === "EveryOne"
                        : data.viewType === "Followers" &&
                        Array.isArray(userData.followers) &&
                        userData.followers.includes(currentUserId);

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
                console.error("User fetch error:", error);
            }
            return null;
        }));

        setPosts((prev) => [...prev, ...postData.filter(Boolean)]); // pehle wale posts ke sath naye jod do
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === 10); // agar 10 se kam aaye, to aur nahi hai
        setIsLoading(false);
    };

    // Intersection Observer for infinite scroll
    const observer = useRef();
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
            {/* Agar koi post nahi hai aur loading nahi ho rahi */}
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

            {/* Loader jab data load ho raha ho */}
            {isLoading && <Loader />}

            {/* Jab saara data aa gaya ho */}
            {!hasMore && !isLoading && posts.length > 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    You’re all caught up! 🎉
                </p>
            )}
        </div>
    );
};

export default Feed;
