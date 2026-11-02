const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'pricing.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS for Payment Methods Visual Showcase
const paymentMethodsCss = `
    /* ========================================================
       Payment Gateways Visual Showcase (Aamarpay & Paddle)
       ======================================================== */
    .payment-methods-sec {
      background: #ffffff;
      border: 1.5px solid var(--line);
      border-radius: 24px;
      padding: 38px 34px;
      margin-bottom: 48px;
      box-shadow: var(--shadow);
      position: relative;
      overflow: hidden;
    }
    .pm-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1.5px solid var(--line);
    }
    .pm-title-wrap h3 {
      font-family: 'Sora', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--navy);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .pm-title-wrap p {
      font-size: 0.88rem;
      color: var(--muted);
      margin-top: 4px;
    }
    .pm-gateway-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 999px;
      background: var(--blue-light);
      color: var(--blue);
      border: 1px solid var(--blue-border);
    }
    .pm-gateway-badge.aamarpay {
      background: #fdecee;
      color: var(--red);
      border-color: rgba(224, 32, 45, 0.25);
    }

    .pm-boxes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 860px) {
      .pm-boxes-grid {
        grid-template-columns: 1fr;
      }
    }

    .pm-box {
      background: var(--surface);
      border: 1.5px solid var(--line);
      border-radius: 18px;
      padding: 24px 22px;
      transition: all 0.25s ease;
    }
    .pm-box:hover {
      border-color: var(--blue);
      background: #ffffff;
      box-shadow: 0 10px 26px rgba(11, 43, 82, 0.06);
    }
    .pm-box-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
    }
    .pm-box-title {
      font-family: 'Sora', sans-serif;
      font-size: 0.98rem;
      font-weight: 700;
      color: var(--navy);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pm-box-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--muted);
      background: #ffffff;
      border: 1px solid var(--line);
      padding: 3px 8px;
      border-radius: 6px;
    }

    /* Logo Badges Grid */
    .pm-logos-row {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
      gap: 12px;
      align-items: center;
    }
    .pm-logo-pill {
      background: #ffffff;
      border: 1.5px solid var(--line);
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 58px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      transition: all 0.2s ease;
      cursor: default;
      user-select: none;
    }
    .pm-logo-pill:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(11, 43, 82, 0.10);
      border-color: var(--blue);
    }
    .pm-logo-text {
      font-family: 'Sora', sans-serif;
      font-size: 0.82rem;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.01em;
    }
    .pm-logo-sub {
      font-size: 0.62rem;
      font-weight: 600;
      color: var(--muted);
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* Brand Logo Colors */
    .color-bkash { color: #d12053 !important; }
    .color-nagad { color: #f24e29 !important; }
    .color-rocket { color: #8c3494 !important; }
    .color-upay { color: #ffbe00; background: #0b2b52; padding: 2px 6px; border-radius: 4px; }
    .color-tap { color: #00a859 !important; }
    .color-ok { color: #f39200 !important; }
    .color-sure { color: #0072bc !important; }

    .color-visa { color: #1a1f71 !important; font-style: italic; font-size: 1.05rem; }
    .color-mc { color: #eb001b !important; }
    .color-amex { color: #006fcf !important; }
    .color-dbbl { color: #008853 !important; }
    .color-discover { color: #ff6000 !important; }
    .color-qcash { color: #e31e24 !important; }
    .color-union { color: #e21a22 !important; }

    .color-paypal { color: #003087 !important; }
    .color-apple { color: #000000 !important; }
    .color-google { color: #4285f4 !important; }

    /* Visual Graphic Embed Option */
    .pm-banner-wrapper {
      margin-top: 20px;
      padding: 16px;
      background: #f8fafc;
      border: 1px dashed var(--line);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .pm-banner-thumb {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .pm-banner-thumb img {
      height: 38px;
      width: auto;
      border-radius: 6px;
      border: 1px solid var(--line);
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
`;

// Insert into CSS before </style>
html = html.replace('/* Checkout Modal */', paymentMethodsCss + '\n    /* Checkout Modal */');

