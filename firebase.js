import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCQzpFFBZ33XJ4HDQ-qhUGRpdnsyltqPw0",
  authDomain: "employee-1f790.firebaseapp.com",
  projectId: "employee-1f790",
  storageBucket: "employee-1f790.firebasestorage.app",
  messagingSenderId: "130139124859",
  appId: "1:130139124859:web:555f6811e8fa740386dede",
  measurementId: "G-NR0T0NQKYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);

export default app;