// // URL theke book, test ebong part parameter neya
// const urlParams = new URLSearchParams(window.location.search);
// const bookParam = urlParams.get("book") || "12";
// const testParam = urlParams.get("test") || "1";
// const partParam = urlParams.get("part");
// const activeRequestedPart = partParam ? Number(partParam) : null;

// let questions = [];
// let instructions = [];
// let officialAnswers = {};
// let currentAudioUrl = "";
// let partAudiosMap = {};

// // ----------------------------------------------------
// // 1. Data Fetching (Supports Cambridge Full & Part Test)
// // ----------------------------------------------------
// async function loadPracticeData() {
//   try {
//     let apiUrl = `/api/pracDataListening?book=${bookParam}&test=${testParam}`;
//     if (activeRequestedPart) {
//       apiUrl += `&part=${activeRequestedPart}`;
//     }

//     const res = await fetch(apiUrl);
//     const rawData = await res.json();
//     const data = rawData.listening ? rawData.listening : rawData;

//     if (!res.ok || !data.questions || data.questions.length === 0) {
//       console.error("Test data not found or empty:", data);
//       const testContent = document.getElementById("test-content");
//       if (testContent) {
//         testContent.innerHTML = `
//           <div style="text-align:center; padding: 50px; color: #e0202d;">
//             <h3>No questions found for Cambridge ${bookParam} Test ${testParam}</h3>
//             <p>Please make sure this test is uploaded and saved in database.</p>
//           </div>
//         `;
//       }
//       return;
//     }

//     questions = data.questions || [];
//     instructions = data.instructions || [];
//     officialAnswers = data.answers || {};
//     currentAudioUrl = data.audioUrl || data.audio || "";
//     partAudiosMap = data.partAudios || {};

//     // নির্দিষ্ট পার্ট প্র্যাকটিস ফিল্টার
//     if (activeRequestedPart) {
//       questions = questions.filter(q => Number(q.part) === activeRequestedPart);
//     }

//     // প্রশ্ন রেন্ডার
//     renderTestContent();
//     createPartQuestionNavButtons();
//     attachAnswerListeners();

//     // UI ও অডিও সেটআপ
//     if (activeRequestedPart) {
//       showPart(activeRequestedPart);

//       // নিচে অন্য পার্টের বাটনগুলো হাইড করে শুধু বর্তমান পার্ট রাখা
//       for (let i = 1; i <= 4; i++) {
//         const btn = document.getElementById(`part-${i}-button`);
//         if (btn) btn.style.display = (i === activeRequestedPart) ? "inline-flex" : "none";
//       }

//       // নির্দিষ্ট পার্টের অডিও লোড
//       const dedicatedAudio = (partAudiosMap && partAudiosMap[String(activeRequestedPart)]) 
//         ? partAudiosMap[String(activeRequestedPart)] 
//         : currentAudioUrl;
//       setupAudioPlayer(dedicatedAudio);
//     } else {
//       // ফুল টেস্ট মোড
//       showPart(1);
//       const part1Audio = (partAudiosMap && partAudiosMap["1"]) 
//         ? partAudiosMap["1"] 
//         : currentAudioUrl;
//       setupAudioPlayer(part1Audio);
//     }

//   } catch (err) {
//     console.error("Error loading test data:", err);
//   }
// }

// // ----------------------------------------------------
// // 2. Stopwatch Timer Logic
// // ----------------------------------------------------
// let totalSeconds = 0;
// let timerInterval = null;
// const minutesDisplay = document.getElementById("minutes");
// const secondsDisplay = document.getElementById("seconds");

// function updateStopwatch() {
//   totalSeconds++;
//   const mins = Math.floor(totalSeconds / 60);
//   const secs = totalSeconds % 60;
//   if (minutesDisplay) minutesDisplay.textContent = String(mins).padStart(2, "0");
//   if (secondsDisplay) secondsDisplay.textContent = String(secs).padStart(2, "0");
// }

// function startTimer() {
//   if (!timerInterval) {
//     timerInterval = setInterval(updateStopwatch, 1000);
//   }
// }

// function stopTimer() {
//   clearInterval(timerInterval);
// }

// // ----------------------------------------------------
// // 3. Audio Player Controller
// // ----------------------------------------------------
// let currentAudio = null;
// let seeking = false;

// const playPauseBtn = document.getElementById("audioPlayPauseBtn");
// const playPauseIcon = document.getElementById("playPauseIcon");
// const rewindBtn = document.getElementById("audioRewindBtn");
// const forwardBtn = document.getElementById("audioForwardBtn");
// const seekSlider = document.getElementById("audioSeekSlider");
// const timeLabel = document.getElementById("audioTimeLabel");

// function formatTime(seconds) {
//   if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
//   const m = Math.floor(seconds / 60);
//   const s = Math.floor(seconds % 60);
//   return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
// }

// function updatePlayPauseIcon(isPlaying) {
//   if (!playPauseIcon) return;
//   if (isPlaying) {
//     playPauseIcon.classList.remove("bi-play-fill");
//     playPauseIcon.classList.add("bi-pause-fill");
//   } else {
//     playPauseIcon.classList.remove("bi-pause-fill");
//     playPauseIcon.classList.add("bi-play-fill");
//   }
// }

// function setupAudioPlayer(url) {
//   if (!url) {
//     console.warn("⚠️ Audio URL missing or empty!");
//     return;
//   }

//   const targetUrl = url.startsWith("http")
//     ? `/api/cambridge-proxy-audio?url=${encodeURIComponent(url)}`
//     : url;

//   if (currentAudio) {
//     currentAudio.pause();
//     currentAudio.removeAttribute("src");
//     currentAudio.load();
//   }

//   currentAudio = new Audio(targetUrl);
//   currentAudio.preload = "metadata";

//   currentAudio.onerror = () => {
//     updatePlayPauseIcon(false);
//   };

//   currentAudio.addEventListener("loadedmetadata", () => {
//     if (seekSlider && isFinite(currentAudio.duration)) {
//       seekSlider.max = Math.floor(currentAudio.duration);
//       seekSlider.value = Math.floor(currentAudio.currentTime || 0);
//     }
//     if (timeLabel) {
//       timeLabel.textContent = `${formatTime(currentAudio.currentTime)} / ${formatTime(currentAudio.duration)}`;
//     }
//   });

//   currentAudio.addEventListener("timeupdate", () => {
//     if (!seeking && seekSlider && timeLabel && currentAudio) {
//       seekSlider.value = Math.floor(currentAudio.currentTime);
//       timeLabel.textContent = `${formatTime(currentAudio.currentTime)} / ${formatTime(currentAudio.duration)}`;
//     }
//   });

//   currentAudio.addEventListener("play", () => updatePlayPauseIcon(true));
//   currentAudio.addEventListener("playing", () => updatePlayPauseIcon(true));
//   currentAudio.addEventListener("pause", () => updatePlayPauseIcon(false));
//   currentAudio.addEventListener("ended", () => {
//     updatePlayPauseIcon(false);
//     if (seekSlider) seekSlider.value = 0;
//   });
// }

// if (seekSlider) {
//   const onSeekStart = () => { seeking = true; };
//   const onSeekMove = () => {
//     seeking = true;
//     if (timeLabel && currentAudio) {
//       timeLabel.textContent = `${formatTime(seekSlider.value)} / ${formatTime(currentAudio.duration)}`;
//     }
//   };
//   const onSeekCommit = () => {
//     if (currentAudio && !isNaN(seekSlider.value)) {
//       currentAudio.currentTime = Number(seekSlider.value);
//     }
//     setTimeout(() => { seeking = false; }, 100);
//   };

//   seekSlider.addEventListener("mousedown", onSeekStart);
//   seekSlider.addEventListener("touchstart", onSeekStart, { passive: true });
//   seekSlider.addEventListener("input", onSeekMove);
//   seekSlider.addEventListener("change", onSeekCommit);
//   seekSlider.addEventListener("mouseup", onSeekCommit);
//   seekSlider.addEventListener("touchend", onSeekCommit);
// }

// if (playPauseBtn) {
//   playPauseBtn.addEventListener("click", () => {
//     if (!currentAudio) return;
//     if (currentAudio.paused) {
//       currentAudio.play().then(() => {
//         updatePlayPauseIcon(true);
//       }).catch(e => {
//         console.warn("Audio play prevented:", e);
//         updatePlayPauseIcon(false);
//       });
//     } else {
//       currentAudio.pause();
//       updatePlayPauseIcon(false);
//     }
//   });
// }

// if (rewindBtn) {
//   rewindBtn.addEventListener("click", () => {
//     if (currentAudio) currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 10);
//   });
// }

// if (forwardBtn) {
//   forwardBtn.addEventListener("click", () => {
//     if (currentAudio) {
//       const maxDuration = currentAudio.duration || 0;
//       currentAudio.currentTime = Math.min(maxDuration, currentAudio.currentTime + 10);
//     }
//   });
// }

// function closeListeningPopup() {
//   const overlay = document.getElementById("listeningOverlay");
//   if (overlay) overlay.style.display = "none";
//   if (currentAudio) currentAudio.pause();
//   startTimer();
// }

// // ----------------------------------------------------
// // 5. Part Switching & Dynamic Audio Switching
// // ----------------------------------------------------
// let totalParts = 4;
// let currentPart = 1;
// const nextButton = document.getElementById("next-button");
// const prevButton = document.getElementById("previous-button");

// function showPart(part) {
//   for (let i = 1; i <= totalParts; i++) {
//     const p = document.getElementById(`part-${i}`);
//     const b = document.getElementById(`part-${i}-button`);
//     if (p) {
//       if (activeRequestedPart) {
//         p.style.display = (i === activeRequestedPart) ? "block" : "none";
//       } else {
//         p.style.display = (i === part) ? "block" : "none";
//       }
//     }
//     if (b) {
//       if (i === part) b.classList.add("active");
//       else b.classList.remove("active");
//     }
//   }
//   currentPart = part;
//   updateNavArrows();

//   // ফুল টেস্ট চলাকালীন পার্ট পরিবর্তন হলে সেই পার্টের অডিও রেডি হওয়া
//   if (!activeRequestedPart && partAudiosMap && partAudiosMap[String(part)]) {
//     setupAudioPlayer(partAudiosMap[String(part)]);
//   }
// }

// function showNext(e) {
//   if (e) e.preventDefault();
//   if (activeRequestedPart) return;
//   if (currentPart < totalParts) {
//     currentPart++;
//     showPart(currentPart);
//     scrollToTop();
//   }
// }

// function showPrevious(e) {
//   if (e) e.preventDefault();
//   if (activeRequestedPart) return;
//   if (currentPart > 1) {
//     currentPart--;
//     showPart(currentPart);
//     scrollToTop();
//   }
// }

// function updateNavArrows() {
//   if (!nextButton || !prevButton) return;
//   if (activeRequestedPart) {
//     nextButton.style.display = "none";
//     prevButton.style.display = "none";
//     return;
//   }
//   if (currentPart === 4) {
//     nextButton.classList.add("bton-grey");
//     nextButton.classList.remove("next");
//   } else {
//     nextButton.classList.add("next");
//     nextButton.classList.remove("bton-grey");
//   }

//   if (currentPart === 1) {
//     prevButton.classList.add("bton-grey");
//     prevButton.classList.remove("prev");
//   } else {
//     prevButton.classList.add("prev");
//     prevButton.classList.remove("bton-grey");
//   }
// }

// // ----------------------------------------------------
// // 6. Test Evaluation
// // ----------------------------------------------------
// const answerArrayUpdated = {};

// function inputCheckUpdated() {
//   document.querySelectorAll("input").forEach((input) => {
//     if (input.type === "text") {
//       const id = input.getAttribute("data-question-id") || input.placeholder;
//       const answer = input.value.trim();
//       if (id) answerArrayUpdated[id] = [answer];
//     }
//     if (input.checked) {
//       const id = input.name;
//       const answer = input.value.trim();
//       if (id) answerArrayUpdated[id] = [answer];
//     }
//   });

//   document.querySelectorAll(".matching-information").forEach((sel) => {
//     if (sel.id) answerArrayUpdated[sel.id] = [sel.value];
//   });

//   document.querySelectorAll('[data-initial="empty"]').forEach((box) => {
//     if (box.id) answerArrayUpdated[box.id] = [box.textContent.trim()];
//   });
// }

// function evaluateScore(yourAnswers, realAnswers) {
//   let score = 0;
//   const mistakesList = [];

//   for (const qid in realAnswers) {
//     // নির্দিষ্ট পার্ট প্র্যাকটিসে অন্য পার্টের প্রশ্ন মূল্যায়ন বাদ দেওয়া
//     if (activeRequestedPart) {
//       const qNum = parseInt(qid, 10);
//       const isPartQ = activeRequestedPart === 1 ? (qNum >= 1 && qNum <= 10)
//         : activeRequestedPart === 2 ? (qNum >= 11 && qNum <= 20)
//         : activeRequestedPart === 3 ? (qNum >= 21 && qNum <= 30)
//         : (qNum >= 31 && qNum <= 40);
//       if (!isPartQ) continue;
//     }

//     const userVal = (yourAnswers[qid] && yourAnswers[qid][0]) ? yourAnswers[qid][0].trim() : "";
//     const validTargets = Array.isArray(realAnswers[qid]) ? realAnswers[qid] : [realAnswers[qid]];

//     const isMatch = validTargets.some(val => String(val).trim().toLowerCase() === userVal.toLowerCase());

//     if (isMatch && userVal !== "") {
//       score++;
//     } else {
//       mistakesList.push({
//         questionNo: qid,
//         userAnswer: userVal || "Unanswered",
//         correctAnswer: validTargets.join(" / ")
//       });
//     }
//   }

//   return { score, mistakes: mistakesList };
// }

// // ----------------------------------------------------
// // 6.0 Review Highlight Helpers (সব ধরনের প্রশ্নে সঠিক/ভুল দেখানোর জন্য)
// // ----------------------------------------------------
// function injectReviewHighlightStyles() {
//   if (document.getElementById("review-highlight-style")) return;
//   const style = document.createElement("style");
//   style.id = "review-highlight-style";
//   style.textContent = `
//     .review-opt-correct, .review-opt-wrong, .review-opt-missed {
//       border-radius: 6px;
//       padding: 2px 8px;
//       transition: background .2s;
//     }
//     label.review-opt-correct, label.review-opt-wrong, label.review-opt-missed {
//       display: inline-block;
//     }
//     .review-opt-correct { background: #e6f9ee !important; outline: 2px solid #2f855a; }
//     .review-opt-wrong   { background: #fdeceb !important; outline: 2px solid #e53e3e; }
//     .review-opt-missed  { background: #f0fff4 !important; outline: 2px dashed #2f855a; }
//     .review-tag {
//       display: inline-block;
//       margin-left: 8px;
//       font-size: 12px;
//       font-weight: 700;
//       padding: 1px 8px;
//       border-radius: 10px;
//       vertical-align: middle;
//     }
//     .review-tag.ok  { background: #2f855a; color: #fff; }
//     .review-tag.bad { background: #e53e3e; color: #fff; }
//     .review-tag.hint { background: #fff; color: #2f855a; border: 1px solid #2f855a; }
//     .review-group-badge { display: block; margin-top: 6px; }
//     .review-badge-ok {
//       display: inline-block;
//       margin-left: 8px;
//       font-size: 12px;
//       font-weight: 700;
//       color: #2f855a;
//     }
//   `;
//   document.head.appendChild(style);
// }

// function reviewNorm(v) {
//   return String(v === undefined || v === null ? "" : v).trim().toLowerCase();
// }

// // officialAnswers থেকে একটা প্রশ্নের সঠিক উত্তরগুলো (normalized) বের করা
// function getCorrectTargets(qid) {
//   const raw = officialAnswers[String(qid)];
//   if (raw === undefined || raw === null) return [];
//   return [].concat(raw).map(reviewNorm).filter(Boolean);
// }

// // একটা radio/checkbox option কি সঠিক উত্তরের সাথে মেলে? (value সরাসরি বা A,B,C -> 1,2,3 mapping)
// function optionMatchesTargets(inputEl, targets) {
//   const val = reviewNorm(inputEl.value);
//   if (targets.includes(val)) return true;

