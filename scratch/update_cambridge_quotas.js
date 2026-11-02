const fs = require('fs');
const path = require('path');

const readingPath = path.resolve(__dirname, '../public/cambridge-reading.html');
const listeningPath = path.resolve(__dirname, '../public/cambridge-listening.html');

function updateCambridgeFile(filePath, isListening = false) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. In fetchSystemPhase: save appSettings
  content = content.replace(
    `let appPhase = 1;\nlet appSettingsLoaded = false;`,
    `let appPhase = 1;\nlet appSettings = {};\nlet appSettingsLoaded = false;`
  );
  content = content.replace(
    `appPhase = Number(data.settings.currentPhase) || 1;\n      appSettingsLoaded = true;`,
    `appPhase = Number(data.settings.currentPhase) || 1;\n      appSettings = data.settings || {};\n      appSettingsLoaded = true;`
  );

  // 2. Define checkPassageLocked and checkSectionLocked
  const oldCheck = `function checkItemLocked(itemIndex) {
  // Phase 1: Open growth — 100% free for everyone, zero locks
  if (appPhase === 1) return false;

  const user = getUserAccessState();

  // Phase 2: Freemium / Lead Gen — Logged in users get everything free; guests only get item 0 (1 free)
  if (appPhase === 2) {
    if (user.isLoggedIn) return false;
    return itemIndex > 0;
  }

  // Phase 3: Paid / Monetization — Premium users get everything; non-premium get item 0
  if (appPhase === 3) {
    if (user.isPremium) return false;
    return itemIndex > 0;
  }

  return false;
}`;

  const newCheck = `function checkPassageLocked(idx) {
  if (appPhase === 1) return false;
  const user = getUserAccessState();
  if (appPhase === 2) {
    if (user.isLoggedIn) return false;
    const allowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;
    return idx >= allowed;
  }
  if (appPhase === 3) {
    if (user.isPremium) return false;
    const allowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;
    return idx >= allowed;
  }
  return false;
}

function checkSectionLocked(idx) {
  if (appPhase === 1) return false;
  const user = getUserAccessState();
  if (appPhase === 2) {
    if (user.isLoggedIn) return false;
    // Cambridge question types quota: 0 means question types are off (locked) without login
    const allowed = appSettings.freeQuestionTypesPerTest !== undefined ? Number(appSettings.freeQuestionTypesPerTest) : 0;
    return idx >= allowed;
  }
  if (appPhase === 3) {
    if (user.isPremium) return false;
    const allowed = appSettings.freeQuestionTypesPerTest !== undefined ? Number(appSettings.freeQuestionTypesPerTest) : 0;
    return idx >= allowed;
  }
  return false;
}
function checkItemLocked(idx) { return checkSectionLocked(idx); }`;

  content = content.replace(oldCheck, newCheck);

  // 3. Update calls in openPracticeModal
  // For passages: const isLocked = checkItemLocked(idx); -> checkPassageLocked(idx);
  // For sections: const isLocked = checkItemLocked(gIdx); -> checkSectionLocked(gIdx);
  content = content.replace(
    `passages.forEach((p, idx) => {\n    const isLocked = checkItemLocked(idx);`,
    `passages.forEach((p, idx) => {\n    const isLocked = checkPassageLocked(idx);`
  );
  content = content.replace(
    `parts.forEach((p, idx) => {\n    const isLocked = checkItemLocked(idx);`,
    `parts.forEach((p, idx) => {\n    const isLocked = checkPassageLocked(idx);`
  );
  content = content.replace(
    `const isLocked = checkItemLocked(gIdx);`,
    `const isLocked = checkSectionLocked(gIdx);`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${path.basename(filePath)} successfully.`);
}

updateCambridgeFile(readingPath, false);
updateCambridgeFile(listeningPath, true);
