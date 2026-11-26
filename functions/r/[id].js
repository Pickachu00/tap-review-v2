const CSS = `
*{box-sizing:border-box}
body{margin:0;min-height:100vh;padding:26px 18px 28px;display:flex;flex-direction:column;align-items:center;color:#fff;font-family:Poppins,sans-serif;background:linear-gradient(180deg,#040a1c 0%,#06245e 55%,#0050c8 100%)}
.brand{margin:0 0 12px;font-size:14px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;text-align:center}
.stars{margin:0 0 18px;font-size:46px;line-height:1;letter-spacing:4px}
.on{color:#ffe600;text-shadow:0 0 14px rgba(255,230,0,.55)}
.card{width:100%;max-width:440px;padding:26px 22px 28px;border-radius:22px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,#050d26 0%,#0a2a6e 55%,#0050c8 100%);box-shadow:0 20px 50px rgba(0,0,0,.45);text-align:center}
.shop{margin:0;font-family:Merriweather,serif;font-size:26px;font-weight:700;line-height:1.25;cursor:pointer;user-select:none;-webkit-user-select:none}
.sub{margin:8px 0 0;font-size:14px;color:#c3d3f5}
.btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:16px;margin-top:14px;border-radius:14px;font-family:Poppins,sans-serif;font-weight:700;font-size:16px;text-decoration:none;color:#111}
.gold{background:linear-gradient(90deg,#d4a80c,#f5c518)}
.green{background:#25d366;color:#fff}
.insta{background:linear-gradient(90deg,#f58529,#dd2a7b,#8134af);color:#fff}
.fb{background:#1877f2;color:#fff}
.gbadge{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:#fff;color:#4285f4;font-weight:800;font-size:16px}
.msg{margin:0;padding:14px;border-radius:12px;background:rgba(255,230,0,.08);border:1px solid rgba(255,230,0,.45);color:#ffe600;font-family:Merriweather,serif;font-size:15px;line-height:1.5}
.tag{margin-top:20px;font-size:12px;color:#7f93c4}
`;

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function page(body, script = "") {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Review Us</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Poppins:wght@700;800&display=swap" rel="stylesheet"><style>${CSS}</style></head><body><p class="brand">A Debajyoti Shaw Product</p><div class="stars"><span class="on">★★★</span>★★</div><div class="card">${body}</div>${script}</body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export async function onRequest(context) {
  const { env, request } = context;
  const id = String(context.params.id || "").replace(/\D/g, "").slice(0, 6);

  if (!id) return new Response("Card not found", { status: 404 });

  // Not activated yet: send to activation page
  const activated = await env.TAPREVIEW.get("pin:" + id);
  if (!activated) {
    return Response.redirect(new URL("/activate?card=" + id, request.url).href, 302);
  }

  const info = JSON.parse((await env.TAPREVIEW.get("info:" + id)) || "{}");
  if (!info.name) {
    return page(`<p class="msg">This card is not set up yet.</p>`);
  }

  const buttons = [];
  if (info.google) {
    buttons.push(`<a class="btn gold" href="${esc(info.google)}" target="_blank" rel="noopener"><span class="gbadge">G</span>Leave a Google Review</a>`);
  }
  if (info.whatsapp) {
    // 10-digit Indian numbers get the 91 country code
    const num = info.whatsapp.length === 10 ? "91" + info.whatsapp : info.whatsapp;
    buttons.push(`<a class="btn green" href="https://wa.me/${esc(num)}" target="_blank" rel="noopener">Connect on WhatsApp</a>`);
  }
  if (info.instagram) {
    buttons.push(`<a class="btn insta" href="${esc(info.instagram)}" target="_blank" rel="noopener">Follow on Instagram</a>`);
  }
  if (info.facebook) {
    buttons.push(`<a class="btn fb" href="${esc(info.facebook)}" target="_blank" rel="noopener">Like on Facebook</a>`);
  }

  const sub = [info.category, info.area].filter(Boolean).map(esc).join(" · ");

  const body = `
    <h2 class="shop" id="shop">${esc(info.name)}</h2>
    ${sub ? `<p class="sub">${sub}</p>` : ""}
    ${buttons.length ? buttons.join("") : `<p class="msg">No links added yet.</p>`}`;

  // Three quick taps on the shop name open the login page
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
