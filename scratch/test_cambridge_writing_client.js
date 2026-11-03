const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'cambridge-writing.html'), 'utf8');

// Extract script content
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\S]*?<\/body>/);
if (!scriptMatch) {
  console.error('Could not find main script tag');
  process.exit(1);
}

console.log('Script tag found, length:', scriptMatch[1].length);

// Mock browser objects
const elements = {
  grid: { innerHTML: '', appendChild(el) { this.children.push(el); }, children: [], addEventListener() {} },
  tabs: { innerHTML: '', addEventListener() {} },
  rc: { textContent: '' },
  q: { addEventListener() {} },
  sort: { addEventListener() {} },
  tests: { scrollIntoView() {} },
  hd: { classList: { toggle() {} } },
  sb: { classList: { toggle() {} }, setAttribute() {} },
  ov: { classList: { toggle() {} } },
  openMenu: { onclick: null },
  closeMenu: { onclick: null }
};

global.document = {
  getElementById(id) {
    if (!elements[id]) {
      elements[id] = { innerHTML: '', textContent: '', addEventListener() {}, classList: { toggle() {}, remove() {}, add() {} } };
    }
    return elements[id];
  },
  querySelectorAll() { return []; },
  createElement(tag) {
    return {
      tagName: tag,
      className: '',
      style: { animationDelay: '', setProperty() {} },
      innerHTML: '',
      addEventListener() {}
    };
  },
  addEventListener() {}
};

global.addEventListener = () => {};
global.window = {
  location: { pathname: '/cambridge-writing.html', search: '' }
};
global.location = global.window.location;
global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, settings: { currentPhase: 1 } }) });
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
};
global.matchMedia = () => ({ matches: false });

try {
  eval(scriptMatch[1]);
  console.log('Script evaluated successfully without errors!');
  console.log('Rendered cards count:', elements.grid.children.length);
  if (elements.grid.children.length === 40) {
    console.log('SUCCESS: Exactly 40 Cambridge writing tests (Books 12-21) rendered!');
    const firstCard = elements.grid.children[0];
    console.log('Sample Card Title:', firstCard.innerHTML.includes('Cambridge 21 Writing Test 01'));
    console.log('Sample Card Take Test:', firstCard.innerHTML.includes('/cambridge/writing/21/1'));
    console.log('Sample Card Part 1:', firstCard.innerHTML.includes('/cambridge/writing/21/1?task=1'));
    console.log('Sample Card Part 2:', firstCard.innerHTML.includes('/cambridge/writing/21/1?task=2'));
  } else {
    console.warn('Card count mismatch:', elements.grid.children.length);
  }
} catch (err) {
  console.error('Script evaluation error:', err);
}