//   // সঠিক উত্তর letter (A/B/C...) হলে এবং option value সংখ্যা (1/2/3...) হলে
//   const asNumber = Number(val);
//   if (!isNaN(asNumber) && asNumber > 0) {
//     const letter = String.fromCharCode(96 + asNumber); // 1 -> a
//     if (targets.includes(letter)) return true;
//   }
//   // সঠিক উত্তর সংখ্যা হলে এবং option value letter হলে
//   if (val.length === 1 && val >= "a" && val <= "z") {
//     const num = String(val.charCodeAt(0) - 96);
//     if (targets.includes(num)) return true;
//   }
//   return false;
// }

// function addReviewTag(host, text, cls) {
//   if (!host) return;
//   const tag = document.createElement("span");
//   tag.className = `review-tag ${cls}`;
//   tag.textContent = text;
//   host.appendChild(tag);
// }

// function addGroupBadge(afterEl, correctText) {
//   if (!afterEl) return;
//   const badge = document.createElement("div");
//   badge.className = "review-badge review-group-badge";
//   badge.textContent = `Ans: ${correctText}`;
//   afterEl.insertAdjacentElement("afterend", badge);
// }

// function highlightAnswersOnScreen(mistakesList) {
//   injectReviewHighlightStyles();

//   const wrongMap = new Map();
//   mistakesList.forEach(m => wrongMap.set(String(m.questionNo), m.correctAnswer));

//   // ---------- Text inputs (sentence / note / form / short answer completion) ----------
//   document.querySelectorAll('input[type="text"]').forEach(input => {
//     input.disabled = true;
//     const qid = input.getAttribute("data-question-id") || input.placeholder;
//     if (!qid) return;

//     if (wrongMap.has(String(qid))) {
//       input.classList.add("input-wrong");
//       const badge = document.createElement("span");
//       badge.className = "review-badge";
//       badge.textContent = `Ans: ${wrongMap.get(String(qid))}`;
//       input.after(badge);
//     } else if (input.value.trim() !== "") {
//       input.classList.add("input-correct");
//     }
//   });

//   // ---------- Select (matching information) ----------
//   document.querySelectorAll("select").forEach(sel => {
//     sel.disabled = true;
//     const qid = sel.id;
//     if (!qid) return;

//     if (wrongMap.has(String(qid))) {
//       sel.classList.add("input-wrong");
//       const badge = document.createElement("span");
//       badge.className = "review-badge";
//       badge.textContent = `Ans: ${wrongMap.get(String(qid))}`;
//       sel.after(badge);
//     } else if (sel.value !== "") {
//       sel.classList.add("input-correct");
//     }
//   });

//   // ---------- Radio groups (MCQ one-choice, Map / Diagram labelling) ----------
//   const radiosByName = new Map();
//   document.querySelectorAll('input[type="radio"]').forEach(r => {
//     r.disabled = true;
//     if (!r.name) return;
//     if (!radiosByName.has(r.name)) radiosByName.set(r.name, []);
//     radiosByName.get(r.name).push(r);
//   });

//   radiosByName.forEach((radios, name) => {
//     const targets = getCorrectTargets(name);
//     if (!targets.length) return;

//     const checked = radios.find(r => r.checked) || null;
//     const isMapRow = !!radios[0].closest("tr.map-table-row");
//     const correctRadios = radios.filter(r => optionMatchesTargets(r, targets));
//     const userIsCorrect = !!checked && optionMatchesTargets(checked, targets);

//     // ইউজারের বাছাই করা option
//     if (checked) {
//       const host = isMapRow ? checked.closest("td") : (checked.closest("label") || checked.parentElement);
//       if (host) {
//         host.classList.add(userIsCorrect ? "review-opt-correct" : "review-opt-wrong");
//         if (!isMapRow) addReviewTag(host, userIsCorrect ? "✓ Correct" : "✗ Your answer", userIsCorrect ? "ok" : "bad");
//       }
//     }

//     // ভুল হলে বা উত্তর না দিলে সঠিক option টা সবুজ করে দেখানো
//     if (!userIsCorrect) {
//       correctRadios.forEach(r => {
//         const host = isMapRow ? r.closest("td") : (r.closest("label") || r.parentElement);
//         if (!host) return;
//         host.classList.add("review-opt-correct");
//         if (!isMapRow) addReviewTag(host, "✓ Correct answer", "hint");
//       });
//     }

//     // প্রশ্নের পাশে/নিচে Ans badge
//     const correctLabel = String(officialAnswers[String(name)] && [].concat(officialAnswers[String(name)]).join(" / "));
//     if (isMapRow) {
//       const row = radios[0].closest("tr");
//       const labelCell = row && row.cells && row.cells[1];
//       if (labelCell) {
//         if (userIsCorrect) {
//           const ok = document.createElement("span");
//           ok.className = "review-badge-ok";
//           ok.textContent = "✓";
//           labelCell.appendChild(ok);
//         } else {
//           const badge = document.createElement("span");
//           badge.className = "review-badge";
//           badge.style.marginLeft = "8px";
//           badge.textContent = `Ans: ${correctLabel}`;
//           labelCell.appendChild(badge);
//         }
//       }
//     } else if (!userIsCorrect) {
//       const mcqBox = radios[0].closest(".mcq");
//       const lastLabel = radios[radios.length - 1].closest("label");
//       addGroupBadge(mcqBox ? mcqBox.lastElementChild || lastLabel : lastLabel, correctLabel);
//     }
//   });

//   // ---------- Checkbox groups (MCQ two-choice / multiple answers) ----------
//   const checksByName = new Map();
//   document.querySelectorAll('input[type="checkbox"]').forEach(c => {
//     c.disabled = true;
//     if (!c.name) return;
//     if (!checksByName.has(c.name)) checksByName.set(c.name, []);
//     checksByName.get(c.name).push(c);
//   });

//   checksByName.forEach((boxes, name) => {
//     // এই গ্রুপের প্রশ্ন নম্বরগুলো (যেমন "15 16" বা name="q15" থেকে 15 ও 16)
//     let ids = [];
//     const dq = boxes[0].getAttribute("data-question-id");
//     if (dq) {
//       ids = dq.split(" ").map(s => s.trim()).filter(Boolean);
//     } else {
//       const n = parseInt(String(name).replace(/\D/g, ""), 10);
//       if (!isNaN(n)) ids = [String(n), String(n + 1)];
//     }

//     const targets = [];
//     ids.forEach(id => getCorrectTargets(id).forEach(t => { if (!targets.includes(t)) targets.push(t); }));
//     if (!targets.length) return;

//     let pickedCorrect = 0;
//     boxes.forEach(box => {
//       const host = box.closest(".options") || box.closest("label") || box.parentElement;
//       if (!host) return;
//       const isCorrectOpt = optionMatchesTargets(box, targets);

//       if (box.checked && isCorrectOpt) {
//         pickedCorrect++;
//         host.classList.add("review-opt-correct");
//         addReviewTag(host, "✓ Correct", "ok");
//       } else if (box.checked && !isCorrectOpt) {
//         host.classList.add("review-opt-wrong");
//         addReviewTag(host, "✗ Wrong", "bad");
//       } else if (!box.checked && isCorrectOpt) {
//         host.classList.add("review-opt-missed");
//         addReviewTag(host, "✓ Correct answer", "hint");
//       }
//     });

//     // সবগুলো সঠিক না ধরলে Ans badge দেখানো
//     if (pickedCorrect < targets.length) {
//       const lastHost = boxes[boxes.length - 1].closest(".options") || boxes[boxes.length - 1].parentElement;
//       const answersText = ids
//         .map(id => [].concat(officialAnswers[String(id)] || []).join(" / "))
//         .filter(Boolean)
//         .join(", ");
//       addGroupBadge(lastHost, answersText);
//     }
//   });

//   // ---------- Dropzone (feature matching / drag & drop) ----------
//   document.querySelectorAll('.dropzone').forEach(dz => {
//     const qid = dz.id;
//     if (wrongMap.has(String(qid))) {
//       dz.style.border = "2px solid #e53e3e";
//       dz.style.background = "#fff5f5";
//       const badge = document.createElement("div");
//       badge.className = "review-badge";
//       badge.style.marginTop = "4px";
//       badge.textContent = `Ans: ${wrongMap.get(String(qid))}`;
//       dz.appendChild(badge);
//     } else if (dz.textContent.trim() !== "" && dz.textContent.trim().toLowerCase() !== "empty") {
//       dz.style.border = "2px solid #2f855a";
//       dz.style.background = "#f0fff4";
//     }
//   });
// }

// // ----------------------------------------------------
// // 6.1 Band Score + British Council Style Result Screen
// //     (Shadow DOM এর ভেতরে রেন্ডার হয়, তাই পেজের CSS কার্ডের ডিজাইন নষ্ট করতে পারবে না)
// // ----------------------------------------------------
// function escapeHtml(str) {
//   return String(str).replace(/[&<>"']/g, (c) => ({
//     "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
//   }[c]));
// }

// // IELTS Listening: 40 টা প্রশ্নের raw score থেকে band score
// function listeningBand(raw) {
//   if (raw >= 39) return 9;
//   if (raw >= 37) return 8.5;
//   if (raw >= 35) return 8;
//   if (raw >= 32) return 7.5;
//   if (raw >= 30) return 7;
//   if (raw >= 26) return 6.5;
//   if (raw >= 23) return 6;
//   if (raw >= 18) return 5.5;
//   if (raw >= 16) return 5;
//   if (raw >= 13) return 4.5;
//   if (raw >= 10) return 4;
//   if (raw >= 8) return 3.5;
//   if (raw >= 6) return 3;
//   if (raw >= 4) return 2.5;
//   if (raw >= 3) return 2;
//   if (raw >= 2) return 1.5;
//   if (raw >= 1) return 1;
//   return 0;
// }

// // প্রশ্নটা বর্তমান practice এর অংশ কিনা (পার্ট প্র্যাকটিসে শুধু ওই পার্টের প্রশ্ন)
// function isInActivePart(qid) {
//   if (!activeRequestedPart) return true;
//   const qNum = parseInt(qid, 10);
//   if (isNaN(qNum)) return false;
//   return Math.ceil(qNum / 10) === activeRequestedPart;
// }

// function getPracticeResultCss() {
//   return `
//     :host { all: initial; position: fixed; inset: 0; z-index: 2147483647; display: block; }
//     *, *::before, *::after { box-sizing: border-box; }
//     h1, h2, h3, h4, p { margin: 0; }
//     button { font-family: inherit; }

//     .bc-result { position: fixed; inset: 0; background: #eef2f9; overflow-y: auto; font-family: "Segoe UI", system-ui, -apple-system, Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #1f2a44; -webkit-font-smoothing: antialiased; }

//     .bc-result-header { background: linear-gradient(135deg, #071d4f, #0a2a6e 55%, #1b4fb3); color: #fff; padding: 34px 20px 96px; text-align: center; border-bottom: 6px solid #d52b1e; }
//     .bc-result-header h1 { font-size: 28px; font-weight: 700; letter-spacing: .4px; color: #fff; }
//     .bc-result-header p { margin-top: 8px; opacity: .88; font-size: 14px; color: #fff; }
//     .bc-band-pill { display: inline-flex; flex-direction: column; align-items: center; margin-top: 18px; background: #d52b1e; color: #fff; padding: 10px 44px 12px; border-radius: 22px; box-shadow: 0 8px 20px rgba(0,0,0,.28); }
//     .bc-band-pill small { font-size: 11.5px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700; opacity: .92; }
//     .bc-band-pill b { font-size: 46px; line-height: 1.1; font-weight: 800; }
//     .bc-header-note { margin: 12px auto 0; max-width: 560px; font-size: 12.5px; opacity: .8; color: #fff; }

//     .bc-wrap { max-width: 920px; margin: -60px auto 0; padding: 0 16px 30px; }

//     .bc-score-card { background: #fff; border-radius: 16px; box-shadow: 0 12px 32px rgba(10,42,110,.18); padding: 28px; display: flex; gap: 30px; align-items: center; justify-content: center; flex-wrap: wrap; border-top: 4px solid #d52b1e; }
//     .bc-ring { width: 160px; height: 160px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
//     .bc-ring-inner { width: 124px; height: 124px; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; }
//     .bc-ring-score { font-size: 40px; font-weight: 800; color: #0a2a6e; line-height: 1; }
//     .bc-ring-total { font-size: 14px; font-weight: 700; color: #d52b1e; margin-top: 4px; }
//     .bc-score-info { flex: 1; min-width: 260px; }
//     .bc-score-info h2 { font-size: 20px; font-weight: 700; color: #0a2a6e; margin-bottom: 4px; }
//     .bc-score-info p { font-size: 14px; color: #5b6783; margin-bottom: 14px; }
//     .bc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
//     .bc-stat { border-radius: 10px; padding: 12px 8px; text-align: center; }
//     .bc-stat b { display: block; font-size: 24px; line-height: 1.1; }
//     .bc-stat span { font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
//     .bc-stat-ok { background: #e8efff; color: #0a2a6e; }
//     .bc-stat-bad { background: #fdeceb; color: #d52b1e; }
//     .bc-stat-skip { background: #f0f2f7; color: #5b6783; }

//     .bc-parts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0; }
//     .bc-part-box { background: #fff; border-radius: 12px; padding: 14px; box-shadow: 0 4px 14px rgba(10,42,110,.10); border-bottom: 3px solid #0a2a6e; }
//     .bc-part-box h4 { font-size: 13px; font-weight: 700; color: #5b6783; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 6px; }
//     .bc-part-score { font-size: 22px; font-weight: 800; color: #0a2a6e; }
//     .bc-part-score small { font-size: 13px; color: #d52b1e; font-weight: 700; }
//     .bc-bar { height: 6px; background: #f3c9c6; border-radius: 4px; margin-top: 8px; overflow: hidden; }
//     .bc-bar > div { height: 100%; background: #0a2a6e; }

//     .bc-review-title { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin: 26px 0 12px; }
//     .bc-review-title h3 { font-size: 20px; font-weight: 700; color: #0a2a6e; border-left: 5px solid #d52b1e; padding-left: 10px; }
//     .bc-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
//     .bc-tab { padding: 7px 14px; border-radius: 20px; border: 2px solid #0a2a6e; background: #fff; color: #0a2a6e; font-weight: 700; font-size: 13px; cursor: pointer; }
//     .bc-tab.active { background: #0a2a6e; color: #fff; }

//     .bc-part-sec-title { margin: 18px 0 8px; font-size: 14px; font-weight: 700; color: #fff; background: #0a2a6e; display: inline-block; padding: 5px 14px; border-radius: 6px; }
//     .bc-review-item { display: flex; align-items: center; gap: 14px; background: #fff; border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; border-left: 5px solid #0a2a6e; box-shadow: 0 2px 8px rgba(10,42,110,.07); }
//     .bc-review-item.bad { border-left-color: #d52b1e; background: #fffafa; }
//     .bc-q-num { width: 38px; height: 38px; border-radius: 50%; background: #0a2a6e; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; flex-shrink: 0; }
//     .bc-review-item.bad .bc-q-num { background: #d52b1e; }
//     .bc-review-body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; font-size: 14px; min-width: 0; }
//     .bc-lbl { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; color: #7a86a3; }
//     .bc-val { font-weight: 700; word-break: break-word; }
//     .bc-val.wrong { color: #d52b1e; }
//     .bc-val.right { color: #0a2a6e; }
//     .bc-val.empty { color: #9aa3b8; font-style: italic; font-weight: 600; }
//     .bc-mark { font-size: 22px; font-weight: 800; flex-shrink: 0; color: #0a2a6e; }
//     .bc-review-item.bad .bc-mark { color: #d52b1e; }
//     .bc-empty-note { background: #fff; border-radius: 10px; padding: 18px; text-align: center; color: #5b6783; border: 2px dashed #c9d3ea; }

//     .bc-footer { position: sticky; bottom: 0; background: #fff; border-top: 3px solid #d52b1e; padding: 14px 16px; box-shadow: 0 -6px 18px rgba(0,0,0,.08); }
//     .bc-footer-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
//     .bc-btn { min-width: 240px; padding: 13px 18px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; border: 2px solid transparent; transition: all .2s; }
//     .bc-btn-blue { background: #fff; color: #0a2a6e; border-color: #0a2a6e; }
//     .bc-btn-blue:hover { background: #0a2a6e; color: #fff; }
//     .bc-btn-red { background: #d52b1e; color: #fff; border-color: #d52b1e; }
//     .bc-btn-red:hover { background: #b01f14; border-color: #b01f14; }

