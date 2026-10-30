// // ==========================================
// // 1. GLOBAL UI & POPUP SETTINGS
// // ==========================================
// const part1Margin = document.getElementById("part-margin-1") || document.getElementById("test-content");
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

// // ==========================================
// // 2. DATA RETRIEVER
// // ==========================================
// const dataRetriever = async function () {
//   try {
//     const currentQuery = window.location.search;
//     const res = await fetch("/api/pracDataListening" + currentQuery);
//     if (!res.ok) {
//       console.warn("Could not load from /api/pracDataListening, status:", res.status);
//       return null;
//     }
//     const result = await res.json();
//     return result;
//   } catch (err) {
//     console.error("Data Retriever Error:", err);
//     return null;
//   }
// };

// let data;
// let questionType;
// let questions = [];
// let instructions = [];
// let answers = {};
// let answerExplanations = {};



// // ==========================================
// // 3. MAIN RENDER FUNCTION
// // ==========================================
// async function main() {
//   data = await dataRetriever();
//   if (!data || !data.listening) {
//     console.error("No listening data found for this practice set!");
//     return;
//   }

//   questionType = data.type || "Listening Practice";
//   const partHeaderP = document.getElementById("part-header-p");
//   if (partHeaderP) partHeaderP.textContent = questionType;

//   questions = data.listening.questions || [];
//   instructions = data.listening.instructions || [];
//   answers = data.listening.answers || {};
//   answerExplanations = data.listening.answerExplanations || {};

//   // Audio player handler
//   let audioElement = document.getElementById("listening-practice-audio") || document.querySelector("audio");
//   if (!audioElement) {
//     audioElement = document.createElement("audio");
//     audioElement.id = "listening-practice-audio";
//     const targetArea = document.getElementById("test-content") || part1Margin || document.body;
//     targetArea.prepend(audioElement);
//   }

//   const audioSrc = data.listening.audioUrl || "";
//   if (audioSrc) {
//     audioElement.src = audioSrc;
//     audioElement.controls = true;
//     audioElement.style.cssText = "display: block; margin: 15px 0 25px 0; width: 100%; max-width: 550px;";
//     audioElement.load();
//   }

//   const seenGroups = new Set();
//   const groupCounts = new Map();

//   // Step 1: Create Group Containers
//   questions.forEach((q) => {
//     const grpKey = q.group || 1;
//     groupCounts.set(grpKey, (groupCounts.get(grpKey) || 0) + 1);

//     if (!seenGroups.has(grpKey)) {
//       const groupDiv = document.createElement("div");
//       groupDiv.classList.add(`group-${grpKey}`, "group-container", "mb-4");

//       const containers = [
//         "mcq-container-one-choice", "mcq-container-two-choice", "table-container",
//         "sentence-completion-container", "form-container", "note-container",
//         "flowchart-container", "short-answer-container", "matching-container",
//         "diagram-label-container", "full-note-completion-container", "matching-information-container"
//       ];

//       containers.forEach(cls => {
//         const div = document.createElement("div");
//         div.classList.add(cls);
//         groupDiv.appendChild(div);
//       });

//       if (part1Margin) part1Margin.appendChild(groupDiv);
//       seenGroups.add(grpKey);
//     }
//   });

//   // Step 2: Render questions by type
//   questions.forEach((q, index) => {
//     const grpKey = q.group || 1;
//     const groupDiv = document.querySelector(`.group-${grpKey}`);
//     if (!groupDiv) return;

//     // --- A. Note & Form Completion ---
//     if (q.type === "note-completion" || q.type === "form-completion" || q.type === "Note-Completion" || q.lines || q.bullets) {
//       function renderTextWithInput(text) {
//         return `<p class="note-line my-2" style="font-size: 16px; line-height: 1.8;">${text.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input form-control d-inline-block mx-1" style="width: 140px; display: inline-block;">`)}</p>`;
//       }

//       const fullNoteCompletionContainer = groupDiv.querySelector(".full-note-completion-container") || groupDiv.querySelector(".note-container") || groupDiv.querySelector(".form-container");
//       if (q.heading) {
//         fullNoteCompletionContainer.innerHTML += `<h3 class="note-completion-title fw-bold my-3">${q.heading}</h3>`;
//       }

//       if (q.subheadings && q.paragraphs) {
//         q.subheadings.forEach((subheading, sIdx) => {
//           fullNoteCompletionContainer.innerHTML += `<h5 class="note-completion-subheading fw-bold mt-3 mb-2 text-primary">${subheading}</h5>`;
//           if (q.paragraphs[sIdx]) {
//             q.paragraphs[sIdx].forEach((paragraph) => {
//               fullNoteCompletionContainer.innerHTML += renderTextWithInput(paragraph);
//             });
//           }
//         });
//       } else {
//         const lines = q.lines || (Array.isArray(q.paragraphs) ? (Array.isArray(q.paragraphs[0]) ? q.paragraphs[0] : q.paragraphs) : []) || q.bullets || [];
//         lines.forEach((line) => {
//           fullNoteCompletionContainer.innerHTML += renderTextWithInput(line);
//         });
//       }

//       const inputs = fullNoteCompletionContainer.querySelectorAll("input.blank-input");
//       inputs.forEach((input, idx) => {
//         if (q.id && q.id[idx]) {
//           input.setAttribute("placeholder", q.id[idx]);
//           input.setAttribute("data-question-id", q.id[idx]);
//         }
//       });
//     }

//     // --- B. Sentence Completion ---
//     if (q.type === "sentence-completion" || q.type === "Sentence-Completion") {
//       function renderTextWithInput(text) {
//         return `<p class="sentence-line my-2">${text.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input form-control d-inline-block mx-1" style="width: 140px; display: inline-block;">`)}</p>`;
//       }
//       const sentenceCompletionContainer = groupDiv.querySelector(".sentence-completion-container");
//       const listElem = document.createElement("ul");
//       listElem.className = "list-unstyled";
//       const sentenceList = q.sentences || q.questions || [];

//       sentenceList.forEach((sentence) => {
//         const liElem = document.createElement("li");
//         liElem.innerHTML = renderTextWithInput(sentence);
//         listElem.appendChild(liElem);
//       });

//       sentenceCompletionContainer.appendChild(listElem);
//       const inputs = sentenceCompletionContainer.querySelectorAll("input.blank-input");
//       inputs.forEach((input, idx) => {
//         if (q.id && q.id[idx]) {
//           input.setAttribute("placeholder", q.id[idx]);
//           input.setAttribute("data-question-id", q.id[idx]);
//         }
//       });
//     }

//     // --- C. Multiple Choice (Single Choice) ---
//     if (q.type === "mcq" || q.type === "mcq-one-choice" || q.type === "Multiple-Choice") {
//       const mcqContainerDiv = groupDiv.querySelector(".mcq-container-one-choice");
//       const qList = q.questions || (q.text ? [q.text] : []);
      
//       qList.forEach((questionText, qIdx) => {
//         const mcqBox = document.createElement("div");
//         mcqBox.className = "mcq mb-3";
//         const qId = (q.id && q.id[qIdx]) ? q.id[qIdx] : (index + 1);
//         mcqBox.innerHTML = `<p class="fw-bold mb-2"><strong>${qId}.</strong> ${questionText}</p>`;
        
//         const opts = (q.options && q.options[qIdx]) ? q.options[qIdx] : (q.options || []);
//         opts.forEach((option, oIdx) => {
//           mcqBox.innerHTML += `
//             <div class="form-check my-1">
//               <input class="form-check-input" type="radio" name="${qId}" id="opt-${qId}-${oIdx}" data-question-id="${qId}" value="${option}">
//               <label class="form-check-label ms-1" for="opt-${qId}-${oIdx}">${option}</label>
//             </div>`;
//         });
//         mcqContainerDiv.appendChild(mcqBox);
//       });
//     }

//     // --- D. Multiple Choice (Two Choices) - Full Width Responsive UI ---
//     if (q.type === "mcq-two-choice" || q.type === "mcq-two-choice-updated" || q.type === "MCQ-Two-Choice") {
//       const mcqTwoChoiceContainer = groupDiv.querySelector(".mcq-container-two-choice") || groupDiv;
//       const qList = q.questions || (q.text ? [[q.text]] : []);

