import React from "react";
import PostCard from "./PostCard";

const Feed = ({ activeTab }) => {
    const allPosts = [
        {
            id: 1,
            username: "alok_dev",
            time: "2h ago",
            content: "Learning React with Tailwind CSS is super fun! 🚀 #DevConnect",
            image: "https://plus.unsplash.com/premium_photo-1738597344297-9eae6f6ebac3?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            type: "all"
        },
        {
            id: 2,
            username: "open_source_hero",
            time: "30m ago",
            content: "Just contributed to an open-source project! 🎉",
            image: "",
            type: "all"
        },
        {
            id: 3,
            username: "priya_codes",
            time: "15m ago",
            content: "Just launched my portfolio! 🔥",
            image: "",
            type: "followed"
        },
        {
            id: 4,
            username: "alok_devloper",
            time: "2h ago",
            content: "Learning React with Tailwind CSS is super fun! 🚀 #DevConnect",
            image: "",
            type: "all "
        },
        {
            id: 5,
            username: "open_source_hero",
            time: "30m ago",
            content: "Just contributed to an open-source project! 🎉",
            image: "",
            type: "all"
        },
        {
            id: 21,
            username: "priya_codes",
            time: "15m ago",
            content: "Just launched my portfolio! 🔥",
            image: "",
            type: "all"
        },
        {
            id: 22,
            username: "alok_dev",
            time: "2h ago",
            content: "Learning React with Tailwind CSS is super fun! 🚀 #DevConnect",
            image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
            type: "all"
        },
        {
            id: 23,
            username: "open_source_hero",
            time: "30m ago",
            content: "Just contributed to an open-source project! 🎉",
            image: "",
            type: "all"
        },
        {
            id: 24,
            username: "priya_codes",
            time: "15m ago",
            content: "Just launched my portfolio! 🔥",
            image: "",
            type: "followed"
        }
    ];


    const filteredPosts = allPosts.filter((post) =>
        activeTab === "foryou" ? post.type === "all" || post.type === "followed" : post.type === "followed"
    );


    return (
        <div className="space-y-4">
            {filteredPosts.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                    No posts to show right now.
                </p>
            ) : (

                filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
        </div>
    );
};

export default Feed;