//     @media (max-width: 640px) {
//       .bc-parts { grid-template-columns: repeat(2, 1fr); }
//       .bc-review-body { grid-template-columns: 1fr; }
//       .bc-result-header h1 { font-size: 22px; }
//       .bc-band-pill b { font-size: 38px; }
//       .bc-score-card { padding: 20px; gap: 20px; }
//       .bc-btn { min-width: 100%; }
//     }
//   `;
// }

// function showInstantPracticeResultModal(score, mistakesList) {
//   const existing = document.getElementById("instant-result-modal");
//   if (existing) existing.remove();

//   // কোন প্রশ্ন ভুল হয়েছে তার map
//   const wrongMap = new Map();
//   mistakesList.forEach(m => wrongMap.set(String(m.questionNo), m));

//   // প্রতিটা প্রশ্নের full result list (correct + wrong + unanswered)
//   const results = [];
//   Object.keys(officialAnswers)
//     .sort((a, b) => Number(a) - Number(b))
//     .forEach((key) => {
//       if (!isInActivePart(key)) return;
//       const ua = (answerArrayUpdated[key] && answerArrayUpdated[key][0]) ? String(answerArrayUpdated[key][0]).trim() : "";
//       const targets = [].concat(officialAnswers[key] || []).map((r) => String(r));
//       results.push({
//         id: key,
//         user: ua,
//         correct: targets.join(" / "),
//         isCorrect: !wrongMap.has(String(key)),
//         answered: ua !== "",
//         part: Math.ceil(Number(key) / 10) || 1
//       });
//     });

//   const mins = Math.floor(totalSeconds / 60);
//   const secs = totalSeconds % 60;
//   const timeTaken = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

//   const wrongTotal = mistakesList.length;
//   const totalQuestions = (score + wrongTotal) || (activeRequestedPart ? 10 : (Object.keys(officialAnswers).length || 40));
//   const unanswered = results.filter((r) => !r.answered).length;
//   const incorrect = Math.max(0, wrongTotal - unanswered);
//   const percent = Math.round((score / totalQuestions) * 100);
//   const deg = Math.round((score / totalQuestions) * 360);

//   // Band score (40 এর বাইরে হলে 40 এ scale করে estimate)
//   const isEstimated = totalQuestions !== 40;
//   const rawFor40 = isEstimated ? Math.min(40, Math.round((score / totalQuestions) * 40)) : score;
//   const band = listeningBand(rawFor40);
//   const bandText = band.toFixed(1);

//   const testLabel = `Cambridge ${escapeHtml(bookParam)} &middot; Test ${escapeHtml(testParam)}${activeRequestedPart ? " &middot; Part " + activeRequestedPart : ""}`;
//   const bandNote = isEstimated
//     ? `<p class="bc-header-note">This is a part practice (${totalQuestions} questions), so the band is estimated by scaling your score to 40 questions.</p>`
//     : "";

//   // Part-wise boxes (শুধু ফুল টেস্টে)
//   let partsHtml = "";
//   if (!activeRequestedPart) {
//     let boxes = "";
//     for (let p = 1; p <= 4; p++) {
//       const items = results.filter((r) => r.part === p);
//       const partTotal = items.length || 10;
//       const partCorrect = items.filter((r) => r.isCorrect).length;
//       const pct = Math.round((partCorrect / partTotal) * 100);
//       boxes += `
//         <div class="bc-part-box">
//           <h4>Part ${p}</h4>
//           <div class="bc-part-score">${partCorrect} <small>/ ${partTotal}</small></div>
//           <div class="bc-bar"><div style="width:${pct}%"></div></div>
//         </div>`;
//     }
//     partsHtml = `<div class="bc-parts">${boxes}</div>`;
//   }

//   // Review list grouped by part
//   let reviewHtml = "";
//   if (!results.length) {
//     reviewHtml = `<div class="bc-empty-note">No answer data found for this test.</div>`;
//   } else {
//     const partNumbers = Array.from(new Set(results.map((r) => r.part))).sort((a, b) => a - b);
//     partNumbers.forEach((p) => {
//       const items = results.filter((r) => r.part === p);
//       reviewHtml += `<div class="bc-part-sec"><div class="bc-part-sec-title">Part ${p}</div>`;
//       items.forEach((r) => {
//         const userHtml = r.answered
//           ? `<span class="bc-val ${r.isCorrect ? "right" : "wrong"}">${escapeHtml(r.user)}</span>`
//           : `<span class="bc-val empty">Not answered</span>`;
//         reviewHtml += `
//           <div class="bc-review-item ${r.isCorrect ? "ok" : "bad"}" data-ok="${r.isCorrect ? 1 : 0}">
//             <div class="bc-q-num">${escapeHtml(r.id)}</div>
//             <div class="bc-review-body">
//               <div><span class="bc-lbl">Your answer</span>${userHtml}</div>
//               <div><span class="bc-lbl">Correct answer</span><span class="bc-val right">${escapeHtml(r.correct)}</span></div>
//             </div>
//             <div class="bc-mark">${r.isCorrect ? "&#10003;" : "&#10007;"}</div>
//           </div>`;
//       });
//       reviewHtml += `</div>`;
//     });
//   }

//   const cardHtml = `
//     <div class="bc-result">
//       <div class="bc-result-header">
//         <h1>Listening Practice &ndash; Score Report</h1>
//         <p>${testLabel} &nbsp;|&nbsp; Time Taken: ${timeTaken}</p>
//         <div class="bc-band-pill">
//           <small>${isEstimated ? "Estimated Band" : "Band Score"}</small>
//           <b>${bandText}</b>
//         </div>
//         ${bandNote}
//       </div>

//       <div class="bc-wrap">
//         <div class="bc-score-card">
//           <div class="bc-ring" style="background: conic-gradient(#0a2a6e 0deg ${deg}deg, #f3c9c6 ${deg}deg 360deg);">
//             <div class="bc-ring-inner">
//               <div class="bc-ring-score">${score}</div>
//               <div class="bc-ring-total">out of ${totalQuestions}</div>
//             </div>
//           </div>
//           <div class="bc-score-info">
//             <h2>You answered ${score} out of ${totalQuestions} questions correctly</h2>
//             <p>Accuracy: ${percent}%</p>
//             <div class="bc-stats">
//               <div class="bc-stat bc-stat-ok"><b>${score}</b><span>Correct</span></div>
//               <div class="bc-stat bc-stat-bad"><b>${incorrect}</b><span>Incorrect</span></div>
//               <div class="bc-stat bc-stat-skip"><b>${unanswered}</b><span>Unanswered</span></div>
//             </div>
//           </div>
//         </div>

//         ${partsHtml}

//         <div class="bc-review-title">
//           <h3>Answer Review</h3>
//           <div class="bc-tabs">
//             <button type="button" class="bc-tab active" data-filter="all">All (${results.length})</button>
//             <button type="button" class="bc-tab" data-filter="correct">Correct (${score})</button>
//             <button type="button" class="bc-tab" data-filter="wrong">Incorrect (${wrongTotal})</button>
//           </div>
//         </div>

//         ${reviewHtml}
//       </div>

//       <div class="bc-footer">
//         <div class="bc-footer-actions">
//           <button id="preview-on-screen-btn" class="bc-btn bc-btn-blue" type="button">Review on Page</button>
//           <button id="exit-practice-btn" class="bc-btn bc-btn-red" type="button">Back to Hub</button>
//         </div>
//       </div>
//     </div>
//   `;

//   // Shadow DOM host: পেজের কোনো div/CSS এর ভেতরে পড়বে না, সরাসরি <html> এ বসবে
//   const host = document.createElement("div");
//   host.id = "instant-result-modal";
//   const shadow = host.attachShadow({ mode: "open" });
//   shadow.innerHTML = `<style>${getPracticeResultCss()}</style>${cardHtml}`;
//   document.documentElement.appendChild(host);

//   // Filter tabs
//   shadow.querySelectorAll(".bc-tab").forEach((tab) => {
//     tab.addEventListener("click", () => {
//       shadow.querySelectorAll(".bc-tab").forEach((t) => t.classList.remove("active"));
//       tab.classList.add("active");
//       const f = tab.getAttribute("data-filter");
//       shadow.querySelectorAll(".bc-review-item").forEach((it) => {
//         const ok = it.getAttribute("data-ok") === "1";
//         const show = f === "all" || (f === "correct" && ok) || (f === "wrong" && !ok);
//         it.style.display = show ? "" : "none";
//       });
//       shadow.querySelectorAll(".bc-part-sec").forEach((sec) => {
//         const any = Array.from(sec.querySelectorAll(".bc-review-item")).some((it) => it.style.display !== "none");
//         sec.style.display = any ? "" : "none";
//       });
//     });
//   });

//   shadow.querySelector("#preview-on-screen-btn").addEventListener("click", () => {
//     host.remove();
//   });

//   shadow.querySelector("#exit-practice-btn").addEventListener("click", () => {
//     window.location.href = "/practice-hub";
//   });
// }

// async function submitPracticeTest() {
//   stopTimer();
//   if (currentAudio) currentAudio.pause();
//   inputCheckUpdated();
//   const evaluation = evaluateScore(answerArrayUpdated, officialAnswers);
//   highlightAnswersOnScreen(evaluation.mistakes);
//   showInstantPracticeResultModal(evaluation.score, evaluation.mistakes);
// }

// // ----------------------------------------------------
// // 7. Modals Wiring
// // ----------------------------------------------------
// const finishBtn = document.getElementById("finishBtn");
// const submitWarningModal = document.getElementById("submit-warning-modal");
// const submitOkBtn = document.getElementById("submit-ok-btn");
// const submitStayBtn = document.getElementById("submit-stay-btn");

// if (finishBtn) {
//   finishBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     if (submitWarningModal) submitWarningModal.style.display = "flex";
//   });
// }

// if (submitOkBtn) {
//   submitOkBtn.addEventListener("click", async (e) => {
//     e.preventDefault();
//     if (submitWarningModal) submitWarningModal.style.display = "none";
//     await submitPracticeTest();
//   });
// }

// if (submitStayBtn) {
//   submitStayBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     if (submitWarningModal) submitWarningModal.style.display = "none";
//   });
// }

// // ----------------------------------------------------
// // 8. Dynamic Question Renderer
// // ----------------------------------------------------
// function findLowest(arr) {
//   const flat = Array.isArray(arr) ? arr.flat() : [arr];
//   return Math.min(...flat);
// }

// function findHighest(arr) {
//   const flat = Array.isArray(arr) ? arr.flat() : [arr];
//   return Math.max(...flat);
// }

// function createContainer(className, extraClasses = []) {
//   const div = document.createElement("div");
//   div.classList.add(className, ...extraClasses);
//   return div;
// }

// function renderTestContent() {
//   const seenGroups = new Set();
//   const groupCounts = new Map();

//   questions.forEach((q) => {
//     let pNum = q.part;
//     if (!pNum && q.id && q.id[0]) {
//       const qFirst = Number(q.id[0]);
//       pNum = qFirst <= 10 ? 1 : qFirst <= 20 ? 2 : qFirst <= 30 ? 3 : 4;
//       q.part = pNum;
//     }

//     const partMargin = document.getElementById(`part-margin-${pNum}`);
//     if (!partMargin) return;

//     groupCounts.set(q.group, (groupCounts.get(q.group) || 0) + 1);

//     if (!seenGroups.has(q.group)) {
//       const groupDiv = document.createElement("div");
//       groupDiv.classList.add(`group-${q.group}`);

//       groupDiv.appendChild(createContainer("mcq-container-one-choice"));
//       groupDiv.appendChild(createContainer("mcq-container-two-choice"));
//       groupDiv.appendChild(createContainer("table-container"));
//       groupDiv.appendChild(createContainer("sentence-completion-container"));
//       groupDiv.appendChild(createContainer("form-container"));
//       groupDiv.appendChild(createContainer("note-container"));
//       groupDiv.appendChild(createContainer("flowchart-container"));
//       groupDiv.appendChild(createContainer("short-answer-container", ["question"]));
//       groupDiv.appendChild(createContainer("matching-container"));
//       groupDiv.appendChild(createContainer("diagram-label-container"));
//       groupDiv.appendChild(createContainer("full-note-completion-container"));
//       groupDiv.appendChild(createContainer("matching-information-container"));

//       partMargin.appendChild(groupDiv);
//       seenGroups.add(q.group);
//     }
//   });

//   questions.forEach((q, index) => {
//     const groupDiv = document.querySelector(`.group-${q.group}`);
//     if (!groupDiv) return;

//     if (q.type === "mcq") {
//       const c = groupDiv.querySelector(".mcq-container-one-choice");
//       c.innerHTML += `
//         <div class="mcq"><p><strong>${index + 1}.</strong> ${q.text}</p>
//           <label><input type="radio" name="${index + 1}" value="1">&nbsp;&nbsp;${q.options[0]}</label><br>
//           <label><input type="radio" name="${index + 1}" value="2">&nbsp;&nbsp;${q.options[1]}</label><br>
//           <label><input type="radio" name="${index + 1}" value="3">&nbsp;&nbsp;${q.options[2]}</label><br>
//         </div>
//       `;
//     }

//     if (q.type === "shortAnswer") {
//       const c = groupDiv.querySelector(".short-answer-container");
//       c.innerHTML += `
//         <div class="short-answer-item">
//           <label><strong>${q.id}</strong> ${q.text}
//             <input type="text" name="${q.id}" placeholder="${q.id}" data-question-id="${q.id}">
//           </label>
//         </div>
//       `;
//     }

//     if (q.type === "sentence-completion") {
//       const c = groupDiv.querySelector(".sentence-completion-container");
//       const ul = document.createElement("ul");
//       q.sentences.forEach((s) => {
//         const li = document.createElement("li");
//         li.innerHTML = `<p>${s.replaceAll("[blank]", `<input type="text" class="blank-input">`)}</p>`;
//         ul.appendChild(li);
//       });
//       c.appendChild(ul);
//       c.querySelectorAll("input").forEach((inp, idx) => {
//         inp.setAttribute("placeholder", q.id[idx]);
//         inp.setAttribute("data-question-id", q.id[idx]);
//       });
//     }

//     if (q.type === "mcq-two-choice") {
//       const c = groupDiv.querySelector(".mcq-container-two-choice");
//       c.innerHTML += `
//         <div class="question-box">
//           <div class="number-boxes"><div class="num-box">${q.id[0]}</div><div class="num-box">${q.id[1]}</div></div>
//           <div class="question-text">${q.text}</div>
//         </div>
//       `;
//       q.options.forEach((opt, idx) => {
//         c.innerHTML += `<div class="options"><label>${idx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${q.id[0]}" value="${idx + 1}">&nbsp;&nbsp;${opt}</label></div>`;
//       });
//     }

//     if (q.type === "note-completion" || q.part === 4) {
//       const c = groupDiv.querySelector(".full-note-completion-container");
//       if (q.heading) c.innerHTML += `<h1 class="note-completion-title">${q.heading}</h1>`;
//       if (q.subheadings && q.paragraphs) {
//         q.subheadings.forEach((sub, sIdx) => {
//           c.innerHTML += `<p class="note-completion-subheading">${sub}</p>`;
//           if (q.paragraphs[sIdx]) {
//             q.paragraphs[sIdx].forEach(p => {
//               c.innerHTML += `<p>${p.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
//             });
//           }
//         });
//       } else if (q.paragraphs && q.paragraphs[0]) {
//         q.paragraphs[0].forEach(p => {
//           c.innerHTML += `<p>${p.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
//         });
//       }
//       c.querySelectorAll("input").forEach((inp, idx) => {
//         if (q.id && q.id[idx]) {
//           inp.setAttribute("placeholder", q.id[idx]);
//           inp.setAttribute("data-question-id", q.id[idx]);
//         }
//       });
//     }