//       qList.forEach((question, qIdx) => {
//         let id1, id2;
//         if (Array.isArray(q.id) && Array.isArray(q.id[qIdx])) {
//           id1 = q.id[qIdx][0];
//           id2 = q.id[qIdx][1];
//         } else if (Array.isArray(q.id) && q.id.length >= 2) {
//           id1 = q.id[qIdx * 2];
//           id2 = q.id[qIdx * 2 + 1];
//         } else {
//           id1 = 17 + (qIdx * 2);
//           id2 = 18 + (qIdx * 2);
//         }

//         const qText = Array.isArray(question) ? question[0] : question;
//         const letters = ["A", "B", "C", "D", "E", "F", "G"];
//         let optHtml = "";

//         const currentOptions = (q.options && q.options[qIdx]) ? q.options[qIdx] : [];

//         currentOptions.forEach((opt, oIdx) => {
//           const letter = letters[oIdx] || "";
//           const optId = `cb-${id1}-${id2}-${oIdx}`;
          
//           optHtml += `
//             <div class="two-choice-option-row d-flex align-items-center p-3 mb-2 border rounded-3 bg-white" style="cursor: pointer; transition: 0.2s; border: 1.5px solid #e2e8f0;">
//               <input class="form-check-input two-choice-cb m-0 me-3" type="checkbox" name="q-${id1}-${id2}" data-id1="${id1}" data-id2="${id2}" data-letter="${letter}" value="${opt}" id="${optId}" style="width: 22px; height: 22px; cursor: pointer;">
//               <label class="form-check-label w-100 m-0 d-flex align-items-center" for="${optId}" style="cursor: pointer; font-size: 16px; user-select: none;">
//                 <span class="badge bg-light text-dark border me-3 px-2 py-1 fw-bold fs-6">${letter}</span>
//                 <span class="opt-text">${opt}</span>
//               </label>
//             </div>`;
//         });

//         const qCard = document.createElement("div");
//         qCard.className = "card border shadow-sm rounded-4 p-4 mb-4 bg-white w-100";
//         qCard.style.cssText = "max-width: 900px; margin: 0 auto;";
//         qCard.id = `two-choice-wrapper-${id1}-${id2}`;
//         qCard.innerHTML = `
//           <div class="mb-3">
//             <h5 class="fw-bold text-dark d-flex align-items-start gap-2 mb-0">
//               <span class="badge bg-primary px-2 py-1 fs-6">${id1}-${id2}</span>
//               <span style="line-height: 1.5;">${qText}</span>
//             </h5>
//           </div>
//           <div class="options-wrapper d-flex flex-column gap-1">
//             ${optHtml}
//           </div>
//           <div class="evaluation-container mt-3"></div>
//         `;

//         mcqTwoChoiceContainer.appendChild(qCard);
//       });
//     }

//     // --- E. Table Completion ---
//     if (q.type === "table-completion") {
//       const tableContainer = groupDiv.querySelector(".table-container");
//       const table = document.createElement("table");
//       table.className = "table table-bordered table-striped mt-2 align-middle text-center";

//       if (q.headers && q.headers.length > 0) {
//         const thead = document.createElement("thead");
//         const tr = document.createElement("tr");
//         q.headers.forEach(h => {
//           const th = document.createElement("th");
//           th.textContent = h;
//           tr.appendChild(th);
//         });
//         thead.appendChild(tr);
//         table.appendChild(thead);
//       }

//       if (q.rows && q.rows.length > 0) {
//         const tbody = document.createElement("tbody");
//         q.rows.forEach(row => {
//           const tr = document.createElement("tr");
//           row.forEach(cell => {
//             const td = document.createElement("td");
//             td.innerHTML = cell.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input form-control d-inline-block mx-auto" style="width: 130px;">`);
//             tr.appendChild(td);
//           });
//           tbody.appendChild(tr);
//         });
//         table.appendChild(tbody);
//       }

//       tableContainer.appendChild(table);
//       const inputs = tableContainer.querySelectorAll("input.blank-input");
//       inputs.forEach((input, idx) => {
//         if (q.id && q.id[idx]) {
//           input.setAttribute("placeholder", q.id[idx]);
//           input.setAttribute("data-question-id", q.id[idx]);
//         }
//       });
//     }

//     // --- F. Matching / Feature Matching (Drag and Drop UI) ---
//     if (q.type === "matching" || q.type === "feature-matching" || q.type === "Matching") {
//       const matchingContainer = groupDiv.querySelector(".matching-container");
//       if (matchingContainer) {
//         matchingContainer.innerHTML = "";

//         const wrapper = document.createElement("div");
//         wrapper.className = "matching-drag-drop-wrapper my-3";

//         // Option chips (Draggable items)
//         const optBox = document.createElement("div");
//         optBox.className = "matching-options-box p-3 border rounded mb-4 bg-light d-flex flex-wrap gap-2";
        
//         const optionsList = q.options || [];
//         optionsList.forEach((opt) => {
//           const itemDiv = document.createElement("div");
//           itemDiv.className = "box btn btn-outline-primary fw-bold text-start";
//           itemDiv.setAttribute("draggable", "true");
//           itemDiv.setAttribute("data-class", "matching-drag");
//           itemDiv.setAttribute("data-item", opt.trim());
//           itemDiv.textContent = opt.trim();
//           optBox.appendChild(itemDiv);
//         });
//         wrapper.appendChild(optBox);

//         // Questions list (Dropzones)
//         const qList = q.items || q.features || q.statements || q.questions || [];
//         const questionsListDiv = document.createElement("div");
//         questionsListDiv.className = "matching-questions-list";

//         qList.forEach((item, idx) => {
//           const qId = (q.id && q.id[idx]) ? q.id[idx] : (index + 1 + idx);
//           const qRow = document.createElement("div");
//           qRow.className = "matching-row d-flex align-items-center justify-content-between p-2 mb-2 border rounded bg-white shadow-sm";
          
//           qRow.innerHTML = `
//             <div class="question-text fw-bold">
//               <span class="text-primary me-2">${qId}.</span> ${item}
//             </div>
//             <div id="${qId}" data-question-id="${qId}" data-class="matching-drag" data-item="" data-initial="empty" class="box dropzone p-2 border border-2 border-dashed rounded text-center text-muted" style="min-width: 240px; min-height: 42px; background: #fafafa; display: flex; align-items: center; justify-content: center;">
//               Drop answer here
//             </div>
//           `;
//           questionsListDiv.appendChild(qRow);
//         });

//         wrapper.appendChild(questionsListDiv);
//         matchingContainer.appendChild(wrapper);
//       }
//     }
//   });

//   // Step 3: Insert Headers & Instructions
//   let gIndex = 0;
//   groupCounts.forEach((val, grp) => {
//     const groupDiv = document.querySelector(`.group-${grp}`);
//     if (!groupDiv) return;

//     const groupHeader = document.createElement("div");
//     groupHeader.classList.add("group-header", "mb-3", "p-3", "bg-light", "rounded", "border");

//     if (instructions[gIndex] && instructions[gIndex].instruction) {
//       const instructionDiv = document.createElement("div");
//       instructionDiv.classList.add("instructions", "mb-1");
//       instructionDiv.innerHTML = `<h5 class="fw-bold text-dark mb-0">${instructions[gIndex].instruction}</h5>`;
//       groupHeader.appendChild(instructionDiv);
//     }

//     if (questions[gIndex] && questions[gIndex].id) {
//       const min = findLowest(questions[gIndex].id);
//       const max = findHighest(questions[gIndex].id);
//       const groupRangeHeader = document.createElement("h6");
//       groupRangeHeader.className = "text-primary fw-bold";
//       groupRangeHeader.textContent = `Questions ${min} - ${max}`;
//       groupHeader.prepend(groupRangeHeader);
//     }

//     gIndex++;
//     groupDiv.prepend(groupHeader);
//   });

//   // Two-choice Checkbox limiter
//   document.querySelectorAll(".two-choice-cb").forEach(cb => {
//     cb.addEventListener("change", function () {
//       const parent = this.closest(".options-wrapper");
//       const checkedCount = parent.querySelectorAll("input:checked").length;
//       if (checkedCount > 2) {
//         this.checked = false;
//       }
//     });
//   });

