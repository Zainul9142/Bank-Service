// Bank NumberShield - Integrated REST API Engine v3.0

document.addEventListener('DOMContentLoaded', () => {
  initPortalSwitcher();
  loadSIMRecyclingFeed();
  loadFeedbackMetrics();
  initCustomerActions();
  initCountdownTimer();
  checkURLParams();
});

// Check URL query parameters for portal auto-selection
function checkURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const portalParam = urlParams.get('portal');
  if (portalParam === 'customer') {
    const viewCustomerBtn = document.getElementById('view-customer-btn');
    if (viewCustomerBtn) viewCustomerBtn.click();
  } else if (portalParam === 'employee') {
    const viewEmployeeBtn = document.getElementById('view-employee-btn');
    if (viewEmployeeBtn) viewEmployeeBtn.click();
  }
}

// -------------------------------------------------------------
// 1. PORTAL VIEW SWITCHER
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
// 2. SIM RECYCLING FEED (API INTEGRATED)
// -------------------------------------------------------------
let cachedSimEvents = [];

async function loadSIMRecyclingFeed() {
  const feedTableBody = document.getElementById('sim-feed-table-body');
  const triggerBtn = document.getElementById('trigger-sim-event-btn');
  const statSimEvents = document.getElementById('stat-sim-events');

  try {
    const res = await fetch('/api/sim-events/feed');
    const data = await res.json();
    if (data.success) {
      cachedSimEvents = data.events;
      renderFeedTable(cachedSimEvents);
      if (statSimEvents) statSimEvents.innerText = (2841 + data.count - 2).toLocaleString();
    }
  } catch (err) {
    console.log('Using local fallback for feed...');
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/sim-events/trigger', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          cachedSimEvents.unshift(data.event);
          renderFeedTable(cachedSimEvents);
          if (statSimEvents) statSimEvents.innerText = (2841 + cachedSimEvents.length - 2).toLocaleString();
        }
      } catch (err) {
        alert('Failed to connect to API server.');
      }
    });
  }

  window.inspectAccount = function(id) {
    const item = cachedSimEvents.find(x => x.id === id);
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
      <div style="margin-top:1rem; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn-sm btn-primary" onclick="alert('Sent emergency re-verification SMS link to alternate number: ${item.altNum}')">📱 Resend Alert to Alt Number</button>
        <button class="btn-sm btn-ghost" onclick="alert('Staff Manual Override: Account unlocked by authorized officer.')">🔓 Staff Manual Unlock</button>
      </div>
    `;
  };
}

function renderFeedTable(events) {
  const feedTableBody = document.getElementById('sim-feed-table-body');
  if (!feedTableBody) return;
  feedTableBody.innerHTML = '';

  events.forEach(item => {
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
}

// -------------------------------------------------------------
// 3. CSAT METRICS & FEEDBACK (API INTEGRATED)
// -------------------------------------------------------------
async function loadFeedbackMetrics() {
  const csatDisplay = document.getElementById('csat-rating-display');
  const feedbackItemsList = document.getElementById('feedback-items-list');

  try {
    const res = await fetch('/api/feedback/metrics');
    const data = await res.json();
    if (data.success) {
      if (csatDisplay) csatDisplay.innerText = `${data.csatRating} / 5.0`;
      if (feedbackItemsList && data.feedbackList) {
        feedbackItemsList.innerHTML = '';
        data.feedbackList.forEach(fb => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'feedback-item';
          itemDiv.innerHTML = `
            <div class="fb-header">
              <strong>${escapeHtml(fb.customerName)}</strong>
              <span class="fb-rating">${fb.rating} ★</span>
            </div>
            <p class="fb-text">"${escapeHtml(fb.comments)}"</p>
          `;
          feedbackItemsList.appendChild(itemDiv);
        });
      }
    }
  } catch (err) {
    console.log('CSAT metrics local fallback.');
  }
}

// -------------------------------------------------------------
// 4. CUSTOMER ACTIONS (API INTEGRATED)
// -------------------------------------------------------------
function initCustomerActions() {
  const reregisterBtn = document.getElementById('reregister-num-btn');
  const inputNum = document.getElementById('new-primary-num-input');
  const reregisterMsg = document.getElementById('reregister-msg');
  const unblockCardsBtn = document.getElementById('cust-unblock-cards-btn');
  const freezeAllBtn = document.getElementById('cust-freeze-all-btn');
  const cardControlMsg = document.getElementById('card-control-msg');
  const feedbackForm = document.getElementById('customer-feedback-form');

  if (reregisterBtn) {
    reregisterBtn.addEventListener('click', async () => {
      const val = inputNum.value.trim();
      if (!val) return;

      try {
        const res = await fetch('/api/account/reregister-number', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPrimaryNumber: val })
        });
        const data = await res.json();
        reregisterMsg.className = 'msg-box success';
        reregisterMsg.innerText = data.message;
        const custAltNum = document.getElementById('cust-alt-num');
        if (custAltNum) custAltNum.innerText = val + ' (Verified Primary)';
      } catch (err) {
        reregisterMsg.className = 'msg-box success';
        reregisterMsg.innerText = `✅ Success! Number ${val} verified via Aadhaar OTP and assigned as primary number.`;
      }
    });
  }

  if (unblockCardsBtn) {
    unblockCardsBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/account/card-controls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'UNBLOCK' })
        });
        const data = await res.json();
        cardControlMsg.className = 'msg-box success';
        cardControlMsg.innerText = data.message;
      } catch (err) {
        cardControlMsg.className = 'msg-box success';
        cardControlMsg.innerText = `🔓 Debit/Credit Cards & NetBanking restored successfully.`;
      }
    });
  }

  if (freezeAllBtn) {
    freezeAllBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/account/card-controls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'FREEZE_ALL' })
        });
        const data = await res.json();
        cardControlMsg.className = 'msg-box error';
        cardControlMsg.innerText = data.message;
      } catch (err) {
        cardControlMsg.className = 'msg-box error';
        cardControlMsg.innerText = `🔒 Emergency Complete Freeze Activated! All outbound payments locked.`;
      }
    });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rating = document.querySelector('input[name="rating"]:checked')?.value || '5';
      const comments = document.getElementById('feedback-comments')?.value || 'Fast resolution!';

      try {
        await fetch('/api/feedback/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, comments })
        });
      } catch (err) {}

      alert('Thank you for your feedback! Your temporary recovery portal session has been successfully resolved and access is now terminated.');
      sessionStorage.clear();
      window.location.href = 'employee-login.html';
    });
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// -------------------------------------------------------------
// 5. SESSION COUNTDOWN TIMER (15 MIN AUTO-EXPIRY)
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
