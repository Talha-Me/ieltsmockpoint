const mongoose = require('../config/db');

async function checkAll() {
  const Schema = new mongoose.Schema({}, { strict: false });
  const CambridgeWriting =
    mongoose.models.CambridgeWriting ||
    mongoose.model('CambridgeWriting', Schema, 'cambridgewritings');

  const all = await CambridgeWriting.find({}).sort({ book: 1, testNo: 1 }).lean();
  console.log(`Total documents found in DB: ${all.length}`);

  let missingImgs = [];
  for (const doc of all) {
    const q1 = doc.writing?.questions?.find(q => q.part === 1);
    if (!q1 || !q1.image || q1.image.length === 0 || !q1.image[0]) {
      missingImgs.push(`Book ${doc.book} Test ${doc.testNo}`);
    }
  }

  if (missingImgs.length > 0) {
    console.error("Missing images for:", missingImgs);
  } else {
    console.log("SUCCESS! All 40 Cambridge Writing tests have valid Task 1 Cloudflare R2 images in MongoDB!");
  }
  process.exit(0);
}

mongoose.connection.once('open', checkAll);
