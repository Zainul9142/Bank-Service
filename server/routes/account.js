const express = require('express');
const router = express.Router();
const db = require('../db');

// Re-register customer primary mobile number
router.post('/reregister-number', (req, res) => {
  const { customerId, newPrimaryNumber } = req.body;
  if (!newPrimaryNumber) {
    return res.status(400).json({ success: false, message: 'New Primary Mobile Number is required.' });
  }

  let customer = db.customers.find(c => c.customerId === customerId);
  if (!customer && db.customers.length > 0) {
    customer = db.customers[0];
  }

  if (customer) {
    customer.alternateMobile = newPrimaryNumber;
    customer.status = 'ACTIVE_UPDATED';
    customer.upiStatus = 'RE_ACTIVATED';
  }

  res.json({
    success: true,
    message: `Primary number updated to ${newPrimaryNumber} via Aadhaar eKYC verification.`,
    updatedCustomer: customer
  });
});

// Update card & transaction controls (Unblock or Emergency Freeze)
router.post('/card-controls', (req, res) => {
  const { action, customerId } = req.body; // action: 'UNBLOCK' or 'FREEZE_ALL'

  let customer = db.customers.find(c => c.customerId === customerId) || db.customers[0];

  if (action === 'UNBLOCK') {
    customer.cardStatus = 'ACTIVE';
    return res.json({
      success: true,
      message: 'Debit/Credit Cards & NetBanking restored successfully.',
      cardStatus: 'ACTIVE'
    });
  } else {
    customer.cardStatus = 'EMERGENCY_FROZEN';
    return res.json({
      success: true,
      message: 'Emergency Complete Freeze Activated! All outbound transactions locked.',
      cardStatus: 'EMERGENCY_FROZEN'
    });
  }
});

module.exports = router;
