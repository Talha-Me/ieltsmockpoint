/**
 * IELTS Mock Point - Guest Test Pre-flight Recommendation Modal
 * Ultra-Responsive, Bespoke Vector UI matching official Cambridge/IDP exam standards.
 * 100% device-adaptive: mobile (320px+), tablet, laptop, desktop, landscape & portrait.
 */
(function () {
  // 1. Check if candidate is already authenticated
  function isUserLoggedIn() {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (u && (u.email || u.name || u.id)) return true;
    } catch (e) {}
    return false;
  }

  // 2. Do not show if already logged in or dismissed during this session
  if (isUserLoggedIn()) return;
  if (sessionStorage.getItem("guest_test_modal_dismissed") === "true") return;

  function initGuestModal() {
    if (document.getElementById("guestTestModalOverlay")) return;
    if (isUserLoggedIn()) return;

    // Inject Ultra-Clean Responsive Styles
    const styleEl = document.createElement("style");
    styleEl.id = "guestTestModalStyles";
    styleEl.textContent = `
      #guestTestModalOverlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(7, 28, 54, 0.78);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: max(16px, env(safe-area-inset-top)) max(14px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(14px, env(safe-area-inset-left));
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s ease;
        box-sizing: border-box;
      }
      #guestTestModalOverlay.active {
        opacity: 1;
        visibility: visible;
      }
      .gtm-card {
        background: #ffffff;
        border-radius: clamp(18px, 4vw, 24px);
        width: 100%;
        max-width: 510px;
        max-height: min(92vh, 92dvh);
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: clamp(20px, 4.5vw, 32px) clamp(16px, 4vw, 28px) clamp(18px, 3.5vw, 24px);
        box-shadow: 
          0 25px 60px -15px rgba(11, 43, 82, 0.45),
          0 0 0 1px rgba(11, 43, 82, 0.08),
          0 1px 3px rgba(0, 0, 0, 0.05);
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        color: #1e293b;
        transform: scale(0.92) translateY(18px);
        transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        text-align: center;
        box-sizing: border-box;
      }
      #guestTestModalOverlay.active .gtm-card {
        transform: scale(1) translateY(0);
      }
      /* Custom Smooth Slim Scrollbar for small screens */
      .gtm-card::-webkit-scrollbar {
        width: 5px;
      }
      .gtm-card::-webkit-scrollbar-track {
        background: transparent;
      }
      .gtm-card::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 999px;
      }
      .gtm-card::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      /* Top Ambient Radial Glow */
      .gtm-card::before {
        content: '';
        position: absolute;
        top: -70px;
        left: 50%;
        transform: translateX(-50%);
        width: 260px;
        height: 140px;
        background: radial-gradient(ellipse at center, rgba(21, 101, 201, 0.16), transparent 70%);
        pointer-events: none;
        z-index: 0;
      }
      .gtm-close-btn {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 36px;
        height: 36px;
        min-width: 36px;
        min-height: 36px;
        border-radius: 50%;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 3;
        padding: 0;
        touch-action: manipulation;
      }
      .gtm-close-btn:hover {
        background: #f1f5f9;
        color: #0b2b52;
        border-color: #cbd5e1;
        transform: rotate(90deg);
      }
      /* Floating Hero Emblem */
      .gtm-emblem-wrap {
        position: relative;
        z-index: 1;
        margin: 0 auto clamp(10px, 2.5vw, 15px);
        width: clamp(50px, 12vw, 64px);
        height: clamp(50px, 12vw, 64px);
        border-radius: clamp(16px, 3.5vw, 20px);
        background: linear-gradient(135deg, #0b2b52 0%, #1565c9 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        box-shadow: 
          0 10px 24px rgba(21, 101, 201, 0.32),
          0 0 0 5px rgba(21, 101, 201, 0.08);
      }
      .gtm-emblem-wrap svg {
        width: clamp(24px, 6vw, 30px);
        height: clamp(24px, 6vw, 30px);
      }
      /* Advisory Pill */
      .gtm-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: clamp(0.70rem, 2vw, 0.74rem);
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 3.5px 11px;
        border-radius: 999px;
        background: #f0f7ff;
        color: #1565c9;
        border: 1px solid #cfe2fe;
        margin-bottom: clamp(8px, 2vw, 12px);
        position: relative;
        z-index: 1;
      }
      .gtm-title {
        font-family: 'Sora', sans-serif;
        font-size: clamp(1.20rem, 3.8vw, 1.42rem);
        font-weight: 800;
        color: #0b2b52;
        line-height: 1.25;
        margin: 0 0 6px 0;
        position: relative;
        z-index: 1;
      }
      .gtm-lead {
        font-size: clamp(0.82rem, 2.4vw, 0.90rem);
        color: #64748b;
        line-height: 1.48;
        margin: 0 auto clamp(14px, 3vw, 18px);
        max-width: 44ch;
        position: relative;
        z-index: 1;
      }
      /* Feature Value Cards Stack */
      .gtm-features-stack {
        display: flex;
        flex-direction: column;
        gap: clamp(8px, 1.8vw, 10px);
        text-align: left;
        margin-bottom: clamp(12px, 2.5vw, 16px);
        position: relative;
        z-index: 1;
      }
      .gtm-feat-row {
        display: flex;
        align-items: center;
        gap: clamp(10px, 2.5vw, 12px);
        background: #f8fafc;
        border: 1.2px solid #edf2f7;
        padding: clamp(8px, 2vw, 11px) clamp(10px, 2.5vw, 13px);
        border-radius: 12px;
        transition: border-color 0.2s, background 0.2s;
      }
      .gtm-feat-row:hover {
        background: #f1f7ff;
        border-color: #bcd9fb;
      }
      .gtm-feat-icon {
        width: clamp(32px, 7vw, 36px);
        height: clamp(32px, 7vw, 36px);
        min-width: clamp(32px, 7vw, 36px);
        border-radius: 10px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1565c9;
        flex-shrink: 0;
        box-shadow: 0 2px 5px rgba(11, 43, 82, 0.05);
      }
      .gtm-feat-icon svg {
        width: clamp(16px, 3.8vw, 18px);
        height: clamp(16px, 3.8vw, 18px);
      }
      .gtm-feat-content {
        flex: 1;
        min-width: 0;
      }
      .gtm-feat-title {
        font-size: clamp(0.80rem, 2.3vw, 0.86rem);
        font-weight: 800;
        color: #0b2b52;
        margin-bottom: 2px;
        line-height: 1.2;
      }
      .gtm-feat-desc {
        font-size: clamp(0.72rem, 2vw, 0.77rem);
        color: #64748b;
        line-height: 1.34;
      }
      /* Guest Notice Pill Strip */
      .gtm-guest-notice {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #fff8f8;
        border: 1px solid #fed7d7;
        color: #9b2c2c;
        font-size: clamp(0.72rem, 2vw, 0.76rem);
        font-weight: 600;
        padding: clamp(7px, 1.8vw, 8px) clamp(10px, 2.2vw, 12px);
        border-radius: 10px;
        margin-bottom: clamp(14px, 3vw, 18px);
        text-align: left;
        line-height: 1.35;
      }
      .gtm-guest-notice svg {
        flex-shrink: 0;
        color: #e0202d;
        width: 15px;
        height: 15px;
      }
      /* Action Buttons */
      .gtm-actions {
        display: flex;
        flex-direction: column;
        gap: 9px;
        position: relative;
        z-index: 1;
      }
      .gtm-btn-primary {
        background: linear-gradient(135deg, #0b2b52 0%, #1565c9 100%);
        color: #ffffff !important;
        border: none;
        padding: clamp(11px, 2.6vw, 13px) clamp(16px, 3vw, 20px);
        border-radius: 12px;
        font-size: clamp(0.88rem, 2.5vw, 0.94rem);
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 
          0 1px 0 rgba(255, 255, 255, 0.25) inset,
          0 8px 22px rgba(21, 101, 201, 0.32);
        transition: transform 0.2s, box-shadow 0.2s;
        text-decoration: none;
        width: 100%;
        min-height: 44px;
        box-sizing: border-box;
        touch-action: manipulation;
      }
      .gtm-btn-primary:hover {
        transform: translateY(-1.5px);
        box-shadow: 
          0 1px 0 rgba(255, 255, 255, 0.3) inset,
          0 12px 28px rgba(21, 101, 201, 0.42);
      }
      .gtm-btn-primary:active {
        transform: translateY(0);
      }
      .gtm-btn-primary svg {
        transition: transform 0.2s ease;
        flex-shrink: 0;
      }
      .gtm-btn-primary:hover svg.gtm-arrow {
        transform: translateX(4px);
      }
      .gtm-btn-ghost {
        background: #ffffff;
        color: #475569;
        border: 1.5px solid #e2e8f0;
        padding: clamp(9px, 2.2vw, 11px) clamp(14px, 2.8vw, 16px);
        border-radius: 12px;
        font-size: clamp(0.82rem, 2.2vw, 0.88rem);
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.2s ease;
        width: 100%;
        min-height: 42px;
        box-sizing: border-box;
        touch-action: manipulation;
      }
      .gtm-btn-ghost:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
        color: #0b2b52;
      }
      /* Footer Trust & Session Strip */
      .gtm-footer-meta {
        margin-top: clamp(10px, 2.2vw, 14px);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: clamp(7px, 1.8vw, 9px);
        font-size: clamp(0.72rem, 1.9vw, 0.77rem);
        color: #94a3b8;
        position: relative;
        z-index: 1;
      }
      .gtm-trust-row {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: clamp(6px, 1.8vw, 10px);
        color: #64748b;
        font-weight: 600;
      }
      .gtm-trust-item {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      }
      .gtm-trust-item svg {
        color: #10b981;
        width: 13px;
        height: 13px;
        flex-shrink: 0;
      }
      .gtm-chk-wrap {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
        padding: 3px 0;
        touch-action: manipulation;
      }
      .gtm-chk-wrap input {
        cursor: pointer;
        accent-color: #0b2b52;
        width: 14px;
        height: 14px;
        margin: 0;
      }
      .gtm-chk-wrap span {
        line-height: 1.25;
      }

      /* Responsive sizing rules for Mobile & Short Screens */
      @media (max-width: 480px), (max-height: 720px) {
        #guestTestModalOverlay {
          padding: 12px 10px;
        }
        .gtm-card {
          padding: 16px 14px 12px;
          border-radius: 18px;
          max-height: min(94vh, 94dvh);
        }
        .gtm-close-btn {
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          min-width: 28px;
          min-height: 28px;
        }
        .gtm-close-btn svg {
          width: 14px;
          height: 14px;
        }
        .gtm-emblem-wrap {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          margin-bottom: 6px;
          box-shadow: 0 6px 16px rgba(21, 101, 201, 0.25);
        }
        .gtm-emblem-wrap svg {
          width: 19px;
          height: 19px;
        }
        .gtm-pill {
          margin-bottom: 4px;
          padding: 2px 8px;
          font-size: 0.65rem;
          gap: 4px;
        }
        .gtm-pill svg {
          width: 10px;
          height: 10px;
        }
        .gtm-title {
          font-size: 1.10rem;
          margin-bottom: 3px;
          line-height: 1.22;
        }
        .gtm-lead {
          font-size: 0.75rem;
          line-height: 1.34;
          margin-bottom: 8px;
          max-width: 38ch;
        }
        .gtm-features-stack {
          gap: 5px;
          margin-bottom: 8px;
        }
        .gtm-feat-row {
          padding: 5px 8px;
          gap: 8px;
          border-radius: 9px;
        }
        .gtm-feat-icon {
          width: 26px;
          height: 26px;
          min-width: 26px;
          border-radius: 7px;
        }
        .gtm-feat-icon svg {
          width: 14px;
          height: 14px;
        }
        .gtm-feat-title {
          font-size: 0.78rem;
          margin-bottom: 1px;
        }
        .gtm-feat-desc {
          font-size: 0.68rem;
          line-height: 1.22;
        }
        .gtm-guest-notice {
          padding: 4px 8px;
          margin-bottom: 8px;
          font-size: 0.68rem;
          gap: 5px;
          line-height: 1.25;
          border-radius: 8px;
        }
        .gtm-guest-notice svg {
          width: 13px;
          height: 13px;
        }
        .gtm-actions {
          gap: 6px;
        }
        .gtm-btn-primary {
          padding: 9px 12px;
          min-height: 38px;
          font-size: 0.85rem;
          border-radius: 10px;
          gap: 6px;
        }
        .gtm-btn-primary svg {
          width: 15px;
          height: 15px;
        }
        .gtm-btn-ghost {
          padding: 7px 10px;
          min-height: 34px;
          font-size: 0.78rem;
          border-radius: 10px;
        }
        .gtm-footer-meta {
          margin-top: 6px;
          gap: 4px;
          font-size: 0.68rem;
        }
        .gtm-trust-row {
          gap: 6px;
          font-size: 0.68rem;
        }
        .gtm-trust-item svg {
          width: 11px;
          height: 11px;
        }
        .gtm-chk-wrap {
          gap: 5px;
          font-size: 0.68rem;
          padding: 1px 0;
        }
        .gtm-chk-wrap input {
          width: 12px;
          height: 12px;
        }
      }
    `;
    document.head.appendChild(styleEl);

    // Build Modal HTML
    const overlayEl = document.createElement("div");
    overlayEl.id = "guestTestModalOverlay";
    overlayEl.setAttribute("role", "dialog");
    overlayEl.setAttribute("aria-modal", "true");

    const currentUrl = window.location.pathname + window.location.search;
    const loginRedirectUrl = "/login?redirect=" + encodeURIComponent(currentUrl);

    overlayEl.innerHTML = `
      <div class="gtm-card">
        <button type="button" class="gtm-close-btn" id="gtmBtnCloseX" aria-label="Close dialog">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <!-- Official Vector Emblem -->
        <div class="gtm-emblem-wrap">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>

        <div class="gtm-pill">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>Candidate Advisory</span>
        </div>

        <h3 class="gtm-title">Save Your IELTS Progress &amp; Scores</h3>
        <p class="gtm-lead">
          Sign in or create a free candidate profile to automatically preserve your test answers, band calculations, and progress history.
        </p>

        <!-- Feature Rows with Native Vector Graphics -->
        <div class="gtm-features-stack">
          <!-- Feature 1: Cloud Auto-Save -->
          <div class="gtm-feat-row">
            <div class="gtm-feat-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                <polyline points="12 13 14 15 18 11"/>
              </svg>
            </div>
            <div class="gtm-feat-content">
              <div class="gtm-feat-title">60-Second Real-Time Cloud Save</div>
              <div class="gtm-feat-desc">Draft answers auto-save every minute; resume seamlessly after accidental tab closure or power cuts.</div>
            </div>
          </div>

          <!-- Feature 2: Official Analytics -->
          <div class="gtm-feat-row">
            <div class="gtm-feat-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div class="gtm-feat-content">
              <div class="gtm-feat-title">Official Band Score Analytics</div>
              <div class="gtm-feat-desc">Detailed 1–40 question breakdown, Cambridge scoring criteria, and official answer explanations.</div>
            </div>
          </div>

          <!-- Feature 3: Dashboard History -->
          <div class="gtm-feat-row">
            <div class="gtm-feat-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="gtm-feat-content">
              <div class="gtm-feat-title">Permanent Dashboard Record</div>
              <div class="gtm-feat-desc">Test records timestamped with exact date and time to track your preparation journey.</div>
            </div>
          </div>
        </div>

        <!-- Guest Warning -->
        <div class="gtm-guest-notice">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span><b>Guest Notice:</b> In-progress answers and final scores are discarded when leaving without an account.</span>
        </div>

        <!-- Action CTAs -->
        <div class="gtm-actions">
          <a href="${loginRedirectUrl}" class="gtm-btn-primary" id="gtmBtnLogin">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span>Sign In / Create Free Account</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" class="gtm-arrow"><polyline points="9 18 15 12 9 6"/></svg>
          </a>

          <button type="button" class="gtm-btn-ghost" id="gtmBtnSkip">
            <span>Continue as Guest (Skip for Now)</span>
          </button>
        </div>

        <!-- Footer Meta: Trust & Session Checkbox -->
        <div class="gtm-footer-meta">
          <div class="gtm-trust-row">
            <span class="gtm-trust-item">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              100% Free Forever
            </span>
            <span>•</span>
            <span>Takes 10 Seconds</span>
            <span>•</span>
            <span class="gtm-trust-item">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              No Card Needed
            </span>
          </div>

          <label class="gtm-chk-wrap" for="gtmChkDontRemind">
            <input type="checkbox" id="gtmChkDontRemind">
            <span>Don't show again during this browser session</span>
          </label>
        </div>
      </div>
    `;

    document.body.appendChild(overlayEl);

    // Smooth entrance
    requestAnimationFrame(() => {
      overlayEl.classList.add("active");
    });

    // Dismiss Handler
    function dismissModal() {
      const chk = document.getElementById("gtmChkDontRemind");
      if (chk && chk.checked) {
        sessionStorage.setItem("guest_test_modal_dismissed", "true");
      }
      overlayEl.classList.remove("active");
      setTimeout(() => {
        if (overlayEl && overlayEl.parentNode) {
          overlayEl.parentNode.removeChild(overlayEl);
        }
      }, 350);
    }

    const skipBtn = document.getElementById("gtmBtnSkip");
    if (skipBtn) skipBtn.addEventListener("click", dismissModal);

    const closeXBtn = document.getElementById("gtmBtnCloseX");
    if (closeXBtn) closeXBtn.addEventListener("click", dismissModal);

    // Click backdrop to dismiss
    overlayEl.addEventListener("click", function (e) {
      if (e.target === overlayEl) dismissModal();
    });

    // Escape key dismiss
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlayEl.classList.contains("active")) {
        dismissModal();
      }
    });
  }

  // Delay slightly so the test page layout settles smoothly before prompt appears
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(initGuestModal, 500));
  } else {
    setTimeout(initGuestModal, 500);
  }
})();
