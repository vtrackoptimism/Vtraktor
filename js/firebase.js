import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQ0q0erzbfcjTUpZoN1pEtyUJwJk66UDA",
  authDomain: "v-track-12d75.firebaseapp.com",
  projectId: "v-track-12d75",
  storageBucket: "v-track-12d75.firebasestorage.app",
  messagingSenderId: "405616823986",
  appId: "1:405616823986:web:54b3f431e46537d1a783ab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
