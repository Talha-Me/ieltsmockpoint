// // ==========================================
// // 1. DATA INITIALIZATION (LOCALSTORAGE + API FALLBACK)
// // ==========================================
// let parsedQuestionData = null;

// try {
//   const localData = localStorage.getItem("data");
//   if (localData) {
//     parsedQuestionData = JSON.parse(localData);
//   }
// } catch (e) {
//   console.warn("LocalStorage parse warning:", e);
// }

// // Fallback: যদি লোকাল স্টোরেজে না থাকে, সেশন API থেকে সরাসরি আনবে
// async function ensureMockData() {
//   if (!parsedQuestionData || !parsedQuestionData.listening) {
//     try {
//       const res = await fetch("/api/mockTest");
//       if (res.ok) {
//         parsedQuestionData = await res.json();
//         localStorage.setItem("data", JSON.stringify(parsedQuestionData));
//       }
//     } catch (err) {
//       console.error("Failed to load /api/mockTest fallback:", err);
//     }
//   }

//   if (!parsedQuestionData || !parsedQuestionData.listening) {
//     console.error("Listening test data not found in session!");
//     return;
//   }

//   renderExam(parsedQuestionData);
// }

// async function userData() {
//   try {
//     const res = await fetch("/api/user-data");
//     if (res.ok) {
//       return await res.json();
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }

// // ==========================================
// // 2. GLOBAL VARIABLES
// // ==========================================
// let questions = [];
// let instructions = [];
// let mockID = "";
// let officialAnswers = {};
// let totalParts = 4;
// let currentPart = 1;
// const answerArrayUpdated = {};
// const mistakes = {};
// let currentAudio = null;
// let retryCount = 0;

// // ==========================================
// // 3. SUBMIT & FLOW (NO INSTANT MODAL - REDIRECT TO NEXT MODULE)
// // ==========================================
// async function submitTest() {
//   inputCheckUpdated();
//   sessionStorage.setItem("listeningIscompleted", "true");
//   const [scoreToSend, mistakesToSend] = findDifferences(answerArrayUpdated, officialAnswers);

//   try {
//     await fetch('/api/update-mock-info', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ score: scoreToSend, mistakes: mistakesToSend, mod: "listening" })
//     });
//   } catch (err) {
//     console.error("Score sync error:", err);
//   }

//   // লিসেনিং শেষ হলে সরাসরি মক পেজে রিডাইরেক্ট করবে যাতে Reading Video চালু হয়
//   window.location.href = "/mock-test";
// }

// // ==========================================
// // 4. UI POPUPS, MODALS & SETTINGS
// // ==========================================
// const popupSettings = document.getElementById("popup-settings");
// const popupNote = document.getElementById("popup-note");

// function settingsMenu() {
//   if (popupSettings) popupSettings.classList.toggle("menu-visible");
// }

// function closeSettings() {
//   if (popupSettings) popupSettings.classList.remove("menu-visible");
//   if (popupNote) popupNote.classList.remove("menu-visible");
// }

// function openNotes() {
//   if (popupNote) popupNote.classList.toggle("menu-visible");
// }

// window.addEventListener("keydown", function (e) {
//   if (e.key === "F3" || (e.ctrlKey && (e.key === "f" || e.key === "F"))) {
//     e.preventDefault();
//   }
// });

// // Fullscreen Warning Check
// const fullscreenModal = document.getElementById("fullscreen-warning-modal");
// const fullscreenOkBtn = document.getElementById("fullscreen-ok-btn");
// const fullscreenStayBtn = document.getElementById("fullscreen-stay-btn");

// document.addEventListener("fullscreenchange", () => {
//   if (!document.fullscreenElement) {
//     if (fullscreenModal) fullscreenModal.style.display = "flex";
//   }
// });

// if (fullscreenOkBtn) {
//   fullscreenOkBtn.onclick = async function () {
//     if (fullscreenModal) fullscreenModal.style.display = "none";
//     await submitTest();
//   };
// }

// if (fullscreenStayBtn) {
//   fullscreenStayBtn.onclick = function () {
//     if (fullscreenModal) fullscreenModal.style.display = "none";
//     document.documentElement.requestFullscreen().catch(() => {});
//   };
// }

// // Finish Test Buttons
// const submitBtn = document.getElementById("finishBtn");
// const submitModal = document.getElementById("submit-warning-modal");
// const submitOkButton = document.getElementById("submit-ok-btn");
// const submitStayButton = document.getElementById("submit-stay-btn");

// if (submitBtn) {
//   submitBtn.addEventListener("click", function (e) {
//     e.preventDefault();
//     if (submitModal) submitModal.style.display = "flex";
//   });
// }

// if (submitOkButton) {
//   submitOkButton.addEventListener("click", async (e) => {
//     e.preventDefault();
//     if (submitModal) submitModal.style.display = "none";
//     await submitTest();
//   });
// }

// if (submitStayButton) {
//   submitStayButton.addEventListener("click", (e) => {
//     e.preventDefault();
//     if (submitModal) submitModal.style.display = "none";
//   });
// }

// /// ==========================================
// // 5. AUDIO & INSTRUCTION POPUP LOGIC
// // ==========================================
// function openListeningPopup() {
//   const overlay = document.getElementById("listeningOverlay");
//   if (overlay) overlay.style.display = "flex";
//   document.body.classList.add("listening-popup-active");
// }

// function closeListeningPopup() {
//   const overlay = document.getElementById("listeningOverlay");
//   if (overlay) overlay.style.display = "none";
//   document.body.classList.remove("listening-popup-active");

//   const elem = document.documentElement;
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen().catch(err => console.warn("Fullscreen blocked:", err));
//   }

//   // Purono audio instance cleanup
//   if (currentAudio) {
//     currentAudio.pause();
//     currentAudio.onended = null;
//     currentAudio.onerror = null;
//     currentAudio.src = "";
//     currentAudio.load();
//   }

//   // অডিও সোর্স: old code er moto /audio/<mockNumber>, kono extension nai
//   // (server er AUDIO_ROUTES key diye local file khuje ber kore)
//   const audioFile = parsedQuestionData?.mockNumber;

//   if (audioFile) {
//     const finalSrc = `/audio/${encodeURIComponent(audioFile)}`;

//     currentAudio = new Audio(finalSrc);
//     currentAudio.preload = "auto";

//     currentAudio.onerror = function () {
//       const err = currentAudio.error;
//       console.error("Audio error detected:", finalSrc, err);

//       // File/ID na paile (404 / unsupported source) retry kore lav nai
//       if (err && err.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
//         console.error("Audio source not found or not supported. Check AUDIO_ROUTES key:", audioFile);
//         return;
//       }

//       // Network error hole retry
//       const lastPosition = currentAudio.currentTime;
//       if (retryCount < 5) {
//         retryCount++;
//         setTimeout(() => {
//           currentAudio.load();
//           currentAudio.currentTime = lastPosition;
//           currentAudio.play().catch(e => console.error("Resume failed:", e));
//         }, 2000);
//       } else {
//         alert("Connection lost. Please refresh the page and continue.");
//       }
//     };

//     currentAudio.onwaiting = () => console.warn("Audio is buffering... please wait.");

//     currentAudio.onstalled = () => {
//       console.warn("Network is too slow. Attempting to kickstart...");
//       currentAudio.load();
//       currentAudio.play().catch(() => {});
//     };

//     currentAudio.onplaying = () => { retryCount = 0; };
//     currentAudio.play().catch(err => console.warn("Autoplay notice:", err));
//   } else {
//     console.error("mockNumber not found in data, audio cannot be loaded.");
//   }

//   // Timer Initialization
//   const timer = document.getElementById("timer");
//   if (timer) {
//     let minutesRemaining = parseInt(timer.textContent) || 30;
//     const interval = setInterval(async () => {
//       minutesRemaining -= 1;
//       if (minutesRemaining <= 10) {
//         const timerBlunt = document.querySelector(".timer-blunt");
//         const timerSpecific = document.querySelector(".timer-specific");
//         if (timerSpecific) { timerSpecific.style.opacity = 1; timerSpecific.style.color = "red"; }
//         if (timerBlunt) timerBlunt.style.opacity = 0;
//       }
//       if (minutesRemaining <= 0) {
//         timer.textContent = '0';
//         await submitTest();
//         clearInterval(interval);
//       } else {
//         timer.textContent = minutesRemaining;
//       }
//     }, 60000);
//   }

//   // Specific Seconds Timer
//   const minutesDisplay = document.getElementById("minutes");
//   const secondsDisplay = document.getElementById("seconds");
//   let totalSeconds = 32 * 60;
//   function updateTimerDisplay() {
//     let minutes = Math.floor(totalSeconds / 60);
//     let seconds = totalSeconds % 60;
//     if (minutesDisplay) minutesDisplay.textContent = String(minutes).padStart(2, "0");
//     if (secondsDisplay) secondsDisplay.textContent = String(seconds).padStart(2, "0");
//   }

//   setInterval(function () {
//     if (totalSeconds > 0) {
//       totalSeconds--;
//       updateTimerDisplay();
//     }
//   }, 1000);
// }
// // ==========================================
// // 6. PART NAVIGATION (PART 1 TO 4)
// // ==========================================
// const nextButton = document.getElementById("next-button");
// const prevButton = document.getElementById("previous-button");

// function showPart(part) {
//   for (let i = 1; i <= totalParts; i++) {
//     const partEl = document.getElementById(`part-${i}`);
//     const partBtn = document.getElementById(`part-${i}-button`);
//     if (partEl) partEl.style.display = (i === part) ? "block" : "none";
//     if (partBtn) {
//       if (i === part) partBtn.classList.add('active');
//       else partBtn.classList.remove('active');
//     }
//   }
//   currentPart = part;
// }

// function showNext(event) {
//   if (event) event.preventDefault();
//   if (currentPart < totalParts) {
//     currentPart++;
//     showPart(currentPart);
//   }
// }

// function showPrevious(event) {
//   if (event) event.preventDefault();
//   if (currentPart > 1) {
//     currentPart--;
//     showPart(currentPart);
//   }
// }

// function updateNavButtons() {
//   if (!nextButton || !prevButton) return;
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
// setInterval(updateNavButtons, 200);

// // ==========================================
// // 7. RENDER FULL MOCK EXAM
// // ==========================================
// function renderExam(pData) {
//   questions = pData.listening.questions || [];
//   instructions = pData.listening.instructions || [];
//   mockID = pData.mockNumber || "";
//   officialAnswers = pData.listening.answers || {};

//   const part1Margin = document.getElementById("part-margin-1");
//   const part2Margin = document.getElementById("part-margin-2");
//   const part3Margin = document.getElementById("part-margin-3");
//   const part4Margin = document.getElementById("part-margin-4");

//   const seenGroups = new Set();
//   const groupCounts = new Map();

//   // Create Groups per Part
//   questions.forEach((q) => {
//     groupCounts.set(q.group, (groupCounts.get(q.group) || 0) + 1);

//     if (!seenGroups.has(q.group)) {
//       const groupDiv = document.createElement("div");
//       groupDiv.classList.add(`group-${q.group}`);

//       const containers = [
//         "mcq-container-one-choice", "mcq-container-two-choice", "table-container",
//         "sentence-completion-container", "form-container", "note-container",
//         "flowchart-container", "short-answer-container question", "matching-container",
//         "diagram-label-container", "full-note-completion-container", "matching-information-container"
//       ];

//       containers.forEach(cls => {
//         const d = document.createElement("div");
//         cls.split(" ").forEach(c => d.classList.add(c));
//         groupDiv.appendChild(d);
//       });

//       if (q.part == 1 && part1Margin) part1Margin.appendChild(groupDiv);
//       if (q.part == 2 && part2Margin) part2Margin.appendChild(groupDiv);
//       if (q.part == 3 && part3Margin) part3Margin.appendChild(groupDiv);
//       if (q.part == 4 && part4Margin) part4Margin.appendChild(groupDiv);

//       seenGroups.add(q.group);
//     }
//   });

//   // Render Questions in Respective Containers
//   questions.forEach((q, index) => {
//     const groupDiv = document.querySelector(`.group-${q.group}`);
//     if (!groupDiv) return;

//     // MCQ (Single Choice)
//     if (q.type === "mcq" || q.type === "mcq-updated") {
//       const mcqContainer = groupDiv.querySelector(".mcq-container-one-choice");
//       const qList = q.questions || [q.text];
//       qList.forEach((questionText, qIdx) => {
//         const qId = (q.id && q.id[qIdx]) ? q.id[qIdx] : (index + 1);
//         const opts = (q.options && q.options[qIdx]) ? q.options[qIdx] : (q.options || []);
//         let optHtml = "";
//         opts.forEach((opt, oIdx) => {
//           optHtml += `<label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${qId}" value="${oIdx + 1}">&nbsp;&nbsp;${opt}</label><br>`;
//         });
//         mcqContainer.innerHTML += `
//           <div class="mcq mb-3">
//             <p data-question-id="${qId}"><strong>${qId}.</strong> ${questionText}</p>
//             ${optHtml}
//           </div>`;
//       });
//     }

//     // Short Answer
//     if (q.type === "shortAnswer" || q.type === "shortAnswer-updated") {
//       const shortAnswerContainer = groupDiv.querySelector(".short-answer-container");
//       const qList = q.questions || [q.text];
//       qList.forEach((questionText, qIdx) => {
//         const qId = (q.id && q.id[qIdx]) ? q.id[qIdx] : (q.id || index + 1);
//         shortAnswerContainer.innerHTML += `
//           <div class="short-answer-item mb-2">
//             <label><strong>${qId}.</strong> ${questionText}
//               <input spellcheck="false" type="text" name="${qId}" placeholder="${qId}" data-question-id="${qId}">
//             </label>
//           </div>`;
//       });
//     }

//     // Sentence Completion
//     if (q.type === "sentence-completion") {
//       const sentenceContainer = groupDiv.querySelector(".sentence-completion-container");
//       const listElem = document.createElement("ul");
//       (q.sentences || []).forEach((sentence) => {
//         const liElem = document.createElement("li");
//         liElem.innerHTML = `<p>${sentence.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
//         listElem.appendChild(liElem);
//       });
//       sentenceContainer.appendChild(listElem);
//       const inputs = sentenceContainer.querySelectorAll("input");
//       inputs.forEach((input, idx) => {
//         if (q.id && q.id[idx]) {
//           input.setAttribute("placeholder", q.id[idx]);
//           input.setAttribute("data-question-id", q.id[idx]);
//         }
//       });
//     }

//     // MCQ Two Choice
//     if (q.type === "mcq-two-choice" || q.type === "mcq-two-choice-updated") {
//       const mcqTwoContainer = groupDiv.querySelector(".mcq-container-two-choice");
//       const qList = q.questions || (q.text ? [[q.text]] : []);
//       qList.forEach((question, idx) => {
//         const idPair = (q.id && q.id[idx]) ? q.id[idx] : [17, 18];
//         const qText = Array.isArray(question) ? question[0] : question;
//         let optHtml = "";
//         const opts = (q.options && q.options[idx]) ? q.options[idx] : (q.options || []);
//         opts.forEach((opt, oIdx) => {
//           optHtml += `
//             <div class="options">
//               <label>${oIdx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${idPair[0]}" data-question-id="${idPair[0]} ${idPair[1]}" value="${oIdx + 1}">&nbsp;&nbsp;${opt}</label><br>
//             </div>`;
//         });
//         mcqTwoContainer.innerHTML += `
//           <div class="question-box mb-3">
//             <div class="number-boxes">
//               <div class="num-box">${idPair[0]}</div>
//               <div class="num-box">${idPair[1]}</div>
//             </div>
//             <div class="question-text">${qText}</div>
//             ${optHtml}
//           </div>`;
//       });
//     }

//     // Part 4 & General Note Completion
//     if (q.part === 4 || q.type === "note-completion" || q.type === "form-completion") {
//       const fullNoteContainer = groupDiv.querySelector(".full-note-completion-container") || groupDiv.querySelector(".form-container");
//       if (q.heading) fullNoteContainer.innerHTML += `<h1 class="note-completion-title mb-3">${q.heading}</h1>`;

//       if (q.subheadings && q.paragraphs) {
//         q.subheadings.forEach((subheading, sIdx) => {
//           fullNoteContainer.innerHTML += `<p class="note-completion-subheading fw-bold">${subheading}</p>`;
//           if (q.paragraphs[sIdx]) {
//             q.paragraphs[sIdx].forEach(paragraph => {
//               fullNoteContainer.innerHTML += `<p>${paragraph.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
//             });
//           }
//         });
//       } else if (q.paragraphs) {
//         const paras = Array.isArray(q.paragraphs[0]) ? q.paragraphs[0] : q.paragraphs;
//         paras.forEach(p => {
//           fullNoteContainer.innerHTML += `<p>${p.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
//         });
//       }

