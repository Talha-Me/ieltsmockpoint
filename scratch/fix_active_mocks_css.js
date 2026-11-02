const fs = require('fs');
const path = require('path');

const mocksPath = path.resolve(__dirname, '../FrontPage/Frontend/mocks.html');
let mocksHtml = fs.readFileSync(mocksPath, 'utf8');

const activeCss = `
/* ========================================================
   Exact Mockup: Soft Ice-Blue Frosted Card with Center Lock & Bottom Unlock Prompt
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

.card.is-locked h3 {
  color: #0b2b52 !important;
  opacity: 0.9;
}

.card.is-locked .chips span {
  background: #e2edfb !important;
  color: #475569 !important;
}

/* Translucent Frosted Start Test Button */
.card.is-locked .btn,
.card.is-locked a.btn,
.card.is-locked .btn.btn-red {
  background: rgba(224, 32, 45, 0.42) !important;
  color: rgba(255, 255, 255, 0.88) !important;
  border: none !important;
  backdrop-filter: blur(2px) !important;
  -webkit-backdrop-filter: blur(2px) !important;
  box-shadow: none !important;
  pointer-events: none !important;
  user-select: none !important;
}

/* Floating Centerpiece Padlock Badge */
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
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.center-lock-circle svg {
  fill: #0b2b52 !important;
  width: 26px !important;
  height: 26px !important;
  display: block;
  transition: fill 0.25s ease;
}

/* Bottom Left 'Unlock Test >' Indicator */
.card-bottom-unlock {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: #64748b;
  user-select: none;
  transition: color 0.22s ease, transform 0.22s ease;
}

.card-bottom-unlock svg {
  stroke: #64748b;
  width: 16px !important;
  height: 16px !important;
  display: inline-block;
  vertical-align: middle;
  transition: stroke 0.22s ease;
  flex-shrink: 0;
}

/* Hover States matching user screenshot */
.card.is-locked:hover {
  transform: translateY(-6px) !important;
  border-color: #bfdbfe !important;
  box-shadow: 0 16px 36px rgba(21, 101, 201, 0.12) !important;
}

.card.is-locked:hover .center-lock-circle {
  transform: scale(1.1);
  box-shadow: 0 14px 32px rgba(224, 32, 45, 0.22);
  border-color: rgba(224, 32, 45, 0.3);
}

.card.is-locked:hover .center-lock-circle svg {
  fill: #e0202d !important;
}

.card.is-locked:hover .card-bottom-unlock {
  color: #e0202d;
  transform: translateX(2px);
}

.card.is-locked:hover .card-bottom-unlock svg {
  stroke: #e0202d;
}

/* Premium Card Variants */
.card.premium.is-locked {
  background: #0d284a !important;
  border-color: #1e3a5f !important;
}

.card.premium.is-locked .bignum {
  color: rgba(255, 255, 255, 0.08) !important;
}

.card.premium.is-locked h3 {
  color: #ffffff !important;
}

.card.premium.is-locked .center-lock-circle {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.4);
}

.card.premium.is-locked .center-lock-circle svg {
  fill: #ffffff !important;
}

.card.premium.is-locked .card-bottom-unlock {
  color: rgba(255, 255, 255, 0.7);
}

.card.premium.is-locked .card-bottom-unlock svg {
  stroke: rgba(255, 255, 255, 0.7);
}

.card.premium.is-locked:hover .center-lock-circle {
  background: rgba(224, 32, 45, 0.3);
  border-color: #e0202d;
}

.card.premium.is-locked:hover .center-lock-circle svg {
  fill: #ffffff !important;
}

.card.premium.is-locked:hover .card-bottom-unlock {
  color: #ffffff;
}

.card.premium.is-locked:hover .card-bottom-unlock svg {
  stroke: #ffffff;
}
`;

// Find the active closing </style> tag that precedes <script src="/shared-layout.js"></script>
const target = '</style>\n<script src="/shared-layout.js"></script>';
const targetCRLF = '</style>\r\n<script src="/shared-layout.js"></script>';

if (mocksHtml.includes(targetCRLF)) {
  mocksHtml = mocksHtml.replace(targetCRLF, `${activeCss}\n</style>\r\n<script src="/shared-layout.js"></script>`);
  console.log('Inserted active CSS before closing style tag (CRLF)!');
} else if (mocksHtml.includes(target)) {
  mocksHtml = mocksHtml.replace(target, `${activeCss}\n</style>\n<script src="/shared-layout.js"></script>`);
  console.log('Inserted active CSS before closing style tag (LF)!');
} else {
  console.error('Could not find active closing style tag in mocks.html!');
}

fs.writeFileSync(mocksPath, mocksHtml, 'utf8');
console.log('FrontPage/Frontend/mocks.html successfully updated in active style block!');
