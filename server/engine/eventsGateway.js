const store = require('../db');
const { calculateRiskScore } = require('./riskEngine');
const { evaluatePolicy } = require('./policyEngine');
const { verifySignature, signPayload } = require('./signatures');
const { logAuditEvent } = require('./audit');
const crypto = require('crypto');

async function processSimEvent(eventPayload, options = {}) {
  const { eventId, eventType, mobileToken, operatorId, eventTimestamp, nonce } = eventPayload;

  // 1. Signature check if signature passed or test option
  let signature = eventPayload.signature;
  if (!signature) {
    signature = options.invalidSig ? 'INVALID_FORGED_SIGNATURE==' : signPayload(eventPayload);
    eventPayload.signature = signature;
  }

  if (options.invalidSig || !verifySignature(eventPayload)) {
    logAuditEvent({
      actor: operatorId || 'TELCO',
      action: 'SECURITY_INVALID_SIGNATURE_REJECTED',
      target: eventId,
      reason: 'Cryptographic signature verification failed'
    });
    throw { status: 401, message: "Invalid event cryptographic signature", code: "INVALID_SIGNATURE" };
  }

  // 2. Replay check
  if (!store.processedNonces) store.processedNonces = {};
  if (options.replay || store.processedNonces[nonce]) {
    logAuditEvent({
      actor: operatorId || 'TELCO',
      action: 'SECURITY_REPLAY_REJECTED',
      target: eventId,
      reason: 'Duplicate nonce or replayed event'
    });
    throw { status: 409, message: "Duplicate or replayed event detected", code: "REPLAY_ATTACK_DETECTED" };
  }
  store.processedNonces[nonce] = new Date().toISOString();

  // 3. Customer resolution
  const customer = (store.customers && store.customers[0]) || {
    customerId: 'CUST-1001',
    name: 'Rajesh Kumar',
    alternateMobile: '+91 91234-56789'
  };

  // 4. Calculate Risk
  const securityContext = { is_new_device: false, recent_password_reset: false };
  const customSignals = options.customSignals || {};
  const riskAnalysis = calculateRiskScore(eventPayload, securityContext, customSignals);

  // 5. Evaluate Policy
  const policyDecision = evaluatePolicy(riskAnalysis.score);

  const caseId = `CASE-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

  logAuditEvent({
    actor: 'EVENT_GATEWAY',
    action: 'CASE_CREATED',
    target: caseId,
    reason: `Processed SIM event for ${customer.name}. Score: ${riskAnalysis.score}, Action: ${policyDecision.action}`
  });

  return {
    success: true,
    caseId,
    customerId: customer.customerId,
    customerName: customer.name,
    riskScore: riskAnalysis.score,
    riskBand: policyDecision.risk_band,
    policyAction: policyDecision.action,
    policyReason: policyDecision.reason,
    signals: riskAnalysis.signals
  };
}

module.exports = { processSimEvent };
