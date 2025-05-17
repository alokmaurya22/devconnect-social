import React from "react";
import { useGuestTimer } from "../context/GuestTimerContext";

const GuestTimerDisplay = () => {
    const { formattedTime, showTimer } = useGuestTimer();

    if (!showTimer) return null; // ✅ Agar showTimer false ho gaya to timer mat dikhao

    return (
        <div className="flex items-center bg-orange-100 dark:bg-black text-orange-600 dark:text-orange-400 rounded-full px-4 py-2 shadow-md border border-orange-500 focus-within:ring-2 focus-within:ring-orange-500 text-sm font-semibold gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-black dark:text-white">
                Guest access ends in <span className="text-red-600 dark:text-white">🕒 {formattedTime.minutes}:{formattedTime.seconds.toString().padStart(2, "0")}</span>
            </span>
        </div>
    );
};
export default GuestTimerDisplay;