require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const StudentTestRecord = require('../models/StudentTestRecord');

function calcIeltsBand(raw) {
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

async function fixUserRecord() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  console.log('Connected to DB');

  // Find question doc for Premium-UKA-FINAL-1
  const testDoc = await mongoose.connection.db.collection('test-questions').findOne({ mockNumber: 'Premium-UKA-FINAL-1' });
  if (!testDoc) {
    console.error('Premium-UKA-FINAL-1 not found in test-questions!');
    process.exit(1);
  }
  const officialL = testDoc.listening.answers;

  const rec = await StudentTestRecord.findById('6ae9700c4bee3c54aaf40cdb');
  if (!rec) {
    console.error('Record 6ae9700c4bee3c54aaf40cdb not found!');
    process.exit(1);
  }

  const userL = (rec.answers && rec.answers.listening) || {};
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

  rec.status = 'completed';
  rec.title = 'Premium Mock Test 1';
  rec.testType = 'Premium Full Mock';
  rec.totalQuestions = 40;
  rec.listeningScore = correctL;
  rec.listeningBand = calcIeltsBand(correctL);
  rec.mistakes = rec.mistakes || {};
  rec.mistakes.listening = listL;
  rec.markModified('mistakes');
  await rec.save();

  console.log('Updated record 6ae9700c4bee3c54aaf40cdb successfully!');
  console.log({
    id: rec._id,
    status: rec.status,
    title: rec.title,
    listeningScore: rec.listeningScore,
    listeningBand: rec.listeningBand,
    mistakesCount: rec.mistakes.listening.length
  });

  // Also remove the old Nov 1 duplicate attempt 6ae7479e26a37385a21bc5ec so it doesn't clutter
  await StudentTestRecord.deleteOne({ _id: '6ae7479e26a37385a21bc5ec' });
  console.log('Cleaned up old empty Nov 1 duplicate record.');

  await mongoose.disconnect();
}

fixUserRecord().catch(e => { console.error(e); process.exit(1); });
