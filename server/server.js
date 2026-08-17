const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const simRoutes = require('./routes/simEvents');
const accountRoutes = require('./routes/account');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sim-events', simRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Bank NumberShield Server v3.0',
    aadhaarVault: 'CONNECTED',
    pciCompliance: 'LEVEL_1_ACTIVE',
    timestamp: new Date().toISOString()
  });
});

// Fallback route for single page apps
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛡️ Bank NumberShield Server running on port ${PORT}`);
  console.log(`👉 Main App URL: http://localhost:${PORT}`);
  console.log(`👉 Employee Login: http://localhost:${PORT}/employee-login.html`);
  console.log(`👉 Customer Login: http://localhost:${PORT}/customer-login.html`);
  console.log(`=======================================================`);
});
