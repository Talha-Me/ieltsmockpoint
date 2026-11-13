//part vars
let totalParts = 2;
let currentPart = 1;
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("previous-button");

// "Finish & Back to Home" বাটন এখানে যাবে (দরকার হলে শুধু এই লাইন বদলাও)
const HOME_URL = "/mocks.html";

// Test lock / double-submit guard
let isSubmitting = false;
let examLocked = false;
let writingMinuteInterval = null;
let writingSecondsInterval = null;

// ==========================================
// BRITISH COUNCIL STYLE (BLUE + RED) RESULT SCREEN
// ==========================================
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function injectBcStyles() {
  if (document.getElementById("bc-writing-styles")) return;
  const style = document.createElement("style");
  style.id = "bc-writing-styles";
  style.textContent = `
    .bc-btn { flex: 1; min-width: 170px; padding: 13px 18px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; border: 2px solid transparent; transition: all .2s; font-family: inherit; }
    .bc-btn-blue { background: #fff; color: #0a2a6e; border-color: #0a2a6e; }
    .bc-btn-blue:hover { background: #0a2a6e; color: #fff; }
    .bc-btn-red { background: #d52b1e; color: #fff; border-color: #d52b1e; }
    .bc-btn-red:hover { background: #b01f14; border-color: #b01f14; }
    .bc-btn:disabled { opacity: .6; cursor: not-allowed; }

    .bc-result { position: fixed; inset: 0; z-index: 100001; background: #eef2f9; overflow-y: auto; font-family: "Segoe UI", system-ui, -apple-system, Arial, sans-serif; color: #1f2a44; }
    .bc-result-header { background: linear-gradient(135deg, #071d4f, #0a2a6e 55%, #1b4fb3); color: #fff; padding: 30px 20px 90px; text-align: center; border-bottom: 6px solid #d52b1e; }
    .bc-result-header h1 { margin: 0; font-size: 28px; letter-spacing: .4px; }
    .bc-result-header p { margin: 8px 0 0; opacity: .85; font-size: 14px; }
    .bc-total-pill { display: inline-block; margin-top: 14px; background: #d52b1e; color: #fff; font-weight: 800; font-size: 16px; padding: 7px 20px; border-radius: 30px; }
    .bc-result-wrap { max-width: 960px; margin: -64px auto 30px; padding: 0 16px; }

    .bc-score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .bc-score-card { background: #fff; border-radius: 16px; box-shadow: 0 12px 32px rgba(10,42,110,.18); padding: 22px; display: flex; gap: 20px; align-items: center; justify-content: center; flex-wrap: wrap; border-top: 4px solid #d52b1e; }
    .bc-score-card h3 { margin: 0 0 4px; font-size: 18px; color: #0a2a6e; }
    .bc-ring { width: 130px; height: 130px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .bc-ring-inner { width: 98px; height: 98px; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .bc-ring-score { font-size: 32px; font-weight: 800; color: #0a2a6e; line-height: 1; }
    .bc-ring-total { font-size: 12px; font-weight: 700; color: #d52b1e; margin-top: 4px; }
    .bc-score-info { flex: 1; min-width: 150px; }
    .bc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px; }
    .bc-stat { border-radius: 10px; padding: 9px 4px; text-align: center; }
    .bc-stat b { display: block; font-size: 20px; line-height: 1.1; }
    .bc-stat span { font-size: 10.5px; text-transform: uppercase; letter-spacing: .4px; }
    .bc-stat-ok { background: #e8efff; color: #0a2a6e; }
    .bc-stat-bad { background: #fdeceb; color: #d52b1e; }
    .bc-stat-skip { background: #f0f2f7; color: #5b6783; }

    .bc-writing-card { grid-column: 1 / -1; background: #fff; border-radius: 16px; box-shadow: 0 12px 32px rgba(10,42,110,.18); padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; border-top: 4px solid #d52b1e; }
    .bc-wc-left { display: flex; align-items: center; gap: 14px; }
    .bc-wc-icon { width: 52px; height: 52px; border-radius: 50%; background: #e8efff; color: #0a2a6e; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .bc-writing-card h3 { margin: 0 0 3px; font-size: 18px; color: #0a2a6e; }
    .bc-writing-card p { margin: 0; font-size: 13.5px; color: #5b6783; }
    .bc-writing-card .bc-btn { flex: none; min-width: 210px; }

    .bc-module-tabs { display: flex; gap: 0; margin: 26px 0 14px; border-radius: 10px; overflow: hidden; border: 2px solid #0a2a6e; background: #fff; }
    .bc-module-tab { flex: 1; padding: 13px 10px; font-size: 15px; font-weight: 800; cursor: pointer; border: none; background: #fff; color: #0a2a6e; transition: all .2s; font-family: inherit; }
    .bc-module-tab.active { background: #0a2a6e; color: #fff; box-shadow: inset 0 -4px 0 #d52b1e; }

    .bc-review-title { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin: 8px 0 12px; }
    .bc-review-title h3 { margin: 0; font-size: 20px; color: #0a2a6e; border-left: 5px solid #d52b1e; padding-left: 10px; }
    .bc-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .bc-tab { padding: 7px 14px; border-radius: 20px; border: 2px solid #0a2a6e; background: #fff; color: #0a2a6e; font-weight: 700; font-size: 13px; cursor: pointer; font-family: inherit; }
    .bc-tab.active { background: #0a2a6e; color: #fff; }

    .bc-review-item { display: flex; align-items: center; gap: 14px; background: #fff; border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; border-left: 5px solid #0a2a6e; box-shadow: 0 2px 8px rgba(10,42,110,.07); }
    .bc-review-item.bad { border-left-color: #d52b1e; background: #fffafa; }
    .bc-q-num { width: 38px; height: 38px; border-radius: 50%; background: #0a2a6e; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; flex-shrink: 0; }
    .bc-review-item.bad .bc-q-num { background: #d52b1e; }
    .bc-review-body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; font-size: 14px; min-width: 0; }
    .bc-lbl { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; color: #7a86a3; }
    .bc-val { font-weight: 700; word-break: break-word; }
    .bc-val.wrong { color: #d52b1e; }
    .bc-val.right { color: #0a2a6e; }
    .bc-val.empty { color: #9aa3b8; font-style: italic; font-weight: 600; }
    .bc-mark { font-size: 22px; font-weight: 800; flex-shrink: 0; color: #0a2a6e; }
    .bc-review-item.bad .bc-mark { color: #d52b1e; }
    .bc-empty-note { background: #fff; border-radius: 10px; padding: 18px; text-align: center; color: #5b6783; border: 2px dashed #c9d3ea; }

    .bc-ai-intro { background: #fff; border-radius: 14px; box-shadow: 0 4px 14px rgba(10,42,110,.10); padding: 18px 20px; margin-bottom: 16px; border-left: 5px solid #d52b1e; }
    .bc-ai-intro h3 { margin: 0 0 6px; font-size: 19px; color: #0a2a6e; }
    .bc-ai-intro p { margin: 0 0 14px; font-size: 13.5px; color: #5b6783; line-height: 1.6; }
    .bc-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .bc-step { display: flex; align-items: center; gap: 10px; background: #f5f8ff; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 600; color: #0a2a6e; }
    .bc-step-num { width: 28px; height: 28px; border-radius: 50%; background: #0a2a6e; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }

    .bc-both-bar { background: linear-gradient(135deg, #071d4f, #0a2a6e 60%, #1b4fb3); color: #fff; border-radius: 14px; padding: 16px 20px; margin-bottom: 16px; border-bottom: 4px solid #d52b1e; }
    .bc-both-bar h4 { margin: 0 0 4px; font-size: 16px; }
    .bc-both-bar p { margin: 0 0 12px; font-size: 13px; opacity: .85; }
    .bc-both-actions { display: flex; gap: 8px; flex-wrap: wrap; }

    .bc-task-card { background: #fff; border-radius: 14px; box-shadow: 0 4px 14px rgba(10,42,110,.10); margin-bottom: 16px; border-left: 5px solid #0a2a6e; overflow: hidden; }
    .bc-task-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding: 12px 16px; background: #f5f8ff; }
    .bc-task-head h4 { margin: 0; font-size: 17px; color: #0a2a6e; }
    .bc-wc { padding: 5px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 800; }
    .bc-wc.ok { background: #e8efff; color: #0a2a6e; }
    .bc-wc.low { background: #fdeceb; color: #d52b1e; }
    .bc-task-q { margin: 12px 16px 0; font-size: 13.5px; color: #5b6783; }
    .bc-task-q summary { cursor: pointer; font-weight: 700; color: #0a2a6e; }
    .bc-task-q div { margin-top: 8px; padding: 10px 12px; background: #fafbff; border: 1px dashed #c9d3ea; border-radius: 8px; white-space: pre-wrap; line-height: 1.6; }
    .bc-essay { margin: 12px 16px; padding: 12px 14px; background: #f8faff; border: 1px solid #d9e2f5; border-radius: 10px; white-space: pre-wrap; word-break: break-word; max-height: 260px; overflow-y: auto; font-size: 14.5px; line-height: 1.7; color: #1f2a44; }
    .bc-essay.empty { color: #9aa3b8; font-style: italic; }
    .bc-task-actions { display: flex; gap: 8px; flex-wrap: wrap; padding: 0 16px 16px; }

    .bc-act { padding: 9px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; border: 2px solid #0a2a6e; background: #fff; color: #0a2a6e; transition: all .2s; font-family: inherit; }
    .bc-act:hover { background: #0a2a6e; color: #fff; }
    .bc-act.primary { background: #d52b1e; border-color: #d52b1e; color: #fff; }
    .bc-act.primary:hover { background: #b01f14; border-color: #b01f14; }
    .bc-both-bar .bc-act { background: transparent; border-color: rgba(255,255,255,.7); color: #fff; }
    .bc-both-bar .bc-act:hover { background: #fff; color: #0a2a6e; }
    .bc-both-bar .bc-act.primary { background: #d52b1e; border-color: #d52b1e; color: #fff; }
    .bc-both-bar .bc-act.primary:hover { background: #b01f14; border-color: #b01f14; }
    .bc-act:disabled { opacity: .5; cursor: not-allowed; }
    /* AI Score & Feedback Card */
    .bc-ai-loading { text-align: center; padding: 25px; background: #fff; border-radius: 12px; margin-top: 15px; border-left: 5px solid #0a2a6e; font-weight: 700; color: #0a2a6e; }
    .bc-ai-card { background: #fff; border-radius: 14px; box-shadow: 0 4px 14px rgba(10,42,110,.10); margin-top: 16px; border-top: 4px solid #d52b1e; padding: 20px; }
    .bc-ai-head { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #eef2f9; padding-bottom: 12px; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; }
    .bc-ai-score-pill { background: #d52b1e; color: #fff; font-size: 18px; font-weight: 800; padding: 6px 16px; border-radius: 20px; }
    .bc-ai-criteria { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .bc-crit-box { background: #f8faff; border: 1px solid #d9e2f5; border-radius: 8px; padding: 12px; }
    .bc-crit-box b { color: #0a2a6e; font-size: 14px; }
    .bc-crit-box span.score { float: right; color: #d52b1e; font-weight: 800; }
    .bc-crit-box p { margin: 6px 0 0; font-size: 13px; color: #5b6783; line-height: 1.5; }
    .bc-ai-tips { background: #fffafa; border: 1px dashed #d52b1e; border-radius: 8px; padding: 12px 16px; }
    .bc-ai-tips h5 { margin: 0 0 6px; color: #d52b1e; font-size: 14px; }
    .bc-ai-tips ul { margin: 0; padding-left: 18px; font-size: 13px; color: #333; line-height: 1.6; }

    .bc-result-footer { position: sticky; bottom: 0; background: #fff; border-top: 3px solid #d52b1e; padding: 14px 16px; text-align: center; box-shadow: 0 -6px 18px rgba(0,0,0,.08); }
    .bc-result-footer .bc-btn { flex: none; min-width: 260px; }

    
    /* Hero Overall Band Showcase */
    .bc-hero-card {
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 16px 40px rgba(10, 42, 110, 0.12);
      padding: 24px;
      margin-bottom: 22px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .bc-hero-top {
      display: flex;
      align-items: stretch;
      gap: 20px;
      flex-wrap: wrap;
    }
    .bc-overall-box {
      background: linear-gradient(145deg, #071c4c 0%, #0d2c6e 52%, #19469d 100%);
      color: #ffffff !important;
      border-radius: 18px;
      padding: 20px 24px;
      text-align: center;
      min-width: 170px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 10px 26px rgba(10, 42, 110, 0.25);
      border-bottom: 4px solid #d52b1e;
      position: relative;
      overflow: hidden;
    }
    .bc-overall-box *, .bc-overall-score, .bc-overall-score * {
      color: #ffffff !important;
    }
    .bc-overall-box::before {
      content: "";
      position: absolute;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%);
      top: -50px;
      right: -30px;
      pointer-events: none;
    }
    .bc-overall-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      opacity: 0.85;
      margin-bottom: 4px;
    }
    .bc-overall-score {
      font-size: 46px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin: 4px 0;
    }
    .bc-overall-sub {
      font-size: 11.5px;
      opacity: 0.8;
      font-weight: 600;
    }
    .bc-module-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      flex: 1;
      min-width: 280px;
    }
    .bc-mod-mini-card {
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border: 1.5px solid transparent;
      transition: transform 0.2s;
    }
    .bc-mod-mini-card:hover {
      transform: translateY(-2px);
    }
    .bc-mod-listening {
      background: #f0f6ff;
      border-color: #bfdbfe;
    }
    .bc-mod-reading {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }
    .bc-mod-writing {
      background: #fef2f2;
      border-color: #fecaca;
    }
    .bc-mod-mini-head {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }
    .bc-mod-name {
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    .bc-mod-band {
      font-size: 24px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .bc-mod-listening .bc-mod-band { color: #1e40af; }
    .bc-mod-reading .bc-mod-band { color: #15803d; }
    .bc-mod-writing .bc-mod-band { color: #b91c1c; }
    .bc-mod-raw {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }
    .bc-band-badge {
      display: inline-block;
      background: #0a2a6e;
      color: #ffffff;
      font-size: 13px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 14px;
      letter-spacing: 0.3px;
    }
    .bc-module-note-banner {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-left: 4px solid #f59e0b;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 13px;
      color: #92400e;
      display: flex;
      align-items: center;
      gap: 12px;
      line-height: 1.5;
    }
    .bc-pulse-text {
      animation: bcPulse 1.5s infinite ease-in-out;
    }
    @keyframes bcPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .bc-fade-in {
      animation: bcFadeIn 0.4s ease;
    }
    @keyframes bcFadeIn {
      from { opacity: 0; transform: scale(0.85); }
      to { opacity: 1; transform: scale(1); }
    }

    @media (max-width: 700px) {
      .bc-result-header { padding: 22px 14px 76px; }
      .bc-result-header h1 { font-size: 22px; }
      .bc-result-wrap { padding: 0 10px; margin: -56px auto 24px; }
      .bc-hero-card { padding: 14px; border-radius: 16px; gap: 14px; }
      .bc-hero-top { flex-direction: column; gap: 12px; }
      .bc-overall-box { width: 100%; min-width: 0; padding: 16px; box-sizing: border-box; }
      .bc-module-grid { grid-template-columns: 1fr; min-width: 0; width: 100%; gap: 10px; }
      .bc-mod-mini-card { padding: 12px 14px; }
      .bc-score-grid { grid-template-columns: 1fr; }
      .bc-score-card { padding: 16px; gap: 14px; }
      .bc-score-info { width: 100%; min-width: 0; }
      .bc-writing-card { padding: 16px; flex-direction: column; align-items: stretch; }
      .bc-wc-left { width: 100%; }
      .bc-writing-card > div:last-child { width: 100%; flex-direction: column; align-items: stretch !important; gap: 10px !important; }
      .bc-writing-card .bc-total-pill { width: 100%; text-align: center; box-sizing: border-box; }
      .bc-writing-card .bc-btn { width: 100%; min-width: 0 !important; }
      .bc-module-tabs { flex-direction: column; }
      .bc-module-tab { font-size: 13.5px; padding: 11px 10px; border-bottom: 1px solid #e2e8f0; }
      .bc-module-tab:last-child { border-bottom: none; }
      .bc-review-body { grid-template-columns: 1fr; }
      .bc-steps { grid-template-columns: 1fr; }
      .bc-ai-criteria { grid-template-columns: 1fr; }
      .bc-result-footer .bc-btn { width: 100%; min-width: 0; }
    }
  `;
  document.head.appendChild(style);
}

