// //part vars
// let totalParts = 3;
// let currentPart = 1;
// const nextButton = document.getElementById("next-button");
// const prevButton = document.getElementById("previous-button");

// // লিসেনিং + রিডিং স্কোর ও উভয় মডিউলের ভুলের লিস্ট দেখানোর মডাল
// function showReadingResultModal(score, mistakes) {
//   const existingModal = document.getElementById("instant-result-modal");
//   if (existingModal) existingModal.remove();

//   const listeningScore = sessionStorage.getItem("listeningScore") || localStorage.getItem("listeningScore") || "N/A";
  
//   // স্টোরেজ থেকে লিসেনিংয়ের ভুলগুলো আনা
//   let storedListeningMistakes = {};
//   try {
//     const rawMistakes = sessionStorage.getItem("listeningMistakes") || localStorage.getItem("listeningMistakes");
//     if (rawMistakes) storedListeningMistakes = JSON.parse(rawMistakes);
//   } catch (e) {
//     console.error("Error parsing listening mistakes:", e);
//   }

//   // লিসেনিং ভুলের লিস্ট তৈরি
//   let listeningMistakeHtml = "";
//   if (Array.isArray(storedListeningMistakes) && storedListeningMistakes.length > 0) {
//     storedListeningMistakes.forEach((m) => {
//       listeningMistakeHtml += `
//         <li style="margin-bottom: 8px; padding: 8px 10px; background: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 6px;">
//           <div style="font-weight: 600; color: #2d3748; font-size: 13px;">Question ${m.questionNo || m.index || 'N/A'}</div>
//           <div style="font-size: 12.5px;">Your Answer: <span style="color: #c53030; font-weight: 600;">${m.userAnswer || "Not Answered"}</span> | Correct: <strong style="color: #2f855a;">${m.correctAnswer}</strong></div>
//         </li>
//       `;
//     });
//   } else if (typeof storedListeningMistakes === 'object' && Object.keys(storedListeningMistakes).length > 0) {
//     Object.keys(storedListeningMistakes).forEach((key) => {
//       const item = storedListeningMistakes[key];
//       listeningMistakeHtml += `
//         <li style="margin-bottom: 8px; padding: 8px 10px; background: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 6px;">
//           <div style="font-weight: 600; color: #2d3748; font-size: 13px;">Question ${key}</div>
//           <div style="font-size: 12.5px;">Your Answer: <span style="color: #c53030; font-weight: 600;">${item["Your answer"] || "Not Answered"}</span> | Correct: <strong style="color: #2f855a;">${item["Correct answer"]}</strong></div>
//         </li>
//       `;
//     });
//   } else {
//     listeningMistakeHtml = '<p style="color: #2f855a; font-size: 13px; font-weight: 600; margin: 4px 0;">🎉 All listening answers were correct or not recorded!</p>';
//   }

//   // রিডিং ভুলের লিস্ট তৈরি
//   let readingMistakeHtml = "";
//   const readingMistakeKeys = Object.keys(mistakes || {});
//   if (readingMistakeKeys.length > 0) {
//     readingMistakeKeys.forEach((key) => {
//       const item = mistakes[key];
//       const yourAns = Array.isArray(item["Your answer"]) ? item["Your answer"].join(", ") : (item["Your answer"] || "Not Answered");
//       const correctAns = Array.isArray(item["Correct answer"]) ? item["Correct answer"].join(", ") : (item["Correct answer"] || "");

//       readingMistakeHtml += `
//         <li style="margin-bottom: 8px; padding: 8px 10px; background: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 6px;">
//           <div style="font-weight: 600; color: #2d3748; font-size: 13px;">Question ${key}</div>
//           <div style="font-size: 12.5px;">Your Answer: <span style="color: #c53030; font-weight: 600;">${yourAns || "Not Answered"}</span> | Correct: <strong style="color: #2f855a;">${correctAns}</strong></div>
//         </li>
//       `;
//     });
//   } else {
//     readingMistakeHtml = '<p style="color: #2f855a; font-size: 13px; font-weight: 600; margin: 4px 0;">🎉 Outstanding! All reading answers are correct!</p>';
//   }

//   const modalHtml = `
//     <div id="instant-result-modal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 99999; font-family: system-ui, -apple-system, sans-serif;">
//       <div style="background: #ffffff; border-radius: 12px; max-width: 600px; width: 92%; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.3);">
        
//         <!-- হেডার ও স্কোর -->
//         <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
//           <h2 style="margin: 0; font-size: 20px; font-weight: 600;">Test Summary</h2>
//           <div style="display: flex; justify-content: center; gap: 20px; margin-top: 14px;">
//             <div style="background: rgba(255,255,255,0.1); padding: 8px 20px; border-radius: 8px;">
//               <div style="font-size: 12px; opacity: 0.85;">Listening Score</div>
//               <div style="font-size: 24px; font-weight: bold; color: #63b3ed;">${listeningScore} / 40</div>
//             </div>
//             <div style="background: rgba(255,255,255,0.1); padding: 8px 20px; border-radius: 8px;">
//               <div style="font-size: 12px; opacity: 0.85;">Reading Score</div>
//               <div style="font-size: 24px; font-weight: bold; color: #68d391;">${score} / 40</div>
//             </div>
//           </div>
//         </div>

//         <!-- ভুলের ব্রেকডাউন -->
//         <div style="padding: 16px 20px; overflow-y: auto; flex: 1;">
//           <h4 style="margin: 0 0 8px; color: #2d3748; font-size: 15px; border-bottom: 2px solid #edf2f7; padding-bottom: 4px;">🎧 Listening Mistakes:</h4>
//           <ul style="list-style: none; padding: 0; margin: 0 0 16px;">${listeningMistakeHtml}</ul>

//           <h4 style="margin: 0 0 8px; color: #2d3748; font-size: 15px; border-bottom: 2px solid #edf2f7; padding-bottom: 4px;">📖 Reading Mistakes:</h4>
//           <ul style="list-style: none; padding: 0; margin: 0;">${readingMistakeHtml}</ul>
//         </div>

//         <!-- ফুটার বাটন -->
//         <div style="padding: 14px 20px; background: #f7fafc; text-align: right; border-top: 1px solid #e2e8f0;">
//           <button id="close-result-btn" style="padding: 10px 22px; background: #2b6cb0; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
//             Back to Home
//           </button>
//         </div>

//       </div>
//     </div>
//   `;

//   document.body.insertAdjacentHTML("beforeend", modalHtml);
//   document.getElementById("close-result-btn").addEventListener("click", () => {
//     window.location.href = "/select-mock";
//   });
// }

// // Next Part (Writing) অথবা Quit করার কনফার্মেশন মডাল
// function showMockConfirmationModal(score, mistakes) {
//   const existingConfirm = document.getElementById("mock-confirm-modal");
//   if (existingConfirm) existingConfirm.remove();

//   const confirmHtml = `
//     <div id="mock-confirm-modal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 99999; font-family: system-ui, -apple-system, sans-serif;">
//       <div style="background: white; border-radius: 12px; max-width: 460px; width: 90%; padding: 25px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
//         <h3 style="margin-top: 0; color: #2d3748;">Reading Part Finished!</h3>
//         <p style="color: #4a5568; font-size: 14.5px; margin-bottom: 25px; line-height: 1.5;">
//           আপনি কি পরের পার্ট (Writing)-এ যেতে চান? নাকি এক্সাম Quit করে এখনই রিডিং রেজাল্ট দেখতে চান?
//         </p>
//         <div style="display: flex; gap: 12px; justify-content: center;">
//           <button id="quit-test-btn" style="padding: 10px 18px; background: #e53e3e; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;">
//             Quit & View Result
//           </button>
//           <button id="proceed-writing-btn" style="padding: 10px 20px; background: #3182ce; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
//             Proceed to Writing
//           </button>
//         </div>
//       </div>
//     </div>
//   `;

//   document.body.insertAdjacentHTML("beforeend", confirmHtml);

//   // Quit করলে সরাসরি স্ক্রিনে রেজাল্ট দেখাবে
//   document.getElementById("quit-test-btn").addEventListener("click", () => {
//     document.getElementById("mock-confirm-modal").remove();
//     showReadingResultModal(score, mistakes);
//   });

//   // Proceed দিলে রাইটিংয়ের ইনস্ট্রাকশন ভিডিও পেজে নিয়ে যাবে
//   document.getElementById("proceed-writing-btn").addEventListener("click", () => {
//     window.location.href = "/mock-test";
//   });
// }

// // রিডিং সাবমিট ফাংশন
// async function submitTest() {
//   inputCheckUpdated();
//   sessionStorage.setItem("readingIsCompleted", "true");
//   const [scoreToSend, mistakesToSend] = findDifferences(answerArrayUpdated, answers);
//   // 👉 এই লাইনগুলো যোগ করে দাও:
//   sessionStorage.setItem("readingScore", scoreToSend);
//   localStorage.setItem("readingScore", scoreToSend);
//   sessionStorage.setItem("readingMistakes", JSON.stringify(mistakesToSend));
//   localStorage.setItem("readingMistakes", JSON.stringify(mistakesToSend));

//   // ব্যাকএন্ডে রিডিং স্কোর পাঠানো
//   try {
//     await fetch('/api/update-mock-info', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ score: scoreToSend, mistakes: mistakesToSend, mod: "reading" })
//     });
//   } catch (err) {
//     console.error("Score sync error:", err);
//   }

//   showMockConfirmationModal(scoreToSend, mistakesToSend);
// }

// async function userData() {
//   try {
//     const res = await fetch("/api/user-data");
//     if (res.ok) {
//       const data = await res.json();
//       return data;
//     }
//   } catch (err) {
//     console.error("User data fetch error:", err);
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

// // Input check and fill
// const answerArrayUpdated = {};
// function inputCheckUpdated() {
//   const inputs = document.querySelectorAll("input");
//   inputs.forEach((input) => {
//     if (input.type == "text") {
//       const id = input.placeholder;
//       const answer = input.value.trim();
//       answerArrayUpdated[id] = [answer];
//     }
//     if (input.checked) {
//       const id = input.name;
//       const answer = input.value.trim();
//       answerArrayUpdated[id] = [answer];
//     }
//   });

//   const selectInputs = document.querySelectorAll('.matching-information');
//   selectInputs.forEach((selectedInput) => {
//     const id = selectedInput.id;
//     answerArrayUpdated[id] = [selectedInput.value];
//   });

//   const emptyInitially = document.querySelectorAll('[data-initial="empty"]');
//   emptyInitially.forEach((empty) => {
//     const id = empty.id;
//     answerArrayUpdated[id] = [empty.textContent];
//   });
// }

// const mistakes = {};
// function findDifferences(your_answer, realAnswers) {
//   var totalScore = 40;

//   for (const key in realAnswers) {
//     const yourAns = your_answer[key] || [];
//     const realAns = realAnswers[key];

//     const matchFound = yourAns.some((ans) => realAns.includes(ans.toLowerCase()));

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

// setTimeout(inputCheckUpdated, 0.5 * 60 * 1000);

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

// // Stay button re-enters fullscreen
// fullscreenStayBtn.onclick = function() {
//   fullscreenModal.style.display = "none";
//   document.documentElement.requestFullscreen().catch(() => {});
// };

// //fullscreen check





// //popup settings logic
// const popupSettings = document.getElementById("popup-settings");
// const popupNote = document.getElementById("popup-note");
// function settingsMenu(){
//     popupSettings.classList.toggle("menu-visible")
// }

// function closeSettings(){
//     popupSettings.classList.remove("menu-visible")
//     popupNote.classList.remove("menu-visible");
// }

// function openNotes(){
//     popupNote.classList.toggle("menu-visible");
// }
// //popup settings logic

// //popup for starting reading
//   function openListeningPopup() {
//     document.getElementById("listeningOverlay").style.display = "flex";
//     document.body.classList.add("listening-popup-active");
//   }

//   function closeListeningPopup() {
//     const overlay = document.getElementById("listeningOverlay");
//     overlay.style.display = "none";
//     document.body.classList.remove("listening-popup-active");

//     // Try fullscreen (fallback if disallowed)
//     const elem = document.documentElement;
//     if (elem.requestFullscreen) {
//       elem.requestFullscreen().catch(err => console.warn("Fullscreen blocked:", err));
//     }

//     // Resume your site logic (example: play audio if present)
//     //timer logic (timer blunt)

// const timer = document.getElementById("timer");

// let minutesRemaining = parseInt(timer.textContent);


// const interval = setInterval(async()=>{
//   minutesRemaining -= 1;


//   if(minutesRemaining <= 10){
//     const timerBlunt = document.querySelector(".timer-blunt");
//     const timerSpecific = document.querySelector(".timer-specific");

//     timerSpecific.style.opacity = 1;
//     timerSpecific.style.color = "red";
//     timerBlunt.style.opacity = 0;
//   }
//   if(minutesRemaining <= 0){
//     timer.textContent = '0';
//     await submitTest();
//     clearInterval(interval);
//   }else{
//     timer.textContent = minutesRemaining;
//   }
// }, 1 * 60 * 1000);


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
//   openListeningPopup();
// //popup for starting reading


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
//   if(currentPart == 3){
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





// //updating question section
// const questionData = localStorage.getItem("data");
// const parsedQuestionData = JSON.parse(questionData);


// //insert from database
// const passages = parsedQuestionData.reading.passages;
// const questions = parsedQuestionData.reading.questions;
// const instructions = parsedQuestionData.reading.instructions;
// const answers = parsedQuestionData.reading.answers; 
// //insert from database


// const part1Margin = document.getElementById('part-margin-1');
// const part1QuestionSection = document.getElementById('question-section-1');
// const part2Margin = document.getElementById('part-margin-2');
// const part2QuestionSection = document.getElementById('question-section-2');
// const part3Margin = document.getElementById('part-margin-3');
// const part3QuestionSection = document.getElementById('question-section-3');

// const questionContainer = document.getElementById("test-content");


// const seenGroups = new Set();
// const groupCounts = new Map();


// //part-range logic
// let part1IDS = [];
// let part2IDS = [];
// let part3IDS = [];
// questions.forEach((part)=>{
//   if(part.part == 1){
//     part1IDS.push(part.id);
//   }
//   if(part.part == 2){
//     part2IDS.push(part.id);
//   }
//   if(part.part == 3){
//     part3IDS.push(part.id);
//   }
// })
// console.log(findHighest(part1IDS));
// console.log(part2IDS);
// console.log(part3IDS);

// const part1Lowest = findLowest(part1IDS);
// const part1Highest = findHighest(part1IDS);

// const part2Lowest = findLowest(part2IDS);
// const part2Highest = findHighest(part2IDS);

// const part3Lowest = findLowest(part3IDS);
// const part3Highest = findHighest(part3IDS);

// //part-range logic

// //passage logic
// passages.forEach((passage)=>{
//   if(passage.part == 1){
//     const passageScroll = document.getElementById(`passage-scroll-${passage.part}`);

//     const passageSection = document.getElementById(`passage-section-${passage.part}`)
//     const title = document.createElement("h2");
//     title.textContent = passage.title;
//     passageScroll.appendChild(title);
//     passage.paragraphs.forEach((paragraph, index)=>{
//       const paraHeading = document.createElement("div");
//       paraHeading.classList.add("para-heading");
//       paraHeading.setAttribute("id", `para-heading-${paragraph}`);
//       paraHeading.textContent = paragraph;
//       passageScroll.appendChild(paraHeading);
//       passage["paragraph-content"][index].forEach((para)=>{
//         const paraDIV = document.createElement("div");
//         paraDIV.classList.add("para");
//         paraDIV.setAttribute("id", `para-${paragraph}-${passage.part}`);
//         paraDIV.innerHTML = para;
//         passageScroll.appendChild(paraDIV);
//       })
//     })

//     passageSection.appendChild(passageScroll);

//     //part-header
//     const partHeaderDIV = document.getElementById(`part-header-${passage.part}`);
//     const partHeaderP = document.createElement("p");
//     partHeaderP.classList.add("part-header-p");
//     partHeaderP.textContent = `Read the text and answer questions ${part1Lowest} - ${part1Highest}`
//     partHeaderDIV.appendChild(partHeaderP);
//   }

//   if(passage.part == 2){

//     const passageScroll = document.getElementById(`passage-scroll-${passage.part}`);


//     const passageSection = document.getElementById(`passage-section-${passage.part}`)
//     const title = document.createElement("h2");
//     title.textContent = passage.title;
//     passageScroll.appendChild(title);
//     passage.paragraphs.forEach((paragraph, index)=>{
//       const paraHeading = document.createElement("div");
//       paraHeading.classList.add("para-heading");
//       paraHeading.setAttribute("id", `para-heading-${paragraph}`);
//       paraHeading.textContent = paragraph;
//       passageScroll.appendChild(paraHeading);
//       passage["paragraph-content"][index].forEach((para)=>{
//         const paraDIV = document.createElement("div");
//         paraDIV.classList.add("para");
//         paraDIV.setAttribute("id", `para-${paragraph}-${passage.part}`);
//         paraDIV.innerHTML = para;
//         passageScroll.appendChild(paraDIV);
//       })
//     })