//   // Bind submit & answers
//   wireSubmission();
//   attachAnswerListeners();
// }

// function findLowest(arr) {
//   const flat = arr.flat();
//   return Math.min(...flat);
// }

// function findHighest(arr) {
//   const flat = arr.flat();
//   return Math.max(...flat);
// }

// function showScore(score, total) {
//   const scoreDiv = document.getElementById("user-score");
//   const totalDiv = document.getElementById("total-questions");
//   if (scoreDiv) scoreDiv.textContent = score;
//   if (totalDiv) totalDiv.textContent = total;
//   const scoreContainer = document.getElementById("score-container");
//   if (scoreContainer) scoreContainer.style.display = "block";
// }

// // ==========================================
// // 4. SUBMIT HANDLER
// // ==========================================
// function wireSubmission() {
//   const submitBtn = document.getElementById("finishBtn");
//   const submitModal = document.getElementById("submit-warning-modal");
//   const submitOkButton = document.getElementById("submit-ok-btn");
//   const submitStayButton = document.getElementById("submit-stay-btn");

//   if (submitBtn && submitModal) {
//     submitBtn.onclick = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       submitModal.style.display = "flex";
//       return false;
//     };
//   }

//   if (submitStayButton && submitModal) {
//     submitStayButton.onclick = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       submitModal.style.display = "none";
//       return false;
//     };
//   }

//   if (submitOkButton) {
//     submitOkButton.onclick = (e) => {
//       e.preventDefault();
//       e.stopPropagation();

//       if (submitModal) submitModal.style.display = "none";

//       renderCorrectAnswers();
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       console.log("Listening practice submitted & reviewed successfully.");
//       return false;
//     };
//   }
// }

// // ==========================================
// // 5. ANSWER CHECKING & REVIEW VIEW
// // ==========================================
// function renderCorrectAnswers() {
//   const createExplanationBox = (qid) => {
//     const idKey = String(qid);
//     if (answerExplanations && answerExplanations[idKey]) {
//       const expDiv = document.createElement("div");
//       expDiv.className = `explanation-card exp-card-${idKey} mt-2 p-3 rounded-3 shadow-sm`;
//       expDiv.style.cssText = `
//         background-color: #f0fdf4;
//         border-left: 5px solid #16a34a;
//         font-size: 0.95rem;
//         color: #166534;
//         line-height: 1.6;
//       `;

//       const raw = answerExplanations[idKey];
//       const text = Array.isArray(raw) ? raw[0] : raw;

//       expDiv.innerHTML = `
//         <div class="fw-bold mb-1 d-flex align-items-center gap-1">
//           <span>💡</span> <span>Explanation (Q${idKey}):</span>
//         </div>
//         <div style="color: #374151;">${text}</div>
//       `;
//       return expDiv;
//     }
//     return null;
//   };

//   let score = 0;
//   const totalQuestions = Object.keys(answers).length;

//   const appendExpOnce = (parent, qid) => {
//     if (!parent) return;
//     const idKey = String(qid);
//     if (!parent.querySelector(`.exp-card-${idKey}`)) {
//       const box = createExplanationBox(idKey);
//       if (box) parent.appendChild(box);
//     }
//   };

//   // 1. Text Inputs (Note, Form, Sentence, Table blanks)
//   document.querySelectorAll("input.blank-input").forEach((input) => {
//     const qid = String(input.getAttribute("data-question-id") || input.getAttribute("placeholder") || "");
//     if (!qid || !answers[qid]) return;

//     const userVal = input.value.trim().toLowerCase();
//     const correctList = answers[qid].map(v => String(v).trim().toLowerCase());
//     const isCorrect = correctList.includes(userVal);

//     if (isCorrect) {
//       score++;
//       input.style.borderColor = "#16a34a";
//       input.style.backgroundColor = "#dcfce7";
//       input.style.color = "#166534";
//       input.style.fontWeight = "bold";
//     } else {
//       input.style.borderColor = "#dc2626";
//       input.style.backgroundColor = "#fee2e2";
//       input.style.color = "#991b1b";
//       input.style.fontWeight = "bold";
//     }

//     const parentElem = input.closest("p") || input.closest("li") || input.parentElement;
//     if (parentElem && !parentElem.querySelector(`.badge-ans-${qid}`)) {
//       const ansBadge = document.createElement("span");
//       ansBadge.className = `badge ${isCorrect ? "bg-success" : "bg-danger"} ms-2 badge-ans-${qid}`;
//       ansBadge.style.fontSize = "0.88rem";
//       ansBadge.textContent = `[Ans: ${answers[qid][0]}]`;
//       input.after(ansBadge);
//       appendExpOnce(parentElem, qid);
//     }
//     input.disabled = true;
//   });

//   // 2. MCQ Single Choice (Radios)
//   Object.keys(answers).forEach((qid) => {
//     const idKey = String(qid);
//     const correctChoices = answers[idKey].map(v => String(v).trim().toLowerCase());
//     const inputs = document.querySelectorAll(`input[type="radio"][name="${idKey}"], input[type="radio"][data-question-id="${idKey}"]`);
//     if (!inputs || inputs.length === 0) return;

//     let pointAwarded = false;
//     let questionWrapper = null;

//     inputs.forEach((input) => {
//       const val = input.value.trim().toLowerCase();
//       const isCorrect = correctChoices.includes(val);
//       const isChecked = input.checked;

//       if (isChecked && isCorrect && !pointAwarded) {
//         score++;
//         pointAwarded = true;
//       }

//       const container = input.closest(".form-check") || input.parentElement;
//       if (!questionWrapper) questionWrapper = input.closest(".mcq") || container.parentElement;

//       if (isCorrect && container) {
//         container.style.color = "#16a34a";
//         container.style.fontWeight = "bold";
//       } else if (isChecked && !isCorrect && container) {
//         container.style.color = "#dc2626";
//         container.style.fontWeight = "bold";
//       }
//       input.disabled = true;
//     });

//     if (questionWrapper && !questionWrapper.querySelector(`.badge-ans-${idKey}`)) {
//       const resultDiv = document.createElement("div");
//       resultDiv.className = `mt-2 badge-ans-${idKey}`;
//       resultDiv.innerHTML = `
//         <span class="badge ${pointAwarded ? "bg-success" : "bg-danger"}" style="font-size: 0.88rem;">
//           ${pointAwarded ? "✓ Correct" : "✗ Incorrect"} (Official Ans: ${answers[idKey][0]})
//         </span>`;
//       questionWrapper.appendChild(resultDiv);
//       appendExpOnce(questionWrapper, idKey);
//     }
//   });

//   // 3. Two-Choice Checkboxes Grading & Explanations
//   const evaluatedPairs = new Set();
//   document.querySelectorAll(".two-choice-cb").forEach((cb) => {
//     const id1 = cb.getAttribute("data-id1");
//     const id2 = cb.getAttribute("data-id2");
//     if (!id1 || !id2) return;

//     const pairKey = `${id1}-${id2}`;
//     if (evaluatedPairs.has(pairKey)) return;
//     evaluatedPairs.add(pairKey);

//     const pairWrapper = document.getElementById(`two-choice-wrapper-${id1}-${id2}`) || cb.closest(".card");
//     if (!pairWrapper) return;

//     const expectedAns1 = (answers[String(id1)] || []).map(v => String(v).trim().toLowerCase());
//     const expectedAns2 = (answers[String(id2)] || []).map(v => String(v).trim().toLowerCase());
//     const allExpected = [...expectedAns1, ...expectedAns2];

//     const allCheckboxes = pairWrapper.querySelectorAll(`.two-choice-cb`);
//     let pairScore = 0;

//     allCheckboxes.forEach((input) => {
//       const parentRow = input.closest(".two-choice-option-row") || input.parentElement;
//       const letter = (input.getAttribute("data-letter") || "").trim().toLowerCase();
//       const val = (input.value || "").trim().toLowerCase();

//       const isCorrectOption = allExpected.some(ans => 
//         ans === letter || 
//         ans === val || 
//         ans.startsWith(letter + ".") || 
//         ans.startsWith(letter + " ") ||
//         val.startsWith(ans)
//       );

//       if (isCorrectOption && parentRow) {
//         parentRow.style.borderColor = "#16a34a";
//         parentRow.style.backgroundColor = "#dcfce7";
//         parentRow.style.fontWeight = "bold";
//       }

