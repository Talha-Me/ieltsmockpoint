const mongoose = require('../config/db');

async function check() {
  const wp = mongoose.connection.db.collection('writing-practices');
  const agg = await wp.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 }, pracNumbers: { $push: '$pracNumber' } } }
  ]).toArray();
  console.log(JSON.stringify(agg, null, 2));
  process.exit(0);
}

mongoose.connection.once('open', check);
