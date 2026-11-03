const fs = require('fs');
const vm = require('vm');

const path = 'D:/personal websites/ieltsmockpoint/views/test_pages/writing/scripts-writing.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace the record-test call inside showFinalComprehensiveResultModal
const oldRecordBlock = `      // Auto-record to student dashboard if logged in
      try {
        fetch('/api/student/record-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            testType: 'full-mock',
            testId: (typeof currentMockId !== 'undefined' ? currentMockId : 'Full-Mock'),
            title: 'IELTS Full Mock Test',
            listeningScore: typeof listeningCorrect !== 'undefined' ? listeningCorrect : null,
            readingScore: typeof readingCorrect !== 'undefined' ? readingCorrect : null,
            writingScore: wBandNum,
            listeningBand: lBand,
            readingBand: rBand,
            writingBand: wBandNum,
            overallBand: parseFloat(overall) || null,
            totalWords: (tasks[0]?.words || 0) + (tasks[1]?.words || 0)
          })
        }).catch(() => {});
      } catch (e) {}`;

const newRecordBlock = `      // Auto-record full test results with 1-40 review & AI evaluation to student dashboard
      try {
        const uObj = JSON.parse(localStorage.getItem("user") || "null");
        const uEmail = uObj && uObj.email ? uObj.email : "";
        const mId = (parsedQuestions && parsedQuestions.mockNumber) || (typeof currentMockId !== 'undefined' ? currentMockId : 'Full-Mock');
        const isPrem = mId.includes("Premium");
        const mTitle = isPrem ? mId.replace(/-UKA-FINAL-/i, " Premium Mock ") : mId.replace(/-UKA-FINAL-/i, " Academic Mock ");

        fetch('/api/student/record-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            testType: isPrem ? 'Premium Full Mock' : 'Academic Full Mock',
            testId: mId,
            title: mTitle,
            email: uEmail,
            totalQuestions: 80,
            listeningScore: typeof listeningCorrect !== 'undefined' ? listeningCorrect : null,
            readingScore: typeof readingCorrect !== 'undefined' ? readingCorrect : null,
            writingScore: wBandNum,
            listeningBand: lBand,
            readingBand: rBand,
            writingBand: wBandNum,
            overallBand: parseFloat(overall) || null,
            totalWords: (tasks[0]?.words || 0) + (tasks[1]?.words || 0),
            feedback: {
              task1: task1 || null,
              task2: task2 || null,
              final_band: final_band || wBandNum,
              tasksData: tasks
            },
            mistakes: {
              listening: listeningResults || [],
              reading: readingResults || []
            },
            answers: {
              listening: listeningAnswers || {},
              reading: readingAnswers || {},
              writing: writingData || {}
            }
          })
        }).then(() => {
          try {
            localStorage.removeItem("writingDraftAnswers");
            sessionStorage.removeItem("writingDraftAnswers");
          } catch(e) {}
        }).catch(err => console.warn("Dashboard sync error:", err));
      } catch (e) {
        console.warn("Record test error:", e);
      }`;

if (!content.includes(oldRecordBlock)) {
  throw new Error('oldRecordBlock not found in scripts-writing.js');
}
content = content.replace(oldRecordBlock, newRecordBlock);

// 2. Writing Auto-Save and Draft Recovery
const writingAutoSaveCode = `
// ==========================================
// AUTO-SAVE & DRAFT RECOVERY (3-MIN CLOUD + REALTIME LOCAL)
// ==========================================
let writingAutoSaveTimer = null;

function autoSaveWritingDraft() {
  try {
    const writingInputs = typeof gatherInput === "function" ? gatherInput(inputs) : {};
    localStorage.setItem("writingDraftAnswers", JSON.stringify(writingInputs));
    sessionStorage.setItem("writingDraftAnswers", JSON.stringify(writingInputs));

    const u = JSON.parse(localStorage.getItem("user") || "null");
    const email = u && u.email ? u.email : "";
    const testId = (parsedQuestions && parsedQuestions.mockNumber) || (typeof currentMockId !== "undefined" ? currentMockId : "full-mock");

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
    const raw = localStorage.getItem("writingDraftAnswers") || sessionStorage.getItem("writingDraftAnswers");
    if (!raw) return;
    const draft = JSON.parse(raw);
    if (!draft || typeof draft !== "object") return;

    inputs.forEach((input, index) => {
      const val = draft[\`part-\${index + 1}\`];
      if (val && !input.value) {
        input.value = val;
        input.dispatchEvent(new Event("input"));
      }
    });
    console.log("Writing draft restored successfully.");
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
        const writingInputs = typeof gatherInput === "function" ? gatherInput(inputs) : {};
        localStorage.setItem("writingDraftAnswers", JSON.stringify(writingInputs));
        sessionStorage.setItem("writingDraftAnswers", JSON.stringify(writingInputs));
      } catch(e) {}
    }, 2000);
  }
});

// Restore draft after textareas are initialized
setTimeout(restoreWritingDraft, 600);
`;

if (!content.includes('autoSaveWritingDraft')) {
  content = content + '\n' + writingAutoSaveCode;
}

new vm.Script(content);
console.log('scripts-writing.js: Syntax OK!');

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated scripts-writing.js!');
