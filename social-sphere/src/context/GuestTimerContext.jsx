import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoginModal from "../pages/LoginModal";

const GuestTimerContext = createContext();

export const GuestTimerProvider = ({ children }) => {
    const location = useLocation();

    const guestTimerDuration = 300; // guest timer duration
    const [secondsLeft, setSecondsLeft] = useState(guestTimerDuration);
    // Initialize isAuthenticated based on sessionStorage
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!sessionStorage.getItem("userID");
    });
    const [showTimer, setShowTimer] = useState(true);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [userId, setUserId] = useState(null);

    const isAuthPage = ["/login", "/signup"].includes(location.pathname);

    const [timerActive, setTimerActive] = useState(true);

    // On mount, check sessionStorage for userID to persist login across refreshes
    useEffect(() => {
        const userID = sessionStorage.getItem("userID");
        if (userID) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    //  Pause timer on /login and /signup
    useEffect(() => {
        if (isAuthPage || isAuthenticated || !showTimer) {
            setTimerActive(false);
        } else {
            setTimerActive(true);
        }
    }, [location.pathname, isAuthenticated, showTimer]);

    // Countdown logic
    useEffect(() => {
        if (!timerActive) return;

        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowLoginPopup(true);
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
