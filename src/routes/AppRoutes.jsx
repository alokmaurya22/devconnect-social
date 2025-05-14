import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import CreatePost from "../pages/CreatePost";
import Chats from "../pages/Chats";
import ProfilePage from "../pages/ProfilePage";
import UserProfilePage from "../pages/UserProfilePage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    const allowedRoutes = ["/login", "/signup", "/"]; // 👈 guest can access

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/user/:userId" element={<UserProfilePage />} />

            {/* Protected routes */}
            <Route path="/home" element={<ProtectedRoute element={<Home />} allowedRoutes={allowedRoutes} />} />
            <Route path="/createPost" element={<ProtectedRoute element={<CreatePost />} allowedRoutes={allowedRoutes} />} />
            <Route path="/chats" element={<ProtectedRoute element={<Chats />} allowedRoutes={allowedRoutes} />} />
            <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} allowedRoutes={allowedRoutes} />} />
        </Routes>
    );
};

export default AppRoutes;
