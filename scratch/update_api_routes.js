const fs = require('fs');
const path = require('path');
const vm = require('vm');

const apiPath = path.join(__dirname, '../routes/api.js');
let code = fs.readFileSync(apiPath, 'utf8');

// 1. Add calcIeltsBand before router.post("/update-mock-info"
const oldUpdateStart = 'router.post("/update-mock-info", async (req, res) => {';
if (!code.includes('function calcIeltsBand(')) {
  const calcBandCode = `function calcIeltsBand(raw) {
  const score = Number(raw) || 0;
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 18) return 5.5;
  if (score >= 16) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 7) return 3.5;
  if (score >= 5) return 3.0;
  if (score >= 3) return 2.5;
  return 2.0;
}

`;
  code = code.replace(oldUpdateStart, calcBandCode + oldUpdateStart);
}

// 2. Replace router.post("/update-mock-info", ...)
const updateMockStartIdx = code.indexOf('router.post("/update-mock-info", async (req, res) => {');
const updateMockEndNeedle = 'console.error("Critical error in update-mock-info:", error);\n    return res.status(500).json({ error: "Internal Server Error" });\n  }\n});';
const updateMockEndIdx = code.indexOf(updateMockEndNeedle, updateMockStartIdx);

if (updateMockStartIdx !== -1 && updateMockEndIdx !== -1) {
  const fullEndIdx = updateMockEndIdx + updateMockEndNeedle.length;
  const newUpdateMock = `router.post("/update-mock-info", async (req, res) => {
  try {
    const { score, mistakes, mod, writingInputs, answers } = req.body;
    const sessionUser = req.session.user || req.session.candidate;

    if (!mod) {
      return res.status(400).json({ error: "Module type is required" });
    }

    const currentMockId = req.body.testId || (req.session.mock ? req.session.mock.mockNumber : "Free-Mock");

    if (!req.session.examResults) {
      req.session.examResults = {};
    }

    if (mod === "listening") {
      req.session.examResults.listening = { score, mistakes, answers };
    } else if (mod === "reading") {
      req.session.examResults.reading = { score, mistakes, answers };
    } else if (mod === "writing") {
      req.session.examResults.writing = { writingInputs };
    }

    if (sessionUser && sessionUser.email && currentMockId) {
      try {
        const user = await User.findOne({ email: sessionUser.email });

        if (user) {
          if (!Array.isArray(user.mockInformation)) {
            user.mockInformation = [];
          }

          let mockRecord = user.mockInformation.find((obj) => obj.mockID === currentMockId);

          if (!mockRecord) {
            mockRecord = { mockID: currentMockId };
            user.mockInformation.push(mockRecord);
          }

          if (mod === "listening") {
            mockRecord.listening = { score, mistakes };
          } else if (mod === "reading") {
            mockRecord.reading = { score, mistakes };
          } else if (mod === "writing") {
            mockRecord.writing = { writingInputs };
            mockRecord.completed = true;

            if (typeof AdminNotifs !== "undefined") {
              const newNotif = new AdminNotifs({
                username: user.username,
                mockNumber: currentMockId,
                time: new Date(),
              });
              await newNotif.save();
            }
          }

          user.markModified("mockInformation");
          await user.save();
        }

        // Also sync to StudentTestRecord for seamless dashboard tracking
        try {
          const userEmail = sessionUser.email.toLowerCase().trim();
          let record = await StudentTestRecord.findOne({
            userEmail,
            testId: currentMockId,
            status: "in-progress"
          });
          if (!record) {
            record = await StudentTestRecord.findOne({
              userEmail,
              testId: currentMockId
            }).sort({ createdAt: -1 });
          }
          if (!record) {
            const isPrem = currentMockId.includes("Premium");
            const isGen = currentMockId.includes("General");
            record = new StudentTestRecord({
              userEmail,
              userId: sessionUser.id || null,
              testType: isPrem ? "Premium Full Mock" : (isGen ? "General Full Mock" : "Academic Full Mock"),
              testId: currentMockId,
              title: isPrem ? currentMockId.replace(/-UKA-FINAL-/i, " Premium Mock ") : currentMockId.replace(/-UKA-FINAL-/i, " Academic Mock "),
              status: "completed",
              answers: {},
              mistakes: {}
            });
          }

          if (!record.answers) record.answers = {};
          if (!record.mistakes) record.mistakes = {};

          if (mod === "listening") {
            if (score !== undefined && score !== null) {
              record.listeningScore = Number(score);
              record.listeningBand = calcIeltsBand(score);
            }
            if (answers) record.answers.listening = answers;
            if (mistakes) record.mistakes.listening = mistakes;
          } else if (mod === "reading") {
            if (score !== undefined && score !== null) {
              record.readingScore = Number(score);
              record.readingBand = calcIeltsBand(score);
            }
            if (answers) record.answers.reading = answers;
            if (mistakes) record.mistakes.reading = mistakes;
          } else if (mod === "writing") {
            if (writingInputs) {
              record.answers.writing = writingInputs;
            }
          }

          record.status = "completed";

          const bands = [record.listeningBand, record.readingBand, record.writingBand].filter(b => typeof b === 'number' && b > 0);
          if (bands.length > 0) {
            const rawAvg = bands.reduce((a, b) => a + b, 0) / bands.length;
            record.overallBand = Math.round(rawAvg * 2) / 2;
          }

          record.lastSavedAt = new Date();
          record.markModified("answers");
          record.markModified("mistakes");
          await record.save();
        } catch (recErr) {
          console.warn("StudentTestRecord sync notice:", recErr.message);
        }
      } catch (err) {
        console.error("Error saving mock info to database:", err);
      }
    }

    return res.status(200).json({
      success: true,
      module: mod,
      score: score !== undefined ? score : null,
      mistakes: mistakes || [],
      writingInputs: writingInputs || null,
      message: "Submission successful"
    });
  } catch (error) {
    console.error("Critical error in update-mock-info:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});`;
  code = code.slice(0, updateMockStartIdx) + newUpdateMock + code.slice(fullEndIdx);
  console.log("Successfully replaced update-mock-info endpoint!");
} else {
  console.error("Could not find update-mock-info endpoints bounds:", updateMockStartIdx, updateMockEndIdx);
}

