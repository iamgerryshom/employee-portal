import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDFcDedgMYudHLrX6innzWDEgLxaLmiYzM",
  authDomain: "employee-website-230bb.firebaseapp.com",
  projectId: "employee-website-230bb",
  storageBucket: "employee-website-230bb.firebasestorage.app",
  messagingSenderId: "147967461501",
  appId: "1:147967461501:web:b9da902f0b04ba60248914",
  measurementId: "G-KVHXBW3MQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);

export default app;