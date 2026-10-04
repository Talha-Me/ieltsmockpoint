// // part vars

// const popupSettings = document.getElementById("popup-settings");
// const popupNote = document.getElementById("popup-note");
// function settingsMenu() {
//   popupSettings.classList.toggle("menu-visible");
// }

// function closeSettings() {
//   popupSettings.classList.remove("menu-visible");
//   popupNote.classList.remove("menu-visible");
// }

// function openNotes() {
//   popupNote.classList.toggle("menu-visible");
// }

// // Reading ও Listening দুই মডিউলের জন্যই নির্ভুল API কল লজিক
// const dataRetriever = async function () {
//   try {
//     const isListening = window.location.pathname.includes("listening") || window.location.href.includes("listening");
//     const apiEndpoint = isListening ? "/api/pracDataListening" : "/api/pracDataReading";
    
//     // URL-এর query params সাথে পাঠিয়ে দেওয়া
//     const queryParams = window.location.search;
//     const res = await fetch(apiEndpoint + queryParams);
//     const data = await res.json();

//     return data;
//   } catch (err) {
//     console.error("Data fetch error:", err);
//     alert("Could not load practice data: " + err);
//   }
// };

// let data;
// let questionType;
// let passages;
// let questions;
// let instructions;
// let answers;
// let answerExplanations;

// async function main() {
//   const submitBtn = document.getElementById("finishBtn");
//   const submitModal = document.getElementById("submit-warning-modal");
//   if (submitBtn && submitModal) {
//     submitBtn.addEventListener("click", async function (e) {
//       e.preventDefault();
//       submitModal.style.display = "flex";
//     });
//   }

//   const submitOkButton = document.getElementById("submit-ok-btn");
//   const submitStayButton = document.getElementById("submit-stay-btn");

//   if (submitStayButton && submitModal) {
//     submitStayButton.addEventListener("click", async (e) => {
//       e.preventDefault();
//       submitModal.style.display = "none";
//     });
//   }

//   window.addEventListener("keydown", function (e) {
//     if (e.key === "F3" || (e.ctrlKey && e.key === "f") || (e.ctrlKey && e.key === "F")) {
//       e.preventDefault();
//     }
//   });

//   // Show modal every time fullscreen is exited
//   document.addEventListener("fullscreenchange", () => {
//     const fullscreenModal = document.getElementById("fullscreen-modal");
//     if (!document.fullscreenElement && fullscreenModal) {
//       fullscreenModal.style.display = "flex";
//     }
//   });

//   if (submitOkButton) {
//     submitOkButton.addEventListener("click", async (e) => {
//       e.preventDefault();
//       if (submitModal) submitModal.style.display = "none";

//       if (typeof timerSpecific !== "undefined") clearInterval(timerSpecific);

//       renderCorrectAnswers();
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       console.log("Test submitted and review mode activated.");
//     });
//   }

//   data = await dataRetriever();
//   if (!data) return;

//   questionType = data.type;
  
//   // Reading অথবা Listening অবজেক্ট নিশ্চিত করা
//   const contentSource = data.reading || data.listening || {};
//   passages = contentSource.passages || [];
//   questions = contentSource.questions || [];
//   instructions = contentSource.instructions || [];
//   answers = contentSource.answers || {};
//   answerExplanations = contentSource.answerExplanations || {};

//   const partHeaderP = document.getElementById("part-header-p");
//   if (partHeaderP) partHeaderP.textContent = questionType;

//   // অডিও সেটআপ (Listening মডিউল থাকলে)
//   const audioSourceUrl = contentSource.audioUrl || data.audioUrl;
//   const audioPlayer = document.getElementById("audio-player") || document.querySelector("audio");
//   if (audioPlayer && audioSourceUrl) {
//     audioPlayer.src = audioSourceUrl;
//     audioPlayer.load();
//   }

//   const part1QuestionSection = document.getElementById("question-section-1") || document.getElementById("test-content");
//   const seenGroups = new Set();
//   const groupCounts = new Map();

//   // Part range logic
//   let partIDS = [];
//   questions.forEach((part) => {
//     if (part.id) partIDS.push(part.id);
//   });

//   // Passages logic (যদি রিডিং প্যাসেজ থাকে)
//   if (passages && passages.length > 0) {
//     passages.forEach((passage) => {
//       const pNum = passage.part || 1;
//       const passageScroll = document.getElementById(`passage-scroll-${pNum}`);
//       const passageSection = document.getElementById(`passage-section-${pNum}`);
//       if (!passageScroll) return;

//       const title = document.createElement("h2");
//       title.textContent = passage.title;
//       passageScroll.appendChild(title);

//       if (passage.paragraphs) {
//         passage.paragraphs.forEach((paragraph, index) => {
//           const paraHeading = document.createElement("div");
//           paraHeading.classList.add("para-heading");
//           paraHeading.setAttribute("id", `para-heading-${paragraph}`);
//           paraHeading.textContent = paragraph;
//           passageScroll.appendChild(paraHeading);

//           if (passage["paragraph-content"] && passage["paragraph-content"][index]) {
//             passage["paragraph-content"][index].forEach((para) => {
//               const paraDIV = document.createElement("div");
//               paraDIV.classList.add("para");
//               paraDIV.setAttribute("id", `para-${paragraph}-${pNum}`);
//               paraDIV.innerHTML = para;
//               passageScroll.appendChild(paraDIV);
//             });
//           }
//         });
//       }
//       if (passageSection) passageSection.appendChild(passageScroll);
//     });
//   }

//   // Insert groups and question containers
//   questions.forEach((q) => {
//     const grpKey = q.group || 1;
//     groupCounts.set(grpKey, (groupCounts.get(grpKey) || 0) + 1);

//     if (!seenGroups.has(grpKey)) {
//       const groupDiv = document.createElement("div");
//       groupDiv.classList.add(`group-${grpKey}`, "group");

//       // Containers
//       const containers = [
//         "True-false-notGiven", "Yes-no-notGiven", "matching-information-container",
//         "list-of-headings-container", "summary-with-list-container", "summary-completion",
//         "mcq-container-one-choice", "mcq-container-two-choice", "table-container",
//         "sentence-completion-container", "form-container", "note-container",
//         "flowchart-container", "short-answer-container", "matching-container",
//         "diagram-label-container", "full-note-completion-container", "matching-table-container"
//       ];

//       containers.forEach(cls => {
//         const div = document.createElement("div");
//         div.classList.add(cls);
//         groupDiv.appendChild(div);
//       });

//       if (part1QuestionSection) part1QuestionSection.appendChild(groupDiv);
//       seenGroups.add(grpKey);
//     }
//   });

//   // Group header & instructions logic
//   let index = 0;
//   groupCounts.forEach((value, group) => {
//     const groupDiv = document.querySelector(`.group-${group}`);
//     if (!groupDiv) return;

//     const groupHeader = document.createElement("div");
//     groupHeader.classList.add("group-header");

