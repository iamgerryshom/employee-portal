import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDlYL7qbZsesWIZZmmWS4RF2bxMvO6JhAw",
  authDomain: "employee-a64ce.firebaseapp.com",
  projectId: "employee-a64ce",
  storageBucket: "employee-a64ce.firebasestorage.app",
  messagingSenderId: "528114808303",
  appId: "1:528114808303:web:0f921ad84e1c27cc0ab21a",
  measurementId: "G-DYQJ1LGCDF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);

export default app;