// src/configuration/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// 👇 Ye config tumhare actual credentials se bharo
const firebaseConfig = {
    apiKey: "AIzaSyBUJ7KM727W3qbBufPURCnWU9exmIyYwt8",
    authDomain: "devconnect-22.firebaseapp.com",
    projectId: "devconnect-22",
    storageBucket: "devconnect-22.firebasestorage.app",
    messagingSenderId: "391371377096",
    appId: "1:391371377096:web:6d0399c4a54b7c5e0b98fd",
    measurementId: "G-D2KD57NHM1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export required services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);
export { auth, db, storage, analytics };
