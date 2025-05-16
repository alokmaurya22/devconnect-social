import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGuestTimer } from "../context/GuestTimerContext";

const ProtectedRoute = ({ element, allowedRoutes = [] }) => {
    const { isAuthenticated, openLoginModal } = useGuestTimer();
    const location = useLocation();
    const currentPath = location.pathname;
    const [showElement, setShowElement] = useState(false);

    useEffect(() => {
        if (allowedRoutes.includes(currentPath)) {
            setShowElement(true); // ✅ Always allow public routes
        } else if (!isAuthenticated) {
            openLoginModal();     // ✅ Now safe to call
            setShowElement(false);
        } else {
            setShowElement(true); // ✅ Authenticated
        }
    }, [isAuthenticated, currentPath, openLoginModal, allowedRoutes]);

    if (!showElement) return null;

    return element;
};

export default ProtectedRoute;
