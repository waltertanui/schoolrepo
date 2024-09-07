// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Add this import
import { getStorage } from 'firebase/storage'; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyAfjyZtptJx7DBsnMkRBm9wYvqXmyAcvbQ",
  authDomain: "school-repo.firebaseapp.com",
  projectId: "school-repo",
  storageBucket: "school-repo.appspot.com",
  messagingSenderId: "645529835037",
  appId: "1:645529835037:web:b55f2ac03caf922f0d18f4",
  measurementId: "G-5EE4932Y2J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

export { auth, db, storage }; // Export auth, db, and storage
