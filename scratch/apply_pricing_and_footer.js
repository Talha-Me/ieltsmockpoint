const fs = require('fs');
const path = require('path');

// 1. Update app.js
const appPath = path.join(__dirname, '..', 'app.js');
let appCode = fs.readFileSync(appPath, 'utf8');

// Add /pricing route before /dashboard
if (!appCode.includes('app.get(["/pricing"')) {
  const targetSnippet = 'app.get(["/dashboard", "/student-dashboard", "/candidate-dashboard"], (req, res) => {';
  const newRoute = `app.get(["/pricing", "/pricing.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "FrontPage", "Frontend", "pricing.html"));
});\n\n`;
  appCode = appCode.replace(targetSnippet, newRoute + targetSnippet);
  console.log('Added /pricing route to app.js');
}

// Add /pricing to sitemap staticPages
if (!appCode.includes("{ url: '/pricing', priority: '0.9'")) {
  appCode = appCode.replace(
    "{ url: '/practice-hub', priority: '0.9', changefreq: 'weekly' },",
    "{ url: '/practice-hub', priority: '0.9', changefreq: 'weekly' },\n      { url: '/pricing', priority: '0.9', changefreq: 'weekly' },"
  );
  console.log('Added /pricing to sitemap in app.js');
}

fs.writeFileSync(appPath, appCode, 'utf8');

// 2. Update footers
const footerPricingLinkHtml = `<a href="/pricing" class="footer-pricing-link" id="footer-pricing-link" style="display:none; color:var(--red,#e0202d); font-weight:700;">Plans &amp; Pricing <span style="font-size:0.68rem; background:#fdecee; color:#e0202d; padding:2px 7px; border-radius:99px; border:1px solid #fecaca; margin-left:4px; font-weight:800;">PASS</span></a>\n        <a href="/about.html">About Us</a>`;

const footerScript = `
<script>
(function() {
  function syncFooterPricingLink() {
    fetch('/api/system-settings')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d && d.success && d.settings) {
          var isPhase3 = Number(d.settings.currentPhase) === 3;
          var els = document.querySelectorAll('.footer-pricing-link, #footer-pricing-link');
          els.forEach(function(el) {
            el.style.display = isPhase3 ? 'inline-flex' : 'none';
            if (isPhase3) el.style.alignItems = 'center';
          });
        }
      })
      .catch(function() {});
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncFooterPricingLink);
  } else {
    syncFooterPricingLink();
  }
})();
</script>
`;

function updateFooter(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('footer-pricing-link')) {
    content = content.replace('<a href="/about.html">About Us</a>', footerPricingLinkHtml);
  }
  if (!content.includes('syncFooterPricingLink')) {
    content += '\n' + footerScript;
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated footer:', path.basename(filePath));
}

updateFooter(path.join(__dirname, '..', 'FrontPage', 'Frontend', 'footer.html'));
if (fs.existsSync(path.join(__dirname, '..', 'public', 'footer.html'))) {
  updateFooter(path.join(__dirname, '..', 'public', 'footer.html'));
}

// 3. Update shared-layout.js
function updateSharedLayout(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('syncFooterPricingLinkShared')) {
    const hook = `
  function syncFooterPricingLinkShared() {
    fetch('/api/system-settings')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d && d.success && d.settings) {
          var isPhase3 = Number(d.settings.currentPhase) === 3;
          var els = document.querySelectorAll('.footer-pricing-link, #footer-pricing-link');
          els.forEach(function(el) {
            el.style.display = isPhase3 ? 'inline-flex' : 'none';
            if (isPhase3) el.style.alignItems = 'center';
          });
        }
      }).catch(function() {});
  }
`;
    // Insert hook inside IIFE
    content = content.replace('var FOOTER_CACHE_KEY =', hook + '\n  var FOOTER_CACHE_KEY =');
    
    // Call in applyFooterHtml
    content = content.replace('applyFooterHtml(footerHtml);', 'applyFooterHtml(footerHtml);\n        syncFooterPricingLinkShared();');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated shared-layout:', path.basename(filePath));
  }
}

updateSharedLayout(path.join(__dirname, '..', 'FrontPage', 'Frontend', 'shared-layout.js'));
if (fs.existsSync(path.join(__dirname, '..', 'public', 'shared-layout.js'))) {
  updateSharedLayout(path.join(__dirname, '..', 'public', 'shared-layout.js'));
}

console.log('All pricing and footer configurations completed successfully!');