//       const inputs = fullNoteContainer.querySelectorAll("input");
//       inputs.forEach((input, i) => {
//         if (q.id && q.id[i]) {
//           input.setAttribute("placeholder", q.id[i]);
//           input.setAttribute("data-question-id", q.id[i]);
//         }
//       });
//     }

//     // Table Completion
//     if (q.type === "table-completion") {
//       const tableContainer = groupDiv.querySelector(".table-container");
//       const table = document.createElement("table");
//       table.className = "table table-bordered";
//       if (q["table-structure"]) {
//         q["table-structure"].forEach((count, tIdx) => {
//           const tr = document.createElement("tr");
//           for (let i = 0; i < count; i++) {
//             const td = document.createElement("td");
//             td.innerHTML = `<p style="text-align:center">${(q.cells[tIdx][i] || "").replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
//             tr.appendChild(td);
//           }
//           table.appendChild(tr);
//         });
//       }
//       tableContainer.appendChild(table);
//       const inputs = tableContainer.querySelectorAll("input");
//       inputs.forEach((input, i) => {
//         if (q.id && q.id[i]) {
//           input.setAttribute("placeholder", q.id[i]);
//           input.setAttribute("data-question-id", q.id[i]);
//         }
//       });
//     }

//     // Diagram / Map Labelling
//     if (q.type === "diagram-labelling" || q.type === "map-labelling" || q.type === "Map-Labelling") {
//       const diagramContainer = groupDiv.querySelector(".diagram-label-container");
//       const allBoxes = document.createElement("div");
//       allBoxes.classList.add("all-boxes");

//       if (q.image) {
//         const imgDiv = document.createElement("div");
//         imgDiv.className = "image-div text-center mb-3";
//         imgDiv.innerHTML = `<img src="${q.image}" class="img-fluid border rounded" style="max-height: 480px;">`;
//         diagramContainer.appendChild(imgDiv);
//       }

//       const matchingLabels = document.createElement("div");
//       matchingLabels.classList.add("matching-labels");
//       const matchingOptions = document.createElement("div");
//       matchingOptions.classList.add("matching-options-for-diagram");

//       const labels = q.labels || q.locations || [];
//       labels.forEach((label, lIdx) => {
//         const qId = (q.id && q.id[lIdx]) ? q.id[lIdx] : (lIdx + 1);
//         matchingLabels.innerHTML += `
//           <div class="qa-pair d-flex align-items-center mb-2">
//             <div data-question-id="${qId}" class="question-label me-2"><strong>${qId}.</strong>&nbsp;&nbsp;${label}</div>
//             <div id="${qId}" data-question-id="${qId}" class="dropzone diagram-box border rounded text-center" data-class="diagram" data-item="" data-initial="empty" style="width: 60px; height: 38px; line-height: 36px; display: inline-block;"></div>
//           </div>`;
//       });
//       allBoxes.appendChild(matchingLabels);

//       (q.options || []).forEach(option => {
//         matchingOptions.innerHTML += `<div class="diagram-box box btn btn-light border m-1" draggable="true" data-class="diagram" data-item="${option}">${option}</div>`;
//       });
//       allBoxes.appendChild(matchingOptions);
//       diagramContainer.appendChild(allBoxes);
//     }
//   });

//   // Group Headers & Range Generation
//   let gIndex = 0;
//   groupCounts.forEach((val, group) => {
//     const groupDiv = document.querySelector(`.group-${group}`);
//     if (groupDiv && instructions[gIndex] && questions[gIndex]) {
//       const groupHeader = document.createElement("div");
//       groupHeader.classList.add("group-header", "mb-3", "p-2", "border-bottom");
//       const instructionDiv = document.createElement("div");
//       instructionDiv.classList.add("instructions");
//       instructionDiv.innerHTML = `<h3>${instructions[gIndex].instruction}</h3>`;
//       groupHeader.prepend(instructionDiv);

//       const min = findLowest(questions[gIndex].id);
//       const max = findHighest(questions[gIndex].id);
//       if (!isNaN(min) && !isNaN(max) && isFinite(min) && isFinite(max)) {
//         const groupRangeHeader = document.createElement("h4");
//         groupRangeHeader.className = "text-primary";
//         groupRangeHeader.textContent = `Questions ${min} - ${max}`;
//         groupHeader.prepend(groupRangeHeader);
//       }
//       groupDiv.prepend(groupHeader);
//     }
//     gIndex++;
//   });

//   // Init Interactive Systems
//   initDragAndDrop();
//   createPartQuestionNavButtons();
//   attachAnswerListeners();
//   showPart(1);
//   openListeningPopup();
// }

// // ==========================================
// // 8. ANSWER EVALUATION & DIFF HELPERS
// // ==========================================
// function inputCheckUpdated() {
//   document.querySelectorAll("input").forEach((input) => {
//     if (input.type === "text" && (input.getAttribute("data-question-id") || input.placeholder)) {
//       const id = input.getAttribute("data-question-id") || input.placeholder;
//       answerArrayUpdated[id] = [input.value.trim()];
//     }
//     if (input.checked && input.name) {
//       answerArrayUpdated[input.name] = [input.value.trim()];
//     }
//   });

//   document.querySelectorAll('.matching-information').forEach((selectedInput) => {
//     if (selectedInput.id) {
//       answerArrayUpdated[selectedInput.id] = [selectedInput.value];
//     }
//   });

//   document.querySelectorAll('[data-initial="empty"]').forEach((empty) => {
//     if (empty.id) {
//       answerArrayUpdated[empty.id] = [empty.textContent.trim()];
//     }
//   });
// }

// function findDifferences(your_answer, realAnswers) {
//   let totalScore = 40;
//   for (const key in realAnswers) {
//     const yourAns = your_answer[key] || [];
//     const realAns = realAnswers[key] || [];
//     const matchFound = yourAns.some(ans => 
//       realAns.map(r => String(r).toLowerCase().trim()).includes(String(ans).toLowerCase().trim())
//     );
//     if (!matchFound) {
//       mistakes[key] = {
//         "Your answer": yourAns,
//         "Correct answer": realAns
//       };
//       totalScore--;
//     }
//   }
//   return [totalScore, mistakes];
// }

// function findLowest(arr) {
//   const flat = [arr].flat(Infinity);
//   return Math.min(...flat.map(Number).filter(n => !isNaN(n)));
// }
// function findHighest(arr) {
//   const flat = [arr].flat(Infinity);
//   return Math.max(...flat.map(Number).filter(n => !isNaN(n)));
// }

// // ==========================================
// // 9. DRAG AND DROP ENGINE
// // ==========================================
// let dragElement = null;

// function handleDragStart(e) {
//   this.style.opacity = "0.4";
//   dragElement = this;
//   e.dataTransfer.effectAllowed = "move";
//   e.dataTransfer.setData("item", this.getAttribute("data-item") || this.innerHTML);
// }
// function handleDragOver(e) {
//   if (e.preventDefault) e.preventDefault();
//   e.dataTransfer.dropEffect = "move";
//   return false;
// }
// function handleDragEnter() { this.classList.add("dragover"); }
// function handleDragLeave() { this.classList.remove("dragover"); }

// function handleDrop(e) {
//   if (e.stopPropagation) e.stopPropagation();
//   if (dragElement !== this) {
//     const itemValue = dragElement.getAttribute("data-item") || dragElement.textContent.trim();
//     this.textContent = itemValue;
//     this.setAttribute("data-item", itemValue);

//     const qid = this.getAttribute("data-question-id") || this.id;
//     if (qid) updateQNavState(String(qid));
//   }
// }
// function handleDragEnd() {
//   this.style.opacity = "1";
//   document.querySelectorAll(".box, .diagram-box").forEach(item => item.classList.remove("dragover"));
// }
// function addDragEvents(element) {
//   element.setAttribute("draggable", true);
//   element.addEventListener("dragenter", handleDragEnter);
//   element.addEventListener("dragover", handleDragOver);
//   element.addEventListener("dragleave", handleDragLeave);
//   element.addEventListener("drop", handleDrop);
//   element.addEventListener("dragend", handleDragEnd);
//   element.addEventListener("dragstart", handleDragStart);
// }
// function initDragAndDrop() {
//   document.querySelectorAll(".box, .diagram-box").forEach(item => addDragEvents(item));
// }

// // ==========================================
// // 10. BOTTOM QUESTION NAVIGATION BUTTONS
// // ==========================================
// function isQuestionAnswered(qid) {
//   const textInput = document.querySelector(`input[type="text"][data-question-id="${qid}"], input[type="text"][placeholder="${qid}"]`);
//   if (textInput && textInput.value.trim() !== "") return true;

//   const inputsByName = document.querySelectorAll(`input[name="${qid}"]`);
//   for (const el of inputsByName) {
//     if (el.checked) return true;
//   }
//   const select = document.getElementById(qid);
//   if (select && select.value && select.value.trim() !== "") return true;

//   const dropzone = document.getElementById(String(qid));
//   if (dropzone && dropzone.textContent.trim() !== "" && dropzone.textContent.trim().toLowerCase() !== "empty") return true;

//   return false;
// }

// function updateQNavState(qid) {
//   const btn = document.querySelector(`.qnav-btn[data-qid="${qid}"]`);
//   if (!btn) return;
//   if (isQuestionAnswered(qid)) btn.classList.add("attempted");
//   else btn.classList.remove("attempted");
// }

// function createPartQuestionNavButtons() {
//   for (let part = 1; part <= 4; part++) {
//     const partEl = document.getElementById(`part-${part}`);
//     if (!partEl) continue;
//     const qEls = partEl.querySelectorAll("[data-question-id], [id]");
//     const qIds = [];

//     qEls.forEach(el => {
//       const attr = el.getAttribute("data-question-id") || el.getAttribute("placeholder");
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
//         const targetEl = document.querySelector(`[data-question-id="${qid}"], [id="${qid}"], [placeholder="${qid}"]`);
//         if (targetEl) {
//           const parentPartMatch = targetEl.closest(".part");
//           if (parentPartMatch) {
//             const whichPart = (parentPartMatch.id || "").match(/\d+/);
//             if (whichPart) showPart(Number(whichPart[0]));
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
//       const found = String(inp.name).match(/\d+/);
//       if (found) updateQNavState(found[0]);
//     });
//   });

//   document.querySelectorAll('select').forEach(sel => {
//     sel.addEventListener('change', () => {
//       if (sel.id && sel.selectedIndex > 0 && sel.value !== "") {
//         updateQNavState(String(sel.id));
//       }
//     });
//   });
// }

// // ==========================================
// // 11. STARTUP
// // ==========================================
// window.addEventListener("DOMContentLoaded", async () => {
//   const user = await userData();
//   const userDiv = document.getElementById("userID");
//   if (userDiv && user) {
//     userDiv.textContent = user.username;
//   }
//   await ensureMockData();
// });

////////////////////////////////////////
// // ==========================================
// // 1. DATA INITIALIZATION (LOCALSTORAGE + API FALLBACK)
// // ==========================================
// let parsedQuestionData = null;

// try {
//   const localData = localStorage.getItem("data");
//   if (localData) {
//     parsedQuestionData = JSON.parse(localData);
//   }
// } catch (e) {
//   console.warn("LocalStorage parse warning:", e);
// }

// // Fallback: যদি লোকাল স্টোরেজে না থাকে, সেশন API থেকে সরাসরি আনবে
// async function ensureMockData() {
//   if (!parsedQuestionData || !parsedQuestionData.listening) {
//     try {
//       const res = await fetch("/api/mockTest");
//       if (res.ok) {
//         parsedQuestionData = await res.json();
//         localStorage.setItem("data", JSON.stringify(parsedQuestionData));
//       }
//     } catch (err) {
//       console.error("Failed to load /api/mockTest fallback:", err);
//     }
//   }

//   if (!parsedQuestionData || !parsedQuestionData.listening) {
//     console.error("Listening test data not found in session!");
//     return;
//   }

//   renderExam(parsedQuestionData);
// }

// async function userData() {
//   try {
//     const res = await fetch("/api/user-data");
//     if (res.ok) {
//       return await res.json();
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }

// // ==========================================
// // 2. GLOBAL VARIABLES
// // ==========================================
// let questions = [];
// let instructions = [];
// let mockID = "";
// let officialAnswers = {};
// let totalParts = 4;
// let currentPart = 1;
// const answerArrayUpdated = {};
// const mistakes = {};
// let currentAudio = null;
// let retryCount = 0;

// const TOTAL_QUESTIONS = 40;
// let isSubmitting = false;
// let examLocked = false;
// let timeUpTriggered = false;
// let minuteInterval = null;
// let secondsInterval = null;

// // ==========================================
// // 3. SUBMIT & FLOW (NO INSTANT MODAL - REDIRECT TO NEXT MODULE)
// // ==========================================
// async function submitTest() {
//   if (isSubmitting) return;
//   isSubmitting = true;

//   inputCheckUpdated();
//   sessionStorage.setItem("listeningIscompleted", "true");
//   const [scoreToSend, mistakesToSend] = findDifferences(answerArrayUpdated, officialAnswers);

//   try {
//     await fetch('/api/update-mock-info', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ score: scoreToSend, mistakes: mistakesToSend, mod: "listening" })
//     });
//   } catch (err) {
//     console.error("Score sync error:", err);
//   }

//   // লিসেনিং শেষ হলে সরাসরি মক পেজে রিডাইরেক্ট করবে যাতে Reading Video চালু হয়
//   window.location.href = "/mock-test";
// }

// // ==========================================
// // 4. UI POPUPS, MODALS & SETTINGS
// // ==========================================
// const popupSettings = document.getElementById("popup-settings");
// const popupNote = document.getElementById("popup-note");

// function settingsMenu() {
//   if (popupSettings) popupSettings.classList.toggle("menu-visible");
// }

// function closeSettings() {
//   if (popupSettings) popupSettings.classList.remove("menu-visible");
//   if (popupNote) popupNote.classList.remove("menu-visible");
// }

// function openNotes() {
//   if (popupNote) popupNote.classList.toggle("menu-visible");
// }

// window.addEventListener("keydown", function (e) {
//   if (e.key === "F3" || (e.ctrlKey && (e.key === "f" || e.key === "F"))) {
//     e.preventDefault();
//   }
// });

// // Fullscreen Warning Check
// const fullscreenModal = document.getElementById("fullscreen-warning-modal");
// const fullscreenOkBtn = document.getElementById("fullscreen-ok-btn");
// const fullscreenStayBtn = document.getElementById("fullscreen-stay-btn");

// document.addEventListener("fullscreenchange", () => {
//   // টাইম শেষ হলে আর fullscreen warning দেখাবে না
//   if (examLocked) return;
//   if (!document.fullscreenElement) {
//     if (fullscreenModal) fullscreenModal.style.display = "flex";
//   }
// });

// if (fullscreenOkBtn) {
//   fullscreenOkBtn.onclick = async function () {
//     if (fullscreenModal) fullscreenModal.style.display = "none";
//     await submitTest();
//   };
// }

// if (fullscreenStayBtn) {
//   fullscreenStayBtn.onclick = function () {
//     if (fullscreenModal) fullscreenModal.style.display = "none";
//     document.documentElement.requestFullscreen().catch(() => {});
//   };
// }

// // Finish Test Buttons
// const submitBtn = document.getElementById("finishBtn");
// const submitModal = document.getElementById("submit-warning-modal");
// const submitOkButton = document.getElementById("submit-ok-btn");
// const submitStayButton = document.getElementById("submit-stay-btn");

// if (submitBtn) {
//   submitBtn.addEventListener("click", function (e) {
//     e.preventDefault();
//     if (examLocked) return;
//     if (submitModal) submitModal.style.display = "flex";
//   });
// }

// if (submitOkButton) {
//   submitOkButton.addEventListener("click", async (e) => {
//     e.preventDefault();
//     if (submitModal) submitModal.style.display = "none";
//     await submitTest();
//   });
// }

// if (submitStayButton) {
//   submitStayButton.addEventListener("click", (e) => {
//     e.preventDefault();
//     if (submitModal) submitModal.style.display = "none";
//   });
// }

// // ==========================================
// // 5. AUDIO & INSTRUCTION POPUP LOGIC
// // ==========================================
// function openListeningPopup() {
//   const overlay = document.getElementById("listeningOverlay");
//   if (overlay) overlay.style.display = "flex";
//   document.body.classList.add("listening-popup-active");
// }

// function closeListeningPopup() {
//   const overlay = document.getElementById("listeningOverlay");
//   if (overlay) overlay.style.display = "none";
//   document.body.classList.remove("listening-popup-active");

