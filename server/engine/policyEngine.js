const POLICY_VERSION = process.env.RISK_POLICY_VERSION || 'v1';

function evaluatePolicy(score, policyVersion = POLICY_VERSION) {
  let action = 'MONITOR';
  let band = '0-30';
  let reason = '';

  if (score <= 30) {
    action = 'MONITOR';
    band = '0-30';
    reason = 'Low risk. Flag case for background monitoring; allow normal transactions.';
  } else if (score <= 60) {
    action = 'STEP_UP';
    band = '31-60';
    reason = 'Moderate risk. Require step-up authentication for high-value operations.';
  } else if (score <= 90) {
    action = 'RESTRICT';
    band = '61-90';
    reason = 'High risk. Restrict sensitive actions (block new beneficiaries, limit daily transfer caps).';
  } else {
    action = 'CONTAIN';
    band = '91-100';
    reason = 'Critical risk. Enforce temporary containment on digital banking channels, cards, and UPI until identity recovery.';
  }

  return {
    policy_version: policyVersion,
    risk_score: score,
    risk_band: band,
    action: action,
    reason: reason,
    evaluated_at: new Date().toISOString()
  };
}

module.exports = {
  POLICY_VERSION,
  evaluatePolicy
};
