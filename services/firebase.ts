import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBy5kF8dA4MDc8XZr3WdKFXa0g7XpRURFA",
    authDomain: "mbtitarot-1f63b.firebaseapp.com",
    databaseURL: "https://mbtitarot-1f63b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mbtitarot-1f63b",
    initialCrystals: "mbtitarot-1f63b.firebasestorage.app",
    messagingSenderId: "1099080724946",
    appId: "1:1099080724946:web:76ca5a1543a7767664d80b",
    measurementId: "G-RHGM9WJC4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
