const store = require('../db');
const crypto = require('crypto');

function logAuditEvent({ actor, action, target, reason, metadata = {} }) {
  const auditId = `AUD-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const auditEvent = {
    audit_id: auditId,
    actor: actor || "SYSTEM",
    action: action,
    target: target || "N/A",
    reason: reason || "Standard operation",
    timestamp: new Date().toISOString(),
    metadata: metadata
  };

  store.data.audit_events.unshift(auditEvent);
  store.save();
  return auditEvent;
}

function getAuditTimeline(caseId = null) {
  if (!caseId) {
    return store.data.audit_events;
  }
  return store.data.audit_events.filter(e => 
    (e.metadata && e.metadata.case_id === caseId) || 
    e.target === caseId
  );
}

module.exports = {
  logAuditEvent,
  getAuditTimeline
};
