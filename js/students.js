// js/students.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { sendAddStudentEmail } from "./email.js";
import { showSection } from "./ui.js";

const sectionsContainer = document.getElementById("sectionsContainer");
const studentTable = document.getElementById("studentTable");
const studentListTitle = document.getElementById("studentListTitle");

let currentGrade = "";
let currentSection = "";

/* =========================
   LOAD SECTIONS
========================= */
export async function loadSections() {
  sectionsContainer.innerHTML = "";

  const snap = await getDocs(collection(db, "students"));
  const map = {};

  snap.forEach(docu => {
    const s = docu.data();
    if (!map[s.grade]) map[s.grade] = new Set();
    map[s.grade].add(s.section);
  });

  Object.keys(map).forEach(grade => {
    map[grade].forEach(section => {
      const card = document.createElement("div");
      card.className = "section-card";
      card.textContent = `Grade ${grade} - ${section}`;
      card.onclick = () => showStudents(grade, section);
      sectionsContainer.appendChild(card);
    });
  });
}

/* =========================
   SHOW STUDENTS
========================= */
async function showStudents(grade, section) {
  currentGrade = grade;
  currentSection = section;

  studentListTitle.textContent = `Grade ${grade} - Section ${section}`;
  studentTable.innerHTML = "";

  const q = query(
    collection(db, "students"),
    where("grade", "==", grade),
    where("section", "==", section)
  );

  const snap = await getDocs(q);

  snap.forEach(docu => {
    const s = docu.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${s.fullname}</td>
      <td>${s.grade}</td>
      <td>${s.section}</td>
      <td>${s.parentEmail}</td>
      <td>
        <button class="action-btn btn-report" data-id="${docu.id}" data-name="${s.fullname}">Report</button>
        <button class="action-btn btn-remove" data-id="${docu.id}">Remove</button>
      </td>
    `;
    studentTable.appendChild(tr);
  });

  showSection("studentListScreen");
}

/* =========================
   ADD STUDENT
========================= */
document.getElementById("addStudentBtn")?.addEventListener("click", async () => {
  const fullname = prompt("Student full name:");
  const grade = prompt("Grade:");
  const section = prompt("Section:");
  const parentEmail = prompt("Parent email:");
  const password = prompt("Student password:");
  const schoolId = prompt("School ID:");

  if (!fullname || !grade || !section || !parentEmail || !password || !schoolId) {
    alert("All fields are required.");
    return;
  }

  await addDoc(collection(db, "students"), {
    fullname,
    grade,
    section,
    parentEmail,
    password,
    schoolId,
    createdAt: serverTimestamp()
  });

  // Send email
  try {
    await sendAddStudentEmail({
      to_email: parentEmail,
      student_name: fullname,
      password,
      schoolId,
      grade,
      section
    });
  } catch (e) {
    console.error("Email error:", e);
  }

  alert("Student added successfully.");
  loadSections();
});

/* =========================
   REMOVE STUDENT
========================= */
document.addEventListener("click", async e => {
  if (!e.target.classList.contains("btn-remove")) return;

  if (!confirm("Remove this student?")) return;

  const id = e.target.dataset.id;
  await deleteDoc(doc(db, "students", id));

  alert("Student removed.");
  loadSections();
});
              
