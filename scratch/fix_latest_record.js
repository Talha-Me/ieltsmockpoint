require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const StudentTestRecord = require('../models/StudentTestRecord');

async function fixLatestRecord() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  const rec = await StudentTestRecord.findById('6ae97c3af9c1a4fdda3045bb');
  if (rec) {
    rec.status = 'completed';
    rec.title = 'IELTS Full Mock Test';
    // Part 1 had 7.5, Part 2 was unattempted (0.0): (7.5 + 2*0)/3 = 2.5
    rec.writingScore = 2.5;
    rec.writingBand = 2.5;
    rec.listeningScore = 5;
    rec.listeningBand = 3.0;
    rec.overallBand = 3.0; // roundIeltsBand((3.0 + 2.5) / 2) = 2.75 -> 3.0
    await rec.save();
    console.log('Updated 6ae97c3af9c1a4fdda3045bb successfully: writingBand set to 2.5, overallBand 3.0, status completed');
  }

  const all = await StudentTestRecord.find({ userEmail: 'talhaoffice26@gmail.com' }).sort({ createdAt: -1 }).lean();
  console.log('All records now:');
  all.forEach(r => {
    console.log({
      id: r._id,
      title: r.title,
      status: r.status,
      listeningBand: r.listeningBand,
      writingBand: r.writingBand,
      overallBand: r.overallBand
    });
  });

  await mongoose.disconnect();
}
fixLatestRecord();