//     passageSection.appendChild(passageScroll);


//     //part-header
//     const partHeaderDIV = document.getElementById(`part-header-${passage.part}`);
//     const partHeaderP = document.createElement("p");
//     partHeaderP.classList.add("part-header-p");
//     partHeaderP.textContent = `Read the text and answer questions ${part2Lowest} - ${part2Highest}`
//     partHeaderDIV.appendChild(partHeaderP);
//   }

//   if(passage.part == 3){

//     const passageScroll = document.getElementById(`passage-scroll-${passage.part}`);


//     const passageSection = document.getElementById(`passage-section-${passage.part}`)
//     const title = document.createElement("h2");
//     title.textContent = passage.title;
//     passageScroll.appendChild(title);
//     passage.paragraphs.forEach((paragraph, index)=>{
//       const paraHeading = document.createElement("div");
//       paraHeading.classList.add("para-heading");
//       paraHeading.setAttribute("id", `para-heading-${paragraph}`);
//       paraHeading.textContent = paragraph;
//       passageScroll.appendChild(paraHeading);
//       passage["paragraph-content"][index].forEach((para)=>{
//         const paraDIV = document.createElement("div");
//         paraDIV.classList.add("para");
//         paraDIV.setAttribute("id", `para-${paragraph}-${passage.part}`);
//         paraDIV.innerHTML = para;
//         passageScroll.appendChild(paraDIV);
//       })
//     })

//     passageSection.appendChild(passageScroll);


//     //part-header
//     const partHeaderDIV = document.getElementById(`part-header-${passage.part}`);
//     const partHeaderP = document.createElement("p");
//     partHeaderP.classList.add("part-header-p");
//     partHeaderP.textContent = `Read the text and answer questions ${part3Lowest} - ${part3Highest}`
//     partHeaderDIV.appendChild(partHeaderP);
//   }
// })
// //passage logic












// //insert groups and question types for each part
// questions.forEach((q)=>{
//   groupCounts.set(q.group, (groupCounts.get(q.group) || 0) + 1);

//   if(q.part == 1){
//       if(!seenGroups.has(q.group)){
//         const groupDiv = document.createElement("div");
//         groupDiv.classList.add(`group-${q.group}`, "group");

//         //specifically for reading
//         const TFNotGivenContainer = document.createElement("div");
//         TFNotGivenContainer.classList.add("True-false-notGiven");
//         groupDiv.appendChild(TFNotGivenContainer);

//         const YNNotgivenContainer = document.createElement("div");
//         YNNotgivenContainer.classList.add("Yes-no-notGiven");
//         groupDiv.appendChild(YNNotgivenContainer);

//         const matchingInformationContainer = document.createElement("div");
//         matchingInformationContainer.classList.add("matching-information-container");
//         groupDiv.appendChild(matchingInformationContainer);


//         const listOfHeadingsContainer = document.createElement("div");
//         listOfHeadingsContainer.classList.add("list-of-headings-container");
//         groupDiv.appendChild(listOfHeadingsContainer);

//         const summaryWithListContainer = document.createElement("div");
//         summaryWithListContainer.classList.add("summary-with-list-container");
//         groupDiv.appendChild(summaryWithListContainer);


//         const summaryCompletionContainer = document.createElement("div");
//         summaryCompletionContainer.classList.add("summary-completion");
//         groupDiv.appendChild(summaryCompletionContainer);

//         //specifically for reading

//         //add each type of container to each group to make life easier...
//         //mcq(one Choice)
//         const mcqContainerDiv = document.createElement("div");
//         mcqContainerDiv.classList.add("mcq-container-one-choice");
//         groupDiv.appendChild(mcqContainerDiv);
//         //mcq(two Choice)

//         const mcqContainerTwoDiv = document.createElement("div");
//         mcqContainerTwoDiv.classList.add("mcq-container-two-choice");
//         groupDiv.appendChild(mcqContainerTwoDiv);

//         //table completion

//         const tableDiv = document.createElement("div");
//         tableDiv.classList.add("table-container");
//         groupDiv.appendChild(tableDiv);

//         //sentence completion

//         const sentenceCompletionDiv = document.createElement("div");
//         sentenceCompletionDiv.classList.add("sentence-completion-container");
//         groupDiv.appendChild(sentenceCompletionDiv);
        
//         //form completion

//         const formDiv = document.createElement("div");
//         formDiv.classList.add("form-container");
//         groupDiv.appendChild(formDiv);

//         //note completion

//         const noteDiv = document.createElement("div");
//         noteDiv.classList.add("note-container");
//         groupDiv.appendChild(noteDiv);

//         //flow chart completion

//         const flowChartDiv = document.createElement("div");
//         flowChartDiv.classList.add("flowchart-container");
//         groupDiv.appendChild(flowChartDiv);
        

//         //short answer questions

//         const shortAnswerDiv = document.createElement("div");
//         shortAnswerDiv.classList.add("short-answer-container");
//         shortAnswerDiv.classList.add("question");
//         groupDiv.appendChild(shortAnswerDiv);

//         //matching questions

//         const matchingContainer = document.createElement("div");
//         matchingContainer.classList.add("matching-container");
//         groupDiv.appendChild(matchingContainer);

//         //diagram labelling

//         const diagramLabelDiv=  document.createElement("div");
//         diagramLabelDiv.classList.add("diagram-label-container");
//         groupDiv.appendChild(diagramLabelDiv);


//         const fullNoteCompletionContainer = document.createElement("div");
//         fullNoteCompletionContainer.classList.add("full-note-completion-container");
//         groupDiv.appendChild(fullNoteCompletionContainer);


//         //matching table container

//         const matchingTableContainer = document.createElement("div");
//         matchingTableContainer.classList.add("matching-table-container");
//         groupDiv.appendChild(matchingTableContainer);


//         //add each type of container to each group to make life easier...
      
//         part1QuestionSection.appendChild(groupDiv);
//         seenGroups.add(q.group);
//       }
//     }
    
//     if(q.part == 2){
//       if(!seenGroups.has(q.group)){
//         const groupDiv = document.createElement("div");
//         groupDiv.classList.add(`group-${q.group}`, "group");

//         //specifically for reading
//         const TFNotGivenContainer = document.createElement("div");
//         TFNotGivenContainer.classList.add("True-false-notGiven");
//         groupDiv.appendChild(TFNotGivenContainer);

//         const YNNotgivenContainer = document.createElement("div");
//         YNNotgivenContainer.classList.add("Yes-no-notGiven");
//         groupDiv.appendChild(YNNotgivenContainer);

//         const matchingInformationContainer = document.createElement("div");
//         matchingInformationContainer.classList.add("matching-information-container");
//         groupDiv.appendChild(matchingInformationContainer);


//         const listOfHeadingsContainer = document.createElement("div");
//         listOfHeadingsContainer.classList.add("list-of-headings-container");
//         groupDiv.appendChild(listOfHeadingsContainer);


//         const summaryWithListContainer = document.createElement("div");
//         summaryWithListContainer.classList.add("summary-with-list-container");
//         groupDiv.appendChild(summaryWithListContainer);


//         const summaryCompletionContainer = document.createElement("div");
//         summaryCompletionContainer.classList.add("summary-completion");
//         groupDiv.appendChild(summaryCompletionContainer);
//         //specifically for reading

        
//         //add each type of container to each group to make life easier...
//         //mcq(one Choice)
//         const mcqContainerDiv = document.createElement("div");
//         mcqContainerDiv.classList.add("mcq-container-one-choice");
//         groupDiv.appendChild(mcqContainerDiv);
//         //mcq(two Choice)

//         const mcqContainerTwoDiv = document.createElement("div");
//         mcqContainerTwoDiv.classList.add("mcq-container-two-choice");
//         groupDiv.appendChild(mcqContainerTwoDiv);

//         //table completion

//         const tableDiv = document.createElement("div");
//         tableDiv.classList.add("table-container");
//         groupDiv.appendChild(tableDiv);

//         //sentence completion

//         const sentenceCompletionDiv = document.createElement("div");
//         sentenceCompletionDiv.classList.add("sentence-completion-container");
//         groupDiv.appendChild(sentenceCompletionDiv);
        
//         //form completion

//         const formDiv = document.createElement("div");
//         formDiv.classList.add("form-container");
//         groupDiv.appendChild(formDiv);

//         //note completion

//         const noteDiv = document.createElement("div");
//         noteDiv.classList.add("note-container");
//         groupDiv.appendChild(noteDiv);

//         //flow chart completion

//         const flowChartDiv = document.createElement("div");
//         flowChartDiv.classList.add("flowchart-container");
//         groupDiv.appendChild(flowChartDiv);
        

//         //short answer questions

//         const shortAnswerDiv = document.createElement("div");
//         shortAnswerDiv.classList.add("short-answer-container");
//         groupDiv.appendChild(shortAnswerDiv);

//         //matching questions

//         const matchingContainer = document.createElement("div");
//         matchingContainer.classList.add("matching-container");
//         groupDiv.appendChild(matchingContainer);

//         //diagram labelling

//         const diagramLabelDiv=  document.createElement("div");
//         diagramLabelDiv.classList.add("diagram-label-container");
//         groupDiv.appendChild(diagramLabelDiv);

//         const fullNoteCompletionContainer = document.createElement("div");
//         fullNoteCompletionContainer.classList.add("full-note-completion-container");
//         groupDiv.appendChild(fullNoteCompletionContainer);


//         //matching table container

//         const matchingTableContainer = document.createElement("div");
//         matchingTableContainer.classList.add("matching-table-container");
//         groupDiv.appendChild(matchingTableContainer);

//         //add each type of container to each group to make life easier...




//         part2QuestionSection.appendChild(groupDiv);
//         seenGroups.add(q.group);
//       }
//     }

//     if(q.part == 3){
//       if(!seenGroups.has(q.group)){
//         const groupDiv = document.createElement("div");
//         groupDiv.classList.add(`group-${q.group}`, "group");

//         //specifically for reading
//         const TFNotGivenContainer = document.createElement("div");
//         TFNotGivenContainer.classList.add("True-false-notGiven");
//         groupDiv.appendChild(TFNotGivenContainer);

//         const YNNotgivenContainer = document.createElement("div");
//         YNNotgivenContainer.classList.add("Yes-no-notGiven");
//         groupDiv.appendChild(YNNotgivenContainer);

//         const matchingInformationContainer = document.createElement("div");
//         matchingInformationContainer.classList.add("matching-information-container");
//         groupDiv.appendChild(matchingInformationContainer);


//         const listOfHeadingsContainer = document.createElement("div");
//         listOfHeadingsContainer.classList.add("list-of-headings-container");
//         groupDiv.appendChild(listOfHeadingsContainer);

//         const summaryWithListContainer = document.createElement("div");
//         summaryWithListContainer.classList.add("summary-with-list-container");
//         groupDiv.appendChild(summaryWithListContainer);


//         const summaryCompletionContainer = document.createElement("div");
//         summaryCompletionContainer.classList.add("summary-completion");
//         groupDiv.appendChild(summaryCompletionContainer);
//         //specifically for reading


//         //add each type of container to each group to make life easier...
//         //mcq(one Choice)
//         const mcqContainerDiv = document.createElement("div");
//         mcqContainerDiv.classList.add("mcq-container-one-choice");
//         groupDiv.appendChild(mcqContainerDiv);
//         //mcq(two Choice)

//         const mcqContainerTwoDiv = document.createElement("div");
//         mcqContainerTwoDiv.classList.add("mcq-container-two-choice");
//         groupDiv.appendChild(mcqContainerTwoDiv);

//         //table completion

//         const tableDiv = document.createElement("div");
//         tableDiv.classList.add("table-container");
//         groupDiv.appendChild(tableDiv);

//         //sentence completion

//         const sentenceCompletionDiv = document.createElement("div");
//         sentenceCompletionDiv.classList.add("sentence-completion-container");
//         groupDiv.appendChild(sentenceCompletionDiv);
        
//         //form completion

//         const formDiv = document.createElement("div");
//         formDiv.classList.add("form-container");
//         groupDiv.appendChild(formDiv);

//         //note completion

//         const noteDiv = document.createElement("div");
//         noteDiv.classList.add("note-container");
//         groupDiv.appendChild(noteDiv);

//         //flow chart completion

//         const flowChartDiv = document.createElement("div");
//         flowChartDiv.classList.add("flowchart-container");
//         groupDiv.appendChild(flowChartDiv);
        

//         //short answer questions

//         const shortAnswerDiv = document.createElement("div");
//         shortAnswerDiv.classList.add("short-answer-container");
//         groupDiv.appendChild(shortAnswerDiv);

//         //matching questions

//         const matchingContainer = document.createElement("div");
//         matchingContainer.classList.add("matching-container");
//         groupDiv.appendChild(matchingContainer);

//         //diagram labelling

//         const diagramLabelDiv=  document.createElement("div");
//         diagramLabelDiv.classList.add("diagram-label-container");
//         groupDiv.appendChild(diagramLabelDiv);

//         const fullNoteCompletionContainer = document.createElement("div");
//         fullNoteCompletionContainer.classList.add("full-note-completion-container");
//         groupDiv.appendChild(fullNoteCompletionContainer);


//         //matching table container

//         const matchingTableContainer = document.createElement("div");
//         matchingTableContainer.classList.add("matching-table-container");
//         groupDiv.appendChild(matchingTableContainer);

//         //add each type of container to each group to make life easier...


//         part3QuestionSection.appendChild(groupDiv);
//         seenGroups.add(q.group);
//       }
//     }
// })

// //insert passages at each part
// const part1PassageSection = document.getElementById("passage-section-1");
// const part2PassageSection = document.getElementById("passage-section-2");
// const part3PassageSection = document.getElementById("passage-section-3");




// //group header logic
// let questionRangeStarter = 1;
// let last = 0;
// let index = 0;
// groupCounts.forEach((value, group)=>{
//     const groupDiv = document.querySelector(`.group-${group}`);
//     //trying instruction logic
//     const groupHeader = document.createElement("div");
//     groupHeader.classList.add("group-header");
//     const instructionDiv = document.createElement("div");
//     instructionDiv.classList.add("instructions");
//     instructionDiv.innerHTML = `<h3>${instructions[index].instruction}</h3>`
//     groupHeader.prepend(instructionDiv);
//    // console.log(instructions[index].instruction);
    
//     const min = findLowest(questions[index].id)
//     const max = findHighest(questions[index].id)
//     console.log(min)
//     console.log(max)

//     last += value;
    
//     const groupRangeHeader = document.createElement("h3");
//     groupRangeHeader.textContent = `Questions ${min} - ${max}`;
//     groupHeader.prepend(groupRangeHeader); 
//     questionRangeStarter += value;


//   console.log(index)
//   index += 1;  
//   groupDiv.prepend(groupHeader);

// })





// document.addEventListener("DOMContentLoaded", ()=>{
//   questions.forEach((q, index)=>{
    
//     if(q.type == "mcq-two-choice-updated"){
//       q.questions.forEach((question, index)=>{
//         const checkBoxes = document.querySelectorAll(`input[type="checkbox"][name="q${q.id[index][0]}"]`);
//         //console.log(index)

//         //console.log(Array.from(checkBoxes));
//         checkBoxes.forEach(checkBox =>{
        
//         checkBox.addEventListener("change", ()=>{
//         const checked = Array.from(checkBoxes).filter(cb=> cb.checked);
//         checked.forEach((check, idx)=>{
//           check.setAttribute("name", q.id[index][idx])
//         })
//         if(checked.length > 2) {
//           checkBox.checked = false;
//         }
//       })
//     })
//       })
      
      

      
//     }
//   })
// })


// function findLowest(arr) {
//   const flat =  arr.flat()
//   return Math.min(...flat);
// }

// function findHighest(arr) {
//   const flat = arr.flat()
//   return Math.max(...flat);
// }

// //updating question section


// //question insert logic
// questions.forEach((question)=>{
//     const groupDiv = document.querySelector(`.group-${question.group}`);

//   if(question.type === "T/F/NG"){
//     const TFContainerDIV = groupDiv.querySelector(".True-false-notGiven");
    
//     question.questions.forEach((q, index)=>{
//       const TFContainer = document.createElement("div");
//       TFContainer.classList.add("TF");
//       TFContainer.innerHTML += `<p><strong>${question.id[index]}.</strong> ${q}</p>
//                                 <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="TRUE">&nbsp;&nbsp;TRUE</label>
//                                 <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="FALSE">&nbsp;&nbsp;FALSE</label>
//                                 <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="NOT GIVEN">&nbsp;&nbsp;NOT GIVEN</label>`
//       TFContainerDIV.appendChild(TFContainer);
//     })

    
//   }

