// src/configuration/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// 👇 Ye config tumhare actual credentials se bharo
const firebaseConfig = {
    apikey:"",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId:""
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
