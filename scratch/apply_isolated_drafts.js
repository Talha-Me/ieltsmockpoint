const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Update scripts-listening.js
const listeningPath = path.join(__dirname, '../views/test_pages/listening/scripts-listening.js');
let lCode = fs.readFileSync(listeningPath, 'utf8').replace(/\r\n/g, '\n');

// Update submitTest to clear test-specific draft
const lSubmitNeedle = 'window.location.href = "/mock-test";';
const lSubmitReplacement = `  const currentTestId = (typeof mockID !== "undefined" && mockID) || (typeof parsedQuestionData !== "undefined" && parsedQuestionData.mockNumber) || sessionStorage.getItem("currentMockId") || localStorage.getItem("currentMockId") || "";
  if (currentTestId) {
    try {
      localStorage.removeItem("ielts_draft_listening_" + currentTestId);
      sessionStorage.removeItem("ielts_draft_listening_" + currentTestId);
    } catch(e) {}
  }
  try {
    localStorage.removeItem("listeningDraftAnswers");
    sessionStorage.removeItem("listeningDraftAnswers");
  } catch(e) {}

  window.location.href = "/mock-test";`;

const lSubIdx = lCode.indexOf(lSubmitNeedle);
if (lSubIdx !== -1) {
  lCode = lCode.slice(0, lSubIdx) + lSubmitReplacement + lCode.slice(lSubIdx + lSubmitNeedle.length);
}

// Replace the auto-save section at the end of scripts-listening.js
const lAutoSaveMarker = '// 13. AUTO-SAVE & DRAFT RECOVERY';
const lAutoIdx = lCode.indexOf(lAutoSaveMarker);
if (lAutoIdx === -1) {
  throw new Error('lAutoSaveMarker not found');
}

const newListeningAutoSave = `// 13. AUTO-SAVE & DRAFT RECOVERY (TEST-SPECIFIC ISOLATION)
// ==========================================
let listeningAutoSaveTimer = null;

function getListeningTestId() {
  return (typeof mockID !== "undefined" && mockID) ||
    (typeof parsedQuestionData !== "undefined" && parsedQuestionData && parsedQuestionData.mockNumber) ||
    sessionStorage.getItem("currentMockId") ||
    localStorage.getItem("currentMockId") || "";
}

function autoSaveListeningDraft() {
  try {
    inputCheckUpdated();
    const testId = getListeningTestId();
    if (!testId) return;

    // 1. Test-specific isolated local backup
    const draftKey = "ielts_draft_listening_" + testId;
    const payload = JSON.stringify({
      testId: testId,
      module: "listening",
      updatedAt: Date.now(),
      answers: answerArrayUpdated
    });

    localStorage.setItem(draftKey, payload);
    sessionStorage.setItem(draftKey, payload);

    // Clear legacy generic keys
    localStorage.removeItem("listeningDraftAnswers");
    sessionStorage.removeItem("listeningDraftAnswers");

    // 2. Cloud auto-save if logged in
    const u = JSON.parse(localStorage.getItem("user") || "null");
    const email = u && u.email ? u.email : "";

    fetch("/api/student/auto-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId,
        testType: testId.includes("Premium") ? "Premium Full Mock" : "Academic Full Mock",
        module: "listening",
        answers: answerArrayUpdated,
        email
      })
    }).catch(() => {});
  } catch (e) {
    console.warn("Listening auto-save notice:", e);
  }
}

function restoreListeningDraft() {
  try {
    const testId = getListeningTestId();
    if (!testId) return;

    // Purge legacy generic keys
    localStorage.removeItem("listeningDraftAnswers");
    sessionStorage.removeItem("listeningDraftAnswers");

    const draftKey = "ielts_draft_listening_" + testId;
    const raw = localStorage.getItem(draftKey) || sessionStorage.getItem(draftKey);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    // STRICT VALIDATION: Only restore if draft testId strictly matches current testId
    if (!parsed || parsed.testId !== testId || !parsed.answers) {
      return;
    }

    const draft = parsed.answers;
    if (!draft || typeof draft !== "object") return;

    document.querySelectorAll("input").forEach((input) => {
      const id = input.getAttribute("data-question-id") || input.placeholder;
      if (id && draft[id] && draft[id][0] !== undefined) {
        if (input.type === "text") {
          input.value = draft[id][0];
        } else if (input.type === "radio" || input.type === "checkbox") {
          if (input.value.trim() === draft[id][0]) {
            input.checked = true;
          }
        }
      }
      if (input.name && draft[input.name] && draft[input.name][0] !== undefined) {
        if (input.value.trim() === draft[input.name][0]) {
          input.checked = true;
        }
      }
    });

    document.querySelectorAll('.matching-information').forEach((select) => {
      if (select.id && draft[select.id] && draft[select.id][0] !== undefined) {
        select.value = draft[select.id][0];
      }
    });

    document.querySelectorAll('[data-initial="empty"]').forEach((empty) => {
      if (empty.id && draft[empty.id] && draft[empty.id][0] !== undefined) {
        empty.textContent = draft[empty.id][0];
      }
    });
    console.log("Listening draft restored successfully for " + testId);
  } catch (e) {
    console.warn("Listening draft restore notice:", e);
  }
}

// Start auto-save periodic loop (every 3 minutes)
if (!listeningAutoSaveTimer) {
  listeningAutoSaveTimer = setInterval(autoSaveListeningDraft, 3 * 60 * 1000);
}

// Real-time debounce local save on input change
let listeningDebounceTimeout = null;
document.addEventListener("input", () => {
  if (listeningDebounceTimeout) clearTimeout(listeningDebounceTimeout);
  listeningDebounceTimeout = setTimeout(() => {
    inputCheckUpdated();
    try {
      const testId = getListeningTestId();
      if (!testId) return;
      const draftKey = "ielts_draft_listening_" + testId;
      const payload = JSON.stringify({
        testId: testId,
        module: "listening",
        updatedAt: Date.now(),
        answers: answerArrayUpdated
      });
      localStorage.setItem(draftKey, payload);
      sessionStorage.setItem(draftKey, payload);
    } catch(e) {}
  }, 3000);
});

// Restore on page load if exam was already rendered
setTimeout(restoreListeningDraft, 800);
`;

