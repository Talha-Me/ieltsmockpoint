// // // ==========================================
// // // 1. POPUP SETTINGS & NOTES LOGIC
// // // ==========================================
// // const popupSettings = document.getElementById("popup-settings");
// // const popupNote = document.getElementById("popup-note");

// // function settingsMenu() {
// //   if (popupSettings) popupSettings.classList.toggle("menu-visible");
// // }

// // function closeSettings() {
// //   if (popupSettings) popupSettings.classList.remove("menu-visible");
// //   if (popupNote) popupNote.classList.remove("menu-visible");
// // }

// // function openNotes() {
// //   if (popupNote) popupNote.classList.toggle("menu-visible");
// // }

// // // ==========================================
// // // 2. LIVE WORD COUNT
// // // ==========================================
// // const textarea = document.getElementById("writer-1");
// // const wordCountDisplay = document.getElementById("wordCount-1");

// // if (textarea && wordCountDisplay) {
// //   textarea.addEventListener("input", () => {
// //     const text = textarea.value.trim();
// //     const wordCount = text === "" ? 0 : text.split(/\s+/).length;
// //     wordCountDisplay.textContent = `Word Count: ${wordCount}`;
// //   });
// // }

// // // ==========================================
// // // 3. DATA RETRIEVER
// // // ==========================================
// // const dataRetriever = async function () {
// //   try {
// //     const currentQuery = window.location.search;
// //     const res = await fetch("/api/pracDataWriting" + currentQuery);
// //     if (!res.ok) {
// //       console.warn("Could not load /api/pracDataWriting, status:", res.status);
// //       return null;
// //     }
// //     return await res.json();
// //   } catch (err) {
// //     console.error("Data fetch error:", err);
// //     return null;
// //   }
// // };

// // let data;
// // let questions;
// // let questionType;

// // // ==========================================
// // // 4. MAIN FUNCTION
// // // ==========================================
// // async function main() {
// //   const submitBtn = document.getElementById("finishBtn");
// //   const submitModal = document.getElementById("submit-warning-modal");
// //   const submitOkButton = document.getElementById("submit-ok-btn");
// //   const submitStayButton = document.getElementById("submit-stay-btn");

// //   if (submitBtn && submitModal) {
// //     submitBtn.addEventListener("click", function (e) {
// //       e.preventDefault();
// //       submitModal.style.display = "flex";
// //     });
// //   }

// //   if (submitStayButton && submitModal) {
// //     submitStayButton.addEventListener("click", function (e) {
// //       e.preventDefault();
// //       submitModal.style.display = "none";
// //     });
// //   }

// //   if (submitOkButton && submitModal) {
// //     submitOkButton.addEventListener("click", (e) => {
// //       e.preventDefault();
// //       submitModal.style.display = "none";
// //       showWritingAIResultModal();
// //     });
// //   }

// //   // F3 বন্ধ রাখা হয়েছে, কিন্তু ব্রাউজার জুম (Ctrl + Wheel / Ctrl + +/-) চালু রাখা হয়েছে
// //   window.addEventListener("keydown", function (e) {
// //     if (e.key === "F3") {
// //       e.preventDefault();
// //     }
// //   });

// //   data = await dataRetriever();
// //   if (!data) return;

// //   questionType = data.type || "";
// //   questions = data.writing ? data.writing.questions : [];

// //   // Task 1 এর ক্যাটাগরি তালিকা
// //   const task1Types = [
// //     "1",
// //     "Line-Graph",
// //     "Bar-Chart",
// //     "Pie-Chart",
// //     "Table",
// //     "Process-Diagram",
// //     "Map",
// //     "Mixed-Charts"
// //   ];

// //   // টাইপ অনুযায়ী পার্ট ১ অথবা পার্ট ২ নির্ধারণ
// //   const isPart1 = task1Types.includes(questionType) || String(questionType).toLowerCase().includes("map");

// //   const partHeader = document.getElementById("part-header-1");
// //   if (partHeader) {
// //     if (isPart1) {
// //       partHeader.innerHTML = `
// //         <h2>Part 1</h2>
// //         <p class="part-header-p">You should spend about 20 minutes on this task. Write at least <strong>150 WORDS.</strong></p>
// //       `;
// //     } else {
// //       partHeader.innerHTML = `
// //         <h2>Part 2</h2>
// //         <p class="part-header-p">You should spend about 40 minutes on this task. Write at least <strong>250 WORDS.</strong></p>
// //       `;
// //     }
// //   }

// //   // proshno o chobi render
// //   const infoPanel = document.getElementById("info-panel-1");
// //   if (infoPanel && Array.isArray(questions)) {
// //     infoPanel.innerHTML = "";
// //     infoPanel.style.display = "flex";
// //     infoPanel.style.flexDirection = "column";
// //     infoPanel.style.gap = "16px";

// //     questions.forEach((q) => {
// //       if (q.question) {
// //         const promptDiv = document.createElement("div");
// //         promptDiv.className = "question-prompt";
// //         promptDiv.style.cssText = "font-size: 15px; line-height: 1.7; font-weight: 500; color: #1e293b; clear: both;";
// //         promptDiv.innerHTML = q.question;
// //         infoPanel.appendChild(promptDiv);
// //       }

// //       if (Array.isArray(q.image) && q.image.length > 0) {
// //         const imageContainer = document.createElement("div");
// //         imageContainer.className = "image-container text-center";
// //         imageContainer.style.cssText = "width: 100%; margin-top: 10px; clear: both;";

// //         q.image.forEach((img) => {
// //           imageContainer.innerHTML += `
// //             <img src="${img}" alt="Task 1 Visual" style="display: block; max-width: 100%; height: auto; margin: 0 auto 12px auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);">
// //           `;
// //         });
// //         infoPanel.appendChild(imageContainer);
// //       }
// //     });
  
// //   }
// // }

// // // ==========================================
// // // 5. AI RESULT MODAL
// // // ==========================================
// // function showWritingAIResultModal() {
// //   const existingModal = document.getElementById("instant-result-modal");
// //   if (existingModal) existingModal.remove();

// //   const studentAnswer = document.getElementById("writer-1") ? document.getElementById("writer-1").value.trim() : "";
// //   const wordCount = studentAnswer === "" ? 0 : studentAnswer.split(/\s+/).length;

// //   const task1Types = ["1", "Line-Graph", "Bar-Chart", "Pie-Chart", "Table", "Process-Diagram", "Map", "Mixed-Charts"];
// //   const isPart1 = task1Types.includes(questionType) || String(questionType).toLowerCase().includes("map");

// //   let promptContent = "";
// //   if (isPart1) {
// //     promptContent = `You are a certified, official IELTS Writing Senior Examiner. Please thoroughly evaluate my IELTS Writing Task 1 response and provide an official assessment.

// // Please provide:
// // 1. Overall Estimated Band Score (0 - 9)
// // 2. Criterion Breakdown:
// //    - Task Achievement
// //    - Coherence and Cohesion
// //    - Lexical Resource
// //    - Grammatical Range and Accuracy
// // 3. Specific Mistakes & Errors: Explicitly highlight exact grammatical errors, awkward phrases, punctuation, and vocabulary slips that I made.
// // 4. Solutions & Corrections: Explain what is the exact solution/correction for each error and how to rephrase them for Band 8+.
// // 5. Enhanced Band 8.5+ Model Answer: Rewrite an improved model response based on my content.

