const fs = require('fs');

// 1. Update views/cambridgetest/scripts-reading-practice-v2.js
const jsPath = 'D:/personal websites/ieltsmockpoint/views/cambridgetest/scripts-reading-practice-v2.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

const targetTimerBlock = `      if (elapsedSeconds >= 3600 && !hasShownOneHourAlert && practiceMode === "full") {
        hasShownOneHourAlert = true;
        showOneHourModal();
      }`;

if (jsContent.includes(targetTimerBlock)) {
  jsContent = jsContent.replace(targetTimerBlock, '// Time limit interruption disabled: Cambridge practice is untimed');
  console.log('Removed 1-hour interruption timer check from scripts-reading-practice-v2.js');
}

const targetShowModal = `  function showOneHourModal() {
    let modal = document.getElementById("oneHourModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "oneHourModal";
      modal.className = "cr-modal-overlay";
      modal.innerHTML = \`
        <div class="cr-modal-box">
          <div class="cr-modal-icon">⏳</div>
          <h3 class="cr-modal-title">1 Hour Completed!</h3>
          <p class="cr-modal-desc">১ ঘণ্টা পূর্ণ হয়েছে। আপনি কি টেস্টটি সাবমিট করতে চান নাকি টেস্ট চালিয়ে যেতে চান?</p>
          <div class="cr-modal-actions">
            <button type="button" class="cr-btn-cancel" onclick="window.crV2.continueAfterOneHour()">Continue Test</button>
            <button type="button" class="cr-btn-confirm" onclick="window.crV2.submitFromOneHour()">Submit Now</button>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);
    }
    modal.style.display = "flex";
  }`;

const replacementShowModal = `  function showOneHourModal() {
    // Interruption modal removed: Cambridge tests have no time limits
  }`;

if (jsContent.includes(targetShowModal)) {
  jsContent = jsContent.replace(targetShowModal, replacementShowModal);
  console.log('Replaced showOneHourModal with no-op in scripts-reading-practice-v2.js');
}

fs.writeFileSync(jsPath, jsContent, 'utf8');

// 2. Update views/cambridgetest/reading-practice-v2.html
const htmlPath = 'D:/personal websites/ieltsmockpoint/views/cambridgetest/reading-practice-v2.html';
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

const modalStart = '<!-- 1-Hour Practice Time Notice Modal -->';
const modalEnd = '<!-- Scorecard Result Modal -->';

const idxStart = htmlContent.indexOf(modalStart);
const idxEnd = htmlContent.indexOf(modalEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  htmlContent = htmlContent.substring(0, idxStart) + htmlContent.substring(idxEnd);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log('Removed oneHourModal HTML from reading-practice-v2.html');
}

console.log('Cambridge reading fix applied successfully!');
