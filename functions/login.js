function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function page(title, body) {
  return new Response(
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Poppins:wght@700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;padding:26px 18px 28px;display:flex;flex-direction:column;align-items:center;color:#fff;font-family:Poppins,sans-serif;background:linear-gradient(180deg,#040a1c 0%,#06245e 55%,#0050c8 100%)}
.brand{margin:0 0 12px;font-size:14px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;text-align:center}
.stars{margin:0 0 14px;font-size:46px;line-height:1;letter-spacing:4px}
.on{color:#ffe600;text-shadow:0 0 14px rgba(255,230,0,.55)}
.off{color:#fff}
h1{margin:0 0 26px;font-size:30px;font-weight:800;line-height:1.1;text-align:center;text-transform:uppercase}
.card{width:100%;max-width:420px;padding:24px 22px 26px;border-radius:22px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,#050d26 0%,#0a2a6e 55%,#0050c8 100%);box-shadow:0 20px 50px rgba(0,0,0,.45)}
.head{padding-bottom:14px;margin-bottom:4px;border-bottom:1px solid rgba(120,160,255,.35);font-family:Merriweather,serif;font-size:19px;font-weight:700}
label{display:block;margin:18px 0 8px;font-family:Merriweather,serif;font-size:15px;color:#c3d3f5}
input{width:100%;padding:14px;border-radius:12px;border:2px solid #e8eeff;background:linear-gradient(90deg,#040b22,#0a3c9e);color:#fff;font-family:Merriweather,serif;font-size:17px;transition:border-color .2s,box-shadow .2s}
input:focus{outline:none;border-color:#ffe600;box-shadow:0 0 14px rgba(255,230,0,.55)}
button{width:100%;margin-top:26px;padding:16px;border:0;border-radius:12px;background:linear-gradient(90deg,#ffe600,#ffd000);color:#0a0a0a;font-family:Merriweather,serif;font-size:18px;font-weight:700;cursor:pointer;box-shadow:0 0 18px rgba(255,230,0,.35)}
.msg{margin:0;padding:14px;border-radius:12px;background:rgba(255,230,0,.08);border:1px solid rgba(255,230,0,.45);color:#ffe600;font-family:Merriweather,serif;font-size:16px;line-height:1.5}
</style>
</head>
<body>
<p class="brand">A Debajyoti Shaw Product</p>
<div class="stars"><span class="on">★★★</span><span class="off">★★</span></div>
<h1>${escapeHtml(title)}</h1>
<div class="card">${body}</div>
</body>
</html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

function msg(text) {
  return page("Card Login", `<p class="msg">${escapeHtml(text)}</p>`);
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const MAX_FAILS = 5;
const LOCK_SECONDS = 900;      // 15 minutes
const SESSION_SECONDS = 1800;  // 30 minutes

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "GET") {
    const url = new URL(request.url);
    const card = escapeHtml((url.searchParams.get("card") || "").trim());
    return page("Card Login", `
      <div class="head">🔒 Card Login</div>
      <form method="POST">
        <label>Physical Card Number</label>
        <input name="card" value="${card}" inputmode="numeric" required>
        <label>Activation Secret PIN (4 digits)</label>
        <input name="pin" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required>
        <button>Login</button>
      </form>`);
  }

  const form = await request.formData();
  const card = String(form.get("card") || "").trim();
  const pin = String(form.get("pin") || "").trim();

  if (!/^\d{1,6}$/.test(card)) return msg("Card number must be digits only.");
  if (!/^\d{4}$/.test(pin)) return msg("PIN must be exactly 4 digits.");

  const failKey = "fail:" + card;
  const fails = parseInt((await env.TAPREVIEW.get(failKey)) || "0", 10);
  if (fails >= MAX_FAILS) {
    return msg("Too many wrong attempts. Try again after 15 minutes.");
  }

  const savedHash = await env.TAPREVIEW.get("pin:" + card);
  if (!savedHash) return msg("This card is not activated yet.");

  const pinHash = await sha256(card + ":" + pin);
  if (pinHash !== savedHash) {
    await env.TAPREVIEW.put(failKey, String(fails + 1), { expirationTtl: LOCK_SECONDS });
    const left = Math.max(0, MAX_FAILS - (fails + 1));
    return msg(`Wrong PIN. ${left} attempts left.`);
  }

  // Correct PIN: clear fail counter, create a short session
  await env.TAPREVIEW.delete(failKey);
  const token = crypto.randomUUID();
  await env.TAPREVIEW.put("session:" + token, card, { expirationTtl: SESSION_SECONDS });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/edit",
      "Set-Cookie": `tr_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_SECONDS}`,
    },
  });
}
