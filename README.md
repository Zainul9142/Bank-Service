# 🛡️ Bank NumberShield

**Bank NumberShield** is an enterprise banking security, SIM recycling protection, automated number deregistration, and dual-portal platform built for financial institutions, PCI-DSS compliance, and Aadhaar Data Vault integration.

![Bank NumberShield Logo](public/assets/logo.jpg)

---

## 🌟 Key Functional Features

1. **⚡ Recycled SIM Reallocation & 1-Hour SLA Deregistration**
   - Ingests real-time telecom SIM allocation events via Aadhaar verification feeds.
   - Automatically revokes SMS banking, OTP delivery, UPI handles, and mobile app access from recycled numbers within **1 hour** of activation.

2. **📱 Alternate Contact Identification & Proactive Alerts**
   - Automatically queries the bank's Aadhaar Vault and CKYC records for verified alternate phone numbers.
   - Dispatches emergency security alerts and time-limited recovery links to alternate numbers.

3. **🔄 Customer Alternate Number Re-Registration & CSAT Feedback**
   - Customers can re-register their primary banking phone number using their verified alternate contact via a guided wizard.
   - Post-resolution CSAT feedback module tracks customer satisfaction and prevents repeat fraud.

4. **🔒 Account & Card Security Controls**
   - Automatic security restrictions on high-value outbound transfers and lock status on linked Debit & Credit Cards.
   - One-click restore or emergency complete freeze.

5. **📡 AI Fraud Transaction Shield & Tracking Mode**
   - Flagged accounts enter "Tracking Mode" with live transaction velocity scoring.

6. **🏛️ Government Aadhaar Vault Integration**
   - Utilizes pre-authorized banking statutory identity verification authority to query alternate numbers without requesting redundant user API permissions during emergency security events.

7. **👥 Dual Portal & Dedicated Logins**
   - **Bank Employee Operations Portal (`public/employee-login.html`)**: Staff authentication, real-time SIM recycling feed, account inspection, manual override, and CSAT tracking.
   - **Customer Recovery Portal (`public/customer-login.html`)**: Temporary recovery portal for customers, auto-expiring 15-minute timer, session self-destruct upon resolution.

---

## 💻 Tech Stack & Architecture

- **Backend:** Node.js (v24+), Express.js REST API
- **Frontend:** Vanilla HTML5, Custom CSS (Slate Dark Cyberpunk Theme), JavaScript (ES6+ REST API client)
- **Database:** In-memory JSON database engine (`server/db.js`)
- **Compliance:** PCI-DSS v4.0 Level 1, RBI Cyber Security Framework, UIDAI Aadhaar Vault Guidelines.

---

## 🚀 How to Run the Backend Server & Web App

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Express API Server
```bash
npm start
```
The server will start on port **8000**:
- 🌐 **Main Dual Portal:** `http://localhost:8000`
- 🏢 **Bank Staff Login:** `http://localhost:8000/employee-login.html`
- 📱 **Customer Temporary Login:** `http://localhost:8000/customer-login.html`
- 📄 **PRD Document:** `http://localhost:8000/PRD.md`

---

## 🔌 Backend REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/employee-login` | Bank Staff Authentication |
| `POST` | `/api/auth/customer-temp-login` | Customer Temporary Recovery Login |
| `GET` | `/api/sim-events/feed` | Fetch real-time SIM recycling event queue |
| `POST` | `/api/sim-events/trigger` | Ingest new telecom SIM allocation event |
| `POST` | `/api/account/reregister-number` | Update customer primary mobile number |
| `POST` | `/api/account/card-controls` | Unblock or emergency freeze debit/credit cards |
| `POST` | `/api/feedback/submit` | Submit customer recovery feedback |
| `GET` | `/api/feedback/metrics` | Retrieve CSAT metrics & customer reviews |
| `GET` | `/api/health` | System health check & PCI compliance metric |

---

## 📤 How to Push Code to GitHub

Follow these steps to initialize Git and push the repository to GitHub:

### Step 1: Initialize Git Repository
```bash
git init
```

### Step 2: Add Files & Commit
```bash
git add .
git commit -m "Initial commit: Bank NumberShield backend, frontend, PRD and login portals"
```

### Step 3: Set Remote Repository & Push
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bank-numbershield.git
git push -u origin main
```

---

## ⚖️ Rights & Copyright Notice

This repository includes a proprietary **[`LICENSE`](LICENSE)** file (*All Rights Reserved*). 
- **Copyright** protects your source code implementation when pushed to GitHub.
- Nobody has legal permission to copy or distribute your code files unless you grant an open-source license (e.g. MIT).
- See **[`PRD.md`](PRD.md)** and **[`LICENSE`](LICENSE)** for details.