// 2. Add Payment Methods Section HTML
const paymentSectionHtml = `
        <!-- Supported Payment Methods Visual Section (Aamarpay & Paddle) -->
        <section class="payment-methods-sec" id="paymentMethodsSection" aria-label="Accepted payment methods">
          <div class="pm-header">
            <div class="pm-title-wrap">
              <h3>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--red)"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <span>Supported Payment Methods</span>
              </h3>
              <p id="pm-desc-text">Pay securely using any Bangladeshi mobile wallet, local debit/credit card, or internet banking.</p>
            </div>
            <div class="pm-gateway-badge aamarpay" id="pm-gateway-badge">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span id="pm-gateway-title">Official Gateway: Aamarpay</span>
            </div>
          </div>

          <!-- Container for Bangladesh (Aamarpay) -->
          <div id="pm-container-bd" class="pm-boxes-grid">
            
            <!-- Box 1: Major Cards - Local & International -->
            <div class="pm-box">
              <div class="pm-box-head">
                <div class="pm-box-title">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <span>Major Cards &bull; Local &amp; International</span>
                </div>
                <span class="pm-box-badge">Debit &amp; Credit</span>
              </div>

              <div class="pm-logos-row">
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-visa">VISA</span>
                  <span class="pm-logo-sub">Cards</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-mc">Mastercard</span>
                  <span class="pm-logo-sub">Global</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-amex">AMEX</span>
                  <span class="pm-logo-sub">Express</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-dbbl">DBBL</span>
                  <span class="pm-logo-sub">Nexus</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-discover">DISCOVER</span>
                  <span class="pm-logo-sub">Network</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-union">UnionPay</span>
                  <span class="pm-logo-sub">Card</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-qcash">Q-Cash</span>
                  <span class="pm-logo-sub">ATM/Debit</span>
                </div>
              </div>
            </div>

            <!-- Box 2: Major Mobile Wallet Methods -->
            <div class="pm-box">
              <div class="pm-box-head">
                <div class="pm-box-title">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 18h.01"/><rect x="5" y="2" width="14" height="20" rx="3"/></svg>
                  <span>Major Mobile Wallet Methods</span>
                </div>
                <span class="pm-box-badge" style="background:#fdecee; color:#e0202d; border-color:#fca5a5;">MFS Instant</span>
              </div>

              <div class="pm-logos-row">
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-bkash">bKash</span>
                  <span class="pm-logo-sub">বিকাশ</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-nagad">Nagad</span>
                  <span class="pm-logo-sub">নগদ</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-rocket">Rocket</span>
                  <span class="pm-logo-sub">রকেট</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-upay">upay</span>
                  <span class="pm-logo-sub">উপায়</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-tap">tap</span>
                  <span class="pm-logo-sub">Trust Axiata</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-ok">OK Wallet</span>
                  <span class="pm-logo-sub">One Bank</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-sure">SureCash</span>
                  <span class="pm-logo-sub">শিওরক্যাশ</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Container for Global / International (Paddle) -->
          <div id="pm-container-global" class="pm-boxes-grid" style="display:none;">
            
            <div class="pm-box">
              <div class="pm-box-head">
                <div class="pm-box-title">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <span>International Credit &amp; Debit Cards</span>
                </div>
                <span class="pm-box-badge">Global Paddle</span>
              </div>

              <div class="pm-logos-row">
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-visa">VISA</span>
                  <span class="pm-logo-sub">Worldwide</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-mc">Mastercard</span>
                  <span class="pm-logo-sub">Worldwide</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-amex">AMEX</span>
                  <span class="pm-logo-sub">International</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-discover">DISCOVER</span>
                  <span class="pm-logo-sub">Global</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-union">UnionPay</span>
                  <span class="pm-logo-sub">Global</span>
                </div>
              </div>
            </div>

            <div class="pm-box">
              <div class="pm-box-head">
                <div class="pm-box-title">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Digital Wallets &amp; Express Checkout</span>
                </div>
                <span class="pm-box-badge" style="background:#e0edfe; color:#1e40af; border-color:#bcd9fb;">1-Click Pay</span>
              </div>

              <div class="pm-logos-row">
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-paypal">PayPal</span>
                  <span class="pm-logo-sub">Checkout</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-apple">Apple Pay</span>
                  <span class="pm-logo-sub">iOS &amp; Mac</span>
                </div>
                <div class="pm-logo-pill">
                  <span class="pm-logo-text color-google">Google Pay</span>
                  <span class="pm-logo-sub">Android/Web</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom Authenticity Banner Strip with Image -->
          <div class="pm-banner-wrapper">
            <div class="pm-banner-thumb">
              <img src="/images/aamarpay-supported-methods.jpg" alt="Aamarpay Official Channels: bKash, Nagad, Visa, Mastercard, DBBL Nexus, Rocket" loading="lazy" onerror="this.style.display='none'">
              <div>
                <strong style="font-size:0.86rem; color:var(--navy); display:block;">100% Official Payment Processing</strong>
                <span style="font-size:0.78rem; color:var(--muted);">All transactions are processed through SSL encrypted, Bangladesh Bank authorized payment switches.</span>
              </div>
            </div>
            <span style="font-size:0.78rem; font-weight:700; color:#15803d; background:#eefaf0; border:1px solid #c7eed0; padding:4px 10px; border-radius:999px;">
              ✓ Instant Test Pass Activation
            </span>
          </div>
        </section>
`;