lCode = lCode.slice(0, lAutoIdx) + newListeningAutoSave;
new vm.Script(lCode);
fs.writeFileSync(listeningPath, lCode, 'utf8');
console.log('scripts-listening.js: updated & validated!');

// 2. Update scripts-reading.js
const readingPath = path.join(__dirname, '../views/test_pages/reading/scripts-reading.js');
let rCode = fs.readFileSync(readingPath, 'utf8').replace(/\r\n/g, '\n');

const rSubmitNeedle = 'window.location.href = "/mock-test";';
const rSubmitReplacement = `  const currentTestId = (typeof mockID !== "undefined" && mockID) || (typeof parsedQuestionData !== "undefined" && parsedQuestionData.mockNumber) || sessionStorage.getItem("currentMockId") || localStorage.getItem("currentMockId") || "";
  if (currentTestId) {
    try {
      localStorage.removeItem("ielts_draft_reading_" + currentTestId);
      sessionStorage.removeItem("ielts_draft_reading_" + currentTestId);
    } catch(e) {}
  }
  try {
    localStorage.removeItem("readingDraftAnswers");
    sessionStorage.removeItem("readingDraftAnswers");
  } catch(e) {}

  window.location.href = "/mock-test";`;

const rSubIdx = rCode.indexOf(rSubmitNeedle);
if (rSubIdx !== -1) {
  rCode = rCode.slice(0, rSubIdx) + rSubmitReplacement + rCode.slice(rSubIdx + rSubmitNeedle.length);
}

// Replace the auto-save section at the end of scripts-reading.js
const rAutoSaveMarker = '// ==========================================\nlet readingAutoSaveTimer = null;';
const rAutoIdx = rCode.indexOf(rAutoSaveMarker);
if (rAutoIdx === -1) {
  throw new Error('rAutoSaveMarker not found');
}