//   if(question.type === "note-completion"){
//     function renderTextWithInput(text){
//       const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`);
//       const result  = `<p>${htmlString}</p>`
//       return result; 
//     }

//     const fullNoteCompletionContainer = groupDiv.querySelector(".full-note-completion-container");
//     fullNoteCompletionContainer.innerHTML += `<p class="note-completion-title">${question.heading}</p>`
//     if(!question.subheadings){
//       question.paragraphs[0].forEach((paragraph)=>{
//         fullNoteCompletionContainer.innerHTML += renderTextWithInput(paragraph);
//       })
//     } else{
//       question.subheadings.forEach((subheading, index)=>{
//         fullNoteCompletionContainer.innerHTML += `<p class="note-completion-subheading">${subheading}</p>`
//         question.paragraphs[index].forEach((paragraph, index)=>{

//           fullNoteCompletionContainer.innerHTML += renderTextWithInput(paragraph);
//         })
//       })
//     }




//     const inputs = fullNoteCompletionContainer.querySelectorAll("input");

//     inputs.forEach((input, index)=>{
//       input.setAttribute("placeholder", question.id[index]);
//       input.setAttribute("data-question-id", question.id[index]);
//     })

  
//   }

//   if(question.type === "matching-information"){
//     const matchingInformationContainer = groupDiv.querySelector(".matching-information-container");
//     const selectElem = document.createElement("select");
//     selectElem.setAttribute("name", `matching-information-${question.part}`);
//     selectElem.setAttribute("class", `matching-information`);
//     const optionElem = document.createElement("option");
//     optionElem.setAttribute("value", "");
//     selectElem.appendChild(optionElem);
//     question.paragraphs.forEach((paragraph)=>{
//       const optionELEMENT = document.createElement("option");
//       optionELEMENT.setAttribute("value", paragraph)
//       optionELEMENT.textContent = paragraph;
//       selectElem.appendChild(optionELEMENT);
//     })
//     console.log(selectElem.outerHTML);

//     question.information.forEach((info, index)=>{

//       //id select
//       selectElem.setAttribute("id", question.id[index]);

//       const infoDiv = document.createElement("div");
//       infoDiv.classList.add("matching-info-question");

//       const infoPara = document.createElement("p");
//       infoPara.innerHTML = `<strong>${question.id[index]}.</strong>&nbsp;&nbsp;${info}`;

//       infoDiv.appendChild(infoPara);
//       infoDiv.innerHTML += selectElem.outerHTML;
//       console.log("appending>>")

      

//       matchingInformationContainer.appendChild(infoDiv);
//     })
//   }

//   if(question.type === "sentence-completion"){
//     function renderTextWithInput(text){
//       const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`);
//       const result  = `<p>${htmlString}</p>`
//       return result; 
//     }
//     const sentenceCompletionContainer = groupDiv.querySelector(".sentence-completion-container");

//     const listElem = document.createElement("ul");
//     question.sentences.forEach((sentence)=>{
//       const liElem = document.createElement("li");

//       liElem.innerHTML  = renderTextWithInput(sentence);

//       listElem.appendChild(liElem);
//     })

//     sentenceCompletionContainer.appendChild(listElem);


//     const inputs = sentenceCompletionContainer.querySelectorAll("input");

//     inputs.forEach((input, index)=>{
//       input.setAttribute("placeholder", question.id[index]);
//       input.setAttribute("data-question-id", question.id[index]);
//     })
//   }


//   //might be changed cuz drag and drop
//   if(question.type === "feature-matching"){
//     const matchingContainer = groupDiv.querySelector(".matching-container");


//     const optionDIV = document.createElement("div");
//     optionDIV.classList.add("matching-options");

//     const selectElem = document.createElement("select");
//     selectElem.setAttribute("name", `matching-${question.part}`);

//     const optionElem = document.createElement("option");
//     optionElem.setAttribute("value", "");
//     selectElem.appendChild(optionElem);

    
//     question.options.forEach((paragraph)=>{
//       const matchingOption = document.createElement("p");
//       matchingOption.textContent = paragraph;
//       optionDIV.appendChild(matchingOption);
//       const optionELEMENT = document.createElement("option");

//       optionELEMENT.setAttribute("value", paragraph);
//       optionELEMENT.textContent = paragraph;

//       selectElem.appendChild(optionELEMENT);
//     })
//     matchingContainer.appendChild(optionDIV);

//     question.features.forEach((feature, index)=>{
//       const featureDIV = document.createElement("div");
//       featureDIV.classList.add("matching-feature-question");

//       const featurePara = document.createElement('p');
//       featurePara.innerHTML = `<strong>${question.id[index]}.</strong>&nbsp;&nbsp;${feature}`
//       featureDIV.appendChild(featurePara);
//       featureDIV.innerHTML += selectElem.outerHTML;

//       matchingContainer.appendChild(featureDIV);
//     })
//   }

//   if(question.type === "mcq-one-choice"){
//     const mcqContainerDiv = groupDiv.querySelector(".mcq-container-one-choice");
//     question.questions.forEach((q, index)=>{
//       const mcqContainer = document.createElement("div");
//       mcqContainer.classList.add("mcq");

//       mcqContainer.innerHTML += `<p><strong>${question.id[index]}.</strong> ${q}</p>`
//       question.options[index].forEach((option, idx)=>{
//         mcqContainer.innerHTML += `
//         <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="${idx+1}">&nbsp;&nbsp;${option}</label><br>`
//       })
//       mcqContainerDiv.appendChild(mcqContainer);
//     })
//   }


//   if(question.type === "Y/N/NG"){
//     const YNContainerDIV = groupDiv.querySelector(".Yes-no-notGiven");

//     question.questions.forEach((q, index)=>{
//       const YNContainer = document.createElement("div");
//       YNContainer.classList.add("YN");
//       YNContainer.innerHTML += `<p><strong>${question.id[index]}</strong> ${q}</p>
//                                 <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="YES">&nbsp;&nbsp;YES</label>
//                                 <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="NO">&nbsp;&nbsp;NO</label>
//                                 <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="NOT GIVEN">&nbsp;&nbsp;NOT GIVEN</label>`

//       YNContainerDIV.appendChild(YNContainer);
//     })
//   }

//   if(question.type === "diagram-labelling"){
//     const diagramContainer = groupDiv.querySelector(".diagram-label-container");
//     const allBoxes = document.createElement("div");
//     allBoxes.classList.add("all-boxes");

//     const imagingContainer = document.createElement("div");
//     imagingContainer.classList.add("image-div");
//     imagingContainer.innerHTML = `<img src="${question.image}">`
//     diagramContainer.appendChild(imagingContainer);

//     const matchingLabels = document.createElement("div");
//     matchingLabels.classList.add("matching-labels");

//     const matchingOptions = document.createElement("div");
//     matchingOptions.classList.add("matching-options");

//     question.labels.forEach((label, index)=>{
//       matchingLabels.innerHTML += `<div class="qa-pair">
//                                   <div class="question-label"><strong>${question.id[index]}.</strong>&nbsp;&nbsp;${label}</div>
//                                   <div id="${question.id[index]}" data-question-id="${question.id[index]}" class="box dropzone" data-class="diagram" data-item="" data-initial="empty"></div>
//                                   </div>`
//     })
//     allBoxes.appendChild(matchingLabels);

//     question.options.forEach((option)=>{
//       matchingOptions.innerHTML += `<div class="box" data-class="diagram" data-item="${option}">${option}</div>`
//     })
//     allBoxes.appendChild(matchingOptions);
//     diagramContainer.appendChild(allBoxes);
//   }

//   if(question.type === "feature-matching-drag-drop"){
//     const matchingContainer = groupDiv.querySelector(".matching-container");
//     const allBoxes = document.createElement("div");
//     allBoxes.classList.add("all-boxes");

//     const matchingFeatures = document.createElement("div");
//     matchingFeatures.classList.add("matching-features");

//     const matchingOptions = document.createElement("div");
//     matchingOptions.classList.add("matching-options");

//     question.options.forEach((option, index)=>{
//       matchingOptions.innerHTML += `<div class="box" data-class="feature-matching" data-item="${option}">${option}</div>`
//     })
//     allBoxes.appendChild(matchingOptions);

//     question.features.forEach((feature, index)=>{
//       matchingFeatures.innerHTML += `<div class="qa-pair">
//                                     <div class="question-feature"><strong>${question.id[index]}.</strong>&nbsp;&nbsp;${feature}</div>
//                                     <div id="${question.id[index]}" data-question-id="${question.id[index]}" class="box dropzone" data-class="feature-matching" data-item="" data-initial="empty"></div>
//                                     </div>`
//     })
//     allBoxes.appendChild(matchingFeatures);

//     matchingContainer.appendChild(allBoxes);
//   }

//   if(question.type === "list-of-headings"){
//       const listContainer = groupDiv.querySelector(".list-of-headings-container");
      
//       const passage = document.querySelector(`#passage-scroll-${question.part}`);

//       const listHeadings = document.createElement("div");
//       listHeadings.classList.add("list-headings");
//       question.headings.forEach((heading, index)=>{
//         listHeadings.innerHTML += `<div class="box" data-class="list-of-headings" data-item="${heading}">${heading}</div>`
        
        
//       })

//       question.paragraphs.forEach((paragraph, idx)=>{
//           const emptyBox = document.createElement("div");
//           emptyBox.setAttribute("id", question.id[idx]);
//           emptyBox.classList.add("box", "dropzone", "box-heading");
//           emptyBox.setAttribute("data-item", "");
//           emptyBox.setAttribute("data-initial", "empty");
//           emptyBox.setAttribute("data-class", "list-of-headings");
//           emptyBox.setAttribute("data-question-id", question.id[idx]);
//           const para = document.querySelector(`#para-${paragraph}-${question.part}`)
//           passage.insertBefore(emptyBox, para)
//         })

//       listContainer.appendChild(listHeadings);
//   }

//   if(question.type === "summary-completion"){
//     function renderTextWithInput(text){
//       const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`);
//       const result  = `<p>${htmlString}</p>`
//       return result; 
//     }

//     const summaryContainer = groupDiv.querySelector(".summary-with-list-container");
//     const summaryTitle = document.createElement("p");
//     summaryTitle.classList.add("summary-title");
//     summaryTitle.textContent = question.title;

//     summaryContainer.appendChild(summaryTitle);

//     const summary = document.createElement("div");
//     summary.classList.add("summary");
//     summary.innerHTML = renderTextWithInput(question.summary[0]);

//     summaryContainer.appendChild(summary);

//     const inputs = summaryContainer.querySelectorAll("input");

//     inputs.forEach((input, index)=>{
//       input.setAttribute("placeholder", question.id[index]);
//       input.setAttribute("data-question-id", question.id[index]);
//     })
//   }

//   if(question.type === "summary-with-list-of-words"){
//     function renderTextWithInput(text){
//       const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`);
//       const result  = `<p>${htmlString}</p>`
//       return result; 
//     }
//     const summaryContainer = groupDiv.querySelector(".summary-with-list-container");

//     const wordList = document.createElement("ul");

//     question["word-list"].forEach((word, index)=>{
//         wordList.innerHTML += `<li>${word}</li>`
//     })
//     summaryContainer.appendChild(wordList);

//     const summaryTitle = document.createElement("p");
//     summaryTitle.classList.add("summary-title");
//     summaryTitle.textContent = question.title;

//     summaryContainer.appendChild(summaryTitle);

//     const summary = document.createElement("div");
//     summary.classList.add("summary");

//     summary.innerHTML = renderTextWithInput(question.summary[0]);

//     summaryContainer.appendChild(summary);

//     const inputs = summaryContainer.querySelectorAll("input");

//     inputs.forEach((input, index)=>{
//       input.setAttribute("placeholder", question.id[index]);
//       input.setAttribute("data-question-id", question.id[index]);
//     })
//   }

//   if(question.type === "table-completion"){
//     function renderTextWithInput(text){
//           const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input" placeholder="${index}">`)
//           const result =  `<p style="text-align:center">${htmlString}</p>`;
//           return result;
//         }

//     const tableContainer = groupDiv.querySelector(".table-container");
//     const table = document.createElement("table");

//     question["table-structure"].forEach((count, index)=>{
//       const tr = document.createElement("tr");

//       for(let i=0; i<count; i++){
//         const td = document.createElement("td");

//         if(count == findLowest(question["table-structure"])){
//           td.colSpan = findHighest(question["table-structure"]);
//         }
//         td.innerHTML += renderTextWithInput(question.cells[index][i]);
//         tr.appendChild(td);
//       }
//       table.appendChild(tr);
//     })

//     tableContainer.appendChild(table);

//     const inputs = tableContainer.querySelectorAll("input");

//     inputs.forEach((input, index)=>{
//       input.setAttribute("placeholder", question.id[index]);
//       input.setAttribute("data-question-id", question.id[index]);
//     })
//   }

//   if(question.type === "mcq-two-choice-updated"){
//     const mcqTwoChoiceContainer = groupDiv.querySelector(".mcq-container-two-choice");
//     question.questions.forEach((q, index)=>{
//       mcqTwoChoiceContainer.innerHTML += `<div class="question-box">
//                                           <div class="number-boxes">
//                                           <div class="num-box">${question.id[index][0]}</div>
//                                           <div class="num-box">${question.id[index][1]}</div>
//                                           </div>
                                          
//                                           <div class="question-text">
//                                           ${q[0]}
//                                           </div>
//                                           </div>`
//       question.options[index].forEach((option, idx)=>{
//         mcqTwoChoiceContainer.innerHTML += `<div class="options">
//                                             <label>${idx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${question.id[index][0]}" data-question-id="${question.id[index][0]} ${question.id[index][1]}" value="${idx + 1}">   &nbsp;&nbsp;${option}</label><br>
//                                           </div>`
//       })
//     })
//   }

//   if(question.type === "matching-table-container"){
//     const matchingTableContainer = groupDiv.querySelector(".matching-table-container");
//     const matchingTable = document.createElement("table");

//     const thead = document.createElement("thead");
//     const theadTr = document.createElement("tr");
//     theadTr.innerHTML = "<th></th>"
//     question.paragraphs.forEach((para)=>{
//       theadTr.innerHTML += `<th>${para}</th>`
//     })

//     thead.appendChild(theadTr);




//     const tbody = document.createElement("tbody");
//     question.information.forEach((info, index)=>{
//       const tbodyTr = document.createElement("tr");

//       tbodyTr.setAttribute("data-info", `info-${index}`);

//       tbodyTr.innerHTML = `<td>${info}</td>`;

//       question.paragraphs.forEach((para)=>{
//         tbodyTr.innerHTML += `<td><input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="${para}" data-id="info${index}-${para}" /></td>`
//       })

//       tbody.appendChild(tbodyTr);
//     })


    




//     matchingTable.appendChild(thead);
//     matchingTable.appendChild(tbody);


//     matchingTableContainer.appendChild(matchingTable);
//   }

// })

// //question insert logic



// //font-change setting

// const testContent = document.getElementById("test-content");
// const fontSizeSelector = document.getElementById("font-size-selector")


// fontSizeSelector.addEventListener("change", function (){

//   const selectedValue = this.value;
//   testContent.style.fontSize = selectedValue;
//   //console.log("Selected value:", selectedValue);
  

// })














// //drag & drop

// //learning drag and drop

// var dragElement = null;
// var items;

// function handleDragStart(e){
//   this.style.opacity = "0.4";
//   dragElement = this;

//   e.dataTransfer.effectAllowed = "move";
//   e.dataTransfer.setData("item", this.innerHTML)
// }

// function handleDragOver(e){
//   if(e.preventDefault){
//     e.preventDefault();
//   }

//   e.dataTransfer.dropEffect = "move";
//   return false;
// }

// function handleDragEnter(e){
//   this.classList.add("dragover");
// }

// function handleDragLeave(e){
//   this.classList.remove("dragover");
// }

// function handleDrop(e){
//   if (e.stopPropagation) e.stopPropagation();

//   if (dragElement !== this) {
//     const draggedGroup = dragElement.getAttribute("data-class");
//     const targetGroup = this.getAttribute("data-class");

//     if(draggedGroup !== targetGroup){
//       this.classList.add("invalid-drop");
//       setTimeout(() => this.classList.remove("invalid-drop"), 1000);
//       return false;
//     } else{
//     const draggedHTML = dragElement.innerHTML;
//     const draggedItem = dragElement.getAttribute("data-item");

//     const targetHTML = this.innerHTML;
//     const targetItem = this.getAttribute("data-item");

    
//     dragElement.innerHTML = targetHTML;
//     dragElement.setAttribute("data-item", targetItem || "");

//     this.innerHTML = draggedHTML;
//     this.setAttribute("data-item", draggedItem || "");

//     // Reapply
//     addDragEvents(dragElement);
//     addDragEvents(this);
//     }

    
//   }
// }

// function handleDragEnd(e){
//   this.style.opacity = "1";
//   items.forEach((item)=>{
//     item.classList.remove("dragover");
//   })
// }