//   const elem = document.documentElement;
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen().catch(err => console.warn("Fullscreen blocked:", err));
//   }

//   // Purono audio instance cleanup
//   if (currentAudio) {
//     currentAudio.pause();
//     currentAudio.onended = null;
//     currentAudio.onerror = null;
//     currentAudio.src = "";
//     currentAudio.load();
//   }

//   // অডিও সোর্স: old code er moto /audio/<mockNumber>, kono extension nai
//   // (server er AUDIO_ROUTES key diye local file khuje ber kore)
//   const audioFile = parsedQuestionData?.mockNumber;

//   if (audioFile) {
//     const finalSrc = `/audio/${encodeURIComponent(audioFile)}`;

//     currentAudio = new Audio(finalSrc);
//     currentAudio.preload = "auto";

//     currentAudio.onerror = function () {
//       const err = currentAudio.error;
//       console.error("Audio error detected:", finalSrc, err);

//       // File/ID na paile (404 / unsupported source) retry kore lav nai
//       if (err && err.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
//         console.error("Audio source not found or not supported. Check AUDIO_ROUTES key:", audioFile);
//         return;
//       }

//       // Network error hole retry
//       const lastPosition = currentAudio.currentTime;
//       if (retryCount < 5) {
//         retryCount++;
//         setTimeout(() => {
//           currentAudio.load();
//           currentAudio.currentTime = lastPosition;
//           currentAudio.play().catch(e => console.error("Resume failed:", e));
//         }, 2000);
//       } else {
//         alert("Connection lost. Please refresh the page and continue.");
//       }
//     };

//     currentAudio.onwaiting = () => console.warn("Audio is buffering... please wait.");

//     currentAudio.onstalled = () => {
//       console.warn("Network is too slow. Attempting to kickstart...");
//       currentAudio.load();
//       currentAudio.play().catch(() => {});
//     };

//     currentAudio.onplaying = () => { retryCount = 0; };
//     currentAudio.play().catch(err => console.warn("Autoplay notice:", err));
//   } else {
//     console.error("mockNumber not found in data, audio cannot be loaded.");
//   }

//   // Timer Initialization
//   const timer = document.getElementById("timer");
//   if (timer) {
//     let minutesRemaining = parseInt(timer.textContent) || 30;
//     clearInterval(minuteInterval);
//     minuteInterval = setInterval(() => {
//       minutesRemaining -= 1;
//       if (minutesRemaining <= 10) {
//         const timerBlunt = document.querySelector(".timer-blunt");
//         const timerSpecific = document.querySelector(".timer-specific");
//         if (timerSpecific) { timerSpecific.style.opacity = 1; timerSpecific.style.color = "red"; }
//         if (timerBlunt) timerBlunt.style.opacity = 0;
//       }
//       if (minutesRemaining <= 0) {
//         timer.textContent = '0';
//         clearInterval(minuteInterval);
//         // টাইম শেষ: সরাসরি submit না করে notification দেখাবে
//         handleTimeUp();
//       } else {
//         timer.textContent = minutesRemaining;
//       }
//     }, 60000);
//   }

//   // Specific Seconds Timer
//   const minutesDisplay = document.getElementById("minutes");
//   const secondsDisplay = document.getElementById("seconds");
//   let totalSeconds = 32 * 60;
//   function updateTimerDisplay() {
//     let minutes = Math.floor(totalSeconds / 60);
//     let seconds = totalSeconds % 60;
//     if (minutesDisplay) minutesDisplay.textContent = String(minutes).padStart(2, "0");
//     if (secondsDisplay) secondsDisplay.textContent = String(seconds).padStart(2, "0");
//   }

//   clearInterval(secondsInterval);
//   secondsInterval = setInterval(function () {
//     if (totalSeconds > 0) {
//       totalSeconds--;
//       updateTimerDisplay();
//     }
//   }, 1000);
// }

// // ==========================================
// // 6. PART NAVIGATION (PART 1 TO 4)
// // ==========================================
// const nextButton = document.getElementById("next-button");
// const prevButton = document.getElementById("previous-button");

// function showPart(part) {
//   for (let i = 1; i <= totalParts; i++) {
//     const partEl = document.getElementById(`part-${i}`);
//     const partBtn = document.getElementById(`part-${i}-button`);
//     if (partEl) partEl.style.display = (i === part) ? "block" : "none";
//     if (partBtn) {
//       if (i === part) partBtn.classList.add('active');
//       else partBtn.classList.remove('active');
//     }
//   }
//   currentPart = part;
// }

// function showNext(event) {
//   if (event) event.preventDefault();
//   if (currentPart < totalParts) {
//     currentPart++;
//     showPart(currentPart);
//   }
// }

// function showPrevious(event) {
//   if (event) event.preventDefault();
//   if (currentPart > 1) {
//     currentPart--;
//     showPart(currentPart);
//   }
// }

// function updateNavButtons() {
//   if (!nextButton || !prevButton) return;
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
// setInterval(updateNavButtons, 200);

// // ==========================================
// // 7. RENDER FULL MOCK EXAM
// // ==========================================
// function escapeHtml(str) {
//   return String(str).replace(/[&<>"']/g, (c) => ({
//     "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
//   }[c]));
// }

// function blankToInput(text) {
//   return String(text).replace(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`);
// }

// function renderExam(pData) {
//   questions = pData.listening.questions || [];
//   instructions = pData.listening.instructions || [];
//   mockID = pData.mockNumber || "";
//   officialAnswers = pData.listening.answers || {};

//   const part1Margin = document.getElementById("part-margin-1");
//   const part2Margin = document.getElementById("part-margin-2");
//   const part3Margin = document.getElementById("part-margin-3");
//   const part4Margin = document.getElementById("part-margin-4");

//   const seenGroups = new Set();
//   const groupCounts = new Map();

//   // Create Groups per Part
//   questions.forEach((q) => {
//     groupCounts.set(q.group, (groupCounts.get(q.group) || 0) + 1);

//     if (!seenGroups.has(q.group)) {
//       const groupDiv = document.createElement("div");
//       groupDiv.classList.add(`group-${q.group}`);

//       const containers = [
//         "mcq-container-one-choice", "mcq-container-two-choice", "table-container",
//         "sentence-completion-container", "form-container", "note-container",
//         "flowchart-container", "short-answer-container question", "matching-container",
//         "diagram-label-container", "full-note-completion-container", "matching-information-container"
//       ];

//       containers.forEach(cls => {
//         const d = document.createElement("div");
//         cls.split(" ").forEach(c => d.classList.add(c));
//         groupDiv.appendChild(d);
//       });

//       if (q.part == 1 && part1Margin) part1Margin.appendChild(groupDiv);
//       if (q.part == 2 && part2Margin) part2Margin.appendChild(groupDiv);
//       if (q.part == 3 && part3Margin) part3Margin.appendChild(groupDiv);
//       if (q.part == 4 && part4Margin) part4Margin.appendChild(groupDiv);

//       seenGroups.add(q.group);
//     }
//   });

//   // ------------------------------------------------------------
//   // Render Questions in Respective Containers (OLD FORMATS)
//   // ------------------------------------------------------------
//   questions.forEach((q, index) => {
//     const groupDiv = document.querySelector(`.group-${q.group}`);
//     if (!groupDiv) return;

//     // ---------- MCQ (one choice) ----------
//     if (q.type === "mcq") {
//       const mcqContainer = groupDiv.querySelector(".mcq-container-one-choice");
//       let optionsHtml = "";
//       (q.options || []).forEach((opt, oIdx) => {
//         optionsHtml += `<label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${index + 1}" value="${oIdx + 1}">&nbsp;&nbsp;${opt}</label><br>`;
//       });
//       mcqContainer.innerHTML += `
//                   <div class="mcq"><p data-question-id="${index + 1}"><strong>${index + 1}.</strong> ${q.text}</p>
//                   ${optionsHtml}
//                   </div>
//       `;
//     }

//     // ---------- Short Answer ----------
//     if (q.type == "shortAnswer") {
//       const shortAnswerContainer = groupDiv.querySelector(".short-answer-container");
//       shortAnswerContainer.innerHTML += `
//                 <div class="short-answer-item">
//                 <label><strong>${q.id}</strong> ${q.text}
//                 <input spellcheck="false" type="text" name="${q.id}" placeholder="${q.id}" data-question-id="${q.id}">
//                 </label>
//                 </div>
//       `;
//     }

//     // ---------- Sentence Completion ----------
//     if (q.type == "sentence-completion") {
//       const sentenceCompletionContainer = groupDiv.querySelector(".sentence-completion-container");

//       const listElem = document.createElement("ul");
//       (q.sentences || []).forEach((sentence) => {
//         const liElem = document.createElement("li");
//         liElem.innerHTML = `<p>${blankToInput(sentence)}</p>`;
//         listElem.appendChild(liElem);
//       });
//       sentenceCompletionContainer.appendChild(listElem);

//       const inputs = sentenceCompletionContainer.querySelectorAll("input");
//       inputs.forEach((input, idx) => {
//         if (q.id && q.id[idx] !== undefined) {
//           input.setAttribute("placeholder", q.id[idx]);
//           input.setAttribute("data-question-id", q.id[idx]);
//         }
//       });
//     }

//     // ---------- MCQ Two Choice (old single) ----------
//     if (q.type == "mcq-two-choice") {
//       const mcqTwoChoiceContainer = groupDiv.querySelector(".mcq-container-two-choice");
//       mcqTwoChoiceContainer.innerHTML += `<div class="question-box">
//                                           <div class="number-boxes">
//                                           <div class="num-box">${q.id[0]}</div>
//                                           <div class="num-box">${q.id[1]}</div>
//                                           </div>

//                                           <div class="question-text">
//                                           ${q.text}
//                                           </div>
//                                           </div>`;
//       (q.options || []).forEach((opt, oIdx) => {
//         mcqTwoChoiceContainer.innerHTML += `<div class="options">
//                                             <label>${oIdx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${q.id[0]}" data-question-id="${q.id[0]} ${q.id[1]}" value="${oIdx + 1}">   &nbsp;&nbsp;${opt}</label><br>
//                                           </div>`;
//       });
//     }

//     // ---------- Note Completion / Part 4 full note ----------
//     if (q.part == 4 || q.type == "note-completion" || q.type == "form-completion") {
//       const fullNoteCompletionContainer =
//         groupDiv.querySelector(".full-note-completion-container") || groupDiv.querySelector(".form-container");

//       fullNoteCompletionContainer.innerHTML += `<h1 class="note-completion-title">${q.heading || ""}</h1>`;
//       if (!q.subheadings) {
//         ((q.paragraphs && q.paragraphs[0]) || []).forEach((paragraph) => {
//           fullNoteCompletionContainer.innerHTML += `<p>${blankToInput(paragraph)}</p>`;
//         });
//       } else {
//         q.subheadings.forEach((subheading, sIdx) => {
//           fullNoteCompletionContainer.innerHTML += `<p class="note-completion-subheading">${subheading}</p>`;
//           ((q.paragraphs && q.paragraphs[sIdx]) || []).forEach((paragraph) => {
//             fullNoteCompletionContainer.innerHTML += `<p>${blankToInput(paragraph)}</p>`;
//           });
//         });
//       }

//       const inputs = fullNoteCompletionContainer.querySelectorAll("input");
//       inputs.forEach((input, i) => {
//         if (q.id && q.id[i] !== undefined) {
//           input.setAttribute("placeholder", q.id[i]);
//           input.setAttribute("data-question-id", q.id[i]);
//         }
//       });
//     }

//     // ---------- Note (two column table) ----------
//     if (q.type == "note") {
//       const noteContainer = groupDiv.querySelector(".note-container");
//       noteContainer.innerHTML += `<h1 class="note-completion-title">${q.title}</h1>`;
//       const tableContainer = document.createElement("table");
//       tableContainer.classList.add("note-table");

//       q["col-one"].forEach((col, cIdx) => {
//         const trContainer = document.createElement("tr");
//         const tdContainerforColOne = document.createElement("td");
//         tdContainerforColOne.setAttribute("style", "white-space: pre");
//         const tdContainerForColTwo = document.createElement("td");
//         tdContainerForColTwo.setAttribute("style", "white-space: pre");

//         let htmlString = ``;
//         if (col.length > 1) {
//           col.forEach((co) => {
//             tdContainerforColOne.textContent += `${co} \r\n\r\n`;
//             htmlString = tdContainerforColOne.outerHTML;
//           });
//         } else {
//           htmlString += `<td>${col[0]}</td>`;
//         }

//         if (q["col-two"][cIdx].length > 1) {
//           q["col-two"][cIdx].forEach((c, idx) => {
//             tdContainerForColTwo.textContent += `${c} \r\n\r\n`;
//             if (idx == q["col-two"][cIdx].length - 1) {
//               htmlString += tdContainerForColTwo.outerHTML;
//             }
//           });
//         } else {
//           htmlString += `<td>${q["col-two"][cIdx][0]}</td>`;
//         }

//         trContainer.innerHTML += `<p>${blankToInput(htmlString)}</p>`;
//         tableContainer.appendChild(trContainer);
//       });
//       noteContainer.appendChild(tableContainer);

//       const inputs = noteContainer.querySelectorAll("input");
//       inputs.forEach((input, i) => {
//         if (q.id && q.id[i] !== undefined) {
//           input.setAttribute("placeholder", q.id[i]);
//           input.setAttribute("data-question-id", q.id[i]);
//         }
//       });
//     }

//     // ---------- MCQ updated ----------
//     if (q.type == "mcq-updated") {
//       const mcqContainerDiv = groupDiv.querySelector(".mcq-container-one-choice");
//       q.questions.forEach((question, qIdx) => {
//         const mcqContainer = document.createElement("div");
//         mcqContainer.classList.add("mcq");
//         mcqContainer.innerHTML += `<p data-question-id="${q.id[qIdx]}"><strong>${q.id[qIdx]}.</strong> ${question}</p>`;
//         q.options[qIdx].forEach((option, idx) => {
//           mcqContainer.innerHTML += `
//                   <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${q.id[qIdx]}" value="${idx + 1}">&nbsp;&nbsp;${option}</label><br>`;
//         });
//         mcqContainerDiv.appendChild(mcqContainer);
//       });
//     }

//     // ---------- Short Answer updated ----------
//     if (q.type == "shortAnswer-updated") {
//       const shortAnswerDiv = groupDiv.querySelector(".short-answer-container");
//       q.questions.forEach((question, qIdx) => {
//         shortAnswerDiv.innerHTML += `<div class="short-answer-item">
//                                   <label>
//                                   <strong>${q.id[qIdx]}.</strong>
//                                   ${question}
//                                   <input spellcheck="false" type="text" name="${q.id[qIdx]}" placeholder="${q.id[qIdx]}" data-question-id="${q.id[qIdx]}">
//                                   </label></div>`;
//       });
//     }

//     // ---------- MCQ Two Choice updated ----------
//     if (q.type == "mcq-two-choice-updated") {
//       const mcqTwoChoiceContainer = groupDiv.querySelector(".mcq-container-two-choice");
//       q.questions.forEach((question, qIdx) => {
//         mcqTwoChoiceContainer.innerHTML += `<div class="question-box">
//                                           <div class="number-boxes">
//                                           <div class="num-box">${q.id[qIdx][0]}</div>
//                                           <div class="num-box">${q.id[qIdx][1]}</div>
//                                           </div>

//                                           <div class="question-text">
//                                           ${question[0]}
//                                           </div>
//                                           </div>`;
//         q.options[qIdx].forEach((option, idx) => {
//           mcqTwoChoiceContainer.innerHTML += `<div class="options">
//                                             <label>${idx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${q.id[qIdx][0]}" data-question-id="${q.id[qIdx][0]} ${q.id[qIdx][1]}" value="${idx + 1}">   &nbsp;&nbsp;${option}</label><br>
//                                           </div>`;
//         });
//       });
//     }

//     // ---------- Feature Matching ----------
//     if (q.type == "feature-matching") {
//       const matchingContainer = groupDiv.querySelector(".matching-container");
//       const allBoxes = document.createElement("div");
//       allBoxes.classList.add("all-boxes");
//       const matchingFeatures = document.createElement("div");
//       matchingFeatures.classList.add("matching-features");
//       const matchingOptions = document.createElement("div");
//       matchingOptions.classList.add("matching-options");

//       q.features.forEach((feature, fIdx) => {
//         matchingFeatures.innerHTML += `<div class="qa-pair">
//                                     <div data-question-id="${q.id[fIdx]}" class="question-feature"><strong>${q.id[fIdx]}.</strong>&nbsp;&nbsp;${feature}</div>
//                                     <div id="${q.id[fIdx]}" class="box dropzone" data-class="feature-matching" data-item="" data-initial="empty"></div>
//                                     </div>`;
//       });
//       allBoxes.appendChild(matchingFeatures);
//       q.options.forEach((option) => {
//         matchingOptions.innerHTML += `<div class="box" data-class="feature-matching" data-item="${escapeHtml(option)}">${option}</div>`;
//       });
//       allBoxes.appendChild(matchingOptions);