//     if (instructions[index] && instructions[index].instruction) {
//       const instructionDiv = document.createElement("div");
//       instructionDiv.classList.add("instructions");
//       instructionDiv.innerHTML = `<h3>${instructions[index].instruction}</h3>`;
//       groupHeader.prepend(instructionDiv);
//     }

//     if (questions[index] && questions[index].id) {
//       const min = findLowest(questions[index].id);
//       const max = findHighest(questions[index].id);
//       const groupRangeHeader = document.createElement("h3");
//       groupRangeHeader.textContent = `Questions ${min} - ${max}`;
//       groupHeader.prepend(groupRangeHeader);
//     }

//     index += 1;
//     groupDiv.prepend(groupHeader);
//   });

//   // Render question types inside groups
//   questions.forEach((question) => {
//     const groupDiv = document.querySelector(`.group-${question.group || 1}`);
//     if (!groupDiv) return;

//     // 1. T/F/NG
//     if (question.type === "T/F/NG") {
//       const TFContainerDIV = groupDiv.querySelector(".True-false-notGiven");
//       question.questions.forEach((q, idx) => {
//         const TFContainer = document.createElement("div");
//         TFContainer.classList.add("TF");
//         TFContainer.innerHTML = `<p><strong>${question.id[idx]}.</strong> ${q}</p>
//           <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="TRUE">&nbsp;&nbsp;TRUE</label>
//           <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="FALSE">&nbsp;&nbsp;FALSE</label>
//           <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="NOT GIVEN">&nbsp;&nbsp;NOT GIVEN</label>`;
//         TFContainerDIV.appendChild(TFContainer);
//       });
//     }

//     // 2. Note Completion (Fixed for Bullets, Lines & Paragraphs)
//     if (question.type === "note-completion" || question.type === "Note-Completion") {
//       function renderTextWithInput(text) {
//         return `<p>${text.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
//       }

//       const fullNoteCompletionContainer = groupDiv.querySelector(".full-note-completion-container") || groupDiv.querySelector(".note-container");
//       if (question.heading) {
//         fullNoteCompletionContainer.innerHTML += `<h4 class="note-completion-title fw-bold mb-3">${question.heading}</h4>`;
//       }

//       // bullets বা lines ফরম্যাট হ্যান্ডেল করা
//       if (question.bullets && Array.isArray(question.bullets)) {
//         question.bullets.forEach((bullet) => {
//           fullNoteCompletionContainer.innerHTML += renderTextWithInput(bullet);
//         });
//       } else if (question.lines && Array.isArray(question.lines)) {
//         question.lines.forEach((line) => {
//           fullNoteCompletionContainer.innerHTML += renderTextWithInput(line);
//         });
//       } else if (question.paragraphs && Array.isArray(question.paragraphs)) {
//         if (!question.subheadings) {
//           question.paragraphs[0].forEach((paragraph) => {
//             fullNoteCompletionContainer.innerHTML += renderTextWithInput(paragraph);
//           });
//         } else {
//           question.subheadings.forEach((subheading, sIdx) => {
//             fullNoteCompletionContainer.innerHTML += `<p class="note-completion-subheading fw-bold">${subheading}</p>`;
//             if (question.paragraphs[sIdx]) {
//               question.paragraphs[sIdx].forEach((paragraph) => {
//                 fullNoteCompletionContainer.innerHTML += renderTextWithInput(paragraph);
//               });
//             }
//           });
//         }
//       }

//       const inputs = fullNoteCompletionContainer.querySelectorAll("input.blank-input");
//       inputs.forEach((input, idx) => {
//         const qId = question.id[idx];
//         if (qId) {
//           input.setAttribute("placeholder", qId);
//           input.setAttribute("data-question-id", qId);
//         }
//       });
//     }

//     // 3. Form Completion
//     if (question.type === "form-completion") {
//       function renderTextWithInput(text) {
//         return `<p>${text.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
//       }
//       const formContainer = groupDiv.querySelector(".form-container");
//       if (question.heading) {
//         formContainer.innerHTML += `<h4 class="form-title fw-bold mb-3">${question.heading}</h4>`;
//       }
//       const lines = question.lines || question.bullets || [];
//       lines.forEach((line) => {
//         formContainer.innerHTML += renderTextWithInput(line);
//       });

//       const inputs = formContainer.querySelectorAll("input.blank-input");
//       inputs.forEach((input, idx) => {
//         const qId = question.id[idx];
//         if (qId) {
//           input.setAttribute("placeholder", qId);
//           input.setAttribute("data-question-id", qId);
//         }
//       });
//     }

//     // 4. Matching Information
//     if (question.type === "matching-information") {
//       const matchingInformationContainer = groupDiv.querySelector(".matching-information-container");
//       const selectElem = document.createElement("select");
//       selectElem.setAttribute("name", `matching-information-${question.part}`);
//       selectElem.setAttribute("class", `matching-information`);
//       const optionElem = document.createElement("option");
//       optionElem.setAttribute("value", "");
//       selectElem.appendChild(optionElem);

//       question.paragraphs.forEach((paragraph) => {
//         const optionELEMENT = document.createElement("option");
//         optionELEMENT.setAttribute("value", paragraph);
//         optionELEMENT.textContent = paragraph;
//         selectElem.appendChild(optionELEMENT);
//       });

//       question.information.forEach((info, idx) => {
//         selectElem.setAttribute("id", question.id[idx]);
//         const infoDiv = document.createElement("div");
//         infoDiv.classList.add("matching-info-question");
//         const infoPara = document.createElement("p");
//         infoPara.innerHTML = `<strong>${question.id[idx]}.</strong>&nbsp;&nbsp;${info}`;
//         infoDiv.appendChild(infoPara);
//         infoDiv.innerHTML += selectElem.outerHTML;
//         matchingInformationContainer.appendChild(infoDiv);
//       });
//     }

//     // 5. Sentence Completion
//     if (question.type === "sentence-completion" || question.type === "Sentence Completion") {
//       function renderTextWithInput(text, qNum) {
//         const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input" placeholder="${qNum}" data-question-id="${qNum}">`);
//         return `<p>${htmlString}</p>`;
//       }
//       const sentenceCompletionContainer = groupDiv.querySelector(".sentence-completion-container");
//       const listElem = document.createElement("ul");
//       const sentenceList = question.questions || question.sentences || [];

//       sentenceList.forEach((sentence, idx) => {
//         const liElem = document.createElement("li");
//         const qNum = question.id[idx] || (idx + 1);
//         liElem.innerHTML = renderTextWithInput(sentence, qNum);
//         listElem.appendChild(liElem);
//       });
//       sentenceCompletionContainer.appendChild(listElem);
//     }

//     // 6. Matching Features
//     if (question.type === "feature-matching" || question.type === "matching-features") {
//       const matchingContainer = groupDiv.querySelector(".matching-container");
//       if (matchingContainer) {
//         const optionDIV = document.createElement("div");
//         optionDIV.classList.add("matching-options");

//         const selectElem = document.createElement("select");
//         selectElem.setAttribute("name", `matching-${question.part}`);
//         const optionElem = document.createElement("option");
//         optionElem.setAttribute("value", "");
//         optionElem.textContent = "Select";
//         selectElem.appendChild(optionElem);