// // ---
// // ### MY TASK 1 WRITING SUBMISSION:
// // ${studentAnswer || "No submission text provided."}`;
// //   } else {
// //     promptContent = `You are a certified, official IELTS Writing Senior Examiner. Please thoroughly evaluate my IELTS Writing Task 2 essay and provide an official assessment.

// // Please provide:
// // 1. Overall Estimated Band Score (0 - 9)
// // 2. Criterion Breakdown:
// //    - Task Response
// //    - Coherence and Cohesion
// //    - Lexical Resource
// //    - Grammatical Range and Accuracy
// // 3. Specific Mistakes & Errors: Point out specific grammar slips, poor vocabulary choices, cohesion issues, and sentence fragments.
// // 4. Solutions & Corrections: Give the exact solutions and sentence improvements for each mistake.
// // 5. Enhanced Band 8.5+ Model Essay: Provide an enhanced model version of my essay with advanced collocations and complex structures.

// // ---
// // ### MY TASK 2 ESSAY SUBMISSION:
// // ${studentAnswer || "No submission text provided."}`;
// //   }

// //   const modalHtml = `
// //     <div id="instant-result-modal" style="position:fixed; inset:0; background:rgba(11,43,82,0.85); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:999999; font-family:'Sora', -apple-system, sans-serif;">
// //       <div style="background:#ffffff; border-radius:18px; max-width:780px; width:95%; max-height:92vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.35); border:1px solid #e3e9f3;">
        
// //         <div style="background:#0b2b52; color:white; padding:22px 28px; position:relative; box-shadow:inset 0 -3px 0 #e0202d;">
// //           <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
// //             <div>
// //               <h2 style="margin:0; font-size:20px; font-weight:700;">🎉 Practice Completed! (${isPart1 ? 'Task 1' : 'Task 2'})</h2>
// //               <p style="margin:4px 0 0; opacity:0.85; font-size:13px;">Your response is ready for instant AI band evaluation.</p>
// //             </div>
// //             <div style="background:rgba(255,255,255,0.12); padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">
// //               📝 Total Words: <span style="color:#38bdf8;">${wordCount}</span>
// //             </div>
// //           </div>
// //         </div>

// //         <div style="padding:22px 28px; overflow-y:auto; flex:1; background:#f8fafc;">
// //           <div style="background:#eaf2fd; border:1px solid #cfe1fa; border-left:5px solid #1565c9; padding:14px 18px; border-radius:10px; margin-bottom:18px;">
// //             <div style="font-weight:700; color:#0b2b52; font-size:14.5px; margin-bottom:4px;">
// //               💡 Get your Instant Band Score & Feedback:
// //             </div>
// //             <div style="color:#334155; font-size:13px; line-height:1.5;">
// //               1. Click <strong>"Copy Evaluation Prompt"</strong> below.<br>
// //               2. Open ChatGPT, Gemini, or Claude.<br>
// //               3. Paste and send! You will get your estimated Band Score, detailed mistake analysis, and solution instantly without typing anything!
// //             </div>
// //           </div>

// //           <div style="margin-bottom:18px;">
// //             <div style="font-size:12.5px; font-weight:700; color:#475569; text-transform:uppercase; margin-bottom:8px;">
// //               Quick Open AI:
// //             </div>
// //             <div style="display:flex; gap:10px; flex-wrap:wrap;">
// //               <a href="https://chatgpt.com" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#10a37f; color:#fff; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700;">
// //                 ChatGPT
// //               </a>
// //               <a href="https://gemini.google.com" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#1a73e8; color:#fff; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700;">
// //                 Gemini
// //               </a>
// //               <a href="https://claude.ai" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#cc785c; color:#fff; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700;">
// //                 Claude
// //               </a>
// //             </div>
// //           </div>

// //           <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:18px;">
// //             <strong style="color:#0b2b52; font-size:14px; display:block; margin-bottom:8px;">Your Written Response (${wordCount} words):</strong>
// //             <textarea readonly style="width:100%; min-height:130px; padding:10px; font-size:13px; border-radius:8px; border:1px solid #cbd5e1; background:#f8fafc; color:#334155; line-height:1.5;">${studentAnswer || "(No answer entered)"}</textarea>
// //           </div>
// //         </div>

// //         <div style="padding:14px 28px; background:#ffffff; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
// //           <button id="copy-ai-btn" style="background:#e0202d; color:#fff; border:none; padding:9px 20px; border-radius:8px; font-size:13.5px; font-weight:700; cursor:pointer;">
// //             📋 Copy Evaluation Prompt
// //           </button>
          
// //           <button id="finish-practice-btn" style="background:#0b2b52; color:#fff; border:none; padding:9px 18px; border-radius:8px; font-size:13.5px; font-weight:600; cursor:pointer;">
// //             Return to Practice
// //           </button>
// //         </div>

// //       </div>
// //     </div>
// //   `;

// //   document.body.insertAdjacentHTML("beforeend", modalHtml);

// //   document.getElementById("copy-ai-btn").addEventListener("click", function () {
// //     navigator.clipboard.writeText(promptContent).then(() => {
// //       const orig = this.innerHTML;
// //       this.innerHTML = `✓ Copied to Clipboard!`;
// //       this.style.background = "#10b981";
// //       setTimeout(() => {
// //         this.innerHTML = orig;
// //         this.style.background = "#e0202d";
// //       }, 2000);
// //     });
// //   });

// //   document.getElementById("finish-practice-btn").addEventListener("click", () => {
// //     window.location.href = "/practice-hub";
// //   });
// // }

// // document.addEventListener("DOMContentLoaded", async () => {
// //   await main();
// // });

// // ==========================================
// // 1. POPUP SETTINGS & NOTES LOGIC
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

// // ==========================================
// // 2. LIVE WORD COUNT
// // ==========================================
// const textarea = document.getElementById("writer-1");
// const wordCountDisplay = document.getElementById("wordCount-1");

// if (textarea && wordCountDisplay) {
//   textarea.addEventListener("input", () => {
//     const text = textarea.value.trim();
//     const wordCount = text === "" ? 0 : text.split(/\s+/).length;
//     wordCountDisplay.textContent = `Word Count: ${wordCount}`;
//   });
// }

// /// ==========================================
// // 3. IMAGE HELPER FUNCTION (SMART URL CONVERTER)
// // ==========================================
// function normalizeImageUrl(src) {
//   if (!src || typeof src !== "string") return "";
//   src = src.trim();

//   // 1. Google Drive direct image stream converter
//   if (src.includes("drive.google.com")) {
//     const fileIdMatch = src.match(/\/d\/([a-zA-Z0-9_-]+)/) || src.match(/id=([a-zA-Z0-9_-]+)/);
//     if (fileIdMatch && fileIdMatch[1]) {
//       return `https://lh3.googleusercontent.com/u/0/d/${fileIdMatch[1]}`;
//     }
//   }

