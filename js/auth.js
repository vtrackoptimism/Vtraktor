// js/auth.js
import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { showSection } from "./ui.js";

// Login (SFO only)
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Check role
    const q = query(collection(db, "admin"), where("email", "==", email));
    const snap = await getDocs(q);

    if (snap.empty || snap.docs[0].data().role !== "sfo") {
      await signOut(auth);
      alert("Only SFO accounts are allowed.");
      return;
    }

    // Success
    showSection("sfoDashboard");
  } catch (err) {
    console.error(err);
    alert("Login failed.");
  }
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  showSection("loginScreen");
});

// Forgot password
document.getElementById("forgotPasswordBtn")?.addEventListener("click", async () => {
  const email = prompt("Enter your email for password reset:");
  if (!email) return;

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent.");
  } catch (err) {
    console.error(err);
    alert("Failed to send reset email.");
  }
});