//         const optionsList = question.options || question.features || [];
//         optionsList.forEach((opt) => {
//           const matchingOption = document.createElement("p");
//           matchingOption.textContent = opt;
//           optionDIV.appendChild(matchingOption);

//           const optionELEMENT = document.createElement("option");
//           optionELEMENT.setAttribute("value", opt);
//           optionELEMENT.textContent = opt;
//           selectElem.appendChild(optionELEMENT);
//         });
//         matchingContainer.appendChild(optionDIV);

//         const statementList = question.statements || question.features || [];
//         statementList.forEach((stmt, idx) => {
//           const featureDIV = document.createElement("div");
//           featureDIV.classList.add("matching-feature-question");
//           const qId = question.id[idx];
//           const featurePara = document.createElement("p");
//           featurePara.innerHTML = `<strong>${qId}.</strong>&nbsp;&nbsp;${stmt}`;
//           featureDIV.appendChild(featurePara);

//           selectElem.setAttribute("id", qId);
//           selectElem.setAttribute("data-question-id", qId);
//           featureDIV.innerHTML += selectElem.outerHTML;
//           matchingContainer.appendChild(featureDIV);
//         });
//       }
//     }

//     // 7. MCQ One Choice
//     if (question.type === "mcq-one-choice" || question.type === "Multiple-Choice") {
//       const mcqContainerDiv = groupDiv.querySelector(".mcq-container-one-choice");
//       question.questions.forEach((q, idx) => {
//         const mcqContainer = document.createElement("div");
//         mcqContainer.classList.add("mcq");
//         mcqContainer.innerHTML = `<p><strong>${question.id[idx]}.</strong> ${q}</p>`;
//         if (question.options && question.options[idx]) {
//           question.options[idx].forEach((option, oIdx) => {
//             mcqContainer.innerHTML += `<label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="${option}">&nbsp;&nbsp;${option}</label><br>`;
//           });
//         }
//         mcqContainerDiv.appendChild(mcqContainer);
//       });
//     }

//     // 8. Y/N/NG
//     if (question.type === "Y/N/NG") {
//       const YNContainerDIV = groupDiv.querySelector(".Yes-no-notGiven");
//       question.questions.forEach((q, idx) => {
//         const YNContainer = document.createElement("div");
//         YNContainer.classList.add("YN");
//         YNContainer.innerHTML = `<p><strong>${question.id[idx]}</strong> ${q}</p>
//           <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="YES">&nbsp;&nbsp;YES</label>
//           <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="NO">&nbsp;&nbsp;NO</label>
//           <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="NOT GIVEN">&nbsp;&nbsp;NOT GIVEN</label>`;
//         YNContainerDIV.appendChild(YNContainer);
//       });
//     }

//     // 9. Table Completion
//     if (question.type === "table-completion") {
//       const tableContainer = groupDiv.querySelector(".table-container");
//       const table = document.createElement("table");
//       table.className = "table table-bordered";

//       if (question.headers && question.headers.length > 0) {
//         const thead = document.createElement("thead");
//         const tr = document.createElement("tr");
//         question.headers.forEach(h => {
//           const th = document.createElement("th");
//           th.textContent = h;
//           tr.appendChild(th);
//         });
//         thead.appendChild(tr);
//         table.appendChild(thead);
//       }

//       if (question.rows && question.rows.length > 0) {
//         const tbody = document.createElement("tbody");
//         question.rows.forEach(row => {
//           const tr = document.createElement("tr");
//           row.forEach(cell => {
//             const td = document.createElement("td");
//             td.innerHTML = cell.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`);
//             tr.appendChild(td);
//           });
//           tbody.appendChild(tr);
//         });
//         table.appendChild(tbody);
//       }
//       tableContainer.appendChild(table);

//       const inputs = tableContainer.querySelectorAll("input.blank-input");
//       inputs.forEach((input, idx) => {
//         if (question.id[idx]) {
//           input.setAttribute("placeholder", question.id[idx]);
//           input.setAttribute("data-question-id", question.id[idx]);
//         }
//       });
//     }
//   });

//   // Attach Answer Listeners for Navigation Buttons
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

// // Answer Evaluation & Review Renderer
// function renderCorrectAnswers() {
//   const createExplanationBox = (qid) => {
//     const idKey = String(qid);
//     if (typeof answerExplanations !== "undefined" && answerExplanations && answerExplanations[idKey]) {
//       const expDiv = document.createElement("div");
//       expDiv.className = `explanation-card exp-card-${idKey}`;
//       expDiv.style.cssText = `
//         margin-top: 10px;
//         padding: 12px 16px;
//         border-radius: 8px;
//         background-color: #f0fdf4;
//         border-left: 4px solid #16a34a;
//         font-size: 0.92rem;
//         color: #166534;
//         line-height: 1.55;
//         box-shadow: 0 1px 3px rgba(0,0,0,0.05);
//       `;

//       const rawText = answerExplanations[idKey];
//       const expText = Array.isArray(rawText) ? rawText[0] : rawText;

//       expDiv.innerHTML = `
//         <div style="font-weight: 700; color: #15803d; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
//           <span style="font-size: 1rem;">💡</span> <span>Answer Explanation (Q${idKey}):</span>
//         </div>
//         <div style="color: #1f2937;">${expText}</div>
//       `;
//       return expDiv;
//     }
//     return null;
//   };

//   let score = 0;
//   const totalQuestions = (typeof answers !== "undefined" && answers) ? Object.keys(answers).length : 0;

//   const appendExpOnce = (parentContainer, qid) => {
//     if (!parentContainer) return;
//     const idKey = String(qid);
//     if (!parentContainer.querySelector(`.exp-card-${idKey}`)) {
//       const expBox = createExplanationBox(idKey);
//       if (expBox) parentContainer.appendChild(expBox);
//     }
//   };

//   // 1. Text Inputs & Blanks
//   document.querySelectorAll("input.blank-input").forEach((input) => {
//     const qid = String(input.getAttribute("data-question-id") || input.getAttribute("placeholder") || "");
//     if (!qid || !answers || !answers[qid]) return;

//     const userVal = input.value.trim().toLowerCase();
//     const correctList = answers[qid].map((v) => String(v).trim().toLowerCase());
//     const isCorrect = correctList.includes(userVal);

//     if (isCorrect) {
//       score++;
//       input.style.borderColor = "#16a34a";
//       input.style.backgroundColor = "#dcfce7";
//       input.style.color = "#166534";
//       input.style.fontWeight = "600";
//     } else {
//       input.style.borderColor = "#dc2626";
//       input.style.backgroundColor = "#fee2e2";
//       input.style.color = "#991b1b";
//       input.style.fontWeight = "600";
//     }