//   // 2. Dropbox direct link converter
//   if (src.includes("dropbox.com")) {
//     return src.replace("?dl=0", "?raw=1").replace("&dl=0", "&raw=1");
//   }

//   // 3. Imgur direct image link converter
//   if (src.includes("imgur.com") && !src.includes("i.imgur.com") && !src.endsWith(".png") && !src.endsWith(".jpg")) {
//     const id = src.split("/").pop();
//     return `https://i.imgur.com/${id}.png`;
//   }

//   // 4. Direct Online Link (HTTP/HTTPS) or Base64
//   if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) {
//     return src;
//   }

//   // 5. Local path handling
//   if (!src.startsWith("/")) {
//     src = "/" + src;
//   }

//   return src;
// }

// // ==========================================
// // 4. DATA RETRIEVER
// // ==========================================
// const dataRetriever = async function () {
//   try {
//     const currentQuery = window.location.search;
//     const res = await fetch("/api/pracDataWriting" + currentQuery);
//     if (!res.ok) {
//       console.warn("Could not load /api/pracDataWriting, status:", res.status);
//       return null;
//     }
//     return await res.json();
//   } catch (err) {
//     console.error("Data fetch error:", err);
//     return null;
//   }
// };

// let data;
// let questions;
// let questionType;

// // ==========================================
// // 5. MAIN FUNCTION
// // ==========================================
// async function main() {
//   const submitBtn = document.getElementById("finishBtn");
//   const submitModal = document.getElementById("submit-warning-modal");
//   const submitOkButton = document.getElementById("submit-ok-btn");
//   const submitStayButton = document.getElementById("submit-stay-btn");

//   if (submitBtn && submitModal) {
//     submitBtn.addEventListener("click", function (e) {
//       e.preventDefault();
//       submitModal.style.display = "flex";
//     });
//   }

//   if (submitStayButton && submitModal) {
//     submitStayButton.addEventListener("click", function (e) {
//       e.preventDefault();
//       submitModal.style.display = "none";
//     });
//   }

//   if (submitOkButton && submitModal) {
//     submitOkButton.addEventListener("click", (e) => {
//       e.preventDefault();
//       submitModal.style.display = "none";
//       showWritingAIResultModal();
//     });
//   }

//   // F3 bondho rakha hoyeche
//   window.addEventListener("keydown", function (e) {
//     if (e.key === "F3") {
//       e.preventDefault();
//     }
//   });

//   data = await dataRetriever();
//   if (!data) return;

//   questionType = data.type || "";
//   questions = data.writing ? data.writing.questions : (data.questions || []);

//   const task1Types = [
//     "1",
//     "Line-Graph",
//     "Bar-Chart",
//     "Pie-Chart",
//     "Table",
//     "Process-Diagram",
//     "Map",
//     "Mixed-Charts"
//   ];

//   const isPart1 = task1Types.includes(questionType) || String(questionType).toLowerCase().includes("map");

//   const partHeader = document.getElementById("part-header-1");
//   if (partHeader) {
//     if (isPart1) {
//       partHeader.innerHTML = `
//         <h2>Part 1</h2>
//         <p class="part-header-p">You should spend about 20 minutes on this task. Write at least <strong>150 WORDS.</strong></p>
//       `;
//     } else {
//       partHeader.innerHTML = `
//         <h2>Part 2</h2>
//         <p class="part-header-p">You should spend about 40 minutes on this task. Write at least <strong>250 WORDS.</strong></p>
//       `;
//     }
//   }

//   const infoPanel = document.getElementById("info-panel-1");
//   if (infoPanel && Array.isArray(questions)) {
//     infoPanel.innerHTML = "";
//     infoPanel.style.display = "flex";
//     infoPanel.style.flexDirection = "column";
//     infoPanel.style.gap = "16px";

//     questions.forEach((q) => {
//       if (q.question) {
//         const promptDiv = document.createElement("div");
//         promptDiv.className = "question-prompt";
//         promptDiv.style.cssText = "font-size: 15px; line-height: 1.7; font-weight: 500; color: #1e293b; clear: both;";
//         promptDiv.innerHTML = q.question;
//         infoPanel.appendChild(promptDiv);
//       }

//       const imagesToRender = [];

//       if (Array.isArray(q.image)) {
//         q.image.forEach(img => { if (img) imagesToRender.push(img); });
//       } else if (typeof q.image === "string" && q.image.trim() !== "") {
//         imagesToRender.push(q.image.trim());
//       }

//       if (Array.isArray(q.imageUrl)) {
//         q.imageUrl.forEach(img => { if (img) imagesToRender.push(img); });
//       } else if (typeof q.imageUrl === "string" && q.imageUrl.trim() !== "") {
//         imagesToRender.push(q.imageUrl.trim());
//       }

//       if (imagesToRender.length === 0) {
//         if (data.image && typeof data.image === "string") imagesToRender.push(data.image);
//         else if (data.imageUrl && typeof data.imageUrl === "string") imagesToRender.push(data.imageUrl);
//         else if (data.writing && data.writing.image && typeof data.writing.image === "string") imagesToRender.push(data.writing.image);
//       }

//       if (imagesToRender.length > 0) {
//         const imageContainer = document.createElement("div");
//         imageContainer.className = "image-container text-center";
//         imageContainer.style.cssText = "width: 100%; margin-top: 10px; clear: both;";

//         imagesToRender.forEach((img) => {
//           const finalSrc = normalizeImageUrl(img);
//           imageContainer.innerHTML += `
//             <img src="${finalSrc}" 
//                  alt="Task 1 Visual" 
//                  referrerpolicy="no-referrer"
//                  crossorigin="anonymous"
//                  loading="eager"
//                  style="display: block; max-width: 100%; height: auto; margin: 0 auto 12px auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);" 
//                  onerror="console.error('Failed to load image from URL:', this.src)">
//           `;
//         });
//         infoPanel.appendChild(imageContainer);
//       }
//     });

//     const renderedImages = infoPanel.querySelectorAll("img");
//     if (renderedImages.length === 0 && (data.image || data.imageUrl || (data.writing && data.writing.image))) {
//       const rootImg = data.image || data.imageUrl || (data.writing && data.writing.image);
//       if (rootImg) {
//         const fallbackContainer = document.createElement("div");
//         fallbackContainer.className = "image-container text-center";
//         fallbackContainer.style.cssText = "width: 100%; margin-top: 10px; clear: both;";
//         const finalFallbackSrc = normalizeImageUrl(rootImg);
//         fallbackContainer.innerHTML = `
//           <img src="${finalFallbackSrc}" 
//                alt="Task 1 Visual" 
//                referrerpolicy="no-referrer"
//                crossorigin="anonymous"
//                loading="eager"
//                style="display: block; max-width: 100%; height: auto; margin: 0 auto 12px auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);" 
//                onerror="console.error('Failed to load root image:', this.src)">
//         `;
//         infoPanel.appendChild(fallbackContainer);
//       }
//     }
//   }
// }

