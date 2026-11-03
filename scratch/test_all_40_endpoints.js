const http = require('http');

async function testAll() {
  console.log("Testing all 40 Cambridge Writing API endpoints...");
  let successCount = 0;
  let failures = [];

  for (let b = 12; b <= 21; b++) {
    for (let t = 1; t <= 4; t++) {
      try {
        const res = await fetch(`http://localhost:5001/api/cambridge-writing-test-data/${b}/${t}`);
        if (!res.ok) {
          failures.push(`Book ${b} Test ${t}: HTTP ${res.status}`);
          continue;
        }
        const json = await res.json();
        if (!json.success || !json.data || !json.data.writing || !Array.isArray(json.data.writing.questions)) {
          failures.push(`Book ${b} Test ${t}: Invalid response structure`);
          continue;
        }
        if (json.data.writing.questions.length !== 2) {
          failures.push(`Book ${b} Test ${t}: Expected 2 questions, got ${json.data.writing.questions.length}`);
          continue;
        }
        const q1 = json.data.writing.questions[0];
        const q2 = json.data.writing.questions[1];
        if (!q1.question || !q2.question) {
          failures.push(`Book ${b} Test ${t}: Empty question text`);
          continue;
        }
        successCount++;
      } catch (err) {
        failures.push(`Book ${b} Test ${t}: Error ${err.message}`);
      }
    }
  }

  console.log(`Results: ${successCount} / 40 tests passed.`);
  if (failures.length > 0) {
    console.error("Failures:", failures);
    process.exit(1);
  } else {
    console.log("ALL 40 Cambridge Writing Tests are online and responding correctly!");
    process.exit(0);
  }
}

testAll();
