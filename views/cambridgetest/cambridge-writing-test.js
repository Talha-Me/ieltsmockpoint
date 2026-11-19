// State variables
let totalParts = 2;
let availableParts = [1, 2];
let currentPart = 1;
let elapsedSeconds = 0;
let timerInterval = null;
let singleTaskMode = null;

// ==========================================
// PHASE & ACCESS CONTROL ENGINE (Phase 2 & Phase 3)
// ==========================================
let appPhase = 1;
let appSettings = {};
let appSettingsLoaded = false;

async function fetchSystemPhase() {
  try {
    const res = await fetch('/api/system-settings');
    const data = await res.json();
    if (data && data.success && data.settings) {
      appPhase = Number(data.settings.currentPhase) || 1;
      appSettings = data.settings || {};
      appSettingsLoaded = true;
    }
  } catch (e) {
    console.warn('Could not fetch system settings, defaulting to phase 1:', e);
  }
}

function getUserAccessState() {
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    if (!u || (!u.email && !u.name)) {
      return { isLoggedIn: false, isPremium: false };
    }
    const isPremium = !!(u.isPremium || u.role === 'admin' || u.plan === 'premium');
    return { isLoggedIn: true, isPremium };
  } catch (e) {
    return { isLoggedIn: false, isPremium: false };
  }
}

function isCurrentSessionLocked(bookNum, testNum, taskMode) {
  if (appPhase === 1) return false;
  const user = getUserAccessState();
  if (appPhase === 2 && user.isLoggedIn) return false;
  if (appPhase === 3 && user.isPremium) return false;

  const freePartsAllowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;

  if (taskMode === 1 || taskMode === 2) {
    // Single task (Part) practice mode is gated in Phase 2/3
    if (Number(taskMode) > freePartsAllowed) return true;
  }
  // Full Cambridge Writing Test mode stays free across Phase 1/2/3
  return false;
}

function openTestUnlockModal() {
  const modal = document.getElementById('psUnlockModal');
  if (!modal) return;

  const iconWrap = document.getElementById('psUnlockIconWrap');
  const tagBadge = document.getElementById('psUnlockBadge');
  const titleEl = document.getElementById('psUnlockTitle');
  const descEl = document.getElementById('psUnlockDesc');
  const primaryBtn = document.getElementById('psUnlockPrimaryBtn');
  const secondaryAction = document.getElementById('psUnlockSecondaryAction');

  const currUrl = encodeURIComponent(window.location.pathname + window.location.search);

  if (appPhase === 3) {
    if (iconWrap) {
      iconWrap.style.background = 'rgba(224, 32, 45, 0.08)';
      iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
      iconWrap.style.color = '#e0202d';
      iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#fee2e2';
      tagBadge.style.color = '#b91c1c';
      tagBadge.style.border = '1px solid #fca5a5';
      tagBadge.textContent = 'PREMIUM PLAN REQUIRED';
    }
    if (titleEl) titleEl.textContent = 'Unlock with Premium Access';
    if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium to access all Cambridge Writing tests, Task 1 and Task 2 separate practice, and instant AI examiner evaluations.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.href = '/pricing';
      primaryBtn.innerHTML = '<span>Upgrade to Premium / Buy Pass</span> &rarr;';
    }
    if (secondaryAction) {
      const u = getUserAccessState();
      if (!u.isLoggedIn) {
        secondaryAction.innerHTML = `<a href="/login?redirect=${currUrl}" style="font-size:0.86rem; color:#1565c9; text-decoration:none; font-weight:600;">Already have a paid account? <span style="text-decoration:underline;">Sign In</span></a>`;
        secondaryAction.style.display = 'block';
      } else {
        secondaryAction.style.display = 'none';
      }
    }
  } else {
    if (iconWrap) {
      iconWrap.style.background = '#fdecee';
      iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
      iconWrap.style.color = '#e0202d';
      iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#fdecee';
      tagBadge.style.color = '#e0202d';
      tagBadge.style.border = '1px solid rgba(224, 32, 45, 0.25)';
      tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
    }
    if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
    if (descEl) descEl.textContent = 'Please log in or register a free candidate account to take this Cambridge Writing session and save your writing report.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.href = `/login?redirect=${currUrl}`;
      primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
    }
    if (secondaryAction) {
      secondaryAction.style.display = 'none';
    }
  }

  modal.classList.add('open');
}

function closeTestUnlockModal() {
  const m = document.getElementById('psUnlockModal');
  if (m) m.classList.remove('open');
}
window.openTestUnlockModal = openTestUnlockModal;
window.closeTestUnlockModal = closeTestUnlockModal;
 // null = full test, 1 = task 1 only, 2 = task 2 only

const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("previous-button");
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

// 1. Initial Data Loading & Mode Handling
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const user = await userData();
    const userDiv = document.getElementById("userID");
    if (userDiv && user && user.username) {
      userDiv.textContent = user.username;
    }
  } catch (err) {
    console.warn("Could not load user data:", err);
  }

  await loadQuestions();
});

async function userData() {
  try {
    const res = await fetch("/api/user-data");
    if (res.ok) return await res.json();
  } catch (e) {
    return null;
  }
}

async function loadQuestions() {
  try {
    let questions = [];

    // URL theke book, testNo ebong task query param check kora
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check both 'task' and 'part' parameter
    const taskParam = urlParams.get("task") || urlParams.get("part");

    if (taskParam === "1" || taskParam === "2") {
      singleTaskMode = parseInt(taskParam);
    } else {
      singleTaskMode = null;
    }

    const modeTextEl = document.getElementById("writingModeText");
    if (modeTextEl) {
      if (singleTaskMode === 1) modeTextEl.textContent = "Task 1 Practice Only";
      else if (singleTaskMode === 2) modeTextEl.textContent = "Task 2 Practice Only";
      else modeTextEl.textContent = "Full Writing Mock Test";
    }

    // Dynamic SEO Browser Title
    try {
      const bVal = bookParam || "12";
      const tVal = testParam || "1";
      if (singleTaskMode === 1) {
        document.title = `Cambridge IELTS ${bVal} Writing Task 1 Practice (Model Answers) | IELTS Mockpoint`;
      } else if (singleTaskMode === 2) {
        document.title = `Cambridge IELTS ${bVal} Writing Task 2 Practice (Band 9 Sample Answers) | IELTS Mockpoint`;
      } else {
        document.title = `Cambridge IELTS ${bVal} Writing Test ${tVal} (Sample Answers & Band Feedback) | IELTS Mockpoint`;
      }
    } catch(e) {}

    if (pathParts.includes("writing") && pathParts.length >= 4) {
      const book = pathParts[2];
      const testNo = pathParts[3];

      const bookBadgeEl = document.getElementById("testBookBadge");
      const titleBadgeEl = document.getElementById("testTitleBadge");
      if (bookBadgeEl) bookBadgeEl.textContent = `Cambridge ${book}`;
      if (titleBadgeEl) titleBadgeEl.textContent = `Academic Writing Test ${testNo}`;

      const res = await fetch(`/api/cambridge-writing-test-data/${book}/${testNo}`);
      const result = await res.json();

      if (result.success && result.data?.writing?.questions) {
        questions = result.data.writing.questions;
        const userDiv = document.getElementById("userID");
        if (userDiv && result.data.title) {
          userDiv.textContent = result.data.title;
        }
      }
    }

    // Fallback: LocalStorage check
    if (questions.length === 0) {
      const questionData = localStorage.getItem("data");
      if (questionData) {
        const parsed = JSON.parse(questionData);
        questions = parsed.writing ? parsed.writing.questions : [];
      }
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      console.warn("No writing questions loaded.");
      return;
    }

    // DOM Elements
    const p1Container = document.getElementById("part-1");
    const p2Container = document.getElementById("part-2");
    const tab1 = document.getElementById("nav-tab-1");
    const tab2 = document.getElementById("nav-tab-2");
    const bottomNav = document.getElementById("bottom-navbar");
    const navBtns = document.getElementById("nav-buttons-container");

    // Single Task Mode Handling (Task 1 ba Task 2)
    if (singleTaskMode === 1) {
      availableParts = [1];
      if (p2Container) p2Container.remove(); // Task 2 DOM theke soriye fela
      if (tab2) tab2.style.display = "none";
      if (bottomNav) bottomNav.style.display = "none";
      if (navBtns) navBtns.style.display = "none";
    } else if (singleTaskMode === 2) {
      availableParts = [2];
      if (p1Container) p1Container.remove(); // Task 1 DOM theke soriye fela
      if (tab1) tab1.style.display = "none";
      if (bottomNav) bottomNav.style.display = "none";
      if (navBtns) navBtns.style.display = "none";
    } else {
      // Full Test Mode (Both Tasks Active)
      availableParts = [1, 2];
      if (p1Container) p1Container.style.display = "block";
      if (p2Container) p2Container.style.display = "none";
      if (tab1) tab1.style.display = "inline-block";
      if (tab2) tab2.style.display = "inline-block";
      if (bottomNav) bottomNav.style.display = "flex";
      if (navBtns) navBtns.style.display = "flex";
    }

    totalParts = availableParts.length;

    // Prompts and Images Render Kora
    questions.forEach((q) => {
      const partNum = parseInt(q.part);
      const infoPanel = document.getElementById(`info-panel-${partNum}`);
      if (!infoPanel) return;

      infoPanel.innerHTML = "";

      if (q.question) {
        infoPanel.innerHTML += `<div class="question-prompt mb-3" style="font-size: 15px; line-height: 1.7; white-space: pre-line;">${q.question}</div>`;
      }

      if (Array.isArray(q.image) && q.image.length > 0) {
        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container my-2 text-center";
        q.image.forEach((img) => {
          if (img && img.trim()) {
            imageContainer.innerHTML += `<img src="${img}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px; border: 1px solid var(--line);">`;
          }
        });
        infoPanel.appendChild(imageContainer);
      }
    });

    // Initial Part Display
    currentPart = availableParts[0] || 1;
    showPart(currentPart);

  } catch (e) {
    console.error("Error setting up questions:", e);
  }
}

