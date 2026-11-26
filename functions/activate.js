const CSS = `
*{box-sizing:border-box}
body{margin:0;min-height:100vh;padding:26px 18px 28px;display:flex;flex-direction:column;align-items:center;color:#fff;font-family:Poppins,sans-serif;background:linear-gradient(180deg,#040a1c 0%,#06245e 55%,#0050c8 100%)}
.brand{margin:0 0 12px;font-size:14px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;text-align:center}
.stars{margin:0 0 14px;font-size:46px;line-height:1;letter-spacing:4px}
.on{color:#ffe600;text-shadow:0 0 14px rgba(255,230,0,.55)}
h1{margin:0 0 26px;font-size:28px;font-weight:800;line-height:1.1;text-align:center;text-transform:uppercase}
.card{width:100%;max-width:440px;padding:24px 22px 26px;border-radius:22px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,#050d26 0%,#0a2a6e 55%,#0050c8 100%);box-shadow:0 20px 50px rgba(0,0,0,.45)}
.head{padding-bottom:14px;margin-bottom:6px;border-bottom:1px solid rgba(120,160,255,.35);font-family:Merriweather,serif;font-size:19px;font-weight:700}
label{display:block;margin:16px 0 8px;font-family:Merriweather,serif;font-size:14px;color:#c3d3f5}
input{width:100%;padding:13px;border-radius:12px;border:2px solid #e8eeff;background:linear-gradient(90deg,#040b22,#0a3c9e);color:#fff;font-family:Merriweather,serif;font-size:16px}
input:focus{outline:none;border-color:#ffe600;box-shadow:0 0 14px rgba(255,230,0,.55)}
button{width:100%;margin-top:22px;padding:15px;border:0;border-radius:12px;font-family:Merriweather,serif;font-size:17px;font-weight:700;cursor:pointer;background:linear-gradient(90deg,#ffe600,#ffd000);color:#0a0a0a;box-shadow:0 0 18px rgba(255,230,0,.35)}
.msg{margin:0 0 6px;padding:14px;border-radius:12px;background:rgba(255,230,0,.08);border:1px solid rgba(255,230,0,.45);color:#ffe600;font-family:Merriweather,serif;font-size:15px;line-height:1.5}
.note{margin:12px 0 0;font-size:14px}
.note a{color:#ffe600}
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
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Card Activation</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Poppins:wght@700;800&display=swap" rel="stylesheet"><style>${CSS}</style></head><body><p class="brand">A Debajyoti Shaw Product</p><div class="stars"><span class="on">★★★</span>★★</div><h1>Card Activation &amp; Setup</h1><div class="card">${body}</div></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

function renderActivate(card, notice) {
  return `
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
    const card = clean(url.searchParams.get("card"), 6);
    return page(renderActivate(card, ""));
  }

  const body = await request.formData();
  const card = clean(body.get("card"), 6);
  const pin = clean(body.get("pin"), 4);

  if (!/^\d{1,6}$/.test(card)) return page(renderActivate(card, "Card number must be digits only."));
  if (!/^\d{4}$/.test(pin)) return page(renderActivate(card, "PIN must be exactly 4 digits."));

  const pinKey = "pin:" + card;
  if (await env.TAPREVIEW.get(pinKey)) {
    return page(`<p class="msg">Card ${esc(card)} is already activated.</p><p class="note"><a href="/login?card=${esc(card)}">Go to login</a></p>`);
  }

  await env.TAPREVIEW.put(pinKey, await sha256(card + ":" + pin));

  // Start a 30-minute session so the user goes straight to the edit page
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