// // ==========================================
// // 6. AI RESULT MODAL
// // ==========================================
// function showWritingAIResultModal() {
//   const existingModal = document.getElementById("instant-result-modal");
//   if (existingModal) existingModal.remove();

//   const studentAnswer = document.getElementById("writer-1") ? document.getElementById("writer-1").value.trim() : "";
//   const wordCount = studentAnswer === "" ? 0 : studentAnswer.split(/\s+/).length;

//   const task1Types = ["1", "Line-Graph", "Bar-Chart", "Pie-Chart", "Table", "Process-Diagram", "Map", "Mixed-Charts"];
//   const isPart1 = task1Types.includes(questionType) || String(questionType).toLowerCase().includes("map");

//   let promptContent = "";
//   if (isPart1) {
//     promptContent = `You are a certified, official IELTS Writing Senior Examiner. Please thoroughly evaluate my IELTS Writing Task 1 response and provide an official assessment.

// Please provide:
// 1. Overall Estimated Band Score (0 - 9)
// 2. Criterion Breakdown:
//    - Task Achievement
//    - Coherence and Cohesion
//    - Lexical Resource
//    - Grammatical Range and Accuracy
// 3. Specific Mistakes & Errors: Explicitly highlight exact grammatical errors, awkward phrases, punctuation, and vocabulary slips that I made.
// 4. Solutions & Corrections: Explain what is the exact solution/correction for each error and how to rephrase them for Band 8+.
// 5. Enhanced Band 8.5+ Model Answer: Rewrite an improved model response based on my content.

// ---
// ### MY TASK 1 WRITING SUBMISSION:
// ${studentAnswer || "No submission text provided."}`;
//   } else {
//     promptContent = `You are a certified, official IELTS Writing Senior Examiner. Please thoroughly evaluate my IELTS Writing Task 2 essay and provide an official assessment.

// Please provide:
// 1. Overall Estimated Band Score (0 - 9)
// 2. Criterion Breakdown:
//    - Task Response
//    - Coherence and Cohesion
//    - Lexical Resource
//    - Grammatical Range and Accuracy
// 3. Specific Mistakes & Errors: Point out specific grammar slips, poor vocabulary choices, cohesion issues, and sentence fragments.
// 4. Solutions & Corrections: Give the exact solutions and sentence improvements for each mistake.
// 5. Enhanced Band 8.5+ Model Essay: Provide an enhanced model version of my essay with advanced collocations and complex structures.

// ---
// ### MY TASK 2 ESSAY SUBMISSION:
// ${studentAnswer || "No submission text provided."}`;
//   }

//   const modalHtml = `
//     <div id="instant-result-modal" style="position:fixed; inset:0; background:rgba(11,43,82,0.85); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:999999; font-family:'Sora', -apple-system, sans-serif;">
//       <div style="background:#ffffff; border-radius:18px; max-width:780px; width:95%; max-height:92vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.35); border:1px solid #e3e9f3;">
        
//         <div style="background:#0b2b52; color:white; padding:22px 28px; position:relative; box-shadow:inset 0 -3px 0 #e0202d;">
//           <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
//             <div>
//               <h2 style="margin:0; font-size:20px; font-weight:700;">🎉 Practice Completed! (${isPart1 ? 'Task 1' : 'Task 2'})</h2>
//               <p style="margin:4px 0 0; opacity:0.85; font-size:13px;">Your response is ready for instant AI band evaluation.</p>
//             </div>
//             <div style="background:rgba(255,255,255,0.12); padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">
//               📝 Total Words: <span style="color:#38bdf8;">${wordCount}</span>
//             </div>
//           </div>
//         </div>

//         <div style="padding:22px 28px; overflow-y:auto; flex:1; background:#f8fafc;">
//           <div style="background:#eaf2fd; border:1px solid #cfe1fa; border-left:5px solid #1565c9; padding:14px 18px; border-radius:10px; margin-bottom:18px;">
//             <div style="font-weight:700; color:#0b2b52; font-size:14.5px; margin-bottom:4px;">
//               💡 Get your Instant Band Score & Feedback:
//             </div>
//             <div style="color:#334155; font-size:13px; line-height:1.5;">
//               1. Click <strong>"Copy Evaluation Prompt"</strong> below.<br>
//               2. Open ChatGPT, Gemini, or Claude.<br>
//               3. Paste and send! You will get your estimated Band Score, detailed mistake analysis, and solution instantly without typing anything!
//             </div>
//           </div>

//           <div style="margin-bottom:18px;">
//             <div style="font-size:12.5px; font-weight:700; color:#475569; text-transform:uppercase; margin-bottom:8px;">
//               Quick Open AI:
//             </div>
//             <div style="display:flex; gap:10px; flex-wrap:wrap;">
//               <a href="https://chatgpt.com" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#10a37f; color:#fff; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700;">
//                 ChatGPT
//               </a>
//               <a href="https://gemini.google.com" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#1a73e8; color:#fff; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700;">
//                 Gemini
//               </a>
//               <a href="https://claude.ai" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#cc785c; color:#fff; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700;">
//                 Claude
//               </a>
//             </div>
//           </div>

//           <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:18px;">
//             <strong style="color:#0b2b52; font-size:14px; display:block; margin-bottom:8px;">Your Written Response (${wordCount} words):</strong>
//             <textarea readonly style="width:100%; min-height:130px; padding:10px; font-size:13px; border-radius:8px; border:1px solid #cbd5e1; background:#f8fafc; color:#334155; line-height:1.5;">${studentAnswer || "(No answer entered)"}</textarea>
//           </div>
//         </div>

//         <div style="padding:14px 28px; background:#ffffff; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
//           <button id="copy-ai-btn" style="background:#e0202d; color:#fff; border:none; padding:9px 20px; border-radius:8px; font-size:13.5px; font-weight:700; cursor:pointer;">
//             📋 Copy Evaluation Prompt
//           </button>
          
//           <button id="finish-practice-btn" style="background:#0b2b52; color:#fff; border:none; padding:9px 18px; border-radius:8px; font-size:13.5px; font-weight:600; cursor:pointer;">
//             Return to Practice
//           </button>
//         </div>

//       </div>
//     </div>
//   `;

//   document.body.insertAdjacentHTML("beforeend", modalHtml);

//   document.getElementById("copy-ai-btn").addEventListener("click", function () {
//     navigator.clipboard.writeText(promptContent).then(() => {
//       const orig = this.innerHTML;
//       this.innerHTML = `✓ Copied to Clipboard!`;
//       this.style.background = "#10b981";
//       setTimeout(() => {
//         this.innerHTML = orig;
//         this.style.background = "#e0202d";
//       }, 2000);
//     });
//   });

//   document.getElementById("finish-practice-btn").addEventListener("click", () => {
//     window.location.href = "/practice-hub";
//   });
// }

// document.addEventListener("DOMContentLoaded", async () => {
//   await main();
// });

// // ==========================================
// // 1. POPUP SETTINGS & NOTES LOGIC
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

// // ==========================================
// // 2. LIVE WORD COUNT
// // ==========================================
// const textarea = document.getElementById("writer-1");
// const wordCountDisplay = document.getElementById("wordCount-1");

