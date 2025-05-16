import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoginModal from "../pages/LoginModal";

const GuestTimerContext = createContext();

export const GuestTimerProvider = ({ children }) => {
    const location = useLocation();

    const guestTimerDuration = 300; // ⏱️ Customize timer duration
    const [secondsLeft, setSecondsLeft] = useState(guestTimerDuration);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showTimer, setShowTimer] = useState(true);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [userId, setUserId] = useState(null);

    const isAuthPage = ["/login", "/signup"].includes(location.pathname);

    const [timerActive, setTimerActive] = useState(true);

    // ⏸️ Pause timer on /login and /signup
    useEffect(() => {
        if (isAuthPage || isAuthenticated || !showTimer) {
            setTimerActive(false);
        } else {
            setTimerActive(true);
        }
    }, [location.pathname, isAuthenticated, showTimer]);

    // ⏱️ Countdown logic
    useEffect(() => {
        if (!timerActive) return;

        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowLoginPopup(true); // 💥 Timer ends => show modal
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timerActive]);

    //  Called on login form submit
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setShowTimer(false);
        setUserId("guest_" + Math.floor(Math.random() * 100000)); // Temporary random ID
        setShowLoginPopup(false);
    };

    // Reusable trigger
    const openLoginModal = () => setShowLoginPopup(true);
    const closeLoginModal = () => setShowLoginPopup(false);

    const formattedTime = {
        minutes: Math.floor(secondsLeft / 60).toString().padStart(2, "0"),
        seconds: (secondsLeft % 60).toString().padStart(2, "0"),
    };

    return (
        <GuestTimerContext.Provider
            value={{
                secondsLeft,
                formattedTime,
                showLoginPopup,
                openLoginModal,
                closeLoginModal,
                isAuthenticated,
                showTimer,
                setIsAuthenticated,
                setShowTimer,
                userId,
                handleLoginSuccess,
            }}
        >
            <>
                {children}
                <LoginModal isOpen={showLoginPopup} onClose={closeLoginModal} onLoginSuccess={handleLoginSuccess} />
            </>
        </GuestTimerContext.Provider>
    );
};

export const useGuestTimer = () => useContext(GuestTimerContext);