//       if (input.checked) {
//         if (isCorrectOption) {
//           pairScore++;
//         } else if (parentRow) {
//           parentRow.style.borderColor = "#dc2626";
//           parentRow.style.backgroundColor = "#fee2e2";
//           parentRow.style.fontWeight = "bold";
//         }
//       }
//       input.disabled = true;
//     });

//     score += pairScore;

//     const evalContainer = pairWrapper.querySelector(".evaluation-container");
//     if (evalContainer) {
//       evalContainer.innerHTML = `
//         <div class="d-flex align-items-center gap-2 mb-2">
//           <span class="badge ${pairScore === 2 ? 'bg-success' : pairScore === 1 ? 'bg-warning text-dark' : 'bg-danger'}" style="font-size: 0.95rem;">
//             Score: ${pairScore} / 2
//           </span>
//           <span class="text-muted fw-bold">Official Ans: Q${id1}: ${answers[String(id1)] ? answers[String(id1)][0] : ''} | Q${id2}: ${answers[String(id2)] ? answers[String(id2)][0] : ''}</span>
//         </div>
//       `;

//       [id1, id2].forEach(qid => {
//         appendExpOnce(evalContainer, qid);
//       });
//     }
//   });

//   // 4. Drag and Drop Matching
//   document.querySelectorAll(".dropzone").forEach((zone) => {
//     const qid = String(zone.getAttribute("data-question-id") || zone.id || "");
//     if (!qid || !answers[qid]) return;

//     const userItem = (zone.getAttribute("data-item") || "").trim().toLowerCase();
//     const correctList = answers[qid].map(v => String(v).trim().toLowerCase());
    
//     const isCorrect = correctList.some(ans => userItem === ans || userItem.startsWith(ans + ".") || userItem.startsWith(ans + " "));

//     if (isCorrect) {
//       score++;
//       zone.style.borderColor = "#16a34a";
//       zone.style.backgroundColor = "#dcfce7";
//       zone.style.color = "#166534";
//       zone.style.fontWeight = "bold";
//     } else {
//       zone.style.borderColor = "#dc2626";
//       zone.style.backgroundColor = "#fee2e2";
//       zone.style.color = "#991b1b";
//       zone.style.fontWeight = "bold";
//     }

//     const parentElem = zone.closest(".matching-row") || zone.parentElement;
//     if (parentElem && !parentElem.querySelector(`.badge-ans-${qid}`)) {
//       const ansBadge = document.createElement("div");
//       ansBadge.className = `badge-ans-${qid} mt-1`;
//       ansBadge.innerHTML = `
//         <span class="badge ${isCorrect ? "bg-success" : "bg-danger"}" style="font-size: 0.88rem;">
//           ${isCorrect ? "✓ Correct" : "✗ Incorrect"} [Ans: ${answers[qid][0]}]
//         </span>
//       `;
//       parentElem.appendChild(ansBadge);
//       appendExpOnce(parentElem, qid);
//     }
//     zone.setAttribute("draggable", "false");
//   });

//   // Retry Button Replacement
//   const finishBtn = document.getElementById("finishBtn");
//   if (finishBtn) {
//     const retryBtn = document.createElement("button");
//     retryBtn.innerHTML = "🔄 Retry Practice";
//     retryBtn.className = "btn btn-outline-dark btn-sm fw-bold px-3 py-2";
//     retryBtn.onclick = (e) => {
//       e.preventDefault();
//       window.location.reload();
//     };
//     finishBtn.parentNode.replaceChild(retryBtn, finishBtn);
//   }

//   showScore(score, totalQuestions);
// }

// // ==========================================
// // 6. QUESTION NAVIGATION & EVENT LISTENERS
// // ==========================================
// function isQuestionAnswered(qid) {
//   const textInput = document.querySelector(`input[data-question-id="${qid}"], input[placeholder="${qid}"]`);
//   if (textInput && textInput.value.trim() !== "") return true;

//   const radioInputs = document.querySelectorAll(`input[name="${qid}"]`);
//   for (const el of radioInputs) {
//     if ((el.type === "radio" || el.type === "checkbox") && el.checked) return true;
//   }

//   const dropzone = document.querySelector(`.dropzone[data-question-id="${qid}"]`);
//   if (dropzone && dropzone.getAttribute("data-item") && dropzone.getAttribute("data-item") !== "") return true;

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

// function attachAnswerListeners() {
//   document.querySelectorAll('input[type="text"]').forEach((inp) => {
//     inp.addEventListener("input", () => {
//       const qid = inp.getAttribute("data-question-id") || inp.getAttribute("placeholder");
//       if (qid) updateQNavState(String(qid));
//     });
//   });

//   document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((inp) => {
//     inp.addEventListener("change", () => {
//       const name = inp.name;
//       if (name) updateQNavState(name);
//     });
//   });
// }

// // ==========================================
// // 7. DRAG AND DROP ENGINE
// // ==========================================
// var dragElement = null;

// function handleDragStart(e) {
//   this.style.opacity = "0.4";
//   dragElement = this;
//   e.dataTransfer.effectAllowed = "move";
//   e.dataTransfer.setData("item", this.innerHTML);
// }

// function handleDragOver(e) {
//   if (e.preventDefault) e.preventDefault();
//   e.dataTransfer.dropEffect = "move";
//   return false;
// }

// function handleDragEnter() {
//   this.classList.add("dragover");
// }

// function handleDragLeave() {
//   this.classList.remove("dragover");
// }

// function handleDrop(e) {
//   if (e.stopPropagation) e.stopPropagation();

//   if (dragElement !== this) {
//     const draggedGroup = dragElement.getAttribute("data-class");
//     const targetGroup = this.getAttribute("data-class");

//     if (draggedGroup !== targetGroup) {
//       this.classList.add("invalid-drop");
//       setTimeout(() => this.classList.remove("invalid-drop"), 1000);
//       return false;
//     } else {
//       const draggedHTML = dragElement.innerHTML;
//       const draggedItem = dragElement.getAttribute("data-item");

//       const targetHTML = this.innerHTML;
//       const targetItem = this.getAttribute("data-item");

//       dragElement.innerHTML = targetHTML;
//       dragElement.setAttribute("data-item", targetItem || "");

//       this.innerHTML = draggedHTML;
//       this.setAttribute("data-item", draggedItem || "");

//       addDragEvents(dragElement);
//       addDragEvents(this);

//       const qid = this.getAttribute("data-question-id");
//       if (qid) updateQNavState(qid);
//     }
//   }
// }

// function handleDragEnd() {
//   this.style.opacity = "1";
//   document.querySelectorAll(".box").forEach((el) => el.classList.remove("dragover"));
// }

// function addDragEvents(element) {
//   if (!element) return;
//   const hasContent = element.textContent.trim() !== "";
//   element.setAttribute("draggable", hasContent);

//   element.addEventListener("dragenter", handleDragEnter);
//   element.addEventListener("dragover", handleDragOver);
//   element.addEventListener("dragleave", handleDragLeave);
//   element.addEventListener("drop", handleDrop);
//   element.addEventListener("dragend", handleDragEnd);

//   if (hasContent) {
//     element.addEventListener("dragstart", handleDragStart);
//   }
// }

// // ==========================================
// // 8. INITIALIZE APPLICATION
// // ==========================================
// async function initializeApp() {
//   await main();

//   // Bind drag events to all rendered boxes
//   const items = document.querySelectorAll(".box");
//   items.forEach((item) => addDragEvents(item));

//   document.querySelectorAll(".qnav-btn").forEach((b) => {
//     const qid = b.getAttribute("data-qid");
//     if (qid) updateQNavState(qid);
//   });

//   const backBtn = document.getElementById("backBtn");
//   if (backBtn) {
//     backBtn.onclick = (e) => {
//       e.preventDefault();
//       window.history.back();
//     };
//   }

//   const fontSizeSelector = document.getElementById("font-size-selector");
//   const testContent = document.getElementById("test-content");
//   if (fontSizeSelector && testContent) {
//     fontSizeSelector.addEventListener("change", function () {
//       testContent.style.fontSize = this.value;
//     });
//   }

//   console.log("Listening Practice Script fully initialized.");
// }

