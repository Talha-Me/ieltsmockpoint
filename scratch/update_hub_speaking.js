const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

function edit(rel, pairs) {
  const p = path.join(root, rel);
  let c = fs.readFileSync(p, 'utf8');
  for (const [a, b, label] of pairs) {
    if (!c.includes(a)) { console.log('NOT FOUND:', rel, label); continue; }
    c = c.replace(a, () => b);
    console.log('OK:', rel, label);
  }
  fs.writeFileSync(p, c, 'utf8');
}

// 1. bump nav cache so everyone gets the new menu
edit('public/shared-layout.js', [
  ["var NAV_CACHE_KEY = 'mp_shared_nav_v9';", "var NAV_CACHE_KEY = 'mp_shared_nav_v10';", 'cache key']
]);

const MIC = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`;

edit('FrontPage/Frontend/Practice-hub.html', [
  // url builder
  ["  writing:(t,n)=>`/writing-practice?pracNumber=Set-${n}&type=${encodeURIComponent(t)}`\r\n};",
   "  writing:(t,n)=>`/writing-practice?pracNumber=Set-${n}&type=${encodeURIComponent(t)}`,\r\n  speaking:(t,n)=>`/speaking-test?id=${n}&part=${String(t).replace('Part-','')}`\r\n};", 'url.speaking'],
  // icon
  ["  'writing': '<svg", `  'speaking': '${MIC}',\r\n  'writing': '<svg`, 'icon'],
  // module
  ["   { t: \"Two-Part-Question\", n: \"Two-Part Question\", i:'', d: \"Answer two linked questions in one essay.\" }]}\r\n];",
   `   { t: "Two-Part-Question", n: "Two-Part Question", i:'', d: "Answer two linked questions in one essay." }]},
  {id:'speaking',name:'Speaking',ic:'',title:'IELTS Speaking Practice by Part',d:'Practise with a 3D AI examiner and a natural British voice. Choose Part 1, Part 2 or Part 3, then pick any of the 5 tests (Set 1 to 5) for an instant band score.',all:'/speaking.html',meta:'3D AI examiner · voice',items:[
   { t: "Part-1", n: "Part 1 · Interview", i:'', d: "Answer everyday questions about yourself, your home, work and studies." },
   { t: "Part-2", n: "Part 2 · Cue Card", i:'', d: "One minute to prepare, then speak for up to two minutes on a topic card." },
   { t: "Part-3", n: "Part 3 · Discussion", i:'', d: "Discuss abstract ideas in depth and justify your opinions." }]}
];`, 'module'],
  // normalise -> always provide speaking sets 1..5 (tests)
  ["  mods.forEach(m=>{out[m.id]={};const src=(raw&&raw[m.id])||{};Object.keys(src).forEach(t=>out[m.id][t]=norm(src[t]));});\r\n  return out;",
   "  mods.forEach(m=>{out[m.id]={};const src=(raw&&raw[m.id])||{};Object.keys(src).forEach(t=>out[m.id][t]=norm(src[t]));});\r\n  out.speaking={'Part-1':norm(5),'Part-2':norm(5),'Part-3':norm(5)};\r\n  return out;", 'normalise'],
  // card id for deep links
  ["g+=`<article class=\"card reveal\" data-s=", "g+=`<article class=\"card reveal\"${m.id==='speaking'?` id=\"sp-${o.t}\"`:''} data-s=", 'card id'],
  // skill param lists
  ["let cur=['reading','listening','writing'].includes(__skillParam)?__skillParam:'all';", "let cur=['reading','listening','writing','speaking'].includes(__skillParam)?__skillParam:'all';", 'skillParam'],
  ["cur=['reading','listening','writing'].includes(sp)?sp:'all';", "cur=['reading','listening','writing','speaking'].includes(sp)?sp:'all';", 'sync skill'],
  // skills stat
  ["countTo($('stS'),3);", "countTo($('stS'),4);", 'skills count'],
  ['<strong id="stS">3</strong>', '<strong id="stS">4</strong>', 'skills static'],
  // deep link scroll on load
  ["loadCounts().then(d=>{DATA=d;build();if(__skillParam||location.hash==='#hub'){const el=$('hub-bar')||$('hub');",
   "loadCounts().then(d=>{DATA=d;build();if(__skillParam||location.hash==='#hub'||location.hash.indexOf('#sp-')===0){const el=(location.hash.indexOf('#sp-')===0&&document.getElementById(location.hash.slice(1)))||$('hub-bar')||$('hub');", 'load scroll'],
  // deep link scroll on in-page nav click
  ["if(scroll&&(sp||location.hash==='#hub')){const el=$('hub-bar')||$('hub');",
   "if(scroll&&(sp||location.hash==='#hub'||location.hash.indexOf('#sp-')===0)){const el=(location.hash.indexOf('#sp-')===0&&document.getElementById(location.hash.slice(1)))||$('hub-bar')||$('hub');", 'sync scroll'],
]);
