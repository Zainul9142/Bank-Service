const crypto = require('crypto');

const DEFAULT_SECRET = process.env.EVENT_SIGNING_PRIVATE_KEY || 'DEMO_TELCO_PRIVATE_KEY_2026';

function getCanonicalString(event) {
  const { eventId, eventType, mobileToken, operatorId, eventTimestamp, nonce } = event;
  return `${eventId}|${eventType}|${mobileToken}|${operatorId}|${eventTimestamp}|${nonce}`;
}

function signPayload(eventData, secretKey = DEFAULT_SECRET) {
  const canonical = getCanonicalString(eventData);
  return crypto.createHmac('sha256', secretKey).update(canonical).digest('base64');
}

function verifySignature(event, secretKey = DEFAULT_SECRET) {
  if (!event || !event.signature) return false;
  const expected = signPayload(event, secretKey);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(event.signature, 'utf8'),
      Buffer.from(expected, 'utf8')
    );
  } catch (e) {
    return false;
  }
}

module.exports = {
  getCanonicalString,
  signPayload,
  verifySignature
};
