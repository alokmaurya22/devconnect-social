import React from "react";
import { db } from "../configuration/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const UploadDummyPosts = () => {
    const uploadDummyPosts = async () => {
        const postRef = collection(db, "posts");

        const dummyContents = [
            "Exploring new frameworks 👨‍💻",
            "Learning Firebase Firestore 📘",
            "Testing hooks with React 19",
            "UI redesign week! 🎨",
            "Debugging nightmares 😩",
            "Build once, deploy everywhere 🌍",
            "Next.js or Remix? 🤔",
            "Just discovered a memory leak 😶",
            "Weekend hackathon grind 🛠️",
            "Shipped my portfolio! 🚢",
            "Unit tests finally passed ✅",
            "Clean code feels so satisfying 🧼",
            "Working on animations now ✨",
            "Trying to fix merge conflicts 😭",
            "Pushed a fix at 3AM 😴",
            "GraphQL is pretty neat 🧬",
            "Handling auth states be like... 🔐",
            "Late-night coffee & commits ☕",
            "Built my own custom hooks!",
            "Deep diving into TailwindCSS",
            "Responsive layout done right 📱💻",
            "Dark/light mode toggle added!",
            "Finally deployed without bugs! 🐞",
            "Smooth scroll animation ftw 🎢",
            "Redux Toolkit makes life easier 🔧",
            "My first Firebase function!",
            "Got featured on Product Hunt 🎉",
            "Learning advanced JS concepts 🧠",
            "CSS grid masterclass 💡",
            "Code review time 👀"
        ];

        const imageUrls = [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCBQAq4fDkjizcfZGBW_6ir3gL4Kd8b_3fA&s",
            "https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?cs=srgb&dl=pexels-hsapir-1054655.jpg&fm=jpg",
            "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
            "https://thumbs.dreamstime.com/b/planet-earth-space-night-some-elements-image-furnished-nasa-52734504.jpg"
        ];

        const viewTypes = ["EveryOne", "OnlyMe", "Followers"];

        for (let i = 0; i < 30; i++) {
            const userId = `user_${Math.floor(1000 + Math.random() * 9000)}`;
            const userSno = `${Math.floor(1 + Math.random() * 100)}`;
            const postId = `${userId}_${Date.now()}_${i}`;
            const viewType = viewTypes[i % viewTypes.length];
            const includeImage = i % 5 !== 0; // every 5th post has no image
            const mediaURL = includeImage ? imageUrls[i % imageUrls.length] : "";
            const mediaType = includeImage ? "image" : "";

            const postData = {
                postUserId: postId,
                title: `title${i + 1}`,
                content: dummyContents[i % dummyContents.length],
                tag: `@tag${i + 1}`,
                viewType: viewType,
                mediaURL,
                mediaType,
                userId,
                userSno,
                createdAt: serverTimestamp(),
            };

            try {
                await addDoc(postRef, postData);
                console.log("Dummy post added:", postData);
            } catch (err) {
                console.error("Error adding post:", err);
            }
        }

        alert("30 Dummy posts uploaded successfully!");
    };

    return (
        <div className="text-center my-10">
            <button
                onClick={uploadDummyPosts}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow"
            >
                Upload 30 Dummy Posts
            </button>
        </div>
    );
};

export default UploadDummyPosts;