//     if (q.type === "mcq-updated") {
//       const c = groupDiv.querySelector(".mcq-container-one-choice");
//       q.questions.forEach((question, qIdx) => {
//         const mcqDiv = document.createElement("div");
//         mcqDiv.classList.add("mcq");
//         mcqDiv.innerHTML = `<p data-question-id="${q.id[qIdx]}"><strong>${q.id[qIdx]}.</strong> ${question}</p>`;
//         q.options[qIdx].forEach((opt, optIdx) => {
//           mcqDiv.innerHTML += `<label>&nbsp;&nbsp;<input type="radio" name="${q.id[qIdx]}" value="${optIdx + 1}">&nbsp;&nbsp;${opt}</label><br>`;
//         });
//         c.appendChild(mcqDiv);
//       });
//     }

//     if (q.type === "shortAnswer-updated") {
//       const c = groupDiv.querySelector(".short-answer-container");
//       q.questions.forEach((question, qIdx) => {
//         c.innerHTML += `
//           <div class="short-answer-item">
//             <label><strong>${q.id[qIdx]}.</strong> ${question}
//               <input spellcheck="false" type="text" name="${q.id[qIdx]}" placeholder="${q.id[qIdx]}" data-question-id="${q.id[qIdx]}">
//             </label>
//           </div>
//         `;
//       });
//     }

//     if (q.type === "mcq-two-choice-updated") {
//       const c = groupDiv.querySelector(".mcq-container-two-choice");
//       q.questions.forEach((question, qIdx) => {
//         c.innerHTML += `
//           <div class="question-box">
//             <div class="number-boxes"><div class="num-box">${q.id[qIdx][0]}</div><div class="num-box">${q.id[qIdx][1]}</div></div>
//             <div class="question-text">${question[0]}</div>
//           </div>
//         `;
//         q.options[qIdx].forEach((opt, optIdx) => {
//           c.innerHTML += `<div class="options"><label>${optIdx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${q.id[qIdx][0]}" data-question-id="${q.id[qIdx][0]} ${q.id[qIdx][1]}" value="${optIdx + 1}">&nbsp;&nbsp;${opt}</label></div>`;
//         });
//       });
//     }

//     if (q.type === "feature-matching") {
//       const c = groupDiv.querySelector(".matching-container");
//       const allBoxes = document.createElement("div");
//       allBoxes.className = "all-boxes";
//       const feats = document.createElement("div");
//       feats.className = "matching-features";
//       const opts = document.createElement("div");
//       opts.className = "matching-options";

//       q.features.forEach((f, fIdx) => {
//         feats.innerHTML += `
//           <div class="qa-pair">
//             <div data-question-id="${q.id[fIdx]}" class="question-feature"><strong>${q.id[fIdx]}.</strong>&nbsp;&nbsp;${f}</div>
//             <div id="${q.id[fIdx]}" class="box dropzone" data-class="feature-matching" data-item="" data-initial="empty"></div>
//           </div>
//         `;
//       });
//       q.options.forEach((opt) => {
//         opts.innerHTML += `<div class="box" data-class="feature-matching" data-item="${opt}">${opt}</div>`;
//       });
//       allBoxes.appendChild(feats);
//       allBoxes.appendChild(opts);
//       c.appendChild(allBoxes);
//     }

//     // --- Map Labelling / Diagram Labelling (Image + Radio Grid Table UI) ---
//     const diagQType = String(q.type || "").trim().toLowerCase();
//     const isMapLabel =
//       diagQType.includes("diagram") ||
//       diagQType.includes("map") ||
//       diagQType === "diagram-labelling" ||
//       diagQType === "diagram-label" ||
//       diagQType === "map-labelling";

//     if (isMapLabel) {
//       const diagramContainer =
//         groupDiv.querySelector(".diagram-label-container") || groupDiv;
//       diagramContainer.innerHTML = "";

//       let rawImg = q.image || q.imageUrl || (q.images && q.images[0]) || "";
//       if (typeof rawImg === "string" && rawImg.includes("](")) {
//         rawImg = rawImg.split("](")[0].trim();
//       }
//       rawImg = (rawImg || "").trim();

//       // Reliable Image Source Formatter
//       let safeImgSrc = "";
//       if (rawImg) {
//         if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
//           safeImgSrc = rawImg;
//         } else if (rawImg.startsWith("/") || rawImg.startsWith("./") || rawImg.startsWith("data:")) {
//           safeImgSrc = rawImg;
//         } else {
//           safeImgSrc = `/${rawImg}`;
//         }
//       }

//       const optionsList =
//         q.letters || q.options || ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
//       const labelsList =
//         q.locations || q.labels || q.questions || q.features || q.items || [];
//       const idList = Array.isArray(q.id) ? q.id.flat(Infinity) : [q.id];

//       let tableHeaderCells = `<th></th><th style="min-width: 170px;"></th>`;
//       optionsList.forEach((opt) => {
//         tableHeaderCells += `<th class="text-center fw-bold" style="width: 42px; text-align: center;">${opt}</th>`;
//       });

//       let tableBodyRows = "";
//       labelsList.forEach((label, lIdx) => {
//         const qId = idList[lIdx] || lIdx + 1;
//         let radioCells = "";
//         optionsList.forEach((opt) => {
//           radioCells += `
//             <td class="text-center align-middle" style="text-align: center; vertical-align: middle;">
//               <input type="radio" 
//                      class="form-check-input map-radio-input" 
//                      name="${qId}" 
//                      id="map-${qId}-${opt}" 
//                      value="${opt}" 
//                      data-question-id="${qId}" 
//                      style="width: 18px; height: 18px; cursor: pointer;">
//             </td>`;
//         });

//         tableBodyRows += `
//           <tr class="map-table-row">
//             <td class="align-middle fw-bold text-center" style="width: 48px; text-align: center; vertical-align: middle;">
//               <span class="badge border text-dark bg-white px-2 py-1 fs-6">${qId}</span>
//             </td>
//             <td class="align-middle fw-semibold text-dark" style="font-size: 15px; vertical-align: middle;">
//               ${label}
//             </td>
//             ${radioCells}
//           </tr>`;
//       });

//       const imageElemHtml = safeImgSrc
//         ? `<img src="${safeImgSrc}" 
//                alt="Map Diagram" 
//                referrerpolicy="no-referrer"
//                onerror="if(!this.dataset.tried && this.src.startsWith('http')){ this.dataset.tried='true'; this.src='/api/proxy-image?url=' + encodeURIComponent(this.src); }"
//                style="max-width: 100%; height: auto; max-height: 520px; object-fit: contain; border-radius: 6px; display: block; margin: 0 auto;">`
//         : `<div class="p-4 text-muted fw-bold">No Map Image Found</div>`;

//       const mapLayoutHTML = `
//         <div class="row align-items-start my-4 g-4" style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; margin: 24px 0;">
//           <div class="col-lg-6 col-12 text-center" style="flex: 1 1 380px; min-width: 280px; text-align: center;">
//             <div class="p-2 border rounded-3 bg-white shadow-sm" style="display: inline-block; width: 100%; min-height: 250px; padding: 8px; border: 1px solid #dee2e6; border-radius: 10px; background: #fff;">
//               ${imageElemHtml}
//             </div>
//           </div>
//           <div class="col-lg-6 col-12" style="flex: 1 1 380px; min-width: 280px;">
//             <div class="table-responsive bg-white rounded-3 border shadow-sm p-2" style="overflow-x: auto; padding: 8px; border: 1px solid #dee2e6; border-radius: 10px; background: #fff;">
//               <table class="table table-bordered table-hover mb-0 align-middle" style="width: 100%; border-collapse: collapse;">
//                 <thead class="table-light">
//                   <tr>${tableHeaderCells}</tr>
//                 </thead>
//                 <tbody>
//                   ${tableBodyRows}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       `;

//       diagramContainer.innerHTML = mapLayoutHTML;
//     }
//   });

//   // Group Headers
//   let gIndex = 0;
//   groupCounts.forEach((val, group) => {
//     const groupDiv = document.querySelector(`.group-${group}`);
//     if (!groupDiv) return;

//     const gHeader = document.createElement("div");
//     gHeader.className = "group-header";

//     if (instructions[gIndex] && instructions[gIndex].instruction) {
//       const instDiv = document.createElement("div");
//       instDiv.className = "instructions";
//       instDiv.innerHTML = `<h3>${instructions[gIndex].instruction}</h3>`;
//       gHeader.prepend(instDiv);
//     }

//     if (questions[gIndex] && questions[gIndex].id) {
//       const min = findLowest(questions[gIndex].id);
//       const max = findHighest(questions[gIndex].id);
//       const rangeH3 = document.createElement("h3");
//       rangeH3.textContent = `Questions ${min} - ${max}`;
//       gHeader.prepend(rangeH3);
//     }

//     groupDiv.prepend(gHeader);
//     gIndex++;
//   });

//   document.querySelectorAll(".box").forEach(b => addDragEvents(b));
//   document.querySelectorAll(".diagram-box").forEach(b => addDragEvents(b));
// }

// // ----------------------------------------------------
// // 9. Bottom Navigation Tracking
// // ----------------------------------------------------
// function getQuestionElementById(qid) {
//   return document.querySelector(`[data-question-id="${qid}"], [id="${qid}"]`);
// }

// function isQuestionAnswered(qid) {
//   const textInput = document.querySelector(`input[type="text"][data-question-id="${qid}"], input[type="text"][placeholder="${qid}"]`);
//   if (textInput && textInput.value.trim() !== "") return true;

//   const inputsByName = document.querySelectorAll(`input[name="${qid}"]`);
//   if (inputsByName.length > 0) {
//     for (const el of inputsByName) {
//       if ((el.type === 'radio' || el.type === 'checkbox') && el.checked) return true;
//     }
//   }

//   const select = document.getElementById(qid);
//   if (select && select.value && select.value.trim() !== "") return true;

//   const dropzone = document.getElementById(String(qid));
//   if (dropzone) {
//     const text = dropzone.textContent.trim();
//     if (text !== "" && text.toLowerCase() !== "empty") return true;
//   }
//   return false;
// }

// function updateQNavState(qid) {
//   const btn = document.querySelector(`.qnav-btn[data-qid="${qid}"]`);
//   if (!btn) return;
//   if (isQuestionAnswered(qid)) {
//     btn.classList.add("attempted");
//   } else {
//     btn.classList.remove("attempted");
//   }
// }

// function createPartQuestionNavButtons() {
//   for (let part = 1; part <= 4; part++) {
//     // নির্দিষ্ট পার্ট প্র্যাকটিসে অন্য পার্ট স্কিপ করা
//     if (activeRequestedPart && part !== activeRequestedPart) continue;

//     const partEl = document.getElementById(`part-${part}`);
//     if (!partEl) continue;

//     const qEls = partEl.querySelectorAll("[data-question-id], [id]");
//     const qIds = [];

//     qEls.forEach(el => {
//       const attr = el.getAttribute("data-question-id");
//       if (!attr) return;
//       const ids = attr.split(" ").map(s => s.match(/\d+/)?.[0]).filter(Boolean);
//       ids.forEach(idNum => {
//         if (!qIds.includes(idNum)) qIds.push(idNum);
//       });
//     });

//     qIds.sort((a, b) => Number(a) - Number(b));

//     const container = document.querySelector(`.question-button-container[data-part="${part}"]`);
//     if (!container) continue;
//     container.innerHTML = "";

//     qIds.forEach(qid => {
//       const b = document.createElement("button");
//       b.className = "qnav-btn";
//       b.type = "button";
//       b.setAttribute("data-qid", qid);
//       b.textContent = qid;

//       b.addEventListener("click", (ev) => {
//         ev.stopPropagation();
//         const targetEl = getQuestionElementById(qid);
//         if (targetEl) {
//           const parentPartMatch = targetEl.closest(".part");
//           if (parentPartMatch) {
//             const whichPart = parentPartMatch.id.match(/\d+/);
//             if (whichPart && !activeRequestedPart) showPart(Number(whichPart[0]));
//           }
//           targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
//           document.querySelectorAll('.qnav-btn.current').forEach(x => x.classList.remove('current'));
//           b.classList.add('current');
//         }
//       });
//       container.appendChild(b);
//     });
//   }
// }

// function attachAnswerListeners() {
//   document.querySelectorAll('input[type="text"]').forEach(inp => {
//     inp.addEventListener('input', () => {
//       const qid = inp.getAttribute('data-question-id') || inp.getAttribute('placeholder');
//       if (qid) updateQNavState(String(qid));
//     });
//   });

//   document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp => {
//     inp.addEventListener('change', () => {
//       const name = inp.name;
//       if (name) {
//         const found = String(name).match(/\d+/);
//         updateQNavState(found ? found[0] : name);
//       }
//     });
//   });

//   document.querySelectorAll('select').forEach(sel => {
//     sel.addEventListener('change', () => {
//       if (sel.id) updateQNavState(String(sel.id));
//     });
//   });
// }

// // ----------------------------------------------------
// // 10. Drag and Drop Engine
// // ----------------------------------------------------
// let dragElement = null;

// function handleDragStart(e) {
//   this.style.opacity = "0.4";
//   dragElement = this;
//   e.dataTransfer.effectAllowed = "move";
//   e.dataTransfer.setData("item", this.innerHTML);
// }

// function handleDragOver(e) {
//   e.preventDefault();
//   e.dataTransfer.dropEffect = "move";
//   return false;
// }

// function handleDragEnter() { this.classList.add("dragover"); }
// function handleDragLeave() { this.classList.remove("dragover"); }

// function handleDrop(e) {
//   if (e.stopPropagation) e.stopPropagation();

//   if (dragElement !== this) {
//     const draggedGroup = dragElement.getAttribute("data-class");
//     const targetGroup = this.getAttribute("data-class");

//     if (draggedGroup !== targetGroup) {
//       this.classList.add("invalid-drop");
//       setTimeout(() => this.classList.remove("invalid-drop"), 1000);
//       return false;
//     }

//     const draggedHTML = dragElement.innerHTML;
//     const draggedItem = dragElement.getAttribute("data-item");
//     const targetHTML = this.innerHTML;
//     const targetItem = this.getAttribute("data-item");

//     dragElement.innerHTML = targetHTML;
//     dragElement.setAttribute("data-item", targetItem || "");
//     this.innerHTML = draggedHTML;
//     this.setAttribute("data-item", draggedItem || "");

//     addDragEvents(dragElement);
//     addDragEvents(this);

//     const aId = dragElement.getAttribute('id');
//     const bId = this.getAttribute('id');
//     if (aId) updateQNavState(aId);
//     if (bId) updateQNavState(bId);
//   }
// }

// function handleDragEnd() {
//   this.style.opacity = "1";
//   document.querySelectorAll(".box, .diagram-box").forEach(item => item.classList.remove("dragover"));
// }

// function addDragEvents(el) {
//   const hasContent = el.textContent.trim() !== "";
//   el.setAttribute("draggable", hasContent);
//   el.addEventListener("dragenter", handleDragEnter);
//   el.addEventListener("dragover", handleDragOver);
//   el.addEventListener("dragleave", handleDragLeave);
//   el.addEventListener("drop", handleDrop);
//   el.addEventListener("dragend", handleDragEnd);
//   if (hasContent) el.addEventListener("dragstart", handleDragStart);
// }

// function scrollToTop() {
//   window.scrollTo({ top: 0, behavior: "smooth" });
// }

// function settingsMenu() {
//   document.getElementById("popup-settings").classList.toggle("menu-visible");
// }

// function closeSettings() {
//   document.getElementById("popup-settings").classList.remove("menu-visible");
//   document.getElementById("popup-note").classList.remove("menu-visible");
// }

// function openNotes() {
//   document.getElementById("popup-note").classList.toggle("menu-visible");
// }

// document.addEventListener("DOMContentLoaded", async () => {
//   await loadPracticeData();
// });

// URL theke book, test ebong part parameter neya
const urlParams = new URLSearchParams(window.location.search);
const bookParam = urlParams.get("book") || "12";
const testParam = urlParams.get("test") || "1";
const partParam = urlParams.get("part");
const activeRequestedPart = partParam ? Number(partParam) : null;

let questions = [];
let instructions = [];
let officialAnswers = {};
let currentAudioUrl = "";
let partAudiosMap = {};

