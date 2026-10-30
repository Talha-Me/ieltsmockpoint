/* auth-nav.js
 * Ek jaygay likha shared script. Jei page e ei script ache, shei page er navbar e
 * (.nav-actions) ar mobile sidebar e (.sb-actions) login korle "Sign in / Start free"
 * er jaygay profile + Logout dekhabe. Login na thakle kichu-i change kore na.
 */
(function () {
  if (window.__authNavLoaded) return;
  window.__authNavLoaded = true;

  var css =
    ".an-wrap{position:relative;display:flex;align-items:center}" +
    ".an-btn{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid var(--line,#e3e9f3);border-radius:999px;padding:4px 14px 4px 4px;cursor:pointer;font-family:inherit;color:var(--navy,#0b2b52);font-weight:700;font-size:.9rem;transition:border-color .2s,box-shadow .2s}" +
    ".an-btn:hover{border-color:var(--blue,#1565c9);box-shadow:0 6px 16px rgba(21,101,201,.14)}" +
    ".an-av{width:36px;height:36px;border-radius:50%;background:var(--navy,#0b2b52);color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-weight:800;font-size:.95rem;overflow:hidden;flex:none}" +
    ".an-av img{width:100%;height:100%;object-fit:cover;display:block}" +
    ".an-name{max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".an-menu{position:absolute;right:0;top:calc(100% + 10px);min-width:230px;background:#fff;border:1.5px solid var(--line,#e3e9f3);border-radius:16px;box-shadow:0 20px 44px rgba(11,43,82,.18);padding:14px;z-index:120;display:none}" +
    ".an-menu.open{display:block}" +
    ".an-info{padding:4px 6px 12px;border-bottom:1px solid var(--line,#e3e9f3);margin-bottom:10px}" +
    ".an-info b{display:block;color:var(--navy,#0b2b52);font-size:.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".an-info span{display:block;color:var(--muted,#5d708c);font-size:.8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px}" +
    ".an-out{width:100%;padding:11px 14px;border:none;border-radius:10px;background:var(--red,#e0202d);color:#fff;font-family:inherit;font-weight:700;font-size:.9rem;cursor:pointer;transition:background .2s}" +
    ".an-out:hover{background:var(--red-dark,#b5121d)}" +
    ".an-side{display:grid;gap:12px}" +
    ".an-side .an-row{display:flex;align-items:center;gap:12px}" +
    ".an-side .an-info{border:none;padding:0;margin:0;min-width:0}" +
    "@media(max-width:600px){.an-name{display:none}.an-btn{padding:4px}}";

  function addStyle() {
    if (document.getElementById("an-style")) return;
    var s = document.createElement("style");
    s.id = "an-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function avatarHtml(u) {
    if (u.avatar) return '<img src="' + esc(u.avatar) + '" alt="" referrerpolicy="no-referrer">';
    var n = (u.name || u.email || "?").trim();
    return esc(n.charAt(0).toUpperCase());
  }

  function firstName(u) {
    return (u.name || u.email || "Account").trim().split(/\s+/)[0];
  }

  function logout() {
    fetch("/logout", { method: "POST", credentials: "same-origin" })
      .catch(function () {})
      .then(function () {
        try {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        } catch (e) {}
        window.location.href = "/";
      });
  }

  function render(user) {
    addStyle();

    // Desktop navbar
    document.querySelectorAll(".nav-actions").forEach(function (box) {
      box.innerHTML =
        '<div class="an-wrap">' +
        '<button type="button" class="an-btn" aria-haspopup="true" aria-expanded="false">' +
        '<span class="an-av">' + avatarHtml(user) + "</span>" +
        '<span class="an-name">' + esc(firstName(user)) + "</span></button>" +
        '<div class="an-menu" role="menu">' +
        '<div class="an-info"><b>' + esc(user.name || "My account") + "</b><span>" + esc(user.email || "") + "</span></div>" +
        '<button type="button" class="an-out">Log out</button>' +
        "</div></div>";

      var btn = box.querySelector(".an-btn");
      var menu = box.querySelector(".an-menu");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = menu.classList.toggle("open");
        btn.setAttribute("aria-expanded", open);
      });
      menu.addEventListener("click", function (e) { e.stopPropagation(); });
      box.querySelector(".an-out").addEventListener("click", logout);
    });

    // Mobile sidebar
    document.querySelectorAll(".sb-actions").forEach(function (box) {
      box.innerHTML =
        '<div class="an-side">' +
        '<div class="an-row"><span class="an-av">' + avatarHtml(user) + "</span>" +
        '<div class="an-info"><b>' + esc(user.name || "My account") + "</b><span>" + esc(user.email || "") + "</span></div></div>" +
        '<button type="button" class="an-out">Log out</button></div>';
      box.querySelector(".an-out").addEventListener("click", logout);
    });

    document.addEventListener("click", function () {
      document.querySelectorAll(".an-menu.open").forEach(function (m) { m.classList.remove("open"); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.querySelectorAll(".an-menu.open").forEach(function (m) { m.classList.remove("open"); });
      }
    });
  }

  function start() {
    var rendered = false;

    // 1) cached user thakle sathe sathe dekhai (flicker kombe)
    try {
      var cached = JSON.parse(localStorage.getItem("user") || "null");
      if (cached && (cached.name || cached.email)) {
        render(cached);
        rendered = true;
      }
    } catch (e) {}

    // 2) server theke asol session verify kori
    fetch("/auth/me", { credentials: "same-origin" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && data.user) {
          try { localStorage.setItem("user", JSON.stringify(data.user)); } catch (e) {}
          if (!rendered) render(data.user);
        } else if (rendered) {
          // session shesh, cached user ar valid na
          try { localStorage.removeItem("user"); localStorage.removeItem("token"); } catch (e) {}
          window.location.reload();
        }
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();