const newReadingAutoSave = `// ==========================================
// AUTO-SAVE & DRAFT RECOVERY (TEST-SPECIFIC ISOLATION)
// ==========================================
let readingAutoSaveTimer = null;

function getReadingTestId() {
  return (typeof mockID !== "undefined" && mockID) ||
    (typeof parsedQuestionData !== "undefined" && parsedQuestionData && parsedQuestionData.mockNumber) ||
    sessionStorage.getItem("currentMockId") ||
    localStorage.getItem("currentMockId") || "";
}

function autoSaveReadingDraft() {
  try {
    inputCheckUpdated();
    const testId = getReadingTestId();
    if (!testId) return;

    // 1. Test-specific isolated local backup
    const draftKey = "ielts_draft_reading_" + testId;
    const payload = JSON.stringify({
      testId: testId,
      module: "reading",
      updatedAt: Date.now(),
      answers: answerArrayUpdated
    });

    localStorage.setItem(draftKey, payload);
    sessionStorage.setItem(draftKey, payload);

    // Clear legacy generic keys
    localStorage.removeItem("readingDraftAnswers");
    sessionStorage.removeItem("readingDraftAnswers");

    // 2. Cloud auto-save if logged in
    const u = JSON.parse(localStorage.getItem("user") || "null");
    const email = u && u.email ? u.email : "";

    fetch("/api/student/auto-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId,
        testType: testId.includes("Premium") ? "Premium Full Mock" : "Academic Full Mock",
        module: "reading",
        answers: answerArrayUpdated,
        email
      })
    }).catch(() => {});
  } catch (e) {
    console.warn("Reading auto-save notice:", e);
  }
}

function restoreReadingDraft() {
  try {
    const testId = getReadingTestId();
    if (!testId) return;

    // Purge legacy generic keys
    localStorage.removeItem("readingDraftAnswers");
    sessionStorage.removeItem("readingDraftAnswers");

    const draftKey = "ielts_draft_reading_" + testId;
    const raw = localStorage.getItem(draftKey) || sessionStorage.getItem(draftKey);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    // STRICT VALIDATION: Only restore if draft testId strictly matches current testId
    if (!parsed || parsed.testId !== testId || !parsed.answers) {
      return;
    }

    const draft = parsed.answers;
    if (!draft || typeof draft !== "object") return;

    document.querySelectorAll("input").forEach((input) => {
      const id = input.placeholder;
      if (id && draft[id] && draft[id][0] !== undefined) {
        if (input.type === "text") {
          input.value = draft[id][0];
        }
      }
      if (input.name && draft[input.name] && draft[input.name][0] !== undefined) {
        if (input.value.trim() === draft[input.name][0]) {
          input.checked = true;
        }
      }
    });

    document.querySelectorAll("select").forEach((select) => {
      const id = select.name;
      if (id && draft[id] && draft[id][0] !== undefined) {
        select.value = draft[select.id][0];
      }
    });
    console.log("Reading draft restored successfully for " + testId);
  } catch (e) {
    console.warn("Reading draft restore notice:", e);
  }
}

// Start auto-save periodic loop (every 3 minutes)
if (!readingAutoSaveTimer) {
  readingAutoSaveTimer = setInterval(autoSaveReadingDraft, 3 * 60 * 1000);
}

// Real-time debounce local save on input change
let readingDebounceTimeout = null;
document.addEventListener("input", () => {
  if (readingDebounceTimeout) clearTimeout(readingDebounceTimeout);
  readingDebounceTimeout = setTimeout(() => {
    inputCheckUpdated();
    try {
      const testId = getReadingTestId();
      if (!testId) return;
      const draftKey = "ielts_draft_reading_" + testId;
      const payload = JSON.stringify({
        testId: testId,
        module: "reading",
        updatedAt: Date.now(),
        answers: answerArrayUpdated
      });
      localStorage.setItem(draftKey, payload);
      sessionStorage.setItem(draftKey, payload);
    } catch(e) {}
  }, 3000);
});

// Restore on page load after rendering questions
setTimeout(restoreReadingDraft, 800);
`;

rCode = rCode.slice(0, rAutoIdx) + newReadingAutoSave;
new vm.Script(rCode);
fs.writeFileSync(readingPath, rCode, 'utf8');
console.log('scripts-reading.js: updated & validated!');

// 3. Update scripts-writing.js
const writingPath = path.join(__dirname, '../views/test_pages/writing/scripts-writing.js');
let wCode = fs.readFileSync(writingPath, 'utf8').replace(/\r\n/g, '\n');