// ----------------------------------------------------
// 1. Data Fetching (Supports Cambridge Full & Part Test)
// ----------------------------------------------------
async function loadPracticeData() {
  try {
    let apiUrl = `/api/pracDataListening?book=${bookParam}&test=${testParam}`;
    if (activeRequestedPart) {
      apiUrl += `&part=${activeRequestedPart}`;
    }

    const res = await fetch(apiUrl);
    const rawData = await res.json();
    const data = rawData.listening ? rawData.listening : rawData;

    if (!res.ok || !data.questions || data.questions.length === 0) {
      console.error("Test data not found or empty:", data);
      const testContent = document.getElementById("test-content");
      if (testContent) {
        testContent.innerHTML = `
          <div style="text-align:center; padding: 50px; color: #e0202d;">
            <h3>No questions found for Cambridge ${bookParam} Test ${testParam}</h3>
            <p>Please make sure this test is uploaded and saved in database.</p>
          </div>
        `;
      }
      return;
    }

    questions = data.questions || [];
    instructions = data.instructions || [];
    officialAnswers = data.answers || {};
    currentAudioUrl = data.audioUrl || data.audio || "";
    partAudiosMap = data.partAudios || {};

    // নির্দিষ্ট পার্ট প্র্যাকটিস ফিল্টার
    if (activeRequestedPart) {
      questions = questions.filter(q => Number(q.part) === activeRequestedPart);
    }

    // প্রশ্ন রেন্ডার
    renderTestContent();
    createPartQuestionNavButtons();
    attachAnswerListeners();

    // UI ও অডিও সেটআপ
    if (activeRequestedPart) {
      showPart(activeRequestedPart);

      // নিচে অন্য পার্টের বাটনগুলো হাইড করে শুধু বর্তমান পার্ট রাখা
      for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById(`part-${i}-button`);
        if (btn) btn.style.display = (i === activeRequestedPart) ? "inline-flex" : "none";
      }

      // নির্দিষ্ট পার্টের অডিও লোড
      const dedicatedAudio = (partAudiosMap && partAudiosMap[String(activeRequestedPart)]) 
        ? partAudiosMap[String(activeRequestedPart)] 
        : currentAudioUrl;
      setupAudioPlayer(dedicatedAudio, String(activeRequestedPart));
    } else {
      // ফুল টেস্ট মোড
      showPart(1);
      const part1Audio = (partAudiosMap && partAudiosMap["1"]) 
        ? partAudiosMap["1"] 
        : currentAudioUrl;
      setupAudioPlayer(part1Audio, "1");
    }

  } catch (err) {
    console.error("Error loading test data:", err);
  }
}

// ----------------------------------------------------
// 2. Stopwatch Timer Logic
// ----------------------------------------------------
let totalSeconds = 0;
let timerInterval = null;
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

