const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '../FrontPage/Frontend/pricing.html'),
  path.join(__dirname, '../public/pricing.html')
];

const cssToAdd = `
    /* === Enhanced Official Payment Logos Grid === */
    .pm-boxes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .pm-box {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 22px 20px;
      box-shadow: 0 4px 16px rgba(11, 43, 82, 0.04);
      display: flex;
      flex-direction: column;
    }
    .pm-box-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f1f5f9;
    }
    .pm-box-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      font-size: 0.96rem;
      color: var(--navy);
    }
    .pm-box-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .pm-logos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
      gap: 12px;
      align-items: stretch;
    }
    .pm-logo-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fafbfc;
      border: 1.5px solid #e8ecf2;
      border-radius: 12px;
      padding: 10px 8px 8px;
      min-height: 84px;
      text-align: center;
      transition: all 0.22s ease-in-out;
      position: relative;
    }
    .pm-logo-tile:hover {
      background: #ffffff;
      border-color: #cbd5e1;
      box-shadow: 0 6px 14px rgba(11, 43, 82, 0.07);
      transform: translateY(-2px);
    }
    .pm-logo-img-wrap {
      height: 42px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
    }
    .pm-logo-img-wrap img {
      max-height: 38px;
      max-width: 88px;
      width: auto;
      height: auto;
      object-fit: contain;
      filter: contrast(1.02);
      transition: transform 0.2s ease;
    }
    .pm-logo-tile:hover .pm-logo-img-wrap img {
      transform: scale(1.05);
    }
    .pm-logo-title {
      font-size: 0.74rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.1;
      margin-top: auto;
    }
    .pm-logo-tag {
      font-size: 0.64rem;
      color: #64748b;
      font-weight: 500;
      margin-top: 2px;
    }
    .pm-official-banner-card {
      margin-top: 20px;
      background: #ffffff;
      border: 1.5px solid #fed7aa;
      border-radius: 14px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      background: linear-gradient(135deg, #fffaf5 0%, #ffffff 100%);
    }
    .pm-official-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .pm-official-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #fff0eb;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ea580c;
      flex-shrink: 0;
    }
    .pm-official-texts h4 {
      margin: 0;
      font-size: 0.92rem;
      font-weight: 800;
      color: var(--navy);
    }
    .pm-official-texts p {
      margin: 3px 0 0;
      font-size: 0.78rem;
      color: #64748b;
      line-height: 1.4;
    }
    .pm-official-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      font-size: 0.76rem;
      font-weight: 700;
      white-space: nowrap;
      flex-shrink: 0;
    }

    @media (max-width: 900px) {
      .pm-boxes-grid {
        grid-template-columns: 1fr;
      }
      .pm-official-banner-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }
`;

