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
.btn{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:12px;width:100%;padding:16px;margin-top:14px;border-radius:14px;font-family:Montserrat,sans-serif;font-weight:600;font-size:16px;text-decoration:none;color:#fff;animation:glow 2.8s ease-in-out infinite;transition:transform .2s}
.btn:hover{transform:translateY(-2px)}
.btn::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent);transform:skewX(-20deg);animation:shine 3.5s ease-in-out infinite;pointer-events:none}
@keyframes shine{0%{left:-75%}60%,100%{left:125%}}
.btn svg{width:22px;height:22px;flex-shrink:0}
.gold{background:linear-gradient(90deg,#d4a80c,#f5c518);color:#111;--glow:rgba(245,197,24,.75)}
.green{background:#25d366;--glow:rgba(37,211,102,.75)}
.insta{background:linear-gradient(90deg,#f58529,#dd2a7b,#8134af);--glow:rgba(221,42,123,.75)}
.fb{background:#1877f2;--glow:rgba(24,119,242,.75)}
@keyframes glow{0%,100%{box-shadow:0 0 6px var(--glow)}50%{box-shadow:0 0 20px var(--glow)}}
.msg{margin:14px 0 0;padding:14px;border-radius:12px;background:rgba(255,230,0,.08);border:1px solid rgba(255,230,0,.45);color:#ffe600;font-size:14px;line-height:1.5}
.footer{margin-top:22px;font-size:12px;color:#7f93c4;text-align:center;letter-spacing:.3px}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
`;

const ICON = {
  maps: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`,
  wa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.6-4.6A9 9 0 1 1 8 19.6L3 21z"/><path d="M9 10c0 2.5 2.5 5 5 5l1-1.5-1.8-.9-.7.7c-.8-.4-1.6-1.2-2-2l.7-.7-.9-1.8L9 10z" fill="currentColor" stroke="none"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  fb: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V9c0-.6.4-1 1-1z"/></svg>`,
};

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function page(body, script = "") {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Review Us</title><link rel="icon" type="image/png" href="/favicon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body><div class="stars"><span class="star-on">★</span><span class="star-on">★</span><span class="star-on">★</span><span class="star-off">★</span><span class="star-off">★</span></div><div class="card">${body}</div><p class="footer">© 2026 Debajyoti Shaw. All rights reserved.</p>${script}</body></html>`,
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
    buttons.push(`<a class="btn gold" href="${esc(info.google)}" target="_blank" rel="noopener">${ICON.maps}Leave a Google Review</a>`);
  }
  if (info.whatsapp) {
    const num = info.whatsapp.length === 10 ? "91" + info.whatsapp : info.whatsapp;
    buttons.push(`<a class="btn green" href="https://wa.me/${esc(num)}" target="_blank" rel="noopener">${ICON.wa}Connect on WhatsApp</a>`);
  }
  if (info.instagram) {
    buttons.push(`<a class="btn insta" href="${esc(info.instagram)}" target="_blank" rel="noopener">${ICON.ig}Follow on Instagram</a>`);
  }
  if (info.facebook) {
    buttons.push(`<a class="btn fb" href="${esc(info.facebook)}" target="_blank" rel="noopener">${ICON.fb}Like on Facebook</a>`);
  }

  const sub = [info.category, info.area].filter(Boolean).map(esc).join(" · ");

  const body = `
    <h2 class="shop" id="shop">${esc(info.name)}</h2>
    ${sub ? `<p class="sub">${sub}</p>` : ""}
    ${buttons.length ? buttons.join("") : `<p class="msg">No links added yet.</p>`}`;

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
})();
</script>`;

  return page(body, script);
}
