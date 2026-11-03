const fs = require('fs');

const path = 'D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js';
let content = fs.readFileSync(path, 'utf8');

// Listening Auto-Save & Recovery code to append at the end of active section
const listeningAutoSaveCode = `
// ==========================================
// 13. AUTO-SAVE & DRAFT RECOVERY (3-MIN CLOUD + REALTIME LOCAL)
// ==========================================
let listeningAutoSaveTimer = null;

function autoSaveListeningDraft() {
  try {
    inputCheckUpdated();
    // 1. Local backup for instant recovery
    localStorage.setItem("listeningDraftAnswers", JSON.stringify(answerArrayUpdated));
    sessionStorage.setItem("listeningDraftAnswers", JSON.stringify(answerArrayUpdated));

    // 2. Cloud auto-save if logged in
    const u = JSON.parse(localStorage.getItem("user") || "null");
    const email = u && u.email ? u.email : "";
    const testId = mockID || (parsedQuestionData && parsedQuestionData.mockNumber) || "full-mock";

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
    const raw = localStorage.getItem("listeningDraftAnswers") || sessionStorage.getItem("listeningDraftAnswers");
    if (!raw) return;
    const draft = JSON.parse(raw);
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
    console.log("Listening draft restored successfully.");
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
      localStorage.setItem("listeningDraftAnswers", JSON.stringify(answerArrayUpdated));
      sessionStorage.setItem("listeningDraftAnswers", JSON.stringify(answerArrayUpdated));
    } catch(e) {}
  }, 3000);
});

// Restore on page load if exam was already rendered
setTimeout(restoreListeningDraft, 800);
`;

if (!content.includes('autoSaveListeningDraft')) {
  // Clear draft on submitTest
  const targetSubmit = 'sessionStorage.setItem("listeningIscompleted", "true");';
  const newSubmit = 'sessionStorage.setItem("listeningIscompleted", "true");\n  try { localStorage.removeItem("listeningDraftAnswers"); sessionStorage.removeItem("listeningDraftAnswers"); } catch(e) {}';
  content = content.replace(targetSubmit, newSubmit);

  content = content + '\n' + listeningAutoSaveCode;
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully added auto-save & recovery to scripts-listening.js');
} else {
  console.log('scripts-listening.js already has autoSaveListeningDraft');
}
