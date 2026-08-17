// Bank NumberShield - Core System Engine v3.0

document.addEventListener('DOMContentLoaded', () => {
  initPortalSwitcher();
  initSIMRecyclingFeed();
  initCustomerRecoveryPortal();
  initCountdownTimer();
});

// -------------------------------------------------------------
// 1. PORTAL VIEW SWITCHER (Employee vs Customer)
// -------------------------------------------------------------
function initPortalSwitcher() {
  const viewEmployeeBtn = document.getElementById('view-employee-btn');
  const viewCustomerBtn = document.getElementById('view-customer-btn');
  const employeeView = document.getElementById('employee-portal-view');
  const customerView = document.getElementById('customer-portal-view');

  if (!viewEmployeeBtn || !viewCustomerBtn) return;

  viewEmployeeBtn.addEventListener('click', () => {
    viewEmployeeBtn.classList.add('active');
    viewCustomerBtn.classList.remove('active');
    employeeView.classList.add('active');
    customerView.classList.remove('active');
  });

  viewCustomerBtn.addEventListener('click', () => {
    viewCustomerBtn.classList.add('active');
    viewEmployeeBtn.classList.remove('active');
    customerView.classList.add('active');
    employeeView.classList.remove('active');
  });
}

// -------------------------------------------------------------
// 2. SIM RECYCLING FEED & EMPLOYEE OPERATIONS DASHBOARD
// -------------------------------------------------------------
let simEventsList = [
  {
    id: 'SIM-99201',
    time: '16:42:10',
    oldNum: '+91 98765-43210',
    custName: 'Rajesh Kumar (Acc: 49201829)',
    altNum: '+91 91234-56789',
    slaTime: '38 mins (Met)',
    controls: 'UPI/OTP Blocked • Restricted',
    status: 'COMPLETED'
  },
  {
    id: 'SIM-99202',
    time: '16:50:04',
    oldNum: '+91 98111-22334',
    custName: 'Priya Sharma (Acc: 88120019)',
    altNum: '+91 99887-76655',
    slaTime: '12 mins (Active)',
    controls: 'OTP Revoked • Tracking Mode',
    status: 'IN_PROGRESS'
  }
];

