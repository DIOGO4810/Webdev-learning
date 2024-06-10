// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhYgkcG0B5pV4wIAeboWAjqPLn9SazKjY",
  authDomain: "photovault-13b6a.firebaseapp.com",
  projectId: "photovault-13b6a",
  storageBucket: "photovault-13b6a.appspot.com",
  messagingSenderId: "995120335448",
  appId: "1:995120335448:web:774575c4da48b12bb3982d",
  measurementId: "G-4ZQDQJ2DM1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and export it
const storage = getStorage(app);

export { storage };