//       matchingContainer.appendChild(allBoxes);
//     }

//     // ---------- Table Completion ----------
//     if (q.type == "table-completion") {
//       const tableContainer = groupDiv.querySelector(".table-container");
//       const table = document.createElement("table");

//       q["table-structure"].forEach((count, tIdx) => {
//         const tr = document.createElement("tr");
//         for (let i = 0; i < count; i++) {
//           const td = document.createElement("td");
//           if (count == findLowest(q["table-structure"])) {
//             td.colSpan = findHighest(q["table-structure"]);
//           }
//           td.innerHTML += `<p style="text-align:center">${blankToInput((q.cells[tIdx] && q.cells[tIdx][i]) || "")}</p>`;
//           tr.appendChild(td);
//         }
//         table.appendChild(tr);
//       });
//       tableContainer.appendChild(table);

//       const inputs = tableContainer.querySelectorAll("input");
//       inputs.forEach((input, i) => {
//         if (q.id && q.id[i] !== undefined) {
//           input.setAttribute("placeholder", q.id[i]);
//           input.setAttribute("data-question-id", q.id[i]);
//         }
//       });
//     }

//     // ---------- Flowchart ----------
//     if (q.type == "flowchart") {
//       const flowChartContainer = groupDiv.querySelector(".flowchart-container");
//       const flowChartOptions = document.createElement("div");
//       flowChartOptions.classList.add("flowchart-options");
//       const flowChartQuestions = document.createElement("div");
//       flowChartQuestions.classList.add("flowchart");

//       q.options.forEach((option) => {
//         flowChartOptions.innerHTML += `<div class="box" draggable="true" data-class="flow-chart" data-item="${escapeHtml(option)}">${option}</div>`;
//       });
//       flowChartContainer.appendChild(flowChartOptions);
//       q.questions.forEach((question, qIdx) => {
//         flowChartQuestions.innerHTML += `<div class="step">
//                                         <div class="num-box"><strong>${q.id[qIdx]}</strong></div>
//                                         <div class="question">${question}</div>
//                                         <div class="arrow">↓</div>
//                                         <div id="${q.id[qIdx]}" data-question-id="${q.id[qIdx]}" class="box dropzone" data-class="flow-chart" data-item="" data-initial="empty"></div>
//                                       </div>`;
//       });
//       flowChartContainer.appendChild(flowChartQuestions);
//     }

//     // ---------- Matching Information ----------
//     if (q.type == "matching-information") {
//       const matchingInformationContainer = groupDiv.querySelector(".matching-information-container");
//       const selectElem = document.createElement("select");
//       selectElem.setAttribute("name", `matching-information-${q.part}`);
//       selectElem.setAttribute("class", `matching-information`);
//       const optionElem = document.createElement("option");

//       optionElem.setAttribute("value", "");
//       selectElem.appendChild(optionElem);

//       const matchingListContainer = document.createElement("div");
//       matchingListContainer.classList.add("matching-list");
//       const matchingList = document.createElement("ul");
//       q.options.forEach((option, oIdx) => {
//         matchingList.innerHTML += `<li><strong>${q.paragraphs[oIdx]}.</strong>&nbsp;&nbsp;${option}</li>`;
//       });
//       matchingListContainer.appendChild(matchingList);
//       matchingInformationContainer.appendChild(matchingListContainer);

//       q.paragraphs.forEach((paragraph) => {
//         const optionELEMENT = document.createElement("option");
//         optionELEMENT.setAttribute("value", paragraph);
//         optionELEMENT.textContent = paragraph;
//         selectElem.appendChild(optionELEMENT);
//       });

//       q.information.forEach((info, iIdx) => {
//         selectElem.setAttribute("id", q.id[iIdx]);

//         const infoDiv = document.createElement("div");
//         infoDiv.classList.add("matching-info-question");
//         infoDiv.setAttribute("data-question-id", q.id[iIdx]);

//         const infoPara = document.createElement("p");
//         infoPara.innerHTML = `<strong>${q.id[iIdx]}.</strong>&nbsp;&nbsp;${info}`;

//         infoDiv.appendChild(infoPara);
//         infoDiv.innerHTML += selectElem.outerHTML;

//         matchingInformationContainer.appendChild(infoDiv);
//       });
//     }

//     // ---------- Diagram / Map Labelling ----------
//     if (q.type === "diagram-labelling" || q.type === "map-labelling" || q.type === "Map-Labelling") {
//       const diagramContainer = groupDiv.querySelector(".diagram-label-container");
//       const allBoxes = document.createElement("div");
//       allBoxes.classList.add("all-boxes");

//       const imagingContainer = document.createElement("div");
//       imagingContainer.classList.add("image-div");
//       imagingContainer.innerHTML = `<img src="${q.image}">`;
//       diagramContainer.appendChild(imagingContainer);

//       const matchingLabels = document.createElement("div");
//       matchingLabels.classList.add("matching-labels");

//       const matchingOptions = document.createElement("div");
//       matchingOptions.classList.add("matching-options-for-diagram");

//       const labelList = q.labels || q.locations || [];
//       labelList.forEach((label, lIdx) => {
//         matchingLabels.innerHTML += `<div class="qa-pair">
//                                   <div data-question-id="${q.id[lIdx]}" class="question-label"><strong>${q.id[lIdx]}.</strong>&nbsp;&nbsp;${label}</div>
//                                   <div id="${q.id[lIdx]}" class="dropzone diagram-box" data-class="diagram" data-item="" data-initial="empty"></div>
//                                   </div>`;
//       });
//       allBoxes.appendChild(matchingLabels);

//       (q.options || []).forEach((option) => {
//         matchingOptions.innerHTML += `<div class="diagram-box" data-class="diagram" data-item="${escapeHtml(option)}">${option}</div>`;
//       });
//       allBoxes.appendChild(matchingOptions);
//       diagramContainer.appendChild(allBoxes);
//     }
//   });

//   // Group Headers & Range Generation
//   let gIndex = 0;
//   groupCounts.forEach((val, group) => {
//     const groupDiv = document.querySelector(`.group-${group}`);
//     if (groupDiv && instructions[gIndex] && questions[gIndex]) {
//       const groupHeader = document.createElement("div");
//       groupHeader.classList.add("group-header", "mb-3", "p-2", "border-bottom");
//       const instructionDiv = document.createElement("div");
//       instructionDiv.classList.add("instructions");
//       instructionDiv.innerHTML = `<h3>${instructions[gIndex].instruction}</h3>`;
//       groupHeader.prepend(instructionDiv);

//       const min = findLowest(questions[gIndex].id);
//       const max = findHighest(questions[gIndex].id);
//       if (!isNaN(min) && !isNaN(max) && isFinite(min) && isFinite(max)) {
//         const groupRangeHeader = document.createElement("h4");
//         groupRangeHeader.className = "text-primary";
//         groupRangeHeader.textContent = `Questions ${min} - ${max}`;
//         groupHeader.prepend(groupRangeHeader);
//       }
//       groupDiv.prepend(groupHeader);
//     }
//     gIndex++;
//   });

//   // Init Interactive Systems
//   initDragAndDrop();
//   setupTwoChoiceLimits();
//   createPartQuestionNavButtons();
//   attachAnswerListeners();
//   showPart(1);
//   openListeningPopup();
// }

// // Two-choice (checkbox) এ সর্বোচ্চ ২টা select + name rename logic (old logic)
// function bindTwoChoice(idPair) {
//   if (!idPair) return;
//   const boxes = Array.from(document.querySelectorAll(`input[type="checkbox"][name="q${idPair[0]}"]`));
//   boxes.forEach((box) => {
//     box.addEventListener("change", () => {
//       const checked = boxes.filter((cb) => cb.checked);
//       if (checked.length > 2) {
//         box.checked = false;
//         return;
//       }
//       checked.forEach((cb, idx) => cb.setAttribute("name", String(idPair[idx])));
//       updateQNavState(String(idPair[0]));
//       updateQNavState(String(idPair[1]));
//     });
//   });
// }

// function setupTwoChoiceLimits() {
//   questions.forEach((q) => {
//     if (q.type === "mcq-two-choice-updated") {
//       (q.questions || []).forEach((_, i) => bindTwoChoice(q.id[i]));
//     } else if (q.type === "mcq-two-choice") {
//       bindTwoChoice(q.id);
//     }
//   });
// }

// // ==========================================
// // 8. ANSWER EVALUATION & DIFF HELPERS
// // ==========================================
// function inputCheckUpdated() {
//   document.querySelectorAll("input").forEach((input) => {
//     if (input.type === "text" && (input.getAttribute("data-question-id") || input.placeholder)) {
//       const id = input.getAttribute("data-question-id") || input.placeholder;
//       answerArrayUpdated[id] = [input.value.trim()];
//     }
//     if (input.checked && input.name) {
//       answerArrayUpdated[input.name] = [input.value.trim()];
//     }
//   });

//   document.querySelectorAll('.matching-information').forEach((selectedInput) => {
//     if (selectedInput.id) {
//       answerArrayUpdated[selectedInput.id] = [selectedInput.value];
//     }
//   });

//   document.querySelectorAll('[data-initial="empty"]').forEach((empty) => {
//     if (empty.id) {
//       answerArrayUpdated[empty.id] = [empty.textContent.trim()];
//     }
//   });
// }

// function findDifferences(your_answer, realAnswers) {
//   let totalScore = TOTAL_QUESTIONS;
//   Object.keys(mistakes).forEach((k) => delete mistakes[k]);

//   for (const key in realAnswers) {
//     const yourAns = your_answer[key] || [];
//     const realAns = [].concat(realAnswers[key] || []);
//     const matchFound = yourAns.some(ans =>
//       realAns.map(r => String(r).toLowerCase().trim()).includes(String(ans).toLowerCase().trim())
//     );
//     if (!matchFound) {
//       mistakes[key] = {
//         "Your answer": yourAns,
//         "Correct answer": realAns
//       };
//       totalScore--;
//     }
//   }
//   return [totalScore, mistakes];
// }

// function findLowest(arr) {
//   const flat = [arr].flat(Infinity);
//   return Math.min(...flat.map(Number).filter(n => !isNaN(n)));
// }
// function findHighest(arr) {
//   const flat = [arr].flat(Infinity);
//   return Math.max(...flat.map(Number).filter(n => !isNaN(n)));
// }

// // ==========================================
// // 9. DRAG AND DROP ENGINE
// // ==========================================
// let dragElement = null;

// function handleDragStart(e) {
//   if (examLocked) { e.preventDefault(); return; }
//   this.style.opacity = "0.4";
//   dragElement = this;
//   e.dataTransfer.effectAllowed = "move";
//   e.dataTransfer.setData("item", this.getAttribute("data-item") || this.innerHTML);
// }
// function handleDragOver(e) {
//   if (e.preventDefault) e.preventDefault();
//   e.dataTransfer.dropEffect = "move";
//   return false;
// }
// function handleDragEnter() { this.classList.add("dragover"); }
// function handleDragLeave() { this.classList.remove("dragover"); }

// function handleDrop(e) {
//   if (e.stopPropagation) e.stopPropagation();
//   if (examLocked) return;
//   // শুধু dropzone এ drop হবে (option box এর লেখা যেন নষ্ট না হয়)
//   if (!this.classList.contains("dropzone")) return;
//   if (dragElement && dragElement !== this) {
//     const itemValue = dragElement.getAttribute("data-item") || dragElement.textContent.trim();
//     this.textContent = itemValue;
//     this.setAttribute("data-item", itemValue);

//     const qid = this.getAttribute("data-question-id") || this.id;
//     if (qid) updateQNavState(String(qid));
//   }
// }
// function handleDragEnd() {
//   this.style.opacity = "1";
//   document.querySelectorAll(".box, .diagram-box").forEach(item => item.classList.remove("dragover"));
// }
// function addDragEvents(element) {
//   element.setAttribute("draggable", true);
//   element.addEventListener("dragenter", handleDragEnter);
//   element.addEventListener("dragover", handleDragOver);
//   element.addEventListener("dragleave", handleDragLeave);
//   element.addEventListener("drop", handleDrop);
//   element.addEventListener("dragend", handleDragEnd);
//   element.addEventListener("dragstart", handleDragStart);
// }
// function initDragAndDrop() {
//   document.querySelectorAll(".box, .diagram-box").forEach(item => addDragEvents(item));
// }

// // ==========================================
// // 10. BOTTOM QUESTION NAVIGATION BUTTONS
// // ==========================================
// function isQuestionAnswered(qid) {
//   const textInput = document.querySelector(`input[type="text"][data-question-id="${qid}"], input[type="text"][placeholder="${qid}"]`);
//   if (textInput && textInput.value.trim() !== "") return true;

//   const inputsByName = document.querySelectorAll(`input[name="${qid}"]`);
//   for (const el of inputsByName) {
//     if (el.checked) return true;
//   }
//   const select = document.getElementById(qid);
//   if (select && select.value && select.value.trim() !== "") return true;

//   const dropzone = document.getElementById(String(qid));
//   if (dropzone && dropzone.textContent.trim() !== "" && dropzone.textContent.trim().toLowerCase() !== "empty") return true;

//   return false;
// }

// function updateQNavState(qid) {
//   const btn = document.querySelector(`.qnav-btn[data-qid="${qid}"]`);
//   if (!btn) return;
//   if (isQuestionAnswered(qid)) btn.classList.add("attempted");
//   else btn.classList.remove("attempted");
// }

// function createPartQuestionNavButtons() {
//   for (let part = 1; part <= 4; part++) {
//     const partEl = document.getElementById(`part-${part}`);
//     if (!partEl) continue;
//     const qEls = partEl.querySelectorAll("[data-question-id], [id]");
//     const qIds = [];

//     qEls.forEach(el => {
//       const attr = el.getAttribute("data-question-id") || el.getAttribute("placeholder");
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
//         const targetEl = document.querySelector(`[data-question-id="${qid}"], [id="${qid}"], [placeholder="${qid}"]`);
//         if (targetEl) {
//           const parentPartMatch = targetEl.closest(".part");
//           if (parentPartMatch) {
//             const whichPart = (parentPartMatch.id || "").match(/\d+/);
//             if (whichPart) showPart(Number(whichPart[0]));
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
//       const found = String(inp.name).match(/\d+/);
//       if (found) updateQNavState(found[0]);
//     });
//   });

//   document.querySelectorAll('select').forEach(sel => {
//     sel.addEventListener('change', () => {
//       if (sel.id && sel.selectedIndex > 0 && sel.value !== "") {
//         updateQNavState(String(sel.id));
//       }
//     });
//   });
// }

// // ==========================================
// // 11. TIME-UP FLOW (NOTIFICATION + PREVIEW + START READING)
// // ==========================================
// function injectResultStyles() {
//   if (document.getElementById("bc-result-styles")) return;
//   const style = document.createElement("style");
//   style.id = "bc-result-styles";
//   style.textContent = `
//     .exam-locked .box, .exam-locked .diagram-box { pointer-events: none; }

//     .bc-overlay { position: fixed; inset: 0; background: rgba(8, 24, 68, 0.80); display: flex; align-items: center; justify-content: center; z-index: 100000; padding: 16px; font-family: "Segoe UI", system-ui, -apple-system, Arial, sans-serif; }
//     .bc-card { background: #fff; border-radius: 14px; width: 100%; max-width: 540px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.4); animation: bcPop .25s ease; }
//     @keyframes bcPop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
//     .bc-card-head { background: linear-gradient(135deg, #071d4f, #0a2a6e 55%, #1b4fb3); color: #fff; padding: 26px 24px 22px; text-align: center; border-bottom: 5px solid #d52b1e; }
//     .bc-card-head h2 { margin: 0 0 4px; font-size: 26px; letter-spacing: .3px; }
//     .bc-card-head p { margin: 0; font-size: 14px; opacity: .85; }
//     .bc-card-body { padding: 22px 28px 12px; color: #1f2a44; font-size: 15.5px; line-height: 1.65; text-align: center; }
//     .bc-card-note { font-size: 13px; color: #5b6783; margin-top: 10px; }
//     .bc-card-actions { display: flex; gap: 12px; padding: 14px 28px 28px; flex-wrap: wrap; }

