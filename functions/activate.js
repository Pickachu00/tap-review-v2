function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function page(body) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Card Activation</title><style>
body{margin:0;min-height:100vh;background:#0a1630;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;padding:24px 16px;box-sizing:border-box}
.box{width:100%;max-width:420px;background:#0f2050;border-radius:18px;padding:24px;box-sizing:border-box}
h2{margin:0 0 12px;color:#f5c518}
label{display:block;margin:14px 0 6px;font-size:14px;color:#c9d6f5}
input{width:100%;padding:12px;border-radius:10px;border:2px solid #2a4a8a;background:#07122b;color:#fff;font-size:16px;box-sizing:border-box}
input:focus{outline:none;border-color:#f5c518;box-shadow:0 0 12px rgba(245,197,24,.45)}
button{width:100%;margin-top:20px;padding:14px;border:0;border-radius:12px;background:#f5c518;color:#111;font-weight:bold;font-size:16px}
.msg{margin-top:12px;color:#f5c518}
.tag{margin-top:20px;font-size:12px;color:#7f93c4;text-align:center}
</style></head><body><div class="box">${body}</div><p class="tag">A Debajyoti Shaw Product</p></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "GET") {
    const url = new URL(request.url);
    const card = escapeHtml((url.searchParams.get("card") || "").trim());
    return page(`
      <h2>Card Activation</h2>
      <form method="POST">
        <label>Physical Card Number</label>
        <input name="card" value="${card}" inputmode="numeric" required>
        <label>Activation PIN (4 digits)</label>
        <input name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required>
        <label>Review link (https://...)</label>
        <input name="link" type="url" required>
        <button>Save and Activate</button>
      </form>`);
  }

  const form = await request.formData();
  const card = String(form.get("card") || "").trim();
  const pin = String(form.get("pin") || "").trim();
  const link = String(form.get("link") || "").trim();

  if (!/^\d{1,6}$/.test(card)) return page("<p class='msg'>Card number must be digits only.</p>");
  if (!/^\d{4}$/.test(pin)) return page("<p class='msg'>PIN must be exactly 4 digits.</p>");
  if (!/^https:\/\//.test(link)) return page("<p class='msg'>Link must start with https://</p>");

  const pinKey = "pin:" + card;
  const existing = await env.TAPREVIEW.get(pinKey);
  if (existing) {
    return page(`<p class='msg'>Card ${escapeHtml(card)} is already activated.</p>`);
  }

  const pinHash = await sha256(card + ":" + pin);
  await env.TAPREVIEW.put(pinKey, pinHash);
  await env.TAPREVIEW.put(card, link);

  return page(`<p class='msg'>Card ${escapeHtml(card)} activated successfully.</p>`);
}
