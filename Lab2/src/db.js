/**
 * db.js
 * -----------------------------------------------------------------------
 * A simple IN-MEMORY data store used in place of a real database so the
 * whole application (and its automated tests) can run without any
 * external setup. Data resets every time the server restarts.
 *
 * Seeded with one demo student so the marker can log in immediately:
 *   Student ID: 02240365
 *   Password:   Passw0rd
 * -----------------------------------------------------------------------
 */

const students = {
  '02240365': {
    studentId: '02240365',
    password: 'Passw0rd', // NOTE: plain text for demo purposes only, not for production use
    name: 'Demo Student',
    tuitionPaid: false,
    drugTestVerified: true,
    registrationPeriodOpen: true,
    registeredModules: ['SWE301'],
    paymentReceipt: null,
    results: [
      { moduleCode: 'SWE301', moduleTitle: 'Requirements Engineering', grade: 'A' },
      { moduleCode: 'SWE302', moduleTitle: 'Software Testing & QA', grade: 'B+' },
    ],
  },
};

function findStudent(studentId) {
  return students[studentId] || null;
}

function resetDatabase() {
  // Restores the demo student to a known state. Used between test runs.
  students['02240365'] = {
    studentId: '02240365',
    password: 'Passw0rd',
    name: 'Demo Student',
    tuitionPaid: false,
    drugTestVerified: true,
    registrationPeriodOpen: true,
    registeredModules: ['SWE301'],
    paymentReceipt: null,
    results: [
      { moduleCode: 'SWE301', moduleTitle: 'Requirements Engineering', grade: 'A' },
      { moduleCode: 'SWE302', moduleTitle: 'Software Testing & QA', grade: 'B+' },
    ],
  };
}

module.exports = { students, findStudent, resetDatabase };
