const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'Practice-hub.html');
let c = fs.readFileSync(p, 'utf8');
if (c.includes("id:'speaking',name:'Speaking'")) { console.log('already added'); process.exit(0); }
const re = /(\{ t: "Two-Part-Question"[^\n]*?\}\]\})(\r?\n\];)/;
if (!re.test(c)) { console.log('NOT FOUND'); process.exit(1); }
const add = `,
  {id:'speaking',name:'Speaking',ic:'',title:'IELTS Speaking Practice by Part',d:'Practise with a 3D AI examiner and a natural British voice. Choose Part 1, Part 2 or Part 3, then pick any of the 5 tests (Set 1 to 5) for an instant band score.',all:'/speaking.html',meta:'3D AI examiner · voice',items:[
   { t: "Part-1", n: "Part 1 · Interview", i:'', d: "Answer everyday questions about yourself, your home, work and studies." },
   { t: "Part-2", n: "Part 2 · Cue Card", i:'', d: "One minute to prepare, then speak for up to two minutes on a topic card." },
   { t: "Part-3", n: "Part 3 · Discussion", i:'', d: "Discuss abstract ideas in depth and justify your opinions." }]}`;
c = c.replace(re, (m, a, b) => a + add + b);
fs.writeFileSync(p, c, 'utf8');
console.log('module added');