//     .bc-btn { flex: 1; min-width: 170px; padding: 13px 18px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; border: 2px solid transparent; transition: all .2s; }
//     .bc-btn-blue { background: #fff; color: #0a2a6e; border-color: #0a2a6e; }
//     .bc-btn-blue:hover { background: #0a2a6e; color: #fff; }
//     .bc-btn-red { background: #d52b1e; color: #fff; border-color: #d52b1e; }
//     .bc-btn-red:hover { background: #b01f14; border-color: #b01f14; }
//     .bc-btn:disabled { opacity: .6; cursor: not-allowed; }

//     .bc-result { position: fixed; inset: 0; z-index: 100001; background: #eef2f9; overflow-y: auto; font-family: "Segoe UI", system-ui, -apple-system, Arial, sans-serif; color: #1f2a44; }
//     .bc-result-header { background: linear-gradient(135deg, #071d4f, #0a2a6e 55%, #1b4fb3); color: #fff; padding: 30px 20px 80px; text-align: center; border-bottom: 6px solid #d52b1e; }
//     .bc-result-header h1 { margin: 0; font-size: 28px; letter-spacing: .4px; }
//     .bc-result-header p { margin: 8px 0 0; opacity: .85; font-size: 14px; }
//     .bc-result-wrap { max-width: 920px; margin: -56px auto 30px; padding: 0 16px; }

//     .bc-score-card { background: #fff; border-radius: 16px; box-shadow: 0 12px 32px rgba(10,42,110,.18); padding: 28px; display: flex; gap: 30px; align-items: center; justify-content: center; flex-wrap: wrap; border-top: 4px solid #d52b1e; }
//     .bc-ring { width: 160px; height: 160px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
//     .bc-ring-inner { width: 124px; height: 124px; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; }
//     .bc-ring-score { font-size: 40px; font-weight: 800; color: #0a2a6e; line-height: 1; }
//     .bc-ring-total { font-size: 14px; font-weight: 700; color: #d52b1e; margin-top: 4px; }
//     .bc-score-info { flex: 1; min-width: 260px; }
//     .bc-score-info h2 { margin: 0 0 4px; font-size: 20px; color: #0a2a6e; }
//     .bc-score-info p { margin: 0 0 14px; font-size: 14px; color: #5b6783; }
//     .bc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
//     .bc-stat { border-radius: 10px; padding: 12px 8px; text-align: center; }
//     .bc-stat b { display: block; font-size: 24px; line-height: 1.1; }
//     .bc-stat span { font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
//     .bc-stat-ok { background: #e8efff; color: #0a2a6e; }
//     .bc-stat-bad { background: #fdeceb; color: #d52b1e; }
//     .bc-stat-skip { background: #f0f2f7; color: #5b6783; }

//     .bc-parts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0; }
//     .bc-part-box { background: #fff; border-radius: 12px; padding: 14px; box-shadow: 0 4px 14px rgba(10,42,110,.10); border-bottom: 3px solid #0a2a6e; }
//     .bc-part-box h4 { margin: 0 0 6px; font-size: 13px; color: #5b6783; text-transform: uppercase; letter-spacing: .5px; }
//     .bc-part-box .bc-part-score { font-size: 22px; font-weight: 800; color: #0a2a6e; }
//     .bc-part-box .bc-part-score small { font-size: 13px; color: #d52b1e; font-weight: 700; }
//     .bc-bar { height: 6px; background: #f3c9c6; border-radius: 4px; margin-top: 8px; overflow: hidden; }
//     .bc-bar > div { height: 100%; background: #0a2a6e; }

//     .bc-review-title { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin: 24px 0 12px; }
//     .bc-review-title h3 { margin: 0; font-size: 20px; color: #0a2a6e; border-left: 5px solid #d52b1e; padding-left: 10px; }
//     .bc-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
//     .bc-tab { padding: 7px 14px; border-radius: 20px; border: 2px solid #0a2a6e; background: #fff; color: #0a2a6e; font-weight: 700; font-size: 13px; cursor: pointer; }
//     .bc-tab.active { background: #0a2a6e; color: #fff; }

//     .bc-part-sec-title { margin: 18px 0 8px; font-size: 14px; color: #fff; background: #0a2a6e; display: inline-block; padding: 5px 14px; border-radius: 6px; }
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

//     .bc-result-footer { position: sticky; bottom: 0; background: #fff; border-top: 3px solid #d52b1e; padding: 14px 16px; text-align: center; box-shadow: 0 -6px 18px rgba(0,0,0,.08); }
//     .bc-result-footer p { margin: 0 0 10px; font-size: 13px; color: #5b6783; }
//     .bc-result-footer .bc-btn { flex: none; min-width: 260px; }

//     @media (max-width: 640px) {
//       .bc-parts { grid-template-columns: repeat(2, 1fr); }
//       .bc-review-body { grid-template-columns: 1fr; }
//       .bc-result-header h1 { font-size: 22px; }
//     }
//   `;
//   document.head.appendChild(style);
// }

// function lockExam() {
//   injectResultStyles();
//   document.body.classList.add("exam-locked");
//   const root = document.getElementById("test-content") || document;
//   root.querySelectorAll("input, select, textarea").forEach((el) => { el.disabled = true; });
//   document.querySelectorAll(".box, .diagram-box").forEach((el) => el.setAttribute("draggable", "false"));
// }

// function handleTimeUp() {
//   if (timeUpTriggered || isSubmitting) return;
//   timeUpTriggered = true;
//   examLocked = true;

//   clearInterval(minuteInterval);
//   clearInterval(secondsInterval);
//   if (currentAudio) currentAudio.pause();

//   if (submitModal) submitModal.style.display = "none";
//   if (fullscreenModal) fullscreenModal.style.display = "none";

//   const minutesDisplay = document.getElementById("minutes");
//   const secondsDisplay = document.getElementById("seconds");
//   if (minutesDisplay) minutesDisplay.textContent = "00";
//   if (secondsDisplay) secondsDisplay.textContent = "00";

//   lockExam();
//   inputCheckUpdated();
//   showTimeUpModal();
// }

// function showTimeUpModal() {
//   const existing = document.getElementById("bc-timeup-modal");
//   if (existing) existing.remove();

//   const html = `
//     <div id="bc-timeup-modal" class="bc-overlay">
//       <div class="bc-card">
//         <div class="bc-card-head">
//           <h2>Time&#39;s Up!</h2>
//           <p>Listening Test</p>
//         </div>
//         <div class="bc-card-body">
//           <p style="margin:0 0 8px;">Your Listening test time has ended and your answers have been locked.</p>
//           <p style="margin:0;"><strong>Would you like to preview your answers and score, or start the Reading test now?</strong></p>
//           <p class="bc-card-note">Your answers will be submitted when you start the Reading test.</p>
//         </div>
//         <div class="bc-card-actions">
//           <button id="bc-preview-btn" class="bc-btn bc-btn-blue" type="button">Preview Answers</button>
//           <button id="bc-timeup-start-btn" class="bc-btn bc-btn-red" type="button">Start Reading Test</button>
//         </div>
//       </div>
//     </div>
//   `;
//   document.body.insertAdjacentHTML("beforeend", html);

//   document.getElementById("bc-preview-btn").addEventListener("click", showPreviewResult);
//   document.getElementById("bc-timeup-start-btn").addEventListener("click", async (e) => {
//     e.target.disabled = true;
//     e.target.textContent = "Submitting...";
//     await submitTest();
//   });
// }

// function normalizeAns(v) {
//   return String(v).toLowerCase().trim();
// }

// // প্রতিটি প্রশ্নের full result list (correct + wrong + unanswered)
// function buildResultList() {
//   const list = [];
//   const keys = Object.keys(officialAnswers).sort((a, b) => Number(a) - Number(b));
//   keys.forEach((key) => {
//     const userAns = (answerArrayUpdated[key] || []).filter((a) => String(a).trim() !== "");
//     const realAns = [].concat(officialAnswers[key] || []).map((r) => String(r));
//     const realNorm = realAns.map(normalizeAns);
//     const isCorrect = userAns.some((a) => realNorm.includes(normalizeAns(a)));
//     list.push({
//       id: key,
//       user: userAns.join(", "),
//       correct: realAns.join(" / "),
//       isCorrect,
//       answered: userAns.length > 0,
//       part: Math.ceil(Number(key) / 10)
//     });
//   });
//   return list;
// }

// function showPreviewResult() {
//   injectResultStyles();
//   const timeUpModal = document.getElementById("bc-timeup-modal");
//   if (timeUpModal) timeUpModal.remove();
//   const old = document.getElementById("bc-result-screen");
//   if (old) old.remove();

//   inputCheckUpdated();
//   const [score] = findDifferences(answerArrayUpdated, officialAnswers);
//   const results = buildResultList();

//   const total = TOTAL_QUESTIONS;
//   const wrongTotal = total - score;
//   const unanswered = results.filter((r) => !r.answered).length;
//   const incorrect = Math.max(0, wrongTotal - unanswered);
//   const percent = Math.round((score / total) * 100);
//   const deg = Math.round((score / total) * 360);

//   // Part-wise boxes
//   let partsHtml = "";
//   for (let p = 1; p <= 4; p++) {
//     const items = results.filter((r) => r.part === p);
//     const partTotal = items.length || 10;
//     const partCorrect = items.filter((r) => r.isCorrect).length;
//     const pct = Math.round((partCorrect / partTotal) * 100);
//     partsHtml += `
//       <div class="bc-part-box">
//         <h4>Part ${p}</h4>
//         <div class="bc-part-score">${partCorrect} <small>/ ${partTotal}</small></div>
//         <div class="bc-bar"><div style="width:${pct}%"></div></div>
//       </div>`;
//   }

//   // Review list grouped by part
//   let reviewHtml = "";
//   for (let p = 1; p <= 4; p++) {
//     const items = results.filter((r) => r.part === p);
//     if (!items.length) continue;
//     reviewHtml += `<div class="bc-part-sec"><div class="bc-part-sec-title">Part ${p}</div>`;
//     items.forEach((r) => {
//       const userHtml = r.answered
//         ? `<span class="bc-val ${r.isCorrect ? "right" : "wrong"}">${escapeHtml(r.user)}</span>`
//         : `<span class="bc-val empty">Not answered</span>`;
//       reviewHtml += `
//         <div class="bc-review-item ${r.isCorrect ? "ok" : "bad"}" data-ok="${r.isCorrect ? 1 : 0}">
//           <div class="bc-q-num">${escapeHtml(r.id)}</div>
//           <div class="bc-review-body">
//             <div><span class="bc-lbl">Your answer</span>${userHtml}</div>
//             <div><span class="bc-lbl">Correct answer</span><span class="bc-val right">${escapeHtml(r.correct)}</span></div>
//           </div>
//           <div class="bc-mark">${r.isCorrect ? "&#10003;" : "&#10007;"}</div>
//         </div>`;
//     });
//     reviewHtml += `</div>`;
//   }

//   const username = (document.getElementById("userID") && document.getElementById("userID").textContent.trim()) || "";

//   const html = `
//     <div id="bc-result-screen" class="bc-result">
//       <div class="bc-result-header">
//         <h1>Listening Test &ndash; Score Report</h1>
//         <p>${username ? "Candidate: " + escapeHtml(username) + " &nbsp;|&nbsp; " : ""}Preview of your answers (read-only)</p>
//       </div>

//       <div class="bc-result-wrap">
//         <div class="bc-score-card">
//           <div class="bc-ring" style="background: conic-gradient(#0a2a6e 0deg ${deg}deg, #f3c9c6 ${deg}deg 360deg);">
//             <div class="bc-ring-inner">
//               <div class="bc-ring-score">${score}</div>
//               <div class="bc-ring-total">out of ${total}</div>
//             </div>
//           </div>
//           <div class="bc-score-info">
//             <h2>You answered ${score} out of ${total} questions correctly</h2>
//             <p>Accuracy: ${percent}%</p>
//             <div class="bc-stats">
//               <div class="bc-stat bc-stat-ok"><b>${score}</b><span>Correct</span></div>
//               <div class="bc-stat bc-stat-bad"><b>${incorrect}</b><span>Incorrect</span></div>
//               <div class="bc-stat bc-stat-skip"><b>${unanswered}</b><span>Unanswered</span></div>
//             </div>
//           </div>
//         </div>

//         <div class="bc-parts">${partsHtml}</div>

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

//       <div class="bc-result-footer">
//         <p>Your answers are locked. Click below to submit your Listening test and continue to the Reading test.</p>
//         <button id="bc-start-reading-btn" class="bc-btn bc-btn-red" type="button">Start Reading Test &rarr;</button>
//       </div>
//     </div>
//   `;
//   document.body.insertAdjacentHTML("beforeend", html);

//   const root = document.getElementById("bc-result-screen");

//   // Filter tabs
//   root.querySelectorAll(".bc-tab").forEach((tab) => {
//     tab.addEventListener("click", () => {
//       root.querySelectorAll(".bc-tab").forEach((t) => t.classList.remove("active"));
//       tab.classList.add("active");
//       const f = tab.getAttribute("data-filter");
//       root.querySelectorAll(".bc-review-item").forEach((it) => {
//         const ok = it.getAttribute("data-ok") === "1";
//         const show = f === "all" || (f === "correct" && ok) || (f === "wrong" && !ok);
//         it.style.display = show ? "" : "none";
//       });
//       root.querySelectorAll(".bc-part-sec").forEach((sec) => {
//         const any = Array.from(sec.querySelectorAll(".bc-review-item")).some((it) => it.style.display !== "none");
//         sec.style.display = any ? "" : "none";
//       });
//     });
//   });

//   // Start Reading (submit + redirect)
//   document.getElementById("bc-start-reading-btn").addEventListener("click", async (e) => {
//     e.target.disabled = true;
//     e.target.textContent = "Submitting...";
//     await submitTest();
//   });
// }

// // ==========================================
// // 12. STARTUP
// // ==========================================
// window.addEventListener("DOMContentLoaded", async () => {
//   const user = await userData();
//   const userDiv = document.getElementById("userID");
//   if (userDiv && user) {
//     userDiv.textContent = user.username;
//   }
//   await ensureMockData();
// });

// ==========================================
// 1. DATA INITIALIZATION (LOCALSTORAGE + API FALLBACK)
// ==========================================
let parsedQuestionData = null;

try {
  const localData = localStorage.getItem("data");
  if (localData) {
    parsedQuestionData = JSON.parse(localData);
  }
} catch (e) {
  console.warn("LocalStorage parse warning:", e);
}

// Fallback: যদি লোকাল স্টোরেজে না থাকে, সেশন API থেকে সরাসরি আনবে
async function ensureMockData() {
  if (!parsedQuestionData || !parsedQuestionData.listening) {
    try {
      const res = await fetch("/api/mockTest");
      if (res.ok) {
        parsedQuestionData = await res.json();
        localStorage.setItem("data", JSON.stringify(parsedQuestionData));
      }
    } catch (err) {
      console.error("Failed to load /api/mockTest fallback:", err);
    }
  }

  if (!parsedQuestionData || !parsedQuestionData.listening) {
    console.error("Listening test data not found in session!");
    return;
  }

  renderExam(parsedQuestionData);
}

async function userData() {
  try {
    const res = await fetch("/api/user-data");
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error(e);
  }
}

// ==========================================
// 2. GLOBAL VARIABLES
// ==========================================
let questions = [];
let instructions = [];
let mockID = "";
let officialAnswers = {};
let totalParts = 4;
let currentPart = 1;
const answerArrayUpdated = {};
const mistakes = {};
let currentAudio = null;
let retryCount = 0;

const TOTAL_QUESTIONS = 40;
let isSubmitting = false;
let examLocked = false;
let timeUpTriggered = false;
let minuteInterval = null;
let secondsInterval = null;

// ==========================================
// 3. SUBMIT & FLOW (NO INSTANT MODAL - REDIRECT TO NEXT MODULE)
// ==========================================
async function submitTest() {
  if (isSubmitting) return;
  isSubmitting = true;

  inputCheckUpdated();
  sessionStorage.setItem("listeningIscompleted", "true");
  const [scoreToSend, mistakesToSend] = findDifferences(answerArrayUpdated, officialAnswers);

  // Reading page e final preview dekhanor jonno listening result save kora hocche
  try {
    sessionStorage.setItem("listeningScore", scoreToSend);
    localStorage.setItem("listeningScore", scoreToSend);
    sessionStorage.setItem("listeningMistakes", JSON.stringify(mistakesToSend));
    localStorage.setItem("listeningMistakes", JSON.stringify(mistakesToSend));
    sessionStorage.setItem("listeningAnswers", JSON.stringify(answerArrayUpdated));
    localStorage.setItem("listeningAnswers", JSON.stringify(answerArrayUpdated));
  } catch (e) {
    console.warn("Could not store listening result:", e);
  }

  try {
    await fetch('/api/update-mock-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: scoreToSend, mistakes: mistakesToSend, mod: "listening" })
    });
  } catch (err) {
    console.error("Score sync error:", err);
  }

  // লিসেনিং শেষ হলে সরাসরি মক পেজে রিডাইরেক্ট করবে যাতে Reading Video চালু হয়
  window.location.href = "/mock-test";
}

