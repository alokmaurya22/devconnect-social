// AuthenticationFunction.jsx
export const generateUserID = () => {
    // 👇 Random number ID generator (just for now)
    return Math.floor(Math.random() * 1000000).toString();
};

export const logUserData = (data) => {
    // 👇 Just console for now, later API hit yahi se hoga
    console.log("📦 Sending user data to backend:", data);
};