function readStoredJSON(key) {
  try {
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Storage parse error for " + key, e);
    return null;
  }
}

function toAnswerText(v) {
  if (Array.isArray(v)) {
    return v.filter((x) => String(x).trim() !== "").join(", ");
  }
  return v === undefined || v === null ? "" : String(v).trim();
}

// পুরনো array format এর mistakes থাকলে object এ বদলে নেয়
function normalizeMistakes(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    const obj = {};
    raw.forEach((m, i) => {
      const key = m.questionNo || m.index || (i + 1);
      obj[key] = { "Your answer": [m.userAnswer || ""], "Correct answer": [m.correctAnswer || ""] };
    });
    return obj;
  }
  if (typeof raw === "object") return raw;
  return null;
}

// একটা module (Listening বা Reading) এর সব প্রশ্নের result list
function buildModuleResults(officialAns, mistakesObj, userAnswers) {
  const list = [];
  const official = officialAns || {};
  Object.keys(official)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((key) => {
      const realList = [].concat(official[key] || []).map((r) => String(r));
      const realText = realList.join(" / ");

      let isCorrect;
      if (mistakesObj) {
        isCorrect = !Object.prototype.hasOwnProperty.call(mistakesObj, key);
      } else {
        const ua = (userAnswers && userAnswers[key]) || [];
        const realNorm = realList.map((r) => r.toLowerCase().trim());
        isCorrect = [].concat(ua).some((a) => realNorm.includes(String(a).toLowerCase().trim()));
      }

      let userText = "";
      let answered = true;
      if (userAnswers && userAnswers[key] !== undefined) {
        userText = toAnswerText(userAnswers[key]);
        answered = userText !== "";
      } else if (!isCorrect && mistakesObj && mistakesObj[key]) {
        userText = toAnswerText(mistakesObj[key]["Your answer"]);
        answered = userText !== "";
      } else {
        userText = realList[0] || "";
      }

      list.push({ id: key, user: userText, correct: realText, isCorrect, answered });
    });
  return list;
}

