// State variables
let totalParts = 2;
let availableParts = [1, 2];
let currentPart = 1;
let elapsedSeconds = 0;
let timerInterval = null;
let singleTaskMode = null; // null = full test, 1 = task 1 only, 2 = task 2 only

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

    if (pathParts.includes("writing") && pathParts.length >= 4) {
      const book = pathParts[2];
      const testNo = pathParts[3];

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
if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen error:", err);
      });
      fullscreenBtn.className = "bi bi-fullscreen-exit btn-flat";
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      fullscreenBtn.className = "bi bi-arrows-fullscreen btn-flat";
    }
  });
}

document.addEventListener("fullscreenchange", () => {
  if (fullscreenBtn) {
    fullscreenBtn.className = document.fullscreenElement
      ? "bi bi-fullscreen-exit btn-flat"
      : "bi bi-arrows-fullscreen btn-flat";
  }
});

// 5. Part Navigation Logic
function showPart(part) {
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
async function submitTest() {
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
            </div>
          </div>
        </div>

        <!-- Body -->
        <div style="padding:22px 28px; overflow-y:auto; flex:1; background:#f8fafc;">
          
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
          <button id="copy-ai-btn" style="background:#fff; color:var(--navy, #0b2b52); border:2px solid var(--navy, #0b2b52); padding:8px 18px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <i class="bi bi-clipboard-check"></i> Copy Prompt
          </button>
          
          <button id="finish-home-btn" style="background:#0f172a; color:#fff; border:none; padding:10px 20px; border-radius:8px; font-size:13.5px; font-weight:600; cursor:pointer;">
            Return to Practice
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Helper function to render a task's 4-criteria card
  function renderTaskCard(evalData, title, taskNo) {
    const isT1 = taskNo === 1;
    const crit1 = isT1 ? "Task Achievement" : "Task Response";
    return `
      <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; border-top:4px solid var(--red, #e0202d); padding:16px; margin-bottom:14px; box-shadow:0 4px 10px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h4 style="margin:0; color:var(--navy, #0b2b52); font-size:16px; font-weight:700;">${title}</h4>
          <span style="background:var(--red, #e0202d); color:#fff; font-weight:800; font-size:14px; padding:3px 12px; border-radius:20px;">Band: ${evalData.overall_band}</span>
        </div>
        
        <div style="font-size:13px; color:#334155; line-height:1.5; background:#f8fafc; padding:10px 12px; border-radius:6px; border-left:4px solid var(--navy, #0b2b52); margin-bottom:12px;">
          <b>Feedback:</b> ${evalData.summary_feedback}
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:12.5px; color:var(--navy, #0b2b52);">
              <span>${crit1}</span><span style="color:var(--red, #e0202d);">${evalData.task_response.score}</span>
            </div>
            <p style="margin:4px 0 0; font-size:12px; color:#64748b; line-height:1.4;">${evalData.task_response.comment}</p>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:12.5px; color:var(--navy, #0b2b52);">
              <span>Coherence & Cohesion</span><span style="color:var(--red, #e0202d);">${evalData.coherence_cohesion.score}</span>
            </div>
            <p style="margin:4px 0 0; font-size:12px; color:#64748b; line-height:1.4;">${evalData.coherence_cohesion.comment}</p>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:12.5px; color:var(--navy, #0b2b52);">
              <span>Lexical Resource</span><span style="color:var(--red, #e0202d);">${evalData.lexical_resource.score}</span>
            </div>
            <p style="margin:4px 0 0; font-size:12px; color:#64748b; line-height:1.4;">${evalData.lexical_resource.comment}</p>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:12.5px; color:var(--navy, #0b2b52);">
              <span>Grammar & Accuracy</span><span style="color:var(--red, #e0202d);">${evalData.grammar.score}</span>
            </div>
            <p style="margin:4px 0 0; font-size:12px; color:#64748b; line-height:1.4;">${evalData.grammar.comment}</p>
          </div>
        </div>

        <div style="background:#fffafa; border:1px dashed var(--red, #e0202d); border-radius:6px; padding:10px 14px;">
          <b style="color:var(--red, #e0202d); font-size:12.5px; display:block; margin-bottom:4px;">Priority Improvement Tips:</b>
          <ul style="margin:0; padding-left:16px; font-size:12px; color:#334155; line-height:1.5;">
            ${(evalData.key_improvements || []).map(tip => `<li>${tip}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
  }

  // AUTO-EVALUATION LOGIC
  (async function executeAutoEvaluation() {
    const badge = document.getElementById("ai-band-badge");
    const container = document.getElementById("ai-cambridge-results-container");

    try {
      // ১. SINGLE TASK 1
      if (singleTaskMode === 1) {
        if (!task1Text || task1Text.length < 10) throw new Error("No answer submitted for Task 1.");
        
        let res = await fetch("/evaluate-essay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: q1Text || "IELTS Writing Task 1", essay: task1Text })
        });
        if (res.status === 404) {
          res = await fetch("/api/evaluate-essay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: q1Text || "IELTS Writing Task 1", essay: task1Text })
          });
        }
        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        if (badge) badge.textContent = `Band: ${json.data.overall_band}`;
        container.innerHTML = renderTaskCard(json.data, "Writing Task 1 Assessment", 1);
      }
      // ২. SINGLE TASK 2
      else if (singleTaskMode === 2) {
        if (!task2Text || task2Text.length < 10) throw new Error("No answer submitted for Task 2.");
        
        let res = await fetch("/evaluate-essay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: q2Text || "IELTS Writing Task 2", essay: task2Text })
        });
        if (res.status === 404) {
          res = await fetch("/api/evaluate-essay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: q2Text || "IELTS Writing Task 2", essay: task2Text })
          });
        }
        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        if (badge) badge.textContent = `Band: ${json.data.overall_band}`;
        container.innerHTML = renderTaskCard(json.data, "Writing Task 2 Assessment", 2);
      }
      // ৩. FULL TEST (BOTH TASKS)
      else {
        let res = await fetch("/evaluate-writing-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task1: { question: q1Text || "IELTS Writing Task 1", essay: task1Text },
            task2: { question: q2Text || "IELTS Writing Task 2", essay: task2Text }
          })
        });
        if (res.status === 404) {
          res = await fetch("/api/evaluate-writing-all", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              task1: { question: q1Text || "IELTS Writing Task 1", essay: task1Text },
              task2: { question: q2Text || "IELTS Writing Task 2", essay: task2Text }
            })
          });
        }
        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        const { final_band, task1, task2 } = json.data;
        if (badge) badge.textContent = `Overall Band: ${final_band}`;

        container.innerHTML = `
          ${renderTaskCard(task1, "Task 1 Assessment", 1)}
          ${renderTaskCard(task2, "Task 2 Assessment", 2)}
        `;
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