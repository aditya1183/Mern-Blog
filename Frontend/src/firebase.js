// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e69d1.firebaseapp.com",
  projectId: "mern-blog-e69d1",
  storageBucket: "mern-blog-e69d1.appspot.com",
  messagingSenderId: "15048808162",
  appId: "1:15048808162:web:f6a760e5a7bbd52836b0bb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);