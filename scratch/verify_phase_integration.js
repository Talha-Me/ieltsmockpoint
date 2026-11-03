const fs = require('fs');
const path = require('path');

const writingHtml = fs.readFileSync(path.join(__dirname, '..', 'public', 'cambridge-writing.html'), 'utf8');
const writingTestJs = fs.readFileSync(path.join(__dirname, '..', 'views', 'cambridgetest', 'cambridge-writing-test.js'), 'utf8');
const writingExercisesHtml = fs.readFileSync(path.join(__dirname, '..', 'public', 'writing-exercises.html'), 'utf8');

console.log('--- Phase Integration Verification ---');

console.log('1. public/writing-exercises.html:');
console.log('   - Has exPhase:', writingExercisesHtml.includes('exPhase'));
console.log('   - Has isExerciseLocked:', writingExercisesHtml.includes('isExerciseLocked'));
console.log('   - Has ex-unlock-modal:', writingExercisesHtml.includes('id="ex-unlock-modal"'));

console.log('2. public/cambridge-writing.html:');
console.log('   - Has appPhase:', writingHtml.includes('appPhase'));
console.log('   - Has isTestLocked:', writingHtml.includes('isTestLocked'));
console.log('   - Has isPartLocked:', writingHtml.includes('isPartLocked'));
console.log('   - Has psUnlockModal:', writingHtml.includes('id="psUnlockModal"'));

console.log('3. views/cambridgetest/cambridge-writing-test.js:');
console.log('   - Has appPhase:', writingTestJs.includes('appPhase'));
console.log('   - Has isCurrentSessionLocked:', writingTestJs.includes('isCurrentSessionLocked'));
console.log('   - Has openTestUnlockModal:', writingTestJs.includes('openTestUnlockModal'));

// Syntax check for JS
try {
  new Function(writingTestJs);
  console.log('Writing test JS syntax: VALID OK');
} catch (e) {
  console.error('Writing test JS syntax ERROR:', e);
}