//     const parentElem = input.closest("li") || input.closest("p") || input.parentElement;
//     if (parentElem && !parentElem.querySelector(`.badge-ans-${qid}`)) {
//       const ansBadge = document.createElement("span");
//       ansBadge.className = `badge ${isCorrect ? "bg-success" : "bg-danger"} ms-2 badge-ans-${qid}`;
//       ansBadge.style.fontSize = "0.85rem";
//       ansBadge.textContent = `[Ans: ${answers[qid][0]}]`;
//       input.after(ansBadge);
//       appendExpOnce(parentElem, qid);
//     }
//     input.disabled = true;
//   });

//   // 2. Select Dropdowns
//   document.querySelectorAll("select.matching-information, .matching-container select").forEach((select) => {
//     const qid = String(select.getAttribute("data-question-id") || select.id || "");
//     if (!qid || !answers || !answers[qid]) return;

//     const userVal = select.value.trim().toLowerCase();
//     const correctList = answers[qid].map((v) => String(v).trim().toLowerCase());
//     const isCorrect = correctList.includes(userVal);

//     if (isCorrect) {
//       score++;
//       select.style.borderColor = "#16a34a";
//       select.style.backgroundColor = "#dcfce7";
//     } else {
//       select.style.borderColor = "#dc2626";
//       select.style.backgroundColor = "#fee2e2";
//     }

//     const parentElem = select.closest(".matching-feature-question") || select.closest(".matching-info-question") || select.parentElement;
//     if (parentElem && !parentElem.querySelector(`.badge-ans-${qid}`)) {
//       const ansBadge = document.createElement("span");
//       ansBadge.className = `badge ${isCorrect ? "bg-success" : "bg-danger"} ms-2 badge-ans-${qid}`;
//       ansBadge.style.fontSize = "0.85rem";
//       ansBadge.textContent = `[Ans: ${answers[qid][0].toUpperCase()}]`;
//       select.after(ansBadge);
//       appendExpOnce(parentElem, qid);
//     }
//     select.disabled = true;
//   });

//   // 3. Radios & Checkboxes
//   if (typeof answers !== "undefined" && answers) {
//     Object.keys(answers).forEach((qid) => {
//       const idKey = String(qid);
//       const correctChoices = answers[idKey].map((v) => String(v).trim().toLowerCase());
//       const inputs = document.querySelectorAll(`input[type="radio"][name="${idKey}"], input[type="radio"][data-question-id="${idKey}"]`);
//       if (!inputs || inputs.length === 0) return;

//       let pointAwarded = false;
//       let questionWrapper = null;

//       inputs.forEach((input) => {
//         const val = input.value.trim().toLowerCase();
//         const isCorrect = correctChoices.includes(val);
//         const isChecked = input.checked;

//         if (isChecked && isCorrect && !pointAwarded) {
//           score++;
//           pointAwarded = true;
//         }

//         const container = input.closest("label") || input.parentElement;
//         if (!questionWrapper) {
//           questionWrapper = input.closest(".TF") || input.closest(".YN") || input.closest(".mcq") || container.parentElement;
//         }

//         if (isCorrect && container) {
//           container.style.color = "#16a34a";
//           container.style.fontWeight = "700";
//         } else if (isChecked && !isCorrect && container) {
//           container.style.color = "#dc2626";
//           container.style.fontWeight = "700";
//         }
//         input.disabled = true;
//       });

//       if (questionWrapper && !questionWrapper.querySelector(`.badge-ans-${idKey}`)) {
//         const resultDiv = document.createElement("div");
//         resultDiv.className = `mt-2 badge-ans-${idKey}`;
//         resultDiv.innerHTML = `
//           <span class="badge ${pointAwarded ? "bg-success" : "bg-danger"}" style="font-size: 0.85rem;">
//             ${pointAwarded ? "✓ Correct" : "✗ Incorrect"} (Official Ans: ${answers[idKey][0].toUpperCase()})
//           </span>
//         `;
//         questionWrapper.appendChild(resultDiv);
//         appendExpOnce(questionWrapper, idKey);
//       }
//     });
//   }

//   // 4. Retry Button
//   const finishBtn = document.getElementById("finishBtn");
//   if (finishBtn) {
//     const retryBtn = document.createElement("button");
//     retryBtn.innerHTML = "🔄 Retry Practice";
//     retryBtn.className = "btn btn-outline-primary btn-sm fw-bold px-3 py-2";
//     retryBtn.onclick = () => window.location.reload();
//     finishBtn.parentNode.replaceChild(retryBtn, finishBtn);
//   }

//   showScore(score, totalQuestions);
// }

// // Navigation Tracking & Utilities
// function getQuestionElementById(qid) {
//   return document.querySelector(`[data-question-id="${qid}"], [id="${qid}"]`);
// }

// function isQuestionAnswered(qid) {
//   const textInput = document.querySelector(`input[type="text"][data-question-id="${qid}"], input[type="text"][placeholder="${qid}"]`);
//   if (textInput && textInput.value.trim() !== "") return true;

//   const inputsByName = document.querySelectorAll(`input[name="${qid}"]`);
//   for (const el of inputsByName) {
//     if ((el.type === "radio" || el.type === "checkbox") && el.checked) return true;
//   }

//   const select = document.getElementById(qid);
//   if (select && select.value && select.value.trim() !== "") return true;

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

//   document.querySelectorAll("select").forEach((sel) => {
//     sel.addEventListener("change", () => {
//       const id = sel.id || sel.getAttribute("name");
//       if (id) updateQNavState(String(id));
//     });
//   });
// }

// async function initializeApp() {
//   await main();
// }

// document.addEventListener("DOMContentLoaded", initializeApp);

// part vars

// part vars

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

// Reading ও Listening দুই মডিউলের জন্যই নির্ভুল API কল লজিক
const dataRetriever = async function () {
  try {
    const isListening = window.location.pathname.includes("listening") || window.location.href.includes("listening");
    const apiEndpoint = isListening ? "/api/pracDataListening" : "/api/pracDataReading";
    
    // URL-এর query params সাথে পাঠিয়ে দেওয়া
    const queryParams = window.location.search;
    const res = await fetch(apiEndpoint + queryParams);
    const data = await res.json();

    return data;
  } catch (err) {
    console.error("Data fetch error:", err);
    alert("Could not load practice data: " + err);
  }
};

let data;
let questionType;
let passages;
let questions;
let instructions;
let answers;
let answerExplanations;

