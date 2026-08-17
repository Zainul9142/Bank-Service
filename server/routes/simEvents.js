const express = require('express');
const router = express.Router();
const db = require('../db');

// Get real-time SIM recycling events feed
router.get('/feed', (req, res) => {
  res.json({
    success: true,
    count: db.simEvents.length,
    events: db.simEvents
  });
});

// Trigger a new telecom SIM recycling event (Automated ingestion webhook)
router.post('/trigger', (req, res) => {
  const randomId = 'SIM-' + Math.floor(10000 + Math.random() * 90000);
  const randomOld = '+91 9' + Math.floor(100000009 + Math.random() * 899999990);
  const nowStr = new Date().toISOString();

  const newEvent = {
    id: randomId,
    time: nowStr.substring(11, 19),
    oldNum: randomOld,
    custName: 'Aadhaar Matched Customer #' + Math.floor(100 + Math.random() * 900),
    altNum: '+91 94421-99882',
    slaTime: '01 min (Auto-Deregistered)',
    controls: 'UPI/OTP Revoked • Restrict',
    status: 'IN_PROGRESS'
  };

  db.simEvents.unshift(newEvent);

  res.status(201).json({
    success: true,
    message: 'SIM Reallocation Event Processed (< 1-Hr SLA Enforced)',
    event: newEvent
  });
});

module.exports = router;
