import React, { useEffect, useState } from "react";
import RightSidebar from "../components/homePageComponents/RightSidebar";
import LeftSidebar from "../components/homePageComponents/LeftSidebar";
import MainFeed from "../components/homePageComponents/MainFeed";
import CreatePostModel from "./CreatePostModel";
import { useGuestTimer } from "../context/GuestTimerContext";

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const { setShowTimer, isAuthenticated } = useGuestTimer();

    useEffect(() => {
        if (!isAuthenticated) {
            setShowTimer(true);
        } else {
            setShowTimer(false);
        }
    }, [isAuthenticated]);

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300"></div>
            )}

            <div className="pt-16 px-4 md:px-8 flex gap-4">
                <LeftSidebar onPostClick={() => setShowModal(true)} />
                <MainFeed onPostClick={() => setShowModal(true)} />
                <RightSidebar onPostClick={() => setShowModal(true)} />
            </div>

            {showModal && <CreatePostModel onClose={() => setShowModal(false)} />}
        </>
    );
};

export default Home;
