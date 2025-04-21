// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCZdHf6p-wy_Sk37VDaol1gB-cJuK05YfQ",
    authDomain: "ggmart-74e1e.firebaseapp.com",
    projectId: "ggmart-74e1e",
    storageBucket: "ggmart-74e1e.firebasestorage.app",
    messagingSenderId: "157100442834",
    appId: "1:157100442834:web:fa64169441c8bd52fc590b",
    measurementId: "G-8ZQN9L3V1S"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, analytics, db, firebaseConfig };