// ==========================================
// 4. UI POPUPS, MODALS & SETTINGS
// ==========================================
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

window.addEventListener("keydown", function (e) {
  if (e.key === "F3" || (e.ctrlKey && (e.key === "f" || e.key === "F"))) {
    e.preventDefault();
  }
});

// Fullscreen Warning Check
const fullscreenModal = document.getElementById("fullscreen-warning-modal");
const fullscreenOkBtn = document.getElementById("fullscreen-ok-btn");
const fullscreenStayBtn = document.getElementById("fullscreen-stay-btn");

document.addEventListener("fullscreenchange", () => {
  // টাইম শেষ হলে আর fullscreen warning দেখাবে না
  if (examLocked) return;
  if (!document.fullscreenElement) {
    if (fullscreenModal) fullscreenModal.style.display = "flex";
  }
});

if (fullscreenOkBtn) {
  fullscreenOkBtn.onclick = function () {
    if (fullscreenModal) fullscreenModal.style.display = "none";
    endListeningTest("finish");
  };
}

if (fullscreenStayBtn) {
  fullscreenStayBtn.onclick = function () {
    if (fullscreenModal) fullscreenModal.style.display = "none";
    document.documentElement.requestFullscreen().catch(() => {});
  };
}

// Finish Test Buttons
const submitBtn = document.getElementById("finishBtn");
const submitModal = document.getElementById("submit-warning-modal");
const submitOkButton = document.getElementById("submit-ok-btn");
const submitStayButton = document.getElementById("submit-stay-btn");

if (submitBtn) {
  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (examLocked) return;
    if (submitModal) submitModal.style.display = "flex";
  });
}

if (submitOkButton) {
  submitOkButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (submitModal) submitModal.style.display = "none";
    endListeningTest("finish");
  });
}

if (submitStayButton) {
  submitStayButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (submitModal) submitModal.style.display = "none";
  });
}

// ==========================================
// 5. AUDIO & INSTRUCTION POPUP LOGIC
// ==========================================
function openListeningPopup() {
  const overlay = document.getElementById("listeningOverlay");
  if (overlay) overlay.style.display = "flex";
  document.body.classList.add("listening-popup-active");
}

function closeListeningPopup() {
  const overlay = document.getElementById("listeningOverlay");
  if (overlay) overlay.style.display = "none";
  document.body.classList.remove("listening-popup-active");

  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => console.warn("Fullscreen blocked:", err));
  }

  // Purono audio instance cleanup
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.src = "";
    currentAudio.load();
  }

  // অডিও সোর্স: old code er moto /audio/<mockNumber>, kono extension nai
  // (server er AUDIO_ROUTES key diye local file khuje ber kore)
  const audioFile = parsedQuestionData?.mockNumber;

  if (audioFile) {
    const finalSrc = `/audio/${encodeURIComponent(audioFile)}`;

    currentAudio = new Audio(finalSrc);
    currentAudio.preload = "auto";

    currentAudio.onerror = function () {
      const err = currentAudio.error;
      console.error("Audio error detected:", finalSrc, err);

      // File/ID na paile (404 / unsupported source) retry kore lav nai
      if (err && err.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        console.error("Audio source not found or not supported. Check AUDIO_ROUTES key:", audioFile);
        return;
      }

      // Network error hole retry
      const lastPosition = currentAudio.currentTime;
      if (retryCount < 5) {
        retryCount++;
        setTimeout(() => {
          currentAudio.load();
          currentAudio.currentTime = lastPosition;
          currentAudio.play().catch(e => console.error("Resume failed:", e));
        }, 2000);
      } else {
        alert("Connection lost. Please refresh the page and continue.");
      }
    };

    currentAudio.onwaiting = () => console.warn("Audio is buffering... please wait.");

    currentAudio.onstalled = () => {
      console.warn("Network is too slow. Attempting to kickstart...");
      currentAudio.load();
      currentAudio.play().catch(() => {});
    };

    currentAudio.onplaying = () => { retryCount = 0; };
    currentAudio.play().catch(err => console.warn("Autoplay notice:", err));
  } else {
    console.error("mockNumber not found in data, audio cannot be loaded.");
  }

  // Timer Initialization
  const timer = document.getElementById("timer");
  if (timer) {
    let minutesRemaining = parseInt(timer.textContent) || 30;
    clearInterval(minuteInterval);
    minuteInterval = setInterval(() => {
      minutesRemaining -= 1;
      if (minutesRemaining <= 10) {
        const timerBlunt = document.querySelector(".timer-blunt");
        const timerSpecific = document.querySelector(".timer-specific");
        if (timerSpecific) { timerSpecific.style.opacity = 1; timerSpecific.style.color = "red"; }
        if (timerBlunt) timerBlunt.style.opacity = 0;
      }
      if (minutesRemaining <= 0) {
        timer.textContent = '0';
        clearInterval(minuteInterval);
        // টাইম শেষ: সরাসরি submit না করে notification দেখাবে
        handleTimeUp();
      } else {
        timer.textContent = minutesRemaining;
      }
    }, 60000);
  }

  // Specific Seconds Timer
  const minutesDisplay = document.getElementById("minutes");
  const secondsDisplay = document.getElementById("seconds");
  let totalSeconds = 32 * 60;
  function updateTimerDisplay() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    if (minutesDisplay) minutesDisplay.textContent = String(minutes).padStart(2, "0");
    if (secondsDisplay) secondsDisplay.textContent = String(seconds).padStart(2, "0");
  }

  clearInterval(secondsInterval);
  secondsInterval = setInterval(function () {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateTimerDisplay();
    }
  }, 1000);
}

// ==========================================
// 6. PART NAVIGATION (PART 1 TO 4)
// ==========================================
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("previous-button");

function showPart(part) {
  for (let i = 1; i <= totalParts; i++) {
    const partEl = document.getElementById(`part-${i}`);
    const partBtn = document.getElementById(`part-${i}-button`);
    if (partEl) partEl.style.display = (i === part) ? "block" : "none";
    if (partBtn) {
      if (i === part) partBtn.classList.add('active');
      else partBtn.classList.remove('active');
    }
  }
  currentPart = part;
}

function showNext(event) {
  if (event) event.preventDefault();
  if (currentPart < totalParts) {
    currentPart++;
    showPart(currentPart);
  }
}

function showPrevious(event) {
  if (event) event.preventDefault();
  if (currentPart > 1) {
    currentPart--;
    showPart(currentPart);
  }
}

function updateNavButtons() {
  if (!nextButton || !prevButton) return;
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
setInterval(updateNavButtons, 200);

// ==========================================
// 7. RENDER FULL MOCK EXAM
// ==========================================
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function blankToInput(text) {
  return String(text).replace(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`);
}

function renderExam(pData) {
  questions = pData.listening.questions || [];
  instructions = pData.listening.instructions || [];
  mockID = pData.mockNumber || "";
  officialAnswers = pData.listening.answers || {};

  const part1Margin = document.getElementById("part-margin-1");
  const part2Margin = document.getElementById("part-margin-2");
  const part3Margin = document.getElementById("part-margin-3");
  const part4Margin = document.getElementById("part-margin-4");

  const seenGroups = new Set();
  const groupCounts = new Map();

  // Create Groups per Part
  questions.forEach((q) => {
    groupCounts.set(q.group, (groupCounts.get(q.group) || 0) + 1);

    if (!seenGroups.has(q.group)) {
      const groupDiv = document.createElement("div");
      groupDiv.classList.add(`group-${q.group}`);

      const containers = [
        "mcq-container-one-choice", "mcq-container-two-choice", "table-container",
        "sentence-completion-container", "form-container", "note-container",
        "flowchart-container", "short-answer-container question", "matching-container",
        "diagram-label-container", "full-note-completion-container", "matching-information-container"
      ];

      containers.forEach(cls => {
        const d = document.createElement("div");
        cls.split(" ").forEach(c => d.classList.add(c));
        groupDiv.appendChild(d);
      });

      if (q.part == 1 && part1Margin) part1Margin.appendChild(groupDiv);
      if (q.part == 2 && part2Margin) part2Margin.appendChild(groupDiv);
      if (q.part == 3 && part3Margin) part3Margin.appendChild(groupDiv);
      if (q.part == 4 && part4Margin) part4Margin.appendChild(groupDiv);

      seenGroups.add(q.group);
    }
  });

  // ------------------------------------------------------------
  // Render Questions in Respective Containers (OLD FORMATS)
  // ------------------------------------------------------------
  questions.forEach((q, index) => {
    const groupDiv = document.querySelector(`.group-${q.group}`);
    if (!groupDiv) return;

    // ---------- MCQ (one choice) ----------
    if (q.type === "mcq") {
      const mcqContainer = groupDiv.querySelector(".mcq-container-one-choice");
      let optionsHtml = "";
      (q.options || []).forEach((opt, oIdx) => {
        optionsHtml += `<label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${index + 1}" value="${oIdx + 1}">&nbsp;&nbsp;${opt}</label><br>`;
      });
      mcqContainer.innerHTML += `
                  <div class="mcq"><p data-question-id="${index + 1}"><strong>${index + 1}.</strong> ${q.text}</p>
                  ${optionsHtml}
                  </div>
      `;
    }

    // ---------- Short Answer ----------
    if (q.type == "shortAnswer") {
      const shortAnswerContainer = groupDiv.querySelector(".short-answer-container");
      shortAnswerContainer.innerHTML += `
                <div class="short-answer-item">
                <label><strong>${q.id}</strong> ${q.text}
                <input spellcheck="false" type="text" name="${q.id}" placeholder="${q.id}" data-question-id="${q.id}">
                </label>
                </div>
      `;
    }

    // ---------- Sentence Completion ----------
    if (q.type == "sentence-completion") {
      const sentenceCompletionContainer = groupDiv.querySelector(".sentence-completion-container");

      const listElem = document.createElement("ul");
      (q.sentences || []).forEach((sentence) => {
        const liElem = document.createElement("li");
        liElem.innerHTML = `<p>${blankToInput(sentence)}</p>`;
        listElem.appendChild(liElem);
      });
      sentenceCompletionContainer.appendChild(listElem);

      const inputs = sentenceCompletionContainer.querySelectorAll("input");
      inputs.forEach((input, idx) => {
        if (q.id && q.id[idx] !== undefined) {
          input.setAttribute("placeholder", q.id[idx]);
          input.setAttribute("data-question-id", q.id[idx]);
        }
      });
    }

    // ---------- MCQ Two Choice (old single) ----------
    if (q.type == "mcq-two-choice") {
      const mcqTwoChoiceContainer = groupDiv.querySelector(".mcq-container-two-choice");
      mcqTwoChoiceContainer.innerHTML += `<div class="question-box">
                                          <div class="number-boxes">
                                          <div class="num-box">${q.id[0]}</div>
                                          <div class="num-box">${q.id[1]}</div>
                                          </div>

                                          <div class="question-text">
                                          ${q.text}
                                          </div>
                                          </div>`;
      (q.options || []).forEach((opt, oIdx) => {
        mcqTwoChoiceContainer.innerHTML += `<div class="options">
                                            <label>${oIdx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${q.id[0]}" data-question-id="${q.id[0]} ${q.id[1]}" value="${oIdx + 1}">   &nbsp;&nbsp;${opt}</label><br>
                                          </div>`;
      });
    }

    // ---------- Note Completion / Part 4 full note ----------
    if (q.part == 4 || q.type == "note-completion" || q.type == "form-completion") {
      const fullNoteCompletionContainer =
        groupDiv.querySelector(".full-note-completion-container") || groupDiv.querySelector(".form-container");

      fullNoteCompletionContainer.innerHTML += `<h1 class="note-completion-title">${q.heading || ""}</h1>`;
      if (!q.subheadings) {
        ((q.paragraphs && q.paragraphs[0]) || []).forEach((paragraph) => {
          fullNoteCompletionContainer.innerHTML += `<p>${blankToInput(paragraph)}</p>`;
        });
      } else {
        q.subheadings.forEach((subheading, sIdx) => {
          fullNoteCompletionContainer.innerHTML += `<p class="note-completion-subheading">${subheading}</p>`;
          ((q.paragraphs && q.paragraphs[sIdx]) || []).forEach((paragraph) => {
            fullNoteCompletionContainer.innerHTML += `<p>${blankToInput(paragraph)}</p>`;
          });
        });
      }

      const inputs = fullNoteCompletionContainer.querySelectorAll("input");
      inputs.forEach((input, i) => {
        if (q.id && q.id[i] !== undefined) {
          input.setAttribute("placeholder", q.id[i]);
          input.setAttribute("data-question-id", q.id[i]);
        }
      });
    }

    // ---------- Note (two column table) ----------
    if (q.type == "note") {
      const noteContainer = groupDiv.querySelector(".note-container");
      noteContainer.innerHTML += `<h1 class="note-completion-title">${q.title}</h1>`;
      const tableContainer = document.createElement("table");
      tableContainer.classList.add("note-table");

      q["col-one"].forEach((col, cIdx) => {
        const trContainer = document.createElement("tr");
        const tdContainerforColOne = document.createElement("td");
        tdContainerforColOne.setAttribute("style", "white-space: pre");
        const tdContainerForColTwo = document.createElement("td");
        tdContainerForColTwo.setAttribute("style", "white-space: pre");

        let htmlString = ``;
        if (col.length > 1) {
          col.forEach((co) => {
            tdContainerforColOne.textContent += `${co} \r\n\r\n`;
            htmlString = tdContainerforColOne.outerHTML;
          });
        } else {
          htmlString += `<td>${col[0]}</td>`;
        }

        if (q["col-two"][cIdx].length > 1) {
          q["col-two"][cIdx].forEach((c, idx) => {
            tdContainerForColTwo.textContent += `${c} \r\n\r\n`;
            if (idx == q["col-two"][cIdx].length - 1) {
              htmlString += tdContainerForColTwo.outerHTML;
            }
          });
        } else {
          htmlString += `<td>${q["col-two"][cIdx][0]}</td>`;
        }

        trContainer.innerHTML += `<p>${blankToInput(htmlString)}</p>`;
        tableContainer.appendChild(trContainer);
      });
      noteContainer.appendChild(tableContainer);

      const inputs = noteContainer.querySelectorAll("input");
      inputs.forEach((input, i) => {
        if (q.id && q.id[i] !== undefined) {
          input.setAttribute("placeholder", q.id[i]);
          input.setAttribute("data-question-id", q.id[i]);
        }
      });
    }

    // ---------- MCQ updated ----------
    if (q.type == "mcq-updated") {
      const mcqContainerDiv = groupDiv.querySelector(".mcq-container-one-choice");
      q.questions.forEach((question, qIdx) => {
        const mcqContainer = document.createElement("div");
        mcqContainer.classList.add("mcq");
        mcqContainer.innerHTML += `<p data-question-id="${q.id[qIdx]}"><strong>${q.id[qIdx]}.</strong> ${question}</p>`;
        q.options[qIdx].forEach((option, idx) => {
          mcqContainer.innerHTML += `
                  <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${q.id[qIdx]}" value="${idx + 1}">&nbsp;&nbsp;${option}</label><br>`;
        });
        mcqContainerDiv.appendChild(mcqContainer);
      });
    }

    // ---------- Short Answer updated ----------
    if (q.type == "shortAnswer-updated") {
      const shortAnswerDiv = groupDiv.querySelector(".short-answer-container");
      q.questions.forEach((question, qIdx) => {
        shortAnswerDiv.innerHTML += `<div class="short-answer-item">
                                  <label>
                                  <strong>${q.id[qIdx]}.</strong>
                                  ${question}
                                  <input spellcheck="false" type="text" name="${q.id[qIdx]}" placeholder="${q.id[qIdx]}" data-question-id="${q.id[qIdx]}">
                                  </label></div>`;
      });
    }

    // ---------- MCQ Two Choice updated ----------
    if (q.type == "mcq-two-choice-updated") {
      const mcqTwoChoiceContainer = groupDiv.querySelector(".mcq-container-two-choice");
      q.questions.forEach((question, qIdx) => {
        mcqTwoChoiceContainer.innerHTML += `<div class="question-box">
                                          <div class="number-boxes">
                                          <div class="num-box">${q.id[qIdx][0]}</div>
                                          <div class="num-box">${q.id[qIdx][1]}</div>
                                          </div>

                                          <div class="question-text">
                                          ${question[0]}
                                          </div>
                                          </div>`;
        q.options[qIdx].forEach((option, idx) => {
          mcqTwoChoiceContainer.innerHTML += `<div class="options">
                                            <label>${idx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${q.id[qIdx][0]}" data-question-id="${q.id[qIdx][0]} ${q.id[qIdx][1]}" value="${idx + 1}">   &nbsp;&nbsp;${option}</label><br>
                                          </div>`;
        });
      });
    }

    // ---------- Feature Matching ----------
    if (q.type == "feature-matching") {
      const matchingContainer = groupDiv.querySelector(".matching-container");
      const allBoxes = document.createElement("div");
      allBoxes.classList.add("all-boxes");
      const matchingFeatures = document.createElement("div");
      matchingFeatures.classList.add("matching-features");
      const matchingOptions = document.createElement("div");
      matchingOptions.classList.add("matching-options");

      q.features.forEach((feature, fIdx) => {
        matchingFeatures.innerHTML += `<div class="qa-pair">
                                    <div data-question-id="${q.id[fIdx]}" class="question-feature"><strong>${q.id[fIdx]}.</strong>&nbsp;&nbsp;${feature}</div>
                                    <div id="${q.id[fIdx]}" class="box dropzone" data-class="feature-matching" data-item="" data-initial="empty"></div>
                                    </div>`;
      });
      allBoxes.appendChild(matchingFeatures);
      q.options.forEach((option) => {
        matchingOptions.innerHTML += `<div class="box" data-class="feature-matching" data-item="${escapeHtml(option)}">${option}</div>`;
      });
      allBoxes.appendChild(matchingOptions);

      matchingContainer.appendChild(allBoxes);
    }

    // ---------- Table Completion ----------
    if (q.type == "table-completion") {
      const tableContainer = groupDiv.querySelector(".table-container");
      const table = document.createElement("table");

      q["table-structure"].forEach((count, tIdx) => {
        const tr = document.createElement("tr");
        for (let i = 0; i < count; i++) {
          const td = document.createElement("td");
          if (count == findLowest(q["table-structure"])) {
            td.colSpan = findHighest(q["table-structure"]);
          }
          td.innerHTML += `<p style="text-align:center">${blankToInput((q.cells[tIdx] && q.cells[tIdx][i]) || "")}</p>`;
          tr.appendChild(td);
        }
        table.appendChild(tr);
      });
      tableContainer.appendChild(table);

      const inputs = tableContainer.querySelectorAll("input");
      inputs.forEach((input, i) => {
        if (q.id && q.id[i] !== undefined) {
          input.setAttribute("placeholder", q.id[i]);
          input.setAttribute("data-question-id", q.id[i]);
        }
      });
    }

    // ---------- Flowchart ----------
    if (q.type == "flowchart") {
      const flowChartContainer = groupDiv.querySelector(".flowchart-container");
      const flowChartOptions = document.createElement("div");
      flowChartOptions.classList.add("flowchart-options");
      const flowChartQuestions = document.createElement("div");
      flowChartQuestions.classList.add("flowchart");

      q.options.forEach((option) => {
        flowChartOptions.innerHTML += `<div class="box" draggable="true" data-class="flow-chart" data-item="${escapeHtml(option)}">${option}</div>`;
      });
      flowChartContainer.appendChild(flowChartOptions);
      q.questions.forEach((question, qIdx) => {
        flowChartQuestions.innerHTML += `<div class="step">
                                        <div class="num-box"><strong>${q.id[qIdx]}</strong></div>
                                        <div class="question">${question}</div>
                                        <div class="arrow">↓</div>
                                        <div id="${q.id[qIdx]}" data-question-id="${q.id[qIdx]}" class="box dropzone" data-class="flow-chart" data-item="" data-initial="empty"></div>
                                      </div>`;
      });
      flowChartContainer.appendChild(flowChartQuestions);
    }

    // ---------- Matching Information ----------
    if (q.type == "matching-information") {
      const matchingInformationContainer = groupDiv.querySelector(".matching-information-container");
      const selectElem = document.createElement("select");
      selectElem.setAttribute("name", `matching-information-${q.part}`);
      selectElem.setAttribute("class", `matching-information`);
      const optionElem = document.createElement("option");

      optionElem.setAttribute("value", "");
      selectElem.appendChild(optionElem);

      const matchingListContainer = document.createElement("div");
      matchingListContainer.classList.add("matching-list");
      const matchingList = document.createElement("ul");
      q.options.forEach((option, oIdx) => {
        matchingList.innerHTML += `<li><strong>${q.paragraphs[oIdx]}.</strong>&nbsp;&nbsp;${option}</li>`;
      });
      matchingListContainer.appendChild(matchingList);
      matchingInformationContainer.appendChild(matchingListContainer);

      q.paragraphs.forEach((paragraph) => {
        const optionELEMENT = document.createElement("option");
        optionELEMENT.setAttribute("value", paragraph);
        optionELEMENT.textContent = paragraph;
        selectElem.appendChild(optionELEMENT);
      });

      q.information.forEach((info, iIdx) => {
        selectElem.setAttribute("id", q.id[iIdx]);

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("matching-info-question");
        infoDiv.setAttribute("data-question-id", q.id[iIdx]);

        const infoPara = document.createElement("p");
        infoPara.innerHTML = `<strong>${q.id[iIdx]}.</strong>&nbsp;&nbsp;${info}`;

        infoDiv.appendChild(infoPara);
        infoDiv.innerHTML += selectElem.outerHTML;

        matchingInformationContainer.appendChild(infoDiv);
      });
    }

    // ---------- Diagram / Map Labelling ----------
    if (q.type === "diagram-labelling" || q.type === "map-labelling" || q.type === "Map-Labelling") {
      const diagramContainer = groupDiv.querySelector(".diagram-label-container");
      const allBoxes = document.createElement("div");
      allBoxes.classList.add("all-boxes");

      const imagingContainer = document.createElement("div");
      imagingContainer.classList.add("image-div");
      imagingContainer.innerHTML = `<img src="${q.image}">`;
      diagramContainer.appendChild(imagingContainer);

      const matchingLabels = document.createElement("div");
      matchingLabels.classList.add("matching-labels");

      const matchingOptions = document.createElement("div");
      matchingOptions.classList.add("matching-options-for-diagram");

      const labelList = q.labels || q.locations || [];
      labelList.forEach((label, lIdx) => {
        matchingLabels.innerHTML += `<div class="qa-pair">
                                  <div data-question-id="${q.id[lIdx]}" class="question-label"><strong>${q.id[lIdx]}.</strong>&nbsp;&nbsp;${label}</div>
                                  <div id="${q.id[lIdx]}" class="dropzone diagram-box" data-class="diagram" data-item="" data-initial="empty"></div>
                                  </div>`;
      });
      allBoxes.appendChild(matchingLabels);

      (q.options || []).forEach((option) => {
        matchingOptions.innerHTML += `<div class="diagram-box" data-class="diagram" data-item="${escapeHtml(option)}">${option}</div>`;
      });
      allBoxes.appendChild(matchingOptions);
      diagramContainer.appendChild(allBoxes);
    }
  });

  // Group Headers & Range Generation
  let gIndex = 0;
  groupCounts.forEach((val, group) => {
    const groupDiv = document.querySelector(`.group-${group}`);
    if (groupDiv && instructions[gIndex] && questions[gIndex]) {
      const groupHeader = document.createElement("div");
      groupHeader.classList.add("group-header", "mb-3", "p-2", "border-bottom");
      const instructionDiv = document.createElement("div");
      instructionDiv.classList.add("instructions");
      instructionDiv.innerHTML = `<h3>${instructions[gIndex].instruction}</h3>`;
      groupHeader.prepend(instructionDiv);

      const min = findLowest(questions[gIndex].id);
      const max = findHighest(questions[gIndex].id);
      if (!isNaN(min) && !isNaN(max) && isFinite(min) && isFinite(max)) {
        const groupRangeHeader = document.createElement("h4");
        groupRangeHeader.className = "text-primary";
        groupRangeHeader.textContent = `Questions ${min} - ${max}`;
        groupHeader.prepend(groupRangeHeader);
      }
      groupDiv.prepend(groupHeader);
    }
    gIndex++;
  });

  // Init Interactive Systems
  initDragAndDrop();
  setupTwoChoiceLimits();
  createPartQuestionNavButtons();
  attachAnswerListeners();
  showPart(1);
  openListeningPopup();
}

