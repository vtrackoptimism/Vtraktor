// js/violations.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { sendViolationEmail } from "./email.js";

let selectedStudent = null;

/* =========================
   OPEN REPORT MODAL (PROMPT-BASED)
========================= */
document.addEventListener("click", e => {
  if (!e.target.classList.contains("btn-report")) return;

  selectedStudent = {
    id: e.target.dataset.id,
    name: e.target.dataset.name
  };

  const violationType = prompt(
    "Violation type (Late, Absent, Cutting Class, Improper Uniform, Others):"
  );
  if (!violationType) return;

  const reason = prompt("Enter reason for violation:");
  if (!reason) {
    alert("Reason is required.");
    return;
  }

  submitViolation(violationType, reason);
});

/* =========================
   SUBMIT VIOLATION
========================= */
async function submitViolation(violationType, reason) {
  try {
    // Save to Firestore
    await addDoc(collection(db, "ViolationRecords"), {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      violationType,
      specifiedViolation: violationType === "Others" ? violationType : "",
      reason,
      submittedBy: "SFO",
      timestamp: serverTimestamp()
    });

    // Fetch parent email
    let parentEmail = "";
    const q = query(
      collection(db, "students"),
      where("__name__", "==", selectedStudent.id)
    );
    const snap = await getDocs(q);
    snap.forEach(d => (parentEmail = d.data().parentEmail));

    // Send email
    await sendViolationEmail({
      to_email: parentEmail,
      student_name: selectedStudent.name,
      violation: violationType,
      reason,
      date_time: new Date().toLocaleString()
    });

    alert("Violation reported successfully.");
  } catch (err) {
    console.error(err);
    alert("Failed to report violation.");
  }
}