// if (textarea && wordCountDisplay) {
//   textarea.addEventListener("input", () => {
//     const text = textarea.value.trim();
//     const wordCount = text === "" ? 0 : text.split(/\s+/).length;
//     wordCountDisplay.textContent = `Word Count: ${wordCount}`;
//   });
// }

// // ==========================================
// // 3. DATA RETRIEVER
// // ==========================================
// const dataRetriever = async function () {
//   try {
//     const currentQuery = window.location.search;
//     const res = await fetch("/api/pracDataWriting" + currentQuery);
//     if (!res.ok) {
//       console.warn("Could not load /api/pracDataWriting, status:", res.status);
//       return null;
//     }
//     return await res.json();
//   } catch (err) {
//     console.error("Data fetch error:", err);
//     return null;
//   }
// };

// let data;
// let questions;
// let questionType;

// // ==========================================
// // 4. MAIN FUNCTION
// // ==========================================
// async function main() {
//   const submitBtn = document.getElementById("finishBtn");
//   const submitModal = document.getElementById("submit-warning-modal");
//   const submitOkButton = document.getElementById("submit-ok-btn");
//   const submitStayButton = document.getElementById("submit-stay-btn");

//   if (submitBtn && submitModal) {
//     submitBtn.addEventListener("click", function (e) {
//       e.preventDefault();
//       submitModal.style.display = "flex";
//     });
//   }

//   if (submitStayButton && submitModal) {
//     submitStayButton.addEventListener("click", function (e) {
//       e.preventDefault();
//       submitModal.style.display = "none";
//     });
//   }

//   if (submitOkButton && submitModal) {
//     submitOkButton.addEventListener("click", (e) => {
//       e.preventDefault();
//       submitModal.style.display = "none";
//       showWritingAIResultModal();
//     });
//   }

//   // F3 বন্ধ রাখা হয়েছে, কিন্তু ব্রাউজার জুম (Ctrl + Wheel / Ctrl + +/-) চালু রাখা হয়েছে
//   window.addEventListener("keydown", function (e) {
//     if (e.key === "F3") {
//       e.preventDefault();
//     }
//   });

//   data = await dataRetriever();
//   if (!data) return;

//   questionType = data.type || "";
//   questions = data.writing ? data.writing.questions : [];

//   // Task 1 এর ক্যাটাগরি তালিকা
//   const task1Types = [
//     "1",
//     "Line-Graph",
//     "Bar-Chart",
//     "Pie-Chart",
//     "Table",
//     "Process-Diagram",
//     "Map",
//     "Mixed-Charts"
//   ];

//   // টাইপ অনুযায়ী পার্ট ১ অথবা পার্ট ২ নির্ধারণ
//   const isPart1 = task1Types.includes(questionType) || String(questionType).toLowerCase().includes("map");

//   const partHeader = document.getElementById("part-header-1");
//   if (partHeader) {
//     if (isPart1) {
//       partHeader.innerHTML = `
//         <h2>Part 1</h2>
//         <p class="part-header-p">You should spend about 20 minutes on this task. Write at least <strong>150 WORDS.</strong></p>
//       `;
//     } else {
//       partHeader.innerHTML = `
//         <h2>Part 2</h2>
//         <p class="part-header-p">You should spend about 40 minutes on this task. Write at least <strong>250 WORDS.</strong></p>
//       `;
//     }
//   }

//   // proshno o chobi render
//   const infoPanel = document.getElementById("info-panel-1");
//   if (infoPanel && Array.isArray(questions)) {
//     infoPanel.innerHTML = "";
//     infoPanel.style.display = "flex";
//     infoPanel.style.flexDirection = "column";
//     infoPanel.style.gap = "16px";

//     questions.forEach((q) => {
//       if (q.question) {
//         const promptDiv = document.createElement("div");
//         promptDiv.className = "question-prompt";
//         promptDiv.style.cssText = "font-size: 15px; line-height: 1.7; font-weight: 500; color: #1e293b; clear: both;";
//         promptDiv.innerHTML = q.question;
//         infoPanel.appendChild(promptDiv);
//       }

//       if (Array.isArray(q.image) && q.image.length > 0) {
//         const imageContainer = document.createElement("div");
//         imageContainer.className = "image-container text-center";
//         imageContainer.style.cssText = "width: 100%; margin-top: 10px; clear: both;";

//         q.image.forEach((img) => {
//           imageContainer.innerHTML += `
//             <img src="${img}" alt="Task 1 Visual" style="display: block; max-width: 100%; height: auto; margin: 0 auto 12px auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);">
//           `;
//         });
//         infoPanel.appendChild(imageContainer);
//       }
//     });
  
//   }
// }

// // ==========================================
// // 5. AI RESULT MODAL
// // ==========================================
// function showWritingAIResultModal() {
//   const existingModal = document.getElementById("instant-result-modal");
//   if (existingModal) existingModal.remove();

//   const studentAnswer = document.getElementById("writer-1") ? document.getElementById("writer-1").value.trim() : "";
//   const wordCount = studentAnswer === "" ? 0 : studentAnswer.split(/\s+/).length;

//   const task1Types = ["1", "Line-Graph", "Bar-Chart", "Pie-Chart", "Table", "Process-Diagram", "Map", "Mixed-Charts"];
//   const isPart1 = task1Types.includes(questionType) || String(questionType).toLowerCase().includes("map");

//   let promptContent = "";
//   if (isPart1) {
//     promptContent = `You are a certified, official IELTS Writing Senior Examiner. Please thoroughly evaluate my IELTS Writing Task 1 response and provide an official assessment.

// Please provide:
// 1. Overall Estimated Band Score (0 - 9)
// 2. Criterion Breakdown:
//    - Task Achievement
//    - Coherence and Cohesion
//    - Lexical Resource
//    - Grammatical Range and Accuracy
// 3. Specific Mistakes & Errors: Explicitly highlight exact grammatical errors, awkward phrases, punctuation, and vocabulary slips that I made.
// 4. Solutions & Corrections: Explain what is the exact solution/correction for each error and how to rephrase them for Band 8+.
// 5. Enhanced Band 8.5+ Model Answer: Rewrite an improved model response based on my content.

// ---
// ### MY TASK 1 WRITING SUBMISSION:
// ${studentAnswer || "No submission text provided."}`;
//   } else {
//     promptContent = `You are a certified, official IELTS Writing Senior Examiner. Please thoroughly evaluate my IELTS Writing Task 2 essay and provide an official assessment.

// Please provide:
// 1. Overall Estimated Band Score (0 - 9)
// 2. Criterion Breakdown:
//    - Task Response
//    - Coherence and Cohesion
//    - Lexical Resource
//    - Grammatical Range and Accuracy
// 3. Specific Mistakes & Errors: Point out specific grammar slips, poor vocabulary choices, cohesion issues, and sentence fragments.
// 4. Solutions & Corrections: Give the exact solutions and sentence improvements for each mistake.
// 5. Enhanced Band 8.5+ Model Essay: Provide an enhanced model version of my essay with advanced collocations and complex structures.

