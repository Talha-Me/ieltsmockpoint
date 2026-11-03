require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const StudentTestRecord = require('../models/StudentTestRecord');

async function check() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  const userEmail = 'talhaoffice26@gmail.com';
  const records = await StudentTestRecord.find({
    userEmail,
    $or: [
      { status: 'completed' },
      { listeningScore: { $ne: null } },
      { readingScore: { $ne: null } },
      { 'answers.listening': { $exists: true } },
      { 'answers.reading': { $exists: true } }
    ]
  }).sort({ createdAt: -1 }).lean();

  console.log('User records count:', records.length);
  records.forEach(r => {
    console.log({
      id: r._id,
      title: r.title,
      status: r.status,
      listeningScore: r.listeningScore,
      writingScore: r.writingScore,
      writingBand: r.writingBand
    });
  });
  await mongoose.disconnect();
}
check();
