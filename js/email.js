// js/email.js
// EmailJS configuration and helpers

// IMPORTANT: EmailJS library is loaded in index.html
// This file only initializes and wraps send functions

const EMAIL_SERVICE_ID = "service_kkvibpf";
const EMAIL_PUBLIC_KEY = "utJXfO7LmB68b_KCR";

// Template IDs
const TEMPLATE_ADD_STUDENT = "template_qp3weea";
const TEMPLATE_REPORT_VIOLATION = "template_zwfvq0d";

// Initialize EmailJS
(function () {
  if (!window.emailjs) {
    console.error("EmailJS library not loaded");
    return;
  }
  emailjs.init(EMAIL_PUBLIC_KEY);
})();

/**
 * Send email after adding a student
 */
export async function sendAddStudentEmail({
  to_email,
  student_name,
  password,
  schoolId,
  grade,
  section
}) {
  return emailjs.send(EMAIL_SERVICE_ID, TEMPLATE_ADD_STUDENT, {
    to_email,
    student_name,
    password,
    schoold_id: schoolId, // NOTE: template variable spelling
    grade,
    section
  });
}

/**
 * Send email after reporting a violation
 */
export async function sendViolationEmail({
  to_email,
  student_name,
  violation,
  reason,
  date_time
}) {
  return emailjs.send(EMAIL_SERVICE_ID, TEMPLATE_REPORT_VIOLATION, {
    to_email,
    student_name,
    violation,
    reason,
    date_time
  });
}