// ---
// ### MY TASK 2 ESSAY SUBMISSION:
// ${studentAnswer || "No submission text provided."}`;
//   }

//   const modalHtml = `
//     <div id="instant-result-modal" style="position:fixed; inset:0; background:rgba(11,43,82,0.85); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:999999; font-family:'Sora', -apple-system, sans-serif;">
//       <div style="background:#ffffff; border-radius:18px; max-width:780px; width:95%; max-height:92vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.35); border:1px solid #e3e9f3;">
        
//         <div style="background:#0b2b52; color:white; padding:22px 28px; position:relative; box-shadow:inset 0 -3px 0 #e0202d;">
//           <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
//             <div>
//               <h2 style="margin:0; font-size:20px; font-weight:700;">🎉 Practice Completed! (${isPart1 ? 'Task 1' : 'Task 2'})</h2>
//               <p style="margin:4px 0 0; opacity:0.85; font-size:13px;">Your response is ready for instant AI band evaluation.</p>
//             </div>
//             <div style="background:rgba(255,255,255,0.12); padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">
//               📝 Total Words: <span style="color:#38bdf8;">${wordCount}</span>
//             </div>
//           </div>
//         </div>

//         <div style="padding:22px 28px; overflow-y:auto; flex:1; background:#f8fafc;">
//           <div style="background:#eaf2fd; border:1px solid #cfe1fa; border-left:5px solid #1565c9; padding:14px 18px; border-radius:10px; margin-bottom:18px;">
//             <div style="font-weight:700; color:#0b2b52; font-size:14.5px; margin-bottom:4px;">
//               💡 Get your Instant Band Score & Feedback:
//             </div>
//             <div style="color:#334155; font-size:13px; line-height:1.5;">
//               1. Click <strong>"Copy Evaluation Prompt"</strong> below.<br>
//               2. Open ChatGPT, Gemini, or Claude.<br>
//               3. Paste and send! You will get your estimated Band Score, detailed mistake analysis, and solution instantly without typing anything!
//             </div>
//           </div>

//           <div style="margin-bottom:18px;">
//             <div style="font-size:12.5px; font-weight:700; color:#475569; text-transform:uppercase; margin-bottom:8px;">
//               Quick Open AI:
//             </div>
//             <div style="display:flex; gap:10px; flex-wrap:wrap;">
//               <a href="https://chatgpt.com" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#10a37f; color:#fff; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700;">
//                 ChatGPT
//               </a>
//               <a href="https://gemini.google.com" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#1a73e8; color:#fff; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700;">
//                 Gemini
//               </a>
//               <a href="https://claude.ai" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#cc785c; color:#fff; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700;">
//                 Claude
//               </a>
//             </div>
//           </div>

//           <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:18px;">
//             <strong style="color:#0b2b52; font-size:14px; display:block; margin-bottom:8px;">Your Written Response (${wordCount} words):</strong>
//             <textarea readonly style="width:100%; min-height:130px; padding:10px; font-size:13px; border-radius:8px; border:1px solid #cbd5e1; background:#f8fafc; color:#334155; line-height:1.5;">${studentAnswer || "(No answer entered)"}</textarea>
//           </div>
//         </div>

//         <div style="padding:14px 28px; background:#ffffff; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
//           <button id="copy-ai-btn" style="background:#e0202d; color:#fff; border:none; padding:9px 20px; border-radius:8px; font-size:13.5px; font-weight:700; cursor:pointer;">
//             📋 Copy Evaluation Prompt
//           </button>
          
//           <button id="finish-practice-btn" style="background:#0b2b52; color:#fff; border:none; padding:9px 18px; border-radius:8px; font-size:13.5px; font-weight:600; cursor:pointer;">
//             Return to Practice
//           </button>
//         </div>

//       </div>
//     </div>
//   `;

//   document.body.insertAdjacentHTML("beforeend", modalHtml);

//   document.getElementById("copy-ai-btn").addEventListener("click", function () {
//     navigator.clipboard.writeText(promptContent).then(() => {
//       const orig = this.innerHTML;
//       this.innerHTML = `✓ Copied to Clipboard!`;
//       this.style.background = "#10b981";
//       setTimeout(() => {
//         this.innerHTML = orig;
//         this.style.background = "#e0202d";
//       }, 2000);
//     });
//   });

//   document.getElementById("finish-practice-btn").addEventListener("click", () => {
//     window.location.href = "/practice-hub";
//   });
// }

// document.addEventListener("DOMContentLoaded", async () => {
//   await main();
// });

// ==========================================
// 1. POPUP SETTINGS & NOTES LOGIC
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

// ==========================================
// 2. LIVE WORD COUNT
// ==========================================
const textarea = document.getElementById("writer-1");
const wordCountDisplay = document.getElementById("wordCount-1");

if (textarea && wordCountDisplay) {
  textarea.addEventListener("input", () => {
    const text = textarea.value.trim();
    const wordCount = text === "" ? 0 : text.split(/\s+/).length;
    wordCountDisplay.textContent = `Word Count: ${wordCount}`;
  });
}

/// ==========================================
// 3. IMAGE HELPER FUNCTION (SMART URL CONVERTER)
// ==========================================
function normalizeImageUrl(src) {
  if (!src || typeof src !== "string") return "";
  src = src.trim();

  // 1. Google Drive direct image stream converter
  if (src.includes("drive.google.com")) {
    const fileIdMatch = src.match(/\/d\/([a-zA-Z0-9_-]+)/) || src.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/u/0/d/${fileIdMatch[1]}`;
    }
  }

  // 2. Dropbox direct link converter
  if (src.includes("dropbox.com")) {
    return src.replace("?dl=0", "?raw=1").replace("&dl=0", "&raw=1");
  }

  // 3. Imgur direct image link converter
  if (src.includes("imgur.com") && !src.includes("i.imgur.com") && !src.endsWith(".png") && !src.endsWith(".jpg")) {
    const id = src.split("/").pop();
    return `https://i.imgur.com/${id}.png`;
  }

  // 4. Direct Online Link (HTTP/HTTPS) or Base64
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // 5. Local path handling
  if (!src.startsWith("/")) {
    src = "/" + src;
  }

  return src;
}

