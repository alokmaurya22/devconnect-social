import React, { useEffect, useState } from "react";
import RightSidebar from "../components/homePageComponents/RightSidebar";
import LeftSidebarDesign from "../components/homePageComponents/LeftSidebarDesign";
import MainFeed from "../components/homePageComponents/MainFeed";
import CreatePostModel from "./CreatePostModel";
import { useGuestTimer } from "../context/GuestTimerContext";

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const { setShowTimer, isAuthenticated } = useGuestTimer();

    useEffect(() => {
        setShowTimer(!isAuthenticated);
    }, [isAuthenticated]);

    return (
        <>
            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300"></div>
            )}

            {/*  Mobile View (MainFeed only) */}
            <div className="block md:hidden pt-14 ">
                <MainFeed onPostClick={() => setShowModal(true)} />
            </div>

            {/*  Desktop View (3-column layout) */}
            <div className="hidden md:flex pt-16 px-8 gap-4 w-full">
                <LeftSidebarDesign onPostClick={() => setShowModal(true)} />
                <MainFeed onPostClick={() => setShowModal(true)} />
                <RightSidebar onPostClick={() => setShowModal(true)} />
            </div>
            {showModal && <CreatePostModel onClose={() => setShowModal(false)} />}
        </>
    );
};
export default Home;
