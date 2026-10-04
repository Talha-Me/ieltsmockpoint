// //part vars
// let totalParts = 2;
// let currentPart = 1;
// const nextButton = document.getElementById("next-button");
// const prevButton = document.getElementById("previous-button");
// // ফাইনাল ফুল মক কমপ্রিহেনসিভ রেজাল্ট মডাল
// function showFinalComprehensiveResultModal(writingData) {
//   const existingModal = document.getElementById("instant-result-modal");
//   if (existingModal) existingModal.remove();

//   // ১. পূর্ববর্তী মডিউলের স্কোর ও মিস্টেক্স সংগ্রহ
//   const listeningScore = sessionStorage.getItem("listeningScore") || localStorage.getItem("listeningScore") || "0";
//   const readingScore = sessionStorage.getItem("readingScore") || localStorage.getItem("readingScore") || "0";

//   let listeningMistakes = {};
//   let readingMistakes = {};

//   try {
//     const rawL = sessionStorage.getItem("listeningMistakes") || localStorage.getItem("listeningMistakes");
//     if (rawL) listeningMistakes = JSON.parse(rawL);
//   } catch (e) { console.error("Error reading listening mistakes:", e); }

//   try {
//     const rawR = sessionStorage.getItem("readingMistakes") || localStorage.getItem("readingMistakes");
//     if (rawR) readingMistakes = JSON.parse(rawR);
//   } catch (e) { console.error("Error reading reading mistakes:", e); }

//   // ২. লিসেনিং রিভিউ
//   let listeningReviewHtml = "";
//   if (Array.isArray(listeningMistakes) && listeningMistakes.length > 0) {
//     listeningMistakes.forEach((m) => {
//       listeningReviewHtml += `
//         <li style="margin-bottom: 8px; padding: 10px; background: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 6px;">
//           <div style="font-weight: 600; color: #2d3748; font-size: 13px;">Question ${m.questionNo || m.index || 'N/A'}</div>
//           <div style="font-size: 12.5px;">Your Answer: <span style="color: #c53030; font-weight: 600;">${m.userAnswer || "Not Answered"}</span> | Correct: <strong style="color: #2f855a;">${m.correctAnswer}</strong></div>
//         </li>
//       `;
//     });
//   } else if (typeof listeningMistakes === 'object' && Object.keys(listeningMistakes).length > 0) {
//     Object.keys(listeningMistakes).forEach((key) => {
//       const item = listeningMistakes[key];
//       listeningReviewHtml += `
//         <li style="margin-bottom: 8px; padding: 10px; background: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 6px;">
//           <div style="font-weight: 600; color: #2d3748; font-size: 13px;">Question ${key}</div>
//           <div style="font-size: 12.5px;">Your Answer: <span style="color: #c53030; font-weight: 600;">${item["Your answer"] || "Not Answered"}</span> | Correct: <strong style="color: #2f855a;">${item["Correct answer"]}</strong></div>
//         </li>
//       `;
//     });
//   } else {
//     listeningReviewHtml = '<p style="color: #2f855a; font-weight: 600; margin: 6px 0;">🎉 All listening answers were correct or test was skipped!</p>';
//   }

//   // ৩. রিডিং রিভিউ
//   let readingReviewHtml = "";
//   const readingKeys = Object.keys(readingMistakes || {});
//   if (readingKeys.length > 0) {
//     readingKeys.forEach((key) => {
//       const item = readingMistakes[key];
//       const yourAns = Array.isArray(item["Your answer"]) ? item["Your answer"].join(", ") : (item["Your answer"] || "Not Answered");
//       const correctAns = Array.isArray(item["Correct answer"]) ? item["Correct answer"].join(", ") : (item["Correct answer"] || "");

//       readingReviewHtml += `
//         <li style="margin-bottom: 8px; padding: 10px; background: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 6px;">
//           <div style="font-weight: 600; color: #2d3748; font-size: 13px;">Question ${key}</div>
//           <div style="font-size: 12.5px;">Your Answer: <span style="color: #c53030; font-weight: 600;">${yourAns || "Not Answered"}</span> | Correct: <strong style="color: #2f855a;">${correctAns}</strong></div>
//         </li>
//       `;
//     });
//   } else {
//     readingReviewHtml = '<p style="color: #2f855a; font-weight: 600; margin: 6px 0;">🎉 All reading answers were correct or test was skipped!</p>';
//   }