// Two-choice (checkbox) এ সর্বোচ্চ ২টা select + name rename logic (old logic)
function bindTwoChoice(idPair) {
  if (!idPair) return;
  const boxes = Array.from(document.querySelectorAll(`input[type="checkbox"][name="q${idPair[0]}"]`));
  boxes.forEach((box) => {
    box.addEventListener("change", () => {
      const checked = boxes.filter((cb) => cb.checked);
      if (checked.length > 2) {
        box.checked = false;
        return;
      }
      checked.forEach((cb, idx) => cb.setAttribute("name", String(idPair[idx])));
      updateQNavState(String(idPair[0]));
      updateQNavState(String(idPair[1]));
    });
  });
}

function setupTwoChoiceLimits() {
  questions.forEach((q) => {
    if (q.type === "mcq-two-choice-updated") {
      (q.questions || []).forEach((_, i) => bindTwoChoice(q.id[i]));
    } else if (q.type === "mcq-two-choice") {
      bindTwoChoice(q.id);
    }
  });
}

// ==========================================
// 8. ANSWER EVALUATION & DIFF HELPERS
// ==========================================
function inputCheckUpdated() {
  document.querySelectorAll("input").forEach((input) => {
    if (input.type === "text" && (input.getAttribute("data-question-id") || input.placeholder)) {
      const id = input.getAttribute("data-question-id") || input.placeholder;
      answerArrayUpdated[id] = [input.value.trim()];
    }
    if (input.checked && input.name) {
      answerArrayUpdated[input.name] = [input.value.trim()];
    }
  });

  document.querySelectorAll('.matching-information').forEach((selectedInput) => {
    if (selectedInput.id) {
      answerArrayUpdated[selectedInput.id] = [selectedInput.value];
    }
  });

  document.querySelectorAll('[data-initial="empty"]').forEach((empty) => {
    if (empty.id) {
      answerArrayUpdated[empty.id] = [empty.textContent.trim()];
    }
  });
}

function findDifferences(your_answer, realAnswers) {
  let totalScore = TOTAL_QUESTIONS;
  Object.keys(mistakes).forEach((k) => delete mistakes[k]);

  for (const key in realAnswers) {
    const yourAns = your_answer[key] || [];
    const realAns = [].concat(realAnswers[key] || []);
    const matchFound = yourAns.some(ans =>
      realAns.map(r => String(r).toLowerCase().trim()).includes(String(ans).toLowerCase().trim())
    );
    if (!matchFound) {
      mistakes[key] = {
        "Your answer": yourAns,
        "Correct answer": realAns
      };
      totalScore--;
    }
  }
  return [totalScore, mistakes];
}

function findLowest(arr) {
  const flat = [arr].flat(Infinity);
  return Math.min(...flat.map(Number).filter(n => !isNaN(n)));
}
function findHighest(arr) {
  const flat = [arr].flat(Infinity);
  return Math.max(...flat.map(Number).filter(n => !isNaN(n)));
}

// ==========================================
// 9. DRAG AND DROP ENGINE
// ==========================================
let dragElement = null;

function handleDragStart(e) {
  if (examLocked) { e.preventDefault(); return; }
  this.style.opacity = "0.4";
  dragElement = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("item", this.getAttribute("data-item") || this.innerHTML);
}
function handleDragOver(e) {
  if (e.preventDefault) e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  return false;
}
function handleDragEnter() { this.classList.add("dragover"); }
function handleDragLeave() { this.classList.remove("dragover"); }

function handleDrop(e) {
  if (e.stopPropagation) e.stopPropagation();
  if (examLocked) return;
  // শুধু dropzone এ drop হবে (option box এর লেখা যেন নষ্ট না হয়)
  if (!this.classList.contains("dropzone")) return;
  if (dragElement && dragElement !== this) {
    const itemValue = dragElement.getAttribute("data-item") || dragElement.textContent.trim();
    this.textContent = itemValue;
    this.setAttribute("data-item", itemValue);

    const qid = this.getAttribute("data-question-id") || this.id;
    if (qid) updateQNavState(String(qid));
  }
}
function handleDragEnd() {
  this.style.opacity = "1";
  document.querySelectorAll(".box, .diagram-box").forEach(item => item.classList.remove("dragover"));
}
function addDragEvents(element) {
  element.setAttribute("draggable", true);
  element.addEventListener("dragenter", handleDragEnter);
  element.addEventListener("dragover", handleDragOver);
  element.addEventListener("dragleave", handleDragLeave);
  element.addEventListener("drop", handleDrop);
  element.addEventListener("dragend", handleDragEnd);
  element.addEventListener("dragstart", handleDragStart);
}
function initDragAndDrop() {
  document.querySelectorAll(".box, .diagram-box").forEach(item => addDragEvents(item));
}

// ==========================================
// 10. BOTTOM QUESTION NAVIGATION BUTTONS
// ==========================================
function isQuestionAnswered(qid) {
  const textInput = document.querySelector(`input[type="text"][data-question-id="${qid}"], input[type="text"][placeholder="${qid}"]`);
  if (textInput && textInput.value.trim() !== "") return true;

  const inputsByName = document.querySelectorAll(`input[name="${qid}"]`);
  for (const el of inputsByName) {
    if (el.checked) return true;
  }
  const select = document.getElementById(qid);
  if (select && select.value && select.value.trim() !== "") return true;

  const dropzone = document.getElementById(String(qid));
  if (dropzone && dropzone.textContent.trim() !== "" && dropzone.textContent.trim().toLowerCase() !== "empty") return true;

  return false;
}

function updateQNavState(qid) {
  const btn = document.querySelector(`.qnav-btn[data-qid="${qid}"]`);
  if (!btn) return;
  if (isQuestionAnswered(qid)) btn.classList.add("attempted");
  else btn.classList.remove("attempted");
}

