function calculateRiskScore(simEvent, securityContext = {}, customSignals = {}) {
  let score = 0;
  const contributingSignals = [];

  // 1. SIM Reassignment (Base signal from telecom event)
  if (simEvent && simEvent.eventType === 'SIM_REASSIGNED') {
    const weight = 40;
    score += weight;
    contributingSignals.push({
      code: 'SIM_REASSIGNED',
      name: 'Authorized SIM Reassignment Event',
      weight: weight,
      description: 'Telecom provider emitted signed SIM_REASSIGNED event.'
    });
  }

  // 2. New Device context
  const isNewDevice = customSignals.newDevice ?? (securityContext.is_new_device || false);
  if (isNewDevice) {
    const weight = 20;
    score += weight;
    contributingSignals.push({
      code: 'NEW_DEVICE',
      name: 'Unrecognized Device Login',
      weight: weight,
      description: 'Account accessed from a device fingerprint not previously associated.'
    });
  }

  // 3. Password reset near event
  const recentPasswordReset = customSignals.passwordResetNearEvent ?? (securityContext.recent_password_reset || false);
  if (recentPasswordReset) {
    const weight = 15;
    score += weight;
    contributingSignals.push({
      code: 'PASSWORD_RESET_NEAR_EVENT',
      name: 'Recent Credential Reset',
      weight: weight,
      description: 'Password or PIN reset attempted within 24 hours of SIM change.'
    });
  }

  // 4. New IP / Location anomaly
  const isNewIpLocation = customSignals.newIpOrLocation ?? (securityContext.is_new_ip || false);
  if (isNewIpLocation) {
    const weight = 10;
    score += weight;
    contributingSignals.push({
      code: 'NEW_IP_LOCATION',
      name: 'Geographic / IP Anomaly',
      weight: weight,
      description: 'Request originated from an unfamiliar network or IP range.'
    });
  }

  // 5. High-risk transaction
  const isHighRiskTxn = customSignals.highRiskTransaction ?? (securityContext.high_risk_transaction || false);
  if (isHighRiskTxn) {
    const weight = 20;
    score += weight;
    contributingSignals.push({
      code: 'HIGH_RISK_TRANSACTION',
      name: 'High-Value Fund Transfer',
      weight: weight,
      description: 'Attempted transfer above threshold near SIM reassignment timestamp.'
    });
  }

  // 6. New Beneficiary
  const isNewBeneficiary = customSignals.newBeneficiary ?? (securityContext.recent_beneficiary_added || false);
  if (isNewBeneficiary) {
    const weight = 15;
    score += weight;
    contributingSignals.push({
      code: 'NEW_BENEFICIARY',
      name: 'Recent Payee Addition',
      weight: weight,
      description: 'New payee/beneficiary added within critical risk window.'
    });
  }

  // 7. Velocity Anomaly
  let velocityWeight = 0;
  if (customSignals.velocityAnomaly) {
    velocityWeight = Math.min(Math.max(customSignals.velocityAnomaly, 10), 30);
  } else if (securityContext.transaction_velocity === 'HIGH') {
    velocityWeight = 20;
  } else if (securityContext.transaction_velocity === 'CRITICAL') {
    velocityWeight = 30;
  }

  if (velocityWeight > 0) {
    score += velocityWeight;
    contributingSignals.push({
      code: 'VELOCITY_ANOMALY',
      name: 'High Transaction Velocity',
      weight: velocityWeight,
      description: `Unusual transaction attempt rate (+${velocityWeight} pts).`
    });
  }

  // Cap score at 100
  const finalScore = Math.min(score, 100);

  return {
    score: finalScore,
    signals: contributingSignals,
    calculatedAt: new Date().toISOString()
  };
}

module.exports = {
  calculateRiskScore
};