//   // ৪. রাইটিং লেখা ফরম্যাটিং
//   let task1Text = "No writing recorded.";
//   let task2Text = "No writing recorded.";

//   if (typeof writingData === 'object' && writingData !== null) {
//     task1Text = writingData["part-1"] || writingData.task1 || writingData[0] || "";
//     task2Text = writingData["part-2"] || writingData.task2 || writingData[1] || "";
//   } else if (typeof writingData === 'string') {
//     task1Text = writingData;
//   }

//   const aiPromptTask1 = `Please evaluate my IELTS Academic Writing Task 1 essay based on official IELTS assessment criteria: Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy. Give me an estimated Band Score, point out mistakes, and suggest a Band 8+ version.\n\nEssay:\n${task1Text}`;
//   const aiPromptTask2 = `Please evaluate my IELTS Academic Writing Task 2 essay based on official IELTS assessment criteria: Task Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy. Give me an estimated Band Score, highlight grammatical errors, and suggest improvements for a higher band.\n\nEssay:\n${task2Text}`;

//   const modalHtml = `
//     <div id="instant-result-modal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
//       <div style="background: #ffffff; border-radius: 14px; max-width: 850px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.35);">
        
//         <!-- হেডার ও স্কোর বোর্ড -->
//         <div style="background: #0f172a; color: white; padding: 25px 20px; text-align: center;">
//           <h2 style="margin: 0; font-size: 22px; font-weight: 700;">🎓 Full Mock Test Completed!</h2>
//           <p style="margin: 6px 0 0; opacity: 0.85; font-size: 13.5px;">Here is your overall performance summary</p>
          
//           <div style="display: flex; justify-content: center; gap: 20px; margin-top: 18px; flex-wrap: wrap;">
//             <div style="background: rgba(255,255,255,0.08); padding: 12px 25px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
//               <div style="font-size: 12px; opacity: 0.8; text-transform: uppercase;">Listening</div>
//               <div style="font-size: 28px; font-weight: 800; color: #38bdf8;">${listeningScore} / 40</div>
//             </div>
//             <div style="background: rgba(255,255,255,0.08); padding: 12px 25px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
//               <div style="font-size: 12px; opacity: 0.8; text-transform: uppercase;">Reading</div>
//               <div style="font-size: 28px; font-weight: 800; color: #4ade80;">${readingScore} / 40</div>
//             </div>
//             <div style="background: rgba(255,255,255,0.08); padding: 12px 25px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
//               <div style="font-size: 12px; opacity: 0.8; text-transform: uppercase;">Writing</div>
//               <div style="font-size: 18px; font-weight: 700; color: #facc15; margin-top: 6px;">AI Evaluation</div>
//             </div>
//           </div>
//         </div>

//         <!-- ডিটেইলস এরিয়া -->
//         <div style="padding: 22px 25px; overflow-y: auto; flex: 1; background: #f8fafc;">
          
//           <!-- রাইটিং মূল্যায়ন ও কপি সেকশন -->
//           <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 22px;">
//             <h3 style="margin-top: 0; color: #1e293b; font-size: 17px;">
//               ✍️ Writing Self-Evaluation with AI
//             </h3>
//             <p style="color: #64748b; font-size: 13.5px; line-height: 1.5; margin: 6px 0 16px;">
//               নিচের লেখাগুলো কপি করে <strong>ChatGPT</strong> বা <strong>Gemini</strong>-তে পেস্ট করুন। রেডিমেড প্রম্পটসহ আপনার ব্যান্ড স্কোর ও ব্যাকরণগত ভুলের বিস্তারিত রিপোর্ট পেয়ে যাবেন।
//             </p>

//             <!-- Task 1 Box -->
//             <div style="margin-bottom: 16px;">
//               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
//                 <span style="font-weight: 600; font-size: 13.5px; color: #334155;">Task 1 Response:</span>
//                 <button id="copy-task1-btn" style="padding: 6px 14px; background: #2563eb; color: white; border: none; border-radius: 5px; font-size: 12px; font-weight: 600; cursor: pointer;">
//                   Copy with AI Prompt
//                 </button>
//               </div>
//               <textarea readonly style="width: 100%; height: 95px; padding: 10px; font-size: 13px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f1f5f9; color: #1e293b; box-sizing: border-box; resize: vertical;">${task1Text}</textarea>
//             </div>