function buildReviewItemsHtml(results, moduleName) {
  if (!results.length) {
    return `<div class="bc-empty-note" data-module="${moduleName}">No answer data found for this test.</div>`;
  }
  let html = "";
  results.forEach((r) => {
    const userHtml = r.answered
      ? `<span class="bc-val ${r.isCorrect ? "right" : "wrong"}">${escapeHtml(r.user)}</span>`
      : `<span class="bc-val empty">Not answered</span>`;
    html += `
      <div class="bc-review-item ${r.isCorrect ? "ok" : "bad"}" data-module="${moduleName}" data-ok="${r.isCorrect ? 1 : 0}">
        <div class="bc-q-num">${escapeHtml(r.id)}</div>
        <div class="bc-review-body">
          <div><span class="bc-lbl">Your answer</span>${userHtml}</div>
          <div><span class="bc-lbl">Correct answer</span><span class="bc-val right">${escapeHtml(r.correct)}</span></div>
        </div>
        <div class="bc-mark">${r.isCorrect ? "&#10003;" : "&#10007;"}</div>
      </div>`;
  });
  return html;
}


function calculateListeningBand(correct) {
  const c = Number(correct) || 0;
  if (c >= 39) return 9.0;
  if (c >= 37) return 8.5;
  if (c >= 35) return 8.0;
  if (c >= 32) return 7.5;
  if (c >= 30) return 7.0;
  if (c >= 26) return 6.5;
  if (c >= 23) return 6.0;
  if (c >= 18) return 5.5;
  if (c >= 16) return 5.0;
  if (c >= 13) return 4.5;
  if (c >= 10) return 4.0;
  if (c >= 6) return 3.5;
  if (c >= 4) return 3.0;
  return 2.5;
}

function calculateReadingBand(correct) {
  const c = Number(correct) || 0;
  if (c >= 39) return 9.0;
  if (c >= 37) return 8.5;
  if (c >= 35) return 8.0;
  if (c >= 33) return 7.5;
  if (c >= 30) return 7.0;
  if (c >= 27) return 6.5;
  if (c >= 23) return 6.0;
  if (c >= 19) return 5.5;
  if (c >= 15) return 5.0;
  if (c >= 13) return 4.5;
  if (c >= 10) return 4.0;
  if (c >= 8) return 3.5;
  if (c >= 6) return 3.0;
  return 2.5;
}

function calculateOverallBand(lBand, rBand, wBand) {
  const l = parseFloat(lBand) || 0;
  const r = parseFloat(rBand) || 0;
  const w = parseFloat(wBand) || 0;
  const avg = (l + r + w) / 3;
  const floor = Math.floor(avg);
  const diff = avg - floor;
  if (diff < 0.25) return (floor).toFixed(1);
  if (diff < 0.75) return (floor + 0.5).toFixed(1);
  return (floor + 1.0).toFixed(1);
}

function buildScoreCardHtml(title, results, total, moduleBand, icon) {
  const hasData = results.length > 0;
  const correct = results.filter((r) => r.isCorrect).length;
  const unanswered = results.filter((r) => !r.answered).length;
  const incorrect = Math.max(0, results.length - correct - unanswered);
  const deg = hasData ? Math.round((correct / total) * 360) : 0;
  const bandStr = hasData && moduleBand !== undefined ? moduleBand.toFixed(1) : "N/A";
  return `
    <div class="bc-score-card">
      <div class="bc-ring" style="background: conic-gradient(#0a2a6e 0deg ${deg}deg, #f3c9c6 ${deg}deg 360deg);">
        <div class="bc-ring-inner">
          <div class="bc-ring-score">${hasData ? correct : "N/A"}</div>
          <div class="bc-ring-total">out of ${total}</div>
        </div>
      </div>
      <div class="bc-score-info">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px;">
          <h3 style="margin:0; font-size:18px;">${icon || ""} ${title}</h3>
          ${hasData ? `<span class="bc-band-badge">Band ${bandStr}</span>` : ""}
        </div>
        <div class="bc-stats">
          <div class="bc-stat bc-stat-ok"><b>${hasData ? correct : "-"}</b><span>Correct</span></div>
          <div class="bc-stat bc-stat-bad"><b>${hasData ? incorrect : "-"}</b><span>Wrong</span></div>
          <div class="bc-stat bc-stat-skip"><b>${hasData ? unanswered : "-"}</b><span>Empty</span></div>
        </div>
      </div>
    </div>`;
}

function stripHtml(html) {
  if (!html) return "";
  const prepared = String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n");
  const d = document.createElement("div");
  d.innerHTML = prepared;
  return (d.textContent || "").trim();
}

function countWords(text) {
  const t = String(text || "").trim();
  return t === "" ? 0 : t.split(/\s+/).length;
}

function legacyCopy(text) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => legacyCopy(text));
  }
  return Promise.resolve(legacyCopy(text));
}