// ==========================================
// 4. DATA RETRIEVER
// ==========================================
const dataRetriever = async function () {
  try {
    const currentQuery = window.location.search;
    const res = await fetch("/api/pracDataWriting" + currentQuery);
    if (!res.ok) {
      console.warn("Could not load /api/pracDataWriting, status:", res.status);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Data fetch error:", err);
    return null;
  }
};

let data;
let questions;
let questionType;

// ==========================================
// 5. MAIN FUNCTION
// ==========================================
async function main() {
  const submitBtn = document.getElementById("finishBtn");
  const submitModal = document.getElementById("submit-warning-modal");
  const submitOkButton = document.getElementById("submit-ok-btn");
  const submitStayButton = document.getElementById("submit-stay-btn");

  if (submitBtn && submitModal) {
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      submitModal.style.display = "flex";
    });
  }

  if (submitStayButton && submitModal) {
    submitStayButton.addEventListener("click", function (e) {
      e.preventDefault();
      submitModal.style.display = "none";
    });
  }

  if (submitOkButton && submitModal) {
    submitOkButton.addEventListener("click", (e) => {
      e.preventDefault();
      submitModal.style.display = "none";
      showWritingAIResultModal();
    });
  }

  // F3 bondho rakha hoyeche
  window.addEventListener("keydown", function (e) {
    if (e.key === "F3") {
      e.preventDefault();
    }
  });

  data = await dataRetriever();
  if (!data) return;

  questionType = data.type || "";
  questions = data.writing ? data.writing.questions : (data.questions || []);

  const task1Types = [
    "1",
    "Line-Graph",
    "Bar-Chart",
    "Pie-Chart",
    "Table",
    "Process-Diagram",
    "Map",
    "Mixed-Charts"
  ];

  const isPart1 = task1Types.includes(questionType) || String(questionType).toLowerCase().includes("map");

  const partHeader = document.getElementById("part-header-1");
  if (partHeader) {
    if (isPart1) {
      partHeader.innerHTML = `
        <h2>Part 1</h2>
        <p class="part-header-p">You should spend about 20 minutes on this task. Write at least <strong>150 WORDS.</strong></p>
      `;
    } else {
      partHeader.innerHTML = `
        <h2>Part 2</h2>
        <p class="part-header-p">You should spend about 40 minutes on this task. Write at least <strong>250 WORDS.</strong></p>
      `;
    }
  }

  const infoPanel = document.getElementById("info-panel-1");
  if (infoPanel && Array.isArray(questions)) {
    infoPanel.innerHTML = "";
    infoPanel.style.display = "flex";
    infoPanel.style.flexDirection = "column";
    infoPanel.style.gap = "16px";

    questions.forEach((q) => {
      if (q.question) {
        const promptDiv = document.createElement("div");
        promptDiv.className = "question-prompt";
        promptDiv.style.cssText = "font-size: 15px; line-height: 1.7; font-weight: 500; color: #1e293b; clear: both;";
        promptDiv.innerHTML = q.question;
        infoPanel.appendChild(promptDiv);
      }

      const imagesToRender = [];

      if (Array.isArray(q.image)) {
        q.image.forEach(img => { if (img) imagesToRender.push(img); });
      } else if (typeof q.image === "string" && q.image.trim() !== "") {
        imagesToRender.push(q.image.trim());
      }

      if (Array.isArray(q.imageUrl)) {
        q.imageUrl.forEach(img => { if (img) imagesToRender.push(img); });
      } else if (typeof q.imageUrl === "string" && q.imageUrl.trim() !== "") {
        imagesToRender.push(q.imageUrl.trim());
      }

      if (imagesToRender.length === 0) {
        if (data.image && typeof data.image === "string") imagesToRender.push(data.image);
        else if (data.imageUrl && typeof data.imageUrl === "string") imagesToRender.push(data.imageUrl);
        else if (data.writing && data.writing.image && typeof data.writing.image === "string") imagesToRender.push(data.writing.image);
      }

      if (imagesToRender.length > 0) {
        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container text-center";
        imageContainer.style.cssText = "width: 100%; margin-top: 10px; clear: both;";

        imagesToRender.forEach((img) => {
          const finalSrc = normalizeImageUrl(img);
          imageContainer.innerHTML += `
            <img src="${finalSrc}" 
                 alt="Task 1 Visual" 
                 referrerpolicy="no-referrer"
                 crossorigin="anonymous"
                 loading="eager"
                 style="display: block; max-width: 100%; height: auto; margin: 0 auto 12px auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);" 
                 onerror="console.error('Failed to load image from URL:', this.src)">
          `;
        });
        infoPanel.appendChild(imageContainer);
      }
    });

    const renderedImages = infoPanel.querySelectorAll("img");
    if (renderedImages.length === 0 && (data.image || data.imageUrl || (data.writing && data.writing.image))) {
      const rootImg = data.image || data.imageUrl || (data.writing && data.writing.image);
      if (rootImg) {
        const fallbackContainer = document.createElement("div");
        fallbackContainer.className = "image-container text-center";
        fallbackContainer.style.cssText = "width: 100%; margin-top: 10px; clear: both;";
        const finalFallbackSrc = normalizeImageUrl(rootImg);
        fallbackContainer.innerHTML = `
          <img src="${finalFallbackSrc}" 
               alt="Task 1 Visual" 
               referrerpolicy="no-referrer"
               crossorigin="anonymous"
               loading="eager"
               style="display: block; max-width: 100%; height: auto; margin: 0 auto 12px auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);" 
               onerror="console.error('Failed to load root image:', this.src)">
        `;
        infoPanel.appendChild(fallbackContainer);
      }
    }
  }
}