async function main() {
  const submitBtn = document.getElementById("finishBtn");
  const submitModal = document.getElementById("submit-warning-modal");
  if (submitBtn && submitModal) {
    submitBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      submitModal.style.display = "flex";
    });
  }

  const submitOkButton = document.getElementById("submit-ok-btn");
  const submitStayButton = document.getElementById("submit-stay-btn");

  if (submitStayButton && submitModal) {
    submitStayButton.addEventListener("click", async (e) => {
      e.preventDefault();
      submitModal.style.display = "none";
    });
  }

  window.addEventListener("keydown", function (e) {
    if (e.key === "F3" || (e.ctrlKey && e.key === "f") || (e.ctrlKey && e.key === "F")) {
      e.preventDefault();
    }
  });

  // Show modal every time fullscreen is exited
  document.addEventListener("fullscreenchange", () => {
    const fullscreenModal = document.getElementById("fullscreen-modal");
    if (!document.fullscreenElement && fullscreenModal) {
      fullscreenModal.style.display = "flex";
    }
  });

  if (submitOkButton) {
    submitOkButton.addEventListener("click", async (e) => {
      e.preventDefault();
      if (submitModal) submitModal.style.display = "none";

      if (typeof timerSpecific !== "undefined") clearInterval(timerSpecific);

      renderCorrectAnswers();
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("Test submitted and review mode activated.");
    });
  }

  data = await dataRetriever();
  if (!data) return;

  questionType = data.type;
  
  // Reading অথবা Listening অবজেক্ট নিশ্চিত করা
  const contentSource = data.reading || data.listening || {};
  passages = contentSource.passages || [];
  questions = contentSource.questions || [];
  instructions = contentSource.instructions || [];
  answers = contentSource.answers || {};
  answerExplanations = contentSource.answerExplanations || {};

  const partHeaderP = document.getElementById("part-header-p");
  if (partHeaderP) partHeaderP.textContent = questionType;

  // অডিও সেটআপ (Listening মডিউল থাকলে)
  const audioSourceUrl = contentSource.audioUrl || data.audioUrl;
  const audioPlayer = document.getElementById("audio-player") || document.querySelector("audio");
  if (audioPlayer && audioSourceUrl) {
    audioPlayer.src = audioSourceUrl;
    audioPlayer.load();
  }

  const part1QuestionSection = document.getElementById("question-section-1") || document.getElementById("test-content");
  const seenGroups = new Set();
  const groupCounts = new Map();

  // Part range logic
  let partIDS = [];
  questions.forEach((part) => {
    if (part.id) partIDS.push(part.id);
  });

  // Passages logic (যদি রিডিং প্যাসেজ থাকে)
  if (passages && passages.length > 0) {
    passages.forEach((passage) => {
      const pNum = passage.part || 1;
      const passageScroll = document.getElementById(`passage-scroll-${pNum}`);
      const passageSection = document.getElementById(`passage-section-${pNum}`);
      if (!passageScroll) return;

      const title = document.createElement("h2");
      title.textContent = passage.title;
      passageScroll.appendChild(title);

      if (passage.paragraphs) {
        passage.paragraphs.forEach((paragraph, index) => {
          const paraHeading = document.createElement("div");
          paraHeading.classList.add("para-heading");
          paraHeading.setAttribute("id", `para-heading-${paragraph}`);
          paraHeading.textContent = paragraph;
          passageScroll.appendChild(paraHeading);

          if (passage["paragraph-content"] && passage["paragraph-content"][index]) {
            passage["paragraph-content"][index].forEach((para) => {
              const paraDIV = document.createElement("div");
              paraDIV.classList.add("para");
              paraDIV.setAttribute("id", `para-${paragraph}-${pNum}`);
              paraDIV.innerHTML = para;
              passageScroll.appendChild(paraDIV);
            });
          }
        });
      }
      if (passageSection) passageSection.appendChild(passageScroll);
    });
  }

  // Insert groups and question containers
  questions.forEach((q) => {
    const grpKey = q.group || 1;
    groupCounts.set(grpKey, (groupCounts.get(grpKey) || 0) + 1);

    if (!seenGroups.has(grpKey)) {
      const groupDiv = document.createElement("div");
      groupDiv.classList.add(`group-${grpKey}`, "group");

      // Containers
      const containers = [
        "True-false-notGiven", "Yes-no-notGiven", "matching-information-container",
        "list-of-headings-container", "summary-with-list-container", "summary-completion",
        "mcq-container-one-choice", "mcq-container-two-choice", "table-container",
        "sentence-completion-container", "form-container", "note-container",
        "flowchart-container", "short-answer-container", "matching-container",
        "diagram-label-container", "full-note-completion-container", "matching-table-container"
      ];

      containers.forEach(cls => {
        const div = document.createElement("div");
        div.classList.add(cls);
        groupDiv.appendChild(div);
      });

      if (part1QuestionSection) part1QuestionSection.appendChild(groupDiv);
      seenGroups.add(grpKey);
    }
  });

  // Group header & instructions logic
  let index = 0;
  groupCounts.forEach((value, group) => {
    const groupDiv = document.querySelector(`.group-${group}`);
    if (!groupDiv) return;

    const groupHeader = document.createElement("div");
    groupHeader.classList.add("group-header");

    if (instructions[index] && instructions[index].instruction) {
      const instructionDiv = document.createElement("div");
      instructionDiv.classList.add("instructions");
      instructionDiv.innerHTML = `<h3>${instructions[index].instruction}</h3>`;
      groupHeader.prepend(instructionDiv);
    }

    if (questions[index] && questions[index].id) {
      const min = findLowest(questions[index].id);
      const max = findHighest(questions[index].id);
      const groupRangeHeader = document.createElement("h3");
      groupRangeHeader.textContent = `Questions ${min} - ${max}`;
      groupHeader.prepend(groupRangeHeader);
    }

    index += 1;
    groupDiv.prepend(groupHeader);
  });

  // Render question types inside groups
  questions.forEach((question) => {
    const groupDiv = document.querySelector(`.group-${question.group || 1}`);
    if (!groupDiv) return;

    const qType = String(question.type || data.type || questionType || "").trim().toLowerCase();

    // 1. T/F/NG
    if (qType === "t/f/ng") {
      const TFContainerDIV = groupDiv.querySelector(".True-false-notGiven");
      question.questions.forEach((q, idx) => {
        const TFContainer = document.createElement("div");
        TFContainer.classList.add("TF");
        TFContainer.innerHTML = `<p><strong>${question.id[idx]}.</strong> ${q}</p>
          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="TRUE">&nbsp;&nbsp;TRUE</label>
          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="FALSE">&nbsp;&nbsp;FALSE</label>
          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="NOT GIVEN">&nbsp;&nbsp;NOT GIVEN</label>`;
        TFContainerDIV.appendChild(TFContainer);
      });
    }

    // 2. Note Completion (Fixed for Bullets, Lines & Paragraphs)
    if (qType === "note-completion") {
      function renderTextWithInput(text) {
        return `<p>${text.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
      }

      const fullNoteCompletionContainer = groupDiv.querySelector(".full-note-completion-container") || groupDiv.querySelector(".note-container");
      if (question.heading) {
        fullNoteCompletionContainer.innerHTML += `<h4 class="note-completion-title fw-bold mb-3">${question.heading}</h4>`;
      }

      if (question.bullets && Array.isArray(question.bullets)) {
        question.bullets.forEach((bullet) => {
          fullNoteCompletionContainer.innerHTML += renderTextWithInput(bullet);
        });
      } else if (question.lines && Array.isArray(question.lines)) {
        question.lines.forEach((line) => {
          fullNoteCompletionContainer.innerHTML += renderTextWithInput(line);
        });
      } else if (question.paragraphs && Array.isArray(question.paragraphs)) {
        if (!question.subheadings) {
          question.paragraphs[0].forEach((paragraph) => {
            fullNoteCompletionContainer.innerHTML += renderTextWithInput(paragraph);
          });
        } else {
          question.subheadings.forEach((subheading, sIdx) => {
            fullNoteCompletionContainer.innerHTML += `<p class="note-completion-subheading fw-bold">${subheading}</p>`;
            if (question.paragraphs[sIdx]) {
              question.paragraphs[sIdx].forEach((paragraph) => {
                fullNoteCompletionContainer.innerHTML += renderTextWithInput(paragraph);
              });
            }
          });
        }
      }

      const inputs = fullNoteCompletionContainer.querySelectorAll("input.blank-input");
      inputs.forEach((input, idx) => {
        const qId = question.id[idx];
        if (qId) {
          input.setAttribute("placeholder", qId);
          input.setAttribute("data-question-id", qId);
        }
      });
    }

    // 3. Form Completion
    if (qType === "form-completion") {
      function renderTextWithInput(text) {
        return `<p>${text.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
      }
      const formContainer = groupDiv.querySelector(".form-container");
      if (question.heading) {
        formContainer.innerHTML += `<h4 class="form-title fw-bold mb-3">${question.heading}</h4>`;
      }
      const lines = question.lines || question.bullets || [];
      lines.forEach((line) => {
        formContainer.innerHTML += renderTextWithInput(line);
      });

      const inputs = formContainer.querySelectorAll("input.blank-input");
      inputs.forEach((input, idx) => {
        const qId = question.id[idx];
        if (qId) {
          input.setAttribute("placeholder", qId);
          input.setAttribute("data-question-id", qId);
        }
      });
    }

    // 4. Matching Information / Matching Table Container (EXACT JSON MATCH)
    const isMatchingInfo = 
      qType === "matching-table-container" ||
      qType === "matching-information" || 
      qType === "information-matching" ||
      qType.includes("matching-info") ||
      qType.includes("information");

    if (isMatchingInfo) {
      const targetContainer = 
        groupDiv.querySelector(".matching-table-container") || 
        groupDiv.querySelector(".matching-information-container");

      if (targetContainer) {
        // Dropdown paragraph list (B, C, D, E, F, G, H)
        let paragraphOptions = [];
        if (Array.isArray(question.paragraphs) && question.paragraphs.length > 0) {
          paragraphOptions = question.paragraphs;
        } else if (passages && passages[0] && Array.isArray(passages[0].paragraphs)) {
          paragraphOptions = passages[0].paragraphs;
        } else {
          paragraphOptions = ["A", "B", "C", "D", "E", "F", "G", "H"];
        }

        const infoList = question.information || question.questions || question.statements || [];
        const idList = Array.isArray(question.id) ? question.id.flat(Infinity) : [question.id];

        infoList.forEach((info, idx) => {
          const qId = idList[idx] || (idx + 1);
          const infoDiv = document.createElement("div");
          infoDiv.classList.add("matching-info-question", "mb-3", "p-2", "border-bottom");

          let selectHTML = `<select class="matching-information form-select d-inline-block w-auto ms-2" id="${qId}" data-question-id="${qId}">
            <option value="">Select</option>`;
          paragraphOptions.forEach((p) => {
            selectHTML += `<option value="${p}">${p}</option>`;
          });
          selectHTML += `</select>`;

          infoDiv.innerHTML = `<p class="d-inline fw-semibold text-dark"><strong>${qId}.</strong>&nbsp;&nbsp;${info}</p>${selectHTML}`;
          targetContainer.appendChild(infoDiv);
        });
      }
    }

    // 5. Heading Matching (List of Headings)
    if (qType === "heading-matching" || qType === "matching-headings" || qType === "list-of-headings") {
      const headingContainer = groupDiv.querySelector(".list-of-headings-container");
      if (headingContainer) {
        headingContainer.innerHTML = "";

        const headingsBox = document.createElement("div");
        headingsBox.className = "headings-list-box p-3 mb-4 rounded border bg-light";
        headingsBox.innerHTML = `<h5 class="fw-bold mb-3">List of Headings</h5>`;
        
        const headingsList = question.headings || question.options || [];
        const ul = document.createElement("ul");
        ul.className = "list-unstyled mb-0";
        headingsList.forEach((hd, hIdx) => {
          ul.innerHTML += `<li class="mb-2"><strong>${hd.num || hd.roman || (hIdx + 1)}.</strong> ${hd.text || hd}</li>`;
        });
        headingsBox.appendChild(ul);
        headingContainer.appendChild(headingsBox);

        const parasList = question.paragraphs || question.questions || question.statements || [];
        parasList.forEach((para, idx) => {
          const qId = question.id[idx] || (idx + 1);
          const itemDiv = document.createElement("div");
          itemDiv.className = "heading-question-item mb-3";

          let selectHTML = `<select class="matching-information form-select d-inline-block w-auto ms-2" id="${qId}" data-question-id="${qId}">
            <option value="">Select Heading</option>`;
          headingsList.forEach((hd, hIdx) => {
            const val = hd.num || hd.roman || String(hIdx + 1);
            selectHTML += `<option value="${val}">${val}</option>`;
          });
          selectHTML += `</select>`;

          const paraLabel = typeof para === "string" ? para : `Paragraph ${para.letter || para.paragraph || (idx + 1)}`;
          itemDiv.innerHTML = `<p class="d-inline"><strong>${qId}.</strong>&nbsp;&nbsp;${paraLabel}</p>${selectHTML}`;
          headingContainer.appendChild(itemDiv);
        });
      }
    }

    // 6. Summary Completion (FULL ROBUST SUPPORT)
    const isSummary = qType.includes("summary");
    if (isSummary) {
      const summaryContainer = groupDiv.querySelector(".summary-completion") || groupDiv.querySelector(".summary-with-list-container");
      if (summaryContainer) {
        if (question.heading || question.title) {
          summaryContainer.innerHTML += `<h4 class="summary-title fw-bold mb-3">${question.heading || question.title}</h4>`;
        }

        // Summary with Box (Options list if available)
        if (question.options && Array.isArray(question.options) && question.options.length > 0) {
          const optBox = document.createElement("div");
          optBox.className = "summary-options-box p-3 mb-3 rounded border bg-light";
          optBox.innerHTML = `<h6 class="fw-bold mb-2">Options / Word List:</h6><div class="d-flex flex-wrap gap-2">` +
            question.options.map(opt => `<span class="badge bg-secondary p-2" style="font-size:0.95rem;">${opt}</span>`).join(" ") +
            `</div>`;
          summaryContainer.appendChild(optBox);
        }

        function renderSummaryBlanks(text) {
          return `<p class="summary-text lh-lg mb-3" style="font-size: 1.05rem; line-height: 2;">${text.replaceAll(/\[blank\]|\(blank\)|___+|\[\.\.\.\]/gi, `<input spellcheck="false" type="text" class="blank-input">`)}</p>`;
        }

        // সব সম্ভাব্য টেক্সট ফিল্ড খুঁজে বের করা
        let summaryTexts = [];
        if (question.summary) {
          if (Array.isArray(question.summary)) summaryTexts.push(...question.summary.flat(Infinity));
          else if (typeof question.summary === "string") summaryTexts.push(question.summary);
        }
        if (question.paragraphs) {
          if (Array.isArray(question.paragraphs)) summaryTexts.push(...question.paragraphs.flat(Infinity));
          else if (typeof question.paragraphs === "string") summaryTexts.push(question.paragraphs);
        }
        if (question.sentences) {
          if (Array.isArray(question.sentences)) summaryTexts.push(...question.sentences.flat(Infinity));
          else if (typeof question.sentences === "string") summaryTexts.push(question.sentences);
        }
        if (question.lines) {
          if (Array.isArray(question.lines)) summaryTexts.push(...question.lines.flat(Infinity));
          else if (typeof question.lines === "string") summaryTexts.push(question.lines);
        }
        if (summaryTexts.length === 0) {
          const singleText = question.text || question.question || question.content || question.passage;
          if (singleText) summaryTexts.push(singleText);
        }

        summaryTexts.forEach(pText => {
          if (typeof pText === "string") {
            summaryContainer.innerHTML += renderSummaryBlanks(pText);
          }
        });

        // আইডি অ্যাসাইন করা
        let idList = [];
        if (Array.isArray(question.id)) {
          idList = question.id.flat(Infinity);
        } else if (question.id !== undefined && question.id !== null) {
          idList = [question.id];
        }

        const inputs = summaryContainer.querySelectorAll("input.blank-input");
        inputs.forEach((input, idx) => {
          const qId = idList[idx] || (idx + 1);
          input.setAttribute("placeholder", qId);
          input.setAttribute("data-question-id", qId);
        });
      }
    }

    // 7. Sentence Completion
    if (qType === "sentence-completion" || qType === "sentence completion") {
      function renderTextWithInput(text, qNum) {
        const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input" placeholder="${qNum}" data-question-id="${qNum}">`);
        return `<p>${htmlString}</p>`;
      }
      const sentenceCompletionContainer = groupDiv.querySelector(".sentence-completion-container");
      const listElem = document.createElement("ul");
      const sentenceList = question.questions || question.sentences || [];

      sentenceList.forEach((sentence, idx) => {
        const liElem = document.createElement("li");
        const qNum = question.id[idx] || (idx + 1);
        liElem.innerHTML = renderTextWithInput(sentence, qNum);
        listElem.appendChild(liElem);
      });
      sentenceCompletionContainer.appendChild(listElem);
    }

    // 8. Matching Features
    if (qType === "feature-matching" || qType === "matching-features") {
      const matchingContainer = groupDiv.querySelector(".matching-container");
      if (matchingContainer) {
        const optionDIV = document.createElement("div");
        optionDIV.classList.add("matching-options");

        const selectElem = document.createElement("select");
        selectElem.setAttribute("name", `matching-${question.part}`);
        const optionElem = document.createElement("option");
        optionElem.setAttribute("value", "");
        optionElem.textContent = "Select";
        selectElem.appendChild(optionElem);

        const optionsList = question.options || question.features || [];
        optionsList.forEach((opt) => {
          const matchingOption = document.createElement("p");
          matchingOption.textContent = opt;
          optionDIV.appendChild(matchingOption);

          const optionELEMENT = document.createElement("option");
          optionELEMENT.setAttribute("value", opt);
          optionELEMENT.textContent = opt;
          selectElem.appendChild(optionELEMENT);
        });
        matchingContainer.appendChild(optionDIV);

        const statementList = question.statements || question.features || [];
        statementList.forEach((stmt, idx) => {
          const featureDIV = document.createElement("div");
          featureDIV.classList.add("matching-feature-question");
          const qId = question.id[idx];
          const featurePara = document.createElement("p");
          featurePara.innerHTML = `<strong>${qId}.</strong>&nbsp;&nbsp;${stmt}`;
          featureDIV.appendChild(featurePara);

          selectElem.setAttribute("id", qId);
          selectElem.setAttribute("data-question-id", qId);
          featureDIV.innerHTML += selectElem.outerHTML;
          matchingContainer.appendChild(featureDIV);
        });
      }
    }

    // 9. MCQ One Choice
    if (qType === "mcq-one-choice" || qType === "multiple-choice") {
      const mcqContainerDiv = groupDiv.querySelector(".mcq-container-one-choice");
      question.questions.forEach((q, idx) => {
        const mcqContainer = document.createElement("div");
        mcqContainer.classList.add("mcq");
        mcqContainer.innerHTML = `<p><strong>${question.id[idx]}.</strong> ${q}</p>`;
        if (question.options && question.options[idx]) {
          question.options[idx].forEach((option) => {
            mcqContainer.innerHTML += `<label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="${option}">&nbsp;&nbsp;${option}</label><br>`;
          });
        }
        mcqContainerDiv.appendChild(mcqContainer);
      });
    }

    // 10. Y/N/NG
    if (qType === "y/n/ng") {
      const YNContainerDIV = groupDiv.querySelector(".Yes-no-notGiven");
      question.questions.forEach((q, idx) => {
        const YNContainer = document.createElement("div");
        YNContainer.classList.add("YN");
        YNContainer.innerHTML = `<p><strong>${question.id[idx]}</strong> ${q}</p>
          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="YES">&nbsp;&nbsp;YES</label>
          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="NO">&nbsp;&nbsp;NO</label>
          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[idx]}" data-question-id="${question.id[idx]}" value="NOT GIVEN">&nbsp;&nbsp;NOT GIVEN</label>`;
        YNContainerDIV.appendChild(YNContainer);
      });
    }

    // 11. Table Completion
    if (qType === "table-completion") {
      const tableContainer = groupDiv.querySelector(".table-container");
      const table = document.createElement("table");
      table.className = "table table-bordered";

      if (question.headers && question.headers.length > 0) {
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");
        question.headers.forEach(h => {
          const th = document.createElement("th");
          th.textContent = h;
          tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
      }

      if (question.rows && question.rows.length > 0) {
        const tbody = document.createElement("tbody");
        question.rows.forEach(row => {
          const tr = document.createElement("tr");
          row.forEach(cell => {
            const td = document.createElement("td");
            td.innerHTML = cell.replaceAll(/\[blank\]/gi, `<input spellcheck="false" type="text" class="blank-input">`);
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
      }
      tableContainer.appendChild(table);

      const inputs = tableContainer.querySelectorAll("input.blank-input");
      inputs.forEach((input, idx) => {
        if (question.id[idx]) {
          input.setAttribute("placeholder", question.id[idx]);
          input.setAttribute("data-question-id", question.id[idx]);
        }
      });
    }
  });

  // Attach Answer Listeners for Navigation Buttons
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

// Answer Evaluation & Review Renderer
function renderCorrectAnswers() {
  const createExplanationBox = (qid) => {
    const idKey = String(qid);
    if (typeof answerExplanations !== "undefined" && answerExplanations && answerExplanations[idKey]) {
      const expDiv = document.createElement("div");
      expDiv.className = `explanation-card exp-card-${idKey}`;
      expDiv.style.cssText = `
        margin-top: 10px;
        padding: 12px 16px;
        border-radius: 8px;
        background-color: #f0fdf4;
        border-left: 4px solid #16a34a;
        font-size: 0.92rem;
        color: #166534;
        line-height: 1.55;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      `;

      const rawText = answerExplanations[idKey];
      const expText = Array.isArray(rawText) ? rawText[0] : rawText;

      expDiv.innerHTML = `
        <div style="font-weight: 700; color: #15803d; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 1rem;">💡</span> <span>Answer Explanation (Q${idKey}):</span>
        </div>
        <div style="color: #1f2937;">${expText}</div>
      `;
      return expDiv;
    }
    return null;
  };

  let score = 0;
  const totalQuestions = (typeof answers !== "undefined" && answers) ? Object.keys(answers).length : 0;

  const appendExpOnce = (parentContainer, qid) => {
    if (!parentContainer) return;
    const idKey = String(qid);
    if (!parentContainer.querySelector(`.exp-card-${idKey}`)) {
      const expBox = createExplanationBox(idKey);
      if (expBox) parentContainer.appendChild(expBox);
    }
  };

  // 1. Text Inputs & Blanks
  document.querySelectorAll("input.blank-input").forEach((input) => {
    const qid = String(input.getAttribute("data-question-id") || input.getAttribute("placeholder") || "");
    if (!qid || !answers || !answers[qid]) return;

    const userVal = input.value.trim().toLowerCase();
    const correctList = answers[qid].map((v) => String(v).trim().toLowerCase());
    const isCorrect = correctList.includes(userVal);

    if (isCorrect) {
      score++;
      input.style.borderColor = "#16a34a";
      input.style.backgroundColor = "#dcfce7";
      input.style.color = "#166534";
      input.style.fontWeight = "600";
    } else {
      input.style.borderColor = "#dc2626";
      input.style.backgroundColor = "#fee2e2";
      input.style.color = "#991b1b";
      input.style.fontWeight = "600";
    }

    const parentElem = input.closest("li") || input.closest("p") || input.parentElement;
    if (parentElem && !parentElem.querySelector(`.badge-ans-${qid}`)) {
      const ansBadge = document.createElement("span");
      ansBadge.className = `badge ${isCorrect ? "bg-success" : "bg-danger"} ms-2 badge-ans-${qid}`;
      ansBadge.style.fontSize = "0.85rem";
      ansBadge.textContent = `[Ans: ${answers[qid][0]}]`;
      input.after(ansBadge);
      appendExpOnce(parentElem, qid);
    }
    input.disabled = true;
  });

  // 2. Select Dropdowns (Matching info & Headings)
  document.querySelectorAll("select.matching-information, .matching-container select").forEach((select) => {
    const qid = String(select.getAttribute("data-question-id") || select.id || "");
    if (!qid || !answers || !answers[qid]) return;

    const userVal = select.value.trim().toLowerCase();
    const correctList = answers[qid].map((v) => String(v).trim().toLowerCase());
    const isCorrect = correctList.includes(userVal);

    if (isCorrect) {
      score++;
      select.style.borderColor = "#16a34a";
      select.style.backgroundColor = "#dcfce7";
    } else {
      select.style.borderColor = "#dc2626";
      select.style.backgroundColor = "#fee2e2";
    }

    const parentElem = select.closest(".matching-feature-question") || select.closest(".matching-info-question") || select.closest(".heading-question-item") || select.parentElement;
    if (parentElem && !parentElem.querySelector(`.badge-ans-${qid}`)) {
      const ansBadge = document.createElement("span");
      ansBadge.className = `badge ${isCorrect ? "bg-success" : "bg-danger"} ms-2 badge-ans-${qid}`;
      ansBadge.style.fontSize = "0.85rem";
      ansBadge.textContent = `[Ans: ${answers[qid][0].toUpperCase()}]`;
      select.after(ansBadge);
      appendExpOnce(parentElem, qid);
    }
    select.disabled = true;
  });

  // 3. Radios & Checkboxes
  if (typeof answers !== "undefined" && answers) {
    Object.keys(answers).forEach((qid) => {
      const idKey = String(qid);
      const correctChoices = answers[idKey].map((v) => String(v).trim().toLowerCase());
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

        const container = input.closest("label") || input.parentElement;
        if (!questionWrapper) {
          questionWrapper = input.closest(".TF") || input.closest(".YN") || input.closest(".mcq") || container.parentElement;
        }

        if (isCorrect && container) {
          container.style.color = "#16a34a";
          container.style.fontWeight = "700";
        } else if (isChecked && !isCorrect && container) {
          container.style.color = "#dc2626";
          container.style.fontWeight = "700";
        }
        input.disabled = true;
      });

      if (questionWrapper && !questionWrapper.querySelector(`.badge-ans-${idKey}`)) {
        const resultDiv = document.createElement("div");
        resultDiv.className = `mt-2 badge-ans-${idKey}`;
        resultDiv.innerHTML = `
          <span class="badge ${pointAwarded ? "bg-success" : "bg-danger"}" style="font-size: 0.85rem;">
            ${pointAwarded ? "✓ Correct" : "✗ Incorrect"} (Official Ans: ${answers[idKey][0].toUpperCase()})
          </span>
        `;
        questionWrapper.appendChild(resultDiv);
        appendExpOnce(questionWrapper, idKey);
      }
    });
  }

  // 4. Retry Button
  const finishBtn = document.getElementById("finishBtn");
  if (finishBtn) {
    const retryBtn = document.createElement("button");
    retryBtn.innerHTML = "🔄 Retry Practice";
    retryBtn.className = "btn btn-outline-primary btn-sm fw-bold px-3 py-2";
    retryBtn.onclick = () => window.location.reload();
    finishBtn.parentNode.replaceChild(retryBtn, finishBtn);
  }

  showScore(score, totalQuestions);
}

// Navigation Tracking & Utilities
function getQuestionElementById(qid) {
  return document.querySelector(`[data-question-id="${qid}"], [id="${qid}"]`);
}

function isQuestionAnswered(qid) {
  const textInput = document.querySelector(`input[type="text"][data-question-id="${qid}"], input[type="text"][placeholder="${qid}"]`);
  if (textInput && textInput.value.trim() !== "") return true;

  const inputsByName = document.querySelectorAll(`input[name="${qid}"]`);
  for (const el of inputsByName) {
    if ((el.type === "radio" || el.type === "checkbox") && el.checked) return true;
  }

  const select = document.getElementById(qid);
  if (select && select.value && select.value.trim() !== "") return true;

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

  document.querySelectorAll("select").forEach((sel) => {
    sel.addEventListener("change", () => {
      const id = sel.id || sel.getAttribute("name");
      if (id) updateQNavState(String(id));
    });
  });
}

async function initializeApp() {
  await main();
}

document.addEventListener("DOMContentLoaded", initializeApp);