const wAutoSaveMarker = '// AUTO-SAVE & DRAFT RECOVERY (3-MIN CLOUD + REALTIME LOCAL)';
const wAutoIdx = wCode.indexOf(wAutoSaveMarker);
if (wAutoIdx === -1) {
  throw new Error('wAutoSaveMarker not found');
}

const newWritingAutoSave = `// AUTO-SAVE & DRAFT RECOVERY (TEST-SPECIFIC ISOLATION)
// ==========================================
let writingAutoSaveTimer = null;

function getWritingTestId() {
  return (parsedQuestions && parsedQuestions.mockNumber) ||
    (typeof currentMockId !== "undefined" ? currentMockId : "") ||
    sessionStorage.getItem("currentMockId") ||
    localStorage.getItem("currentMockId") || "";
}

function autoSaveWritingDraft() {
  try {
    const testId = getWritingTestId();
    if (!testId) return;

    const writingInputs = typeof gatherInput === "function" ? gatherInput(inputs) : {};
    const draftKey = "ielts_draft_writing_" + testId;
    const payload = JSON.stringify({
      testId: testId,
      module: "writing",
      updatedAt: Date.now(),
      answers: writingInputs
    });

    localStorage.setItem(draftKey, payload);
    sessionStorage.setItem(draftKey, payload);

    localStorage.removeItem("writingDraftAnswers");
    sessionStorage.removeItem("writingDraftAnswers");

    const u = JSON.parse(localStorage.getItem("user") || "null");
    const email = u && u.email ? u.email : "";

    fetch("/api/student/auto-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId,
        testType: testId.includes("Premium") ? "Premium Full Mock" : "Academic Full Mock",
        module: "writing",
        answers: writingInputs,
        email
      })
    }).catch(() => {});
  } catch (e) {
    console.warn("Writing auto-save notice:", e);
  }
}

function restoreWritingDraft() {
  try {
    const testId = getWritingTestId();
    if (!testId) return;

    localStorage.removeItem("writingDraftAnswers");
    sessionStorage.removeItem("writingDraftAnswers");

    const draftKey = "ielts_draft_writing_" + testId;
    const raw = localStorage.getItem(draftKey) || sessionStorage.getItem(draftKey);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!parsed || parsed.testId !== testId || !parsed.answers) {
      return;
    }

    const draft = parsed.answers;
    if (!draft || typeof draft !== "object") return;

    inputs.forEach((input, index) => {
      const val = draft[\`part-\${index + 1}\`];
      if (val && !input.value) {
        input.value = val;
        input.dispatchEvent(new Event("input"));
      }
    });
    console.log("Writing draft restored successfully for " + testId);
  } catch (e) {
    console.warn("Writing draft restore notice:", e);
  }
}

// Start auto-save periodic loop (every 3 minutes)
if (!writingAutoSaveTimer) {
  writingAutoSaveTimer = setInterval(autoSaveWritingDraft, 3 * 60 * 1000);
}

// Real-time debounce local save on writing input
let writingDebounceTimeout = null;
document.addEventListener("input", (e) => {
  if (e.target && e.target.classList && e.target.classList.contains("write-input")) {
    if (writingDebounceTimeout) clearTimeout(writingDebounceTimeout);
    writingDebounceTimeout = setTimeout(() => {
      try {
        const testId = getWritingTestId();
        if (!testId) return;
        const writingInputs = typeof gatherInput === "function" ? gatherInput(inputs) : {};
        const draftKey = "ielts_draft_writing_" + testId;
        const payload = JSON.stringify({
          testId: testId,
          module: "writing",
          updatedAt: Date.now(),
          answers: writingInputs
        });
        localStorage.setItem(draftKey, payload);
        sessionStorage.setItem(draftKey, payload);
      } catch(e) {}
    }, 2000);
  }
});

setTimeout(restoreWritingDraft, 600);
`;

wCode = wCode.slice(0, wAutoIdx) + newWritingAutoSave;
new vm.Script(wCode);
fs.writeFileSync(writingPath, wCode, 'utf8');
console.log('scripts-writing.js: updated & validated!');
