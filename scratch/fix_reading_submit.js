const fs = require('fs');

const path = 'D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js';
let content = fs.readFileSync(path, 'utf8');

const targetSubmitFn = `async function submitTest(reason) {
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
}`;

const newSubmitFn = `async function submitTest(reason) {
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

  try {
    sessionStorage.setItem("readingScore", scoreToSend);
    localStorage.setItem("readingScore", scoreToSend);
    sessionStorage.setItem("readingMistakes", JSON.stringify(mistakesToSend));
    localStorage.setItem("readingMistakes", JSON.stringify(mistakesToSend));
    sessionStorage.setItem("readingAnswers", JSON.stringify(answerArrayUpdated));
    localStorage.setItem("readingAnswers", JSON.stringify(answerArrayUpdated));
  } catch (e) {
    console.warn("Could not save reading results to storage:", e);
  }

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

  // রিডিং শেষ হলে কোনো মডাল বা ইন্টারাপশন ছাড়া সরাসরি মক লবিতে রিডাইরেক্ট করবে যাতে Writing Video ও Writing Test চালু হয়
  window.location.href = "/mock-test";
}`;

if (content.includes(targetSubmitFn)) {
  content = content.replace(targetSubmitFn, newSubmitFn);
  console.log('Replaced submitTest in scripts-reading.js to auto-redirect to /mock-test');
} else {
  console.warn('Target submitTest block not found!');
}

// Case insensitive matching in findDifferences
const targetFindDiff = `function findDifferences(your_answer, realAnswers) {
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
}`;

const newFindDiff = `function findDifferences(your_answer, realAnswers) {
  var totalScore = 40;

  for (const key in realAnswers) {
    const yourAns = (your_answer[key] || []).map(a => String(a).trim().toLowerCase());
    const rawReal = realAnswers[key];
    const realAnsList = Array.isArray(rawReal) ? rawReal : [rawReal];
    const realAnsNormalized = realAnsList.map(a => String(a).trim().toLowerCase());

    const matchFound = yourAns.some((ans) => ans !== "" && realAnsNormalized.includes(ans));

    if (!matchFound) {
      mistakes[key] = {
        "Your answer": yourAns,
        "Correct answer": realAnsList
      };
      totalScore--;
    }
  }

  return [totalScore, mistakes];
}`;

if (content.includes(targetFindDiff)) {
  content = content.replace(targetFindDiff, newFindDiff);
  console.log('Updated findDifferences in scripts-reading.js for robust case-insensitive grading');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Updated scripts-reading.js successfully!');