// Insert paymentSectionHtml right before <!-- Trust & Security Strip -->
html = html.replace('<!-- Trust & Security Strip -->', paymentSectionHtml + '\n        <!-- Trust & Security Strip -->');

// 3. Update JavaScript to toggle payment methods view when region switches
const oldSetRegionJs = `    function setRegion(region) {
      currentRegion = region;
      document.getElementById('btn-region-bd').classList.toggle('active', region === 'BD');
      document.getElementById('btn-region-global').classList.toggle('active', region === 'GLOBAL');
      renderPricing();
    }`;

const newSetRegionJs = `    function setRegion(region) {
      currentRegion = region;
      document.getElementById('btn-region-bd').classList.toggle('active', region === 'BD');
      document.getElementById('btn-region-global').classList.toggle('active', region === 'GLOBAL');
      
      // Update Payment Methods view
      const isBD = region === 'BD';
      const bdContainer = document.getElementById('pm-container-bd');
      const globalContainer = document.getElementById('pm-container-global');
      const badge = document.getElementById('pm-gateway-badge');
      const title = document.getElementById('pm-gateway-title');
      const desc = document.getElementById('pm-desc-text');

      if (bdContainer && globalContainer) {
        bdContainer.style.display = isBD ? 'grid' : 'none';
        globalContainer.style.display = isBD ? 'none' : 'grid';
      }

      if (badge && title && desc) {
        if (isBD) {
          badge.className = 'pm-gateway-badge aamarpay';
          title.textContent = 'Official Gateway: Aamarpay';
          desc.textContent = 'Pay securely using any Bangladeshi mobile wallet (bKash, Nagad, Rocket, Upay), local debit/credit card, or internet banking.';
        } else {
          badge.className = 'pm-gateway-badge';
          title.textContent = 'Official Gateway: Paddle';
          desc.textContent = 'Pay securely from outside Bangladesh with international credit/debit cards, PayPal, Apple Pay, or Google Pay.';
        }
      }

      renderPricing();
    }`;

html = html.replace(oldSetRegionJs, newSetRegionJs);

fs.writeFileSync(filePath, html, 'utf8');
console.log('FrontPage/Frontend/pricing.html updated with payment methods!');

// Also copy to public/pricing.html
const publicPath = path.join(__dirname, '..', 'public', 'pricing.html');
fs.writeFileSync(publicPath, html, 'utf8');
console.log('public/pricing.html synchronized successfully!');
