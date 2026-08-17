const express = require('express');
const router = express.Router();
const db = require('../db');

// Submit customer feedback
router.post('/submit', (req, res) => {
  const { customerName, rating, comments } = req.body;
  
  const newFeedback = {
    id: 'FB-' + Math.floor(100 + Math.random() * 900),
    customerName: customerName || 'Verified Account Holder',
    rating: parseInt(rating, 10) || 5,
    comments: comments || 'Smooth recovery process.',
    timestamp: new Date().toISOString()
  };

  db.feedback.unshift(newFeedback);

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully. Session automatically terminating.',
    feedback: newFeedback
  });
});

// Get feedback CSAT list & metrics
router.get('/metrics', (req, res) => {
  const total = db.feedback.length;
  const avg = total > 0 ? (db.feedback.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(1) : 4.8;

  res.json({
    success: true,
    csatRating: avg,
    totalResponses: total,
    feedbackList: db.feedback
  });
});

module.exports = router;
