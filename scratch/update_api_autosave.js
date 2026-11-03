const fs = require('fs');

const path = 'D:/personal websites/ieltsmockpoint/routes/api.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Update dashboard-data query
const oldFind = 'const records = await StudentTestRecord.find({ userEmail }).sort({ completedAt: -1 }).lean();';
const newFind = 'const records = await StudentTestRecord.find({ userEmail, status: { $ne: "in-progress" } }).sort({ completedAt: -1 }).lean();';

if (content.includes(oldFind)) {
  content = content.replace(oldFind, newFind);
  console.log('Updated StudentTestRecord.find query in dashboard-data');
}

// 2. Replace record-test and add auto-save & test-record/:id before module.exports = router;
const oldRecordTestStart = '// Record test completion endpoint\nrouter.post("/student/record-test", async (req, res) => {';
const oldRecordTestEnd = 'return res.json({ success: true, recordId: record._id });\n  } catch (err) {\n    console.error("Error recording test:", err);\n    return res.status(500).json({ error: "Failed to record test" });\n  }\n});';

const startIdx = content.indexOf('// Record test completion endpoint');
const endIdx = content.indexOf('module.exports = router;');

if (startIdx !== -1 && endIdx !== -1) {
  const newEndpoints = `// ==========================================
// AUTO-SAVE PROGRESS (EVERY 2-3 MINUTES & DRAFT RESTORE)
// ==========================================
router.post("/student/auto-save", async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.candidate;
    const userEmail = (sessionUser && sessionUser.email ? sessionUser.email : (req.body.email || '')).toLowerCase().trim();

    // If not logged in, client already has localStorage backup
    if (!userEmail || userEmail === 'guest@ieltsmockpoint.com') {
      return res.json({ success: true, savedTo: 'local-only', message: 'Guest session' });
    }

    const {
      testId,
      testType,
      module: modName,
      title,
      answers,
      remainingSeconds
    } = req.body;

    if (!testId) {
      return res.status(400).json({ error: "testId is required" });
    }

    let record = await StudentTestRecord.findOne({
      userEmail,
      testId,
      status: "in-progress"
    });

    if (!record) {
      record = new StudentTestRecord({
        userEmail,
        userId: sessionUser.id || null,
        testId,
        testType: testType || "full-mock",
        module: modName || null,
        title: title || testId.replace(/-UKA-FINAL-/i, " Mock Test "),
        status: "in-progress",
        answers: {}
      });
    }

    if (!record.answers) record.answers = {};
    if (modName && answers) {
      record.answers[modName] = answers;
    } else if (answers) {
      record.answers = Object.assign(record.answers, answers);
    }

    record.lastSavedAt = new Date();
    record.markModified("answers");
    await record.save();

    return res.json({ success: true, recordId: record._id, lastSavedAt: record.lastSavedAt });
  } catch (err) {
    console.error("Auto-save error:", err);
    return res.status(500).json({ error: "Failed to auto-save" });
  }
});

// Fetch single test record with all mistakes and answers for review modal
router.get("/student/test-record/:id", async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.candidate;
    const record = await StudentTestRecord.findById(req.params.id).lean();
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

    return res.json({ success: true, record });
  } catch (err) {
    console.error("Fetch test record error:", err);
    return res.status(500).json({ error: "Failed to load test record" });
  }
});

// Record test completion endpoint (Final Submittal & Band Scoring)
router.post("/student/record-test", async (req, res) => {
  try {
    const sessionUser = req.session.user || req.session.candidate;
    const userEmail = (sessionUser && sessionUser.email ? sessionUser.email : (req.body.email || 'guest@ieltsmockpoint.com')).toLowerCase().trim();

    const {
      testType,
      module: modName,
      testId,
      title,
      totalQuestions,
      listeningScore,
      readingScore,
      writingScore,
      listeningBand,
      readingBand,
      writingBand,
      overallBand,
      totalWords,
      feedback,
      mistakes,
      answers
    } = req.body;

    const detectedMod = modName || (testType && testType.toLowerCase().includes('reading') ? 'reading' : (testType && testType.toLowerCase().includes('listening') ? 'listening' : (testType && testType.toLowerCase().includes('writing') ? 'writing' : null)));
    const currentId = testId || 'mock-' + Date.now();

    // Look for an existing in-progress record to update, or create fresh
    let record = null;
    if (userEmail && userEmail !== 'guest@ieltsmockpoint.com' && currentId) {
      record = await StudentTestRecord.findOne({ userEmail, testId: currentId, status: "in-progress" });
    }

    if (!record) {
      record = new StudentTestRecord({ userEmail, testId: currentId });
    }

    record.status = "completed";
    record.testType = testType || 'Full Mock';
    record.module = detectedMod;
    record.title = title || currentId.replace(/-UKA-FINAL-/i, " Mock Test ");
    record.totalQuestions = Number(totalQuestions) || null;
    record.listeningScore = Number(listeningScore) || 0;
    record.readingScore = Number(readingScore) || 0;
    record.writingScore = Number(writingScore) || 0;
    record.listeningBand = Number(listeningBand) || 0;
    record.readingBand = Number(readingBand) || 0;
    record.writingBand = Number(writingBand) || 0;
    record.overallBand = Number(overallBand) || 0;
    record.totalWords = Number(totalWords) || 0;
    record.feedback = feedback || {};
    record.mistakes = mistakes || {};
    record.answers = answers || record.answers || {};
    record.completedAt = new Date();
    record.lastSavedAt = new Date();

    record.markModified("feedback");
    record.markModified("mistakes");
    record.markModified("answers");

    await record.save();

    return res.json({ success: true, recordId: record._id });
  } catch (err) {
    console.error("Error recording test:", err);
    return res.status(500).json({ error: "Failed to record test" });
  }
});\n\n`;

  content = content.substring(0, startIdx) + newEndpoints + content.substring(endIdx);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully updated routes/api.js with auto-save, test-record/:id, and robust record-test!');
} else {
  console.warn('Could not locate start/end indices in routes/api.js');
}
