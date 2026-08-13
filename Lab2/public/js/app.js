/**
 * app.js
 * -----------------------------------------------------------------------
 * Front-end logic for the CST Student Management System demo UI.
 * Handles tab navigation and talks to the Express API defined in
 * server.js / src/routes/*.js.
 * -----------------------------------------------------------------------
 */

// ---------- Icons used inside dynamically-rendered status messages ----------
const ICONS = {
  success:
    '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M4 12.5l5 5L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  error:
    '<svg class="icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  warning:
    '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M12 3.5 21.5 20h-19L12 3.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9.5v4.2M12 17h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

function renderStatus(el, type, message) {
  el.innerHTML = `<div class="status ${type}">${ICONS[type] || ''}<span>${message}</span></div>`;
}

// ---------- Tab navigation ----------
document.querySelectorAll('.nav-item[data-tab]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item[data-tab]').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  document.getElementById('sessionText').textContent = 'Not logged in';
  document.querySelector('.nav-item[data-tab="login"]').click();
});

// ---------- Login ----------
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = document.getElementById('loginStudentId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const resultEl = document.getElementById('loginResult');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, password }),
    });
    const data = await res.json();
    if (data.success) {
      renderStatus(resultEl, 'success', `Welcome, ${data.student.name} (${data.student.studentId}).`);
      document.getElementById('sessionText').textContent = `Logged in: ${data.student.studentId}`;
      ['regStudentId', 'payStudentId', 'resStudentId'].forEach((id) => {
        document.getElementById(id).value = studentId;
      });
    } else {
      renderStatus(resultEl, 'error', data.message);
    }
  } catch (err) {
    renderStatus(resultEl, 'error', 'Unable to reach the server. Please try again.');
  }
});

// ---------- Registration ----------
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = document.getElementById('regStudentId').value.trim();
  const moduleCode = document.getElementById('regModuleCode').value.trim();
  const resultEl = document.getElementById('registerResult');

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, moduleCode }),
    });
    const data = await res.json();
    renderStatus(resultEl, data.success ? 'success' : 'error', data.message);
  } catch (err) {
    renderStatus(resultEl, 'error', 'Unable to reach the server. Please try again.');
  }
});

// ---------- Payment ----------
document.getElementById('paymentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = document.getElementById('payStudentId').value.trim();
  const transactionNumber = document.getElementById('payTxn').value.trim();
  const fileInput = document.getElementById('payFile');
  const verifiedByCollege = document.getElementById('payVerified').checked;
  const resultEl = document.getElementById('paymentResult');

  const formData = new FormData();
  formData.append('studentId', studentId);
  formData.append('transactionNumber', transactionNumber);
  formData.append('verifiedByCollege', verifiedByCollege);
  if (fileInput.files[0]) formData.append('screenshot', fileInput.files[0]);

  try {
    const res = await fetch('/api/payment/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      renderStatus(resultEl, 'success', `${data.message} Receipt: ${data.receipt}`);
    } else if (res.status === 202) {
      renderStatus(resultEl, 'warning', data.message);
    } else {
      renderStatus(resultEl, 'error', data.message);
    }
  } catch (err) {
    renderStatus(resultEl, 'error', 'Unable to reach the server. Please try again.');
  }
});

// ---------- Results ----------
document.getElementById('resultsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = document.getElementById('resStudentId').value.trim();
  const resultEl = document.getElementById('resultsResult');
  const tableWrap = document.getElementById('resultsTableWrap');
  tableWrap.innerHTML = '';

  try {
    const res = await fetch(`/api/results/${studentId}`);
    const data = await res.json();
    if (data.success) {
      resultEl.innerHTML = '';
      const rows = data.results
        .map((r) => `<tr><td>${r.moduleCode}</td><td>${r.moduleTitle}</td><td>${r.grade}</td></tr>`)
        .join('');
      tableWrap.innerHTML = `
        <table class="results-table" id="printableResults">
          <thead><tr><th>Module Code</th><th>Module Title</th><th>Grade</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <button class="download-btn" id="downloadPdfBtn">
          <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Download as PDF
        </button>`;
      document.getElementById('downloadPdfBtn').addEventListener('click', () => window.print());
    } else {
      renderStatus(resultEl, 'error', data.message);
    }
  } catch (err) {
    renderStatus(resultEl, 'error', 'Unable to reach the server. Please try again.');
  }
});
