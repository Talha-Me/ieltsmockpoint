const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'Practice-hub.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Check if file loaded
console.log('File size:', html.length);

// 2. Add or replace card CSS
const newCss = `
/* ========================================================
   Uniform Practice Hub Card & Icon Sizing (matches /mocks)
   ======================================================== */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
  gap: 20px !important;
}
.card {
  position: relative;
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 20px;
  padding: 24px 22px 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 275px;
  box-sizing: border-box;
  transition: transform 0.25s ease-out, border-color 0.25s, box-shadow 0.25s;
}
.card:hover {
  transform: translateY(-6px);
  border-color: var(--blue);
  box-shadow: 0 20px 40px rgba(21, 101, 201, 0.13);
}
.card-head-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
}
.card .pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--blue-light);
  color: var(--blue);
}
.ico {
  position: relative;
  width: 36px !important;
  height: 36px !important;
  border-radius: 10px !important;
  background: var(--blue-light);
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  flex-shrink: 0 !important;
  margin-bottom: 0 !important;
  transition: transform 0.3s, background 0.3s;
}
.ico svg {
  width: 18px !important;
  height: 18px !important;
  color: var(--blue);
  flex-shrink: 0 !important;
  transition: color 0.3s, transform 0.3s;
}
.card:hover .ico svg {
  color: var(--red);
  transform: scale(1.08);
}
.card:hover .ico {
  transform: rotate(-6deg) scale(1.08);
  background: #fdecee;
}
.bignum {
  position: absolute;
  right: 14px;
  top: -6px;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: 4.8rem !important;
  color: var(--blue-light);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  transition: color 0.3s;
}
.card:hover .bignum {
  color: #fdecee;
}
.card h3 {
  position: relative;
  font-family: 'Sora', sans-serif;
  font-size: 1.12rem !important;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 6px;
  line-height: 1.35;
}
.card p {
  position: relative;
  color: var(--muted);
  font-size: 0.84rem !important;
  line-height: 1.45;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card .chips {
  position: relative;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.card .chips span {
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--muted);
  background: var(--surface);
  border-radius: 8px;
  padding: 4px 9px;
}
.card-action-wrap {
  position: relative;
  margin-top: auto;
  width: 100%;
}
.btn-card-reading {
  display: flex;
  align-items: center;
  justify-content: center !important;
  gap: 8px;
  width: 100%;
  padding: 10px 18px !important;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  color: #fff !important;
  background: var(--red);
  border: 1.5px solid transparent;
  transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 6px 16px rgba(224, 32, 45, 0.24);
  cursor: pointer;
  box-sizing: border-box;
}
.btn-card-reading:hover {
  background: var(--red-dark);
  box-shadow: 0 10px 22px rgba(224, 32, 45, 0.38);
  transform: translateY(-2px);
  color: #fff;
}

/* ========================================================
   Exact Soft Ice-Blue Frosted Lock Styling (matches /mocks)
   ======================================================== */
.card.is-locked {
  position: relative !important;
  background: #f1f6fd !important;
  border: 1.5px solid #dbeafe !important;
  cursor: pointer !important;
  box-shadow: 0 4px 18px rgba(21, 101, 201, 0.05) !important;
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s !important;
}
.card.is-locked .bignum {
  color: #dbeafe !important;
}
.card.is-locked .pill {
  background: #e0edfe !important;
  color: #1e40af !important;
}
.card.is-locked .ico {
  background: #e0edfe !important;
}
.card.is-locked .ico svg {
  color: #1e40af !important;
}
.card.is-locked h3 {
  color: #0b2b52 !important;
  opacity: 0.9;
}
.card.is-locked p {
  color: #64748b !important;
}
.card.is-locked .chips span {
  background: #e2edfb !important;
  color: #475569 !important;
}
.card.is-locked .btn-card-reading,
.card.is-locked .btn-card-locked,
.card.is-locked .sets a,
.card.is-locked .sets .more {
  background: rgba(224, 32, 45, 0.42) !important;
  color: rgba(255, 255, 255, 0.88) !important;
  border: none !important;
  backdrop-filter: blur(2px) !important;
  -webkit-backdrop-filter: blur(2px) !important;
  box-shadow: none !important;
  pointer-events: none !important;
  user-select: none !important;
}
.card-center-lock {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none;
}
.center-lock-circle {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 26px rgba(21, 101, 201, 0.18), 0 2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s;
}
.center-lock-circle svg {
  fill: #0b2b52;
  width: 24px;
  height: 24px;
  transition: fill 0.2s, transform 0.2s;
}
.card-bottom-unlock {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.01em;
  transition: color 0.2s;
  user-select: none;
}
.card-bottom-unlock svg {
  color: #64748b;
  flex-shrink: 0;
  stroke: currentColor;
}
.card.is-locked:hover {
  transform: translateY(-6px);
  border-color: #93c5fd !important;
  box-shadow: 0 18px 36px rgba(21, 101, 201, 0.12) !important;
}
.card.is-locked:hover .center-lock-circle {
  transform: scale(1.08);
  box-shadow: 0 14px 32px rgba(21, 101, 201, 0.25);
}
.card.is-locked:hover .center-lock-circle svg {
  fill: #e0202d;
}
.card.is-locked:hover .card-bottom-unlock {
  color: #0b2b52;
}
.card.is-locked:hover .card-bottom-unlock svg {
  stroke: #0b2b52;
}
`;

// Inject CSS before </style>
html = html.replace('</style>', newCss + '\n</style>');

// Now update the build() function
const oldBuildStart = 'items.forEach(o=>{';
const oldBuildEnd = "s.innerHTML=g+'</div>';hub.appendChild(s);";

const buildIdx = html.indexOf(oldBuildStart);
console.log('Found build items loop:', buildIdx !== -1);

fs.writeFileSync(filePath, html, 'utf8');
console.log('CSS injected successfully!');