function updateStopwatch() {
  totalSeconds++;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (minutesDisplay) minutesDisplay.textContent = String(mins).padStart(2, "0");
  if (secondsDisplay) secondsDisplay.textContent = String(secs).padStart(2, "0");
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(updateStopwatch, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
}

// ----------------------------------------------------
// 3. Audio Player Controller
// ----------------------------------------------------
let currentAudio = null;
let seeking = false;
const audioCache = {}; // partKey -> Audio object (প্রতিটা পার্টের অডিও আলাদা থাকবে)

const playPauseBtn = document.getElementById("audioPlayPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const rewindBtn = document.getElementById("audioRewindBtn");
const forwardBtn = document.getElementById("audioForwardBtn");
const seekSlider = document.getElementById("audioSeekSlider");
const timeLabel = document.getElementById("audioTimeLabel");

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updatePlayPauseIcon(isPlaying) {
  if (!playPauseIcon) return;
  if (isPlaying) {
    playPauseIcon.classList.remove("bi-play-fill");
    playPauseIcon.classList.add("bi-pause-fill");
  } else {
    playPauseIcon.classList.remove("bi-pause-fill");
    playPauseIcon.classList.add("bi-play-fill");
  }
}

// অন্য সব অডিও pause করা (শুধু keepAudio বাদে)
function pauseOtherAudios(keepAudio) {
  Object.keys(audioCache).forEach((k) => {
    const a = audioCache[k];
    if (a && a !== keepAudio && !a.paused) a.pause();
  });
}

// সব অডিও pause করা (টেস্ট submit এর সময় ব্যবহার হয়)
function pauseAllAudios() {
  pauseOtherAudios(null);
  if (currentAudio) currentAudio.pause();
}

// বর্তমানে স্ক্রিনে দেখানো পার্টের অডিওর সাথে player UI (icon, slider, time) মিলিয়ে নেওয়া
function syncAudioUI() {
  if (!currentAudio) return;
  updatePlayPauseIcon(!currentAudio.paused && !currentAudio.ended);
  if (seekSlider) {
    if (isFinite(currentAudio.duration)) seekSlider.max = Math.floor(currentAudio.duration);
    seekSlider.value = Math.floor(currentAudio.currentTime || 0);
  }
  if (timeLabel) {
    timeLabel.textContent = `${formatTime(currentAudio.currentTime)} / ${formatTime(currentAudio.duration)}`;
  }
}

function setupAudioPlayer(url, partKey) {
  if (!url) {
    console.warn("⚠️ Audio URL missing or empty!");
    return;
  }

  const cacheKey = String(partKey || url);

  // এই পার্টের অডিও আগেই তৈরি থাকলে সেটাই ব্যবহার হবে (আগেরটা বন্ধ হবে না)
  if (audioCache[cacheKey]) {
    currentAudio = audioCache[cacheKey];
    syncAudioUI();
    return;
  }

  const targetUrl = url.startsWith("http")
    ? `/api/cambridge-proxy-audio?url=${encodeURIComponent(url)}`
    : url;

  const audio = new Audio(targetUrl);
  audio.preload = "metadata";
  audioCache[cacheKey] = audio;

  // নতুন পার্টের অডিও এখন স্ক্রিনের player এ বসবে, কিন্তু আগের পার্টের অডিও চললে চলতেই থাকবে
  currentAudio = audio;
  syncAudioUI();

  audio.onerror = () => {
    if (audio === currentAudio) updatePlayPauseIcon(false);
  };

  audio.addEventListener("loadedmetadata", () => {
    if (audio !== currentAudio) return;
    if (seekSlider && isFinite(audio.duration)) {
      seekSlider.max = Math.floor(audio.duration);
      seekSlider.value = Math.floor(audio.currentTime || 0);
    }
    if (timeLabel) {
      timeLabel.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (audio !== currentAudio) return;
    if (!seeking && seekSlider && timeLabel) {
      seekSlider.value = Math.floor(audio.currentTime);
      timeLabel.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  });

  audio.addEventListener("play", () => {
    // নতুন অডিও চালু হলে তখনই বাকি সব অডিও বন্ধ হবে
    pauseOtherAudios(audio);
    if (audio === currentAudio) updatePlayPauseIcon(true);
  });
  audio.addEventListener("playing", () => {
    if (audio === currentAudio) updatePlayPauseIcon(true);
  });
  audio.addEventListener("pause", () => {
    if (audio === currentAudio) updatePlayPauseIcon(false);
  });
  audio.addEventListener("ended", () => {
    if (audio !== currentAudio) return;
    updatePlayPauseIcon(false);
    if (seekSlider) seekSlider.value = 0;
  });
}

if (seekSlider) {
  const onSeekStart = () => { seeking = true; };
  const onSeekMove = () => {
    seeking = true;
    if (timeLabel && currentAudio) {
      timeLabel.textContent = `${formatTime(seekSlider.value)} / ${formatTime(currentAudio.duration)}`;
    }
  };
  const onSeekCommit = () => {
    if (currentAudio && !isNaN(seekSlider.value)) {
      currentAudio.currentTime = Number(seekSlider.value);
    }
    setTimeout(() => { seeking = false; }, 100);
  };

  seekSlider.addEventListener("mousedown", onSeekStart);
  seekSlider.addEventListener("touchstart", onSeekStart, { passive: true });
  seekSlider.addEventListener("input", onSeekMove);
  seekSlider.addEventListener("change", onSeekCommit);
  seekSlider.addEventListener("mouseup", onSeekCommit);
  seekSlider.addEventListener("touchend", onSeekCommit);
}

if (playPauseBtn) {
  playPauseBtn.addEventListener("click", () => {
    if (!currentAudio) return;
    if (currentAudio.paused) {
      currentAudio.play().then(() => {
        updatePlayPauseIcon(true);
      }).catch(e => {
        console.warn("Audio play prevented:", e);
        updatePlayPauseIcon(false);
      });
    } else {
      currentAudio.pause();
      updatePlayPauseIcon(false);
    }
  });
}

if (rewindBtn) {
  rewindBtn.addEventListener("click", () => {
    if (currentAudio) currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 10);
  });
}

if (forwardBtn) {
  forwardBtn.addEventListener("click", () => {
    if (currentAudio) {
      const maxDuration = currentAudio.duration || 0;
      currentAudio.currentTime = Math.min(maxDuration, currentAudio.currentTime + 10);
    }
  });
}

function closeListeningPopup() {
  const overlay = document.getElementById("listeningOverlay");
  if (overlay) overlay.style.display = "none";
  if (currentAudio) currentAudio.pause();
  startTimer();
}

// ----------------------------------------------------
// 5. Part Switching & Dynamic Audio Switching
// ----------------------------------------------------
let totalParts = 4;
let currentPart = 1;
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("previous-button");

function showPart(part) {
  for (let i = 1; i <= totalParts; i++) {
    const p = document.getElementById(`part-${i}`);
    const b = document.getElementById(`part-${i}-button`);
    if (p) {
      if (activeRequestedPart) {
        p.style.display = (i === activeRequestedPart) ? "block" : "none";
      } else {
        p.style.display = (i === part) ? "block" : "none";
      }
    }
    if (b) {
      if (i === part) b.classList.add("active");
      else b.classList.remove("active");
    }
  }
  currentPart = part;
  updateNavArrows();

  // ফুল টেস্ট চলাকালীন পার্ট পরিবর্তন হলে সেই পার্টের অডিও রেডি হওয়া
  if (!activeRequestedPart && partAudiosMap && partAudiosMap[String(part)]) {
    setupAudioPlayer(partAudiosMap[String(part)], String(part));
  }
}

function showNext(e) {
  if (e) e.preventDefault();
  if (activeRequestedPart) return;
  if (currentPart < totalParts) {
    currentPart++;
    showPart(currentPart);
    scrollToTop();
  }
}

function showPrevious(e) {
  if (e) e.preventDefault();
  if (activeRequestedPart) return;
  if (currentPart > 1) {
    currentPart--;
    showPart(currentPart);
    scrollToTop();
  }
}

function updateNavArrows() {
  if (!nextButton || !prevButton) return;
  if (activeRequestedPart) {
    nextButton.style.display = "none";
    prevButton.style.display = "none";
    return;
  }
  if (currentPart === 4) {
    nextButton.classList.add("bton-grey");
    nextButton.classList.remove("next");
  } else {
    nextButton.classList.add("next");
    nextButton.classList.remove("bton-grey");
  }

  if (currentPart === 1) {
    prevButton.classList.add("bton-grey");
    prevButton.classList.remove("prev");
  } else {
    prevButton.classList.add("prev");
    prevButton.classList.remove("bton-grey");
  }
}

// ----------------------------------------------------
// 6. Test Evaluation
// ----------------------------------------------------
const answerArrayUpdated = {};

function inputCheckUpdated() {
  document.querySelectorAll("input").forEach((input) => {
    if (input.type === "text") {
      const id = input.getAttribute("data-question-id") || input.placeholder;
      const answer = input.value.trim();
      if (id) answerArrayUpdated[id] = [answer];
    }
    if (input.checked) {
      const id = input.name;
      const answer = input.value.trim();
      if (id) answerArrayUpdated[id] = [answer];
    }
  });

  document.querySelectorAll(".matching-information").forEach((sel) => {
    if (sel.id) answerArrayUpdated[sel.id] = [sel.value];
  });

  document.querySelectorAll('[data-initial="empty"]').forEach((box) => {
    if (box.id) answerArrayUpdated[box.id] = [box.textContent.trim()];
  });
}

function evaluateScore(yourAnswers, realAnswers) {
  let score = 0;
  const mistakesList = [];

  for (const qid in realAnswers) {
    // নির্দিষ্ট পার্ট প্র্যাকটিসে অন্য পার্টের প্রশ্ন মূল্যায়ন বাদ দেওয়া
    if (activeRequestedPart) {
      const qNum = parseInt(qid, 10);
      const isPartQ = activeRequestedPart === 1 ? (qNum >= 1 && qNum <= 10)
        : activeRequestedPart === 2 ? (qNum >= 11 && qNum <= 20)
        : activeRequestedPart === 3 ? (qNum >= 21 && qNum <= 30)
        : (qNum >= 31 && qNum <= 40);
      if (!isPartQ) continue;
    }

    const userVal = (yourAnswers[qid] && yourAnswers[qid][0]) ? yourAnswers[qid][0].trim() : "";
    const validTargets = Array.isArray(realAnswers[qid]) ? realAnswers[qid] : [realAnswers[qid]];

    const isMatch = validTargets.some(val => String(val).trim().toLowerCase() === userVal.toLowerCase());

    if (isMatch && userVal !== "") {
      score++;
    } else {
      mistakesList.push({
        questionNo: qid,
        userAnswer: userVal || "Unanswered",
        correctAnswer: validTargets.join(" / ")
      });
    }
  }

  return { score, mistakes: mistakesList };
}

// ----------------------------------------------------
// 6.0 Review Highlight Helpers (সব ধরনের প্রশ্নে সঠিক/ভুল দেখানোর জন্য)
// ----------------------------------------------------
function injectReviewHighlightStyles() {
  if (document.getElementById("review-highlight-style")) return;
  const style = document.createElement("style");
  style.id = "review-highlight-style";
  style.textContent = `
    .review-opt-correct, .review-opt-wrong, .review-opt-missed {
      border-radius: 6px;
      padding: 2px 8px;
      transition: background .2s;
    }
    label.review-opt-correct, label.review-opt-wrong, label.review-opt-missed {
      display: inline-block;
    }
    .review-opt-correct { background: #e6f9ee !important; outline: 2px solid #2f855a; }
    .review-opt-wrong   { background: #fdeceb !important; outline: 2px solid #e53e3e; }
    .review-opt-missed  { background: #f0fff4 !important; outline: 2px dashed #2f855a; }
    .review-tag {
      display: inline-block;
      margin-left: 8px;
      font-size: 12px;
      font-weight: 700;
      padding: 1px 8px;
      border-radius: 10px;
      vertical-align: middle;
    }
    .review-tag.ok  { background: #2f855a; color: #fff; }
    .review-tag.bad { background: #e53e3e; color: #fff; }
    .review-tag.hint { background: #fff; color: #2f855a; border: 1px solid #2f855a; }
    .review-group-badge { display: block; margin-top: 6px; }
    .review-badge-ok {
      display: inline-block;
      margin-left: 8px;
      font-size: 12px;
      font-weight: 700;
      color: #2f855a;
    }
  `;
  document.head.appendChild(style);
}

function reviewNorm(v) {
  return String(v === undefined || v === null ? "" : v).trim().toLowerCase();
}

// officialAnswers থেকে একটা প্রশ্নের সঠিক উত্তরগুলো (normalized) বের করা
function getCorrectTargets(qid) {
  const raw = officialAnswers[String(qid)];
  if (raw === undefined || raw === null) return [];
  return [].concat(raw).map(reviewNorm).filter(Boolean);
}

// একটা radio/checkbox option কি সঠিক উত্তরের সাথে মেলে? (value সরাসরি বা A,B,C -> 1,2,3 mapping)
function optionMatchesTargets(inputEl, targets) {
  const val = reviewNorm(inputEl.value);
  if (targets.includes(val)) return true;

  // সঠিক উত্তর letter (A/B/C...) হলে এবং option value সংখ্যা (1/2/3...) হলে
  const asNumber = Number(val);
  if (!isNaN(asNumber) && asNumber > 0) {
    const letter = String.fromCharCode(96 + asNumber); // 1 -> a
    if (targets.includes(letter)) return true;
  }
  // সঠিক উত্তর সংখ্যা হলে এবং option value letter হলে
  if (val.length === 1 && val >= "a" && val <= "z") {
    const num = String(val.charCodeAt(0) - 96);
    if (targets.includes(num)) return true;
  }
  return false;
}

function addReviewTag(host, text, cls) {
  if (!host) return;
  const tag = document.createElement("span");
  tag.className = `review-tag ${cls}`;
  tag.textContent = text;
  host.appendChild(tag);
}

function addGroupBadge(afterEl, correctText) {
  if (!afterEl) return;
  const badge = document.createElement("div");
  badge.className = "review-badge review-group-badge";
  badge.textContent = `Ans: ${correctText}`;
  afterEl.insertAdjacentElement("afterend", badge);
}

function highlightAnswersOnScreen(mistakesList) {
  injectReviewHighlightStyles();

  const wrongMap = new Map();
  mistakesList.forEach(m => wrongMap.set(String(m.questionNo), m.correctAnswer));

  // ---------- Text inputs (sentence / note / form / short answer completion) ----------
  document.querySelectorAll('input[type="text"]').forEach(input => {
    input.disabled = true;
    const qid = input.getAttribute("data-question-id") || input.placeholder;
    if (!qid) return;

    if (wrongMap.has(String(qid))) {
      input.classList.add("input-wrong");
      const badge = document.createElement("span");
      badge.className = "review-badge";
      badge.textContent = `Ans: ${wrongMap.get(String(qid))}`;
      input.after(badge);
    } else if (input.value.trim() !== "") {
      input.classList.add("input-correct");
    }
  });

  // ---------- Select (matching information) ----------
  document.querySelectorAll("select").forEach(sel => {
    sel.disabled = true;
    const qid = sel.id;
    if (!qid) return;

    if (wrongMap.has(String(qid))) {
      sel.classList.add("input-wrong");
      const badge = document.createElement("span");
      badge.className = "review-badge";
      badge.textContent = `Ans: ${wrongMap.get(String(qid))}`;
      sel.after(badge);
    } else if (sel.value !== "") {
      sel.classList.add("input-correct");
    }
  });

  // ---------- Radio groups (MCQ one-choice, Map / Diagram labelling) ----------
  const radiosByName = new Map();
  document.querySelectorAll('input[type="radio"]').forEach(r => {
    r.disabled = true;
    if (!r.name) return;
    if (!radiosByName.has(r.name)) radiosByName.set(r.name, []);
    radiosByName.get(r.name).push(r);
  });

  radiosByName.forEach((radios, name) => {
    const targets = getCorrectTargets(name);
    if (!targets.length) return;

    const checked = radios.find(r => r.checked) || null;
    const isMapRow = !!radios[0].closest("tr.map-table-row");
    const correctRadios = radios.filter(r => optionMatchesTargets(r, targets));
    const userIsCorrect = !!checked && optionMatchesTargets(checked, targets);

    // ইউজারের বাছাই করা option
    if (checked) {
      const host = isMapRow ? checked.closest("td") : (checked.closest("label") || checked.parentElement);
      if (host) {
        host.classList.add(userIsCorrect ? "review-opt-correct" : "review-opt-wrong");
        if (!isMapRow) addReviewTag(host, userIsCorrect ? "✓ Correct" : "✗ Your answer", userIsCorrect ? "ok" : "bad");
      }
    }

    // ভুল হলে বা উত্তর না দিলে সঠিক option টা সবুজ করে দেখানো
    if (!userIsCorrect) {
      correctRadios.forEach(r => {
        const host = isMapRow ? r.closest("td") : (r.closest("label") || r.parentElement);
        if (!host) return;
        host.classList.add("review-opt-correct");
        if (!isMapRow) addReviewTag(host, "✓ Correct answer", "hint");
      });
    }

    // প্রশ্নের পাশে/নিচে Ans badge
    const correctLabel = String(officialAnswers[String(name)] && [].concat(officialAnswers[String(name)]).join(" / "));
    if (isMapRow) {
      const row = radios[0].closest("tr");
      const labelCell = row && row.cells && row.cells[1];
      if (labelCell) {
        if (userIsCorrect) {
          const ok = document.createElement("span");
          ok.className = "review-badge-ok";
          ok.textContent = "✓";
          labelCell.appendChild(ok);
        } else {
          const badge = document.createElement("span");
          badge.className = "review-badge";
          badge.style.marginLeft = "8px";
          badge.textContent = `Ans: ${correctLabel}`;
          labelCell.appendChild(badge);
        }
      }
    } else if (!userIsCorrect) {
      const mcqBox = radios[0].closest(".mcq");
      const lastLabel = radios[radios.length - 1].closest("label");
      addGroupBadge(mcqBox ? mcqBox.lastElementChild || lastLabel : lastLabel, correctLabel);
    }
  });

  // ---------- Checkbox groups (MCQ two-choice / multiple answers) ----------
  const checksByName = new Map();
  document.querySelectorAll('input[type="checkbox"]').forEach(c => {
    c.disabled = true;
    if (!c.name) return;
    if (!checksByName.has(c.name)) checksByName.set(c.name, []);
    checksByName.get(c.name).push(c);
  });

  checksByName.forEach((boxes, name) => {
    // এই গ্রুপের প্রশ্ন নম্বরগুলো (যেমন "15 16" বা name="q15" থেকে 15 ও 16)
    let ids = [];
    const dq = boxes[0].getAttribute("data-question-id");
    if (dq) {
      ids = dq.split(" ").map(s => s.trim()).filter(Boolean);
    } else {
      const n = parseInt(String(name).replace(/\D/g, ""), 10);
      if (!isNaN(n)) ids = [String(n), String(n + 1)];
    }

    const targets = [];
    ids.forEach(id => getCorrectTargets(id).forEach(t => { if (!targets.includes(t)) targets.push(t); }));
    if (!targets.length) return;

    let pickedCorrect = 0;
    boxes.forEach(box => {
      const host = box.closest(".options") || box.closest("label") || box.parentElement;
      if (!host) return;
      const isCorrectOpt = optionMatchesTargets(box, targets);

      if (box.checked && isCorrectOpt) {
        pickedCorrect++;
        host.classList.add("review-opt-correct");
        addReviewTag(host, "✓ Correct", "ok");
      } else if (box.checked && !isCorrectOpt) {
        host.classList.add("review-opt-wrong");
        addReviewTag(host, "✗ Wrong", "bad");
      } else if (!box.checked && isCorrectOpt) {
        host.classList.add("review-opt-missed");
        addReviewTag(host, "✓ Correct answer", "hint");
      }
    });

    // সবগুলো সঠিক না ধরলে Ans badge দেখানো
    if (pickedCorrect < targets.length) {
      const lastHost = boxes[boxes.length - 1].closest(".options") || boxes[boxes.length - 1].parentElement;
      const answersText = ids
        .map(id => [].concat(officialAnswers[String(id)] || []).join(" / "))
        .filter(Boolean)
        .join(", ");
      addGroupBadge(lastHost, answersText);
    }
  });

  // ---------- Dropzone (feature matching / drag & drop) ----------
  document.querySelectorAll('.dropzone').forEach(dz => {
    const qid = dz.id;
    if (wrongMap.has(String(qid))) {
      dz.style.border = "2px solid #e53e3e";
      dz.style.background = "#fff5f5";
      const badge = document.createElement("div");
      badge.className = "review-badge";
      badge.style.marginTop = "4px";
      badge.textContent = `Ans: ${wrongMap.get(String(qid))}`;
      dz.appendChild(badge);
    } else if (dz.textContent.trim() !== "" && dz.textContent.trim().toLowerCase() !== "empty") {
      dz.style.border = "2px solid #2f855a";
      dz.style.background = "#f0fff4";
    }
  });
}

// ----------------------------------------------------
// 6.1 Band Score + British Council Style Result Screen
//     (Shadow DOM এর ভেতরে রেন্ডার হয়, তাই পেজের CSS কার্ডের ডিজাইন নষ্ট করতে পারবে না)
// ----------------------------------------------------
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// IELTS Listening: 40 টা প্রশ্নের raw score থেকে band score
function listeningBand(raw) {
  if (raw >= 39) return 9;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8;
  if (raw >= 32) return 7.5;
  if (raw >= 30) return 7;
  if (raw >= 26) return 6.5;
  if (raw >= 23) return 6;
  if (raw >= 18) return 5.5;
  if (raw >= 16) return 5;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4;
  if (raw >= 8) return 3.5;
  if (raw >= 6) return 3;
  if (raw >= 4) return 2.5;
  if (raw >= 3) return 2;
  if (raw >= 2) return 1.5;
  if (raw >= 1) return 1;
  return 0;
}

// প্রশ্নটা বর্তমান practice এর অংশ কিনা (পার্ট প্র্যাকটিসে শুধু ওই পার্টের প্রশ্ন)
function isInActivePart(qid) {
  if (!activeRequestedPart) return true;
  const qNum = parseInt(qid, 10);
  if (isNaN(qNum)) return false;
  return Math.ceil(qNum / 10) === activeRequestedPart;
}

function getPracticeResultCss() {
  return `
    :host { all: initial; position: fixed; inset: 0; z-index: 2147483647; display: block; }
    *, *::before, *::after { box-sizing: border-box; }
    h1, h2, h3, h4, p { margin: 0; }
    button { font-family: inherit; }

    .bc-result { position: fixed; inset: 0; background: #eef2f9; overflow-y: auto; font-family: "Segoe UI", system-ui, -apple-system, Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #1f2a44; -webkit-font-smoothing: antialiased; }

    .bc-result-header { background: linear-gradient(135deg, #071d4f, #0a2a6e 55%, #1b4fb3); color: #fff; padding: 34px 20px 96px; text-align: center; border-bottom: 6px solid #d52b1e; }
    .bc-result-header h1 { font-size: 28px; font-weight: 700; letter-spacing: .4px; color: #fff; }
    .bc-result-header p { margin-top: 8px; opacity: .88; font-size: 14px; color: #fff; }
    .bc-band-pill { display: inline-flex; flex-direction: column; align-items: center; margin-top: 18px; background: #d52b1e; color: #fff; padding: 10px 44px 12px; border-radius: 22px; box-shadow: 0 8px 20px rgba(0,0,0,.28); }
    .bc-band-pill small { font-size: 11.5px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700; opacity: .92; }
    .bc-band-pill b { font-size: 46px; line-height: 1.1; font-weight: 800; }
    .bc-header-note { margin: 12px auto 0; max-width: 560px; font-size: 12.5px; opacity: .8; color: #fff; }

    .bc-wrap { max-width: 920px; margin: -60px auto 0; padding: 0 16px 30px; }

    .bc-score-card { background: #fff; border-radius: 16px; box-shadow: 0 12px 32px rgba(10,42,110,.18); padding: 28px; display: flex; gap: 30px; align-items: center; justify-content: center; flex-wrap: wrap; border-top: 4px solid #d52b1e; }
    .bc-ring { width: 160px; height: 160px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .bc-ring-inner { width: 124px; height: 124px; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .bc-ring-score { font-size: 40px; font-weight: 800; color: #0a2a6e; line-height: 1; }
    .bc-ring-total { font-size: 14px; font-weight: 700; color: #d52b1e; margin-top: 4px; }
    .bc-score-info { flex: 1; min-width: 260px; }
    .bc-score-info h2 { font-size: 20px; font-weight: 700; color: #0a2a6e; margin-bottom: 4px; }
    .bc-score-info p { font-size: 14px; color: #5b6783; margin-bottom: 14px; }
    .bc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .bc-stat { border-radius: 10px; padding: 12px 8px; text-align: center; }
    .bc-stat b { display: block; font-size: 24px; line-height: 1.1; }
    .bc-stat span { font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
    .bc-stat-ok { background: #e8efff; color: #0a2a6e; }
    .bc-stat-bad { background: #fdeceb; color: #d52b1e; }
    .bc-stat-skip { background: #f0f2f7; color: #5b6783; }

    .bc-parts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0; }
    .bc-part-box { background: #fff; border-radius: 12px; padding: 14px; box-shadow: 0 4px 14px rgba(10,42,110,.10); border-bottom: 3px solid #0a2a6e; }
    .bc-part-box h4 { font-size: 13px; font-weight: 700; color: #5b6783; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 6px; }
    .bc-part-score { font-size: 22px; font-weight: 800; color: #0a2a6e; }
    .bc-part-score small { font-size: 13px; color: #d52b1e; font-weight: 700; }
    .bc-bar { height: 6px; background: #f3c9c6; border-radius: 4px; margin-top: 8px; overflow: hidden; }
    .bc-bar > div { height: 100%; background: #0a2a6e; }

    .bc-review-title { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin: 26px 0 12px; }
    .bc-review-title h3 { font-size: 20px; font-weight: 700; color: #0a2a6e; border-left: 5px solid #d52b1e; padding-left: 10px; }
    .bc-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .bc-tab { padding: 7px 14px; border-radius: 20px; border: 2px solid #0a2a6e; background: #fff; color: #0a2a6e; font-weight: 700; font-size: 13px; cursor: pointer; }
    .bc-tab.active { background: #0a2a6e; color: #fff; }

    .bc-part-sec-title { margin: 18px 0 8px; font-size: 14px; font-weight: 700; color: #fff; background: #0a2a6e; display: inline-block; padding: 5px 14px; border-radius: 6px; }
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

    .bc-footer { position: sticky; bottom: 0; background: #fff; border-top: 3px solid #d52b1e; padding: 14px 16px; box-shadow: 0 -6px 18px rgba(0,0,0,.08); }
    .bc-footer-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .bc-btn { min-width: 240px; padding: 13px 18px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; border: 2px solid transparent; transition: all .2s; }
    .bc-btn-blue { background: #fff; color: #0a2a6e; border-color: #0a2a6e; }
    .bc-btn-blue:hover { background: #0a2a6e; color: #fff; }
    .bc-btn-red { background: #d52b1e; color: #fff; border-color: #d52b1e; }
    .bc-btn-red:hover { background: #b01f14; border-color: #b01f14; }

    @media (max-width: 640px) {
      .bc-parts { grid-template-columns: repeat(2, 1fr); }
      .bc-review-body { grid-template-columns: 1fr; }
      .bc-result-header h1 { font-size: 22px; }
      .bc-band-pill b { font-size: 38px; }
      .bc-score-card { padding: 20px; gap: 20px; }
      .bc-btn { min-width: 100%; }
    }
  `;
}

function showInstantPracticeResultModal(score, mistakesList) {
  const existing = document.getElementById("instant-result-modal");
  if (existing) existing.remove();

  // কোন প্রশ্ন ভুল হয়েছে তার map
  const wrongMap = new Map();
  mistakesList.forEach(m => wrongMap.set(String(m.questionNo), m));

  // প্রতিটা প্রশ্নের full result list (correct + wrong + unanswered)
  const results = [];
  Object.keys(officialAnswers)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((key) => {
      if (!isInActivePart(key)) return;
      const ua = (answerArrayUpdated[key] && answerArrayUpdated[key][0]) ? String(answerArrayUpdated[key][0]).trim() : "";
      const targets = [].concat(officialAnswers[key] || []).map((r) => String(r));
      results.push({
        id: key,
        user: ua,
        correct: targets.join(" / "),
        isCorrect: !wrongMap.has(String(key)),
        answered: ua !== "",
        part: Math.ceil(Number(key) / 10) || 1
      });
    });

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const timeTaken = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const wrongTotal = mistakesList.length;
  const totalQuestions = (score + wrongTotal) || (activeRequestedPart ? 10 : (Object.keys(officialAnswers).length || 40));
  const unanswered = results.filter((r) => !r.answered).length;
  const incorrect = Math.max(0, wrongTotal - unanswered);
  const percent = Math.round((score / totalQuestions) * 100);
  const deg = Math.round((score / totalQuestions) * 360);

  // Band score (40 এর বাইরে হলে 40 এ scale করে estimate)
  const isEstimated = totalQuestions !== 40;
  const rawFor40 = isEstimated ? Math.min(40, Math.round((score / totalQuestions) * 40)) : score;
  const band = listeningBand(rawFor40);
  const bandText = band.toFixed(1);

  const testLabel = `Cambridge ${escapeHtml(bookParam)} &middot; Test ${escapeHtml(testParam)}${activeRequestedPart ? " &middot; Part " + activeRequestedPart : ""}`;
  const bandNote = isEstimated
    ? `<p class="bc-header-note">This is a part practice (${totalQuestions} questions), so the band is estimated by scaling your score to 40 questions.</p>`
    : "";

  // Part-wise boxes (শুধু ফুল টেস্টে)
  let partsHtml = "";
  if (!activeRequestedPart) {
    let boxes = "";
    for (let p = 1; p <= 4; p++) {
      const items = results.filter((r) => r.part === p);
      const partTotal = items.length || 10;
      const partCorrect = items.filter((r) => r.isCorrect).length;
      const pct = Math.round((partCorrect / partTotal) * 100);
      boxes += `
        <div class="bc-part-box">
          <h4>Part ${p}</h4>
          <div class="bc-part-score">${partCorrect} <small>/ ${partTotal}</small></div>
          <div class="bc-bar"><div style="width:${pct}%"></div></div>
        </div>`;
    }
    partsHtml = `<div class="bc-parts">${boxes}</div>`;
  }

  // Review list grouped by part
  let reviewHtml = "";
  if (!results.length) {
    reviewHtml = `<div class="bc-empty-note">No answer data found for this test.</div>`;
  } else {
    const partNumbers = Array.from(new Set(results.map((r) => r.part))).sort((a, b) => a - b);
    partNumbers.forEach((p) => {
      const items = results.filter((r) => r.part === p);
      reviewHtml += `<div class="bc-part-sec"><div class="bc-part-sec-title">Part ${p}</div>`;
      items.forEach((r) => {
        const userHtml = r.answered
          ? `<span class="bc-val ${r.isCorrect ? "right" : "wrong"}">${escapeHtml(r.user)}</span>`
          : `<span class="bc-val empty">Not answered</span>`;
        reviewHtml += `
          <div class="bc-review-item ${r.isCorrect ? "ok" : "bad"}" data-ok="${r.isCorrect ? 1 : 0}">
            <div class="bc-q-num">${escapeHtml(r.id)}</div>
            <div class="bc-review-body">
              <div><span class="bc-lbl">Your answer</span>${userHtml}</div>
              <div><span class="bc-lbl">Correct answer</span><span class="bc-val right">${escapeHtml(r.correct)}</span></div>
            </div>
            <div class="bc-mark">${r.isCorrect ? "&#10003;" : "&#10007;"}</div>
          </div>`;
      });
      reviewHtml += `</div>`;
    });
  }

  const cardHtml = `
    <div class="bc-result">
      <div class="bc-result-header">
        <h1>Listening Practice &ndash; Score Report</h1>
        <p>${testLabel} &nbsp;|&nbsp; Time Taken: ${timeTaken}</p>
        <div class="bc-band-pill">
          <small>${isEstimated ? "Estimated Band" : "Band Score"}</small>
          <b>${bandText}</b>
        </div>
        ${bandNote}
      </div>

      <div class="bc-wrap">
        <div class="bc-score-card">
          <div class="bc-ring" style="background: conic-gradient(#0a2a6e 0deg ${deg}deg, #f3c9c6 ${deg}deg 360deg);">
            <div class="bc-ring-inner">
              <div class="bc-ring-score">${score}</div>
              <div class="bc-ring-total">out of ${totalQuestions}</div>
            </div>
          </div>
          <div class="bc-score-info">
            <h2>You answered ${score} out of ${totalQuestions} questions correctly</h2>
            <p>Accuracy: ${percent}%</p>
            <div class="bc-stats">
              <div class="bc-stat bc-stat-ok"><b>${score}</b><span>Correct</span></div>
              <div class="bc-stat bc-stat-bad"><b>${incorrect}</b><span>Incorrect</span></div>
              <div class="bc-stat bc-stat-skip"><b>${unanswered}</b><span>Unanswered</span></div>
            </div>
          </div>
        </div>

        ${partsHtml}

        <div class="bc-review-title">
          <h3>Answer Review</h3>
          <div class="bc-tabs">
            <button type="button" class="bc-tab active" data-filter="all">All (${results.length})</button>
            <button type="button" class="bc-tab" data-filter="correct">Correct (${score})</button>
            <button type="button" class="bc-tab" data-filter="wrong">Incorrect (${wrongTotal})</button>
          </div>
        </div>

        ${reviewHtml}
      </div>

      <div class="bc-footer">
        <div class="bc-footer-actions">
          <button id="preview-on-screen-btn" class="bc-btn bc-btn-blue" type="button">Review on Page</button>
          <button id="exit-practice-btn" class="bc-btn bc-btn-red" type="button">Back to Hub</button>
        </div>
      </div>
    </div>
  `;

  // Shadow DOM host: পেজের কোনো div/CSS এর ভেতরে পড়বে না, সরাসরি <html> এ বসবে
  const host = document.createElement("div");
  host.id = "instant-result-modal";
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `<style>${getPracticeResultCss()}</style>${cardHtml}`;
  document.documentElement.appendChild(host);

  // Filter tabs
  shadow.querySelectorAll(".bc-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      shadow.querySelectorAll(".bc-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const f = tab.getAttribute("data-filter");
      shadow.querySelectorAll(".bc-review-item").forEach((it) => {
        const ok = it.getAttribute("data-ok") === "1";
        const show = f === "all" || (f === "correct" && ok) || (f === "wrong" && !ok);
        it.style.display = show ? "" : "none";
      });
      shadow.querySelectorAll(".bc-part-sec").forEach((sec) => {
        const any = Array.from(sec.querySelectorAll(".bc-review-item")).some((it) => it.style.display !== "none");
        sec.style.display = any ? "" : "none";
      });
    });
  });

  shadow.querySelector("#preview-on-screen-btn").addEventListener("click", () => {
    host.remove();
  });

  shadow.querySelector("#exit-practice-btn").addEventListener("click", () => {
    window.location.href = "/practice-hub";
  });
}