function createPartQuestionNavButtons() {
  for (let part = 1; part <= 4; part++) {
    const partEl = document.getElementById(`part-${part}`);
    if (!partEl) continue;
    const qEls = partEl.querySelectorAll("[data-question-id], [id]");
    const qIds = [];

    qEls.forEach(el => {
      const attr = el.getAttribute("data-question-id") || el.getAttribute("placeholder");
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
        const targetEl = document.querySelector(`[data-question-id="${qid}"], [id="${qid}"], [placeholder="${qid}"]`);
        if (targetEl) {
          const parentPartMatch = targetEl.closest(".part");
          if (parentPartMatch) {
            const whichPart = (parentPartMatch.id || "").match(/\d+/);
            if (whichPart) showPart(Number(whichPart[0]));
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
      const found = String(inp.name).match(/\d+/);
      if (found) updateQNavState(found[0]);
    });
  });

  document.querySelectorAll('select').forEach(sel => {
    sel.addEventListener('change', () => {
      if (sel.id && sel.selectedIndex > 0 && sel.value !== "") {
        updateQNavState(String(sel.id));
      }
    });
  });
}

// ==========================================
// 11. TIME-UP FLOW (NOTIFICATION + PREVIEW + START READING)
// ==========================================
function injectResultStyles() {
  if (document.getElementById("bc-result-styles")) return;
  const style = document.createElement("style");
  style.id = "bc-result-styles";
  style.textContent = `
    .exam-locked .box, .exam-locked .diagram-box { pointer-events: none; }

    .bc-overlay { position: fixed; inset: 0; background: rgba(8, 24, 68, 0.80); display: flex; align-items: center; justify-content: center; z-index: 100000; padding: 16px; font-family: "Segoe UI", system-ui, -apple-system, Arial, sans-serif; }
    .bc-card { background: #fff; border-radius: 14px; width: 100%; max-width: 540px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.4); animation: bcPop .25s ease; }
    @keyframes bcPop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .bc-card-head { background: linear-gradient(135deg, #071d4f, #0a2a6e 55%, #1b4fb3); color: #fff; padding: 26px 24px 22px; text-align: center; border-bottom: 5px solid #d52b1e; }
    .bc-card-head h2 { margin: 0 0 4px; font-size: 26px; letter-spacing: .3px; }
    .bc-card-head p { margin: 0; font-size: 14px; opacity: .85; }
    .bc-card-body { padding: 22px 28px 12px; color: #1f2a44; font-size: 15.5px; line-height: 1.65; text-align: center; }
    .bc-card-note { font-size: 13px; color: #5b6783; margin-top: 10px; }
    .bc-card-actions { display: flex; gap: 12px; padding: 14px 28px 28px; flex-wrap: wrap; }

    .bc-btn { flex: 1; min-width: 170px; padding: 13px 18px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; border: 2px solid transparent; transition: all .2s; }
    .bc-btn-blue { background: #fff; color: #0a2a6e; border-color: #0a2a6e; }
    .bc-btn-blue:hover { background: #0a2a6e; color: #fff; }
    .bc-btn-red { background: #d52b1e; color: #fff; border-color: #d52b1e; }
    .bc-btn-red:hover { background: #b01f14; border-color: #b01f14; }
    .bc-btn:disabled { opacity: .6; cursor: not-allowed; }

    .bc-card-modern { max-width: 560px; border-radius: 18px; }
    .bc-card-modern .bc-card-head { position: relative; padding: 34px 24px 26px; overflow: hidden; }
    .bc-card-modern .bc-card-head::before { content: ""; position: absolute; width: 220px; height: 220px; border-radius: 50%; background: rgba(255,255,255,0.06); top: -90px; right: -60px; }
    .bc-card-modern .bc-card-head::after { content: ""; position: absolute; width: 140px; height: 140px; border-radius: 50%; background: rgba(213,43,30,0.25); bottom: -70px; left: -40px; }
    .bc-icon { position: relative; z-index: 1; width: 68px; height: 68px; margin: 0 auto 14px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 5px rgba(213,43,30,0.9), 0 8px 20px rgba(0,0,0,0.25); }
    .bc-card-modern .bc-card-head h2 { position: relative; z-index: 1; font-size: 28px; }
    .bc-card-modern .bc-card-head p { position: relative; z-index: 1; text-transform: uppercase; letter-spacing: 1.5px; font-size: 12px; }
    .bc-lead { margin: 0 0 16px; font-size: 16px; color: #1f2a44; }
    .bc-pills { display: flex; gap: 12px; justify-content: center; margin-bottom: 18px; }
    .bc-pill { min-width: 120px; padding: 10px 16px; border-radius: 12px; text-align: center; }
    .bc-pill b { display: block; font-size: 26px; line-height: 1.1; }
    .bc-pill span { font-size: 11.5px; text-transform: uppercase; letter-spacing: .6px; font-weight: 600; }
    .bc-pill-blue { background: #e8efff; color: #0a2a6e; }
    .bc-pill-red { background: #fdeceb; color: #d52b1e; }
    .bc-question { margin: 0; font-weight: 700; color: #0a2a6e; font-size: 16px; }
    .bc-options { display: grid; gap: 12px; padding: 14px 28px 8px; }
    .bc-option { display: flex; align-items: center; gap: 14px; width: 100%; text-align: left; padding: 14px 16px; border-radius: 12px; border: 2px solid transparent; cursor: pointer; transition: all .2s; font-family: inherit; }
    .bc-option-icon { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .bc-option-text { display: flex; flex-direction: column; gap: 2px; }
    .bc-option-text strong { font-size: 16px; }
    .bc-option-text small { font-size: 12.5px; opacity: .8; }
    .bc-option-blue { background: #fff; color: #0a2a6e; border-color: #0a2a6e; }
    .bc-option-blue .bc-option-icon { background: #e8efff; }
    .bc-option-blue:hover { background: #0a2a6e; color: #fff; transform: translateY(-2px); box-shadow: 0 8px 18px rgba(10,42,110,.25); }
    .bc-option-blue:hover .bc-option-icon { background: rgba(255,255,255,0.18); }
    .bc-option-red { background: #d52b1e; color: #fff; border-color: #d52b1e; }
    .bc-option-red .bc-option-icon { background: rgba(255,255,255,0.2); }
    .bc-option-red:hover { background: #b01f14; border-color: #b01f14; transform: translateY(-2px); box-shadow: 0 8px 18px rgba(213,43,30,.35); }
    .bc-option:disabled { opacity: .65; cursor: not-allowed; transform: none; box-shadow: none; }
    .bc-card-note-bottom { margin: 6px 28px 22px; text-align: center; font-size: 12.5px; color: #6b7690; }

    .bc-result { position: fixed; inset: 0; z-index: 100001; background: #eef2f9; overflow-y: auto; font-family: "Segoe UI", system-ui, -apple-system, Arial, sans-serif; color: #1f2a44; }
    .bc-result-header { background: linear-gradient(135deg, #071d4f, #0a2a6e 55%, #1b4fb3); color: #fff; padding: 30px 20px 80px; text-align: center; border-bottom: 6px solid #d52b1e; }
    .bc-result-header h1 { margin: 0; font-size: 28px; letter-spacing: .4px; }
    .bc-result-header p { margin: 8px 0 0; opacity: .85; font-size: 14px; }
    .bc-result-wrap { max-width: 920px; margin: -56px auto 30px; padding: 0 16px; }

    .bc-score-card { background: #fff; border-radius: 16px; box-shadow: 0 12px 32px rgba(10,42,110,.18); padding: 28px; display: flex; gap: 30px; align-items: center; justify-content: center; flex-wrap: wrap; border-top: 4px solid #d52b1e; }
    .bc-ring { width: 160px; height: 160px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .bc-ring-inner { width: 124px; height: 124px; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .bc-ring-score { font-size: 40px; font-weight: 800; color: #0a2a6e; line-height: 1; }
    .bc-ring-total { font-size: 14px; font-weight: 700; color: #d52b1e; margin-top: 4px; }
    .bc-score-info { flex: 1; min-width: 260px; }
    .bc-score-info h2 { margin: 0 0 4px; font-size: 20px; color: #0a2a6e; }
    .bc-score-info p { margin: 0 0 14px; font-size: 14px; color: #5b6783; }
    .bc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .bc-stat { border-radius: 10px; padding: 12px 8px; text-align: center; }
    .bc-stat b { display: block; font-size: 24px; line-height: 1.1; }
    .bc-stat span { font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
    .bc-stat-ok { background: #e8efff; color: #0a2a6e; }
    .bc-stat-bad { background: #fdeceb; color: #d52b1e; }
    .bc-stat-skip { background: #f0f2f7; color: #5b6783; }

    .bc-parts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0; }
    .bc-part-box { background: #fff; border-radius: 12px; padding: 14px; box-shadow: 0 4px 14px rgba(10,42,110,.10); border-bottom: 3px solid #0a2a6e; }
    .bc-part-box h4 { margin: 0 0 6px; font-size: 13px; color: #5b6783; text-transform: uppercase; letter-spacing: .5px; }
    .bc-part-box .bc-part-score { font-size: 22px; font-weight: 800; color: #0a2a6e; }
    .bc-part-box .bc-part-score small { font-size: 13px; color: #d52b1e; font-weight: 700; }
    .bc-bar { height: 6px; background: #f3c9c6; border-radius: 4px; margin-top: 8px; overflow: hidden; }
    .bc-bar > div { height: 100%; background: #0a2a6e; }

    .bc-review-title { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin: 24px 0 12px; }
    .bc-review-title h3 { margin: 0; font-size: 20px; color: #0a2a6e; border-left: 5px solid #d52b1e; padding-left: 10px; }
    .bc-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .bc-tab { padding: 7px 14px; border-radius: 20px; border: 2px solid #0a2a6e; background: #fff; color: #0a2a6e; font-weight: 700; font-size: 13px; cursor: pointer; }
    .bc-tab.active { background: #0a2a6e; color: #fff; }

    .bc-part-sec-title { margin: 18px 0 8px; font-size: 14px; color: #fff; background: #0a2a6e; display: inline-block; padding: 5px 14px; border-radius: 6px; }
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

    .bc-result-footer { position: sticky; bottom: 0; background: #fff; border-top: 3px solid #d52b1e; padding: 14px 16px; text-align: center; box-shadow: 0 -6px 18px rgba(0,0,0,.08); }
    .bc-result-footer p { margin: 0 0 10px; font-size: 13px; color: #5b6783; }
    .bc-result-footer .bc-btn { flex: none; min-width: 260px; }

    @media (max-width: 640px) {
      .bc-parts { grid-template-columns: repeat(2, 1fr); }
      .bc-review-body { grid-template-columns: 1fr; }
      .bc-result-header h1 { font-size: 22px; }
    }
  `;
  document.head.appendChild(style);
}

function lockExam() {
  injectResultStyles();
  document.body.classList.add("exam-locked");
  const root = document.getElementById("test-content") || document;
  root.querySelectorAll("input, select, textarea").forEach((el) => { el.disabled = true; });
  document.querySelectorAll(".box, .diagram-box").forEach((el) => el.setAttribute("draggable", "false"));
}

// Test shesh hole (time up ba manual finish) - answer lock kore card dekhabe
function endListeningTest(reason) {
  if (timeUpTriggered || isSubmitting) return;
  timeUpTriggered = true;
  examLocked = true;

  clearInterval(minuteInterval);
  clearInterval(secondsInterval);
  if (currentAudio) currentAudio.pause();

  if (submitModal) submitModal.style.display = "none";
  if (fullscreenModal) fullscreenModal.style.display = "none";

  if (reason === "timeup") {
    const minutesDisplay = document.getElementById("minutes");
    const secondsDisplay = document.getElementById("seconds");
    if (minutesDisplay) minutesDisplay.textContent = "00";
    if (secondsDisplay) secondsDisplay.textContent = "00";
  }

  lockExam();
  inputCheckUpdated();
  showTimeUpModal(reason);
}

function handleTimeUp() {
  endListeningTest("timeup");
}

function countAnswered() {
  return Object.keys(officialAnswers).filter((k) =>
    (answerArrayUpdated[k] || []).some((a) => String(a).trim() !== "")
  ).length;
}

function showTimeUpModal(reason) {
  const existing = document.getElementById("bc-timeup-modal");
  if (existing) existing.remove();

  const isTimeUp = reason === "timeup";
  const title = isTimeUp ? "Time&#39;s Up!" : "Listening Test Finished!";
  const lead = isTimeUp
    ? "Your Listening test time has ended and your answers have been locked."
    : "You have finished the Listening test and your answers have been locked.";

  const headIcon = isTimeUp
    ? `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#d52b1e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`
    : `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#d52b1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/></svg>`;

  const eyeIcon = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const arrowIcon = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

  const answered = countAnswered();
  const unanswered = Math.max(0, TOTAL_QUESTIONS - answered);

  const html = `
    <div id="bc-timeup-modal" class="bc-overlay">
      <div class="bc-card bc-card-modern">
        <div class="bc-card-head">
          <div class="bc-icon">${headIcon}</div>
          <h2>${title}</h2>
          <p>Listening Test</p>
        </div>

        <div class="bc-card-body">
          <p class="bc-lead">${lead}</p>
          <div class="bc-pills">
            <div class="bc-pill bc-pill-blue"><b>${answered}</b><span>Answered</span></div>
            <div class="bc-pill bc-pill-red"><b>${unanswered}</b><span>Not answered</span></div>
          </div>
          <p class="bc-question">What would you like to do next?</p>
        </div>

        <div class="bc-options">
          <button id="bc-preview-btn" class="bc-option bc-option-blue" type="button">
            <span class="bc-option-icon">${eyeIcon}</span>
            <span class="bc-option-text"><strong>Preview Answers</strong><small>See your score and check every answer</small></span>
          </button>
          <button id="bc-timeup-start-btn" class="bc-option bc-option-red" type="button">
            <span class="bc-option-icon">${arrowIcon}</span>
            <span class="bc-option-text"><strong>Start Reading Test</strong><small>Submit now and move to the Reading test</small></span>
          </button>
        </div>

        <p class="bc-card-note-bottom">Your answers will be submitted when you continue. You cannot change them after this.</p>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  document.getElementById("bc-preview-btn").addEventListener("click", showPreviewResult);
  document.getElementById("bc-timeup-start-btn").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    const label = btn.querySelector("strong");
    if (label) label.textContent = "Submitting...";
    await submitTest();
  });
}

function normalizeAns(v) {
  return String(v).toLowerCase().trim();
}

// প্রতিটি প্রশ্নের full result list (correct + wrong + unanswered)
function buildResultList() {
  const list = [];
  const keys = Object.keys(officialAnswers).sort((a, b) => Number(a) - Number(b));
  keys.forEach((key) => {
    const userAns = (answerArrayUpdated[key] || []).filter((a) => String(a).trim() !== "");
    const realAns = [].concat(officialAnswers[key] || []).map((r) => String(r));
    const realNorm = realAns.map(normalizeAns);
    const isCorrect = userAns.some((a) => realNorm.includes(normalizeAns(a)));
    list.push({
      id: key,
      user: userAns.join(", "),
      correct: realAns.join(" / "),
      isCorrect,
      answered: userAns.length > 0,
      part: Math.ceil(Number(key) / 10)
    });
  });
  return list;
}

function showPreviewResult() {
  injectResultStyles();
  const timeUpModal = document.getElementById("bc-timeup-modal");
  if (timeUpModal) timeUpModal.remove();
  const old = document.getElementById("bc-result-screen");
  if (old) old.remove();

  inputCheckUpdated();
  const [score] = findDifferences(answerArrayUpdated, officialAnswers);
  const results = buildResultList();

  const total = TOTAL_QUESTIONS;
  const wrongTotal = total - score;
  const unanswered = results.filter((r) => !r.answered).length;
  const incorrect = Math.max(0, wrongTotal - unanswered);
  const percent = Math.round((score / total) * 100);
  const deg = Math.round((score / total) * 360);

  // Part-wise boxes
  let partsHtml = "";
  for (let p = 1; p <= 4; p++) {
    const items = results.filter((r) => r.part === p);
    const partTotal = items.length || 10;
    const partCorrect = items.filter((r) => r.isCorrect).length;
    const pct = Math.round((partCorrect / partTotal) * 100);
    partsHtml += `
      <div class="bc-part-box">
        <h4>Part ${p}</h4>
        <div class="bc-part-score">${partCorrect} <small>/ ${partTotal}</small></div>
        <div class="bc-bar"><div style="width:${pct}%"></div></div>
      </div>`;
  }

  // Review list grouped by part
  let reviewHtml = "";
  for (let p = 1; p <= 4; p++) {
    const items = results.filter((r) => r.part === p);
    if (!items.length) continue;
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
  }

  const username = (document.getElementById("userID") && document.getElementById("userID").textContent.trim()) || "";

  const html = `
    <div id="bc-result-screen" class="bc-result">
      <div class="bc-result-header">
        <h1>Listening Test &ndash; Score Report</h1>
        <p>${username ? "Candidate: " + escapeHtml(username) + " &nbsp;|&nbsp; " : ""}Preview of your answers (read-only)</p>
      </div>

      <div class="bc-result-wrap">
        <div class="bc-score-card">
          <div class="bc-ring" style="background: conic-gradient(#0a2a6e 0deg ${deg}deg, #f3c9c6 ${deg}deg 360deg);">
            <div class="bc-ring-inner">
              <div class="bc-ring-score">${score}</div>
              <div class="bc-ring-total">out of ${total}</div>
            </div>
          </div>
          <div class="bc-score-info">
            <h2>You answered ${score} out of ${total} questions correctly</h2>
            <p>Accuracy: ${percent}%</p>
            <div class="bc-stats">
              <div class="bc-stat bc-stat-ok"><b>${score}</b><span>Correct</span></div>
              <div class="bc-stat bc-stat-bad"><b>${incorrect}</b><span>Incorrect</span></div>
              <div class="bc-stat bc-stat-skip"><b>${unanswered}</b><span>Unanswered</span></div>
            </div>
          </div>
        </div>

        <div class="bc-parts">${partsHtml}</div>

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

      <div class="bc-result-footer">
        <p>Your answers are locked. Click below to submit your Listening test and continue to the Reading test.</p>
        <button id="bc-start-reading-btn" class="bc-btn bc-btn-red" type="button">Start Reading Test &rarr;</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  const root = document.getElementById("bc-result-screen");

  // Filter tabs
  root.querySelectorAll(".bc-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      root.querySelectorAll(".bc-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const f = tab.getAttribute("data-filter");
      root.querySelectorAll(".bc-review-item").forEach((it) => {
        const ok = it.getAttribute("data-ok") === "1";
        const show = f === "all" || (f === "correct" && ok) || (f === "wrong" && !ok);
        it.style.display = show ? "" : "none";
      });
      root.querySelectorAll(".bc-part-sec").forEach((sec) => {
        const any = Array.from(sec.querySelectorAll(".bc-review-item")).some((it) => it.style.display !== "none");
        sec.style.display = any ? "" : "none";
      });
    });
  });

  // Start Reading (submit + redirect)
  document.getElementById("bc-start-reading-btn").addEventListener("click", async (e) => {
    e.target.disabled = true;
    e.target.textContent = "Submitting...";
    await submitTest();
  });
}

// ==========================================
// 12. STARTUP
// ==========================================
window.addEventListener("DOMContentLoaded", async () => {
  const user = await userData();
  const userDiv = document.getElementById("userID");
  if (userDiv && user) {
    userDiv.textContent = user.username;
  }
  await ensureMockData();
});