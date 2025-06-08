// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqu-Fxt2WaZJeAfG-Uji9CJT8I3sdgj5Q",
  authDomain: "refueling-management.firebaseapp.com",
  databaseURL: "https://refueling-management-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "refueling-management",
  storageBucket: "refueling-management.firebasestorage.app",
  messagingSenderId: "85863531237",
  appId: "1:85863531237:web:5867d51b24047b892f8a0c",
  measurementId: "G-BHTWFLPVLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);