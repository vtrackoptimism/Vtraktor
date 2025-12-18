// js/export.js
// Handles PDF & Excel exports

import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* =========================
   EXPORT STUDENTS TO EXCEL
========================= */
export async function exportStudentsToExcel(grade, section) {
  const q = query(
    collection(db, "students"),
    where("grade", "==", grade),
    where("section", "==", section)
  );

  const snap = await getDocs(q);
  const data = [];

  snap.forEach(doc => {
    const s = doc.data();
    data.push({
      Name: s.fullname,
      Grade: s.grade,
      Section: s.section,
      ParentEmail: s.parentEmail,
      SchoolID: s.schoolId
    });
  });

  if (data.length === 0) {
    alert("No students to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  XLSX.writeFile(
    workbook,
    `Students_Grade${grade}_${section}.xlsx`
  );
}

/* =========================
   EXPORT VIOLATIONS TO PDF
========================= */
export async function exportViolationsToPDF() {
  const snap = await getDocs(collection(db, "ViolationRecords"));
  const rows = [];

  snap.forEach(doc => {
    const v = doc.data();
    rows.push([
      v.studentName,
      v.violationType,
      v.reason,
      v.section,
      v.grade,
      v.submittedBy,
      v.timestamp?.toDate().toLocaleString() || ""
    ]);
  });

  if (rows.length === 0) {
    alert("No violations to export.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.text("Violation Records", 14, 15);

  pdf.autoTable({
    startY: 20,
    head: [[
      "Student",
      "Violation",
      "Reason",
      "Section",
      "Grade",
      "Reported By",
      "Date"
    ]],
    body: rows
  });

  pdf.save("Violation_Records.pdf");
}