// function addDragEvents(element) {
//   const hasContent = element.textContent.trim() !== "";

//   element.setAttribute("draggable", hasContent);

//   //attach
//   element.addEventListener("dragenter", handleDragEnter);
//   element.addEventListener("dragover", handleDragOver);
//   element.addEventListener("dragleave", handleDragLeave);
//   element.addEventListener("drop", handleDrop);
//   element.addEventListener("dragend", handleDragEnd);

//   // Only attach dragstart if content is not empty
//   if (hasContent) {
//     element.addEventListener("dragstart", handleDragStart);
//   }
// }

// document.addEventListener("DOMContentLoaded", (event)=>{
//   items = document.querySelectorAll(".box");

//   items.forEach((item)=>{
//     addDragEvents(item)
//   })
// })









// //highlight button logic

// const button = document.getElementById('highlight-btn');

//     document.addEventListener('mouseup', () => {
//       const selection = window.getSelection();
//       if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
//         const range = selection.getRangeAt(0);
//         const rect = range.getBoundingClientRect();

//         // Show button near selection
//         button.style.top =  `${window.scrollY + rect.top + 20}px`;
//         button.style.left = `${window.scrollX + rect.right - 35}px`;
//         button.style.display = 'block';
//       } else {
//         button.style.display = 'none';
//       }
//     });

//     button.addEventListener('click', () => {
//       const selection = window.getSelection();
//       if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
//         //const range = selection.getRangeAt(0);
//         //console.log(range.toString());
//         //const span = document.createElement('span');
//         //span.classList.add('highlighted');
//         //range.surroundContents(span);
//         //highlightRangeTest(range);
//         highlightSelection();
//         selection.removeAllRanges();
//         button.style.display = 'none';
//       }
//     });


// function highlightSelection() {
//   var userSelection = window.getSelection().getRangeAt(0);
//   var safeRanges = getSafeRanges(userSelection);
//   for (var i = 0; i < safeRanges.length; i++) {
//     highlightRange(safeRanges[i]);
//   }
// }

// function highlightRange(range) {
//   var newNode = document.createElement("div");
//   newNode.setAttribute(
//     "class",
//     "highlight-wrapper"
//   );
//   range.surroundContents(newNode);
// }

// (function () {
//   const popup = document.getElementById('unhighlightPopup');
//   let currentHighlight = null;

//   // Interactive elements that should be allowed to receive clicks/focus
//   const interactiveSelector = 'input, textarea, select, button, a, label, [contenteditable="true"]';

//   function showPopupFor(wrapper, clickEvent) {
//     currentHighlight = wrapper;
//     const rect = wrapper.getBoundingClientRect();

//     // position a little below the wrapper
//     popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
//     // ensure popup doesn't run off-screen left
//     const left = Math.max(rect.left + window.scrollX, 6);
//     popup.style.left = `${left}px`;
//     popup.style.display = 'block';

//     // focus so keyboard users can press Enter
//     popup.focus();
//   }

//   function hidePopup() {
//     popup.style.display = 'none';
//     currentHighlight = null;
//   }

//   function unwrapHighlight(wrapper) {
//     if (!wrapper) return;
//     // Move all child nodes into a fragment to preserve elements exactly
//     const frag = document.createDocumentFragment();
//     while (wrapper.firstChild) {
//       frag.appendChild(wrapper.firstChild);
//     }
//     // Replace the wrapper with its children (preserves structure)
//     wrapper.replaceWith(frag);

//     // clean up references
//     hidePopup();
//   }

//   // click handler for the whole document
//   document.addEventListener('click', function (e) {
//     const target = e.target;

//     // if popup clicked → unhighlight the stored wrapper
//     if (target === popup || popup.contains(target)) {
//       if (currentHighlight) {
//         unwrapHighlight(currentHighlight);
//       } else {
//         hidePopup();
//       }
//       e.stopPropagation();
//       return;
//     }

//     // Did we click inside a highlight wrapper (or its descendants)?
//     const wrapper = target.closest && target.closest('.highlight-wrapper');

//     if (wrapper) {
//       // If the click target is an interactive element, allow normal interaction (don't show popup)
//       if (target.matches(interactiveSelector)) {
//         // don't show popup; let the input/select get focus
//         hidePopup();
//         return;
//       }

//       // Otherwise show popup for the nearest wrapper clicked
//       showPopupFor(wrapper, e);
//       e.stopPropagation();
//       return;
//     }

//     // Click outside → hide popup
//     hidePopup();
//   }, true); // use capture to reduce chance popup immediately hides

//   // keyboard shortcuts
//   document.addEventListener('keydown', function (e) {
//     if (e.key === 'Escape') {
//       hidePopup();
//       return;
//     }
//     if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === popup) {
//       // Enter or Space on the popup triggers unhighlight
//       if (currentHighlight) unwrapHighlight(currentHighlight);
//       e.preventDefault();
//       return;
//     }
//   });

//   // Reposition popup when scrolling / resizing so it stays near the wrapper
//   function repositionPopup() {
//     if (!currentHighlight || popup.style.display === 'none') return;
//     const rect = currentHighlight.getBoundingClientRect();
//     popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
//     popup.style.left = `${Math.max(rect.left + window.scrollX, 6)}px`;
//   }
//   window.addEventListener('scroll', repositionPopup, { passive: true });
//   window.addEventListener('resize', repositionPopup);

// })();

// function getSafeRanges(dangerous) {
//   var a = dangerous.commonAncestorContainer;
//   // Starts -- Work inward from the start, selecting the largest safe range
//   var s = new Array(0), rs = new Array(0);
//   if (dangerous.startContainer != a) {
//     for (var i = dangerous.startContainer; i != a; i = i.parentNode) {
//       s.push(i);
//     }
//   }
//   if (s.length > 0) {
//     for (var i = 0; i < s.length; i++) {
//       var xs = document.createRange();
//       if (i) {
//         xs.setStartAfter(s[i - 1]);
//         xs.setEndAfter(s[i].lastChild);
//       } else {
//         xs.setStart(s[i], dangerous.startOffset);
//         xs.setEndAfter((s[i].nodeType == Node.TEXT_NODE) ? s[i] : s[i].lastChild);
//       }
//       rs.push(xs);
//     }
//   }

//   // Ends -- basically the same code reversed
//   var e = new Array(0), re = new Array(0);
//   if (dangerous.endContainer != a) {
//     for (var i = dangerous.endContainer; i != a; i = i.parentNode) {
//       e.push(i);
//     }
//   }
//   if (e.length > 0) {
//     for (var i = 0; i < e.length; i++) {
//       var xe = document.createRange();
//       if (i) {
//         xe.setStartBefore(e[i].firstChild);
//         xe.setEndBefore(e[i - 1]);
//       } else {
//         xe.setStartBefore((e[i].nodeType == Node.TEXT_NODE) ? e[i] : e[i].firstChild);
//         xe.setEnd(e[i], dangerous.endOffset);
//       }
//       re.unshift(xe);
//     }
//   }

//   // Middle -- the uncaptured middle
//   if ((s.length > 0) && (e.length > 0)) {
//     var xm = document.createRange();
//     xm.setStartAfter(s[s.length - 1]);
//     xm.setEndBefore(e[e.length - 1]);
//   } else {
//     return [dangerous];
//   }

//   // Concat
//   rs.push(xm);
//   response = rs.concat(re);

//   // Send to Console
//   return response;
// }


// // hightlight button logic //


// //scrolling while dragging
// document.addEventListener("dragover", function (e) {
//   const scrollMargin = 80; 
//   const scrollSpeed = 500;  

//   const y = e.clientY;
//   const windowHeight = window.innerHeight;

//   if (y < scrollMargin) {
    
//     window.scrollBy(0, -scrollSpeed);
//   } else if (y > windowHeight - scrollMargin) {
    
//     window.scrollBy(0, scrollSpeed);
//   }
// });


// /* ------------------ PART NAV: small question buttons & answered-state tracking ------------------ */

// /*
//   Creates small q-buttons for each part (beside Part label) and wires:
//    - click -> scroll to question element with data-question-id
//    - auto highlight when question becomes answered (text/radio/select/drop)
// */

// // Utility: find question elements by numeric id. Questions in your render use data-question-id attributes.
// function getQuestionElementById(qid) {
//   // first try attribute selectors
//   return document.querySelector(`[data-question-id="${qid}"], [id="${qid}"]`);
// }

// // Check whether a given question id currently has an answer (text / radio / select / dropzones)
// function isQuestionAnswered(qid) {
//   // 1) text inputs: inputs with data-question-id or placeholder matching qid
//   const textInput = document.querySelector(`input[type="text"][data-question-id="${qid}"], input[type="text"][placeholder="${qid}"]`);
//   if (textInput && textInput.value.trim() !== "") return true;

//   // 2) radio / checkbox: inputs with name === qid
//   const inputsByName = document.querySelectorAll(`input[name="${qid}"]`);
//   if (inputsByName && inputsByName.length > 0) {
//     for (const el of inputsByName) {
//       if (el.type === 'radio' || el.type === 'checkbox') {
//         if (el.checked) return true;
//       }
//     }
//   }

//   // 3) select (matching-information sets the select id to the q.id earlier)
//   const select = document.getElementById(qid);
//   if (select && select.value && select.value.trim() !== "") return true;

//   // 4) dropzones / boxes (you used id on dropzone divs for many types)
//   const dropzone = document.getElementById(String(qid));
//   if (dropzone) {
//     const text = dropzone.textContent.trim();
//     // If it has visible content, consider it answered. Also check dataset.item if used.
//     if (text !== "" && text.toLowerCase() !== "empty") return true;
//     if (dropzone.dataset && dropzone.dataset.item && dropzone.dataset.item !== "") return true;
//   }

//   // 5) fallback: any input *inside* an element that carries the question id as parent (p tag with data-question-id etc)
//   const questionParent = document.querySelector(`[data-question-id="${qid}"]`);
//   if (questionParent) {
//     const innerInputs = questionParent.querySelectorAll("input, select, textarea");
//     for (const el of innerInputs) {
//       if (el.type === "text" && el.value.trim() !== "") return true;
//       if ((el.type === "radio" || el.type === "checkbox") && el.checked) return true;
//       if (el.tagName.toLowerCase() === "select" && el.value && el.value.trim() !== "") return true;
//     }
//   }

//   return false;
// }

// // Toggle state of qnav button for single question id
// function updateQNavState(qid) {
//   const btn = document.querySelector(`.qnav-btn[data-qid="${qid}"]`);
//   if (!btn) return;
//   if (isQuestionAnswered(qid)) {
//     btn.classList.add("attempted");
//   } else {
//     btn.classList.remove("attempted");
//   }
// }

// // Build part -> question small buttons once DOM is ready
// // Build part -> question small buttons once DOM is ready
// function createPartQuestionNavButtons() {
//   for (let part = 1; part <= 4; part++) {
//     const partEl = document.getElementById(`part-${part}`);
//     if (!partEl) continue;

//     // collect question ids inside this part
//     const qEls = partEl.querySelectorAll("[data-question-id], [id]");
//     const qIds = [];

//     qEls.forEach(el => {
//   const attr = el.getAttribute("data-question-id");
//   if (!attr) return;

//   // split by space to handle multiple ids
//   const ids = attr.split(" ")
//     .map(s => s.match(/\d+/)?.[0])
//     .filter(Boolean);

//   ids.forEach(idNum => {
//     if (!qIds.includes(idNum)) qIds.push(idNum);
//   });
// });

//     // Sort ids numerically
//     qIds.sort((a, b) => Number(a) - Number(b));

//     console.log(qIds);

//     // find the bottom navbar's question-button-container for this part
//     const container = document.querySelector(`.question-button-container[data-part="${part}"]`);
//     if (!container) continue;

//     // clear existing
//     container.innerHTML = "";

//     // create buttons
//     qIds.forEach(qid => {
//       const b = document.createElement("button");
//       b.className = "qnav-btn";
//       b.type = "button";
//       b.setAttribute("data-qid", qid);
//       b.textContent = qid;

//       // click -> scroll to the question element
//       b.addEventListener("click", (ev) => {
//         ev.stopPropagation();
//         const targetEl = getQuestionElementById(qid);
//         if (targetEl) {
//           const parentPartMatch = targetEl.closest(".part");
//           if (parentPartMatch) {
//             const idAttr = parentPartMatch.id || "";
//             const whichPart = idAttr.match(/\d+/);
//             if (whichPart) showPart(Number(whichPart[0]));
//           }
//           targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
//           // mark visual current
//           document.querySelectorAll('.qnav-btn.current').forEach(x => x.classList.remove('current'));
//           b.classList.add('current');
//         }
//       });

//       container.appendChild(b);

//       // initial state: set attempted if needed
//       setTimeout(() => updateQNavState(qid), 10);
//     });
//   }
// }

// // Add listeners for inputs (text, radio, selects) so qnav state updates live
// function attachAnswerListeners() {
//   // text inputs
//   document.querySelectorAll('input[type="text"]').forEach(inp=>{
//     // trigger on input
//     inp.addEventListener('input', () => {
//       const qid = inp.getAttribute('data-question-id') || inp.getAttribute('placeholder') || extractNumeric(inp);
//       if (qid) updateQNavState(String(qid));
//     });
//   });

//   // radio / checkbox groups -> on change
//   document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp=>{
//     inp.addEventListener('change', () => {
//       const name = inp.name;
//       if (name) {
//         // if name contains digits, extract the first number
//         const found = String(name).match(/\d+/);
//         if (found) updateQNavState(found[0]);
//         else updateQNavState(name);
//       }
//     });
//   });

//   // selects (matching-information)
//   document.querySelectorAll('select').forEach(sel=>{
//     sel.addEventListener('change', () => {
//       const id = sel.id || (sel.getAttribute && sel.getAttribute('name'));
//       if (id) updateQNavState(String(id));
//     });
//   });
// }

// // helper: try extract numeric id from element attributes
// function extractNumeric(el) {
//   if (!el) return null;
//   const attrs = ['data-question-id','id','name','placeholder'];
//   for (const a of attrs) {
//     const v = el.getAttribute && el.getAttribute(a);
//     if (!v) continue;
//     const found = String(v).match(/\d+/);
//     if (found) return found[0];
//   }
//   return null;
// }

// /* --- IMPORTANT: replace or augment your existing handleDrop to call updateQNavState on affected qids.
//    If you already have a handleDrop function, replace it with the following version below.
// */

// function handleDrop(e){
//   if (e.stopPropagation) e.stopPropagation();

//   if (dragElement !== this) {
//     const draggedGroup = dragElement.getAttribute("data-class");
//     const targetGroup = this.getAttribute("data-class");

//     if(draggedGroup !== targetGroup){
//       this.classList.add("invalid-drop");
//       setTimeout(() => this.classList.remove("invalid-drop"), 1000);
//       return false;
//     } else{
//       const draggedHTML = dragElement.innerHTML;
//       const draggedItem = dragElement.getAttribute("data-item");

//       const targetHTML = this.innerHTML;
//       const targetItem = this.getAttribute("data-item");

//       // Swap
//       dragElement.innerHTML = targetHTML;
//       dragElement.setAttribute("data-item", targetItem || "");

//       this.innerHTML = draggedHTML;
//       this.setAttribute("data-item", draggedItem || "");

//       // Reapply events
//       addDragEvents(dragElement);
//       addDragEvents(this);

//       // Update data-initial attr (if you use it)
//       if (dragElement.dataset) dragElement.dataset.initial = dragElement.dataset.initial || "filled";
//       if (this.dataset) this.dataset.initial = this.dataset.initial || "filled";

//       // After swap, try to detect if these two elements correspond to questions (they often have id attributes equal to question ids)
//       // If elements have an id that is numeric, update their qnav states.
//       const idsToUpdate = new Set();
//       const aId = dragElement.getAttribute('id');
//       const bId = this.getAttribute('id');
//       if (aId) { const f = aId.match(/\d+/); if (f) idsToUpdate.add(f[0]); }
//       if (bId) { const f = bId.match(/\d+/); if (f) idsToUpdate.add(f[0]); }

//       // Also check parent question containers for data-question-id
//       [dragElement, this].forEach(el => {
//         const qparent = el.closest('[data-question-id]');
//         if (qparent) {
//           const qid = qparent.getAttribute('data-question-id') || (qparent.getAttribute('id') && qparent.getAttribute('id').match(/\d+/) && qparent.getAttribute('id').match(/\d+/)[0]);
//           if (qid) idsToUpdate.add(qid);
//         }
//       });

//       // call update for all discovered ids
//       idsToUpdate.forEach(id => updateQNavState(id));
//     }
//   }
// }

// /* --- Setup: run on DOMContentLoaded so that dynamic questions are already rendered --- */
// document.addEventListener("DOMContentLoaded", () => {
//   // create the small buttons inside each Part nav
//   createPartQuestionNavButtons();

