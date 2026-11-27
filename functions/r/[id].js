const CSS = `
*{box-sizing:border-box}
body{margin:0;min-height:100vh;padding:28px 18px 20px;display:flex;flex-direction:column;align-items:center;color:#fff;font-family:Montserrat,sans-serif;background:linear-gradient(180deg,#040a1c 0%,#06245e 55%,#0050c8 100%)}
.stars{margin:0 0 20px;font-size:46px;line-height:1;letter-spacing:4px}
.star-on{color:#ffe600;text-shadow:0 0 14px rgba(255,230,0,.6);animation:starPulse 2.4s ease-in-out infinite;display:inline-block}
.star-off{color:#fff;animation:starBlink 1.6s steps(2,start) infinite;display:inline-block}
.star-off:nth-child(4){animation-delay:.4s}
@keyframes starPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes starBlink{0%,100%{color:#fff;opacity:1}50%{color:#ffe600;opacity:.4}}
.card{position:relative;overflow:hidden;width:100%;max-width:440px;padding:28px 22px 24px;border-radius:22px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,#050d26 0%,#0a2a6e 55%,#0050c8 100%);box-shadow:0 20px 50px rgba(0,0,0,.45);text-align:center;animation:rise .9s ease-out both}
.card::before{content:"";position:absolute;inset:0;border-radius:22px;padding:1px;background:linear-gradient(120deg,transparent 30%,rgba(255,230,0,.85) 50%,transparent 70%);background-size:250% 100%;animation:borderSweep 4s linear infinite;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
@keyframes rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes borderSweep{0%{background-position:150% 0}100%{background-position:-150% 0}}
.shop{margin:0;font-family:"Playfair Display",serif;font-size:30px;font-weight:800;line-height:1.2;letter-spacing:.3px;cursor:pointer;user-select:none;-webkit-user-select:none;color:transparent;background:linear-gradient(90deg,#ffffff 0%,#ffe600 40%,#ffffff 60%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;animation:textShine 5s linear infinite}
@keyframes textShine{to{background-position:200% center}}
.sub{margin:12px 0 0;font-size:12px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:#9fb6e8}
.hours{display:flex;align-items:center;justify-content:center;gap:8px;margin:10px 0 0;font-size:13px;color:#d6e2ff}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block}
.dot.on{background:#25d366;box-shadow:0 0 8px #25d366;animation:blink 1.8s ease-in-out infinite}
.dot.off{background:#f87171;box-shadow:0 0 6px #f87171}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
.btn{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:flex-start;gap:14px;width:100%;padding:14px 18px;margin-top:12px;border-radius:14px;font-family:Montserrat,sans-serif;font-weight:600;font-size:15px;text-decoration:none;color:#fff;border:0;cursor:pointer;animation:glow 2.8s ease-in-out infinite;transition:transform .2s}
.btn:hover{transform:translateY(-2px)}
.btn::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent);transform:skewX(-20deg);animation:shine 3.5s ease-in-out infinite;pointer-events:none}
@keyframes shine{0%{left:-75%}60%,100%{left:125%}}
.ico{flex-shrink:0;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.95);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.ico svg{width:16px;height:16px}
.gold{background:linear-gradient(90deg,#d4a80c,#f5c518);color:#111;--glow:rgba(245,197,24,.75)}
.green{background:#25d366;--glow:rgba(37,211,102,.75)}
.insta{background:linear-gradient(90deg,#f58529,#dd2a7b,#8134af);--glow:rgba(221,42,123,.75)}
.fb{background:#1877f2;--glow:rgba(24,119,242,.75)}
.svc-btn{background:linear-gradient(90deg,#1e3a8a,#3b82f6);color:#fff;--glow:rgba(59,130,246,.75)}
.menu-btn{background:linear-gradient(90deg,#7c2d12,#c2410c 60%,#ea580c);color:#fff;--glow:rgba(234,88,12,.75)}
.btn-label{flex:1;text-align:center;padding-right:30px}
@keyframes glow{0%,100%{box-shadow:0 0 6px var(--glow)}50%{box-shadow:0 0 20px var(--glow)}}
.msg{margin:14px 0 0;padding:14px;border-radius:12px;background:rgba(255,230,0,.08);border:1px solid rgba(255,230,0,.45);color:#ffe600;font-size:14px;line-height:1.5}
.footer{margin-top:22px;font-size:12px;color:#7f93c4;text-align:center;letter-spacing:.3px}

/* Services panel */
.overlay{position:fixed;inset:0;background:rgba(2,6,20,.75);display:none;align-items:flex-end;justify-content:center;z-index:50;transition:background .3s}
.overlay.open{display:flex;animation:fadeIn .3s ease-out}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.sheet{display:flex;flex-direction:column;width:100%;max-width:440px;height:80vh;background:#071437;border-radius:24px 24px 0 0;border:1px solid rgba(255,230,0,.2);box-shadow:0 -10px 50px rgba(0,0,0,.6),0 0 30px rgba(255,230,0,.08);overflow:hidden;animation:up .45s cubic-bezier(.2,.8,.2,1)}
@keyframes up{from{transform:translateY(80px);opacity:0}to{transform:none;opacity:1}}
.sheet-head{flex:0 0 auto;padding:18px 22px 14px;text-align:center;border-bottom:1px solid rgba(120,160,255,.25);background:#071437;position:relative}
.sheet-head::after{content:"";position:absolute;left:15%;right:15%;bottom:-1px;height:2px;background:linear-gradient(90deg,transparent,#ffe600,transparent);background-size:200% 100%;animation:headGlow 3s linear infinite}
@keyframes headGlow{to{background-position:200% 0}}
.sheet-head .grip{width:44px;height:5px;border-radius:99px;background:rgba(255,255,255,.25);margin:0 auto 12px}
.sheet h3{margin:0;font-family:"Playfair Display",serif;font-size:24px;font-weight:800;color:#ffe600;text-shadow:0 0 18px rgba(255,230,0,.35)}
.sheet .sub2{margin:6px 0 0;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#9fb6e8}
.svc-list{flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px 20px;background:#071437}
.svc-list::-webkit-scrollbar{width:4px}
.svc-list::-webkit-scrollbar-thumb{background:rgba(255,230,0,.5);border-radius:99px}
.svc{position:relative;overflow:hidden;display:flex;gap:14px;align-items:center;padding:14px 16px;margin-bottom:12px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);font-size:15px;line-height:1.4;animation:svcIn .5s ease-out both;transition:transform .25s,border-color .25s,box-shadow .25s,background .25s}
.svc::before{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.18),transparent);transform:skewX(-20deg);animation:shine 4.5s ease-in-out infinite;pointer-events:none}
.svc:hover,.svc:active{transform:translateY(-3px) scale(1.01);border-color:rgba(255,230,0,.55);box-shadow:0 10px 26px rgba(255,230,0,.16);background:rgba(255,255,255,.1)}
@keyframes svcIn{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:none}}
.svc b{flex-shrink:0;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff6a8,#ffe600 55%,#d4a80c);color:#111;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 0 12px rgba(255,230,0,.5);animation:pop 2.4s ease-in-out infinite}
@keyframes pop{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
.svc span{position:relative;color:#f1f5ff}
.sheet-foot{flex:0 0 auto;padding:12px 20px 20px;border-top:1px solid rgba(120,160,255,.2);background:#071437}
.close{width:100%;padding:14px;border:0;border-radius:14px;background:linear-gradient(90deg,#d4a80c,#f5c518);color:#111;font-weight:700;font-size:15px;cursor:pointer;font-family:Montserrat,sans-serif;animation:glow 2.8s ease-in-out infinite;transition:transform .15s;--glow:rgba(245,197,24,.7)}
.close:active{transform:scale(.97)}
@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}
`;