const updatedPaymentSectionHtml = `
        <!-- Payment Methods Visual Section with Real Official Brand Logos -->
        <section class="payment-methods-sec" id="paymentMethodsSection" aria-label="Accepted payment methods">
          <div class="pm-header">
            <div class="pm-title-wrap">
              <h3>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--red)"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <span>Supported Payment Methods &amp; Official Logos</span>
              </h3>
              <p id="pm-desc-text">Pay securely using any Bangladeshi mobile wallet (bKash, Nagad, Rocket, Upay), local debit/credit card, or internet banking.</p>
            </div>
            <div class="pm-gateway-badge aamarpay" id="pm-gateway-badge">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span id="pm-gateway-title">Official Gateway: Aamarpay</span>
            </div>
          </div>

          <!-- Container for Bangladesh (Aamarpay - Original Official Logos) -->
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

              <div class="pm-logos-grid">
                <!-- VISA -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-visa.png" alt="VISA Card" loading="lazy">
                  </div>
                  <span class="pm-logo-title">VISA</span>
                  <span class="pm-logo-tag">Debit / Credit</span>
                </div>

                <!-- Mastercard -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-mastercard.png" alt="Mastercard" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Mastercard</span>
                  <span class="pm-logo-tag">Global Cards</span>
                </div>

                <!-- AMEX -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-amex.png" alt="American Express" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Amex</span>
                  <span class="pm-logo-tag">American Express</span>
                </div>

                <!-- DBBL Nexus -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-dbbl.png" alt="DBBL Nexus" loading="lazy">
                  </div>
                  <span class="pm-logo-title">DBBL</span>
                  <span class="pm-logo-tag">Nexus Card</span>
                </div>

                <!-- Discover -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-discover.png" alt="Discover Network" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Discover</span>
                  <span class="pm-logo-tag">Network</span>
                </div>

                <!-- UnionPay -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-unionpay.png" alt="UnionPay" loading="lazy">
                  </div>
                  <span class="pm-logo-title">UnionPay</span>
                  <span class="pm-logo-tag">银联卡</span>
                </div>

                <!-- Q-Cash -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-qcash.png" alt="Q-Cash" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Q-Cash</span>
                  <span class="pm-logo-tag">ATM / POS</span>
                </div>
              </div>
            </div>

            <!-- Box 2: Major Mobile Wallet Methods (MFS) -->
            <div class="pm-box">
              <div class="pm-box-head">
                <div class="pm-box-title">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 18h.01"/><rect x="5" y="2" width="14" height="20" rx="3"/></svg>
                  <span>Major Mobile Wallet Methods</span>
                </div>
                <span class="pm-box-badge" style="background:#fdecee; color:#e0202d; border-color:#fca5a5;">MFS Instant</span>
              </div>

              <div class="pm-logos-grid">
                <!-- bKash -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-bkash.png" alt="bKash বিকাশ" loading="lazy">
                  </div>
                  <span class="pm-logo-title">bKash</span>
                  <span class="pm-logo-tag">বিকাশ</span>
                </div>

                <!-- Nagad -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-nagad.png" alt="Nagad নগদ" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Nagad</span>
                  <span class="pm-logo-tag">নগদ</span>
                </div>

                <!-- Rocket -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-rocket.png" alt="Rocket রকেট" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Rocket</span>
                  <span class="pm-logo-tag">রকেট (DBBL)</span>
                </div>

                <!-- Upay -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-upay.png" alt="upay উপায়" loading="lazy">
                  </div>
                  <span class="pm-logo-title">upay</span>
                  <span class="pm-logo-tag">উপায় (UCB)</span>
                </div>

                <!-- TAP -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-tap.png" alt="tap Trust Axiata" loading="lazy">
                  </div>
                  <span class="pm-logo-title">tap</span>
                  <span class="pm-logo-tag">Trust Axiata</span>
                </div>

                <!-- OK Wallet -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-okwallet.png" alt="OK Wallet" loading="lazy">
                  </div>
                  <span class="pm-logo-title">OK Wallet</span>
                  <span class="pm-logo-tag">ONE Bank</span>
                </div>

                <!-- SureCash -->
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-surecash.png" alt="SureCash শিওরক্যাশ" loading="lazy">
                  </div>
                  <span class="pm-logo-title">SureCash</span>
                  <span class="pm-logo-tag">শিওরক্যাশ</span>
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
                <span class="pm-box-badge">Worldwide</span>
              </div>

              <div class="pm-logos-grid">
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-visa.png" alt="VISA" loading="lazy">
                  </div>
                  <span class="pm-logo-title">VISA</span>
                  <span class="pm-logo-tag">International</span>
                </div>
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-mastercard.png" alt="Mastercard" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Mastercard</span>
                  <span class="pm-logo-tag">Worldwide</span>
                </div>
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-amex.png" alt="Amex" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Amex</span>
                  <span class="pm-logo-tag">American Express</span>
                </div>
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-discover.png" alt="Discover" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Discover</span>
                  <span class="pm-logo-tag">Network</span>
                </div>
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-unionpay.png" alt="UnionPay" loading="lazy">
                  </div>
                  <span class="pm-logo-title">UnionPay</span>
                  <span class="pm-logo-tag">Global</span>
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

              <div class="pm-logos-grid">
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-paypal.svg" alt="PayPal" loading="lazy">
                  </div>
                  <span class="pm-logo-title">PayPal</span>
                  <span class="pm-logo-tag">Checkout</span>
                </div>
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-applepay.svg" alt="Apple Pay" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Apple Pay</span>
                  <span class="pm-logo-tag">iOS / Mac</span>
                </div>
                <div class="pm-logo-tile">
                  <div class="pm-logo-img-wrap">
                    <img src="/images/payment-logos/logo-googlepay.svg" alt="Google Pay" loading="lazy">
                  </div>
                  <span class="pm-logo-title">Google Pay</span>
                  <span class="pm-logo-tag">Android / Chrome</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom Authenticity Banner Strip with Original Graphic -->
          <div class="pm-official-banner-card">
            <div class="pm-official-info">
              <div class="pm-official-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="pm-official-texts">
                <h4>Authentic 256-bit SSL Encrypted Payment</h4>
                <p>All transactions are verified directly by Bangladesh Bank approved payment processor (Aamarpay) &amp; global merchant of record (Paddle). Your card details are never stored.</p>
              </div>
            </div>
            <div class="pm-official-badge">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Instant Auto-Activation</span>
            </div>
          </div>
        </section>
`;

targetFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace existing paymentMethodsSection
  const startSec = content.indexOf('<section class="payment-methods-sec"');
  if (startSec !== -1) {
    const endSec = content.indexOf('</section>', startSec);
    if (endSec !== -1) {
      content = content.substring(0, startSec) + updatedPaymentSectionHtml.trim() + content.substring(endSec + 10);
    }
  }

  // Inject or update CSS
  if (content.includes('/* === Enhanced Official Payment Logos Grid === */')) {
    // replace existing
    const cssStart = content.indexOf('/* === Enhanced Official Payment Logos Grid === */');
    const cssEnd = content.indexOf('</style>', cssStart);
    content = content.substring(0, cssStart) + cssToAdd.trim() + '\n    ' + content.substring(cssEnd);
  } else {
    // add before </style>
    content = content.replace('</style>', `${cssToAdd}\n    </style>`);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated:', file);
});