//   // attach listeners for text, radio, select changes
//   attachAnswerListeners();

//   // also attach a MutationObserver for dropzones or areas that may change content dynamically
//   const observer = new MutationObserver(muts => {
//     muts.forEach(m => {
//       // when nodes change, try to update states for any question ids found in mutated subtree
//       const el = m.target;
//       const ids = Array.from(el.querySelectorAll('[data-question-id], [id]')).map(x => {
//         const idv = x.getAttribute('data-question-id') || x.getAttribute('id');
//         const f = idv && String(idv).match(/\d+/);
//         return f ? f[0] : null;
//       }).filter(Boolean);
//       ids.forEach(id => updateQNavState(id));
//     });
//   });

//   // observe the whole test-content region (dropzones, inputs etc.)
//   const observeRoot = document.getElementById('test-content') || document.body;
//   observer.observe(observeRoot, { childList: true, subtree: true, characterData: true });

//   // initial scan for all qnav states (in case some inputs are prefilled)
//   document.querySelectorAll('.qnav-btn').forEach(b => {
//     const qid = b.getAttribute('data-qid');
//     updateQNavState(qid);
//   });
// });

// /* Expose updateQNavState if you want to call it manually elsewhere */
// window.updateQNavState = updateQNavState;

// function scrollToTop() {
//   window.scrollTo({
//     top: 0,
//     behavior: "smooth"
//   });
// }



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
let totalParts = 3;
let currentPart = 1;
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("previous-button");

// "Back Home" button এখানে যাবে (দরকার হলে শুধু এই লাইন বদলাও)
const HOME_URL = "/mocks.html";

// Test lock / double-submit guard
let isSubmitting = false;
let examLocked = false;
let readingMinuteInterval = null;
let readingSecondsInterval = null;

// ==========================================
// BRITISH COUNCIL STYLE (BLUE + RED) CARDS
// ==========================================
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function injectBcStyles() {
  if (document.getElementById("bc-reading-styles")) return;
  const style = document.createElement("style");
  style.id = "bc-reading-styles";
  style.textContent = `
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

    .bc-home-row { text-align: center; padding: 4px 28px 0; }
    .bc-home-link { display: inline-flex; align-items: center; gap: 8px; background: none; border: none; color: #0a2a6e; font-size: 14px; font-weight: 700; cursor: pointer; padding: 8px 14px; border-radius: 8px; font-family: inherit; text-decoration: underline; text-underline-offset: 3px; }
    .bc-home-link:hover { background: #e8efff; }
    .exam-locked .box { pointer-events: none; }

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

    .bc-module-tabs { display: flex; gap: 0; margin: 26px 0 14px; border-radius: 10px; overflow: hidden; border: 2px solid #0a2a6e; background: #fff; }
    .bc-module-tab { flex: 1; padding: 13px 10px; font-size: 15px; font-weight: 800; cursor: pointer; border: none; background: #fff; color: #0a2a6e; transition: all .2s; }
    .bc-module-tab.active { background: #0a2a6e; color: #fff; box-shadow: inset 0 -4px 0 #d52b1e; }

    .bc-review-title { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin: 8px 0 12px; }
    .bc-review-title h3 { margin: 0; font-size: 20px; color: #0a2a6e; border-left: 5px solid #d52b1e; padding-left: 10px; }
    .bc-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .bc-tab { padding: 7px 14px; border-radius: 20px; border: 2px solid #0a2a6e; background: #fff; color: #0a2a6e; font-weight: 700; font-size: 13px; cursor: pointer; }
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

    .bc-result-footer { position: sticky; bottom: 0; background: #fff; border-top: 3px solid #d52b1e; padding: 14px 16px; text-align: center; box-shadow: 0 -6px 18px rgba(0,0,0,.08); }
    .bc-result-footer .bc-btn { flex: none; min-width: 260px; }
    .bc-footer-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

    @media (max-width: 700px) {
      .bc-score-grid { grid-template-columns: 1fr; }
      .bc-review-body { grid-template-columns: 1fr; }
      .bc-result-header h1 { font-size: 22px; }
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

// Listening + Reading দুটোর score ও সব উত্তর দেখানোর preview screen
function showReadingResultModal(score, mistakes) {
  injectBcStyles();
  const existingModal = document.getElementById("instant-result-modal");
  if (existingModal) existingModal.remove();
  const existingConfirm = document.getElementById("mock-confirm-modal");
  if (existingConfirm) existingConfirm.remove();

  const TOTAL = 40;

  // ---- Listening data (stored by listening.js) ----
  const listeningOfficial = (parsedQuestionData && parsedQuestionData.listening && parsedQuestionData.listening.answers) || {};
  const listeningMistakes = normalizeMistakes(readStoredJSON("listeningMistakes"));
  const listeningAnswers = readStoredJSON("listeningAnswers");
  const hasListeningData = !!(listeningMistakes || listeningAnswers);
  const listeningResults = hasListeningData
    ? buildModuleResults(listeningOfficial, listeningMistakes, listeningAnswers)
    : [];

  // ---- Reading data ----
  const readingResults = buildModuleResults(answers, mistakes || {}, answerArrayUpdated);

  const listeningCorrect = listeningResults.filter((r) => r.isCorrect).length;
  const readingCorrect = readingResults.filter((r) => r.isCorrect).length;
  const totalCorrect = listeningCorrect + readingCorrect;
  const totalQuestions = (hasListeningData ? TOTAL : 0) + TOTAL;

  const username = (document.getElementById("userID") && document.getElementById("userID").textContent.trim()) || "";

  const html = `
    <div id="instant-result-modal" class="bc-result">
      <div class="bc-result-header">
        <h1>Your Test Results</h1>
        <p>${username ? "Candidate: " + escapeHtml(username) + " &nbsp;|&nbsp; " : ""}Listening and Reading</p>
        <div class="bc-total-pill">Total: ${totalCorrect} / ${totalQuestions}</div>
      </div>

      <div class="bc-result-wrap">
        <div class="bc-score-grid">
          ${buildScoreCardHtml("Listening", listeningResults, TOTAL)}
          ${buildScoreCardHtml("Reading", readingResults, TOTAL)}
        </div>

        <div class="bc-module-tabs">
          <button type="button" class="bc-module-tab active" data-module="listening">Listening Answers</button>
          <button type="button" class="bc-module-tab" data-module="reading">Reading Answers</button>
        </div>

        <div class="bc-review-title">
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
      </div>

      <div class="bc-result-footer">
        <div class="bc-footer-actions">
          <button id="close-result-btn" class="bc-btn bc-btn-blue" type="button">Back to Home</button>
          <button id="start-writing-result-btn" class="bc-btn bc-btn-red" type="button">Start Writing Test &rarr;</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  const root = document.getElementById("instant-result-modal");
  let activeModule = "listening";
  let activeFilter = "all";

  function applyFilters() {
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

  root.querySelectorAll(".bc-module-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      root.querySelectorAll(".bc-module-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeModule = tab.getAttribute("data-module");
      applyFilters();
    });
  });

  root.querySelectorAll(".bc-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      root.querySelectorAll(".bc-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.getAttribute("data-filter");
      applyFilters();
    });
  });

  applyFilters();

  // Back to Home
  document.getElementById("close-result-btn").addEventListener("click", () => {
    window.location.href = HOME_URL;
  });

  // Start Writing Test (রাইটিংয়ের ইনস্ট্রাকশন ভিডিও পেজে নিয়ে যাবে)
  document.getElementById("start-writing-result-btn").addEventListener("click", () => {
    window.location.href = "/mock-test";
  });
}

// Test shesh hole answer lock kora (inputs disable + drag/drop bondho)
function lockExam() {
  injectBcStyles();
  document.body.classList.add("exam-locked");
  const root = document.getElementById("test-content") || document;
  root.querySelectorAll("input, select, textarea").forEach((el) => { el.disabled = true; });
  document.querySelectorAll(".box").forEach((el) => el.setAttribute("draggable", "false"));
}

// কতগুলো প্রশ্নের উত্তর দেওয়া হয়েছে
function countAnsweredReading() {
  return Object.keys(answers || {}).filter((k) =>
    (answerArrayUpdated[k] || []).some((a) => String(a).trim() !== "")
  ).length;
}

// Test শেষ হলে: Preview / Start Writing / Back Home (card)
function showMockConfirmationModal(score, mistakes, reason) {
  injectBcStyles();
  const existingConfirm = document.getElementById("mock-confirm-modal");
  if (existingConfirm) existingConfirm.remove();

  const isTimeUp = reason === "timeup";
  const title = isTimeUp ? "Time&#39;s Up!" : "Reading Test Finished!";
  const lead = isTimeUp
    ? "Your Reading test time has ended. Your answers have been submitted and locked."
    : "You have finished the Reading test. Your answers have been submitted and locked.";

  const headIcon = isTimeUp
    ? `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#d52b1e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`
    : `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#d52b1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/></svg>`;

  const eyeIcon = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const arrowIcon = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
  const homeIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>`;

  const totalQ = Object.keys(answers || {}).length || 40;
  const answered = countAnsweredReading();
  const unanswered = Math.max(0, totalQ - answered);

  const confirmHtml = `
    <div id="mock-confirm-modal" class="bc-overlay">
      <div class="bc-card bc-card-modern">
        <div class="bc-card-head">
          <div class="bc-icon">${headIcon}</div>
          <h2>${title}</h2>
          <p>Reading Test</p>
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
          <button id="quit-test-btn" class="bc-option bc-option-blue" type="button">
            <span class="bc-option-icon">${eyeIcon}</span>
            <span class="bc-option-text"><strong>Preview Answers</strong><small>See your Listening and Reading scores and every answer</small></span>
          </button>
          <button id="proceed-writing-btn" class="bc-option bc-option-red" type="button">
            <span class="bc-option-icon">${arrowIcon}</span>
            <span class="bc-option-text"><strong>Start Writing Test</strong><small>Continue to the next part of your exam</small></span>
          </button>
        </div>

        <div class="bc-home-row">
          <button id="bc-home-btn" class="bc-home-link" type="button">${homeIcon}<span>Back to Home</span></button>
        </div>

        <p class="bc-card-note-bottom">If you choose Preview or Back to Home, your exam will end here.</p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", confirmHtml);

  // Preview করলে Listening + Reading রেজাল্ট দেখাবে
  document.getElementById("quit-test-btn").addEventListener("click", () => {
    document.getElementById("mock-confirm-modal").remove();
    showReadingResultModal(score, mistakes);
  });

  // Proceed দিলে রাইটিংয়ের ইনস্ট্রাকশন ভিডিও পেজে নিয়ে যাবে
  document.getElementById("proceed-writing-btn").addEventListener("click", () => {
    window.location.href = "/mock-test";
  });

  // Back to Home
  document.getElementById("bc-home-btn").addEventListener("click", () => {
    window.location.href = HOME_URL;
  });
}

// রিডিং সাবমিট ফাংশন
async function submitTest(reason) {
  if (isSubmitting) return;
  isSubmitting = true;
  examLocked = true;

  clearInterval(readingMinuteInterval);
  clearInterval(readingSecondsInterval);
  if (submitModal) submitModal.style.display = "none";
  if (fullscreenModal) fullscreenModal.style.display = "none";

  if (reason === "timeup") {
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
  }

  inputCheckUpdated();
  lockExam();
  sessionStorage.setItem("readingIsCompleted", "true");
  const [scoreToSend, mistakesToSend] = findDifferences(answerArrayUpdated, answers);
  // 👉 এই লাইনগুলো যোগ করে দাও:
  sessionStorage.setItem("readingScore", scoreToSend);
  localStorage.setItem("readingScore", scoreToSend);
  sessionStorage.setItem("readingMistakes", JSON.stringify(mistakesToSend));
  localStorage.setItem("readingMistakes", JSON.stringify(mistakesToSend));

  // ব্যাকএন্ডে রিডিং স্কোর পাঠানো
  try {
    await fetch('/api/update-mock-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: scoreToSend, mistakes: mistakesToSend, mod: "reading" })
    });
  } catch (err) {
    console.error("Score sync error:", err);
  }

  showMockConfirmationModal(scoreToSend, mistakesToSend, reason);
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

// Input check and fill
const answerArrayUpdated = {};
function inputCheckUpdated() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.type == "text") {
      const id = input.placeholder;
      const answer = input.value.trim();
      answerArrayUpdated[id] = [answer];
    }
    if (input.checked) {
      const id = input.name;
      const answer = input.value.trim();
      answerArrayUpdated[id] = [answer];
    }
  });

  const selectInputs = document.querySelectorAll('.matching-information');
  selectInputs.forEach((selectedInput) => {
    const id = selectedInput.id;
    answerArrayUpdated[id] = [selectedInput.value];
  });

  const emptyInitially = document.querySelectorAll('[data-initial="empty"]');
  emptyInitially.forEach((empty) => {
    const id = empty.id;
    answerArrayUpdated[id] = [empty.textContent];
  });
}

