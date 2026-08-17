// Bank NumberShield - Core In-Memory Database Engine

const mockDatabase = {
  employees: [
    {
      empId: "EMP-0001",
      name: "Chief Security Officer Devendra Sharma",
      department: "Executive Security & Board Admin",
      role: "SUPER_ADMIN",
      password: "superpassword",
      token: "EMP_TOKEN_SUPER_ADMIN_0001",
      permissions: ["FULL_SYSTEM_ACCESS", "GLOBAL_OVERRIDE", "POLICY_RECONFIG", "AUDIT_MASTER"]
    },
    {
      empId: "EMP-9021",
      name: "Officer Vikram Seth",
      department: "Fraud Operations",
      role: "ANALYST",
      password: "password123",
      token: "EMP_TOKEN_VIKRAM_9021",
      permissions: ["CASE_INVESTIGATE", "MANUAL_ACTION"]
    },
    {
      empId: "EMP-1004",
      name: "Director Ananya Roy",
      department: "Compliance & Risk",
      role: "ADMIN",
      password: "adminpassword",
      token: "EMP_TOKEN_ANANYA_1004",
      permissions: ["COMPLIANCE_VIEW", "AUDIT_READ"]
    }
  ],
  customers: [
    {
      customerId: "CUST-89201",
      name: "Rajesh Kumar",
      oldMobile: "+91 98765-43210",
      alternateMobile: "+91 91234-56789",
      aadhaarLast4: "8892",
      accountNo: "ACCT-4920-1829-3391",
      status: "RESTRICTED",
      upiStatus: "DEACTIVATED",
      cardStatus: "TEMPORARY_LOCKED",
      slaStatus: "DEREGISTERED_IN_38_MINS"
    },
    {
      customerId: "CUST-89202",
      name: "Priya Sharma",
      oldMobile: "+91 98111-22334",
      alternateMobile: "+91 99887-76655",
      aadhaarLast4: "4412",
      accountNo: "ACCT-8812-0019-4412",
      status: "TRACKING_MODE",
      upiStatus: "DEACTIVATED",
      cardStatus: "ACTIVE",
      slaStatus: "DEREGISTERED_IN_12_MINS"
    }
  ],
  simEvents: [
    {
      id: "SIM-99201",
      time: new Date(Date.now() - 25 * 60000).toISOString(),
      oldNum: "+91 98765-43210",
      custName: "Rajesh Kumar (Acc: 49201829)",
      altNum: "+91 91234-56789",
      slaTime: "38 mins (Met SLA)",
      controls: "UPI/OTP Blocked • Restricted",
      status: "COMPLETED"
    },
    {
      id: "SIM-99202",
      time: new Date(Date.now() - 10 * 60000).toISOString(),
      oldNum: "+91 98111-22334",
      custName: "Priya Sharma (Acc: 88120019)",
      altNum: "+91 99887-76655",
      slaTime: "12 mins (Active)",
      controls: "OTP Revoked • Tracking Mode",
      status: "IN_PROGRESS"
    }
  ],
  feedback: [
    {
      id: "FB-101",
      customerName: "Rajesh Kumar",
      rating: 5,
      comments: "Alerted immediately on my alternate number when my old SIM was given to someone else. Updated my number seamlessly!",
      timestamp: new Date().toISOString()
    }
  ]
};

module.exports = mockDatabase;