function initSIMRecyclingFeed() {
  const feedTableBody = document.getElementById('sim-feed-table-body');
  const triggerBtn = document.getElementById('trigger-sim-event-btn');
  const statSimEvents = document.getElementById('stat-sim-events');

  function renderFeed() {
    if (!feedTableBody) return;
    feedTableBody.innerHTML = '';

    simEventsList.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.time}</td>
        <td><strong>${item.oldNum}</strong></td>
        <td>${item.custName}</td>
        <td>${item.altNum}</td>
        <td><span class="sla-badge">⏱️ ${item.slaTime}</span></td>
        <td><span class="control-pill">🔒 ${item.controls}</span></td>
        <td><button class="btn-sm btn-secondary" onclick="inspectAccount('${item.id}')">Inspect & Override</button></td>
      `;
      feedTableBody.appendChild(tr);
    });

    if (statSimEvents) {
      statSimEvents.innerText = (2841 + simEventsList.length - 2).toLocaleString();
    }
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      const randomId = 'SIM-' + Math.floor(10000 + Math.random() * 90000);
      const randomOld = '+91 9' + Math.floor(100000009 + Math.random() * 899999990);
      const now = new Date().toISOString().substring(11, 19);
      
      const newEvent = {
        id: randomId,
        time: now,
        oldNum: randomOld,
        custName: 'Aadhaar Matched Customer #' + Math.floor(100 + Math.random() * 900),
        altNum: '+91 94421-99882',
        slaTime: '01 min (Auto-Deregistered)',
        controls: 'UPI/OTP Revoked • Restrict',
        status: 'IN_PROGRESS'
      };

      simEventsList.unshift(newEvent);
      renderFeed();
    });
  }

  window.inspectAccount = function(id) {
    const item = simEventsList.find(x => x.id === id);
    const box = document.getElementById('inspection-details-box');
    if (!box || !item) return;

    box.innerHTML = `
      <div class="inspection-row">
        <span class="token-label">Event ID:</span>
        <strong style="color:var(--accent-cyan); font-family:var(--font-mono);">${item.id}</strong>
      </div>
      <div class="inspection-row">
        <span class="token-label">Reallocated Phone Number:</span>
        <strong>${item.oldNum}</strong>
      </div>
      <div class="inspection-row">
        <span class="token-label">Customer Record:</span>
        <strong>${item.custName}</strong>
      </div>
      <div class="inspection-row">
        <span class="token-label">Verified Aadhaar Vault Alt #:</span>
        <strong style="color:var(--accent-emerald);">${item.altNum}</strong>
      </div>
      <div class="inspection-row">
        <span class="token-label">1-Hour SLA Status:</span>
        <span class="sla-badge">${item.slaTime}</span>
      </div>
      <div class="inspection-row">
        <span class="token-label">Current Account State:</span>
        <span class="control-pill">TRACKING_MODE • RESTRICTED</span>
      </div>
      <div style="margin-top:1rem; display:flex; gap:10px;">
        <button class="btn-sm btn-primary" onclick="alert('Sent emergency re-verification SMS link to alternate number: ${item.altNum}')">📱 Resend Alert to Alt Number</button>
        <button class="btn-sm btn-ghost" onclick="alert('Staff Manual Override: Account unlocked by authorized officer.')">🔓 Staff Manual Unlock</button>
      </div>
    `;
  };

  renderFeed();
}

// -------------------------------------------------------------
// 3. CUSTOMER TEMPORARY RECOVERY PORTAL & FEEDBACK
// -------------------------------------------------------------
function initCustomerRecoveryPortal() {
  const reregisterBtn = document.getElementById('reregister-num-btn');
  const inputNum = document.getElementById('new-primary-num-input');
  const reregisterMsg = document.getElementById('reregister-msg');
  const unblockCardsBtn = document.getElementById('cust-unblock-cards-btn');
  const freezeAllBtn = document.getElementById('cust-freeze-all-btn');
  const cardControlMsg = document.getElementById('card-control-msg');
  const feedbackForm = document.getElementById('customer-feedback-form');
  const feedbackItemsList = document.getElementById('feedback-items-list');

  if (reregisterBtn) {
    reregisterBtn.addEventListener('click', () => {
      const val = inputNum.value.trim();
      if (!val) return;

      reregisterMsg.className = 'msg-box success';
      reregisterMsg.innerText = `✅ Success! Number ${val} verified via Aadhaar OTP and assigned as your primary banking number.`;
      
      const custAltNum = document.getElementById('cust-alt-num');
      if (custAltNum) custAltNum.innerText = val + ' (Verified Primary)';
    });
  }

  if (unblockCardsBtn) {
    unblockCardsBtn.addEventListener('click', () => {
      cardControlMsg.className = 'msg-box success';
      cardControlMsg.innerText = `🔓 Debit/Credit Cards & NetBanking restored successfully. Security tracking remains active for 24 hours.`;
    });
  }

  if (freezeAllBtn) {
    freezeAllBtn.addEventListener('click', () => {
      cardControlMsg.className = 'msg-box error';
      cardControlMsg.innerText = `🔒 Emergency Complete Freeze Activated! All outbound payments and cards locked. Contact bank officer.`;
    });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rating = document.querySelector('input[name="rating"]:checked')?.value || '5';
      const comments = document.getElementById('feedback-comments')?.value || 'Fast resolution!';

      // Append to feedback list
      if (feedbackItemsList) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'feedback-item';
        itemDiv.innerHTML = `
          <div class="fb-header">
            <strong>Customer (Alternate # Verified)</strong>
            <span class="fb-rating">${rating} ★</span>
          </div>
          <p class="fb-text">"${escapeHtml(comments)}"</p>
        `;
        feedbackItemsList.insertBefore(itemDiv, feedbackItemsList.firstChild);
      }

      alert('Thank you for your feedback! Your temporary recovery portal session has been successfully resolved and access is now terminated.');
      
      // Auto-switch to employee view or reset
      const viewEmployeeBtn = document.getElementById('view-employee-btn');
      if (viewEmployeeBtn) viewEmployeeBtn.click();
    });
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// -------------------------------------------------------------
// 4. SESSION COUNTDOWN TIMER (15 MIN AUTO-EXPIRY)
// -------------------------------------------------------------
function initCountdownTimer() {
  const countdownEl = document.getElementById('session-countdown');
  if (!countdownEl) return;

  let totalSeconds = 15 * 60;

  setInterval(() => {
    if (totalSeconds <= 0) {
      countdownEl.innerText = "00:00 (EXPIRED)";
      return;
    }
    totalSeconds--;
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    countdownEl.innerText = `${mins}:${secs}`;
  }, 1000);
}