async function submitPracticeTest() {
  stopTimer();
  pauseAllAudios();
  inputCheckUpdated();
  const evaluation = evaluateScore(answerArrayUpdated, officialAnswers);
  highlightAnswersOnScreen(evaluation.mistakes);
  showInstantPracticeResultModal(evaluation.score, evaluation.mistakes);
}

// ----------------------------------------------------
// 7. Modals Wiring
// ----------------------------------------------------
const finishBtn = document.getElementById("finishBtn");
const submitWarningModal = document.getElementById("submit-warning-modal");
const submitOkBtn = document.getElementById("submit-ok-btn");
const submitStayBtn = document.getElementById("submit-stay-btn");

if (finishBtn) {
  finishBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (submitWarningModal) submitWarningModal.style.display = "flex";
  });
}

if (submitOkBtn) {
  submitOkBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (submitWarningModal) submitWarningModal.style.display = "none";
    await submitPracticeTest();
  });
}

if (submitStayBtn) {
  submitStayBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (submitWarningModal) submitWarningModal.style.display = "none";
  });
}

// ----------------------------------------------------
// 8. Dynamic Question Renderer
// ----------------------------------------------------
function findLowest(arr) {
  const flat = Array.isArray(arr) ? arr.flat() : [arr];
  return Math.min(...flat);
}

function findHighest(arr) {
  const flat = Array.isArray(arr) ? arr.flat() : [arr];
  return Math.max(...flat);
}

function createContainer(className, extraClasses = []) {
  const div = document.createElement("div");
  div.classList.add(className, ...extraClasses);
  return div;
}