function showPart(part) {
  // Jodi single mode hoy, oi part chara switch hobena
  if (singleTaskMode && singleTaskMode !== part) return;

  [1, 2].forEach((p) => {
    const el = document.getElementById(`part-${p}`);
    const tab = document.getElementById(`nav-tab-${p}`);
    if (el) el.style.display = p === part ? "block" : "none";
    if (tab) {
      if (p === part) tab.classList.add("active");
      else tab.classList.remove("active");
    }
  });

  currentPart = part;
  updateNavButtons();
}

// 2. Count-Up Timer
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    if (minutesDisplay) minutesDisplay.textContent = String(minutes).padStart(2, "0");
    if (secondsDisplay) secondsDisplay.textContent = String(seconds).padStart(2, "0");
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

// 3. Start Popup Logic
function closeListeningPopup() {
  const overlay = document.getElementById("listeningOverlay");
  if (overlay) overlay.style.display = "none";
  startTimer();
}

// 4. Manual Fullscreen Toggle
const fullscreenBtn = document.getElementById("fullscreenToggleBtn");
function syncFullscreenIcon() {
  if (!fullscreenBtn) return;
  const icon = fullscreenBtn.querySelector("i");
  const isFs = !!document.fullscreenElement;
  if (icon) {
    icon.className = isFs ? "bi bi-fullscreen-exit" : "bi bi-arrows-fullscreen";
  } else {
    fullscreenBtn.className = isFs
      ? "bi bi-fullscreen-exit btn-flat"
      : "bi bi-arrows-fullscreen btn-flat";
  }
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen error:", err);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    syncFullscreenIcon();
  });
}

document.addEventListener("fullscreenchange", syncFullscreenIcon);

// 5. Part Navigation Logic

function showNext(event) {
  if (event) event.preventDefault();
  const currentIndex = availableParts.indexOf(currentPart);
  if (currentIndex < availableParts.length - 1) {
    showPart(availableParts[currentIndex + 1]);
  }
}

function showPrevious(event) {
  if (event) event.preventDefault();
  const currentIndex = availableParts.indexOf(currentPart);
  if (currentIndex > 0) {
    showPart(availableParts[currentIndex - 1]);
  }
}

function updateNavButtons() {
  if (!nextButton || !prevButton) return;
  const currentIndex = availableParts.indexOf(currentPart);

  if (currentIndex >= availableParts.length - 1) {
    nextButton.classList.add("bton-grey");
  } else {
    nextButton.classList.remove("bton-grey");
  }

  if (currentIndex <= 0) {
    prevButton.classList.add("bton-grey");
  } else {
    prevButton.classList.remove("bton-grey");
  }
}

// 6. Word Count Handlers
function setupWordCounter(textareaId, counterId) {
  const textarea = document.getElementById(textareaId);
  const counter = document.getElementById(counterId);
  if (!textarea || !counter) return;

  textarea.addEventListener("input", () => {
    const text = textarea.value.trim();
    const count = text === "" ? 0 : text.split(/\s+/).length;
    counter.textContent = `Word Count: ${count}`;
  });
}
setupWordCounter("writer-1", "wordCount-1");
setupWordCounter("writer-2", "wordCount-2");

// 7. Settings & Notes Popup
const popupSettings = document.getElementById("popup-settings");
const popupNote = document.getElementById("popup-note");

function settingsMenu() {
  if (popupSettings) popupSettings.classList.toggle("menu-visible");
}
function closeSettings() {
  if (popupSettings) popupSettings.classList.remove("menu-visible");
  if (popupNote) popupNote.classList.remove("menu-visible");
}
function openNotes() {
  if (popupNote) popupNote.classList.toggle("menu-visible");
}
function changeFontSize(size) {
  document.querySelectorAll(".write-input, #notesArea").forEach((input) => {
    input.style.fontSize = size;
  });
}

// 8. Submit Modal Handlers
const submitBtn = document.getElementById("finishBtn");
const submitModal = document.getElementById("submit-warning-modal");
const submitOkButton = document.getElementById("submit-ok-btn");
const submitStayButton = document.getElementById("submit-stay-btn");

if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (submitModal) submitModal.style.display = "flex";
  });
}
if (submitStayButton) {
  submitStayButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (submitModal) submitModal.style.display = "none";
  });
}
if (submitOkButton) {
  submitOkButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (submitModal) submitModal.style.display = "none";
    await submitTest();
  });
}

// 9. Submission & Dynamic AI Prompt Generation
let isWritingSubmitted = false;

function autoSaveCambridgeWriting(isExit = false) {
  if (isWritingSubmitted) return;
  try {
    const t1 = document.getElementById("writer-1") ? document.getElementById("writer-1").value.trim() : "";
    const t2 = document.getElementById("writer-2") ? document.getElementById("writer-2").value.trim() : "";
    if (!t1 && !t2) return;

    const u = JSON.parse(localStorage.getItem("user") || "null");
    const email = u && u.email ? u.email : "";

    const payload = JSON.stringify({
      email,
      testType: 'Cambridge Writing',
      module: 'writing',
      testId: `cambridge-writing-${book}-${testNo}`,
      title: `Cambridge ${book} Test ${testNo} Writing`,
      answers: { "part-1": t1, "part-2": t2 }
    });

    if (isExit && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/student/auto-save", blob);
    }

    fetch("/api/student/auto-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      credentials: "include",
      keepalive: Boolean(isExit)
    }).catch(() => {});
  } catch (e) {}
}

