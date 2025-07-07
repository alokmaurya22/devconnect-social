import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../configuration/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";



// Helper function to generate a unique username based on fullName and timestamp
const generateUsername = (fullName) => {
    const trimmedName = fullName.trim().replace(/\s+/g, '_').toLowerCase(); // Remove spaces and replace with underscores
    const timestamp = new Date().getTime(); // Use current timestamp
    return `${trimmedName}${timestamp}`;
};

//  Get next user serial number (userSno)
const getNextUserSno = async () => {
    const counterRef = doc(db, "counters", "users");
    const counterSnap = await getDoc(counterRef);

    if (!counterSnap.exists()) {
        await setDoc(counterRef, { count: 1 });
        return 1;
    } else {
        const currentCount = counterSnap.data().count;
        await updateDoc(counterRef, { count: increment(1) });
        return currentCount + 1;
    }
};

//  Signup Function
export const signUpUser = async ({ fullName, email, password }, onSuccess, onError) => {
    try {
        // Step 1: Create user with email and password using Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const uid = user.uid; // Firebase generates the user ID here

        // Step 2: Generate the username and timestamp
        const username = generateUsername(fullName);
        const createdAt = serverTimestamp(); // Firebase server timestamp for creation

        // Step 3: Prepare user data with all fields initialized
        const userData = {
            fullName,
            email,
            password,
            uid,
            username,
            dob: "",
            createdAt,
            followers: [],
            followings: [],
            dp: "",
            bio: "",
            interests: "",
            location: "",
            website: "",
        };

        // Step 4: Add the user to Firestore
        await setDoc(doc(db, 'users', uid), userData);

        // Step 5: Store user ID in sessionStorage
        sessionStorage.setItem("userID", uid);

        //console.log(" Signup Successful!");
        //console.log("UserID:", uid);
        //console.log("UserID from sessionStorage:", sessionStorage.getItem("userID"));
        //console.log("Username:", username);
        //console.log("Full Name:", fullName);

        // Trigger success callback
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error("Signup Error:", error);
        // Trigger error callback
        if (onError) onError(error.message);
    }
};

//  Login Function
export const loginUser = async ({ email, password }, onSuccess, onError) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        const userDoc = await getDoc(doc(db, "users", uid));

        if (!userDoc.exists()) throw new Error("User data not found in database");

        const userData = userDoc.data();
        const userSno = userData.userSno;

        //  Store in sessionStorage
        sessionStorage.setItem("userID", uid);
        sessionStorage.setItem("userSno", userSno);

        //console.log(" Login Successful!");
        //console.log("UserID:", uid);
        //console.log("User Serial No:", userSno);

        if (onSuccess) onSuccess();
    } catch (error) {
        console.error("Login Error:", error);
        if (onError) onError(error.message);
    }
};

//  Logout Function
export const logoutUser = async (navigate, setIsAuthenticated, setShowTimer) => {
    try {
        // Step 1: Firebase se logout
        await signOut(auth);

        // Step 2: Session clear karo
        sessionStorage.removeItem("userID");
        sessionStorage.removeItem("userSno");

        // Step 3: Guest mode activate karo
        setIsAuthenticated(false);
        setShowTimer(true);
        navigate("/");
        //console.log("🚪 Successfully logged out!!!!!!!");
    } catch (error) {
        console.error("Logout Error:", error.message);
    }
};

// Google Login/Signup Function
export const loginWithGoogle = async (onSuccess, onError) => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const uid = user.uid;
        const email = user.email;
        const fullName = user.displayName || "";
        const dp = user.photoURL || "";

        // Check if user exists in Firestore
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        let userSno;
        if (!userDoc.exists()) {
            // New user: create Firestore user doc (similar to signUpUser)
            const username = generateUsername(fullName || email.split("@")[0]);
            const createdAt = serverTimestamp();
            // Get next serial number
            userSno = await getNextUserSno();
            const userData = {
                fullName,
                email,
                password: "", // Not set for Google users
                uid,
                username,
                dob: "",
                createdAt,
                followers: [],
                followings: [],
                dp,
                bio: "",
                interests: "",
                location: "",
                website: "",
                userSno,
            };
            await setDoc(userDocRef, userData);
        } else {
            // Existing user: get serial number
            const userData = userDoc.data();
            userSno = userData.userSno;
        }
        // Store in sessionStorage
        sessionStorage.setItem("userID", uid);
        if (userSno) sessionStorage.setItem("userSno", userSno);
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error("Google Auth Error:", error);
        if (onError) onError(error.message);
    }
};