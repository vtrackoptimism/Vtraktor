// js/ui.js
import { loadSections } from "./students.js";
import { exportStudentsToExcel, exportViolationsToPDF } from "./export.js";
import { getViolationCountsByType } from "./analytics.js";

/* =========================
   SECTION SWITCHER
========================= */
export function showSection(sectionId) {
  document.querySelectorAll("section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(sectionId)?.classList.add("active");
}

/* =========================
   SPLASH SCREEN
========================= */
window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = document.getElementById("splashScreen");
    if (splash) splash.style.display = "none";
  }, 2000);
});

/* =========================
   START BUTTON
========================= */
document.getElementById("startBtn")?.addEventListener("click", () => {
  showSection("loginScreen");
});

/* =========================
   LOAD SECTIONS AFTER LOGIN
========================= */
document.addEventListener("DOMContentLoaded", () => {
  // When dashboard becomes visible, load sections
  const observer = new MutationObserver(() => {
    const dashboard = document.getElementById("sfoDashboard");
    if (dashboard.classList.contains("active")) {
      loadSections();
    }
  });

  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"]
  });
});

/* =========================
   BACK TO SECTIONS
========================= */
document.getElementById("backToSectionsBtn")?.addEventListener("click", () => {
  showSection("sfoDashboard");
});

/* =========================
   EXPORT SHORTCUTS (BASIC)
========================= */
// These can later be wired to buttons in the UI
window.exportViolationsPDF = exportViolationsToPDF;

/* =========================
   ANALYTICS (CONSOLE DEMO)
========================= */
window.showAnalytics = async () => {
  const counts = await getViolationCountsByType();
  console.log("Violation Analytics:", counts);
  alert("Analytics loaded. Check console.");
};
