const CSS = `
*{box-sizing:border-box}
body{margin:0;min-height:100vh;padding:28px 18px 20px;display:flex;flex-direction:column;align-items:center;color:#fff;font-family:Montserrat,sans-serif;background:linear-gradient(180deg,#040a1c 0%,#06245e 55%,#0050c8 100%)}
.stars{margin:0 0 18px;font-size:40px;line-height:1;letter-spacing:4px}
.star-on{color:#ffe600;text-shadow:0 0 14px rgba(255,230,0,.6);animation:starPulse 2.4s ease-in-out infinite;display:inline-block}
.star-off{color:#fff;animation:starBlink 1.6s steps(2,start) infinite;display:inline-block}
.star-off:nth-child(4){animation-delay:.4s}
@keyframes starPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes starBlink{0%,100%{color:#fff;opacity:1}50%{color:#ffe600;opacity:.4}}
.card{position:relative;overflow:hidden;width:100%;max-width:440px;padding:26px 22px 24px;border-radius:22px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,#050d26 0%,#0a2a6e 55%,#0050c8 100%);box-shadow:0 20px 50px rgba(0,0,0,.45);animation:rise .9s ease-out both}
.card::before{content:"";position:absolute;inset:0;border-radius:22px;padding:1px;background:linear-gradient(120deg,transparent 30%,rgba(255,230,0,.85) 50%,transparent 70%);background-size:250% 100%;animation:borderSweep 4s linear infinite;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
@keyframes rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes borderSweep{0%{background-position:150% 0}100%{background-position:-150% 0}}
h1{margin:0 0 18px;text-align:center;font-family:"Playfair Display",serif;font-size:26px;font-weight:800;color:transparent;background:linear-gradient(90deg,#ffffff 0%,#ffe600 40%,#ffffff 60%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;animation:textShine 5s linear infinite}
@keyframes textShine{to{background-position:200% center}}
.head{padding-bottom:12px;margin-bottom:6px;border-bottom:1px solid rgba(120,160,255,.35);font-size:14px;letter-spacing:1.5px;text-transform:uppercase;color:#9fb6e8}
.msg{margin:0 0 6px;padding:14px;border-radius:12px;background:rgba(255,230,0,.08);border:1px solid rgba(255,230,0,.45);color:#ffe600;font-size:14px;line-height:1.5}
label{display:block;margin:14px 0 6px;font-size:13px;font-weight:500;color:#c3d3f5}
input{width:100%;padding:12px;border-radius:12px;border:2px solid #e8eeff;background:linear-gradient(90deg,#040b22,#0a3c9e);color:#fff;font-family:Montserrat,sans-serif;font-size:15px;transition:border-color .25s,box-shadow .25s}
input:focus{outline:none;border-color:#ffe600;box-shadow:0 0 14px rgba(255,230,0,.55)}
button{width:100%;margin-top:20px;padding:15px;border:0;border-radius:14px;font-family:Montserrat,sans-serif;font-size:16px;font-weight:700;cursor:pointer;color:#111;background:linear-gradient(90deg,#d4a80c,#f5c518);animation:glow 2.8s ease-in-out infinite;--glow:rgba(245,197,24,.75)}
button:active{transform:scale(.98)}
@keyframes glow{0%,100%{box-shadow:0 0 6px var(--glow)}50%{box-shadow:0 0 20px var(--glow)}}
.footer{margin-top:22px;font-size:12px;color:#7f93c4;text-align:center;letter-spacing:.3px}
@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}
`;

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function clean(s, max) {
  return String(s ?? "").trim().slice(0, max);
}

function page(body) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Card Activation</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body><div class="stars"><span class="star-on">★</span><span class="star-on">★</span><span class="star-on">★</span><span class="star-off">★</span><span class="star-off">★</span></div><div class="card">${body}</div><p class="footer">© 2026 Debajyoti Shaw. All rights reserved.</p></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

function renderActivate(card, notice) {
  return `
    <h1>Card Activation</h1>
    <div class="head">🔒 Card Authorization</div>
    ${notice ? `<p class="msg">${esc(notice)}</p>` : ""}
    <form method="POST">
      <label>Physical Card Number</label>
      <input name="card" value="${esc(card)}" inputmode="numeric" required>
      <label>Create Secret PIN (4 digits)</label>
      <input name="pin" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required>
      <button type="submit">Verify PIN &amp; Activate Card</button>
    </form>`;
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "GET") {
    const url = new URL(request.url);
    return page(renderActivate(clean(url.searchParams.get("card"), 6), ""));
  }

  const body = await request.formData();
  const card = clean(body.get("card"), 6);
  const pin = clean(body.get("pin"), 4);

  if (!/^\d{1,6}$/.test(card)) return page(renderActivate(card, "Card number must be digits only."));
  if (!/^\d{4}$/.test(pin)) return page(renderActivate(card, "PIN must be exactly 4 digits."));

  if (await env.TAPREVIEW.get("pin:" + card)) {
    return page(`<h1>Card ${esc(card)}</h1><p class="msg">This card is already activated. <a href="/login?card=${esc(card)}" style="color:#ffe600">Go to login</a></p>`);
  }

  await env.TAPREVIEW.put("pin:" + card, await sha256(card + ":" + pin));

  // Start a 30-minute session and send the user straight to the edit page
  const token = crypto.randomUUID();
  await env.TAPREVIEW.put("session:" + token, card, { expirationTtl: 1800 });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/edit",
      "Set-Cookie": `tr_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1800`,
    },
  });
}
