const express = require('express');
const router = express.Router();
const db = require('../db');

// Bank Employee Login Endpoint
router.post('/employee-login', (req, res) => {
  const { empId, password, department } = req.body;
  if (!empId || !password) {
    return res.status(400).json({ success: false, message: 'Employee ID and Password are required.' });
  }

  const employee = db.employees.find(e => e.empId === empId && e.password === password);
  if (!employee) {
    return res.status(401).json({ success: false, message: 'Invalid Employee Credentials.' });
  }

  return res.json({
    success: true,
    message: 'Authentication Successful',
    token: employee.token,
    user: {
      empId: employee.empId,
      name: employee.name,
      department: department || employee.department,
      role: employee.role
    }
  });
});

// Customer Alternate Number Temporary Recovery Portal Login Endpoint
router.post('/customer-temp-login', (req, res) => {
  const { alternateMobile, aadhaarLast4, otp } = req.body;
  if (!alternateMobile || !aadhaarLast4) {
    return res.status(400).json({ success: false, message: 'Alternate Mobile Number and Aadhaar Last 4 Digits required.' });
  }

  // Find customer by alternate number or aadhaar
  const customer = db.customers.find(c => c.alternateMobile.includes(alternateMobile) || c.aadhaarLast4 === aadhaarLast4);
  
  if (!customer) {
    // Return simulated record for demo if not found in pre-seed
    const tempCustomer = {
      customerId: "CUST-TEMP-" + Math.floor(1000 + Math.random() * 9000),
      name: "Verified Account Holder",
      oldMobile: "+91 98700-XXXXX",
      alternateMobile: alternateMobile,
      aadhaarLast4: aadhaarLast4,
      accountNo: "ACCT-4920-1829-3391",
      status: "RESTRICTED",
      upiStatus: "DEACTIVATED",
      cardStatus: "TEMPORARY_LOCKED",
      slaStatus: "DEREGISTERED_IN_18_MINS"
    };
    db.customers.push(tempCustomer);

    return res.json({
      success: true,
      message: 'Temporary Recovery Session Granted',
      sessionToken: 'TEMP_SESS_' + Date.now(),
      expiresInMinutes: 15,
      customer: tempCustomer
    });
  }

  return res.json({
    success: true,
    message: 'Temporary Recovery Session Granted',
    sessionToken: 'TEMP_SESS_' + Date.now(),
    expiresInMinutes: 15,
    customer: customer
  });
});

module.exports = router;