// Small, same-size icons. Each sits inside a white badge so all brands look uniform.
const ICON = {
  maps: `<svg viewBox="0 0 24 24" fill="#d4a80c"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`,
  wa: `<svg viewBox="0 0 24 24" fill="#25d366"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c2.2.9 2.6.7 3.1.7a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c-.1-.1-.2-.2-.4-.3z"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" fill="none" stroke="#dd2a7b" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="#dd2a7b" stroke="none"/></svg>`,
  fb: `<svg viewBox="0 0 24 24" fill="#1877f2"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>`,
  svc: `<svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="#c2410c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M8 9h6M8 13h6"/></svg>`,
};

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// "10:30" -> "10:30 AM"
function fmtTime(t) {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return hh + ":" + String(m).padStart(2, "0") + " " + ap;
}

function toMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// info.hours expected shape: { mon:{o:"10:00",c:"22:00"}, ..., sun:null }
// Returns a short status line for the current time in India (IST)
function hoursLine(info) {
  const h = info.hours;
  if (!h || typeof h !== "object") return "";
  const keys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
  const today = h[keys[ist.getUTCDay()]];
  const valid = (x) => x && /^\d{2}:\d{2}$/.test(x.o || "") && /^\d{2}:\d{2}$/.test(x.c || "");
  if (!valid(today)) {
    return `<p class="hours"><span class="dot off"></span>Closed today</p>`;
  }
  const now = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  const o = toMin(today.o);
  const c = toMin(today.c);
  const isOpen = c > o ? now >= o && now < c : now >= o || now < c;
  const text = isOpen
    ? `Open now · closes ${fmtTime(today.c)}`
    : `Closed now · opens ${fmtTime(today.o)}`;
  return `<p class="hours"><span class="dot ${isOpen ? "on" : "off"}"></span>${esc(text)}</p>`;
}

