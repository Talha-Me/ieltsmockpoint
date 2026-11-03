const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../public/cambridge-writing.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace CRLF with LF for processing
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

const oldArray = `const cambridgeBooks = [
  { book: 12, tests: 4 }, { book: 13, tests: 4 }, { book: 14, tests: 4 },
  { book: 15, tests: 4 }, { book: 16, tests: 4 }, { book: 17, tests: 4 },
  { book: 18, tests: 4 }
];`;

const newArray = `const cambridgeBooks = [
  { book: 12, tests: 4 }, { book: 13, tests: 4 }, { book: 14, tests: 4 },
  { book: 15, tests: 4 }, { book: 16, tests: 4 }, { book: 17, tests: 4 },
  { book: 18, tests: 4 }, { book: 19, tests: 4 }, { book: 20, tests: 4 },
  { book: 21, tests: 4 }
];`;

if (!content.includes(oldArray)) {
  console.error("Still cannot find oldArray in LF!");
  process.exit(1);
}

content = content.split(oldArray).join(newArray);
console.log("Updated cambridgeBooks arrays successfully.");

// 2. Add SEO links for books 19, 20, 21 in the list
const oldList = `        <li><strong>Cambridge IELTS 18 Writing:</strong> <a href="/cambridge/writing/18/1">Test 1</a> · <a href="/cambridge/writing/18/2">Test 2</a> · <a href="/cambridge/writing/18/3">Test 3</a> · <a href="/cambridge/writing/18/4">Test 4</a></li>`;
const newList = `        <li><strong>Cambridge IELTS 21 Writing:</strong> <a href="/cambridge/writing/21/1">Test 1</a> · <a href="/cambridge/writing/21/2">Test 2</a> · <a href="/cambridge/writing/21/3">Test 3</a> · <a href="/cambridge/writing/21/4">Test 4</a></li>
        <li><strong>Cambridge IELTS 20 Writing:</strong> <a href="/cambridge/writing/20/1">Test 1</a> · <a href="/cambridge/writing/20/2">Test 2</a> · <a href="/cambridge/writing/20/3">Test 3</a> · <a href="/cambridge/writing/20/4">Test 4</a></li>
        <li><strong>Cambridge IELTS 19 Writing:</strong> <a href="/cambridge/writing/19/1">Test 1</a> · <a href="/cambridge/writing/19/2">Test 2</a> · <a href="/cambridge/writing/19/3">Test 3</a> · <a href="/cambridge/writing/19/4">Test 4</a></li>
        <li><strong>Cambridge IELTS 18 Writing:</strong> <a href="/cambridge/writing/18/1">Test 1</a> · <a href="/cambridge/writing/18/2">Test 2</a> · <a href="/cambridge/writing/18/3">Test 3</a> · <a href="/cambridge/writing/18/4">Test 4</a></li>`;

content = content.replace(oldList, newList);

// 3. Update occurrences of 12-18 and 28 / 56
content = content.replace(
  '<h1>Free <span>IELTS Writing</span> Practice Test – Cambridge 12–18</h1>',
  '<h1>Free <span>IELTS Writing</span> Practice Test – Cambridge 12–21</h1>'
);
content = content.replace(
  '<p>Take a free IELTS writing practice test online. Sit a full 60-minute Writing test or drill IELTS Writing Task 1 and Task 2 separately, using real Cambridge 12–18 questions in the actual exam interface.</p>',
  '<p>Take a free IELTS writing practice test online. Sit a full 60-minute Writing test or drill IELTS Writing Task 1 and Task 2 separately, using real Cambridge 12–21 questions in the actual exam interface.</p>'
);
content = content.replace(
  '<p>Choose any book from Cambridge IELTS 12 to 18 and start your free IELTS writing practice test.',
  '<p>Choose any book from Cambridge IELTS 12 to 21 and start your free IELTS writing practice test.'
);
content = content.replace(
  '<div class="stat"><b data-n="28">0</b><span>Writing tests</span></div>',
  '<div class="stat"><b data-n="40">0</b><span>Writing tests</span></div>'
);
content = content.replace(
  '<div class="stat"><b data-n="56">0</b><span>Tasks to practise</span></div>',
  '<div class="stat"><b data-n="80">0</b><span>Tasks to practise</span></div>'
);
content = content.replace(
  '<button class="dd-btn" id="ddBtn" type="button" aria-haspopup="true"><span id="ddLabel">All Cambridge Books</span><em id="ddNum">28</em>',
  '<button class="dd-btn" id="ddBtn" type="button" aria-haspopup="true"><span id="ddLabel">All Cambridge Books</span><em id="ddNum">40</em>'
);
content = content.replace(
  'work on real Cambridge IELTS 12 to 18 questions',
  'work on real Cambridge IELTS 12 to 21 questions'
);
content = content.replace(
  'With 7 Cambridge books and 4 tests in each, you get <strong>28 free IELTS writing practice tests</strong>, which means 28 Task 1 questions and 28 Task 2 questions, 56 tasks in total',
  'With 10 Cambridge books and 4 tests in each, you get <strong>40 free IELTS writing practice tests</strong>, which means 40 Task 1 questions and 40 Task 2 questions, 80 tasks in total'
);
content = content.replace(
  '<li>Mock tests available <b>28</b></li>',
  '<li>Mock tests available <b>40</b></li>'
);
content = content.replace(
  '<h2>All Free Cambridge IELTS Writing Tests (12–18)</h2>',
  '<h2>All Free Cambridge IELTS Writing Tests (12–21)</h2>'
);
content = content.replace(
  'Cambridge IELTS 12 to 18 are available, each with 4 full writing tests. That gives you 28 free IELTS writing practice tests and 56 tasks in total.',
  'Cambridge IELTS 12 to 21 are available, each with 4 full writing tests. That gives you 40 free IELTS writing practice tests and 80 tasks in total.'
);

// Meta tags & LD-JSON
content = content.replace(
  '<title>Free IELTS Writing Practice Test – Task 1 & Task 2, Cambridge 12–18 | IELTS Mockpoint</title>',
  '<title>Free IELTS Writing Practice Test – Task 1 & Task 2, Cambridge 12–21 | IELTS Mockpoint</title>'
);
content = content.replace(
  'content="Free IELTS writing practice with Cambridge 12–18 Writing Task 1 & Task 2 in the real exam interface. Full tests or one task at a time."',
  'content="Free IELTS writing practice with Cambridge 12–21 Writing Task 1 & Task 2 in the real exam interface. Full tests or one task at a time."'
);
content = content.replace(
  'content="Practise IELTS Writing Task 1 and Task 2 from Cambridge 12–18 for free."',
  'content="Practise IELTS Writing Task 1 and Task 2 from Cambridge 12–21 for free."'
);
content = content.replace(
  '"name": "Free IELTS Writing Practice Test - Cambridge 12-18"',
  '"name": "Free IELTS Writing Practice Test - Cambridge 12-21"'
);
content = content.replace(
  '"name": "Free Cambridge IELTS Writing Practice Tests (Cambridge 12-18)"',
  '"name": "Free Cambridge IELTS Writing Practice Tests (Cambridge 12-21)"'
);
content = content.replace(
  '"numberOfItems": 28',
  '"numberOfItems": 40'
);

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated public/cambridge-writing.html!');
