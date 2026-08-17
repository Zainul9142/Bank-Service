const express = require('express');
const router = express.Router();
const db = require('../db');
const { processSimEvent } = require('../engine/eventsGateway');

// Get real-time SIM recycling events feed
router.get('/feed', (req, res) => {
  res.json({
    success: true,
    count: db.simEvents.length,
    events: db.simEvents
  });
});

// Trigger a new telecom SIM recycling event with deterministic risk engine evaluation
router.post('/trigger', async (req, res) => {
  try {
    const { customSignals, invalidSig, replay } = req.body || {};

    const randomId = 'SIM-' + Math.floor(10000 + Math.random() * 90000);
    const randomOld = '+91 9' + Math.floor(100000009 + Math.random() * 899999990);
    const nowStr = new Date().toISOString();

    const eventPayload = {
      eventId: randomId,
      eventType: 'SIM_REASSIGNED',
      mobileToken: req.body.mobileToken || 'MOB_7F92A1',
      operatorId: req.body.operatorId || 'DEMO_TELCO',
      eventTimestamp: nowStr,
      nonce: 'NONCE_' + Math.random().toString(36).substring(2, 10)
    };

    // Evaluate through risk & policy engine gateway
    const result = await processSimEvent(eventPayload, {
      customSignals: customSignals || {},
      invalidSig: invalidSig || false,
      replay: replay || false
    });

    const newEvent = {
      id: randomId,
      time: nowStr.substring(11, 19),
      oldNum: randomOld,
      custName: result.customerName || ('Aadhaar Matched Customer #' + Math.floor(100 + Math.random() * 900)),
      altNum: '+91 94421-99882',
      slaTime: '01 min (Auto-Deregistered)',
      controls: `${result.policyAction} • Risk Score: ${result.riskScore}/100`,
      status: 'IN_PROGRESS',
      caseId: result.caseId,
      riskScore: result.riskScore,
      policyAction: result.policyAction,
      signals: result.signals
    };

    db.simEvents.unshift(newEvent);

    res.status(201).json({
      success: true,
      message: `SIM Reallocation Event Processed (Score: ${result.riskScore}, Action: ${result.policyAction})`,
      event: newEvent,
      engineResult: result
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Failed to process SIM event',
      code: err.code || 'EVENT_ERROR'
    });
  }
});

module.exports = router;