function page(body, script = "", extra = "") {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Review Us</title><link rel="icon" type="image/png" href="/favicon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body><div class="stars"><span class="star-on">★</span><span class="star-on">★</span><span class="star-on">★</span><span class="star-off">★</span><span class="star-off">★</span></div><div class="card">${body}</div>${extra}<p class="footer">© 2026 Debajyoti Shaw. All rights reserved.</p>${script}</body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

// Logs one scan. Never blocks the page: errors are ignored.
async function logScan(env, card, request) {
  try {
    if (!env.DB) return;
    const country = request.cf && request.cf.country ? request.cf.country : null;
    await env.DB.prepare("INSERT INTO scans (card, ts, country) VALUES (?, ?, ?)")
      .bind(card, Date.now(), country)
      .run();
  } catch (e) {
    // ignore logging failures
  }
}

// One button: icon badge on the left, label centred
function btn(cls, href, icon, label) {
  return `<a class="btn ${cls}" href="${href}" target="_blank" rel="noopener"><span class="ico">${icon}</span><span class="btn-label">${label}</span></a>`;
}

const isHttps = (u) => typeof u === "string" && /^https:\/\/\S+$/.test(u);

export async function onRequest(context) {
  const { env, request } = context;
  const id = String(context.params.id || "").replace(/\D/g, "").slice(0, 6);

  if (!id) return new Response("Card not found", { status: 404 });

  const activated = await env.TAPREVIEW.get("pin:" + id);
  if (!activated) {
    return Response.redirect(new URL("/activate?card=" + id, request.url).href, 302);
  }

  // Count this scan (kept out of the critical path)
  const logging = logScan(env, id, request);
  context.waitUntil ? context.waitUntil(logging) : await logging;

  const info = JSON.parse((await env.TAPREVIEW.get("info:" + id)) || "{}");
  if (!info.name) {
    return page(`<p class="msg">This card is not set up yet.</p>`);
  }

  const buttons = [];
  if (info.google) {
    buttons.push(btn("gold", esc(info.google), ICON.maps, "Leave a Google Review"));
  }
  if (info.whatsapp) {
    const num = info.whatsapp.length === 10 ? "91" + info.whatsapp : info.whatsapp;
    buttons.push(btn("green", `https://wa.me/${esc(num)}`, ICON.wa, "Connect on WhatsApp"));
  }
  if (info.instagram) {
    buttons.push(btn("insta", esc(info.instagram), ICON.ig, "Follow on Instagram"));
  }
  if (info.facebook) {
    buttons.push(btn("fb", esc(info.facebook), ICON.fb, "Like on Facebook"));
  }
  if (isHttps(info.menu)) {
    buttons.push(btn("menu-btn", esc(info.menu), ICON.menu, "View Menu"));
  }

  const services = Array.isArray(info.services) ? info.services : [];
  if (services.length) {
    buttons.push(`<button class="btn svc-btn" type="button" id="svcOpen"><span class="ico">${ICON.svc}</span><span class="btn-label">Our Services</span></button>`);
  }

  const sub = [info.category, info.area].filter(Boolean).map(esc).join(" · ");

  const body = `
    <h2 class="shop" id="shop">${esc(info.name)}</h2>
    ${sub ? `<p class="sub">${sub}</p>` : ""}
    ${hoursLine(info)}
    ${buttons.length ? buttons.join("") : `<p class="msg">No links added yet.</p>`}`;

  const svcPanel = services.length ? `
    <div class="overlay" id="svcOverlay">
      <div class="sheet">
        <div class="sheet-head">
          <div class="grip"></div>
          <h3>Our Services</h3>
          <p class="sub2">${esc(info.name)}</p>
        </div>
        <div class="svc-list" id="svcList">
          ${services.map((s, i) => `<div class="svc" style="animation-delay:${i * 0.06}s"><b>${i + 1}</b><span>${esc(s)}</span></div>`).join("")}
        </div>
        <div class="sheet-foot">
          <button class="close" type="button" id="svcClose">Close</button>
        </div>
      </div>
    </div>` : "";

  const script = `<script>
(function(){
  var el = document.getElementById("shop");
  var taps = [];
  el.addEventListener("click", function(){
    var now = Date.now();
    taps = taps.filter(function(t){ return now - t < 1000; });
    taps.push(now);
    if (taps.length >= 3) { window.location.href = "/login?card=${id}"; }
  });

  var o = document.getElementById("svcOverlay");
  var ob = document.getElementById("svcOpen");
  var list = document.getElementById("svcList");
  if (ob && o) {
    ob.addEventListener("click", function(){
      o.classList.add("open");
      if (list) list.scrollTop = 0;
    });
    document.getElementById("svcClose").addEventListener("click", function(){ o.classList.remove("open"); });
    o.addEventListener("click", function(e){ if (e.target === o) o.classList.remove("open"); });
  }
})();
</script>`;

  return page(body, script, svcPanel);
}