const mistakes = {};
function findDifferences(your_answer, realAnswers) {
  var totalScore = 40;

  for (const key in realAnswers) {
    const yourAns = your_answer[key] || [];
    const realAns = realAnswers[key];

    const matchFound = yourAns.some((ans) => realAns.includes(ans.toLowerCase()));

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

setTimeout(inputCheckUpdated, 0.5 * 60 * 1000);

const submitBtn = document.getElementById("finishBtn");
const submitModal = document.getElementById("submit-warning-modal");
if (submitBtn) {
  submitBtn.addEventListener("click", async function (e) {
    e.preventDefault();
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

// Stay button re-enters fullscreen
fullscreenStayBtn.onclick = function() {
  fullscreenModal.style.display = "none";
  document.documentElement.requestFullscreen().catch(() => {});
};

//fullscreen check





//popup settings logic
const popupSettings = document.getElementById("popup-settings");
const popupNote = document.getElementById("popup-note");
function settingsMenu(){
    popupSettings.classList.toggle("menu-visible")
}

function closeSettings(){
    popupSettings.classList.remove("menu-visible")
    popupNote.classList.remove("menu-visible");
}

function openNotes(){
    popupNote.classList.toggle("menu-visible");
}
//popup settings logic

//popup for starting reading
  function openListeningPopup() {
    document.getElementById("listeningOverlay").style.display = "flex";
    document.body.classList.add("listening-popup-active");
  }

  function closeListeningPopup() {
    const overlay = document.getElementById("listeningOverlay");
    overlay.style.display = "none";
    document.body.classList.remove("listening-popup-active");

    // Try fullscreen (fallback if disallowed)
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.warn("Fullscreen blocked:", err));
    }

    // Resume your site logic (example: play audio if present)
    //timer logic (timer blunt)

const timer = document.getElementById("timer");

let minutesRemaining = parseInt(timer.textContent);


const interval = setInterval(async()=>{
  minutesRemaining -= 1;


  if(minutesRemaining <= 10){
    const timerBlunt = document.querySelector(".timer-blunt");
    const timerSpecific = document.querySelector(".timer-specific");

    timerSpecific.style.opacity = 1;
    timerSpecific.style.color = "red";
    timerBlunt.style.opacity = 0;
  }
  if(minutesRemaining <= 0){
    timer.textContent = '0';
    await submitTest("timeup");
    clearInterval(interval);
  }else{
    timer.textContent = minutesRemaining;
  }
}, 1 * 60 * 1000);
readingMinuteInterval = interval;


//timer logic (timer specific)

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
let timerSpecific;
let totalSeconds = 60 * 60
function updateTimerDisplay(){
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  minutesDisplay.textContent = String(minutes).padStart(2, "0");
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

function startTimer(){
  timerSpecific = setInterval(function (){
    if(totalSeconds <= 0){
      clearInterval(timerSpecific);
    }else{
      totalSeconds--;
      updateTimerDisplay()
    }
  }, 1000);
}

startTimer();
    readingSecondsInterval = timerSpecific;
  }
  openListeningPopup();
//popup for starting reading


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
  if(currentPart == 3){
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





//updating question section
const questionData = localStorage.getItem("data");
const parsedQuestionData = JSON.parse(questionData);


//insert from database
const passages = parsedQuestionData.reading.passages;
const questions = parsedQuestionData.reading.questions;
const instructions = parsedQuestionData.reading.instructions;
const answers = parsedQuestionData.reading.answers; 
//insert from database


const part1Margin = document.getElementById('part-margin-1');
const part1QuestionSection = document.getElementById('question-section-1');
const part2Margin = document.getElementById('part-margin-2');
const part2QuestionSection = document.getElementById('question-section-2');
const part3Margin = document.getElementById('part-margin-3');
const part3QuestionSection = document.getElementById('question-section-3');

const questionContainer = document.getElementById("test-content");


const seenGroups = new Set();
const groupCounts = new Map();


//part-range logic
let part1IDS = [];
let part2IDS = [];
let part3IDS = [];
questions.forEach((part)=>{
  if(part.part == 1){
    part1IDS.push(part.id);
  }
  if(part.part == 2){
    part2IDS.push(part.id);
  }
  if(part.part == 3){
    part3IDS.push(part.id);
  }
})
console.log(findHighest(part1IDS));
console.log(part2IDS);
console.log(part3IDS);

const part1Lowest = findLowest(part1IDS);
const part1Highest = findHighest(part1IDS);

const part2Lowest = findLowest(part2IDS);
const part2Highest = findHighest(part2IDS);

const part3Lowest = findLowest(part3IDS);
const part3Highest = findHighest(part3IDS);

//part-range logic

//passage logic
passages.forEach((passage)=>{
  if(passage.part == 1){
    const passageScroll = document.getElementById(`passage-scroll-${passage.part}`);

    const passageSection = document.getElementById(`passage-section-${passage.part}`)
    const title = document.createElement("h2");
    title.textContent = passage.title;
    passageScroll.appendChild(title);
    passage.paragraphs.forEach((paragraph, index)=>{
      const paraHeading = document.createElement("div");
      paraHeading.classList.add("para-heading");
      paraHeading.setAttribute("id", `para-heading-${paragraph}`);
      paraHeading.textContent = paragraph;
      passageScroll.appendChild(paraHeading);
      passage["paragraph-content"][index].forEach((para)=>{
        const paraDIV = document.createElement("div");
        paraDIV.classList.add("para");
        paraDIV.setAttribute("id", `para-${paragraph}-${passage.part}`);
        paraDIV.innerHTML = para;
        passageScroll.appendChild(paraDIV);
      })
    })

    passageSection.appendChild(passageScroll);

    //part-header
    const partHeaderDIV = document.getElementById(`part-header-${passage.part}`);
    const partHeaderP = document.createElement("p");
    partHeaderP.classList.add("part-header-p");
    partHeaderP.textContent = `Read the text and answer questions ${part1Lowest} - ${part1Highest}`
    partHeaderDIV.appendChild(partHeaderP);
  }

  if(passage.part == 2){

    const passageScroll = document.getElementById(`passage-scroll-${passage.part}`);


    const passageSection = document.getElementById(`passage-section-${passage.part}`)
    const title = document.createElement("h2");
    title.textContent = passage.title;
    passageScroll.appendChild(title);
    passage.paragraphs.forEach((paragraph, index)=>{
      const paraHeading = document.createElement("div");
      paraHeading.classList.add("para-heading");
      paraHeading.setAttribute("id", `para-heading-${paragraph}`);
      paraHeading.textContent = paragraph;
      passageScroll.appendChild(paraHeading);
      passage["paragraph-content"][index].forEach((para)=>{
        const paraDIV = document.createElement("div");
        paraDIV.classList.add("para");
        paraDIV.setAttribute("id", `para-${paragraph}-${passage.part}`);
        paraDIV.innerHTML = para;
        passageScroll.appendChild(paraDIV);
      })
    })

    passageSection.appendChild(passageScroll);


    //part-header
    const partHeaderDIV = document.getElementById(`part-header-${passage.part}`);
    const partHeaderP = document.createElement("p");
    partHeaderP.classList.add("part-header-p");
    partHeaderP.textContent = `Read the text and answer questions ${part2Lowest} - ${part2Highest}`
    partHeaderDIV.appendChild(partHeaderP);
  }

  if(passage.part == 3){

    const passageScroll = document.getElementById(`passage-scroll-${passage.part}`);


    const passageSection = document.getElementById(`passage-section-${passage.part}`)
    const title = document.createElement("h2");
    title.textContent = passage.title;
    passageScroll.appendChild(title);
    passage.paragraphs.forEach((paragraph, index)=>{
      const paraHeading = document.createElement("div");
      paraHeading.classList.add("para-heading");
      paraHeading.setAttribute("id", `para-heading-${paragraph}`);
      paraHeading.textContent = paragraph;
      passageScroll.appendChild(paraHeading);
      passage["paragraph-content"][index].forEach((para)=>{
        const paraDIV = document.createElement("div");
        paraDIV.classList.add("para");
        paraDIV.setAttribute("id", `para-${paragraph}-${passage.part}`);
        paraDIV.innerHTML = para;
        passageScroll.appendChild(paraDIV);
      })
    })

    passageSection.appendChild(passageScroll);


    //part-header
    const partHeaderDIV = document.getElementById(`part-header-${passage.part}`);
    const partHeaderP = document.createElement("p");
    partHeaderP.classList.add("part-header-p");
    partHeaderP.textContent = `Read the text and answer questions ${part3Lowest} - ${part3Highest}`
    partHeaderDIV.appendChild(partHeaderP);
  }
})
//passage logic












//insert groups and question types for each part
questions.forEach((q)=>{
  groupCounts.set(q.group, (groupCounts.get(q.group) || 0) + 1);

  if(q.part == 1){
      if(!seenGroups.has(q.group)){
        const groupDiv = document.createElement("div");
        groupDiv.classList.add(`group-${q.group}`, "group");

        //specifically for reading
        const TFNotGivenContainer = document.createElement("div");
        TFNotGivenContainer.classList.add("True-false-notGiven");
        groupDiv.appendChild(TFNotGivenContainer);

        const YNNotgivenContainer = document.createElement("div");
        YNNotgivenContainer.classList.add("Yes-no-notGiven");
        groupDiv.appendChild(YNNotgivenContainer);

        const matchingInformationContainer = document.createElement("div");
        matchingInformationContainer.classList.add("matching-information-container");
        groupDiv.appendChild(matchingInformationContainer);


        const listOfHeadingsContainer = document.createElement("div");
        listOfHeadingsContainer.classList.add("list-of-headings-container");
        groupDiv.appendChild(listOfHeadingsContainer);

        const summaryWithListContainer = document.createElement("div");
        summaryWithListContainer.classList.add("summary-with-list-container");
        groupDiv.appendChild(summaryWithListContainer);


        const summaryCompletionContainer = document.createElement("div");
        summaryCompletionContainer.classList.add("summary-completion");
        groupDiv.appendChild(summaryCompletionContainer);

        //specifically for reading

        //add each type of container to each group to make life easier...
        //mcq(one Choice)
        const mcqContainerDiv = document.createElement("div");
        mcqContainerDiv.classList.add("mcq-container-one-choice");
        groupDiv.appendChild(mcqContainerDiv);
        //mcq(two Choice)

        const mcqContainerTwoDiv = document.createElement("div");
        mcqContainerTwoDiv.classList.add("mcq-container-two-choice");
        groupDiv.appendChild(mcqContainerTwoDiv);

        //table completion

        const tableDiv = document.createElement("div");
        tableDiv.classList.add("table-container");
        groupDiv.appendChild(tableDiv);

        //sentence completion

        const sentenceCompletionDiv = document.createElement("div");
        sentenceCompletionDiv.classList.add("sentence-completion-container");
        groupDiv.appendChild(sentenceCompletionDiv);
        
        //form completion

        const formDiv = document.createElement("div");
        formDiv.classList.add("form-container");
        groupDiv.appendChild(formDiv);

        //note completion

        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note-container");
        groupDiv.appendChild(noteDiv);

        //flow chart completion

        const flowChartDiv = document.createElement("div");
        flowChartDiv.classList.add("flowchart-container");
        groupDiv.appendChild(flowChartDiv);
        

        //short answer questions

        const shortAnswerDiv = document.createElement("div");
        shortAnswerDiv.classList.add("short-answer-container");
        shortAnswerDiv.classList.add("question");
        groupDiv.appendChild(shortAnswerDiv);

        //matching questions

        const matchingContainer = document.createElement("div");
        matchingContainer.classList.add("matching-container");
        groupDiv.appendChild(matchingContainer);

        //diagram labelling

        const diagramLabelDiv=  document.createElement("div");
        diagramLabelDiv.classList.add("diagram-label-container");
        groupDiv.appendChild(diagramLabelDiv);


        const fullNoteCompletionContainer = document.createElement("div");
        fullNoteCompletionContainer.classList.add("full-note-completion-container");
        groupDiv.appendChild(fullNoteCompletionContainer);


        //matching table container

        const matchingTableContainer = document.createElement("div");
        matchingTableContainer.classList.add("matching-table-container");
        groupDiv.appendChild(matchingTableContainer);


        //add each type of container to each group to make life easier...
      
        part1QuestionSection.appendChild(groupDiv);
        seenGroups.add(q.group);
      }
    }
    
    if(q.part == 2){
      if(!seenGroups.has(q.group)){
        const groupDiv = document.createElement("div");
        groupDiv.classList.add(`group-${q.group}`, "group");

        //specifically for reading
        const TFNotGivenContainer = document.createElement("div");
        TFNotGivenContainer.classList.add("True-false-notGiven");
        groupDiv.appendChild(TFNotGivenContainer);

        const YNNotgivenContainer = document.createElement("div");
        YNNotgivenContainer.classList.add("Yes-no-notGiven");
        groupDiv.appendChild(YNNotgivenContainer);

        const matchingInformationContainer = document.createElement("div");
        matchingInformationContainer.classList.add("matching-information-container");
        groupDiv.appendChild(matchingInformationContainer);


        const listOfHeadingsContainer = document.createElement("div");
        listOfHeadingsContainer.classList.add("list-of-headings-container");
        groupDiv.appendChild(listOfHeadingsContainer);


        const summaryWithListContainer = document.createElement("div");
        summaryWithListContainer.classList.add("summary-with-list-container");
        groupDiv.appendChild(summaryWithListContainer);


        const summaryCompletionContainer = document.createElement("div");
        summaryCompletionContainer.classList.add("summary-completion");
        groupDiv.appendChild(summaryCompletionContainer);
        //specifically for reading

        
        //add each type of container to each group to make life easier...
        //mcq(one Choice)
        const mcqContainerDiv = document.createElement("div");
        mcqContainerDiv.classList.add("mcq-container-one-choice");
        groupDiv.appendChild(mcqContainerDiv);
        //mcq(two Choice)

        const mcqContainerTwoDiv = document.createElement("div");
        mcqContainerTwoDiv.classList.add("mcq-container-two-choice");
        groupDiv.appendChild(mcqContainerTwoDiv);

        //table completion

        const tableDiv = document.createElement("div");
        tableDiv.classList.add("table-container");
        groupDiv.appendChild(tableDiv);

        //sentence completion

        const sentenceCompletionDiv = document.createElement("div");
        sentenceCompletionDiv.classList.add("sentence-completion-container");
        groupDiv.appendChild(sentenceCompletionDiv);
        
        //form completion

        const formDiv = document.createElement("div");
        formDiv.classList.add("form-container");
        groupDiv.appendChild(formDiv);

        //note completion

        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note-container");
        groupDiv.appendChild(noteDiv);

        //flow chart completion

        const flowChartDiv = document.createElement("div");
        flowChartDiv.classList.add("flowchart-container");
        groupDiv.appendChild(flowChartDiv);
        

        //short answer questions

        const shortAnswerDiv = document.createElement("div");
        shortAnswerDiv.classList.add("short-answer-container");
        groupDiv.appendChild(shortAnswerDiv);

        //matching questions

        const matchingContainer = document.createElement("div");
        matchingContainer.classList.add("matching-container");
        groupDiv.appendChild(matchingContainer);

        //diagram labelling

        const diagramLabelDiv=  document.createElement("div");
        diagramLabelDiv.classList.add("diagram-label-container");
        groupDiv.appendChild(diagramLabelDiv);

        const fullNoteCompletionContainer = document.createElement("div");
        fullNoteCompletionContainer.classList.add("full-note-completion-container");
        groupDiv.appendChild(fullNoteCompletionContainer);


        //matching table container

        const matchingTableContainer = document.createElement("div");
        matchingTableContainer.classList.add("matching-table-container");
        groupDiv.appendChild(matchingTableContainer);

        //add each type of container to each group to make life easier...




        part2QuestionSection.appendChild(groupDiv);
        seenGroups.add(q.group);
      }
    }

    if(q.part == 3){
      if(!seenGroups.has(q.group)){
        const groupDiv = document.createElement("div");
        groupDiv.classList.add(`group-${q.group}`, "group");

        //specifically for reading
        const TFNotGivenContainer = document.createElement("div");
        TFNotGivenContainer.classList.add("True-false-notGiven");
        groupDiv.appendChild(TFNotGivenContainer);

        const YNNotgivenContainer = document.createElement("div");
        YNNotgivenContainer.classList.add("Yes-no-notGiven");
        groupDiv.appendChild(YNNotgivenContainer);

        const matchingInformationContainer = document.createElement("div");
        matchingInformationContainer.classList.add("matching-information-container");
        groupDiv.appendChild(matchingInformationContainer);


        const listOfHeadingsContainer = document.createElement("div");
        listOfHeadingsContainer.classList.add("list-of-headings-container");
        groupDiv.appendChild(listOfHeadingsContainer);

        const summaryWithListContainer = document.createElement("div");
        summaryWithListContainer.classList.add("summary-with-list-container");
        groupDiv.appendChild(summaryWithListContainer);


        const summaryCompletionContainer = document.createElement("div");
        summaryCompletionContainer.classList.add("summary-completion");
        groupDiv.appendChild(summaryCompletionContainer);
        //specifically for reading


        //add each type of container to each group to make life easier...
        //mcq(one Choice)
        const mcqContainerDiv = document.createElement("div");
        mcqContainerDiv.classList.add("mcq-container-one-choice");
        groupDiv.appendChild(mcqContainerDiv);
        //mcq(two Choice)

        const mcqContainerTwoDiv = document.createElement("div");
        mcqContainerTwoDiv.classList.add("mcq-container-two-choice");
        groupDiv.appendChild(mcqContainerTwoDiv);

        //table completion

        const tableDiv = document.createElement("div");
        tableDiv.classList.add("table-container");
        groupDiv.appendChild(tableDiv);

        //sentence completion

        const sentenceCompletionDiv = document.createElement("div");
        sentenceCompletionDiv.classList.add("sentence-completion-container");
        groupDiv.appendChild(sentenceCompletionDiv);
        
        //form completion

        const formDiv = document.createElement("div");
        formDiv.classList.add("form-container");
        groupDiv.appendChild(formDiv);

        //note completion

        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note-container");
        groupDiv.appendChild(noteDiv);

        //flow chart completion

        const flowChartDiv = document.createElement("div");
        flowChartDiv.classList.add("flowchart-container");
        groupDiv.appendChild(flowChartDiv);
        

        //short answer questions

        const shortAnswerDiv = document.createElement("div");
        shortAnswerDiv.classList.add("short-answer-container");
        groupDiv.appendChild(shortAnswerDiv);

        //matching questions

        const matchingContainer = document.createElement("div");
        matchingContainer.classList.add("matching-container");
        groupDiv.appendChild(matchingContainer);

        //diagram labelling

        const diagramLabelDiv=  document.createElement("div");
        diagramLabelDiv.classList.add("diagram-label-container");
        groupDiv.appendChild(diagramLabelDiv);

        const fullNoteCompletionContainer = document.createElement("div");
        fullNoteCompletionContainer.classList.add("full-note-completion-container");
        groupDiv.appendChild(fullNoteCompletionContainer);


        //matching table container

        const matchingTableContainer = document.createElement("div");
        matchingTableContainer.classList.add("matching-table-container");
        groupDiv.appendChild(matchingTableContainer);

        //add each type of container to each group to make life easier...


        part3QuestionSection.appendChild(groupDiv);
        seenGroups.add(q.group);
      }
    }
})

//insert passages at each part
const part1PassageSection = document.getElementById("passage-section-1");
const part2PassageSection = document.getElementById("passage-section-2");
const part3PassageSection = document.getElementById("passage-section-3");




//group header logic
let questionRangeStarter = 1;
let last = 0;
let index = 0;
groupCounts.forEach((value, group)=>{
    const groupDiv = document.querySelector(`.group-${group}`);
    //trying instruction logic
    const groupHeader = document.createElement("div");
    groupHeader.classList.add("group-header");
    const instructionDiv = document.createElement("div");
    instructionDiv.classList.add("instructions");
    instructionDiv.innerHTML = `<h3>${instructions[index].instruction}</h3>`
    groupHeader.prepend(instructionDiv);
   // console.log(instructions[index].instruction);
    
    const min = findLowest(questions[index].id)
    const max = findHighest(questions[index].id)
    console.log(min)
    console.log(max)

    last += value;
    
    const groupRangeHeader = document.createElement("h3");
    groupRangeHeader.textContent = `Questions ${min} - ${max}`;
    groupHeader.prepend(groupRangeHeader); 
    questionRangeStarter += value;


  console.log(index)
  index += 1;  
  groupDiv.prepend(groupHeader);

})





document.addEventListener("DOMContentLoaded", ()=>{
  questions.forEach((q, index)=>{
    
    if(q.type == "mcq-two-choice-updated"){
      q.questions.forEach((question, index)=>{
        const checkBoxes = document.querySelectorAll(`input[type="checkbox"][name="q${q.id[index][0]}"]`);
        //console.log(index)

        //console.log(Array.from(checkBoxes));
        checkBoxes.forEach(checkBox =>{
        
        checkBox.addEventListener("change", ()=>{
        const checked = Array.from(checkBoxes).filter(cb=> cb.checked);
        checked.forEach((check, idx)=>{
          check.setAttribute("name", q.id[index][idx])
        })
        if(checked.length > 2) {
          checkBox.checked = false;
        }
      })
    })
      })
      
      

      
    }
  })
})


function findLowest(arr) {
  const flat =  arr.flat()
  return Math.min(...flat);
}

function findHighest(arr) {
  const flat = arr.flat()
  return Math.max(...flat);
}

//updating question section


//question insert logic
questions.forEach((question)=>{
    const groupDiv = document.querySelector(`.group-${question.group}`);

  if(question.type === "T/F/NG"){
    const TFContainerDIV = groupDiv.querySelector(".True-false-notGiven");
    
    question.questions.forEach((q, index)=>{
      const TFContainer = document.createElement("div");
      TFContainer.classList.add("TF");
      TFContainer.innerHTML += `<p><strong>${question.id[index]}.</strong> ${q}</p>
                                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="TRUE">&nbsp;&nbsp;TRUE</label>
                                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="FALSE">&nbsp;&nbsp;FALSE</label>
                                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="NOT GIVEN">&nbsp;&nbsp;NOT GIVEN</label>`
      TFContainerDIV.appendChild(TFContainer);
    })

    
  }

  if(question.type === "note-completion"){
    function renderTextWithInput(text){
      const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`);
      const result  = `<p>${htmlString}</p>`
      return result; 
    }

    const fullNoteCompletionContainer = groupDiv.querySelector(".full-note-completion-container");
    fullNoteCompletionContainer.innerHTML += `<p class="note-completion-title">${question.heading}</p>`
    if(!question.subheadings){
      question.paragraphs[0].forEach((paragraph)=>{
        fullNoteCompletionContainer.innerHTML += renderTextWithInput(paragraph);
      })
    } else{
      question.subheadings.forEach((subheading, index)=>{
        fullNoteCompletionContainer.innerHTML += `<p class="note-completion-subheading">${subheading}</p>`
        question.paragraphs[index].forEach((paragraph, index)=>{

          fullNoteCompletionContainer.innerHTML += renderTextWithInput(paragraph);
        })
      })
    }




    const inputs = fullNoteCompletionContainer.querySelectorAll("input");

    inputs.forEach((input, index)=>{
      input.setAttribute("placeholder", question.id[index]);
      input.setAttribute("data-question-id", question.id[index]);
    })

  
  }

  if(question.type === "matching-information"){
    const matchingInformationContainer = groupDiv.querySelector(".matching-information-container");
    const selectElem = document.createElement("select");
    selectElem.setAttribute("name", `matching-information-${question.part}`);
    selectElem.setAttribute("class", `matching-information`);
    const optionElem = document.createElement("option");
    optionElem.setAttribute("value", "");
    selectElem.appendChild(optionElem);
    question.paragraphs.forEach((paragraph)=>{
      const optionELEMENT = document.createElement("option");
      optionELEMENT.setAttribute("value", paragraph)
      optionELEMENT.textContent = paragraph;
      selectElem.appendChild(optionELEMENT);
    })
    console.log(selectElem.outerHTML);

    question.information.forEach((info, index)=>{

      //id select
      selectElem.setAttribute("id", question.id[index]);

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("matching-info-question");

      const infoPara = document.createElement("p");
      infoPara.innerHTML = `<strong>${question.id[index]}.</strong>&nbsp;&nbsp;${info}`;

      infoDiv.appendChild(infoPara);
      infoDiv.innerHTML += selectElem.outerHTML;
      console.log("appending>>")

      

      matchingInformationContainer.appendChild(infoDiv);
    })
  }

  if(question.type === "sentence-completion"){
    function renderTextWithInput(text){
      const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`);
      const result  = `<p>${htmlString}</p>`
      return result; 
    }
    const sentenceCompletionContainer = groupDiv.querySelector(".sentence-completion-container");

    const listElem = document.createElement("ul");
    question.sentences.forEach((sentence)=>{
      const liElem = document.createElement("li");

      liElem.innerHTML  = renderTextWithInput(sentence);

      listElem.appendChild(liElem);
    })

    sentenceCompletionContainer.appendChild(listElem);


    const inputs = sentenceCompletionContainer.querySelectorAll("input");

    inputs.forEach((input, index)=>{
      input.setAttribute("placeholder", question.id[index]);
      input.setAttribute("data-question-id", question.id[index]);
    })
  }


  //might be changed cuz drag and drop
  if(question.type === "feature-matching"){
    const matchingContainer = groupDiv.querySelector(".matching-container");


    const optionDIV = document.createElement("div");
    optionDIV.classList.add("matching-options");

    const selectElem = document.createElement("select");
    selectElem.setAttribute("name", `matching-${question.part}`);

    const optionElem = document.createElement("option");
    optionElem.setAttribute("value", "");
    selectElem.appendChild(optionElem);

    
    question.options.forEach((paragraph)=>{
      const matchingOption = document.createElement("p");
      matchingOption.textContent = paragraph;
      optionDIV.appendChild(matchingOption);
      const optionELEMENT = document.createElement("option");

      optionELEMENT.setAttribute("value", paragraph);
      optionELEMENT.textContent = paragraph;

      selectElem.appendChild(optionELEMENT);
    })
    matchingContainer.appendChild(optionDIV);

    question.features.forEach((feature, index)=>{
      const featureDIV = document.createElement("div");
      featureDIV.classList.add("matching-feature-question");

      const featurePara = document.createElement('p');
      featurePara.innerHTML = `<strong>${question.id[index]}.</strong>&nbsp;&nbsp;${feature}`
      featureDIV.appendChild(featurePara);
      featureDIV.innerHTML += selectElem.outerHTML;

      matchingContainer.appendChild(featureDIV);
    })
  }

  if(question.type === "mcq-one-choice"){
    const mcqContainerDiv = groupDiv.querySelector(".mcq-container-one-choice");
    question.questions.forEach((q, index)=>{
      const mcqContainer = document.createElement("div");
      mcqContainer.classList.add("mcq");

      mcqContainer.innerHTML += `<p><strong>${question.id[index]}.</strong> ${q}</p>`
      question.options[index].forEach((option, idx)=>{
        mcqContainer.innerHTML += `
        <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="${idx+1}">&nbsp;&nbsp;${option}</label><br>`
      })
      mcqContainerDiv.appendChild(mcqContainer);
    })
  }


  if(question.type === "Y/N/NG"){
    const YNContainerDIV = groupDiv.querySelector(".Yes-no-notGiven");

    question.questions.forEach((q, index)=>{
      const YNContainer = document.createElement("div");
      YNContainer.classList.add("YN");
      YNContainer.innerHTML += `<p><strong>${question.id[index]}</strong> ${q}</p>
                                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="YES">&nbsp;&nbsp;YES</label>
                                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="NO">&nbsp;&nbsp;NO</label>
                                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="NOT GIVEN">&nbsp;&nbsp;NOT GIVEN</label>`

      YNContainerDIV.appendChild(YNContainer);
    })
  }

  if(question.type === "diagram-labelling"){
    const diagramContainer = groupDiv.querySelector(".diagram-label-container");
    const allBoxes = document.createElement("div");
    allBoxes.classList.add("all-boxes");

    const imagingContainer = document.createElement("div");
    imagingContainer.classList.add("image-div");
    imagingContainer.innerHTML = `<img src="${question.image}">`
    diagramContainer.appendChild(imagingContainer);

    const matchingLabels = document.createElement("div");
    matchingLabels.classList.add("matching-labels");

    const matchingOptions = document.createElement("div");
    matchingOptions.classList.add("matching-options");

    question.labels.forEach((label, index)=>{
      matchingLabels.innerHTML += `<div class="qa-pair">
                                  <div class="question-label"><strong>${question.id[index]}.</strong>&nbsp;&nbsp;${label}</div>
                                  <div id="${question.id[index]}" data-question-id="${question.id[index]}" class="box dropzone" data-class="diagram" data-item="" data-initial="empty"></div>
                                  </div>`
    })
    allBoxes.appendChild(matchingLabels);

    question.options.forEach((option)=>{
      matchingOptions.innerHTML += `<div class="box" data-class="diagram" data-item="${option}">${option}</div>`
    })
    allBoxes.appendChild(matchingOptions);
    diagramContainer.appendChild(allBoxes);
  }

  if(question.type === "feature-matching-drag-drop"){
    const matchingContainer = groupDiv.querySelector(".matching-container");
    const allBoxes = document.createElement("div");
    allBoxes.classList.add("all-boxes");

    const matchingFeatures = document.createElement("div");
    matchingFeatures.classList.add("matching-features");

    const matchingOptions = document.createElement("div");
    matchingOptions.classList.add("matching-options");

    question.options.forEach((option, index)=>{
      matchingOptions.innerHTML += `<div class="box" data-class="feature-matching" data-item="${option}">${option}</div>`
    })
    allBoxes.appendChild(matchingOptions);

    question.features.forEach((feature, index)=>{
      matchingFeatures.innerHTML += `<div class="qa-pair">
                                    <div class="question-feature"><strong>${question.id[index]}.</strong>&nbsp;&nbsp;${feature}</div>
                                    <div id="${question.id[index]}" data-question-id="${question.id[index]}" class="box dropzone" data-class="feature-matching" data-item="" data-initial="empty"></div>
                                    </div>`
    })
    allBoxes.appendChild(matchingFeatures);

    matchingContainer.appendChild(allBoxes);
  }

  if(question.type === "list-of-headings"){
      const listContainer = groupDiv.querySelector(".list-of-headings-container");
      
      const passage = document.querySelector(`#passage-scroll-${question.part}`);

      const listHeadings = document.createElement("div");
      listHeadings.classList.add("list-headings");
      question.headings.forEach((heading, index)=>{
        listHeadings.innerHTML += `<div class="box" data-class="list-of-headings" data-item="${heading}">${heading}</div>`
        
        
      })

      question.paragraphs.forEach((paragraph, idx)=>{
          const emptyBox = document.createElement("div");
          emptyBox.setAttribute("id", question.id[idx]);
          emptyBox.classList.add("box", "dropzone", "box-heading");
          emptyBox.setAttribute("data-item", "");
          emptyBox.setAttribute("data-initial", "empty");
          emptyBox.setAttribute("data-class", "list-of-headings");
          emptyBox.setAttribute("data-question-id", question.id[idx]);
          const para = document.querySelector(`#para-${paragraph}-${question.part}`)
          passage.insertBefore(emptyBox, para)
        })

      listContainer.appendChild(listHeadings);
  }

  if(question.type === "summary-completion"){
    function renderTextWithInput(text){
      const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`);
      const result  = `<p>${htmlString}</p>`
      return result; 
    }

    const summaryContainer = groupDiv.querySelector(".summary-with-list-container");
    const summaryTitle = document.createElement("p");
    summaryTitle.classList.add("summary-title");
    summaryTitle.textContent = question.title;

    summaryContainer.appendChild(summaryTitle);

    const summary = document.createElement("div");
    summary.classList.add("summary");
    summary.innerHTML = renderTextWithInput(question.summary[0]);

    summaryContainer.appendChild(summary);

    const inputs = summaryContainer.querySelectorAll("input");

    inputs.forEach((input, index)=>{
      input.setAttribute("placeholder", question.id[index]);
      input.setAttribute("data-question-id", question.id[index]);
    })
  }

  if(question.type === "summary-with-list-of-words"){
    function renderTextWithInput(text){
      const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input">`);
      const result  = `<p>${htmlString}</p>`
      return result; 
    }
    const summaryContainer = groupDiv.querySelector(".summary-with-list-container");

    const wordList = document.createElement("ul");

    question["word-list"].forEach((word, index)=>{
        wordList.innerHTML += `<li>${word}</li>`
    })
    summaryContainer.appendChild(wordList);

    const summaryTitle = document.createElement("p");
    summaryTitle.classList.add("summary-title");
    summaryTitle.textContent = question.title;

    summaryContainer.appendChild(summaryTitle);

    const summary = document.createElement("div");
    summary.classList.add("summary");

    summary.innerHTML = renderTextWithInput(question.summary[0]);

    summaryContainer.appendChild(summary);

    const inputs = summaryContainer.querySelectorAll("input");

    inputs.forEach((input, index)=>{
      input.setAttribute("placeholder", question.id[index]);
      input.setAttribute("data-question-id", question.id[index]);
    })
  }

  if(question.type === "table-completion"){
    function renderTextWithInput(text){
          const htmlString = text.replaceAll("[blank]", `<input spellcheck="false" type="text" class="blank-input" placeholder="${index}">`)
          const result =  `<p style="text-align:center">${htmlString}</p>`;
          return result;
        }

    const tableContainer = groupDiv.querySelector(".table-container");
    const table = document.createElement("table");

    question["table-structure"].forEach((count, index)=>{
      const tr = document.createElement("tr");

      for(let i=0; i<count; i++){
        const td = document.createElement("td");

        if(count == findLowest(question["table-structure"])){
          td.colSpan = findHighest(question["table-structure"]);
        }
        td.innerHTML += renderTextWithInput(question.cells[index][i]);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    })

    tableContainer.appendChild(table);

    const inputs = tableContainer.querySelectorAll("input");

    inputs.forEach((input, index)=>{
      input.setAttribute("placeholder", question.id[index]);
      input.setAttribute("data-question-id", question.id[index]);
    })
  }

  if(question.type === "mcq-two-choice-updated"){
    const mcqTwoChoiceContainer = groupDiv.querySelector(".mcq-container-two-choice");
    question.questions.forEach((q, index)=>{
      mcqTwoChoiceContainer.innerHTML += `<div class="question-box">
                                          <div class="number-boxes">
                                          <div class="num-box">${question.id[index][0]}</div>
                                          <div class="num-box">${question.id[index][1]}</div>
                                          </div>
                                          
                                          <div class="question-text">
                                          ${q[0]}
                                          </div>
                                          </div>`
      question.options[index].forEach((option, idx)=>{
        mcqTwoChoiceContainer.innerHTML += `<div class="options">
                                            <label>${idx + 1}&nbsp;&nbsp;<input type="checkbox" name="q${question.id[index][0]}" data-question-id="${question.id[index][0]} ${question.id[index][1]}" value="${idx + 1}">   &nbsp;&nbsp;${option}</label><br>
                                          </div>`
      })
    })
  }

  if(question.type === "matching-table-container"){
    const matchingTableContainer = groupDiv.querySelector(".matching-table-container");
    const matchingTable = document.createElement("table");

    const thead = document.createElement("thead");
    const theadTr = document.createElement("tr");
    theadTr.innerHTML = "<th></th>"
    question.paragraphs.forEach((para)=>{
      theadTr.innerHTML += `<th>${para}</th>`
    })

    thead.appendChild(theadTr);




    const tbody = document.createElement("tbody");
    question.information.forEach((info, index)=>{
      const tbodyTr = document.createElement("tr");

      tbodyTr.setAttribute("data-info", `info-${index}`);

      tbodyTr.innerHTML = `<td>${info}</td>`;

      question.paragraphs.forEach((para)=>{
        tbodyTr.innerHTML += `<td><input type="radio" name="${question.id[index]}" data-question-id="${question.id[index]}" value="${para}" data-id="info${index}-${para}" /></td>`
      })

      tbody.appendChild(tbodyTr);
    })


    




    matchingTable.appendChild(thead);
    matchingTable.appendChild(tbody);


    matchingTableContainer.appendChild(matchingTable);
  }

})

//question insert logic



//font-change setting

const testContent = document.getElementById("test-content");
const fontSizeSelector = document.getElementById("font-size-selector")


fontSizeSelector.addEventListener("change", function (){

  const selectedValue = this.value;
  testContent.style.fontSize = selectedValue;
  //console.log("Selected value:", selectedValue);
  

})














//drag & drop

//learning drag and drop

var dragElement = null;
var items;

function handleDragStart(e){
  this.style.opacity = "0.4";
  dragElement = this;

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("item", this.innerHTML)
}

function handleDragOver(e){
  if(e.preventDefault){
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = "move";
  return false;
}

function handleDragEnter(e){
  this.classList.add("dragover");
}

function handleDragLeave(e){
  this.classList.remove("dragover");
}

function handleDrop(e){
  if (e.stopPropagation) e.stopPropagation();

  if (dragElement !== this) {
    const draggedGroup = dragElement.getAttribute("data-class");
    const targetGroup = this.getAttribute("data-class");

    if(draggedGroup !== targetGroup){
      this.classList.add("invalid-drop");
      setTimeout(() => this.classList.remove("invalid-drop"), 1000);
      return false;
    } else{
    const draggedHTML = dragElement.innerHTML;
    const draggedItem = dragElement.getAttribute("data-item");

    const targetHTML = this.innerHTML;
    const targetItem = this.getAttribute("data-item");

    
    dragElement.innerHTML = targetHTML;
    dragElement.setAttribute("data-item", targetItem || "");

    this.innerHTML = draggedHTML;
    this.setAttribute("data-item", draggedItem || "");

    // Reapply
    addDragEvents(dragElement);
    addDragEvents(this);
    }

    
  }
}

function handleDragEnd(e){
  this.style.opacity = "1";
  items.forEach((item)=>{
    item.classList.remove("dragover");
  })
}

function addDragEvents(element) {
  const hasContent = element.textContent.trim() !== "";

  element.setAttribute("draggable", hasContent);

  //attach
  element.addEventListener("dragenter", handleDragEnter);
  element.addEventListener("dragover", handleDragOver);
  element.addEventListener("dragleave", handleDragLeave);
  element.addEventListener("drop", handleDrop);
  element.addEventListener("dragend", handleDragEnd);

  // Only attach dragstart if content is not empty
  if (hasContent) {
    element.addEventListener("dragstart", handleDragStart);
  }
}

document.addEventListener("DOMContentLoaded", (event)=>{
  items = document.querySelectorAll(".box");

  items.forEach((item)=>{
    addDragEvents(item)
  })
})









//highlight button logic

const button = document.getElementById('highlight-btn');

    document.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Show button near selection
        button.style.top =  `${window.scrollY + rect.top + 20}px`;
        button.style.left = `${window.scrollX + rect.right - 35}px`;
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    });

    button.addEventListener('click', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        //const range = selection.getRangeAt(0);
        //console.log(range.toString());
        //const span = document.createElement('span');
        //span.classList.add('highlighted');
        //range.surroundContents(span);
        //highlightRangeTest(range);
        highlightSelection();
        selection.removeAllRanges();
        button.style.display = 'none';
      }
    });


function highlightSelection() {
  var userSelection = window.getSelection().getRangeAt(0);
  var safeRanges = getSafeRanges(userSelection);
  for (var i = 0; i < safeRanges.length; i++) {
    highlightRange(safeRanges[i]);
  }
}

function highlightRange(range) {
  var newNode = document.createElement("div");
  newNode.setAttribute(
    "class",
    "highlight-wrapper"
  );
  range.surroundContents(newNode);
}

(function () {
  const popup = document.getElementById('unhighlightPopup');
  let currentHighlight = null;

  // Interactive elements that should be allowed to receive clicks/focus
  const interactiveSelector = 'input, textarea, select, button, a, label, [contenteditable="true"]';

  function showPopupFor(wrapper, clickEvent) {
    currentHighlight = wrapper;
    const rect = wrapper.getBoundingClientRect();

    // position a little below the wrapper
    popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
    // ensure popup doesn't run off-screen left
    const left = Math.max(rect.left + window.scrollX, 6);
    popup.style.left = `${left}px`;
    popup.style.display = 'block';

    // focus so keyboard users can press Enter
    popup.focus();
  }

  function hidePopup() {
    popup.style.display = 'none';
    currentHighlight = null;
  }

  function unwrapHighlight(wrapper) {
    if (!wrapper) return;
    // Move all child nodes into a fragment to preserve elements exactly
    const frag = document.createDocumentFragment();
    while (wrapper.firstChild) {
      frag.appendChild(wrapper.firstChild);
    }
    // Replace the wrapper with its children (preserves structure)
    wrapper.replaceWith(frag);

    // clean up references
    hidePopup();
  }

  // click handler for the whole document
  document.addEventListener('click', function (e) {
    const target = e.target;

    // if popup clicked → unhighlight the stored wrapper
    if (target === popup || popup.contains(target)) {
      if (currentHighlight) {
        unwrapHighlight(currentHighlight);
      } else {
        hidePopup();
      }
      e.stopPropagation();
      return;
    }

    // Did we click inside a highlight wrapper (or its descendants)?
    const wrapper = target.closest && target.closest('.highlight-wrapper');

    if (wrapper) {
      // If the click target is an interactive element, allow normal interaction (don't show popup)
      if (target.matches(interactiveSelector)) {
        // don't show popup; let the input/select get focus
        hidePopup();
        return;
      }

      // Otherwise show popup for the nearest wrapper clicked
      showPopupFor(wrapper, e);
      e.stopPropagation();
      return;
    }

    // Click outside → hide popup
    hidePopup();
  }, true); // use capture to reduce chance popup immediately hides

  // keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      hidePopup();
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === popup) {
      // Enter or Space on the popup triggers unhighlight
      if (currentHighlight) unwrapHighlight(currentHighlight);
      e.preventDefault();
      return;
    }
  });

  // Reposition popup when scrolling / resizing so it stays near the wrapper
  function repositionPopup() {
    if (!currentHighlight || popup.style.display === 'none') return;
    const rect = currentHighlight.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
    popup.style.left = `${Math.max(rect.left + window.scrollX, 6)}px`;
  }
  window.addEventListener('scroll', repositionPopup, { passive: true });
  window.addEventListener('resize', repositionPopup);

})();