setInterval(autoSaveCambridgeWriting, 60 * 1000);
window.addEventListener("pagehide", () => autoSaveCambridgeWriting(true));
window.addEventListener("beforeunload", () => autoSaveCambridgeWriting(true));

async function submitTest() {
  isWritingSubmitted = true;
  stopTimer();

  const task1Input = document.getElementById("writer-1") ? document.getElementById("writer-1").value.trim() : "";
  const task2Input = document.getElementById("writer-2") ? document.getElementById("writer-2").value.trim() : "";

  const submissionPayload = {
    "part-1": task1Input,
    "part-2": task2Input,
    timeSpentSeconds: elapsedSeconds,
    submittedAt: new Date().toISOString()
  };

  try {
    await fetch("/api/update-mock-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ writingInputs: submissionPayload, mod: "writing" })
    });
  } catch (err) {
    console.error("Submission API error:", err);
  }

  showDynamicAIResultModal(submissionPayload);
}

// ==========================================
// 10. AI Evaluation Modal (AUTO EVALUATION FOR BOTH SINGLE & FULL MODES)
// ==========================================
function showDynamicAIResultModal(data) {
  const existingModal = document.getElementById("instant-result-modal");
  if (existingModal) existingModal.remove();

  const task1Text = data["part-1"] ? data["part-1"].trim() : "";
  const task2Text = data["part-2"] ? data["part-2"].trim() : "";

  const minutesSpent = Math.floor(elapsedSeconds / 60);
  const secondsSpent = elapsedSeconds % 60;
  const formattedTime = `${String(minutesSpent).padStart(2, "0")}:${String(secondsSpent).padStart(2, "0")}`;

  // প্রশ্ন সংগ্রহ (যদি DOM বা অবজেক্টে থাকে)
  let q1Text = "";
  let q2Text = "";
  try {
    const p1El = document.getElementById("info-panel-1");
    const p2El = document.getElementById("info-panel-2");
    if (p1El) q1Text = p1El.innerText.trim();
    if (p2El) q2Text = p2El.innerText.trim();
  } catch (e) {}

  let promptContent = "";
  let reviewSectionHtml = "";

  // Scenario A: Only Task 1 Practice
  if (singleTaskMode === 1) {
    promptContent = `You are a certified IELTS Writing Examiner. Evaluate my Task 1 response:
Topic: ${q1Text || "IELTS Writing Task 1"}
Submission:
${task1Text}`;

    reviewSectionHtml = `
      <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:18px; margin-bottom:16px;">
        <strong style="color:var(--navy); font-size:14px; display:block; margin-bottom:8px;">Task 1 Response (${task1Text.split(/\s+/).filter(Boolean).length} words):</strong>
        <textarea readonly style="width:100%; min-height:100px; padding:10px; font-size:13px; border-radius:8px; border:1px solid #cbd5e1; background:#f8fafc; color:#334155; line-height:1.5;">${task1Text || "(No submission)"}</textarea>
      </div>
    `;
  }
  // Scenario B: Only Task 2 Practice
  else if (singleTaskMode === 2) {
    promptContent = `You are a certified IELTS Writing Examiner. Evaluate my Task 2 response:
Topic: ${q2Text || "IELTS Writing Task 2"}
Submission:
${task2Text}`;

    reviewSectionHtml = `
      <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:18px; margin-bottom:16px;">
        <strong style="color:var(--navy); font-size:14px; display:block; margin-bottom:8px;">Task 2 Response (${task2Text.split(/\s+/).filter(Boolean).length} words):</strong>
        <textarea readonly style="width:100%; min-height:120px; padding:10px; font-size:13px; border-radius:8px; border:1px solid #cbd5e1; background:#f8fafc; color:#334155; line-height:1.5;">${task2Text || "(No submission)"}</textarea>
      </div>
    `;
  }
  // Scenario C: Full Test (Both Task 1 & Task 2)
  else {
    promptContent = `You are a certified IELTS Writing Examiner. Evaluate both tasks:
Task 1:
${task1Text}
Task 2:
${task2Text}`;

    reviewSectionHtml = `
      <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:12px;">
        <strong style="color:var(--navy); font-size:13.5px; display:block; margin-bottom:6px;">Task 1 Response (${task1Text.split(/\s+/).filter(Boolean).length} words):</strong>
        <textarea readonly style="width:100%; min-height:80px; padding:8px; font-size:13px; border-radius:8px; border:1px solid #cbd5e1; background:#f8fafc; color:#334155; line-height:1.5;">${task1Text || "(No submission)"}</textarea>
      </div>
      <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:16px;">
        <strong style="color:var(--navy); font-size:13.5px; display:block; margin-bottom:6px;">Task 2 Response (${task2Text.split(/\s+/).filter(Boolean).length} words):</strong>
        <textarea readonly style="width:100%; min-height:100px; padding:8px; font-size:13px; border-radius:8px; border:1px solid #cbd5e1; background:#f8fafc; color:#334155; line-height:1.5;">${task2Text || "(No submission)"}</textarea>
      </div>
    `;
  }

  const modalHtml = `
    <div id="instant-result-modal" style="position:fixed; inset:0; background:rgba(11,43,82,0.85); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:999999; font-family:'Sora', -apple-system, sans-serif;">
      <div style="background:#ffffff; border-radius:18px; max-width:840px; width:95%; max-height:92vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.35); border:1px solid #e3e9f3;">
        
        <!-- Header -->
        <div style="background:var(--navy, #0b2b52); color:white; padding:20px 28px; position:relative; box-shadow:inset 0 -3px 0 var(--red, #e0202d);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <h2 style="margin:0; font-size:20px; font-weight:700;">🎉 Test Completed! (${singleTaskMode ? 'Task ' + singleTaskMode + ' Practice' : 'Full Writing Test'})</h2>
              <p style="margin:4px 0 0; opacity:0.85; font-size:13px;">Official IELTS Examiner AI Assessment</p>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
              <span id="ai-band-badge" style="background:var(--red, #e0202d); color:#fff; padding:6px 16px; border-radius:30px; font-weight:800; font-size:15px;">
                Band: Calculating...
              </span>
              <div style="background:rgba(255,255,255,0.12); padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">
                ⏱️ Time: <span style="color:#38bdf8;">${formattedTime}</span>
              </div>
              <button type="button" id="modal-close-x" onclick="previewWritingOnPage()" style="background:rgba(255,255,255,0.15); border:none; color:#ffffff; font-size:20px; font-weight:700; border-radius:50%; width:34px; height:34px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; margin-left:4px;" title="Close and Preview on Test Page">&times;</button>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div style="padding:22px 28px; overflow-y:auto; flex:1; background:#f8fafc;">
          
          <!-- Clean Preview Notice Banner -->
          <div style="background:linear-gradient(135deg, #eff6ff, #f0fdf4); border:1.5px solid #bcd9fb; border-radius:12px; padding:12px 16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <strong style="color:var(--navy, #0b2b52); font-size:13px; display:block; margin-bottom:2px;">📝 Want a full-page scrollable review?</strong>
              <span style="font-size:12px; color:#475569;">Preview your submitted writing side-by-side with mistakes, upgrades &amp; Band 9 sample answer right on the test page.</span>
            </div>
            <button type="button" onclick="previewWritingOnPage()" style="background:#1565c9; color:#fff; border:none; padding:7px 15px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 8px rgba(21,101,201,0.25);">
              Preview Your Writing &darr;
            </button>
          </div>

          <!-- AI Assessment Results Box -->
          <div id="ai-cambridge-results-container" style="margin-bottom:18px;">
            <div style="background:#fff; border:1px solid #cbd5e1; border-left:5px solid var(--navy, #0b2b52); border-radius:12px; padding:20px; text-align:center; color:var(--navy, #0b2b52); font-weight:600; font-size:14px;">
              ⏳ Evaluating your submission with IELTS Examiner AI... Please wait (2-3 seconds).
            </div>
          </div>

          <!-- Quick Open AI Evaluators -->
          <div style="margin-bottom:16px; background:#f1f5f9; padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div style="font-size:12px; font-weight:700; color:#475569; text-transform:uppercase;">
              Alternative External AI:
            </div>
            <div style="display:flex; gap:8px;">
              <a href="https://chatgpt.com" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#10a37f; color:#fff; padding:5px 12px; border-radius:6px; font-size:12px; font-weight:700;">
                <i class="bi bi-robot"></i> ChatGPT
              </a>
              <a href="https://gemini.google.com" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#1a73e8; color:#fff; padding:5px 12px; border-radius:6px; font-size:12px; font-weight:700;">
                <i class="bi bi-stars"></i> Gemini
              </a>
              <a href="https://claude.ai" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#cc785c; color:#fff; padding:5px 12px; border-radius:6px; font-size:12px; font-weight:700;">
                <i class="bi bi-chat-left-dots"></i> Claude
              </a>
            </div>
          </div>

          <!-- Student Written Text Review Box -->
          ${reviewSectionHtml}

        </div>

        <!-- Footer Actions -->
        <div style="padding:14px 28px; background:#ffffff; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <button id="copy-ai-btn" style="background:#fff; color:var(--navy, #0b2b52); border:1.5px solid var(--navy, #0b2b52); padding:8px 16px; border-radius:8px; font-size:12.5px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <i class="bi bi-clipboard-check"></i> Copy Prompt
          </button>
          
          <button type="button" id="preview-writing-modal-btn" onclick="previewWritingOnPage()" style="background:linear-gradient(135deg, #1565c9, #0b2b52); color:#ffffff; border:none; padding:10px 22px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:7px; box-shadow:0 4px 14px rgba(11,43,82,0.25); transition:all 0.2s;">
            <span>📝</span> Preview Your Writing &amp; Detailed Review &darr;
          </button>

          <button id="finish-home-btn" style="background:#0f172a; color:#fff; border:none; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
            Return to Practice
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  function escHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Helper function to render a task's 4-criteria + examiner feedback card
  function renderTaskCard(evalData, title, taskNo) {
    const isT1 = taskNo === 1;
    const crit1 = isT1 ? "Task Achievement" : "Task Response";

    if (evalData && evalData.not_submitted) {
      return `
        <div style="background:#ffffff; border-radius:12px; border:1px dashed #cbd5e1; padding:16px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <h4 style="margin:0; color:var(--navy, #0b2b52); font-size:15.5px; font-weight:700;">${escHtml(title)}</h4>
            <span style="background:#94a3b8; color:#fff; font-weight:700; font-size:12.5px; padding:3px 10px; border-radius:20px;">Not Submitted</span>
          </div>
          <p style="margin:0; font-size:12.5px; color:#64748b;">${escHtml(evalData.summary_feedback || "No response was submitted for this task.")}</p>
        </div>
      `;
    }

    const strengthsList = Array.isArray(evalData.strengths) ? evalData.strengths.filter(Boolean) : [];
    const correctionsList = Array.isArray(evalData.corrections) ? evalData.corrections.filter(c => c && (c.original || c.improved)) : [];

    const strengthsHtml = strengthsList.length
      ? `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px; margin-bottom:12px;">
          <b style="color:#15803d; font-size:12.5px; display:block; margin-bottom:4px;">✓ What You Did Well:</b>
          <ul style="margin:0; padding-left:16px; font-size:12px; color:#166534; line-height:1.5;">
            ${strengthsList.map(item => `<li>${escHtml(item)}</li>`).join("")}
          </ul>
        </div>
      `
      : "";

    const correctionsHtml = correctionsList.length
      ? `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:11px 14px; margin-bottom:12px;">
          <b style="color:var(--navy, #0b2b52); font-size:12.5px; display:block; margin-bottom:8px;">Sentence Corrections & Band 8+ Upgrades:</b>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${correctionsList.map(c => `
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px 10px; font-size:12px; line-height:1.45;">
                ${c.original ? `<div style="color:#b91c1c; margin-bottom:3px;"><b>Original:</b> <span style="text-decoration:line-through; opacity:0.9;">${escHtml(c.original)}</span></div>` : ""}
                ${c.improved ? `<div style="color:#15803d; margin-bottom:3px;"><b>Band 8+ Upgrade:</b> ${escHtml(c.improved)}</div>` : ""}
                ${c.reason ? `<div style="color:#64748b; font-size:11.5px;"><i>Why:</i> ${escHtml(c.reason)}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      `
      : "";

    const band9Html = evalData.band_9_model
      ? `
        <div class="mp-b9-card" style="background:#ffffff; border:1.5px solid #dbeafe; border-radius:10px; margin-bottom:12px; overflow:hidden; box-shadow:0 3px 10px rgba(11,43,82,0.05);">
          <div style="background:#0b2b52; color:#ffffff; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="background:#e0202d; color:#ffffff; font-size:11px; font-weight:800; padding:2px 8px; border-radius:4px; text-transform:uppercase;">Examiner Benchmark</span>
              <b style="font-size:13px; font-family:'Sora',sans-serif;">⭐ Band 9 Model Rewrite</b>
            </div>
            <button type="button" onclick="const b=this.closest('.mp-b9-card').querySelector('.mp-b9-body'); if(b){ navigator.clipboard.writeText(b.innerText).then(()=>{ this.textContent='Copied! ✓'; setTimeout(()=>this.textContent='Copy Model Answer', 2000); }); }" style="background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.3); color:#ffffff; font-size:11.5px; font-weight:700; padding:4px 10px; border-radius:5px; cursor:pointer;">
              Copy Model Answer
            </button>
          </div>
          <div class="mp-b9-body" style="padding:14px; font-size:12.5px; color:#1e293b; line-height:1.65; white-space:pre-line; background:#fbfdff;">${escHtml(evalData.band_9_model)}</div>
        </div>
      `
      : "";

    const lexicalList = Array.isArray(evalData.lexical_upgrades) ? evalData.lexical_upgrades.filter(Boolean) : [];
    const lexicalHtml = lexicalList.length
      ? `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:10px;">
            <span style="color:#e0202d; font-size:14px;">💎</span>
            <b style="color:#0b2b52; font-size:12.5px;">High-Band Topic Vocabulary &amp; Collocations:</b>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:8px;">
            ${lexicalList.map(item => `
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-left:3px solid #1565c9; border-radius:6px; padding:8px 10px;">
                <div style="color:#0b2b52; font-weight:800; font-size:12px; margin-bottom:2px;">
                  ${escHtml(item.phrase || item.term)}
                </div>
                ${item.meaning ? `<div style="color:#64748b; font-size:11px; margin-bottom:4px; line-height:1.35;"><i>${escHtml(item.meaning)}</i></div>` : ""}
                ${item.example ? `<div style="color:#334155; font-size:11px; line-height:1.35; background:#f1f5f9; padding:3px 6px; border-radius:4px;">&ldquo;${escHtml(item.example)}&rdquo;</div>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      `
      : "";

    return `
      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; border-top:4px solid var(--red, #e0202d); padding:16px; margin-bottom:14px; box-shadow:0 4px 10px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h4 style="margin:0; color:var(--navy, #0b2b52); font-size:16px; font-weight:700;">${escHtml(title)}</h4>
          <span style="background:var(--red, #e0202d); color:#fff; font-weight:800; font-size:14px; padding:3px 12px; border-radius:20px;">Band: ${escHtml(evalData.overall_band)}</span>
        </div>
        
        <div style="font-size:13px; color:#334155; line-height:1.5; background:#f8fafc; padding:10px 12px; border-radius:6px; border-left:4px solid var(--navy, #0b2b52); margin-bottom:12px;">
          <b>Examiner Summary:</b> ${escHtml(evalData.summary_feedback)}
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:12.5px; color:var(--navy, #0b2b52);">
              <span>${crit1}</span><span style="color:var(--red, #e0202d);">${escHtml(evalData.task_response.score)}</span>
            </div>
            <p style="margin:4px 0 0; font-size:12px; color:#64748b; line-height:1.4;">${escHtml(evalData.task_response.comment)}</p>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:12.5px; color:var(--navy, #0b2b52);">
              <span>Coherence & Cohesion</span><span style="color:var(--red, #e0202d);">${escHtml(evalData.coherence_cohesion.score)}</span>
            </div>
            <p style="margin:4px 0 0; font-size:12px; color:#64748b; line-height:1.4;">${escHtml(evalData.coherence_cohesion.comment)}</p>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:12.5px; color:var(--navy, #0b2b52);">
              <span>Lexical Resource</span><span style="color:var(--red, #e0202d);">${escHtml(evalData.lexical_resource.score)}</span>
            </div>
            <p style="margin:4px 0 0; font-size:12px; color:#64748b; line-height:1.4;">${escHtml(evalData.lexical_resource.comment)}</p>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:12.5px; color:var(--navy, #0b2b52);">
              <span>Grammar & Accuracy</span><span style="color:var(--red, #e0202d);">${escHtml(evalData.grammar.score)}</span>
            </div>
            <p style="margin:4px 0 0; font-size:12px; color:#64748b; line-height:1.4;">${escHtml(evalData.grammar.comment)}</p>
          </div>
        </div>

        ${strengthsHtml}
        ${correctionsHtml}
        ${band9Html}
        ${lexicalHtml}

        <div style="background:#fffafa; border:1px dashed var(--red, #e0202d); border-radius:6px; padding:10px 14px;">
          <b style="color:var(--red, #e0202d); font-size:12.5px; display:block; margin-bottom:4px;">Priority Improvement Tips:</b>
          <ul style="margin:0; padding-left:16px; font-size:12px; color:#334155; line-height:1.5;">
            ${(evalData.key_improvements || []).map(tip => `<li>${escHtml(tip)}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
  }

  // AUTO-EVALUATION LOGIC
  (async function executeAutoEvaluation() {
    const badge = document.getElementById("ai-band-badge");
    const container = document.getElementById("ai-cambridge-results-container");

    const isUserLoggedIn = !!(function() {
      try {
        const u = JSON.parse(localStorage.getItem('user') || 'null');
        return u && (u.email || u.name);
      } catch(e) { return false; }
    })();

    // Pre-populate on-page review arena with submitted text so preview is always ready
    populateOnPageReview(null, null, singleTaskMode || 'full', 'Calculating...');

    function recordGuestEval() {
      if (isUserLoggedIn) return;
      const today = new Date().toISOString().slice(0, 10);
      let guestData = { date: today, count: 0 };
      try {
        const raw = localStorage.getItem('mp_guest_writing_eval');
        if (raw) {
          const p = JSON.parse(raw);
          if (p.date === today) guestData = p;
        }
      } catch(e) {}
      guestData.count += 1;
      localStorage.setItem('mp_guest_writing_eval', JSON.stringify(guestData));
    }

    if (!isUserLoggedIn) {
      const today = new Date().toISOString().slice(0, 10);
      let guestData = { date: today, count: 0 };
      try {
        const raw = localStorage.getItem('mp_guest_writing_eval');
        if (raw) {
          const p = JSON.parse(raw);
          if (p.date === today) guestData = p;
        }
      } catch(e) {}

      if (guestData.count >= 5) {
        if (badge) badge.textContent = "Limit Reached";
        container.innerHTML = `
          <div style="background:#fff; border: 1.5px solid #bcd9fb; border-radius:16px; padding:32px 24px; text-align:center; max-width:520px; margin: 30px auto; box-shadow: 0 8px 24px rgba(11,43,82,0.08);">
            <div style="width:58px; height:58px; border-radius:16px; background:#eff6ff; color:#1565c9; display:inline-flex; align-items:center; justify-content:center; margin-bottom:14px;">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h4 style="font-family:'Sora',sans-serif; font-size:1.25rem; font-weight:800; color:#0b2b52; margin-bottom:8px;">Daily Free Evaluation Limit Reached</h4>
            <p style="font-size:0.88rem; color:#64748b; line-height:1.55; margin-bottom:20px;">
              You have completed your 1 free AI Writing evaluation for today without login. Log in or create a free candidate account to get unlimited evaluations and track all your band scores!
            </p>
            <a href="/login" style="display:inline-block; padding:12px 24px; border-radius:10px; background:#1565c9; color:#fff; text-decoration:none; font-weight:700; font-size:0.92rem;">
              Sign In / Register Free &rarr;
            </a>
          </div>
        `;
        return;
      }
    }

    function getOrCreateDeviceId() {
      let devId = null;
      try { devId = localStorage.getItem('imp_device_id'); } catch(e) {}
      if (!devId) {
        devId = 'imp_dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
        try { localStorage.setItem('imp_device_id', devId); } catch(e) {}
      }
      try { document.cookie = "imp_device_id=" + devId + "; path=/; max-age=31536000; SameSite=Lax"; } catch(e) {}
      return devId;
    }

    function handleEvaluationBlock(container, badge, json) {
      if (json.limitReached) {
        if (badge) badge.textContent = "Limit Reached";
        container.innerHTML = `
          <div style="background:#fff; border: 1.5px solid #bcd9fb; border-radius:16px; padding:32px 24px; text-align:center; max-width:520px; margin: 30px auto; box-shadow: 0 8px 24px rgba(11,43,82,0.08);">
            <div style="width:58px; height:58px; border-radius:16px; background:#fff7ed; color:#ea580c; display:inline-flex; align-items:center; justify-content:center; margin-bottom:14px; border: 1.5px solid rgba(234,88,12,0.25);">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
            <div style="display:inline-block; font-size:0.75rem; font-weight:700; color:#c2410c; background:#ffedd5; padding:3px 12px; border-radius:999px; margin-bottom:10px;">DAILY FREE LIMIT REACHED</div>
            <h4 style="font-family:'Sora',sans-serif; font-size:1.25rem; font-weight:800; color:#0b2b52; margin-bottom:8px;">Daily Free AI Evaluations Used</h4>
            <p style="font-size:0.88rem; color:#64748b; line-height:1.55; margin-bottom:20px;">
              ${json.message || "You have reached your daily limit of free AI evaluations from this device. Please come back tomorrow or upgrade to VIP Pass for unlimited evaluations!"}
            </p>
            <div style="display:flex; flex-direction:column; gap:10px; max-width:320px; margin:0 auto;">
              <a href="/pricing" style="display:inline-block; padding:12px 24px; border-radius:10px; background:#e0202d; color:#fff; text-decoration:none; font-weight:700; font-size:0.92rem;">
                Get VIP Pass (Unlimited) &rarr;
              </a>
              <a href="/dashboard" style="display:inline-block; padding:10px 20px; border-radius:10px; background:#f1f5f9; color:#475569; text-decoration:none; font-weight:600; font-size:0.86rem;">
                View Saved Test Scores
              </a>
            </div>
          </div>
        `;
        return true;
      }
      if (json.authRequired) {
        if (badge) badge.textContent = "Sign In Required";
        container.innerHTML = `
          <div style="background:#fff; border: 1.5px solid #bcd9fb; border-radius:16px; padding:32px 24px; text-align:center; max-width:520px; margin: 30px auto; box-shadow: 0 8px 24px rgba(11,43,82,0.08);">
            <div style="width:58px; height:58px; border-radius:16px; background:#eff6ff; color:#1565c9; display:inline-flex; align-items:center; justify-content:center; margin-bottom:14px; border: 1.5px solid rgba(21,101,201,0.25);">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <div style="display:inline-block; font-size:0.75rem; font-weight:700; color:#1d4ed8; background:#dbeafe; padding:3px 12px; border-radius:999px; margin-bottom:10px;">FREE CANDIDATE ACCOUNT</div>
            <h4 style="font-family:'Sora',sans-serif; font-size:1.25rem; font-weight:800; color:#0b2b52; margin-bottom:8px;">Sign In to Evaluate</h4>
            <p style="font-size:0.88rem; color:#64748b; line-height:1.55; margin-bottom:20px;">
              Create a free account or sign in to get 3 free AI Writing evaluations every day with detailed band 9 sample answers!
            </p>
            <a href="/login" style="display:inline-block; padding:12px 24px; border-radius:10px; background:#1565c9; color:#fff; text-decoration:none; font-weight:700; font-size:0.92rem;">
              Sign In / Register Free &rarr;
            </a>
          </div>
        `;
        return true;
      }
      return false;
    }

    try {
      const activeDevId = getOrCreateDeviceId();
      let activeUserEmail = null;
      try {
        const u = JSON.parse(localStorage.getItem('user') || 'null');
        activeUserEmail = u?.email || null;
      } catch(e) {}

      // ১. SINGLE TASK 1
      if (singleTaskMode === 1) {
        if (!task1Text || task1Text.length < 10) throw new Error("No answer submitted for Task 1.");
        
        let res = await fetch("/evaluate-essay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: q1Text || "IELTS Writing Task 1", essay: task1Text, taskType: "task1", deviceId: activeDevId, userEmail: activeUserEmail })
        });
        if (res.status === 404) {
          res = await fetch("/api/evaluate-essay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: q1Text || "IELTS Writing Task 1", essay: task1Text, taskType: "task1", deviceId: activeDevId, userEmail: activeUserEmail })
          });
        }
        const json = await res.json();
        if (handleEvaluationBlock(container, badge, json)) return;
        if (!json.success) throw new Error(json.message);
        recordGuestEval();

        if (badge) badge.textContent = `Band: ${json.data.overall_band}`;
        container.innerHTML = renderTaskCard(json.data, "Writing Task 1 Assessment", 1);
        populateOnPageReview(json.data, null, 1);
      }
      // ২. SINGLE TASK 2
      else if (singleTaskMode === 2) {
        if (!task2Text || task2Text.length < 10) throw new Error("No answer submitted for Task 2.");
        
        let res = await fetch("/evaluate-essay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: q2Text || "IELTS Writing Task 2", essay: task2Text, taskType: "task2", deviceId: activeDevId, userEmail: activeUserEmail })
        });
        if (res.status === 404) {
          res = await fetch("/api/evaluate-essay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: q2Text || "IELTS Writing Task 2", essay: task2Text, taskType: "task2", deviceId: activeDevId, userEmail: activeUserEmail })
          });
        }
        const json = await res.json();
        if (handleEvaluationBlock(container, badge, json)) return;
        if (!json.success) throw new Error(json.message);
        recordGuestEval();

        if (badge) badge.textContent = `Band: ${json.data.overall_band}`;
        container.innerHTML = renderTaskCard(json.data, "Writing Task 2 Assessment", 2);
        populateOnPageReview(null, json.data, 2);
      }
      // ৩. FULL TEST (BOTH TASKS)
      else {
        let res = await fetch("/evaluate-writing-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task1: { question: q1Text || "IELTS Writing Task 1", essay: task1Text },
            task2: { question: q2Text || "IELTS Writing Task 2", essay: task2Text },
            deviceId: activeDevId,
            userEmail: activeUserEmail
          })
        });
        if (res.status === 404) {
          res = await fetch("/api/evaluate-writing-all", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              task1: { question: q1Text || "IELTS Writing Task 1", essay: task1Text },
              task2: { question: q2Text || "IELTS Writing Task 2", essay: task2Text },
              deviceId: activeDevId,
              userEmail: activeUserEmail
            })
          });
        }
        const json = await res.json();
        if (handleEvaluationBlock(container, badge, json)) return;
        if (!json.success) throw new Error(json.message);
        recordGuestEval();

        const { final_band, task1, task2 } = json.data;
        if (badge) badge.textContent = `Overall Band: ${final_band}`;

        container.innerHTML = `
          ${renderTaskCard(task1, "Task 1 Assessment", 1)}
          ${renderTaskCard(task2, "Task 2 Assessment", 2)}
        `;
        populateOnPageReview(task1, task2, 'full', final_band);

        // Automatically save to Student Dashboard
        try {
          const u = JSON.parse(localStorage.getItem('user') || 'null');
          const t1Words = task1Text ? task1Text.trim().split(/\s+/).filter(Boolean).length : 0;
          const t2Words = task2Text ? task2Text.trim().split(/\s+/).filter(Boolean).length : 0;
          fetch('/api/student/record-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: u ? u.email : '',
              testType: 'Cambridge Writing',
              module: 'writing',
              testId: `cambridge-writing-${book}-${testNo}`,
              title: `Cambridge ${book} Academic Writing Test ${testNo}`,
              writingScore: Number(final_band) || 0,
              writingBand: Number(final_band) || 0,
              overallBand: Number(final_band) || 0,
              totalWords: t1Words + t2Words,
              feedback: {
                overallFeedback: (task2 && task2.summary_feedback) || (task1 && task1.summary_feedback) || 'Cambridge Writing Evaluation Completed',
                task1Feedback: task1,
                task2Feedback: task2
              }
            })
          }).catch(err => console.warn('Writing record sync error:', err));
        } catch(e) {}
      }
    } catch (err) {
      console.error("Cambridge AI eval error:", err);
      if (badge) badge.textContent = "Band: --";
      container.innerHTML = `<div style="background:#fff; border:1px solid #fecaca; color:#b91c1c; padding:14px; border-radius:8px; font-size:13px; text-align:center;">Evaluation could not be completed (${err.message}). Please try again.</div>`;
    }
  })();

  // Copy Prompt Button
  document.getElementById("copy-ai-btn").addEventListener("click", function () {
    navigator.clipboard.writeText(promptContent).then(() => {
      const orig = this.innerHTML;
      this.innerHTML = `<i class="bi bi-check2"></i> Copied!`;
      this.style.background = "#10b981";
      this.style.color = "#fff";
      this.style.borderColor = "#10b981";
      setTimeout(() => {
        this.innerHTML = orig;
        this.style.background = "#fff";
        this.style.color = "var(--navy, #0b2b52)";
        this.style.borderColor = "var(--navy, #0b2b52)";
      }, 2000);
    });
  });

  // Return to Practice Button
  document.getElementById("finish-home-btn").addEventListener("click", () => {
    window.location.href = "/cambridge-writing.html";
  });
}
  // ==========================================
  // ON-PAGE COMPREHENSIVE WRITING REVIEW ARENA
  // ==========================================
  function populateOnPageReview(task1Data, task2Data, mode, finalBand) {
    function escHtml(str) {
      return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    const task1Text = document.getElementById("writer-1")?.value?.trim() || "";
    const task2Text = document.getElementById("writer-2")?.value?.trim() || "";
    let q1Text = "IELTS Writing Task 1";
    let q2Text = "IELTS Writing Task 2";
    try {
      const p1El = document.getElementById("info-panel-1");
      const p2El = document.getElementById("info-panel-2");
      if (p1El && p1El.innerText.trim()) q1Text = p1El.innerText.trim();
      if (p2El && p2El.innerText.trim()) q2Text = p2El.innerText.trim();
    } catch(e) {}

    let reviewContainer = document.getElementById('on-page-writing-review');
    if (!reviewContainer) {
      reviewContainer = document.createElement('section');
      reviewContainer.id = 'on-page-writing-review';
      reviewContainer.style.maxWidth = '1200px';
      reviewContainer.style.margin = '34px auto 90px';
      reviewContainer.style.padding = '0 24px';
      reviewContainer.style.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
      const mainEl = document.querySelector('main.main-wrapper') || document.querySelector('main') || document.body;
      mainEl.parentNode.insertBefore(reviewContainer, mainEl.nextSibling);
    }

    // Floating Button to Re-open Scorecard Popup
    let floatBtn = document.getElementById('float-scorecard-btn');
    if (!floatBtn) {
      floatBtn = document.createElement('button');
      floatBtn.id = 'float-scorecard-btn';
      floatBtn.type = 'button';
      floatBtn.onclick = reopenResultModal;
      floatBtn.style.cssText = 'display:none; position:fixed; bottom:24px; right:24px; z-index:99998; background:#0b2b52; color:#fff; border:2px solid #e0202d; padding:12px 20px; border-radius:50px; font-size:13px; font-weight:800; cursor:pointer; box-shadow:0 8px 24px rgba(11,43,82,0.3); align-items:center; gap:8px; transition:transform 0.2s;';
      floatBtn.innerHTML = '<span>📊</span> View Scorecard Popup';
      document.body.appendChild(floatBtn);
    }

    const overallScore = finalBand || (task1Data ? task1Data.overall_band : (task2Data ? task2Data.overall_band : '--'));

    let html = `
      <div style="background:#ffffff; border:1.5px solid #dbeafe; border-radius:18px; padding:26px 30px; box-shadow:0 12px 36px rgba(11,43,82,0.07); margin-bottom:30px;">
        
        <!-- Top Title Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; padding-bottom:18px; margin-bottom:24px; border-bottom:1.5px solid #e2e8f0;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:12px; font-weight:800; padding:4px 12px; border-radius:999px; text-transform:uppercase; margin-bottom:8px;">
              <span>📝</span> Detailed Candidate Writing Review
            </div>
            <h2 style="margin:0; font-family:'Sora',sans-serif; color:#0b2b52; font-size:1.5rem; font-weight:800;">
              Your Submitted Writing &amp; Examiner Diagnostics
            </h2>
            <p style="margin:6px 0 0; color:#64748b; font-size:0.92rem;">
              Scroll below to inspect your exact submitted essay side-by-side with line-by-line examiner fixes, Band 9 model rewrite, and topic vocabulary.
            </p>
          </div>

          <div style="display:flex; align-items:center; gap:16px;">
            <div style="text-align:right;">
              <span style="display:block; font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.04em;">Official Score</span>
              <span style="font-family:'Sora',sans-serif; font-size:1.65rem; font-weight:800; color:#e0202d; line-height:1;">
                Band ${overallScore}
              </span>
            </div>
            <button type="button" onclick="reopenResultModal()" style="background:#0b2b52; color:#ffffff; border:none; padding:11px 20px; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:7px; box-shadow:0 4px 12px rgba(11,43,82,0.2); transition:all 0.2s;">
              <span>📊</span> View Scorecard Popup
            </button>
          </div>
        </div>
    `;

    function buildTaskSection(tData, tNo, tQuestion, tEssay) {
      const isT1 = tNo === 1;
      const crit1 = isT1 ? 'Task Achievement' : 'Task Response';
      const words = tEssay ? tEssay.trim().split(/\s+/).filter(Boolean).length : 0;
      const dataObj = tData || {};
      const strengths = Array.isArray(dataObj.strengths) ? dataObj.strengths.filter(Boolean) : [];
      const corrections = Array.isArray(dataObj.corrections) ? dataObj.corrections.filter(c => c && (c.original || c.improved)) : [];
      const lexical = Array.isArray(dataObj.lexical_upgrades) ? dataObj.lexical_upgrades.filter(Boolean) : [];
      const improvements = Array.isArray(dataObj.key_improvements) ? dataObj.key_improvements.filter(Boolean) : [];

      const strengthsHtml = strengths.length
        ? `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px 14px; margin-bottom:12px;">
            <b style="color:#15803d; font-size:12.5px; display:block; margin-bottom:4px;">✓ What You Did Well:</b>
            <ul style="margin:0; padding-left:18px; font-size:12px; color:#166534; line-height:1.55;">
              ${strengths.map(s => `<li>${escHtml(s)}</li>`).join('')}
            </ul>
          </div>
        `
        : '';

      const correctionsHtml = corrections.length
        ? `
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${corrections.map(c => `
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-left:3.5px solid #dc2626; border-radius:8px; padding:10px 12px; font-size:12.5px; line-height:1.5;">
                ${c.original ? `<div style="color:#b91c1c; margin-bottom:4px;"><strong>🔴 Original (Slip):</strong> <span style="text-decoration:line-through; opacity:0.85;">${escHtml(c.original)}</span></div>` : ''}
                ${c.improved ? `<div style="color:#15803d; margin-bottom:4px;"><strong>🟢 Band 8+ Upgrade:</strong> <span style="font-weight:700;">${escHtml(c.improved)}</span></div>` : ''}
                ${c.reason ? `<div style="color:#64748b; font-size:11.5px; margin-top:2px;"><em>💡 Why:</em> ${escHtml(c.reason)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        `
        : '<div style="padding:20px; text-align:center; color:#64748b; font-size:12.5px;">No sentence errors detected. Excellent control!</div>';

      const band9Html = dataObj.band_9_model
        ? `
          <div class="mp-b9-card" style="background:#ffffff; border:1.5px solid #dbeafe; border-radius:12px; margin-bottom:18px; overflow:hidden; box-shadow:0 3px 12px rgba(11,43,82,0.05);">
            <div style="background:#0b2b52; color:#ffffff; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="background:#e0202d; color:#ffffff; font-size:11px; font-weight:800; padding:3px 8px; border-radius:4px; text-transform:uppercase;">Examiner Benchmark</span>
                <b style="font-size:13.5px; font-family:'Sora',sans-serif;">⭐ Band 9 Model Rewrite (Task ${tNo})</b>
              </div>
              <button type="button" onclick="const b=this.closest('.mp-b9-card').querySelector('.mp-b9-body'); if(b){ navigator.clipboard.writeText(b.innerText).then(()=>{ this.textContent='Copied! ✓'; setTimeout(()=>this.textContent='Copy Model Answer', 2000); }); }" style="background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.3); color:#ffffff; font-size:12px; font-weight:700; padding:5px 12px; border-radius:6px; cursor:pointer;">
                Copy Model Answer
              </button>
            </div>
            <div class="mp-b9-body" style="padding:16px 18px; font-size:13px; color:#1e293b; line-height:1.75; white-space:pre-line; background:#fbfdff;">${escHtml(dataObj.band_9_model)}</div>
          </div>
        `
        : '';

      const lexicalHtml = lexical.length
        ? `
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px 16px; margin-bottom:18px;">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:10px;">
              <span style="color:#e0202d; font-size:15px;">💎</span>
              <b style="color:#0b2b52; font-size:13px;">High-Band Topic Vocabulary &amp; Collocations (Task ${tNo}):</b>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
              ${lexical.map(item => `
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-left:3.5px solid #1565c9; border-radius:8px; padding:10px 12px;">
                  <div style="color:#0b2b52; font-weight:800; font-size:12.5px; margin-bottom:3px;">
                    ${escHtml(item.phrase || item.term)}
                  </div>
                  ${item.meaning ? `<div style="color:#64748b; font-size:11.5px; margin-bottom:4px; line-height:1.35;"><i>${escHtml(item.meaning)}</i></div>` : ''}
                  ${item.example ? `<div style="color:#334155; font-size:11.5px; line-height:1.4; background:#f1f5f9; padding:4px 7px; border-radius:4px;">&ldquo;${escHtml(item.example)}&rdquo;</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `
        : '';

      const improvementsHtml = improvements.length
        ? `
          <div style="background:#fffafa; border:1px dashed #e0202d; border-radius:10px; padding:12px 16px;">
            <b style="color:#e0202d; font-size:13px; display:block; margin-bottom:6px;">🎯 Priority Improvement Tips (Task ${tNo}):</b>
            <ul style="margin:0; padding-left:18px; font-size:12.5px; color:#334155; line-height:1.6;">
              ${improvements.map(tip => `<li>${escHtml(tip)}</li>`).join('')}
            </ul>
          </div>
        `
        : '';

      return `
        <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:16px; padding:22px; margin-bottom:28px;">
          
          <!-- Task Header & Prompt -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid #e2e8f0;">
            <div style="max-width:80%;">
              <span style="background:#eff6ff; color:#1d4ed8; font-size:11.5px; font-weight:800; padding:3px 10px; border-radius:6px; text-transform:uppercase;">
                Task ${tNo} Assessment
              </span>
              <h3 style="color:#0b2b52; font-size:1.05rem; font-weight:700; margin:8px 0 0; line-height:1.5;">
                ${escHtml(tQuestion)}
              </h3>
            </div>
            <div style="background:#ffffff; border:1.5px solid #bcd9fb; border-radius:10px; padding:6px 16px; text-align:center;">
              <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Task Band</div>
              <div style="font-family:'Sora',sans-serif; font-size:1.4rem; font-weight:800; color:#e0202d;">
                ${dataObj.overall_band || '--'}
              </div>
            </div>
          </div>

          <!-- 4-Criteria Grid -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin-bottom:18px;">
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="color:#0b2b52; font-size:12.5px;">${crit1}</strong>
                <span style="background:#eff6ff; color:#1565c9; font-weight:800; font-size:12.5px; padding:2px 7px; border-radius:4px;">${(dataObj.task_response || {}).score || '--'}</span>
              </div>
              <p style="margin:0; font-size:11.5px; color:#475569; line-height:1.4;">${escHtml((dataObj.task_response || {}).comment)}</p>
            </div>

            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="color:#0b2b52; font-size:12.5px;">Coherence &amp; Cohesion</strong>
                <span style="background:#eff6ff; color:#1565c9; font-weight:800; font-size:12.5px; padding:2px 7px; border-radius:4px;">${(dataObj.coherence_cohesion || {}).score || '--'}</span>
              </div>
              <p style="margin:0; font-size:11.5px; color:#475569; line-height:1.4;">${escHtml((dataObj.coherence_cohesion || {}).comment)}</p>
            </div>

            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="color:#0b2b52; font-size:12.5px;">Lexical Resource</strong>
                <span style="background:#eff6ff; color:#1565c9; font-weight:800; font-size:12.5px; padding:2px 7px; border-radius:4px;">${(dataObj.lexical_resource || {}).score || '--'}</span>
              </div>
              <p style="margin:0; font-size:11.5px; color:#475569; line-height:1.4;">${escHtml((dataObj.lexical_resource || {}).comment)}</p>
            </div>

            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="color:#0b2b52; font-size:12.5px;">Grammar &amp; Accuracy</strong>
                <span style="background:#eff6ff; color:#1565c9; font-weight:800; font-size:12.5px; padding:2px 7px; border-radius:4px;">${(dataObj.grammar || {}).score || '--'}</span>
              </div>
              <p style="margin:0; font-size:11.5px; color:#475569; line-height:1.4;">${escHtml((dataObj.grammar || {}).comment)}</p>
            </div>
          </div>

          <!-- Side-by-Side: Submitted Essay vs Mistakes & Corrections -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px; margin-bottom:18px;">
            
            <!-- Left: What Student Wrote -->
            <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px 18px; display:flex; flex-direction:column;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
                <h4 style="margin:0; color:#0b2b52; font-size:13.5px; font-weight:800; display:flex; align-items:center; gap:6px;">
                  <span>📝</span> Your Submitted Essay (Task ${tNo})
                </h4>
                <span style="background:#f1f5f9; color:#475569; font-size:11.5px; font-weight:700; padding:2px 8px; border-radius:999px;">
                  ${words} words
                </span>
              </div>
              <div style="white-space:pre-line; line-height:1.75; font-size:13px; color:#334155; max-height:450px; overflow-y:auto; padding-right:6px;">
                ${escHtml(tEssay) || '(No response was submitted)'}
              </div>
            </div>

            <!-- Right: Where You Made Mistakes & Examiner Fixes -->
            <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px 18px; display:flex; flex-direction:column;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
                <h4 style="margin:0; color:#991b1b; font-size:13.5px; font-weight:800; display:flex; align-items:center; gap:6px;">
                  <span>🔍</span> Mistakes &amp; Band 8+ Upgrades
                </h4>
                <span style="background:#fee2e2; color:#991b1b; font-size:11.5px; font-weight:700; padding:2px 8px; border-radius:999px;">
                  Examiner Fixes
                </span>
              </div>
              <div style="max-height:450px; overflow-y:auto; padding-right:6px;">
                ${strengthsHtml}
                ${correctionsHtml}
              </div>
            </div>

          </div>

          <!-- Band 9 Model Rewrite -->
          ${band9Html}

          <!-- High-Band Topic Vocabulary -->
          ${lexicalHtml}

          <!-- Priority Improvement Tips -->
          ${improvementsHtml}

        </div>
      `;
    }

    if (mode === 1 || mode === '1') {
      html += buildTaskSection(task1Data, 1, q1Text || "IELTS Writing Task 1", task1Text);
    } else if (mode === 2 || mode === '2') {
      html += buildTaskSection(task2Data, 2, q2Text || "IELTS Writing Task 2", task2Text);
    } else {
      html += buildTaskSection(task1Data, 1, q1Text || "IELTS Writing Task 1", task1Text);
      html += buildTaskSection(task2Data, 2, q2Text || "IELTS Writing Task 2", task2Text);
    }

    html += '</div>';
    reviewContainer.innerHTML = html;
  }

  window.previewWritingOnPage = function() {
    const modal = document.getElementById('instant-result-modal');
    if (modal) modal.style.display = 'none';

    const reviewEl = document.getElementById('on-page-writing-review');
    if (reviewEl) {
      reviewEl.style.display = 'block';
      reviewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const floatBtn = document.getElementById('float-scorecard-btn');
    if (floatBtn) floatBtn.style.display = 'inline-flex';
  };

  window.reopenResultModal = function() {
    const modal = document.getElementById('instant-result-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  };
