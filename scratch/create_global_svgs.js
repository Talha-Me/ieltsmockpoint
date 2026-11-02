const fs = require('fs');
const path = require('path');

const paypal_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 36" height="32" width="98">
  <path d="M19 6h7.5c4.8 0 8 3 7.2 7.8-1 5.5-5 8.2-9.7 8.2h-3.8l-2.4 12H12l5.7-28z" fill="#003087"/>
  <path d="M23.5 11h7.5c4.2 0 7 2.6 6.3 6.8-1 5-4.5 7.2-8.8 7.2h-4l-2 11h-5.2l6.2-25z" fill="#0079C1"/>
  <text x="39" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="800" fill="#003087">Pay<tspan fill="#0079C1">Pal</tspan></text>
</svg>`;

const applepay_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 36" height="32" width="90">
  <g fill="#111827">
    <path d="M18.8 10.2c.5-.6.8-1.5.7-2.3-.8 0-1.7.5-2.2 1.1-.4.5-.9 1.4-.8 2.3.9.1 1.7-.4 2.3-1.1zM19.7 11.5c-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.6-2.5-.6-1.3 0-2.5.7-3.1 1.8-1.3 2.3-.3 5.7 1 7.6.6.9 1.3 1.9 2.3 1.8 1 0 1.4-.6 2.5-.6 1.1 0 1.5.6 2.5.6 1.1 0 1.7-.9 2.3-1.8.7-1 1-2.1 1-2.2-.1 0-2-.8-2-3.1 0-1.9 1.6-2.9 1.7-3-.9-1.3-2.2-1.4-2.8-1.4z"/>
    <text x="26" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="600" letter-spacing="-0.3px">Pay</text>
  </g>
</svg>`;

const gpay_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105 36" height="32" width="95">
  <path d="M20 18.2c0-.6-.1-1.2-.2-1.8H12v3.5h4.5c-.2 1-.8 1.9-1.7 2.5v2.1h2.7c1.6-1.5 2.5-3.7 2.5-6.3z" fill="#4285F4"/>
  <path d="M12 26.4c2.3 0 4.2-.8 5.6-2.1l-2.7-2.1c-.8.5-1.7.8-2.9.8-2.2 0-4.1-1.5-4.7-3.5H4.5v2.2C6 24.6 8.8 26.4 12 26.4z" fill="#34A853"/>
  <path d="M7.3 19.5c-.2-.5-.3-1.1-.3-1.7 0-.6.1-1.2.3-1.7v-2.2H4.5C3.9 15.1 3.6 16.5 3.6 18s.3 2.9.9 4.1l2.8-2.6z" fill="#FBBC05"/>
  <path d="M12 12.8c1.2 0 2.3.4 3.2 1.3l2.4-2.4C16.2 10.4 14.3 9.6 12 9.6 8.8 9.6 6 11.4 4.5 14.3l2.8 2.2c.6-2 2.5-3.7 4.7-3.7z" fill="#EA4335"/>
  <text x="24" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="600" fill="#3c4043">Pay</text>
</svg>`;

const dirs = [
  path.join(__dirname, '../public/images/payment-logos'),
  path.join(__dirname, '../FrontPage/Frontend/images/payment-logos')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'logo-paypal.svg'), paypal_svg);
  fs.writeFileSync(path.join(dir, 'logo-applepay.svg'), applepay_svg);
  fs.writeFileSync(path.join(dir, 'logo-googlepay.svg'), gpay_svg);
});

console.log('Global SVGs successfully saved!');
