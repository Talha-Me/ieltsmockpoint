const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db.collection('cambridge_listening_v2');
  const tests = [
    { b: 21, t: 2, q: 27 },
    { b: 19, t: 3, q: 26 },
    { b: 16, t: 2, q: 25 },
    { b: 13, t: 1, q: 26 },
    { b: 12, t: 2, q: 26 },
    { b: 12, t: 3, q: 21 }
  ];
  for (const it of tests) {
    const doc = await db.findOne({ book: it.b, testNo: it.t });
    const g = (doc.questionGroups || []).find(grp => (grp.questionIds || grp.ids || []).includes(it.q));
    console.log('Book ' + it.b + ' Test ' + it.t + ' Q' + it.q + ':');
    if (!g) {
      console.log(' Group not found!');
      continue;
    }
    console.log(' Type:', g.type);
    console.log(' Keys:', Object.keys(g));
    if (g.steps) console.log(' g.steps count:', g.steps.length, 'sample:', JSON.stringify(g.steps[0]));
    if (g.flowChartSteps) console.log(' g.flowChartSteps count:', g.flowChartSteps.length);
    if (g.items) console.log(' g.items count:', g.items.length);
    if (g.options) console.log(' g.options count:', g.options.length);
  }
  process.exit(0);
});
