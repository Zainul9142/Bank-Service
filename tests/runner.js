const assert = require('assert');
const { calculateRiskScore } = require('../server/engine/riskEngine');
const { evaluatePolicy } = require('../server/engine/policyEngine');
const { verifySignature, signPayload } = require('../server/engine/signatures');

async function runTests() {
  console.log("==================================================");
  console.log("   Bank NumberShield — Merged Engine Test Suite");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✔ [PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ✖ [FAIL] ${name}:`, e.message || e);
      failed++;
    }
  }

  console.log("\n--- Unit Tests ---");

  test("UNIT-01: Cryptographic Signatures", () => {
    const event = {
      eventId: "TELCO-TEST-001",
      eventType: "SIM_REASSIGNED",
      mobileToken: "MOB_7F92A1",
      operatorId: "DEMO_TELCO",
      eventTimestamp: new Date().toISOString(),
      nonce: "NONCE_12345"
    };
    event.signature = signPayload(event);
    assert.strictEqual(verifySignature(event), true);

    const tampered = { ...event, mobileToken: "MOB_TAMPERED" };
    assert.strictEqual(verifySignature(tampered), false);
  });

  test("UNIT-02: Risk Engine Calculation & Score Capping", () => {
    const event = { eventType: "SIM_REASSIGNED" };
    const baseResult = calculateRiskScore(event, {}, {});
    assert.strictEqual(baseResult.score, 40);

    const maxResult = calculateRiskScore(event, {}, {
      newDevice: true,
      passwordResetNearEvent: true,
      newIpOrLocation: true,
      highRiskTransaction: true,
      newBeneficiary: true,
      velocityAnomaly: 30
    });
    assert.strictEqual(maxResult.score, 100);
    assert.strictEqual(maxResult.signals.length, 7);
  });

  test("UNIT-03: Policy Engine Bands", () => {
    assert.strictEqual(evaluatePolicy(20).action, 'MONITOR');
    assert.strictEqual(evaluatePolicy(45).action, 'STEP_UP');
    assert.strictEqual(evaluatePolicy(75).action, 'RESTRICT');
    assert.strictEqual(evaluatePolicy(95).action, 'CONTAIN');
  });

  console.log("\n==================================================");
  console.log(` Test Results: ${passed} Passed | ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
