import React from "react";
import { useGuestTimer } from "../context/GuestTimerContext";

const GuestTimerDisplay = () => {
    const { formattedTime, showTimer } = useGuestTimer();

    if (!showTimer) return null; // ✅ Agar showTimer false ho gaya to timer mat dikhao

    return (
        <div className="fixed bottom-4 border border-orange-500 bg-orange-100 dark:bg-black text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg shadow-md text-sm font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-800 animate-ping"></span>
            <span className="text-black dark:text-white">
                Guest access ends in 🕒 {formattedTime.minutes}:{formattedTime.seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
};
export default GuestTimerDisplay;