const assert = require('assert');

// Simulate the function logic as implemented in speaking.html and speaking-test.html
function createAccessTester(appPhase, appSettings, userState) {
  function getUserAccessState() {
    return userState;
  }

  function isSpeakingTestLocked(testNo) {
    if (appPhase === 1) return false;
    const user = getUserAccessState();
    if (appPhase === 2 && user.isLoggedIn) return false;
    if (appPhase === 3 && user.isPremium) return false;
    const freeTestsAllowed = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;
    return Number(testNo) > freeTestsAllowed;
  }

  function isSpeakingPartLocked(partNo, testNo) {
    if (appPhase === 1) return false;
    const user = getUserAccessState();
    if (appPhase === 2 && user.isLoggedIn) return false;
    if (appPhase === 3 && user.isPremium) return false;

    const freeTestsAllowed = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;
    if (Number(testNo) > freeTestsAllowed) return true;

    const freePartsAllowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;
    return Number(partNo) > freePartsAllowed;
  }

  function isSpeakingSessionLocked(tNo, pMode) {
    if (appPhase === 1) return false;
    const user = getUserAccessState();
    if (appPhase === 2 && user.isLoggedIn) return false;
    if (appPhase === 3 && user.isPremium) return false;

    const freeTestsAllowed = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;
    const freePartsAllowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;

    const tNum = Number(tNo) || 1;
    if (tNum > freeTestsAllowed) return true;

    if (pMode && pMode !== 'all') {
      const pNum = Number(pMode) || 1;
      if (pNum > freePartsAllowed) return true;
    }
    return false;
  }

  return { isSpeakingTestLocked, isSpeakingPartLocked, isSpeakingSessionLocked };
}

// 1. Phase 1 tests
{
  const tester = createAccessTester(1, { freeFullMocksCount: 1, freePartsPerTest: 1 }, { isLoggedIn: false, isPremium: false });
  assert.strictEqual(tester.isSpeakingTestLocked(1), false);
  assert.strictEqual(tester.isSpeakingTestLocked(2), false);
  assert.strictEqual(tester.isSpeakingPartLocked(1, 1), false);
  assert.strictEqual(tester.isSpeakingPartLocked(2, 1), false);
  assert.strictEqual(tester.isSpeakingSessionLocked(2, 'all'), false);
  assert.strictEqual(tester.isSpeakingSessionLocked(1, '2'), false);
  console.log('✓ Phase 1: All speaking tests and parts accessible');
}

// 2. Phase 2 (Guest)
{
  const tester = createAccessTester(2, { freeFullMocksCount: 1, freePartsPerTest: 1 }, { isLoggedIn: false, isPremium: false });
  assert.strictEqual(tester.isSpeakingTestLocked(1), false, 'Test 1 full should be free');
  assert.strictEqual(tester.isSpeakingTestLocked(2), true, 'Test 2 full should be locked');
  assert.strictEqual(tester.isSpeakingPartLocked(1, 1), false, 'Test 1 Part 1 should be free');
  assert.strictEqual(tester.isSpeakingPartLocked(2, 1), true, 'Test 1 Part 2 should be locked');
  assert.strictEqual(tester.isSpeakingPartLocked(1, 2), true, 'Test 2 Part 1 should be locked');
  assert.strictEqual(tester.isSpeakingSessionLocked(1, 'all'), false);
  assert.strictEqual(tester.isSpeakingSessionLocked(1, '1'), false);
  assert.strictEqual(tester.isSpeakingSessionLocked(1, '2'), true);
  assert.strictEqual(tester.isSpeakingSessionLocked(2, 'all'), true);
  console.log('✓ Phase 2 (Guest): Test 1 & Part 1 free, Test 2+ and Parts 2+ locked');
}

// 3. Phase 2 (Logged In)
{
  const tester = createAccessTester(2, { freeFullMocksCount: 1, freePartsPerTest: 1 }, { isLoggedIn: true, isPremium: false });
  assert.strictEqual(tester.isSpeakingTestLocked(1), false);
  assert.strictEqual(tester.isSpeakingTestLocked(2), false);
  assert.strictEqual(tester.isSpeakingTestLocked(5), false);
  assert.strictEqual(tester.isSpeakingPartLocked(2, 1), false);
  assert.strictEqual(tester.isSpeakingSessionLocked(2, 'all'), false);
  assert.strictEqual(tester.isSpeakingSessionLocked(5, '3'), false);
  console.log('✓ Phase 2 (Logged In): All tests and parts unlocked');
}

// 4. Phase 3 (Free candidate)
{
  const tester = createAccessTester(3, { freeFullMocksCount: 1, freePartsPerTest: 1 }, { isLoggedIn: true, isPremium: false });
  assert.strictEqual(tester.isSpeakingTestLocked(1), false);
  assert.strictEqual(tester.isSpeakingTestLocked(2), true);
  assert.strictEqual(tester.isSpeakingPartLocked(2, 1), true);
  assert.strictEqual(tester.isSpeakingSessionLocked(2, 'all'), true);
  console.log('✓ Phase 3 (Free user): Quota applied, prompt premium upgrade');
}

// 5. Phase 3 (Premium candidate)
{
  const tester = createAccessTester(3, { freeFullMocksCount: 1, freePartsPerTest: 1 }, { isLoggedIn: true, isPremium: true });
  assert.strictEqual(tester.isSpeakingTestLocked(1), false);
  assert.strictEqual(tester.isSpeakingTestLocked(5), false);
  assert.strictEqual(tester.isSpeakingPartLocked(3, 5), false);
  assert.strictEqual(tester.isSpeakingSessionLocked(4, 'all'), false);
  console.log('✓ Phase 3 (Premium): Full access to everything');
}

console.log('\nAll Access Control Unit Tests Passed Successfully!');