// 3. Replace router.get("/student/test-record/:id", ...)
const testRecStartIdx = code.indexOf('router.get("/student/test-record/:id", async (req, res) => {');
const testRecEndNeedle = 'console.error("Fetch test record error:", err);\n    return res.status(500).json({ error: "Failed to load test record" });\n  }\n});';
const testRecEndIdx = code.indexOf(testRecEndNeedle, testRecStartIdx);

if (testRecStartIdx !== -1 && testRecEndIdx !== -1) {
  const fullTestRecEndIdx = testRecEndIdx + testRecEndNeedle.length;
  const newTestRecordRoute = `router.get("/student/test-record/:id", async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.candidate;
    let record = await StudentTestRecord.findById(req.params.id).lean();
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    // Ownership check
    if (sessionUser && sessionUser.email) {
      const userEmail = sessionUser.email.toLowerCase().trim();
      if (record.userEmail !== userEmail && record.userEmail !== 'guest@ieltsmockpoint.com' && sessionUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    // Dynamic reconstruction of 1-40 reviews if mistakes is empty or partial
    try {
      const testId = record.testId;
      if (testId) {
        const testDoc = await TestQuestions.findOne({ mockNumber: testId }).lean()
          || await TestQuestions.findOne({ mockNumber: new RegExp('^' + testId.replace(/[-\\[\\]{}()*+?.,\\\\^$|#\\s]/g, '\\\\$&') + '$', 'i') }).lean();

        if (testDoc) {
          if (!record.mistakes) record.mistakes = {};
          if (!record.answers) record.answers = {};

          // Dynamic evaluate Listening
          const officialL = testDoc.listening && testDoc.listening.answers;
          const userL = record.answers.listening || {};
          const hasLMistakes = Array.isArray(record.mistakes.listening) && record.mistakes.listening.length > 0;
          if (officialL && (!hasLMistakes || record.mistakes.listening.length < 40)) {
            const listL = [];
            let correctL = 0;
            for (let q = 1; q <= 40; q++) {
              const qStr = String(q);
              const uRaw = userL[qStr] || userL[q] || [];
              const uArr = Array.isArray(uRaw) ? uRaw.map(v => String(v).trim()).filter(Boolean) : (uRaw ? [String(uRaw).trim()] : []);
              const oRaw = officialL[qStr] || officialL[q] || [];
              const oArr = Array.isArray(oRaw) ? oRaw.map(v => String(v).trim()) : (oRaw ? [String(oRaw).trim()] : []);

              const isCorrect = uArr.some(uVal => {
                const uNorm = uVal.toLowerCase();
                return oArr.some(oVal => oVal.toLowerCase() === uNorm);
              });

              if (isCorrect) correctL++;
              listL.push({
                qNum: q,
                yourAns: uArr.length > 0 ? uArr.join(', ') : '(Not Answered)',
                officialAns: oArr.join(' / ') || '--',
                isCorrect
              });
            }
            record.mistakes.listening = listL;
            if (record.listeningScore === null || record.listeningScore === undefined) {
              record.listeningScore = correctL;
              record.listeningBand = calcIeltsBand(correctL);
            }
          }

          // Dynamic evaluate Reading
          const officialR = testDoc.reading && testDoc.reading.answers;
          const userR = record.answers.reading || {};
          const hasRMistakes = Array.isArray(record.mistakes.reading) && record.mistakes.reading.length > 0;
          if (officialR && (!hasRMistakes || record.mistakes.reading.length < 40)) {
            const listR = [];
            let correctR = 0;
            for (let q = 1; q <= 40; q++) {
              const qStr = String(q);
              const uRaw = userR[qStr] || userR[q] || [];
              const uArr = Array.isArray(uRaw) ? uRaw.map(v => String(v).trim()).filter(Boolean) : (uRaw ? [String(uRaw).trim()] : []);
              const oRaw = officialR[qStr] || officialR[q] || [];
              const oArr = Array.isArray(oRaw) ? oRaw.map(v => String(v).trim()) : (oRaw ? [String(oRaw).trim()] : []);

              const isCorrect = uArr.some(uVal => {
                const uNorm = uVal.toLowerCase();
                return oArr.some(oVal => oVal.toLowerCase() === uNorm);
              });

              if (isCorrect) correctR++;
              listR.push({
                qNum: q,
                yourAns: uArr.length > 0 ? uArr.join(', ') : '(Not Answered)',
                officialAns: oArr.join(' / ') || '--',
                isCorrect
              });
            }
            record.mistakes.reading = listR;
            if (record.readingScore === null || record.readingScore === undefined) {
              record.readingScore = correctR;
              record.readingBand = calcIeltsBand(correctR);
            }
          }

          // Update overallBand if needed
          const bands = [record.listeningBand, record.readingBand, record.writingBand].filter(b => typeof b === 'number' && b > 0);
          if (bands.length > 0 && !record.overallBand) {
            const rawAvg = bands.reduce((a, b) => a + b, 0) / bands.length;
            record.overallBand = Math.round(rawAvg * 2) / 2;
          }

          // Persist back to DB so subsequent loads are instant
          await StudentTestRecord.findByIdAndUpdate(record._id, {
            mistakes: record.mistakes,
            answers: record.answers,
            listeningScore: record.listeningScore,
            listeningBand: record.listeningBand,
            readingScore: record.readingScore,
            readingBand: record.readingBand,
            overallBand: record.overallBand,
            status: "completed"
          });
        }
      }
    } catch (evalErr) {
      console.warn("Dynamic test record evaluation warning:", evalErr.message);
    }

    return res.json({ success: true, record });
  } catch (err) {
    console.error("Fetch test record error:", err);
    return res.status(500).json({ error: "Failed to load test record" });
  }
});`;
  code = code.slice(0, testRecStartIdx) + newTestRecordRoute + code.slice(fullTestRecEndIdx);
  console.log("Successfully replaced test-record/:id endpoint!");
} else {
  console.error("Could not find test-record endpoints bounds:", testRecStartIdx, testRecEndIdx);
}

// 4. Update POST /student/record-test Object.assign
code = code.replace(
  'record.mistakes = mistakes || {};\n    record.answers = answers || record.answers || {};',
  'record.mistakes = Object.assign({}, record.mistakes || {}, mistakes || {});\n    record.answers = Object.assign({}, record.answers || {}, answers || {});'
);

new vm.Script(code);
console.log("Syntax OK! Saving to routes/api.js...");
fs.writeFileSync(apiPath, code, 'utf8');
console.log("routes/api.js updated cleanly!");
