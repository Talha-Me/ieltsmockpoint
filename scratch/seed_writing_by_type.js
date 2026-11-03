// seed_writing_by_type.js
// Seeds Cambridge 12-21 writing questions into 'writing-practices' collection by type.
// Does NOT delete existing documents. Assigns new Set-N numbers starting AFTER existing ones.

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = "mongodb+srv://abutalhaakash26_db_user:9SLvZMWGpJKA3DlL@cluster0.ud2umzq.mongodb.net/ielts-agent?retryWrites=true&w=majority";

// --- Type classification logic ---
function classifyTask1(question) {
  const q = question.toLowerCase();
  if (q.includes('line graph') || (q.includes('graph') && !q.includes('bar') && !q.includes('pie') && !q.includes('chart'))) return 'Line-Graph';
  if (q.includes('bar chart')) return 'Bar-Chart';
  if (q.includes('pie chart')) return 'Pie-Chart';
  if ((q.includes('table') && q.includes('chart')) || (q.includes('table') && q.includes('graph'))) return 'Mixed-Charts';
  if (q.includes('table') && !q.includes('chart') && !q.includes('graph')) return 'Table';
  if (q.includes('map') || q.includes(' plan') || q.includes('plans') || q.includes('site') || q.includes('layout') || q.includes('harbour') || q.includes('park') || q.includes('cafe') || q.includes('town') || q.includes('village') || q.includes('island') || q.includes('farmland') || q.includes('library') || q.includes('museum') || q.includes('airport') || q.includes('road') || q.includes('city centre')) return 'Map';
  if (q.includes('diagram') || q.includes('process') || q.includes('manufactur') || q.includes('produc') || q.includes('stages') || q.includes('cycle') || q.includes('how')) return 'Process-Diagram';
  if (q.includes('bar') || q.includes('chart')) return 'Bar-Chart';
  return 'Bar-Chart'; // fallback
}

function classifyTask2(question) {
  const q = question.toLowerCase();
  if (q.includes('discuss both') || q.includes('discuss both views') || q.includes('to what extent do you agree')) {
    if (q.includes('discuss both')) return 'Discussion-Essay';
  }
  if (q.includes('discuss both')) return 'Discussion-Essay';
  if (q.includes('agree or disagree') || q.includes('do you agree or disagree')) return 'Opinion-Essay';
  if (q.includes('to what extent do you agree')) return 'Opinion-Essay';
  if (q.includes('positive or negative') || q.includes('positive development') || q.includes('negative development') || q.includes('more positive') || q.includes('more negative')) return 'Positive-Negative';
  if (q.includes('outweigh') || q.includes('advantages and disadvantages') || q.includes('advantages outweigh') || q.includes('disadvantages outweigh')) return 'Advantages-Disadvantages';
  if (q.includes('what can be done') || (q.includes('causes') && q.includes('solution')) || (q.includes('problems') && q.includes('solution')) || (q.includes('why') && q.includes('what'))) {
    const qmarks = (q.match(/\?/g) || []).length;
    if (qmarks >= 2) return 'Two-Part-Question';
    return 'Problem-Solution';
  }
  // Count question marks for two-part
  const qmarks = (q.match(/\?/g) || []).length;
  if (qmarks >= 2) return 'Two-Part-Question';
  // Fallback
  return 'Opinion-Essay';
}

async function main() {
  // Load Cambridge writing data
  const dataPath = path.join(__dirname, '..', 'data', 'cambridgeWriting12_21.json');
  const allTests = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Loaded ${allTests.length} Cambridge writing tests`);

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ielts-agent');
  const col = db.collection('writing-practices');

  // Get existing docs to know the current max set numbers per type
  const existingDocs = await col.find({}, { projection: { type: 1, pracNumber: 1, _id: 0 } }).toArray();
  
  // Build a map: type -> current max set number
  const maxSets = {};
  for (const doc of existingDocs) {
    // Only count proper Set-N numbered docs (not Practice-1 or type "1"/"2")
    if (doc.pracNumber && doc.pracNumber.startsWith('Set-') && doc.type && doc.type.length > 2) {
      const n = parseInt(doc.pracNumber.replace('Set-', '')) || 0;
      if (!maxSets[doc.type] || maxSets[doc.type] < n) {
        maxSets[doc.type] = n;
      }
    }
  }
  console.log('Existing max set numbers:', JSON.stringify(maxSets, null, 2));

  // Counters for new sets
  const counters = { ...maxSets };

  let inserted = 0;
  let skipped = 0;

  for (const test of allTests) {
    const questions = test.writing && test.writing.questions ? test.writing.questions : [];
    const q1 = questions.find(q => q.part === 1);
    const q2 = questions.find(q => q.part === 2);

    if (!q1 || !q2) {
      console.warn(`Skipping book ${test.book} test ${test.testNo} - missing task`);
      skipped++;
      continue;
    }

    const type1 = classifyTask1(q1.question);
    const type2 = classifyTask2(q2.question);

    console.log(`Book ${test.book} Test ${test.testNo}: Task1=${type1}, Task2=${type2}`);

    // Task 1 document
    if (!counters[type1]) counters[type1] = 0;
    counters[type1]++;
    const setNum1 = counters[type1];
    const pracNumber1 = `Set-${setNum1}`;

    const doc1 = {
      pracNumber: pracNumber1,
      type: type1,
      plan: 'Academic',
      source: `Cambridge ${test.book} Test ${test.testNo}`,
      writing: {
        questions: [{
          part: 1,
          question: q1.question,
          image: q1.image || []
        }]
      }
    };

    // Check if already exists
    const exists1 = await col.findOne({ type: type1, pracNumber: pracNumber1 });
    if (exists1) {
      console.log(`  Skipping Task1 ${type1} ${pracNumber1} - already exists`);
      skipped++;
    } else {
      await col.insertOne(doc1);
      console.log(`  Inserted Task1 ${type1} ${pracNumber1}`);
      inserted++;
    }

    // Task 2 document
    if (!counters[type2]) counters[type2] = 0;
    counters[type2]++;
    const setNum2 = counters[type2];
    const pracNumber2 = `Set-${setNum2}`;

    const doc2 = {
      pracNumber: pracNumber2,
      type: type2,
      plan: 'Academic',
      source: `Cambridge ${test.book} Test ${test.testNo}`,
      writing: {
        questions: [{
          part: 2,
          question: q2.question
        }]
      }
    };

    const exists2 = await col.findOne({ type: type2, pracNumber: pracNumber2 });
    if (exists2) {
      console.log(`  Skipping Task2 ${type2} ${pracNumber2} - already exists`);
      skipped++;
    } else {
      await col.insertOne(doc2);
      console.log(`  Inserted Task2 ${type2} ${pracNumber2}`);
      inserted++;
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Inserted: ${inserted}, Skipped: ${skipped}`);

  // Final verification
  const finalTypes = await col.aggregate([
    { $match: { pracNumber: { $regex: /^Set-\d+$/ }, type: { $exists: true } } },
    { $group: { _id: '$type', count: { $sum: 1 }, sets: { $push: '$pracNumber' } } },
    { $sort: { _id: 1 } }
  ]).toArray();

  console.log('\n=== Final writing-practices by type ===');
  for (const t of finalTypes) {
    const nums = t.sets.map(s => parseInt(s.replace('Set-', ''))).sort((a,b)=>a-b);
    console.log(`  ${t._id}: ${t.count} sets → [${nums.join(', ')}]`);
  }

  await client.close();
}

main().catch(e => { console.error(e); process.exit(1); });