// প্রতিটা Task এর তথ্য: লেখা, প্রশ্ন, word count
function getWritingTasks(writingData) {
  let task1Text = "";
  let task2Text = "";

  if (typeof writingData === "object" && writingData !== null) {
    task1Text = writingData["part-1"] || writingData.task1 || writingData[0] || "";
    task2Text = writingData["part-2"] || writingData.task2 || writingData[1] || "";
  } else if (typeof writingData === "string") {
    task1Text = writingData;
  }

  let q1 = "";
  let q2 = "";
  try {
    const wq = (parsedQuestions && parsedQuestions.writing && parsedQuestions.writing.questions) || [];
    wq.forEach((q) => {
      if (q.part == 1) q1 = stripHtml(q.question);
      if (q.part == 2) q2 = stripHtml(q.question);
    });
  } catch (e) {
    console.warn("Could not read writing questions:", e);
  }

  const t1 = String(task1Text || "").trim();
  const t2 = String(task2Text || "").trim();

  return [
    { no: 1, essay: t1, question: q1, words: countWords(t1), min: 150 },
    { no: 2, essay: t2, question: q2, words: countWords(t2), min: 250 }
  ];
}

function buildTaskBlockLines(t) {
  const lines = [];
  lines.push("===== WRITING TASK " + t.no + " =====");
  if (t.question) {
    lines.push("TASK QUESTION:");
    lines.push(t.question);
    if (t.no === 1) {
      lines.push("(Note: the original chart/diagram image is not included here. Judge mainly on language, structure and clarity of reporting, and tell me if you need to see the visual.)");
    }
    lines.push("");
  }
  lines.push("MY RESPONSE (" + t.words + " words; minimum required: " + t.min + "):");
  lines.push('"""');
  lines.push(t.essay || "(No response written)");
  lines.push('"""');
  lines.push("");
  return lines;
}

function buildSinglePrompt(t) {
  const criteria = t.no === 1
    ? "Task Achievement, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy"
    : "Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy";

  const lines = [];
  lines.push("You are an expert IELTS Academic Writing examiner. Please assess my IELTS Writing Task " + t.no + " response strictly using the official IELTS band descriptors (" + criteria + ").");
  lines.push("");
  buildTaskBlockLines(t).forEach((l) => lines.push(l));
  lines.push("Please reply with:");
  lines.push("1. A band score (0-9, half bands allowed) for EACH of the four criteria, with 2-3 lines of justification each.");
  lines.push("2. My estimated overall band score for this task (and mention if the word count is too low).");
  lines.push("3. My most important grammar, vocabulary and spelling mistakes: quote the original sentence, give the corrected version, and briefly explain why.");
  lines.push("4. Specific ways to improve my structure, coherence and ideas.");
  lines.push("5. A rewritten Band 8+ version of my response that keeps my ideas.");
  lines.push("6. Three priority tips to raise my score next time.");
  lines.push("");
  lines.push("At the end, add a short summary of the feedback in Bengali (বাংলা).");
  return lines.join("\n");
}

function buildBothPrompt(tasks) {
  const lines = [];
  lines.push("You are an expert IELTS Academic Writing examiner. Please assess BOTH of my IELTS Writing responses below strictly using the official IELTS band descriptors. Remember that Task 2 carries twice the weight of Task 1 in the final Writing band.");
  lines.push("");
  tasks.forEach((t) => buildTaskBlockLines(t).forEach((l) => lines.push(l)));
  lines.push("For EACH task, please reply with:");
  lines.push("1. A band score (0-9, half bands allowed) for each of the four criteria (Task 1: Task Achievement; Task 2: Task Response; plus Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy), with 2-3 lines of justification each.");
  lines.push("2. The estimated overall band for that task (mention if the word count is too low).");
  lines.push("3. My most important grammar, vocabulary and spelling mistakes: quote the original sentence, give the corrected version, and briefly explain why.");
  lines.push("4. A rewritten Band 8+ version of my response that keeps my ideas.");
  lines.push("");
  lines.push("Then give me:");
  lines.push("- My estimated overall Writing band (Task 2 counts double).");
  lines.push("- Three priority tips to improve my Writing score next time.");
  lines.push("");
  lines.push("At the end, add a short summary of the feedback in Bengali (বাংলা).");
  return lines.join("\n");
}

function buildTaskCardHtml(t) {
  const hasText = t.essay !== "";
  const low = t.words < t.min;
  const essayHtml = hasText
    ? `<div class="bc-essay">${escapeHtml(t.essay)}</div>`
    : `<div class="bc-essay empty">No answer was written for this task.</div>`;
  const questionHtml = t.question
    ? `<details class="bc-task-q"><summary>View task question</summary><div>${escapeHtml(t.question)}</div></details>`
    : "";
  const dis = hasText ? "" : "disabled";

  return `
    <div class="bc-task-card" id="task-card-${t.no}">
      <div class="bc-task-head">
        <h4>Writing Task ${t.no}</h4>
        <span class="bc-wc ${low ? "low" : "ok"}">${t.words} words &middot; min ${t.min}</span>
      </div>
      ${questionHtml}
      ${essayHtml}
      <div class="bc-task-actions">
        <button type="button" class="bc-act primary" data-act="auto-ai" data-task="${t.no}" ${dis}>Evaluate with AI Now &rarr;</button>
        <button type="button" class="bc-act" data-act="prompt" data-task="${t.no}" ${dis}>Copy Prompt + Essay</button>
        <button type="button" class="bc-act" data-act="essay" data-task="${t.no}" ${dis}>Copy Essay Only</button>
        <button type="button" class="bc-act" data-act="chatgpt" data-task="${t.no}" ${dis}>ChatGPT</button>
        <button type="button" class="bc-act" data-act="gemini" data-task="${t.no}" ${dis}>Gemini</button>
      </div>
      <div id="ai-result-task-${t.no}"></div>
    </div>`;
}

function buildWritingPanelHtml(tasks) {
  const anyText = tasks.some((t) => t.essay !== "");
  const dis = anyText ? "" : "disabled";
  return `
    <div class="bc-ai-intro">
      <h3>Evaluate Your Writing with AI</h3>
      <p>নিচের বাটনে ক্লিক করলে রেডি প্রম্পটসহ আপনার লেখা কপি হয়ে যাবে। শুধু ChatGPT বা Gemini তে পেস্ট করুন, আপনার ব্যান্ড স্কোর, ভুলগুলো আর একটা Band 8+ মডেল উত্তর পেয়ে যাবেন।</p>
      <div class="bc-steps">
        <div class="bc-step"><span class="bc-step-num">1</span><span>Copy the ready-made prompt</span></div>
        <div class="bc-step"><span class="bc-step-num">2</span><span>Paste it in ChatGPT or Gemini</span></div>
        <div class="bc-step"><span class="bc-step-num">3</span><span>Get band score, mistakes &amp; model answer</span></div>
      </div>
    </div>

    <div class="bc-both-bar">
      <h4>Both Tasks Together</h4>
      <p>Get one overall Writing band (Task 2 counts double) with feedback on both tasks.</p>
      <div class="bc-both-actions">
        <button type="button" class="bc-act primary" data-act="prompt" data-task="both" ${dis}>Copy Both with Prompt</button>
        <button type="button" class="bc-act" data-act="chatgpt" data-task="both" ${dis}>Copy &amp; Open ChatGPT</button>
        <button type="button" class="bc-act" data-act="gemini" data-task="both" ${dis}>Copy &amp; Open Gemini</button>
      </div>
    </div>

    ${tasks.map(buildTaskCardHtml).join("")}
  `;
}

