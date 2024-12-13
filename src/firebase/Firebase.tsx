// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoQ3WsL5V03GS5i9-0z0Ps5Bd5jUGGlOA",
  authDomain: "filmyverse-8581f.firebaseapp.com",
  projectId: "filmyverse-8581f",
  storageBucket: "filmyverse-8581f.appspot.com",
  messagingSenderId: "379641102556",
  appId: "1:379641102556:web:6839b51165e8578cd57419",
  measurementId: "G-ET2QX1TSSS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Firestore collections
export const moviesRef = collection(db, "movies");
export const reviewsRef = collection(db, "reviews");
export const usersRef = collection(db, "users");

export default app;
