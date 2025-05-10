export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
        minutes: String(mins).padStart(2, '0'),
        seconds: String(secs).padStart(2, '0'),
    };
};