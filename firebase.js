
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAsgIg0KS6mhpTw2Hk_N5k7oi4JFcHIFdw",
    authDomain: "mern-blog-f8fef.firebaseapp.com",
    projectId: "mern-blog-f8fef",
    storageBucket: "mern-blog-f8fef.firebasestorage.app",
    messagingSenderId: "163508322710",
    appId: "1:163508322710:web:a5e2110ce526ae3a2d5db7"
  };

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