function renderTestContent() {
  const seenGroups = new Set();
  const groupCounts = new Map();

  questions.forEach((q) => {
    let pNum = q.part;
    if (!pNum && q.id && q.id[0]) {
      const qFirst = Number(q.id[0]);
      pNum = qFirst <= 10 ? 1 : qFirst <= 20 ? 2 : qFirst <= 30 ? 3 : 4;
      q.part = pNum;
    }

    const partMargin = document.getElementById(`part-margin-${pNum}`);
    if (!partMargin) return;

    groupCounts.set(q.group, (groupCounts.get(q.group) || 0) + 1);

    if (!seenGroups.has(q.group)) {
      const groupDiv = document.createElement("div");
      groupDiv.classList.add(`group-${q.group}`);

      groupDiv.appendChild(createContainer("mcq-container-one-choice"));
      groupDiv.appendChild(createContainer("mcq-container-two-choice"));
      groupDiv.appendChild(createContainer("table-container"));
      groupDiv.appendChild(createContainer("sentence-completion-container"));
      groupDiv.appendChild(createContainer("form-container"));
      groupDiv.appendChild(createContainer("note-container"));
      groupDiv.appendChild(createContainer("flowchart-container"));
      groupDiv.appendChild(createContainer("short-answer-container", ["question"]));
      groupDiv.appendChild(createContainer("matching-container"));
      groupDiv.appendChild(createContainer("diagram-label-container"));
      groupDiv.appendChild(createContainer("full-note-completion-container"));
      groupDiv.appendChild(createContainer("matching-information-container"));

      partMargin.appendChild(groupDiv);
      seenGroups.add(q.group);
    }
  });

  questions.forEach((q, index) => {
    const groupDiv = document.querySelector(`.group-${q.group}`);
    if (!groupDiv) return;

    if (q.type === "mcq") {
      const c = groupDiv.querySelector(".mcq-container-one-choice");
      c.innerHTML += `
        <div class="mcq"><p><strong>${index + 1}.</strong> ${q.text}</p>
          <label><input type="radio" name="${index + 1}" value="1">&nbsp;&nbsp;${q.options[0]}</label><br>
          <label><input type="radio" name="${index + 1}" value="2">&nbsp;&nbsp;${q.options[1]}</label><br>
          <label><input type="radio" name="${index + 1}" value="3">&nbsp;&nbsp;${q.options[2]}</label><br>
        </div>
      `;
    }

    if (q.type === "shortAnswer") {
      const c = groupDiv.querySelector(".short-answer-container");
      c.innerHTML += `
        <div class="short-answer-item">
          <label><strong>${q.id}</strong> ${q.text}
            <input type="text" name="${q.id}" placeholder="${q.id}" data-question-id="${q.id}">
          </label>
        </div>
      `;
    }

    if (q.type === "sentence-completion") {
      const c = groupDiv.querySelector(".sentence-completion-container");
      const ul = document.createElement("ul");
      q.sentences.forEach((s) => {
        const li = document.createElement("li");
        li.innerHTML = `<p>${s.replaceAll("[blank]", `<input type="text" class="blank-input">`)}</p>`;
        ul.appendChild(li);
      });
      c.appendChild(ul);
      c.querySelectorAll("input").forEach((inp, idx) => {
        inp.setAttribute("placeholder", q.id[idx]);
        inp.setAttribute("data-question-id", q.id[idx]);
      });
    }

    if (q.type === "mcq-two-choice") {
      const c = groupDiv.querySelector(".mcq-container-two-choice");
      c.innerHTML += `
        <div class="question-box">
          <div class="number-boxes"><div class="num-box">${q.id[0]}</div><div class="num-box">${q.id[1]}</div></div>
          <div class="question-text">${q.text}</div>
        </div>
      `;
      q.options.forEach((opt, idx) => {
        c.innerHTML += `<div class="options"><label>${idx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${q.id[0]}" value="${idx + 1}">&nbsp;&nbsp;${opt}</label></div>`;
      });
    }

    if (q.type === "note-completion" || q.part === 4) {
      const c = groupDiv.querySelector(".full-note-completion-container");
      if (q.heading) c.innerHTML += `<h1 class="note-completion-title">${q.heading}</h1>`;
      if (q.subheadings && q.paragraphs) {
        q.subheadings.forEach((sub, sIdx) => {
          c.innerHTML += `<p class="note-completion-subheading">${sub}</p>`;
          if (q.paragraphs[sIdx]) {
            q.paragraphs[sIdx].forEach(p => {
              c.innerHTML += `<p>${p.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
            });
          }
        });
      } else if (q.paragraphs && q.paragraphs[0]) {
        q.paragraphs[0].forEach(p => {
          c.innerHTML += `<p>${p.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
        });
      }
      c.querySelectorAll("input").forEach((inp, idx) => {
        if (q.id && q.id[idx]) {
          inp.setAttribute("placeholder", q.id[idx]);
          inp.setAttribute("data-question-id", q.id[idx]);
        }
      });
    }

    if (q.type === "mcq-updated") {
      const c = groupDiv.querySelector(".mcq-container-one-choice");
      q.questions.forEach((question, qIdx) => {
        const mcqDiv = document.createElement("div");
        mcqDiv.classList.add("mcq");
        mcqDiv.innerHTML = `<p data-question-id="${q.id[qIdx]}"><strong>${q.id[qIdx]}.</strong> ${question}</p>`;
        q.options[qIdx].forEach((opt, optIdx) => {
          mcqDiv.innerHTML += `<label>&nbsp;&nbsp;<input type="radio" name="${q.id[qIdx]}" value="${optIdx + 1}">&nbsp;&nbsp;${opt}</label><br>`;
        });
        c.appendChild(mcqDiv);
      });
    }

    if (q.type === "shortAnswer-updated") {
      const c = groupDiv.querySelector(".short-answer-container");
      q.questions.forEach((question, qIdx) => {
        c.innerHTML += `
          <div class="short-answer-item">
            <label><strong>${q.id[qIdx]}.</strong> ${question}
              <input spellcheck="false" type="text" name="${q.id[qIdx]}" placeholder="${q.id[qIdx]}" data-question-id="${q.id[qIdx]}">
            </label>
          </div>
        `;
      });
    }

    if (q.type === "mcq-two-choice-updated") {
      const c = groupDiv.querySelector(".mcq-container-two-choice");
      q.questions.forEach((question, qIdx) => {
        c.innerHTML += `
          <div class="question-box">
            <div class="number-boxes"><div class="num-box">${q.id[qIdx][0]}</div><div class="num-box">${q.id[qIdx][1]}</div></div>
            <div class="question-text">${question[0]}</div>
          </div>
        `;
        q.options[qIdx].forEach((opt, optIdx) => {
          c.innerHTML += `<div class="options"><label>${optIdx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${q.id[qIdx][0]}" data-question-id="${q.id[qIdx][0]} ${q.id[qIdx][1]}" value="${optIdx + 1}">&nbsp;&nbsp;${opt}</label></div>`;
        });
      });
    }

    if (q.type === "feature-matching") {
      const c = groupDiv.querySelector(".matching-container");
      const allBoxes = document.createElement("div");
      allBoxes.className = "all-boxes";
      const feats = document.createElement("div");
      feats.className = "matching-features";
      const opts = document.createElement("div");
      opts.className = "matching-options";

      q.features.forEach((f, fIdx) => {
        feats.innerHTML += `
          <div class="qa-pair">
            <div data-question-id="${q.id[fIdx]}" class="question-feature"><strong>${q.id[fIdx]}.</strong>&nbsp;&nbsp;${f}</div>
            <div id="${q.id[fIdx]}" class="box dropzone" data-class="feature-matching" data-item="" data-initial="empty"></div>
          </div>
        `;
      });
      q.options.forEach((opt) => {
        opts.innerHTML += `<div class="box" data-class="feature-matching" data-item="${opt}">${opt}</div>`;
      });
      allBoxes.appendChild(feats);
      allBoxes.appendChild(opts);
      c.appendChild(allBoxes);
    }

    // --- Map Labelling / Diagram Labelling (Image + Radio Grid Table UI) ---
    const diagQType = String(q.type || "").trim().toLowerCase();
    const isMapLabel =
      diagQType.includes("diagram") ||
      diagQType.includes("map") ||
      diagQType === "diagram-labelling" ||
      diagQType === "diagram-label" ||
      diagQType === "map-labelling";

    if (isMapLabel) {
      const diagramContainer =
        groupDiv.querySelector(".diagram-label-container") || groupDiv;
      diagramContainer.innerHTML = "";

      let rawImg = q.image || q.imageUrl || (q.images && q.images[0]) || "";
      if (typeof rawImg === "string" && rawImg.includes("](")) {
        rawImg = rawImg.split("](")[0].trim();
      }
      rawImg = (rawImg || "").trim();

      // Reliable Image Source Formatter
      let safeImgSrc = "";
      if (rawImg) {
        if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
          safeImgSrc = rawImg;
        } else if (rawImg.startsWith("/") || rawImg.startsWith("./") || rawImg.startsWith("data:")) {
          safeImgSrc = rawImg;
        } else {
          safeImgSrc = `/${rawImg}`;
        }
      }

      const optionsList =
        q.letters || q.options || ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
      const labelsList =
        q.locations || q.labels || q.questions || q.features || q.items || [];
      const idList = Array.isArray(q.id) ? q.id.flat(Infinity) : [q.id];

      let tableHeaderCells = `<th></th><th style="min-width: 170px;"></th>`;
      optionsList.forEach((opt) => {
        tableHeaderCells += `<th class="text-center fw-bold" style="width: 42px; text-align: center;">${opt}</th>`;
      });

      let tableBodyRows = "";
      labelsList.forEach((label, lIdx) => {
        const qId = idList[lIdx] || lIdx + 1;
        let radioCells = "";
        optionsList.forEach((opt) => {
          radioCells += `
            <td class="text-center align-middle" style="text-align: center; vertical-align: middle;">
              <input type="radio" 
                     class="form-check-input map-radio-input" 
                     name="${qId}" 
                     id="map-${qId}-${opt}" 
                     value="${opt}" 
                     data-question-id="${qId}" 
                     style="width: 18px; height: 18px; cursor: pointer;">
            </td>`;
        });

        tableBodyRows += `
          <tr class="map-table-row">
            <td class="align-middle fw-bold text-center" style="width: 48px; text-align: center; vertical-align: middle;">
              <span class="badge border text-dark bg-white px-2 py-1 fs-6">${qId}</span>
            </td>
            <td class="align-middle fw-semibold text-dark" style="font-size: 15px; vertical-align: middle;">
              ${label}
            </td>
            ${radioCells}
          </tr>`;
      });

      const imageElemHtml = safeImgSrc
        ? `<img src="${safeImgSrc}" 
               alt="Map Diagram" 
               referrerpolicy="no-referrer"
               onerror="if(!this.dataset.tried && this.src.startsWith('http')){ this.dataset.tried='true'; this.src='/api/proxy-image?url=' + encodeURIComponent(this.src); }"
               style="max-width: 100%; height: auto; max-height: 520px; object-fit: contain; border-radius: 6px; display: block; margin: 0 auto;">`
        : `<div class="p-4 text-muted fw-bold">No Map Image Found</div>`;

      const mapLayoutHTML = `
        <div class="row align-items-start my-4 g-4" style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; margin: 24px 0;">
          <div class="col-lg-6 col-12 text-center" style="flex: 1 1 380px; min-width: 280px; text-align: center;">
            <div class="p-2 border rounded-3 bg-white shadow-sm" style="display: inline-block; width: 100%; min-height: 250px; padding: 8px; border: 1px solid #dee2e6; border-radius: 10px; background: #fff;">
              ${imageElemHtml}
            </div>
          </div>
          <div class="col-lg-6 col-12" style="flex: 1 1 380px; min-width: 280px;">
            <div class="table-responsive bg-white rounded-3 border shadow-sm p-2" style="overflow-x: auto; padding: 8px; border: 1px solid #dee2e6; border-radius: 10px; background: #fff;">
              <table class="table table-bordered table-hover mb-0 align-middle" style="width: 100%; border-collapse: collapse;">
                <thead class="table-light">
                  <tr>${tableHeaderCells}</tr>
                </thead>
                <tbody>
                  ${tableBodyRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      diagramContainer.innerHTML = mapLayoutHTML;
    }
  });

  // Group Headers
  let gIndex = 0;
  groupCounts.forEach((val, group) => {
    const groupDiv = document.querySelector(`.group-${group}`);
    if (!groupDiv) return;

    const gHeader = document.createElement("div");
    gHeader.className = "group-header";

    if (instructions[gIndex] && instructions[gIndex].instruction) {
      const instDiv = document.createElement("div");
      instDiv.className = "instructions";
      instDiv.innerHTML = `<h3>${instructions[gIndex].instruction}</h3>`;
      gHeader.prepend(instDiv);
    }

    if (questions[gIndex] && questions[gIndex].id) {
      const min = findLowest(questions[gIndex].id);
      const max = findHighest(questions[gIndex].id);
      const rangeH3 = document.createElement("h3");
      rangeH3.textContent = `Questions ${min} - ${max}`;
      gHeader.prepend(rangeH3);
    }

    groupDiv.prepend(gHeader);
    gIndex++;
  });

  document.querySelectorAll(".box").forEach(b => addDragEvents(b));
  document.querySelectorAll(".diagram-box").forEach(b => addDragEvents(b));
}

// ----------------------------------------------------
// 9. Bottom Navigation Tracking
// ----------------------------------------------------
function getQuestionElementById(qid) {
  return document.querySelector(`[data-question-id="${qid}"], [id="${qid}"]`);
}

function isQuestionAnswered(qid) {
  const textInput = document.querySelector(`input[type="text"][data-question-id="${qid}"], input[type="text"][placeholder="${qid}"]`);
  if (textInput && textInput.value.trim() !== "") return true;

  const inputsByName = document.querySelectorAll(`input[name="${qid}"]`);
  if (inputsByName.length > 0) {
    for (const el of inputsByName) {
      if ((el.type === 'radio' || el.type === 'checkbox') && el.checked) return true;
    }
  }

  const select = document.getElementById(qid);
  if (select && select.value && select.value.trim() !== "") return true;

  const dropzone = document.getElementById(String(qid));
  if (dropzone) {
    const text = dropzone.textContent.trim();
    if (text !== "" && text.toLowerCase() !== "empty") return true;
  }
  return false;
}

function updateQNavState(qid) {
  const btn = document.querySelector(`.qnav-btn[data-qid="${qid}"]`);
  if (!btn) return;
  if (isQuestionAnswered(qid)) {
    btn.classList.add("attempted");
  } else {
    btn.classList.remove("attempted");
  }
}

function createPartQuestionNavButtons() {
  for (let part = 1; part <= 4; part++) {
    // নির্দিষ্ট পার্ট প্র্যাকটিসে অন্য পার্ট স্কিপ করা
    if (activeRequestedPart && part !== activeRequestedPart) continue;

    const partEl = document.getElementById(`part-${part}`);
    if (!partEl) continue;

    const qEls = partEl.querySelectorAll("[data-question-id], [id]");
    const qIds = [];

    qEls.forEach(el => {
      const attr = el.getAttribute("data-question-id");
      if (!attr) return;
      const ids = attr.split(" ").map(s => s.match(/\d+/)?.[0]).filter(Boolean);
      ids.forEach(idNum => {
        if (!qIds.includes(idNum)) qIds.push(idNum);
      });
    });

    qIds.sort((a, b) => Number(a) - Number(b));

    const container = document.querySelector(`.question-button-container[data-part="${part}"]`);
    if (!container) continue;
    container.innerHTML = "";

    qIds.forEach(qid => {
      const b = document.createElement("button");
      b.className = "qnav-btn";
      b.type = "button";
      b.setAttribute("data-qid", qid);
      b.textContent = qid;

      b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const targetEl = getQuestionElementById(qid);
        if (targetEl) {
          const parentPartMatch = targetEl.closest(".part");
          if (parentPartMatch) {
            const whichPart = parentPartMatch.id.match(/\d+/);
            if (whichPart && !activeRequestedPart) showPart(Number(whichPart[0]));
          }
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          document.querySelectorAll('.qnav-btn.current').forEach(x => x.classList.remove('current'));
          b.classList.add('current');
        }
      });
      container.appendChild(b);
    });
  }
}

function attachAnswerListeners() {
  document.querySelectorAll('input[type="text"]').forEach(inp => {
    inp.addEventListener('input', () => {
      const qid = inp.getAttribute('data-question-id') || inp.getAttribute('placeholder');
      if (qid) updateQNavState(String(qid));
    });
  });

  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp => {
    inp.addEventListener('change', () => {
      const name = inp.name;
      if (name) {
        const found = String(name).match(/\d+/);
        updateQNavState(found ? found[0] : name);
      }
    });
  });

  document.querySelectorAll('select').forEach(sel => {
    sel.addEventListener('change', () => {
      if (sel.id) updateQNavState(String(sel.id));
    });
  });
}

// ----------------------------------------------------
// 10. Drag and Drop Engine
// ----------------------------------------------------
let dragElement = null;

function handleDragStart(e) {
  this.style.opacity = "0.4";
  dragElement = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("item", this.innerHTML);
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  return false;
}

function handleDragEnter() { this.classList.add("dragover"); }
function handleDragLeave() { this.classList.remove("dragover"); }

function handleDrop(e) {
  if (e.stopPropagation) e.stopPropagation();

  if (dragElement !== this) {
    const draggedGroup = dragElement.getAttribute("data-class");
    const targetGroup = this.getAttribute("data-class");

    if (draggedGroup !== targetGroup) {
      this.classList.add("invalid-drop");
      setTimeout(() => this.classList.remove("invalid-drop"), 1000);
      return false;
    }

    const draggedHTML = dragElement.innerHTML;
    const draggedItem = dragElement.getAttribute("data-item");
    const targetHTML = this.innerHTML;
    const targetItem = this.getAttribute("data-item");

    dragElement.innerHTML = targetHTML;
    dragElement.setAttribute("data-item", targetItem || "");
    this.innerHTML = draggedHTML;
    this.setAttribute("data-item", draggedItem || "");

    addDragEvents(dragElement);
    addDragEvents(this);

    const aId = dragElement.getAttribute('id');
    const bId = this.getAttribute('id');
    if (aId) updateQNavState(aId);
    if (bId) updateQNavState(bId);
  }
}

function handleDragEnd() {
  this.style.opacity = "1";
  document.querySelectorAll(".box, .diagram-box").forEach(item => item.classList.remove("dragover"));
}

function addDragEvents(el) {
  const hasContent = el.textContent.trim() !== "";
  el.setAttribute("draggable", hasContent);
  el.addEventListener("dragenter", handleDragEnter);
  el.addEventListener("dragover", handleDragOver);
  el.addEventListener("dragleave", handleDragLeave);
  el.addEventListener("drop", handleDrop);
  el.addEventListener("dragend", handleDragEnd);
  if (hasContent) el.addEventListener("dragstart", handleDragStart);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function settingsMenu() {
  document.getElementById("popup-settings").classList.toggle("menu-visible");
}

function closeSettings() {
  document.getElementById("popup-settings").classList.remove("menu-visible");
  document.getElementById("popup-note").classList.remove("menu-visible");
}

function openNotes() {
  document.getElementById("popup-note").classList.toggle("menu-visible");
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPracticeData();
  // ----------------------------------------------------
// 11. Highlight / Unhighlight Feature (IELTS style)
//     Text select korle ekta chhoto popup ashbe: Highlight / Clear
//     Highlighted text-er upor click korle highlight remove hobe
// ----------------------------------------------------
(function initHighlighter() {
  const HL_CLASS = "user-highlight";

  // CSS inject
  function injectHighlightStyles() {
    if (document.getElementById("user-highlight-style")) return;
    const style = document.createElement("style");
    style.id = "user-highlight-style";
    style.textContent = `
      .${HL_CLASS} {
        background: #ffeb3b;
        color: inherit;
        border-radius: 2px;
        cursor: pointer;
        padding: 0 1px;
      }
      #hl-toolbar {
        position: absolute;
        z-index: 99999;
        display: none;
        background: #1f2a44;
        border-radius: 8px;
        padding: 5px;
        gap: 6px;
        box-shadow: 0 6px 18px rgba(0,0,0,.3);
      }
      #hl-toolbar button {
        border: none;
        background: #fff;
        color: #1f2a44;
        font-size: 13px;
        font-weight: 700;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
      }
      #hl-toolbar button:hover { background: #ffeb3b; }
      #hl-toolbar button.hl-clear:hover { background: #ffd6d6; }
    `;
    document.head.appendChild(style);
  }

  // Toolbar banano
  function createToolbar() {
    let tb = document.getElementById("hl-toolbar");
    if (tb) return tb;
    tb = document.createElement("div");
    tb.id = "hl-toolbar";
    tb.innerHTML = `
      <button type="button" class="hl-add">Highlight</button>
      <button type="button" class="hl-clear">Clear</button>
    `;
    document.body.appendChild(tb);
    return tb;
  }

  // Shudhu question/passage area-te highlight allow korbo (input, button e na)
  function isAllowedArea(node) {
    if (!node) return false;
    const el = node.nodeType === 3 ? node.parentElement : node;
    if (!el) return false;
    if (el.closest("input, textarea, select, button, #hl-toolbar, #instant-result-modal")) return false;
    return !!el.closest("#test-content, .part, [id^='part-']");
  }

  // Highlight remove (span unwrap)
  function unwrapHighlight(span) {
    const parent = span.parentNode;
    if (!parent) return;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
    parent.normalize();
  }

  // Selection-er moddhe thaka text node gulo highlight kora
  function highlightSelection(range) {
    if (range.collapsed) return;

    const root = range.commonAncestorContainer.nodeType === 3
      ? range.commonAncestorContainer.parentNode
      : range.commonAncestorContainer;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (!range.intersectsNode(node)) return NodeFilter.FILTER_REJECT;
        if (!isAllowedArea(node)) return NodeFilter.FILTER_REJECT;
        if (node.parentElement.closest("." + HL_CLASS)) return NodeFilter.FILTER_REJECT; // already highlighted
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    // Single text node holeo handle kora
    if (!nodes.length && range.startContainer.nodeType === 3 && isAllowedArea(range.startContainer)) {
      nodes.push(range.startContainer);
    }

    nodes.forEach((textNode) => {
      let start = 0;
      let end = textNode.nodeValue.length;
      if (textNode === range.startContainer) start = range.startOffset;
      if (textNode === range.endContainer) end = range.endOffset;
      if (start >= end) return;

      const target = textNode.splitText(start);
      target.splitText(end - start);

      const span = document.createElement("span");
      span.className = HL_CLASS;
      target.parentNode.insertBefore(span, target);
      span.appendChild(target);
    });
  }

  // Selection-er moddhe ja highlight ache segulo clear kora
  function clearSelectionHighlights(range) {
    document.querySelectorAll("." + HL_CLASS).forEach((span) => {
      if (range.intersectsNode(span)) unwrapHighlight(span);
    });
  }

  function hideToolbar() {
    const tb = document.getElementById("hl-toolbar");
    if (tb) tb.style.display = "none";
  }

  function setup() {
    injectHighlightStyles();
    const toolbar = createToolbar();
    let savedRange = null;

    // Text select korle toolbar dekhano
    document.addEventListener("mouseup", (e) => {
      if (e.target.closest("#hl-toolbar")) return;

      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
          hideToolbar();
          return;
        }
        const range = sel.getRangeAt(0);
        if (!isAllowedArea(range.commonAncestorContainer)) {
          hideToolbar();
          return;
        }
        savedRange = range.cloneRange();

        const rect = range.getBoundingClientRect();
        toolbar.style.display = "flex";
        toolbar.style.top = `${window.scrollY + rect.top - 46}px`;
        toolbar.style.left = `${window.scrollX + rect.left + rect.width / 2 - 70}px`;
      }, 10);
    });

    // Toolbar button click (selection hariye jete na dewar jonno mousedown prevent)
    toolbar.addEventListener("mousedown", (e) => e.preventDefault());

    toolbar.querySelector(".hl-add").addEventListener("click", () => {
      if (savedRange) highlightSelection(savedRange);
      window.getSelection().removeAllRanges();
      savedRange = null;
      hideToolbar();
    });

    toolbar.querySelector(".hl-clear").addEventListener("click", () => {
      if (savedRange) clearSelectionHighlights(savedRange);
      window.getSelection().removeAllRanges();
      savedRange = null;
      hideToolbar();
    });

    // Highlighted text-er upor click korle sheta remove hobe
    document.addEventListener("click", (e) => {
      const span = e.target.closest("." + HL_CLASS);
      if (span && window.getSelection().isCollapsed) {
        unwrapHighlight(span);
        hideToolbar();
      }
    });

    // Onno jaygay click korle toolbar hide
    document.addEventListener("mousedown", (e) => {
      if (!e.target.closest("#hl-toolbar")) hideToolbar();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
});