// ফাইনাল ফুল মক কমপ্রিহেনসিভ রেজাল্ট (Listening + Reading + Writing)
function showFinalComprehensiveResultModal(writingData, reason) {
  injectBcStyles();
  const existingModal = document.getElementById("instant-result-modal");
  if (existingModal) existingModal.remove();

  const TOTAL = 40;

  // ---- Listening data (stored by listening.js) ----
  const listeningOfficial = (parsedQuestions && parsedQuestions.listening && parsedQuestions.listening.answers) || {};
  const listeningMistakes = normalizeMistakes(readStoredJSON("listeningMistakes"));
  const listeningAnswers = readStoredJSON("listeningAnswers");
  const hasListeningData = !!(listeningMistakes || listeningAnswers);
  const listeningResults = hasListeningData
    ? buildModuleResults(listeningOfficial, listeningMistakes, listeningAnswers)
    : [];

  // ---- Reading data (stored by reading.js) ----
  const readingOfficial = (parsedQuestions && parsedQuestions.reading && parsedQuestions.reading.answers) || {};
  const readingMistakes = normalizeMistakes(readStoredJSON("readingMistakes"));
  const readingAnswers = readStoredJSON("readingAnswers");
  const hasReadingData = !!(readingMistakes || readingAnswers);
  const readingResults = hasReadingData
    ? buildModuleResults(readingOfficial, readingMistakes, readingAnswers)
    : [];

  const listeningCorrect = listeningResults.filter((r) => r.isCorrect).length;
  const readingCorrect = readingResults.filter((r) => r.isCorrect).length;
  const totalCorrect = listeningCorrect + readingCorrect;
  const totalQuestions = (hasListeningData ? TOTAL : 0) + (hasReadingData ? TOTAL : 0);

  // Compute Module Bands
  const listeningBand = hasListeningData ? calculateListeningBand(listeningCorrect) : 0;
  const readingBand = hasReadingData ? calculateReadingBand(readingCorrect) : 0;

  // ---- Writing data ----
  const tasks = getWritingTasks(writingData);

  const username = (document.getElementById("userID") && document.getElementById("userID").textContent.trim()) || "";
  const subtitle = reason === "timeup"
    ? "Writing time ended &mdash; your answers were submitted automatically"
    : "Listening, Reading & Writing Performance Report";

  const penIcon = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;

  const html = `
    <div id="instant-result-modal" class="bc-result">
      <div class="bc-result-header">
        <h1>Full Mock Test Results</h1>
        <p>${username ? "Candidate: " + escapeHtml(username) + " &nbsp;|&nbsp; " : ""}${subtitle}</p>
        <div class="bc-total-pill">Listening + Reading: ${totalCorrect} / ${totalQuestions}</div>
      </div>

      <div class="bc-result-wrap">
        <!-- TOP HERO: OVERALL BAND SCORE & 3-MODULE BREAKDOWN -->
        <div class="bc-hero-card">
          <div class="bc-hero-top">
            <!-- Overall Band -->
            <div class="bc-overall-box">
              <div class="bc-overall-label">OVERALL BAND</div>
              <div id="bc-hero-overall-score" class="bc-overall-score">
                <span class="bc-pulse-text" style="font-size:20px;">Calculating...</span>
              </div>
              <div class="bc-overall-sub">Based on 3 Modules</div>
            </div>

            <!-- 3 Modules Individual Bands -->
            <div class="bc-module-grid">
              <!-- Listening Module -->
              <div class="bc-mod-mini-card bc-mod-listening">
                <div class="bc-mod-mini-head">
                  <span class="bc-mod-icon" style="display:inline-flex; align-items:center;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg></span>
                  <span class="bc-mod-name">Listening</span>
                </div>
                <div class="bc-mod-band">Band ${hasListeningData ? listeningBand.toFixed(1) : "N/A"}</div>
                <div class="bc-mod-raw">${hasListeningData ? `${listeningCorrect} / 40 correct` : "No data"}</div>
              </div>

              <!-- Reading Module -->
              <div class="bc-mod-mini-card bc-mod-reading">
                <div class="bc-mod-mini-head">
                  <span class="bc-mod-icon" style="display:inline-flex; align-items:center;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></span>
                  <span class="bc-mod-name">Reading</span>
                </div>
                <div class="bc-mod-band">Band ${hasReadingData ? readingBand.toFixed(1) : "N/A"}</div>
                <div class="bc-mod-raw">${hasReadingData ? `${readingCorrect} / 40 correct` : "No data"}</div>
              </div>

              <!-- Writing Module -->
              <div class="bc-mod-mini-card bc-mod-writing">
                <div class="bc-mod-mini-head">
                  <span class="bc-mod-icon" style="display:inline-flex; align-items:center;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></span>
                  <span class="bc-mod-name">Writing</span>
                </div>
                <div id="bc-hero-writing-band" class="bc-mod-band bc-pulse-text" style="font-size:18px;">AI Evaluating...</div>
                <div class="bc-mod-raw">${tasks[0].words + tasks[1].words} total words</div>
              </div>
            </div>
          </div>

          <!-- Note: 3 modules only (no speaking) -->
          <div class="bc-module-note-banner">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; color:#d97706;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <div>
              <strong>Exam Note:</strong> This overall band score is calculated strictly across the <strong>3 completed modules (Listening, Reading, and Writing)</strong>. The Speaking interview module is not included in this Computer-Delivered mock test.
            </div>
          </div>
        </div>

        <!-- MODULE DETAIL SCORE CARDS -->
        <div class="bc-score-grid">
          ${buildScoreCardHtml("Listening", listeningResults, TOTAL, listeningBand, '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>')}
          ${buildScoreCardHtml("Reading", readingResults, TOTAL, readingBand, '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>')}
          
          <div class="bc-writing-card">
            <div class="bc-wc-left">
              <div class="bc-wc-icon">${penIcon}</div>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <h3 style="margin:0; display:inline-flex; align-items:center; gap:6px;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Writing Assessment</h3>
                  <span id="bc-writing-band-pill" class="bc-band-badge" style="background:#d52b1e;">Evaluating...</span>
                </div>
                <p style="margin-top:4px;">Task 1: ${tasks[0].words} words &nbsp;&middot;&nbsp; Task 2: ${tasks[1].words} words</p>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span id="bc-writing-total-badge" class="bc-total-pill" style="margin-top:0; background:#0a2a6e; font-size:16px;">
                AI Band: Calculating...
              </span>
              <button id="bc-goto-writing" class="bc-btn bc-btn-red" type="button" style="min-width:140px;">View Feedback &darr;</button>
            </div>
          </div>
        </div>

        <div class="bc-module-tabs">
          <button type="button" class="bc-module-tab" data-module="listening">Listening Answers</button>
          <button type="button" class="bc-module-tab" data-module="reading">Reading Answers</button>
          <button type="button" class="bc-module-tab active" data-module="writing">Writing &amp; AI Feedback</button>
        </div>

        <div class="bc-review-title" id="bc-review-title">
          <h3 id="bc-review-heading">Listening Review</h3>
          <div class="bc-tabs">
            <button type="button" class="bc-tab active" data-filter="all">All</button>
            <button type="button" class="bc-tab" data-filter="correct">Correct</button>
            <button type="button" class="bc-tab" data-filter="wrong">Wrong</button>
          </div>
        </div>

        <div id="bc-review-list">
          ${buildReviewItemsHtml(listeningResults, "listening")}
          ${buildReviewItemsHtml(readingResults, "reading")}
        </div>

        <div id="bc-writing-panel">
          ${buildWritingPanelHtml(tasks)}
        </div>
      </div>

      <div class="bc-result-footer">
        <button id="finish-mock-home-btn" class="bc-btn bc-btn-red" type="button">Finish &amp; Back to Home</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  const root = document.getElementById("instant-result-modal");
  const reviewList = document.getElementById("bc-review-list");
  const reviewTitle = document.getElementById("bc-review-title");
  const writingPanel = document.getElementById("bc-writing-panel");
  let activeModule = "writing";
  let activeFilter = "all";

  function applyView() {
    const isWriting = activeModule === "writing";
    reviewList.style.display = isWriting ? "none" : "";
    reviewTitle.style.display = isWriting ? "none" : "";
    writingPanel.style.display = isWriting ? "" : "none";

    if (!isWriting) {
      root.querySelectorAll("#bc-review-list > [data-module]").forEach((el) => {
        const sameModule = el.getAttribute("data-module") === activeModule;
        if (!sameModule) {
          el.style.display = "none";
          return;
        }
        if (!el.classList.contains("bc-review-item")) {
          el.style.display = "";
          return;
        }
        const ok = el.getAttribute("data-ok") === "1";
        const show = activeFilter === "all" || (activeFilter === "correct" && ok) || (activeFilter === "wrong" && !ok);
        el.style.display = show ? "" : "none";
      });
      const heading = document.getElementById("bc-review-heading");
      if (heading) heading.textContent = activeModule === "listening" ? "Listening Review" : "Reading Review";
    }
  }

  function setModule(name) {
    activeModule = name;
    root.querySelectorAll(".bc-module-tab").forEach((t) => {
      t.classList.toggle("active", t.getAttribute("data-module") === name);
    });
    applyView();
  }

  root.querySelectorAll(".bc-module-tab").forEach((tab) => {
    tab.addEventListener("click", () => setModule(tab.getAttribute("data-module")));
  });

  root.querySelectorAll(".bc-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      root.querySelectorAll(".bc-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.getAttribute("data-filter");
      applyView();
    });
  });

  applyView();

  // Writing summary card এর বাটন -> Writing tab এ নিয়ে যাবে
  document.getElementById("bc-goto-writing").addEventListener("click", () => {
    setModule("writing");
    writingPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

// AI Evaluation এবং Copy বাটন হ্যান্ডলার
  writingPanel.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("button[data-act]");
    if (!btn || btn.disabled) return;

    const act = btn.getAttribute("data-act");
    const key = btn.getAttribute("data-task");

    // ১. সাইটের ভেতরেই সরাসরি AI দিয়ে মূল্যায়নের লজিক
    if (act === "auto-ai") {
      const t = tasks.find((x) => String(x.no) === key);
      if (!t || !t.essay) return;

      const resultContainer = document.getElementById(`ai-result-task-${t.no}`);
      btn.disabled = true;
      const originalText = btn.innerHTML;
      btn.textContent = "Evaluating with AI...";

      resultContainer.innerHTML = `
        <div class="bc-ai-loading">
          Evaluating Task ${t.no} with IELTS Examiner AI... Please wait (10-15s).
        </div>`;

      try {
        const response = await fetch("/evaluate-essay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: t.question || `IELTS Writing Task ${t.no}`,
            essay: t.essay,
            taskType: Number(t.no) === 1 ? "task1" : "task2"
          })
        });

        const resData = await response.json();
        if (!resData.success) throw new Error(resData.message || "Failed");

        const data = resData.data;
        const crit1Label = Number(t.no) === 1 ? "Task Achievement" : "Task Response";
        const strengthsList = Array.isArray(data.strengths) ? data.strengths.filter(Boolean) : [];
        const correctionsList = Array.isArray(data.corrections) ? data.corrections.filter(c => c && (c.original || c.improved)) : [];

        const strengthsHtml = strengthsList.length
          ? `<div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px; margin:12px 0;">
              <b style="color:#15803d; font-size:13px; display:block; margin-bottom:4px;">✓ What You Did Well:</b>
              <ul style="margin:0; padding-left:18px; font-size:12.5px; color:#166534; line-height:1.5;">
                ${strengthsList.map(s => `<li>${escapeHtml(s)}</li>`).join("")}
              </ul>
            </div>`
          : "";

        const correctionsHtml = correctionsList.length
          ? `<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:11px 14px; margin:12px 0;">
              <b style="color:#0a2a6e; font-size:13px; display:block; margin-bottom:8px;">Sentence Corrections & Band 8+ Upgrades:</b>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${correctionsList.map(c => `
                  <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px 10px; font-size:12.5px; line-height:1.45;">
                    ${c.original ? `<div style="color:#b91c1c; margin-bottom:3px;"><b>Original:</b> <span style="text-decoration:line-through; opacity:0.9;">${escapeHtml(c.original)}</span></div>` : ""}
                    ${c.improved ? `<div style="color:#15803d; margin-bottom:3px;"><b>Band 8+ Upgrade:</b> ${escapeHtml(c.improved)}</div>` : ""}
                    ${c.reason ? `<div style="color:#64748b; font-size:11.5px;"><i>Why:</i> ${escapeHtml(c.reason)}</div>` : ""}
                  </div>
                `).join("")}
              </div>
            </div>`
          : "";

        resultContainer.innerHTML = `
          <div class="bc-ai-card">
            <div class="bc-ai-head">
              <h4 style="margin:0; color:#0a2a6e; font-size:18px;">AI Examiner Evaluation (Task ${t.no})</h4>
              <span class="bc-ai-score-pill">Band Score: ${data.overall_band}</span>
            </div>
            
            <p style="font-size:14px; color:#333; line-height:1.6; margin-bottom:15px;">
              <b>Examiner Summary:</b> ${escapeHtml(data.summary_feedback)}
            </p>

            <div class="bc-ai-criteria">
              <div class="bc-crit-box">
                <b>${crit1Label}</b> <span class="score">${data.task_response.score}</span>
                <p>${escapeHtml(data.task_response.comment)}</p>
              </div>
              <div class="bc-crit-box">
                <b>Coherence & Cohesion</b> <span class="score">${data.coherence_cohesion.score}</span>
                <p>${escapeHtml(data.coherence_cohesion.comment)}</p>
              </div>
              <div class="bc-crit-box">
                <b>Lexical Resource</b> <span class="score">${data.lexical_resource.score}</span>
                <p>${escapeHtml(data.lexical_resource.comment)}</p>
              </div>
              <div class="bc-crit-box">
                <b>Grammatical Accuracy</b> <span class="score">${data.grammar.score}</span>
                <p>${escapeHtml(data.grammar.comment)}</p>
              </div>
            </div>

            ${strengthsHtml}
            ${correctionsHtml}

            <div class="bc-ai-tips">
              <h5>Priority Improvement Tips:</h5>
              <ul>
                ${(data.key_improvements || []).map(tip => `<li>${escapeHtml(tip)}</li>`).join("")}
              </ul>
            </div>
          </div>
        `;
      } catch (err) {
        resultContainer.innerHTML = `
          <div class="bc-empty-note" style="border-color:#d52b1e; color:#d52b1e; margin-top:10px;">
            AI Evaluation failed: ${escapeHtml(err.message || "Server error")}. Please try again.
          </div>`;
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
      return;
    }

    // ২. আগের কপি ও ChatGPT/Gemini ওপেন করার লজিক (অপরিবর্তিত)
    let text = "";
    if (key === "both") {
      text = buildBothPrompt(tasks);
    } else {
      const t = tasks.find((x) => String(x.no) === key);
      if (!t) return;
      text = act === "essay" ? t.essay : buildSinglePrompt(t);
    }

    const ok = await copyText(text);

    if (!btn.dataset.label) btn.dataset.label = btn.innerHTML;
    btn.textContent = ok ? "Copied! \u2713" : "Copy failed";
    clearTimeout(btn._resetTimer);
    btn._resetTimer = setTimeout(() => { btn.innerHTML = btn.dataset.label; }, 2000);

    if (ok && act === "chatgpt") window.open("https://chatgpt.com/", "_blank", "noopener");
    if (ok && act === "gemini") window.open("https://gemini.google.com/app", "_blank", "noopener");
  });

  // Finish & Back to Home
  document.getElementById("finish-mock-home-btn").addEventListener("click", () => {
    sessionStorage.clear();
    localStorage.removeItem("listeningScore");
    localStorage.removeItem("listeningMistakes");
    localStorage.removeItem("listeningAnswers");
    localStorage.removeItem("readingScore");
    localStorage.removeItem("readingMistakes");
    localStorage.removeItem("readingAnswers");
    window.location.href = HOME_URL;
  });
  (async function triggerAutoEvaluation() {
    const badge = document.getElementById("bc-writing-total-badge");
    const container1 = document.getElementById("ai-result-task-1");
    const container2 = document.getElementById("ai-result-task-2");

    if (container1) container1.innerHTML = `<div class="bc-ai-loading">Evaluating Task 1 with AI...</div>`;
    if (container2) container2.innerHTML = `<div class="bc-ai-loading">Evaluating Task 2 with AI...</div>`;

    try {
      const res = await fetch("/evaluate-writing-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task1: { question: tasks[0].question, essay: tasks[0].essay },
          task2: { question: tasks[1].question, essay: tasks[1].essay }
        })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      const { final_band, task1, task2 } = json.data;

      // ১. উপরের ব্যাজে মূল ব্যান্ড স্কোর আপডেট
      if (badge) {
        badge.textContent = `Writing Band: ${final_band}`;
      const wBandNum = parseFloat(final_band) || 6.0;

      // Hero Card Writing Band
      const heroWritingBandEl = document.getElementById("bc-hero-writing-band");
      if (heroWritingBandEl) {
        heroWritingBandEl.textContent = `Band ${final_band}`;
        heroWritingBandEl.classList.remove("bc-pulse-text");
        heroWritingBandEl.style.fontSize = "24px";
      }

      // Writing Card Band Badge
      const writingCardBandEl = document.getElementById("bc-writing-band-pill");
      if (writingCardBandEl) {
        writingCardBandEl.textContent = `Band ${final_band}`;
      }

      // Calculate & update Overall Band Score across 3 modules
      const lBand = typeof listeningBand !== "undefined" ? listeningBand : (typeof calculateListeningBand === "function" ? calculateListeningBand(listeningCorrect) : 6.0);
      const rBand = typeof readingBand !== "undefined" ? readingBand : (typeof calculateReadingBand === "function" ? calculateReadingBand(readingCorrect) : 6.0);
      const overall = calculateOverallBand(lBand, rBand, wBandNum);
      const overallEl = document.getElementById("bc-hero-overall-score");
      if (overallEl) {
        overallEl.innerHTML = `<span class="bc-fade-in">${overall}</span>`;
      }

      // Auto-record full test results with 1-40 review & AI evaluation to student dashboard
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
      }
        badge.style.background = "#d52b1e";
      }

      // ২. নিচের টাস্ক কার্ডে বিস্তারিত ফলাফল
      const renderTaskResult = (container, data, taskNo) => {
        if (!container) return;
        if (data && data.not_submitted) {
          container.innerHTML = `
            <div class="bc-ai-card" style="border-style:dashed; border-color:#cbd5e1;">
              <div class="bc-ai-head">
                <h4 style="margin:0; color:#0a2a6e; font-size:17px;">Task ${taskNo} Assessment</h4>
                <span class="bc-ai-score-pill" style="background:#94a3b8;">Not Submitted</span>
              </div>
              <p style="font-size:13.5px; color:#64748b; margin:0;">
                ${escapeHtml(data.summary_feedback || "No response was submitted for this task.")}
              </p>
            </div>
          `;
          return;
        }

        const crit1Label = taskNo === 1 ? "Task Achievement" : "Task Response";
        const strengthsList = Array.isArray(data.strengths) ? data.strengths.filter(Boolean) : [];
        const correctionsList = Array.isArray(data.corrections) ? data.corrections.filter(c => c && (c.original || c.improved)) : [];

        const strengthsHtml = strengthsList.length
          ? `<div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px; margin:12px 0;">
              <b style="color:#15803d; font-size:13px; display:block; margin-bottom:4px;">✓ What You Did Well:</b>
              <ul style="margin:0; padding-left:18px; font-size:12.5px; color:#166534; line-height:1.5;">
                ${strengthsList.map(s => `<li>${escapeHtml(s)}</li>`).join("")}
              </ul>
            </div>`
          : "";

        const correctionsHtml = correctionsList.length
          ? `<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:11px 14px; margin:12px 0;">
              <b style="color:#0a2a6e; font-size:13px; display:block; margin-bottom:8px;">Sentence Corrections & Band 8+ Upgrades:</b>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${correctionsList.map(c => `
                  <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px 10px; font-size:12.5px; line-height:1.45;">
                    ${c.original ? `<div style="color:#b91c1c; margin-bottom:3px;"><b>Original:</b> <span style="text-decoration:line-through; opacity:0.9;">${escapeHtml(c.original)}</span></div>` : ""}
                    ${c.improved ? `<div style="color:#15803d; margin-bottom:3px;"><b>Band 8+ Upgrade:</b> ${escapeHtml(c.improved)}</div>` : ""}
                    ${c.reason ? `<div style="color:#64748b; font-size:11.5px;"><i>Why:</i> ${escapeHtml(c.reason)}</div>` : ""}
                  </div>
                `).join("")}
              </div>
            </div>`
          : "";

        container.innerHTML = `
          <div class="bc-ai-card">
            <div class="bc-ai-head">
              <h4 style="margin:0; color:#0a2a6e; font-size:17px;">Task ${taskNo} Assessment</h4>
              <span class="bc-ai-score-pill">Band: ${data.overall_band}</span>
            </div>
            <p style="font-size:13.5px; color:#333; line-height:1.5; margin-bottom:12px;">
              <b>Examiner Summary:</b> ${escapeHtml(data.summary_feedback)}
            </p>
            <div class="bc-ai-criteria">
              <div class="bc-crit-box">
                <b>${crit1Label}</b> <span class="score">${data.task_response.score}</span>
                <p>${escapeHtml(data.task_response.comment)}</p>
              </div>
              <div class="bc-crit-box">
                <b>Coherence & Cohesion</b> <span class="score">${data.coherence_cohesion.score}</span>
                <p>${escapeHtml(data.coherence_cohesion.comment)}</p>
              </div>
              <div class="bc-crit-box">
                <b>Lexical Resource</b> <span class="score">${data.lexical_resource.score}</span>
                <p>${escapeHtml(data.lexical_resource.comment)}</p>
              </div>
              <div class="bc-crit-box">
                <b>Grammatical Accuracy</b> <span class="score">${data.grammar.score}</span>
                <p>${escapeHtml(data.grammar.comment)}</p>
              </div>
            </div>
            ${strengthsHtml}
            ${correctionsHtml}
            <div class="bc-ai-tips">
              <h5>Priority Improvement Tips:</h5>
              <ul>
                ${(data.key_improvements || []).map(tip => `<li>${escapeHtml(tip)}</li>`).join("")}
              </ul>
            </div>
          </div>
        `;
      };

      renderTaskResult(container1, task1, 1);
      renderTaskResult(container2, task2, 2);

    } catch (err) {
      console.error("Auto AI eval error:", err);
      if (badge) badge.textContent = "Writing Band: Error";
      if (container1) container1.innerHTML = `<div class="bc-empty-note">Task 1 evaluation failed.</div>`;
      if (container2) container2.innerHTML = `<div class="bc-empty-note">Task 2 evaluation failed.</div>`;
    }
  })();
}

// Test shesh hole answer lock kora (textarea disable)
function lockExam() {
  injectBcStyles();
  document.body.classList.add("exam-locked");
  document.querySelectorAll("textarea, input").forEach((el) => { el.disabled = true; });
}

// রাইটিং সাবমিট ফাংশন (Finish দিলে বা টাইম শেষ হলে সরাসরি ফুল রেজাল্ট আসবে)
async function submitTest(reason) {
  if (isSubmitting) return;
  isSubmitting = true;
  examLocked = true;

  clearInterval(writingMinuteInterval);
  clearInterval(writingSecondsInterval);
  if (submitModal) submitModal.style.display = "none";
  if (fullscreenModal) fullscreenModal.style.display = "none";

  if (reason === "timeup") {
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
  }

  sessionStorage.setItem("writingIsCompleted", "true");
  const writingInputToSend = typeof gatherInput === "function" ? gatherInput(inputs) : {};
  lockExam();

  try {
    await fetch('/api/update-mock-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writingInputs: writingInputToSend, mod: "writing" })
    });
  } catch (err) {
    console.error("Writing submission error:", err);
  }

  // রেজাল্ট দেখার সময় fullscreen থেকে বের হয়ে যাবে (কপি ও নতুন ট্যাব খোলার সুবিধার জন্য)
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }

  showFinalComprehensiveResultModal(writingInputToSend, reason);
}

async function userData() {
  try {
    const res = await fetch("/api/user-data");
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error("User data fetch error:", err);
  }
}

document.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  const user = await userData();
  const userDiv = document.getElementById("userID");
  if (userDiv && user) {
    userDiv.textContent = user.username;
  }
});

function gatherInput(inputs) {
  const inputObj = {};
  inputs.forEach((input, index) => {
    inputObj[`part-${index + 1}`] = input.value;
  });
  return inputObj;
}

const submitBtn = document.getElementById("finishBtn");
const submitModal = document.getElementById("submit-warning-modal");
if (submitBtn) {
  submitBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    if (examLocked) return;
    if (submitModal) submitModal.style.display = "flex";
  });
}

const submitOkButton = document.getElementById("submit-ok-btn");
const submitStayButton = document.getElementById("submit-stay-btn");

if (submitOkButton) {
  submitOkButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (submitModal) submitModal.style.display = "none";
    await submitTest();
  });
}

if (submitStayButton) {
  submitStayButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (submitModal) submitModal.style.display = "none";
  });
}

window.addEventListener("keydown", function (e) {
  if (e.key === "F3" || (e.ctrlKey && e.key === "f") || (e.ctrlKey && e.key === "F")) {
    e.preventDefault();
  }
});

// Fullscreen check
const fullscreenModal = document.getElementById("fullscreen-warning-modal");
const fullscreenOkBtn = document.getElementById("fullscreen-ok-btn");
const fullscreenStayBtn = document.getElementById("fullscreen-stay-btn");

document.addEventListener("fullscreenchange", () => {
  if (examLocked) return;
  if (!document.fullscreenElement) {
    if (fullscreenModal) fullscreenModal.style.display = "flex";
  }
});

if (fullscreenOkBtn) {
  fullscreenOkBtn.onclick = async function () {
    if (fullscreenModal) fullscreenModal.style.display = "none";
    await submitTest();
  };
}

if (fullscreenStayBtn) {
  fullscreenStayBtn.onclick = function () {
    if (fullscreenModal) fullscreenModal.style.display = "none";
    document.documentElement.requestFullscreen().catch(() => {});
  };
}

// Popup settings logic
const popupSettings = document.getElementById("popup-settings");
const popupNote = document.getElementById("popup-note");
function settingsMenu() {
  popupSettings.classList.toggle("menu-visible");
}

function closeSettings() {
  popupSettings.classList.remove("menu-visible");
  popupNote.classList.remove("menu-visible");
}

function openNotes() {
  popupNote.classList.toggle("menu-visible");
}

// Popup to start writing
function openListeningPopup() {
  const overlay = document.getElementById("listeningOverlay");
  if (overlay) overlay.style.display = "flex";
  document.body.classList.add("listening-popup-active");
}

function closeListeningPopup() {
  const overlay = document.getElementById("listeningOverlay");
  overlay.style.display = "none";
  document.body.classList.remove("listening-popup-active");

  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch((err) => console.warn("Fullscreen blocked:", err));
  }

  //timer logic (timer blunt)
  const timer = document.getElementById("timer");
  let minutesRemaining = parseInt(timer.textContent) || 60;

  const interval = setInterval(async () => {
    minutesRemaining -= 1;

    if (minutesRemaining <= 10) {
      const timerBlunt = document.querySelector(".timer-blunt");
      const timerSpecific = document.querySelector(".timer-specific");
      if (timerSpecific) {
        timerSpecific.style.opacity = 1;
        timerSpecific.style.color = "red";
      }
      if (timerBlunt) timerBlunt.style.opacity = 0;
    }
    if (minutesRemaining <= 0) {
      timer.textContent = '0';
      clearInterval(interval);
      await submitTest("timeup");
    } else {
      timer.textContent = minutesRemaining;
    }
  }, 1 * 60 * 1000);
  writingMinuteInterval = interval;

  //timer logic (timer specific)
  const minutesDisplay = document.getElementById("minutes");
  const secondsDisplay = document.getElementById("seconds");
  let timerSpecific;
  let totalSeconds = 60 * 60;
  function updateTimerDisplay() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
  }

  function startTimer() {
    timerSpecific = setInterval(function () {
      if (totalSeconds <= 0) {
        clearInterval(timerSpecific);
      } else {
        totalSeconds--;
        updateTimerDisplay();
      }
    }, 1000);
  }

  startTimer();
  writingSecondsInterval = timerSpecific;
}
openListeningPopup();
//popup to start writing


//part logic
function showPart(part){
  for (let i=1; i <= totalParts; i++){
    document.getElementById(`part-${i}`).style.display = i === part ?
    "block" : "none";
  }
  currentPart = part;
  
}



function showNext(event){
  event.preventDefault();
  if(currentPart < totalParts){
    currentPart++;
    showPart(currentPart);
  }
}

function showPrevious(event){
  event.preventDefault()
  if(currentPart > 1){
    currentPart--;
    showPart(currentPart);
  }
}

function update(){
  if(currentPart == 2){
    nextButton.classList.add("bton-grey");
    nextButton.classList.remove("next");
    //console.log(currentPart);
  }else{
    nextButton.classList.add("next");
  }
  if(currentPart == 1){
    prevButton.classList.add("bton-grey");
    prevButton.classList.remove("prev");
  }else{
    prevButton.classList.add("prev");
  }
}

setInterval(update, 1);





//word count logic

    //part 1
    const textarea = document.getElementById('writer-1');
    const wordCountDisplay = document.getElementById('wordCount-1');

    textarea.addEventListener('input', () => {
      const text = textarea.value.trim();
      const wordCount = text === '' ? 0 : text.split(/\s+/).length;
      wordCountDisplay.textContent = `Word Count: ${wordCount}`;
    });


    //part 2

    const textArea2 = document.getElementById('writer-2');
    const wordCountDisplay2 = document.getElementById("wordCount-2");

    textArea2.addEventListener('input', () => {
      const text = textArea2.value.trim();
      const wordCount = text === '' ? 0 : text.split(/\s+/).length;
      wordCountDisplay2.textContent = `Word Count: ${wordCount}`;
    });

let questionData = localStorage.getItem("data");
let parsedQuestions = null;
try {
  if (questionData) parsedQuestions = JSON.parse(questionData);
} catch (e) {}

const urlParams = new URLSearchParams(window.location.search);
const mockID = urlParams.get("mockID") || sessionStorage.getItem("currentMockId") || localStorage.getItem("currentMockId") || "";

const needsWritingRefresh = !parsedQuestions ||
  !parsedQuestions.writing ||
  (mockID && parsedQuestions.mockNumber !== mockID) ||
  (mockID && Array.isArray(parsedQuestions.writing.questions) && parsedQuestions.writing.questions.some(q => q.part === 1 && !Array.isArray(q.image)));

if (needsWritingRefresh) {
  try {
    const xhr = new XMLHttpRequest();
    const apiUrl = mockID ? `/api/mockTest?mockID=${encodeURIComponent(mockID)}` : "/api/mockTest";
    xhr.open("GET", apiUrl, false);
    xhr.send(null);
    if (xhr.status === 200) {
      parsedQuestions = JSON.parse(xhr.responseText);
      localStorage.setItem("data", JSON.stringify(parsedQuestions));
    }
  } catch (err) {
    console.error("Synchronous fallback for writing failed:", err);
  }
}

const questions = (parsedQuestions && parsedQuestions.writing && parsedQuestions.writing.questions) || [];



questions.forEach((q, index)=>{
    if(q.part == 1){
        const infoPanel = document.getElementById("info-panel-1");
        if (!infoPanel) return;
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const rawImg = q.image;
        const imgList = Array.isArray(rawImg) ? rawImg : (rawImg ? [rawImg] : []);
        imgList.forEach((img, idx)=>{
            imageContainer.innerHTML += `<img src="${img}">`
        })
        const qText = q.question || q.prompt || "";
        infoPanel.innerHTML += `
                            <p>${qText}</p>
        `
        infoPanel.appendChild(imageContainer);
    }

    if(q.part == 2){
        const infoPanel = document.getElementById("info-panel-2");
        if (!infoPanel) return;
        const qText = q.question || q.prompt || "";
        infoPanel.innerHTML += `
                        <p>${qText}</p>
        `
    }
})


const inputs = document.querySelectorAll(".write-input")




document.addEventListener("wheel", function (e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });


document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && (
    e.key === "+" ||
    e.key === "-" ||
    e.key === "=" ||
    e.key === "0"
  )) {
    e.preventDefault();
  }
});

// ==========================================
// AUTO-SAVE & DRAFT RECOVERY (TEST-SPECIFIC ISOLATION)
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
      const val = draft[`part-${index + 1}`];
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