// document.addEventListener("DOMContentLoaded", initializeApp);

/// ==========================================
// 1. GLOBAL UI & POPUP SETTINGS
// ==========================================
const part1Margin = document.getElementById("part-margin-1") || document.getElementById("test-content");
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

// ==========================================
// 2. DATA RETRIEVER
// ==========================================
const dataRetriever = async function () {
  try {
    const currentQuery = window.location.search;
    const res = await fetch("/api/pracDataListening" + currentQuery);
    if (!res.ok) {
      console.warn("Could not load from /api/pracDataListening, status:", res.status);
      return null;
    }
    const result = await res.json();
    return result;
  } catch (err) {
    console.error("Data Retriever Error:", err);
    return null;
  }
};

let data;
let questionType;
let questions = [];
let instructions = [];
let answers = {};
let answerExplanations = {};

// ==========================================
// 3. MAIN RENDER FUNCTION
// ==========================================
async function main() {
  data = await dataRetriever();
  if (!data || !data.listening) {
    console.error("No listening data found for this practice set!");
    return;
  }

  questionType = data.type || "Listening Practice";
  const partHeaderP = document.getElementById("part-header-p");
  if (partHeaderP) partHeaderP.textContent = questionType;

  questions = data.listening.questions || [];
  instructions = data.listening.instructions || [];
  answers = data.listening.answers || {};
  answerExplanations = data.listening.answerExplanations || {};

  // Audio player handler with multi-stage fallback
  let audioElement = document.getElementById("listening-practice-audio") || document.querySelector("audio");
  if (!audioElement) {
    audioElement = document.createElement("audio");
    audioElement.id = "listening-practice-audio";
    const targetArea = document.getElementById("test-content") || part1Margin || document.body;
    targetArea.prepend(audioElement);
  }

  let rawAudioSrc =
    (data.listening && (data.listening.audioUrl || data.listening.audio)) ||
    data.audioUrl ||
    data.audio ||
    "";

  if (typeof rawAudioSrc === "string" && rawAudioSrc.includes("](")) {
    rawAudioSrc = rawAudioSrc.split("](")[0].trim();
  }
  rawAudioSrc = (rawAudioSrc || "").trim();

  const searchParams = new URLSearchParams(window.location.search);
  const currentPracNumber = searchParams.get("pracNumber") || data.pracNumber || "Practice-1";
  const currentType = searchParams.get("type") || data.type || "Map Labelling";

  let audioPlaylist = [];
  if (rawAudioSrc) {
    if (rawAudioSrc.startsWith("http://") || rawAudioSrc.startsWith("https://")) {
      audioPlaylist.push(rawAudioSrc);
      audioPlaylist.push(`/api/cambridge-proxy-audio?url=${encodeURIComponent(rawAudioSrc)}`);
    } else {
      audioPlaylist.push(rawAudioSrc);
    }
  }

  // Local candidate fallbacks
  audioPlaylist.push(
    `/audio/${currentPracNumber}.mp3`,
    `/audio/${currentType}-${currentPracNumber}.mp3`,
    `/audios/${currentPracNumber}.mp3`,
    `/audio/listening/${currentPracNumber}.mp3`
  );

  let currentAudioIndex = 0;
  audioElement.controls = true;
  audioElement.style.cssText = "display: block; margin: 15px auto 25px auto; width: 100%; max-width: 650px;";

  function loadNextAudio() {
    if (currentAudioIndex < audioPlaylist.length) {
      audioElement.src = audioPlaylist[currentAudioIndex++];
      audioElement.load();
    } else {
      console.warn("All audio sources failed to load.");
    }
  }

  audioElement.onerror = () => {
    loadNextAudio();
  };

  loadNextAudio();

  const seenGroups = new Set();
  const groupCounts = new Map();

  // Step 1: Create Group Containers
  questions.forEach((q) => {
    const grpKey = q.group || 1;
    groupCounts.set(grpKey, (groupCounts.get(grpKey) || 0) + 1);

    if (!seenGroups.has(grpKey)) {
      const groupDiv = document.createElement("div");
      groupDiv.classList.add(`group-${grpKey}`, "group-container", "mb-4");

      const containers = [
        "mcq-container-one-choice", "mcq-container-two-choice", "table-container",
        "sentence-completion-container", "form-container", "note-container",
        "flowchart-container", "short-answer-container", "matching-container",
        "diagram-label-container", "full-note-completion-container", "matching-information-container"
      ];

      containers.forEach(cls => {
        const div = document.createElement("div");
        div.classList.add(cls);
        groupDiv.appendChild(div);
      });

      if (part1Margin) part1Margin.appendChild(groupDiv);
      seenGroups.add(grpKey);
    }
  });

  // Step 2: Render questions by type
  questions.forEach((q, index) => {
    const grpKey = q.group || 1;
    const groupDiv = document.querySelector(`.group-${grpKey}`);
    if (!groupDiv) return;

    const qType = String(q.type || "").trim().toLowerCase();

    // --- A. Note & Form Completion ---
    if (qType === "note-completion" || qType === "form-completion" || q.lines || q.bullets) {
      function renderTextWithInput(text) {
        return `<p class="note-line my-2" style="font-size: 16px; line-height: 1.8;">${text.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input form-control d-inline-block mx-1" style="width: 140px; display: inline-block;">`)}</p>`;
      }

      const fullNoteCompletionContainer = groupDiv.querySelector(".full-note-completion-container") || groupDiv.querySelector(".note-container") || groupDiv.querySelector(".form-container");
      if (q.heading) {
        fullNoteCompletionContainer.innerHTML += `<h3 class="note-completion-title fw-bold my-3">${q.heading}</h3>`;
      }

      if (q.subheadings && q.paragraphs) {
        q.subheadings.forEach((subheading, sIdx) => {
          fullNoteCompletionContainer.innerHTML += `<h5 class="note-completion-subheading fw-bold mt-3 mb-2 text-primary">${subheading}</h5>`;
          if (q.paragraphs[sIdx]) {
            q.paragraphs[sIdx].forEach((paragraph) => {
              fullNoteCompletionContainer.innerHTML += renderTextWithInput(paragraph);
            });
          }
        });
      } else {
        const lines = q.lines || (Array.isArray(q.paragraphs) ? (Array.isArray(q.paragraphs[0]) ? q.paragraphs[0] : q.paragraphs) : []) || q.bullets || [];
        lines.forEach((line) => {
          fullNoteCompletionContainer.innerHTML += renderTextWithInput(line);
        });
      }

      const inputs = fullNoteCompletionContainer.querySelectorAll("input.blank-input");
      inputs.forEach((input, idx) => {
        if (q.id && q.id[idx]) {
          input.setAttribute("placeholder", q.id[idx]);
          input.setAttribute("data-question-id", q.id[idx]);
        }
      });
    }

    // --- B. Sentence Completion ---
    if (qType === "sentence-completion") {
      function renderTextWithInput(text) {
        return `<p class="sentence-line my-2">${text.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input form-control d-inline-block mx-1" style="width: 140px; display: inline-block;">`)}</p>`;
      }
      const sentenceCompletionContainer = groupDiv.querySelector(".sentence-completion-container");
      const listElem = document.createElement("ul");
      listElem.className = "list-unstyled";
      const sentenceList = q.sentences || q.questions || [];

      sentenceList.forEach((sentence) => {
        const liElem = document.createElement("li");
        liElem.innerHTML = renderTextWithInput(sentence);
        listElem.appendChild(liElem);
      });

      sentenceCompletionContainer.appendChild(listElem);
      const inputs = sentenceCompletionContainer.querySelectorAll("input.blank-input");
      inputs.forEach((input, idx) => {
        if (q.id && q.id[idx]) {
          input.setAttribute("placeholder", q.id[idx]);
          input.setAttribute("data-question-id", q.id[idx]);
        }
      });
    }

    // --- C. Multiple Choice (Single Choice) ---
    if (qType === "mcq" || qType === "mcq-one-choice" || qType === "multiple-choice") {
      const mcqContainerDiv = groupDiv.querySelector(".mcq-container-one-choice");
      const qList = q.questions || (q.text ? [q.text] : []);
      
      qList.forEach((questionText, qIdx) => {
        const mcqBox = document.createElement("div");
        mcqBox.className = "mcq mb-3";
        const qId = (q.id && q.id[qIdx]) ? q.id[qIdx] : (index + 1);
        mcqBox.innerHTML = `<p class="fw-bold mb-2"><strong>${qId}.</strong> ${questionText}</p>`;
        
        const opts = (q.options && q.options[qIdx]) ? q.options[qIdx] : (q.options || []);
        opts.forEach((option, oIdx) => {
          mcqBox.innerHTML += `
            <div class="form-check my-1">
              <input class="form-check-input" type="radio" name="${qId}" id="opt-${qId}-${oIdx}" data-question-id="${qId}" value="${option}">
              <label class="form-check-label ms-1" for="opt-${qId}-${oIdx}">${option}</label>
            </div>`;
        });
        mcqContainerDiv.appendChild(mcqBox);
      });
    }

    // --- D. Multiple Choice (Two Choices) ---
    if (qType === "mcq-two-choice" || qType === "mcq-two-choice-updated") {
      const mcqTwoChoiceContainer = groupDiv.querySelector(".mcq-container-two-choice") || groupDiv;
      const qList = q.questions || (q.text ? [[q.text]] : []);

      qList.forEach((question, qIdx) => {
        let id1, id2;
        if (Array.isArray(q.id) && Array.isArray(q.id[qIdx])) {
          id1 = q.id[qIdx][0];
          id2 = q.id[qIdx][1];
        } else if (Array.isArray(q.id) && q.id.length >= 2) {
          id1 = q.id[qIdx * 2];
          id2 = q.id[qIdx * 2 + 1];
        } else {
          id1 = 17 + (qIdx * 2);
          id2 = 18 + (qIdx * 2);
        }

        const qText = Array.isArray(question) ? question[0] : question;
        const letters = ["A", "B", "C", "D", "E", "F", "G"];
        let optHtml = "";

        const currentOptions = (q.options && q.options[qIdx]) ? q.options[qIdx] : [];

        currentOptions.forEach((opt, oIdx) => {
          const letter = letters[oIdx] || "";
          const optId = `cb-${id1}-${id2}-${oIdx}`;
          
          optHtml += `
            <div class="two-choice-option-row d-flex align-items-center p-3 mb-2 border rounded-3 bg-white" style="cursor: pointer; transition: 0.2s; border: 1.5px solid #e2e8f0;">
              <input class="form-check-input two-choice-cb m-0 me-3" type="checkbox" name="q-${id1}-${id2}" data-id1="${id1}" data-id2="${id2}" data-letter="${letter}" value="${opt}" id="${optId}" style="width: 22px; height: 22px; cursor: pointer;">
              <label class="form-check-label w-100 m-0 d-flex align-items-center" for="${optId}" style="cursor: pointer; font-size: 16px; user-select: none;">
                <span class="badge bg-light text-dark border me-3 px-2 py-1 fw-bold fs-6">${letter}</span>
                <span class="opt-text">${opt}</span>
              </label>
            </div>`;
        });

        const qCard = document.createElement("div");
        qCard.className = "card border shadow-sm rounded-4 p-4 mb-4 bg-white w-100";
        qCard.style.cssText = "max-width: 900px; margin: 0 auto;";
        qCard.id = `two-choice-wrapper-${id1}-${id2}`;
        qCard.innerHTML = `
          <div class="mb-3">
            <h5 class="fw-bold text-dark d-flex align-items-start gap-2 mb-0">
              <span class="badge bg-primary px-2 py-1 fs-6">${id1}-${id2}</span>
              <span style="line-height: 1.5;">${qText}</span>
            </h5>
          </div>
          <div class="options-wrapper d-flex flex-column gap-1">
            ${optHtml}
          </div>
          <div class="evaluation-container mt-3"></div>
        `;

        mcqTwoChoiceContainer.appendChild(qCard);
      });
    }

    // --- E. Table Completion ---
    if (qType === "table-completion") {
      const tableContainer = groupDiv.querySelector(".table-container");
      const table = document.createElement("table");
      table.className = "table table-bordered table-striped mt-2 align-middle text-center";

      if (q.headers && q.headers.length > 0) {
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");
        q.headers.forEach(h => {
          const th = document.createElement("th");
          th.textContent = h;
          tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
      }

      if (q.rows && q.rows.length > 0) {
        const tbody = document.createElement("tbody");
        q.rows.forEach(row => {
          const tr = document.createElement("tr");
          row.forEach(cell => {
            const td = document.createElement("td");
            td.innerHTML = cell.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input form-control d-inline-block mx-auto" style="width: 130px;">`);
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
      }

      tableContainer.appendChild(table);
      const inputs = tableContainer.querySelectorAll("input.blank-input");
      inputs.forEach((input, idx) => {
        if (q.id && q.id[idx]) {
          input.setAttribute("placeholder", q.id[idx]);
          input.setAttribute("data-question-id", q.id[idx]);
        }
      });
    }

    // --- F. Matching / Feature Matching (Drag and Drop UI) ---
    if (qType === "matching" || qType === "feature-matching") {
      const matchingContainer = groupDiv.querySelector(".matching-container");
      if (matchingContainer) {
        matchingContainer.innerHTML = "";

        const wrapper = document.createElement("div");
        wrapper.className = "matching-drag-drop-wrapper my-3";

        const optBox = document.createElement("div");
        optBox.className = "matching-options-box p-3 border rounded mb-4 bg-light d-flex flex-wrap gap-2";
        
        const optionsList = q.options || [];
        optionsList.forEach((opt) => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "box btn btn-outline-primary fw-bold text-start";
          itemDiv.setAttribute("draggable", "true");
          itemDiv.setAttribute("data-class", "matching-drag");
          itemDiv.setAttribute("data-item", opt.trim());
          itemDiv.textContent = opt.trim();
          optBox.appendChild(itemDiv);
        });
        wrapper.appendChild(optBox);

        const qList = q.items || q.features || q.statements || q.questions || [];
        const questionsListDiv = document.createElement("div");
        questionsListDiv.className = "matching-questions-list";

        qList.forEach((item, idx) => {
          const qId = (q.id && q.id[idx]) ? q.id[idx] : (index + 1 + idx);
          const qRow = document.createElement("div");
          qRow.className = "matching-row d-flex align-items-center justify-content-between p-2 mb-2 border rounded bg-white shadow-sm";
          
          qRow.innerHTML = `
            <div class="question-text fw-bold">
              <span class="text-primary me-2">${qId}.</span> ${item}
            </div>
            <div id="${qId}" data-question-id="${qId}" data-class="matching-drag" data-item="" data-initial="empty" class="box dropzone p-2 border border-2 border-dashed rounded text-center text-muted" style="min-width: 240px; min-height: 42px; background: #fafafa; display: flex; align-items: center; justify-content: center;">
              Drop answer here
            </div>
          `;
          questionsListDiv.appendChild(qRow);
        });

        wrapper.appendChild(questionsListDiv);
        matchingContainer.appendChild(wrapper);
      }
    }

    // --- G. Map Labelling / Diagram Labelling (IELTS Radio Grid Table UI) ---
    const isMapLabel =
      qType.includes("diagram") ||
      qType.includes("map") ||
      qType === "diagram-labelling" ||
      qType === "diagram-label" ||
      qType === "map-labelling";

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
        tableHeaderCells += `<th class="text-center fw-bold" style="width: 42px;">${opt}</th>`;
      });

      let tableBodyRows = "";
      labelsList.forEach((label, lIdx) => {
        const qId = idList[lIdx] || lIdx + 1;
        let radioCells = "";
        optionsList.forEach((opt) => {
          radioCells += `
            <td class="text-center align-middle">
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
            <td class="align-middle fw-bold text-center" style="width: 48px;">
              <span class="badge border text-dark bg-white px-2 py-1 fs-6">${qId}</span>
            </td>
            <td class="align-middle fw-semibold text-dark" style="font-size: 15px;">
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
        <div class="row align-items-start my-4 g-4">
          <div class="col-lg-6 col-12 text-center">
            <div class="p-2 border rounded-3 bg-white shadow-sm" style="display: inline-block; width: 100%; min-height: 250px;">
              ${imageElemHtml}
            </div>
          </div>
          <div class="col-lg-6 col-12">
            <div class="table-responsive bg-white rounded-3 border shadow-sm p-2">
              <table class="table table-bordered table-hover mb-0 align-middle">
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

  // Step 3: Insert Headers & Instructions
  let gIndex = 0;
  groupCounts.forEach((val, grp) => {
    const groupDiv = document.querySelector(`.group-${grp}`);
    if (!groupDiv) return;

    const groupHeader = document.createElement("div");
    groupHeader.classList.add("group-header", "mb-3", "p-3", "bg-light", "rounded", "border");

    if (instructions[gIndex] && instructions[gIndex].instruction) {
      const instructionDiv = document.createElement("div");
      instructionDiv.classList.add("instructions", "mb-1");
      instructionDiv.innerHTML = `<h5 class="fw-bold text-dark mb-0">${instructions[gIndex].instruction}</h5>`;
      groupHeader.appendChild(instructionDiv);
    }

    if (questions[gIndex] && questions[gIndex].id) {
      const min = findLowest(questions[gIndex].id);
      const max = findHighest(questions[gIndex].id);
      const groupRangeHeader = document.createElement("h6");
      groupRangeHeader.className = "text-primary fw-bold";
      groupRangeHeader.textContent = `Questions ${min} - ${max}`;
      groupHeader.prepend(groupRangeHeader);
    }

    gIndex++;
    groupDiv.prepend(groupHeader);
  });

  // Two-choice Checkbox limiter
  document.querySelectorAll(".two-choice-cb").forEach(cb => {
    cb.addEventListener("change", function () {
      const parent = this.closest(".options-wrapper");
      const checkedCount = parent.querySelectorAll("input:checked").length;
      if (checkedCount > 2) {
        this.checked = false;
      }
    });
  });

  // Bind submit & answers
  wireSubmission();
  attachAnswerListeners();
}

function findLowest(arr) {
  const flat = arr.flat();
  return Math.min(...flat);
}

function findHighest(arr) {
  const flat = arr.flat();
  return Math.max(...flat);
}

function showScore(score, total) {
  const scoreDiv = document.getElementById("user-score");
  const totalDiv = document.getElementById("total-questions");
  if (scoreDiv) scoreDiv.textContent = score;
  if (totalDiv) totalDiv.textContent = total;
  const scoreContainer = document.getElementById("score-container");
  if (scoreContainer) scoreContainer.style.display = "block";
}

// ==========================================
// 4. SUBMIT HANDLER
// ==========================================
function wireSubmission() {
  const submitBtn = document.getElementById("finishBtn");
  const submitModal = document.getElementById("submit-warning-modal");
  const submitOkButton = document.getElementById("submit-ok-btn");
  const submitStayButton = document.getElementById("submit-stay-btn");

  if (submitBtn && submitModal) {
    submitBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      submitModal.style.display = "flex";
      return false;
    };
  }

  if (submitStayButton && submitModal) {
    submitStayButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      submitModal.style.display = "none";
      return false;
    };
  }

  if (submitOkButton) {
    submitOkButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (submitModal) submitModal.style.display = "none";

      renderCorrectAnswers();
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("Listening practice submitted & reviewed successfully.");
      return false;
    };
  }
}

// ==========================================
// 5. ANSWER CHECKING & REVIEW VIEW
// ==========================================
function renderCorrectAnswers() {
  const createExplanationBox = (qid) => {
    const idKey = String(qid);
    if (answerExplanations && answerExplanations[idKey]) {
      const expDiv = document.createElement("div");
      expDiv.className = `explanation-card exp-card-${idKey} mt-2 p-3 rounded-3 shadow-sm`;
      expDiv.style.cssText = `
        background-color: #f0fdf4;
        border-left: 5px solid #16a34a;
        font-size: 0.95rem;
        color: #166534;
        line-height: 1.6;
      `;

      const raw = answerExplanations[idKey];
      const text = Array.isArray(raw) ? raw[0] : raw;

      expDiv.innerHTML = `
        <div class="fw-bold mb-1 d-flex align-items-center gap-1">
          <span>💡</span> <span>Explanation (Q${idKey}):</span>
        </div>
        <div style="color: #374151;">${text}</div>
      `;
      return expDiv;
    }
    return null;
  };

  let score = 0;
  const totalQuestions = Object.keys(answers).length;

  const appendExpOnce = (parent, qid) => {
    if (!parent) return;
    const idKey = String(qid);
    if (!parent.querySelector(`.exp-card-${idKey}`)) {
      const box = createExplanationBox(idKey);
      if (box) parent.appendChild(box);
    }
  };

  // 1. Text Inputs (Note, Form, Sentence, Table blanks)
  document.querySelectorAll("input.blank-input").forEach((input) => {
    const qid = String(input.getAttribute("data-question-id") || input.getAttribute("placeholder") || "");
    if (!qid || !answers[qid]) return;

    const userVal = input.value.trim().toLowerCase();
    const correctList = answers[qid].map(v => String(v).trim().toLowerCase());
    const isCorrect = correctList.includes(userVal);

    if (isCorrect) {
      score++;
      input.style.borderColor = "#16a34a";
      input.style.backgroundColor = "#dcfce7";
      input.style.color = "#166534";
      input.style.fontWeight = "bold";
    } else {
      input.style.borderColor = "#dc2626";
      input.style.backgroundColor = "#fee2e2";
      input.style.color = "#991b1b";
      input.style.fontWeight = "bold";
    }

    const parentElem = input.closest("p") || input.closest("li") || input.parentElement;
    if (parentElem && !parentElem.querySelector(`.badge-ans-${qid}`)) {
      const ansBadge = document.createElement("span");
      ansBadge.className = `badge ${isCorrect ? "bg-success" : "bg-danger"} ms-2 badge-ans-${qid}`;
      ansBadge.style.fontSize = "0.88rem";
      ansBadge.textContent = `[Ans: ${answers[qid][0]}]`;
      input.after(ansBadge);
      appendExpOnce(parentElem, qid);
    }
    input.disabled = true;
  });

  // 2. MCQ Single Choice & Map Grid Radios
  Object.keys(answers).forEach((qid) => {
    const idKey = String(qid);
    const correctChoices = answers[idKey].map(v => String(v).trim().toLowerCase());
    const inputs = document.querySelectorAll(`input[type="radio"][name="${idKey}"], input[type="radio"][data-question-id="${idKey}"]`);
    if (!inputs || inputs.length === 0) return;

    let pointAwarded = false;
    let questionWrapper = null;

    inputs.forEach((input) => {
      const val = input.value.trim().toLowerCase();
      const isCorrect = correctChoices.includes(val);
      const isChecked = input.checked;

      if (isChecked && isCorrect && !pointAwarded) {
        score++;
        pointAwarded = true;
      }

      const container = input.closest("td") || input.closest(".form-check") || input.parentElement;
      if (!questionWrapper) questionWrapper = input.closest("tr") || input.closest(".mcq") || container.parentElement;

      if (isCorrect && container) {
        container.style.backgroundColor = "#dcfce7";
      } else if (isChecked && !isCorrect && container) {
        container.style.backgroundColor = "#fee2e2";
      }
      input.disabled = true;
    });

    if (questionWrapper && !questionWrapper.querySelector(`.badge-ans-${idKey}`)) {
      const resultDiv = document.createElement("div");
      resultDiv.className = `mt-1 badge-ans-${idKey}`;
      resultDiv.innerHTML = `
        <span class="badge ${pointAwarded ? "bg-success" : "bg-danger"}" style="font-size: 0.85rem;">
          ${pointAwarded ? "✓ Correct" : "✗ Incorrect"} [Ans: ${answers[idKey][0]}]
        </span>`;

      const targetTd = questionWrapper.querySelector("td:nth-child(2)") || questionWrapper;
      targetTd.appendChild(resultDiv);
      appendExpOnce(questionWrapper, idKey);
    }
  });

  // 3. Two-Choice Checkboxes Grading & Explanations
  const evaluatedPairs = new Set();
  document.querySelectorAll(".two-choice-cb").forEach((cb) => {
    const id1 = cb.getAttribute("data-id1");
    const id2 = cb.getAttribute("data-id2");
    if (!id1 || !id2) return;

    const pairKey = `${id1}-${id2}`;
    if (evaluatedPairs.has(pairKey)) return;
    evaluatedPairs.add(pairKey);

    const pairWrapper = document.getElementById(`two-choice-wrapper-${id1}-${id2}`) || cb.closest(".card");
    if (!pairWrapper) return;

    const expectedAns1 = (answers[String(id1)] || []).map(v => String(v).trim().toLowerCase());
    const expectedAns2 = (answers[String(id2)] || []).map(v => String(v).trim().toLowerCase());
    const allExpected = [...expectedAns1, ...expectedAns2];

    const allCheckboxes = pairWrapper.querySelectorAll(`.two-choice-cb`);
    let pairScore = 0;

    allCheckboxes.forEach((input) => {
      const parentRow = input.closest(".two-choice-option-row") || input.parentElement;
      const letter = (input.getAttribute("data-letter") || "").trim().toLowerCase();
      const val = (input.value || "").trim().toLowerCase();

      const isCorrectOption = allExpected.some(ans => 
        ans === letter || 
        ans === val || 
        ans.startsWith(letter + ".") || 
        ans.startsWith(letter + " ") ||
        val.startsWith(ans)
      );

      if (isCorrectOption && parentRow) {
        parentRow.style.borderColor = "#16a34a";
        parentRow.style.backgroundColor = "#dcfce7";
        parentRow.style.fontWeight = "bold";
      }

      if (input.checked) {
        if (isCorrectOption) {
          pairScore++;
        } else if (parentRow) {
          parentRow.style.borderColor = "#dc2626";
          parentRow.style.backgroundColor = "#fee2e2";
          parentRow.style.fontWeight = "bold";
        }
      }
      input.disabled = true;
    });

    score += pairScore;

    const evalContainer = pairWrapper.querySelector(".evaluation-container");
    if (evalContainer) {
      evalContainer.innerHTML = `
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="badge ${pairScore === 2 ? 'bg-success' : pairScore === 1 ? 'bg-warning text-dark' : 'bg-danger'}" style="font-size: 0.95rem;">
            Score: ${pairScore} / 2
          </span>
          <span class="text-muted fw-bold">Official Ans: Q${id1}: ${answers[String(id1)] ? answers[String(id1)][0] : ''} | Q${id2}: ${answers[String(id2)] ? answers[String(id2)][0] : ''}</span>
        </div>
      `;

      [id1, id2].forEach(qid => {
        appendExpOnce(evalContainer, qid);
      });
    }
  });

  // 4. Drag and Drop Matching
  document.querySelectorAll(".dropzone").forEach((zone) => {
    const qid = String(zone.getAttribute("data-question-id") || zone.id || "");
    if (!qid || !answers[qid]) return;

    const userItem = (zone.getAttribute("data-item") || "").trim().toLowerCase();
    const correctList = answers[qid].map(v => String(v).trim().toLowerCase());
    
    const isCorrect = correctList.some(ans => userItem === ans || userItem.startsWith(ans + ".") || userItem.startsWith(ans + " "));

    if (isCorrect) {
      score++;
      zone.style.borderColor = "#16a34a";
      zone.style.backgroundColor = "#dcfce7";
      zone.style.color = "#166534";
      zone.style.fontWeight = "bold";
    } else {
      zone.style.borderColor = "#dc2626";
      zone.style.backgroundColor = "#fee2e2";
      zone.style.color = "#991b1b";
      zone.style.fontWeight = "bold";
    }

    const parentElem = zone.closest(".matching-row") || zone.parentElement;
    if (parentElem && !parentElem.querySelector(`.badge-ans-${qid}`)) {
      const ansBadge = document.createElement("div");
      ansBadge.className = `badge-ans-${qid} mt-1`;
      ansBadge.innerHTML = `
        <span class="badge ${isCorrect ? "bg-success" : "bg-danger"}" style="font-size: 0.88rem;">
          ${isCorrect ? "✓ Correct" : "✗ Incorrect"} [Ans: ${answers[qid][0]}]
        </span>
      `;
      parentElem.appendChild(ansBadge);
      appendExpOnce(parentElem, qid);
    }
    zone.setAttribute("draggable", "false");
  });

  // Retry Button Replacement
  const finishBtn = document.getElementById("finishBtn");
  if (finishBtn) {
    const retryBtn = document.createElement("button");
    retryBtn.innerHTML = "🔄 Retry Practice";
    retryBtn.className = "btn btn-outline-dark btn-sm fw-bold px-3 py-2";
    retryBtn.onclick = (e) => {
      e.preventDefault();
      window.location.reload();
    };
    finishBtn.parentNode.replaceChild(retryBtn, finishBtn);
  }

  showScore(score, totalQuestions);
}

// ==========================================
// 6. QUESTION NAVIGATION & EVENT LISTENERS
// ==========================================
function isQuestionAnswered(qid) {
  const textInput = document.querySelector(`input[data-question-id="${qid}"], input[placeholder="${qid}"]`);
  if (textInput && textInput.value.trim() !== "") return true;

  const radioInputs = document.querySelectorAll(`input[name="${qid}"]`);
  for (const el of radioInputs) {
    if ((el.type === "radio" || el.type === "checkbox") && el.checked) return true;
  }

  const dropzone = document.querySelector(`.dropzone[data-question-id="${qid}"]`);
  if (dropzone && dropzone.getAttribute("data-item") && dropzone.getAttribute("data-item") !== "") return true;

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

function attachAnswerListeners() {
  document.querySelectorAll('input[type="text"]').forEach((inp) => {
    inp.addEventListener("input", () => {
      const qid = inp.getAttribute("data-question-id") || inp.getAttribute("placeholder");
      if (qid) updateQNavState(String(qid));
    });
  });

  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((inp) => {
    inp.addEventListener("change", () => {
      const name = inp.name;
      if (name) updateQNavState(name);
    });
  });
}

// ==========================================
// 7. DRAG AND DROP ENGINE
// ==========================================
var dragElement = null;

function handleDragStart(e) {
  this.style.opacity = "0.4";
  dragElement = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("item", this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  return false;
}

function handleDragEnter() {
  this.classList.add("dragover");
}

function handleDragLeave() {
  this.classList.remove("dragover");
}

function handleDrop(e) {
  if (e.stopPropagation) e.stopPropagation();

  if (dragElement !== this) {
    const draggedGroup = dragElement.getAttribute("data-class");
    const targetGroup = this.getAttribute("data-class");

    if (draggedGroup !== targetGroup) {
      this.classList.add("invalid-drop");
      setTimeout(() => this.classList.remove("invalid-drop"), 1000);
      return false;
    } else {
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

      const qid = this.getAttribute("data-question-id");
      if (qid) updateQNavState(qid);
    }
  }
}

function handleDragEnd() {
  this.style.opacity = "1";
  document.querySelectorAll(".box").forEach((el) => el.classList.remove("dragover"));
}

function addDragEvents(element) {
  if (!element) return;
  const hasContent = element.textContent.trim() !== "";
  element.setAttribute("draggable", hasContent);

  element.addEventListener("dragenter", handleDragEnter);
  element.addEventListener("dragover", handleDragOver);
  element.addEventListener("dragleave", handleDragLeave);
  element.addEventListener("drop", handleDrop);
  element.addEventListener("dragend", handleDragEnd);

  if (hasContent) {
    element.addEventListener("dragstart", handleDragStart);
  }
}

// ==========================================
// 8. INITIALIZE APPLICATION
// ==========================================
async function initializeApp() {
  await main();

  // Bind drag events to all rendered boxes
  const items = document.querySelectorAll(".box");
  items.forEach((item) => addDragEvents(item));

  document.querySelectorAll(".qnav-btn").forEach((b) => {
    const qid = b.getAttribute("data-qid");
    if (qid) updateQNavState(qid);
  });

  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.onclick = (e) => {
      e.preventDefault();
      window.history.back();
    };
  }

  const fontSizeSelector = document.getElementById("font-size-selector");
  const testContent = document.getElementById("test-content");
  if (fontSizeSelector && testContent) {
    fontSizeSelector.addEventListener("change", function () {
      testContent.style.fontSize = this.value;
    });
  }

  console.log("Listening Practice Script fully initialized.");
}

document.addEventListener("DOMContentLoaded", initializeApp);
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