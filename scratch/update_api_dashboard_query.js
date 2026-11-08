const fs = require('fs');

const apiPath = '../routes/api.js';
let code = fs.readFileSync(apiPath, 'utf8');

// 1. Line 1350: add record.speakingBand
code = code.replace(
  'const bands = [record.listeningBand, record.readingBand, record.writingBand].filter(b => typeof b === \'number\' && b > 0);',
  'const bands = [record.listeningBand, record.readingBand, record.writingBand, record.speakingBand].filter(b => typeof b === \'number\' && b > 0);'
);

// 2. Line 2097: add record.speakingBand
code = code.replace(
  'const bands = [record.listeningBand, record.readingBand, record.writingBand].filter(b => typeof b === \'number\' && b > 0);',
  'const bands = [record.listeningBand, record.readingBand, record.writingBand, record.speakingBand].filter(b => typeof b === \'number\' && b > 0);'
);

// 3. Improve records query in GET /student/dashboard-data
const oldQuery = `    const records = await StudentTestRecord.find({
      userEmail,
      $or: [
        { status: "completed" },
        { listeningScore: { $ne: null } },
        { readingScore: { $ne: null } },
        { "answers.listening": { $exists: true } },
        { "answers.reading": { $exists: true } }
      ]
    }).sort({ createdAt: -1 }).lean();`;

const newQuery = `    const records = await StudentTestRecord.find({
      userEmail,
      $or: [
        { status: "completed" },
        { listeningScore: { $ne: null } },
        { readingScore: { $ne: null } },
        { writingBand: { $ne: null } },
        { speakingBand: { $ne: null } },
        { "answers.listening": { $exists: true } },
        { "answers.reading": { $exists: true } },
        { "answers.writing": { $exists: true } },
        { "answers.speaking": { $exists: true } }
      ]
    }).sort({ createdAt: -1 }).lean();`;

if (code.includes(oldQuery)) {
  code = code.replace(oldQuery, newQuery);
  console.log('Updated records query with speaking & writing conditions');
}

// 4. Improve categoryBreakdown counting
const oldCatLogic = `      const typeLower = String(h.testType || '').toLowerCase();
      if (typeLower.includes('full') || typeLower.includes('academic') || typeLower.includes('premium') || typeLower.includes('general')) {
        categoryBreakdown.fullMock++;
      } else if (typeLower.includes('hub') || typeLower.includes('question') || typeLower.includes('type')) {
        categoryBreakdown.questionType++;
      } else if (typeLower.includes('writing')) {
        categoryBreakdown.writing++;
      } else if (typeLower.includes('speaking')) {
        categoryBreakdown.speaking++;
      } else if (typeLower.includes('cambridge')) {
        categoryBreakdown.cambridge++;
      }`;

const newCatLogic = `      const typeLower = String(h.testType || '').toLowerCase();
      const modLower = String(h.module || '').toLowerCase();
      if (typeLower.includes('cambridge')) {
        categoryBreakdown.cambridge++;
      } else if (typeLower.includes('speaking') || modLower === 'speaking' || (h.speakingBand > 0 && !h.listeningBand && !h.readingBand)) {
        categoryBreakdown.speaking++;
      } else if (typeLower.includes('writing') || modLower === 'writing' || (h.writingBand > 0 && !h.listeningBand && !h.readingBand)) {
        categoryBreakdown.writing++;
      } else if (typeLower.includes('hub') || typeLower.includes('question') || typeLower.includes('type') || modLower === 'practice') {
        categoryBreakdown.questionType++;
      } else {
        categoryBreakdown.fullMock++;
      }`;

if (code.includes(oldCatLogic)) {
  code = code.replace(oldCatLogic, newCatLogic);
  console.log('Updated categoryBreakdown classification logic');
}

fs.writeFileSync(apiPath, code, 'utf8');
console.log('Updated routes/api.js successfully');
