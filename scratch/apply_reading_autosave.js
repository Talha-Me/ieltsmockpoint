const fs = require('fs');

const path = 'D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js';
let content = fs.readFileSync(path, 'utf8');

const readingAutoSaveCode = `
// ==========================================
// AUTO-SAVE & DRAFT RECOVERY (3-MIN CLOUD + REALTIME LOCAL)
// ==========================================
let readingAutoSaveTimer = null;

function autoSaveReadingDraft() {
  try {
    inputCheckUpdated();
    // 1. Local backup for instant recovery
    localStorage.setItem("readingDraftAnswers", JSON.stringify(answerArrayUpdated));
    sessionStorage.setItem("readingDraftAnswers", JSON.stringify(answerArrayUpdated));

    // 2. Cloud auto-save if logged in
    const u = JSON.parse(localStorage.getItem("user") || "null");
    const email = u && u.email ? u.email : "";
    const testId = (parsedQuestionData && parsedQuestionData.mockNumber) || "full-mock";

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
    const raw = localStorage.getItem("readingDraftAnswers") || sessionStorage.getItem("readingDraftAnswers");
    if (!raw) return;
    const draft = JSON.parse(raw);
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
        select.value = draft[id][0];
      }
    });
    console.log("Reading draft restored successfully.");
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
      localStorage.setItem("readingDraftAnswers", JSON.stringify(answerArrayUpdated));
      sessionStorage.setItem("readingDraftAnswers", JSON.stringify(answerArrayUpdated));
    } catch(e) {}
  }, 3000);
});

// Restore on page load after rendering questions
setTimeout(restoreReadingDraft, 800);
`;

if (!content.includes('autoSaveReadingDraft')) {
  // Clear draft on submitTest
  const targetSubmit = 'sessionStorage.setItem("readingIsCompleted", "true");';
  const newSubmit = 'sessionStorage.setItem("readingIsCompleted", "true");\n  try { localStorage.removeItem("readingDraftAnswers"); sessionStorage.removeItem("readingDraftAnswers"); } catch(e) {}';
  content = content.replace(targetSubmit, newSubmit);

  content = content + '\n' + readingAutoSaveCode;
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully added auto-save & recovery to scripts-reading.js');
} else {
  console.log('scripts-reading.js already has autoSaveReadingDraft');
}