function getSafeRanges(dangerous) {
  var a = dangerous.commonAncestorContainer;
  // Starts -- Work inward from the start, selecting the largest safe range
  var s = new Array(0), rs = new Array(0);
  if (dangerous.startContainer != a) {
    for (var i = dangerous.startContainer; i != a; i = i.parentNode) {
      s.push(i);
    }
  }
  if (s.length > 0) {
    for (var i = 0; i < s.length; i++) {
      var xs = document.createRange();
      if (i) {
        xs.setStartAfter(s[i - 1]);
        xs.setEndAfter(s[i].lastChild);
      } else {
        xs.setStart(s[i], dangerous.startOffset);
        xs.setEndAfter((s[i].nodeType == Node.TEXT_NODE) ? s[i] : s[i].lastChild);
      }
      rs.push(xs);
    }
  }

  // Ends -- basically the same code reversed
  var e = new Array(0), re = new Array(0);
  if (dangerous.endContainer != a) {
    for (var i = dangerous.endContainer; i != a; i = i.parentNode) {
      e.push(i);
    }
  }
  if (e.length > 0) {
    for (var i = 0; i < e.length; i++) {
      var xe = document.createRange();
      if (i) {
        xe.setStartBefore(e[i].firstChild);
        xe.setEndBefore(e[i - 1]);
      } else {
        xe.setStartBefore((e[i].nodeType == Node.TEXT_NODE) ? e[i] : e[i].firstChild);
        xe.setEnd(e[i], dangerous.endOffset);
      }
      re.unshift(xe);
    }
  }

  // Middle -- the uncaptured middle
  if ((s.length > 0) && (e.length > 0)) {
    var xm = document.createRange();
    xm.setStartAfter(s[s.length - 1]);
    xm.setEndBefore(e[e.length - 1]);
  } else {
    return [dangerous];
  }

  // Concat
  rs.push(xm);
  response = rs.concat(re);

  // Send to Console
  return response;
}