//             <!-- Task 2 Box -->
//             <div>
//               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
//                 <span style="font-weight: 600; font-size: 13.5px; color: #334155;">Task 2 Response:</span>
//                 <button id="copy-task2-btn" style="padding: 6px 14px; background: #2563eb; color: white; border: none; border-radius: 5px; font-size: 12px; font-weight: 600; cursor: pointer;">
//                   Copy with AI Prompt
//                 </button>
//               </div>
//               <textarea readonly style="width: 100%; height: 110px; padding: 10px; font-size: 13px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f1f5f9; color: #1e293b; box-sizing: border-box; resize: vertical;">${task2Text}</textarea>
//             </div>
//           </div>

//           <!-- লিসেনিং ও রিডিং ভুল পর্যালোচনার লিস্ট -->
//           <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
//             <h3 style="margin-top: 0; color: #1e293b; font-size: 16px; margin-bottom: 14px;">🔍 Answer Review</h3>
            
//             <h4 style="margin: 0 0 10px; color: #334155; font-size: 14.5px;">🎧 Listening Mistakes:</h4>
//             <ul style="list-style: none; padding: 0; margin: 0 0 18px;">${listeningReviewHtml}</ul>

//             <h4 style="margin: 0 0 10px; color: #334155; font-size: 14.5px;">📖 Reading Mistakes:</h4>
//             <ul style="list-style: none; padding: 0; margin: 0;">${readingReviewHtml}</ul>
//           </div>

//         </div>

//         <!-- ফুটার বাটন -->
//         <div style="padding: 16px 25px; background: #ffffff; text-align: right; border-top: 1px solid #e2e8f0;">
//           <button id="finish-mock-home-btn" style="padding: 11px 26px; background: #0f172a; color: white; border: none; border-radius: 7px; font-size: 14px; font-weight: 600; cursor: pointer;">
//             Finish & Back to Home
//           </button>
//         </div>

//       </div>
//     </div>
//   `;

//   document.body.insertAdjacentHTML("beforeend", modalHtml);

//   // ক্লিপবোর্ডে কপি হ্যান্ডলার
//   document.getElementById("copy-task1-btn").addEventListener("click", function() {
//     navigator.clipboard.writeText(aiPromptTask1).then(() => {
//       this.textContent = "Copied! ✓";
//       setTimeout(() => { this.textContent = "Copy with AI Prompt"; }, 2000);
//     });
//   });

//   document.getElementById("copy-task2-btn").addEventListener("click", function() {
//     navigator.clipboard.writeText(aiPromptTask2).then(() => {
//       this.textContent = "Copied! ✓";
//       setTimeout(() => { this.textContent = "Copy with AI Prompt"; }, 2000);
//     });
//   });

//   document.getElementById("finish-mock-home-btn").addEventListener("click", () => {
//     sessionStorage.clear();
//     localStorage.removeItem("listeningScore");
//     localStorage.removeItem("listeningMistakes");
//     localStorage.removeItem("readingScore");
//     localStorage.removeItem("readingMistakes");
//     window.location.href = "/select-mock";
//   });
// }

// async function submitTest() {
//   sessionStorage.setItem("writingIsCompleted", "true");
//   const writingInputToSend = typeof gatherInput === "function" ? gatherInput(inputs) : {};

//   try {
//     await fetch('/api/update-mock-info', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ writingInputs: writingInputToSend, mod: "writing" })
//     });
//   } catch (err) {
//     console.error("Writing submission error:", err);
//   }

//   showFinalComprehensiveResultModal(writingInputToSend);
// }

// async function userData() {
//   const res = await fetch("/api/user-data");
//   if (res.ok) {
//     const data = await res.json();
//     return data;
//   }
// }

// document.addEventListener("DOMContentLoaded", async (e) => {
//   e.preventDefault();
//   const user = await userData();
//   const userDiv = document.getElementById("userID");
//   if (userDiv && user) {
//     userDiv.textContent = user.username;
//   }
// });

// function gatherInput(inputs) {
//   const inputObj = {};
//   inputs.forEach((input, index) => {
//     inputObj[`part-${index + 1}`] = input.value;
//   });
//   return inputObj;
// }

// const submitBtn = document.getElementById("finishBtn");
// const submitModal = document.getElementById("submit-warning-modal");
// if (submitBtn) {
//   submitBtn.addEventListener("click", async function (e) {
//     e.preventDefault();
//     if (submitModal) submitModal.style.display = "flex";
//   });
// }