// ==========================================
// 6. AI RESULT MODAL
// ==========================================
// ==========================================
// 6. AI RESULT MODAL (AUTO EVALUATION ENABLED)
// ==========================================
function showWritingAIResultModal() {
  const existingModal = document.getElementById("instant-result-modal");
  if (existingModal) existingModal.remove();

  const studentAnswer = document.getElementById("writer-1") ? document.getElementById("writer-1").value.trim() : "";
  const wordCount = studentAnswer === "" ? 0 : studentAnswer.split(/\s+/).length;

  const task1Types = ["1", "Line-Graph", "Bar-Chart", "Pie-Chart", "Table", "Process-Diagram", "Map", "Mixed-Charts"];
  const isPart1 = task1Types.includes(questionType) || String(questionType).toLowerCase().includes("map");

  // প্রশ্ন টেক্সট সংগ্রহ
  let questionTopic = "";
  try {
    if (questions && questions[0] && questions[0].question) {
      const d = document.createElement("div");
      d.innerHTML = questions[0].question;
      questionTopic = d.textContent || "";
    }
  } catch (e) {
    questionTopic = isPart1 ? "IELTS Writing Task 1" : "IELTS Writing Task 2";
  }

  // আগের প্রম্পট (ম্যানুয়াল কপির জন্য ঠিক রাখা হয়েছে)
  let promptContent = "";
  if (isPart1) {
    promptContent = `You are a certified IELTS Writing Examiner. Evaluate my Task 1 response:
Topic: ${questionTopic}
Submission:
${studentAnswer}`;
  } else {
    promptContent = `You are a certified IELTS Writing Examiner. Evaluate my Task 2 response:
Topic: ${questionTopic}
Submission:
${studentAnswer}`;
  }

  const modalHtml = `
    <div id="instant-result-modal" style="position:fixed; inset:0; background:rgba(11,43,82,0.85); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:999999; font-family:'Sora', -apple-system, sans-serif;">
      <div style="background:#ffffff; border-radius:18px; max-width:820px; width:95%; max-height:92vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.35); border:1px solid #e3e9f3;">
        
        <div style="background:#0b2b52; color:white; padding:20px 28px; position:relative; box-shadow:inset 0 -3px 0 #e0202d;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <h2 style="margin:0; font-size:20px; font-weight:700;">🎉 Practice Completed! (${isPart1 ? 'Task 1' : 'Task 2'})</h2>
              <p style="margin:4px 0 0; opacity:0.85; font-size:13px;">Official IELTS Examiner AI Assessment</p>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
              <span id="ai-band-badge" style="background:#e0202d; color:#fff; padding:6px 16px; border-radius:30px; font-weight:800; font-size:15px;">
                Band: Calculating...
              </span>
              <div style="background:rgba(255,255,255,0.12); padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">
                📝 Words: <span style="color:#38bdf8;">${wordCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="padding:22px 28px; overflow-y:auto; flex:1; background:#f8fafc;">
          
          <!-- AI ফলাফল লোড হওয়ার কন্টেইনার -->
          <div id="ai-practice-result-container" style="margin-bottom:20px;">
            <div style="background:#fff; border:1px solid #cbd5e1; border-left:5px solid #0b2b52; border-radius:12px; padding:20px; text-align:center; color:#0b2b52; font-weight:600; font-size:14px;">
              ⏳ Evaluating your response with IELTS Examiner AI... Please wait (2-3 seconds).
            </div>
          </div>

          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:18px;">
            <strong style="color:#0b2b52; font-size:13.5px; display:block; margin-bottom:6px;">Your Written Response:</strong>
            <div style="max-height:120px; overflow-y:auto; font-size:13px; color:#475569; line-height:1.6; background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; white-space:pre-wrap;">${studentAnswer || "(No answer entered)"}</div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:#f1f5f9; padding:10px 14px; border-radius:8px;">
            <div style="font-size:12px; font-weight:700; color:#475569; text-transform:uppercase;">
              Alternative External AI:
            </div>
            <div style="display:flex; gap:8px;">
              <a href="https://chatgpt.com" target="_blank" style="text-decoration:none; background:#10a37f; color:#fff; padding:5px 12px; border-radius:6px; font-size:12px; font-weight:700;">ChatGPT</a>
              <a href="https://gemini.google.com" target="_blank" style="text-decoration:none; background:#1a73e8; color:#fff; padding:5px 12px; border-radius:6px; font-size:12px; font-weight:700;">Gemini</a>
            </div>
          </div>

        </div>

        <div style="padding:14px 28px; background:#ffffff; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <button id="copy-ai-btn" style="background:#fff; color:#0b2b52; border:2px solid #0b2b52; padding:8px 18px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">
            📋 Copy Prompt
          </button>
          
          <button id="finish-practice-btn" style="background:#0b2b52; color:#fff; border:none; padding:10px 20px; border-radius:8px; font-size:13.5px; font-weight:600; cursor:pointer;">
            Return to Practice
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // অটোমেটিক ব্যাকএন্ড এপিআই কল (Groq / Gemini)
  (async function runPracticeAutoEval() {
    const badge = document.getElementById("ai-band-badge");
    const container = document.getElementById("ai-practice-result-container");

    if (!studentAnswer || studentAnswer.length < 10) {
      if (badge) badge.textContent = "Band: 0.0";
      container.innerHTML = `<div style="background:#fff; border:1px dashed #e0202d; color:#e0202d; padding:15px; border-radius:10px; text-align:center; font-size:13.5px;">No response was submitted to evaluate.</div>`;
      return;
    }

    try {
      const res = await fetch("/evaluate-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: questionTopic || (isPart1 ? "IELTS Writing Task 1" : "IELTS Writing Task 2"),
          essay: studentAnswer
        })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to evaluate");

      const evalData = json.data;

      // ১. হেডার ব্যাজে স্কোর
      if (badge) {
        badge.textContent = `Band: ${evalData.overall_band}`;
      }

      // ২. ভেতরে ৪টি ক্রাইটেরিয়া কার্ড রেন্ডার
      const criteria1Name = isPart1 ? "Task Achievement" : "Task Response";
      container.innerHTML = `
        <div style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; border-top:4px solid #e0202d; padding:18px; box-shadow:0 4px 12px rgba(11,43,82,0.06);">
          
          <div style="margin-bottom:14px; font-size:13.5px; color:#334155; line-height:1.6; background:#f8fafc; padding:12px 14px; border-radius:8px; border-left:4px solid #0b2b52;">
            <b style="color:#0b2b52;">Examiner Summary:</b> ${evalData.summary_feedback}
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <b style="color:#0b2b52; font-size:13px;">${criteria1Name}</b>
                <span style="color:#e0202d; font-weight:800; font-size:14px;">${evalData.task_response.score}</span>
              </div>
              <p style="margin:0; font-size:12px; color:#64748b; line-height:1.4;">${evalData.task_response.comment}</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <b style="color:#0b2b52; font-size:13px;">Coherence & Cohesion</b>
                <span style="color:#e0202d; font-weight:800; font-size:14px;">${evalData.coherence_cohesion.score}</span>
              </div>
              <p style="margin:0; font-size:12px; color:#64748b; line-height:1.4;">${evalData.coherence_cohesion.comment}</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <b style="color:#0b2b52; font-size:13px;">Lexical Resource</b>
                <span style="color:#e0202d; font-weight:800; font-size:14px;">${evalData.lexical_resource.score}</span>
              </div>
              <p style="margin:0; font-size:12px; color:#64748b; line-height:1.4;">${evalData.lexical_resource.comment}</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <b style="color:#0b2b52; font-size:13px;">Grammar & Accuracy</b>
                <span style="color:#e0202d; font-weight:800; font-size:14px;">${evalData.grammar.score}</span>
              </div>
              <p style="margin:0; font-size:12px; color:#64748b; line-height:1.4;">${evalData.grammar.comment}</p>
            </div>
          </div>

          <div style="background:#fffafa; border:1px dashed #e0202d; border-radius:8px; padding:12px 16px;">
            <b style="color:#e0202d; font-size:13px; display:block; margin-bottom:6px;">Priority Tips to Improve Band:</b>
            <ul style="margin:0; padding-left:18px; font-size:12.5px; color:#334155; line-height:1.6;">
              ${(evalData.key_improvements || []).map(tip => `<li>${tip}</li>`).join("")}
            </ul>
          </div>

        </div>
      `;
    } catch (err) {
      console.error("Practice auto eval error:", err);
      if (badge) badge.textContent = "Band: --";
      container.innerHTML = `<div style="background:#fff; border:1px solid #fecaca; color:#b91c1c; padding:14px; border-radius:8px; font-size:13px; text-align:center;">Evaluation could not be completed. Please try again.</div>`;
    }
  })();

  // কপি বাটন হ্যান্ডলার
  document.getElementById("copy-ai-btn").addEventListener("click", function () {
    navigator.clipboard.writeText(promptContent).then(() => {
      const orig = this.innerHTML;
      this.innerHTML = `✓ Copied!`;
      this.style.background = "#10b981";
      this.style.color = "#fff";
      this.style.border = "none";
      setTimeout(() => {
        this.innerHTML = orig;
        this.style.background = "#fff";
        this.style.color = "#0b2b52";
        this.style.border = "2px solid #0b2b52";
      }, 2000);
    });
  });

  // রিটার্ন বাটন
  document.getElementById("finish-practice-btn").addEventListener("click", () => {
    window.location.href = "/practice-hub";
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await main();
});