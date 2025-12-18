// js/analytics.js
// Simple analytics helpers for violation data

import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/**
 * Get violation counts grouped by type
 * Example output:
 * { Late: 5, Absent: 3 }
 */
export async function getViolationCountsByType() {
  const snap = await getDocs(collection(db, "ViolationRecords"));
  const counts = {};

  snap.forEach(doc => {
    const v = doc.data();
    const type = v.violationType || "Unknown";
    counts[type] = (counts[type] || 0) + 1;
  });

  return counts;
}