// const submitOkButton = document.getElementById("submit-ok-btn");
// const submitStayButton = document.getElementById("submit-stay-btn");

// if (submitOkButton) {
//   submitOkButton.addEventListener("click", async (e) => {
//     e.preventDefault();
//     if (submitModal) submitModal.style.display = "none";
//     await submitTest();
//   });
// }

// if (submitStayButton) {
//   submitStayButton.addEventListener("click", async (e) => {
//     e.preventDefault();
//     if (submitModal) submitModal.style.display = "none";
//   });
// }

// window.addEventListener("keydown", function (e) {
//   if (e.key === "F3" || (e.ctrlKey && e.key === "f") || (e.ctrlKey && e.key === "F")) {
//     e.preventDefault();
//   }
// });

// // Fullscreen check
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

// // Popup settings logic
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

// // Popup to start writing
// function openListeningPopup() {
//   document.getElementById("listeningOverlay").style.display = "flex";
//   document.body.classList.add("listening-popup-active");
// }

// function closeListeningPopup() {
//   const overlay = document.getElementById("listeningOverlay");
//   overlay.style.display = "none";
//   document.body.classList.remove("listening-popup-active");

//   const elem = document.documentElement;
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen().catch((err) => console.warn("Fullscreen blocked:", err));
//   }

//   const timer = document.getElementById("timer");
//   let minutesRemaining = parseInt(timer.textContent);

//   const interval = setInterval(async () => {
//     minutesRemaining -= 1;

//     if (minutesRemaining <= 10) {
//       const timerBlunt = document.querySelector(".timer-blunt");
//       const timerSpecific = document.querySelector(".timer-specific");
//       if (timerSpecific) {
//         timerSpecific.style.opacity = 1;
//         timerSpecific.style.color = "red";
//       }
//       if (timerBlunt) timerBlunt.style.opacity = 0;
//     }
//     if (minutesRemaining <= 0) {
//       timer.textContent = '0';
//       await submitTest();
//       clearInterval(interval);
//     } else {
//       timer.textContent = minutesRemaining;
//     }
//   }, 1 * 60 * 1000);



// //timer logic (timer specific)

// const minutesDisplay = document.getElementById("minutes");
// const secondsDisplay = document.getElementById("seconds");
// let timerSpecific;
// let totalSeconds = 60 * 60
// function updateTimerDisplay(){
//   let minutes = Math.floor(totalSeconds / 60);
//   let seconds = totalSeconds % 60;
//   minutesDisplay.textContent = String(minutes).padStart(2, "0");
//   secondsDisplay.textContent = String(seconds).padStart(2, "0");
// }

// function startTimer(){
//   timerSpecific = setInterval(function (){
//     if(totalSeconds <= 0){
//       clearInterval(timerSpecific);
//     }else{
//       totalSeconds--;
//       updateTimerDisplay()
//     }
//   }, 1000);
// }

// startTimer();
//   }
//   openListeningPopup()
// //popup to start writing


// //part logic
// function showPart(part){
//   for (let i=1; i <= totalParts; i++){
//     document.getElementById(`part-${i}`).style.display = i === part ?
//     "block" : "none";
//   }
//   currentPart = part;
  
// }



// function showNext(event){
//   event.preventDefault();
//   if(currentPart < totalParts){
//     currentPart++;
//     showPart(currentPart);
//   }
// }

// function showPrevious(event){
//   event.preventDefault()
//   if(currentPart > 1){
//     currentPart--;
//     showPart(currentPart);
//   }
// }

// function update(){
//   if(currentPart == 2){
//     nextButton.classList.add("bton-grey");
//     nextButton.classList.remove("next");
//     //console.log(currentPart);
//   }else{
//     nextButton.classList.add("next");
//   }
//   if(currentPart == 1){
//     prevButton.classList.add("bton-grey");
//     prevButton.classList.remove("prev");
//   }else{
//     prevButton.classList.add("prev");
//   }
// }

// setInterval(update, 1);



// //timer logic

// const timer = document.getElementById("timer");

// let minutesRemaining = parseInt(timer.textContent);


// const interval = setInterval(()=>{
//   minutesRemaining -= 2;

//   if(minutesRemaining <= 0){
//     timer.textContent = '0';
//     document.querySelector('[name="submit-button"]').click();
//     clearInterval(interval);
//   }else{
//     timer.textContent = minutesRemaining;
//   }
// }, 2 * 60 * 1000);


