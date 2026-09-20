import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCiKTUD_i8urxqGh4ODHlc1szU4YZ8h9IQ",
  authDomain: "employee-43fe8.firebaseapp.com",
  projectId: "employee-43fe8",
  storageBucket: "employee-43fe8.firebasestorage.app",
  messagingSenderId: "95965693056",
  appId: "1:95965693056:web:041aa3949544f6c15a1265",
  measurementId: "G-EYB7QYSPL4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);

export default app;