// hightlight button logic //


//scrolling while dragging
document.addEventListener("dragover", function (e) {
  const scrollMargin = 80; 
  const scrollSpeed = 500;  

  const y = e.clientY;
  const windowHeight = window.innerHeight;

  if (y < scrollMargin) {
    
    window.scrollBy(0, -scrollSpeed);
  } else if (y > windowHeight - scrollMargin) {
    
    window.scrollBy(0, scrollSpeed);
  }
});


/* ------------------ PART NAV: small question buttons & answered-state tracking ------------------ */

/*
  Creates small q-buttons for each part (beside Part label) and wires:
   - click -> scroll to question element with data-question-id
   - auto highlight when question becomes answered (text/radio/select/drop)
*/

// Utility: find question elements by numeric id. Questions in your render use data-question-id attributes.
function getQuestionElementById(qid) {
  // first try attribute selectors
  return document.querySelector(`[data-question-id="${qid}"], [id="${qid}"]`);
}

// Check whether a given question id currently has an answer (text / radio / select / dropzones)
function isQuestionAnswered(qid) {
  // 1) text inputs: inputs with data-question-id or placeholder matching qid
  const textInput = document.querySelector(`input[type="text"][data-question-id="${qid}"], input[type="text"][placeholder="${qid}"]`);
  if (textInput && textInput.value.trim() !== "") return true;

  // 2) radio / checkbox: inputs with name === qid
  const inputsByName = document.querySelectorAll(`input[name="${qid}"]`);
  if (inputsByName && inputsByName.length > 0) {
    for (const el of inputsByName) {
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (el.checked) return true;
      }
    }
  }

  // 3) select (matching-information sets the select id to the q.id earlier)
  const select = document.getElementById(qid);
  if (select && select.value && select.value.trim() !== "") return true;

  // 4) dropzones / boxes (you used id on dropzone divs for many types)
  const dropzone = document.getElementById(String(qid));
  if (dropzone) {
    const text = dropzone.textContent.trim();
    // If it has visible content, consider it answered. Also check dataset.item if used.
    if (text !== "" && text.toLowerCase() !== "empty") return true;
    if (dropzone.dataset && dropzone.dataset.item && dropzone.dataset.item !== "") return true;
  }

  // 5) fallback: any input *inside* an element that carries the question id as parent (p tag with data-question-id etc)
  const questionParent = document.querySelector(`[data-question-id="${qid}"]`);
  if (questionParent) {
    const innerInputs = questionParent.querySelectorAll("input, select, textarea");
    for (const el of innerInputs) {
      if (el.type === "text" && el.value.trim() !== "") return true;
      if ((el.type === "radio" || el.type === "checkbox") && el.checked) return true;
      if (el.tagName.toLowerCase() === "select" && el.value && el.value.trim() !== "") return true;
    }
  }

  return false;
}

// Toggle state of qnav button for single question id
function updateQNavState(qid) {
  const btn = document.querySelector(`.qnav-btn[data-qid="${qid}"]`);
  if (!btn) return;
  if (isQuestionAnswered(qid)) {
    btn.classList.add("attempted");
  } else {
    btn.classList.remove("attempted");
  }
}

// Build part -> question small buttons once DOM is ready
// Build part -> question small buttons once DOM is ready
function createPartQuestionNavButtons() {
  for (let part = 1; part <= 4; part++) {
    const partEl = document.getElementById(`part-${part}`);
    if (!partEl) continue;

    // collect question ids inside this part
    const qEls = partEl.querySelectorAll("[data-question-id], [id]");
    const qIds = [];

    qEls.forEach(el => {
  const attr = el.getAttribute("data-question-id");
  if (!attr) return;

  // split by space to handle multiple ids
  const ids = attr.split(" ")
    .map(s => s.match(/\d+/)?.[0])
    .filter(Boolean);

  ids.forEach(idNum => {
    if (!qIds.includes(idNum)) qIds.push(idNum);
  });
});

    // Sort ids numerically
    qIds.sort((a, b) => Number(a) - Number(b));

    console.log(qIds);

    // find the bottom navbar's question-button-container for this part
    const container = document.querySelector(`.question-button-container[data-part="${part}"]`);
    if (!container) continue;

    // clear existing
    container.innerHTML = "";

    // create buttons
    qIds.forEach(qid => {
      const b = document.createElement("button");
      b.className = "qnav-btn";
      b.type = "button";
      b.setAttribute("data-qid", qid);
      b.textContent = qid;

      // click -> scroll to the question element
      b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const targetEl = getQuestionElementById(qid);
        if (targetEl) {
          const parentPartMatch = targetEl.closest(".part");
          if (parentPartMatch) {
            const idAttr = parentPartMatch.id || "";
            const whichPart = idAttr.match(/\d+/);
            if (whichPart) showPart(Number(whichPart[0]));
          }
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          // mark visual current
          document.querySelectorAll('.qnav-btn.current').forEach(x => x.classList.remove('current'));
          b.classList.add('current');
        }
      });

      container.appendChild(b);

      // initial state: set attempted if needed
      setTimeout(() => updateQNavState(qid), 10);
    });
  }
}

// Add listeners for inputs (text, radio, selects) so qnav state updates live
function attachAnswerListeners() {
  // text inputs
  document.querySelectorAll('input[type="text"]').forEach(inp=>{
    // trigger on input
    inp.addEventListener('input', () => {
      const qid = inp.getAttribute('data-question-id') || inp.getAttribute('placeholder') || extractNumeric(inp);
      if (qid) updateQNavState(String(qid));
    });
  });

  // radio / checkbox groups -> on change
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp=>{
    inp.addEventListener('change', () => {
      const name = inp.name;
      if (name) {
        // if name contains digits, extract the first number
        const found = String(name).match(/\d+/);
        if (found) updateQNavState(found[0]);
        else updateQNavState(name);
      }
    });
  });

  // selects (matching-information)
  document.querySelectorAll('select').forEach(sel=>{
    sel.addEventListener('change', () => {
      const id = sel.id || (sel.getAttribute && sel.getAttribute('name'));
      if (id) updateQNavState(String(id));
    });
  });
}

// helper: try extract numeric id from element attributes
function extractNumeric(el) {
  if (!el) return null;
  const attrs = ['data-question-id','id','name','placeholder'];
  for (const a of attrs) {
    const v = el.getAttribute && el.getAttribute(a);
    if (!v) continue;
    const found = String(v).match(/\d+/);
    if (found) return found[0];
  }
  return null;
}

/* --- IMPORTANT: replace or augment your existing handleDrop to call updateQNavState on affected qids.
   If you already have a handleDrop function, replace it with the following version below.
*/

function handleDrop(e){
  if (e.stopPropagation) e.stopPropagation();

  if (dragElement !== this) {
    const draggedGroup = dragElement.getAttribute("data-class");
    const targetGroup = this.getAttribute("data-class");

    if(draggedGroup !== targetGroup){
      this.classList.add("invalid-drop");
      setTimeout(() => this.classList.remove("invalid-drop"), 1000);
      return false;
    } else{
      const draggedHTML = dragElement.innerHTML;
      const draggedItem = dragElement.getAttribute("data-item");

      const targetHTML = this.innerHTML;
      const targetItem = this.getAttribute("data-item");

      // Swap
      dragElement.innerHTML = targetHTML;
      dragElement.setAttribute("data-item", targetItem || "");

      this.innerHTML = draggedHTML;
      this.setAttribute("data-item", draggedItem || "");

      // Reapply events
      addDragEvents(dragElement);
      addDragEvents(this);

      // Update data-initial attr (if you use it)
      if (dragElement.dataset) dragElement.dataset.initial = dragElement.dataset.initial || "filled";
      if (this.dataset) this.dataset.initial = this.dataset.initial || "filled";

      // After swap, try to detect if these two elements correspond to questions (they often have id attributes equal to question ids)
      // If elements have an id that is numeric, update their qnav states.
      const idsToUpdate = new Set();
      const aId = dragElement.getAttribute('id');
      const bId = this.getAttribute('id');
      if (aId) { const f = aId.match(/\d+/); if (f) idsToUpdate.add(f[0]); }
      if (bId) { const f = bId.match(/\d+/); if (f) idsToUpdate.add(f[0]); }

      // Also check parent question containers for data-question-id
      [dragElement, this].forEach(el => {
        const qparent = el.closest('[data-question-id]');
        if (qparent) {
          const qid = qparent.getAttribute('data-question-id') || (qparent.getAttribute('id') && qparent.getAttribute('id').match(/\d+/) && qparent.getAttribute('id').match(/\d+/)[0]);
          if (qid) idsToUpdate.add(qid);
        }
      });

      // call update for all discovered ids
      idsToUpdate.forEach(id => updateQNavState(id));
    }
  }
}

/* --- Setup: run on DOMContentLoaded so that dynamic questions are already rendered --- */
document.addEventListener("DOMContentLoaded", () => {
  // create the small buttons inside each Part nav
  createPartQuestionNavButtons();

  // attach listeners for text, radio, select changes
  attachAnswerListeners();

  // also attach a MutationObserver for dropzones or areas that may change content dynamically
  const observer = new MutationObserver(muts => {
    muts.forEach(m => {
      // when nodes change, try to update states for any question ids found in mutated subtree
      const el = m.target;
      const ids = Array.from(el.querySelectorAll('[data-question-id], [id]')).map(x => {
        const idv = x.getAttribute('data-question-id') || x.getAttribute('id');
        const f = idv && String(idv).match(/\d+/);
        return f ? f[0] : null;
      }).filter(Boolean);
      ids.forEach(id => updateQNavState(id));
    });
  });

  // observe the whole test-content region (dropzones, inputs etc.)
  const observeRoot = document.getElementById('test-content') || document.body;
  observer.observe(observeRoot, { childList: true, subtree: true, characterData: true });

  // initial scan for all qnav states (in case some inputs are prefilled)
  document.querySelectorAll('.qnav-btn').forEach(b => {
    const qid = b.getAttribute('data-qid');
    updateQNavState(qid);
  });
});

/* Expose updateQNavState if you want to call it manually elsewhere */
window.updateQNavState = updateQNavState;

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}



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