// //timer logic (timer specific)

// const minutesDisplay = document.getElementById("minutes");
// const secondsDisplay = document.getElementById("seconds");
// let timerSpecific;
// let totalSeconds = 60 * 60
// function updateTimerDisplay(){
//   let minutes = Math.floor(totalSeconds / 60);
//   let seconds = totalSeconds % 60;
//   minutesDisplay.textContent = String(minutes).padStart(2, "0");
//   secondsDisplay.textContent = String(seconds).padStart(2, "0");
// }

// function startTimer(){
//   timerSpecific = setInterval(function (){
//     if(totalSeconds <= 0){
//       clearInterval(timerSpecific);
//     }else{
//       totalSeconds--;
//       updateTimerDisplay()
//     }
//   }, 1000);
// }

// startTimer(); 





// //word count logic

//     //part 1
//     const textarea = document.getElementById('writer-1');
//     const wordCountDisplay = document.getElementById('wordCount-1');

//     textarea.addEventListener('input', () => {
//       const text = textarea.value.trim();
//       const wordCount = text === '' ? 0 : text.split(/\s+/).length;
//       wordCountDisplay.textContent = `Word Count: ${wordCount}`;
//     });


//     //part 2

//     const textArea2 = document.getElementById('writer-2');
//     const wordCountDisplay2 = document.getElementById("wordCount-2");

//     textArea2.addEventListener('input', () => {
//       const text = textArea2.value.trim();
//       const wordCount = text === '' ? 0 : text.split(/\s+/).length;
//       wordCountDisplay2.textContent = `Word Count: ${wordCount}`;
//     });

// const questionData = localStorage.getItem("data");
// const parsedQuestions = JSON.parse(questionData);


// const questions = parsedQuestions.writing.questions;



// questions.forEach((q, index)=>{
//     if(q.part == 1){
//         const infoPanel = document.getElementById("info-panel-1");
//         const imageContainer = document.createElement("div");
//         imageContainer.classList.add("image-container");

//         q.image.forEach((img, idx)=>{
//             imageContainer.innerHTML += `<img src="${img}">`
//         })
//         infoPanel.innerHTML += `
//                             <p>${q.question}</p>
//         `
//         infoPanel.appendChild(imageContainer);
//     }

//     if(q.part == 2){
//         const infoPanel = document.getElementById("info-panel-2");

//         infoPanel.innerHTML += `
//                         <p>${q.question}</p>
//         `
//     }
// })


// const inputs = document.querySelectorAll(".write-input")




// document.addEventListener("wheel", function (e) {
//   if (e.ctrlKey) {
//     e.preventDefault();
//   }
// }, { passive: false });


