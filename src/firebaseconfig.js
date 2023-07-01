// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyAO7MKLt5BvDl0kXjsNSOjcqpcB0M7lBTY",
  authDomain: "media-1a9bc.firebaseapp.com",
  projectId: "media-1a9bc",
  storageBucket: "media-1a9bc.appspot.com",
  messagingSenderId: "1014130588893",
  appId: "1:1014130588893:web:a1323433f7d3f947e36f34",
  measurementId: "G-9TQ6T941DC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage ,app};