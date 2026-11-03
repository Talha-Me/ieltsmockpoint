const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'cambridge-writing.html'), 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\S]*?<\/body>/);

const cards = [];
const elements = {
  grid: {
    innerHTML: '',
    appendChild(c) { cards.push(c); },
    addEventListener() {}
  },
  tabs: { innerHTML: '', addEventListener() {} },
  rc: { textContent: '' },
  q: { addEventListener() {} },
  sort: { addEventListener() {} },
  tests: { scrollIntoView() {} },
  hd: { classList: { toggle() {} } },
  sb: { classList: { toggle() {} }, setAttribute() {} },
  ov: { classList: { toggle() {} } },
  openMenu: { onclick: null },
  closeMenu: { onclick: null },
  psUnlockModal: { classList: { add() {}, remove() {} }, style: {} }
};

const sandbox = {
  document: {
    getElementById(id) {
      if (!elements[id]) elements[id] = { innerHTML: '', textContent: '', addEventListener() {}, classList: { toggle() {}, remove() {}, add() {} } };
      return elements[id];
    },
    querySelectorAll() { return []; },
    createElement(tag) {
      return { tagName: tag, className: '', style: { animationDelay: '', setProperty() {} }, innerHTML: '', addEventListener() {} };
    },
    addEventListener() {}
  },
  window: {
    location: { pathname: '/cambridge-writing.html', search: '' }
  },
  location: { hash: '', pathname: '/cambridge-writing.html', search: '' },
  localStorage: {
    getItem: (k) => null,
    setItem: () => {}
  },
  fetch: () => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      success: true,
      settings: { currentPhase: 2, freeFullMocksCount: 1, freePartsPerTest: 1 }
    })
  }),
  IntersectionObserver: class { observe() {} unobserve() {} },
  matchMedia: () => ({ matches: false }),
  addEventListener: () => {},
  console: console,
  setTimeout: setTimeout
};

vm.createContext(sandbox);
vm.runInContext(scriptMatch[1], sandbox);

setTimeout(() => {
  console.log('Cards rendered in Phase 2:', cards.length);
  const secondBatch = cards.slice(40);
  const test1 = secondBatch.find(c => c.innerHTML.includes('Cambridge 21 Writing Test 01'));
  const test2 = secondBatch.find(c => c.innerHTML.includes('Cambridge 21 Writing Test 02'));

  console.log('Test 1 Take Test locked?:', test1.innerHTML.includes('Take Test <svg'));
  console.log('Test 1 Part 2 locked?:', test1.innerHTML.includes('Task 2 · 40 min 🔒'));

  console.log('Test 2 Take Test locked?:', test2.innerHTML.includes('Take Test <svg'));
}, 100);