// document.addEventListener("keydown", function (e) {
//   if (e.ctrlKey && (
//     e.key === "+" ||
//     e.key === "-" ||
//     e.key === "=" ||
//     e.key === "0"
//   )) {
//     e.preventDefault();
//   }
// });







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

    .bc-result-footer { position: sticky; bottom: 0; background: #fff; border-top: 3px solid #d52b1e; padding: 14px 16px; text-align: center; box-shadow: 0 -6px 18px rgba(0,0,0,.08); }
    .bc-result-footer .bc-btn { flex: none; min-width: 260px; }

    @media (max-width: 700px) {
      .bc-score-grid { grid-template-columns: 1fr; }
      .bc-review-body { grid-template-columns: 1fr; }
      .bc-result-header h1 { font-size: 22px; }
      .bc-steps { grid-template-columns: 1fr; }
      .bc-module-tab { font-size: 13px; padding: 12px 6px; }
      .bc-writing-card .bc-btn { width: 100%; }
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

function buildScoreCardHtml(title, results, total) {
  const hasData = results.length > 0;
  const correct = results.filter((r) => r.isCorrect).length;
  const unanswered = results.filter((r) => !r.answered).length;
  const incorrect = Math.max(0, results.length - correct - unanswered);
  const deg = hasData ? Math.round((correct / total) * 360) : 0;
  return `
    <div class="bc-score-card">
      <div class="bc-ring" style="background: conic-gradient(#0a2a6e 0deg ${deg}deg, #f3c9c6 ${deg}deg 360deg);">
        <div class="bc-ring-inner">
          <div class="bc-ring-score">${hasData ? correct : "N/A"}</div>
          <div class="bc-ring-total">out of ${total}</div>
        </div>
      </div>
      <div class="bc-score-info">
        <h3>${title}</h3>
        <div class="bc-stats">
          <div class="bc-stat bc-stat-ok"><b>${hasData ? correct : "-"}</b><span>Correct</span></div>
          <div class="bc-stat bc-stat-bad"><b>${hasData ? incorrect : "-"}</b><span>Wrong</span></div>
          <div class="bc-stat bc-stat-skip"><b>${hasData ? unanswered : "-"}</b><span>Empty</span></div>
        </div>
      </div>
    </div>`;
}

// ==========================================
// WRITING HELPERS (word count, prompt, copy)
// ==========================================
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
    <div class="bc-task-card">
      <div class="bc-task-head">
        <h4>Writing Task ${t.no}</h4>
        <span class="bc-wc ${low ? "low" : "ok"}">${t.words} words &middot; min ${t.min}</span>
      </div>
      ${questionHtml}
      ${essayHtml}
      <div class="bc-task-actions">
        <button type="button" class="bc-act primary" data-act="prompt" data-task="${t.no}" ${dis}>Copy Prompt + Essay</button>
        <button type="button" class="bc-act" data-act="essay" data-task="${t.no}" ${dis}>Copy Essay Only</button>
        <button type="button" class="bc-act" data-act="chatgpt" data-task="${t.no}" ${dis}>Copy &amp; Open ChatGPT</button>
        <button type="button" class="bc-act" data-act="gemini" data-task="${t.no}" ${dis}>Copy &amp; Open Gemini</button>
      </div>
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

  // ---- Writing data ----
  const tasks = getWritingTasks(writingData);

  const username = (document.getElementById("userID") && document.getElementById("userID").textContent.trim()) || "";
  const subtitle = reason === "timeup"
    ? "Writing time ended &mdash; your answers were submitted automatically"
    : "Listening, Reading and Writing";

  const penIcon = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;

  const html = `
    <div id="instant-result-modal" class="bc-result">
      <div class="bc-result-header">
        <h1>Full Mock Test Results</h1>
        <p>${username ? "Candidate: " + escapeHtml(username) + " &nbsp;|&nbsp; " : ""}${subtitle}</p>
        <div class="bc-total-pill">Listening + Reading: ${totalCorrect} / ${totalQuestions}</div>
      </div>

      <div class="bc-result-wrap">
        <div class="bc-score-grid">
          ${buildScoreCardHtml("Listening", listeningResults, TOTAL)}
          ${buildScoreCardHtml("Reading", readingResults, TOTAL)}
          <div class="bc-writing-card">
            <div class="bc-wc-left">
              <div class="bc-wc-icon">${penIcon}</div>
              <div>
                <h3>Writing</h3>
                <p>Task 1: ${tasks[0].words} words &nbsp;&middot;&nbsp; Task 2: ${tasks[1].words} words</p>
              </div>
            </div>
            <button id="bc-goto-writing" class="bc-btn bc-btn-red" type="button">Evaluate with AI &darr;</button>
          </div>
        </div>

        <div class="bc-module-tabs">
          <button type="button" class="bc-module-tab" data-module="listening">Listening Answers</button>
          <button type="button" class="bc-module-tab" data-module="reading">Reading Answers</button>
          <button type="button" class="bc-module-tab active" data-module="writing">Writing &amp; AI</button>
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

  // Copy / Open AI বাটনগুলো (event delegation)
  writingPanel.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("button[data-act]");
    if (!btn || btn.disabled) return;

    const act = btn.getAttribute("data-act");
    const key = btn.getAttribute("data-task");

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
  document.getElementById("listeningOverlay").style.display = "flex";
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

const questionData = localStorage.getItem("data");
const parsedQuestions = JSON.parse(questionData);


const questions = parsedQuestions.writing.questions;



questions.forEach((q, index)=>{
    if(q.part == 1){
        const infoPanel = document.getElementById("info-panel-1");
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        q.image.forEach((img, idx)=>{
            imageContainer.innerHTML += `<img src="${img}">`
        })
        infoPanel.innerHTML += `
                            <p>${q.question}</p>
        `
        infoPanel.appendChild(imageContainer);
    }

    if(q.part == 2){
        const infoPanel = document.getElementById("info-panel-2");

        infoPanel.innerHTML += `
                        <p>${q.question}</p>
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