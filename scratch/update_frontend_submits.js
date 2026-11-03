const fs = require('fs');
const path = require('path');

// 1. Update scripts-listening.js
const listeningPath = path.join(__dirname, '../views/test_pages/listening/scripts-listening.js');
let listeningContent = fs.readFileSync(listeningPath, 'utf8');

const oldListeningPayload = "body: JSON.stringify({ score: scoreToSend, mistakes: mistakesToSend, mod: \"listening\" })";
const newListeningPayload = `body: JSON.stringify({
        score: scoreToSend,
        mistakes: mistakesToSend,
        mod: "listening",
        answers: answerArrayUpdated,
        testId: (typeof mockID !== "undefined" && mockID) || (typeof parsedQuestionData !== "undefined" && parsedQuestionData.mockNumber) || sessionStorage.getItem("currentMockId") || localStorage.getItem("currentMockId") || ""
      })`;

if (!listeningContent.includes(oldListeningPayload)) {
  console.warn("oldListeningPayload not found in scripts-listening.js");
} else {
  // Replace all occurrences (line 2246 and 3649)
  listeningContent = listeningContent.split(oldListeningPayload).join(newListeningPayload);
  fs.writeFileSync(listeningPath, listeningContent, 'utf8');
  console.log("scripts-listening.js updated successfully!");
}

// 2. Update scripts-reading.js
const readingPath = path.join(__dirname, '../views/test_pages/reading/scripts-reading.js');
let readingContent = fs.readFileSync(readingPath, 'utf8');

const oldReadingPayload = "body: JSON.stringify({ score: scoreToSend, mistakes: mistakesToSend, mod: \"reading\" })";
const newReadingPayload = `body: JSON.stringify({
        score: scoreToSend,
        mistakes: mistakesToSend,
        mod: "reading",
        answers: answerArrayUpdated,
        testId: (typeof mockID !== "undefined" && mockID) || (typeof parsedQuestionData !== "undefined" && parsedQuestionData.mockNumber) || sessionStorage.getItem("currentMockId") || localStorage.getItem("currentMockId") || ""
      })`;

if (!readingContent.includes(oldReadingPayload)) {
  console.warn("oldReadingPayload not found in scripts-reading.js");
} else {
  readingContent = readingContent.split(oldReadingPayload).join(newReadingPayload);
  fs.writeFileSync(readingPath, readingContent, 'utf8');
  console.log("scripts-reading.js updated successfully!");
}
