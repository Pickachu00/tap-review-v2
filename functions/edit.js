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
input,select{width:100%;padding:13px;border-radius:12px;border:2px solid #e8eeff;background:linear-gradient(90deg,#040b22,#0a3c9e);color:#fff;font-family:Merriweather,serif;font-size:16px}
input:focus,select:focus{outline:none;border-color:#ffe600;box-shadow:0 0 14px rgba(255,230,0,.55)}
button{width:100%;margin-top:22px;padding:15px;border:0;border-radius:12px;font-family:Merriweather,serif;font-size:17px;font-weight:700;cursor:pointer}
.save{background:linear-gradient(90deg,#ffe600,#ffd000);color:#0a0a0a;box-shadow:0 0 18px rgba(255,230,0,.35)}
.reset{margin-top:12px;background:rgba(160,20,40,.25);color:#ff8a8a;border:1px solid rgba(255,90,90,.5)}
.status{margin:0 0 6px;padding:14px;border-radius:12px;background:rgba(40,160,90,.15);border:1px solid rgba(80,220,140,.5);color:#8ff0b8;font-family:Merriweather,serif;font-size:15px;line-height:1.5}
.msg{margin:0 0 6px;padding:14px;border-radius:12px;background:rgba(255,230,0,.08);border:1px solid rgba(255,230,0,.45);color:#ffe600;font-family:Merriweather,serif;font-size:15px;line-height:1.5}
`;

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function clean(s, max) {
  return String(s ?? "").trim().slice(0, max);
}

function digitsOnly(s) {
  return String(s ?? "").replace(/\D/g, "").slice(0, 15);
}

function isHttps(u) {
  return !u || /^https:\/\/\S+$/.test(u);
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return match ? match[1] : null;
}

function page(body) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Card Settings</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Poppins:wght@700;800&display=swap" rel="stylesheet"><style>${CSS}</style></head><body><p class="brand">A Debajyoti Shaw Product</p><div class="stars"><span class="on">★★★</span>★★</div><h1>Card Settings</h1><div class="card">${body}</div></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

function renderForm(card, info, notice) {
  const v = (k) => esc(info[k] || "");
  const current = info.category || "Other";
  const cats = ["Restaurant", "Cafe", "Salon", "Retail Shop", "Medical", "Other"];
  const options = cats
    .map((c) => `<option value="${c}"${c === current ? " selected" : ""}>${c}</option>`)
    .join("");

  return `
    <div class="head">🔒 Card ${esc(card)} Configuration</div>
    <p class="status">Card ${esc(card)} is unlocked. You can edit its details or reset it.</p>
    ${notice ? `<p class="msg">${esc(notice)}</p>` : ""}
    <form method="POST">
      <label>Business Name</label>
      <input name="name" value="${v("name")}" required>
      <label>City / Area Location</label>
      <input name="area" value="${v("area")}">
      <label>Business Category</label>
      <select name="category">${options}</select>
      <label>Google Maps URL or Review Link (Optional)</label>
      <input name="google" type="url" value="${v("google")}" placeholder="https://...">
      <label>WhatsApp Phone Number (Optional)</label>
      <input name="whatsapp" inputmode="tel" value="${v("whatsapp")}" placeholder="e.g. 9876543210">
      <label>Instagram Profile Link (Optional)</label>
      <input name="instagram" type="url" value="${v("instagram")}" placeholder="https://instagram.com/yourhandle">
      <label>Facebook Page Link (Optional)</label>
      <input name="facebook" type="url" value="${v("facebook")}" placeholder="https://facebook.com/yourpage">
      <button class="save" name="action" value="save">Save Card Details</button>
    </form>
    <form method="POST" onsubmit="return confirm('Reset this card to available? All details will be removed.')">
      <button class="reset" name="action" value="wipe">Wipe / Reset Card to Available</button>
    </form>`;
}

export async function onRequest(context) {
  const { request, env } = context;

  // Only logged-in sessions can open this page
  const token = getCookie(request, "tr_session");
  const card = token ? await env.TAPREVIEW.get("session:" + token) : null;
  if (!card) {
    return Response.redirect(new URL("/login", request.url).href, 302);
  }

  if (request.method === "GET") {
    const info = JSON.parse((await env.TAPREVIEW.get("info:" + card)) || "{}");
    return page(renderForm(card, info, ""));
  }

  const body = await request.formData();

  if (body.get("action") === "wipe") {
    await env.TAPREVIEW.delete(card);
    await env.TAPREVIEW.delete("pin:" + card);
    await env.TAPREVIEW.delete("info:" + card);
    await env.TAPREVIEW.delete("session:" + token);
    return page(`<p class="msg">Card ${esc(card)} has been reset to available.</p>`);
  }

  const data = {
    name: clean(body.get("name"), 80),
    area: clean(body.get("area"), 80),
    category: clean(body.get("category"), 40),
    google: clean(body.get("google"), 500),
    whatsapp: digitsOnly(body.get("whatsapp")),
    instagram: clean(body.get("instagram"), 300),
    facebook: clean(body.get("facebook"), 300),
  };

  if (!data.name) return page(renderForm(card, data, "Business name is required."));
  if (!isHttps(data.google)) return page(renderForm(card, data, "Google link must start with https://"));
  if (!isHttps(data.instagram)) return page(renderForm(card, data, "Instagram link must start with https://"));
  if (!isHttps(data.facebook)) return page(renderForm(card, data, "Facebook link must start with https://"));
  if (data.whatsapp && data.whatsapp.length < 10) {
    return page(renderForm(card, data, "WhatsApp number must be at least 10 digits."));
  }

  await env.TAPREVIEW.put("info:" + card, JSON.stringify(data));

  // Temporary: /r/{card} goes to the first available link until the landing page step
  const primary =
    data.google || data.instagram || data.facebook || (data.whatsapp ? "https://wa.me/" + data.whatsapp : "");
  if (primary) {
    await env.TAPREVIEW.put(card, primary);
  } else {
    await env.TAPREVIEW.delete(card);
  }

  return page(renderForm(card, data, "Card details saved."));
                     }
