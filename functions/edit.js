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
.still .card{animation:none}
.card::before{content:"";position:absolute;inset:0;border-radius:22px;padding:1px;background:linear-gradient(120deg,transparent 30%,rgba(255,230,0,.85) 50%,transparent 70%);background-size:250% 100%;animation:borderSweep 4s linear infinite;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
@keyframes rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes borderSweep{0%{background-position:150% 0}100%{background-position:-150% 0}}
h1{margin:0 0 18px;text-align:center;font-family:"Playfair Display",serif;font-size:28px;font-weight:800;color:transparent;background:linear-gradient(90deg,#ffffff 0%,#ffe600 40%,#ffffff 60%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;animation:textShine 5s linear infinite}
@keyframes textShine{to{background-position:200% center}}
.head{padding-bottom:12px;margin-bottom:6px;border-bottom:1px solid rgba(120,160,255,.35);font-size:14px;letter-spacing:1.5px;text-transform:uppercase;color:#9fb6e8}
.status{margin:0 0 6px;padding:12px;border-radius:12px;background:rgba(40,160,90,.15);border:1px solid rgba(80,220,140,.5);color:#8ff0b8;font-size:14px;line-height:1.5}
.msg{margin:0 0 6px;padding:14px;border-radius:12px;background:rgba(255,230,0,.08);border:1px solid rgba(255,230,0,.45);color:#ffe600;font-size:14px;line-height:1.5}
label{display:block;margin:14px 0 6px;font-size:13px;font-weight:500;color:#c3d3f5}
input,select{width:100%;padding:12px;border-radius:12px;border:2px solid #e8eeff;background:linear-gradient(90deg,#040b22,#0a3c9e);color:#fff;font-family:Montserrat,sans-serif;font-size:15px;transition:border-color .25s,box-shadow .25s}
input:focus,select:focus{outline:none;border-color:#ffe600;box-shadow:0 0 14px rgba(255,230,0,.55)}
select option{background:#06245e;color:#fff}
button{width:100%;margin-top:20px;padding:15px;border:0;border-radius:14px;font-family:Montserrat,sans-serif;font-size:16px;font-weight:700;cursor:pointer;position:relative;overflow:hidden;transition:transform .15s,opacity .2s}
button:active{transform:scale(.98)}
button:disabled{opacity:.7;cursor:wait}
.save{background:linear-gradient(90deg,#d4a80c,#f5c518);color:#111;animation:glow 2.8s ease-in-out infinite;--glow:rgba(245,197,24,.75)}
.reset{margin-top:12px;background:rgba(160,20,40,.25);color:#ff8a8a;border:1px solid rgba(255,90,90,.5)}
@keyframes glow{0%,100%{box-shadow:0 0 6px var(--glow)}50%{box-shadow:0 0 20px var(--glow)}}
.toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,24px);opacity:0;width:max-content;max-width:90%;padding:14px 22px;border-radius:14px;background:rgba(8,28,70,.96);border:1px solid rgba(80,220,140,.6);color:#8ff0b8;font-size:14px;font-weight:600;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.45);transition:opacity .45s ease,transform .45s cubic-bezier(.2,.8,.2,1);pointer-events:none;z-index:10}
.toast.show{opacity:1;transform:translate(-50%,0)}
.footer{margin-top:22px;font-size:12px;color:#7f93c4;text-align:center;letter-spacing:.3px}
@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}
`;

const CATEGORIES = [
  "Accountant",
  "Bakery",
  "Bank",
  "Bar & Lounge",
  "Beauty Parlour",
  "Bookstore",
  "Cafe",
  "Car Service",
  "Clinic",
  "Clothing",
  "Coaching",
  "Coffee Shop",
  "Courier",
  "Cyber Cafe",
  "Dental Clinic",
  "Digital Service Centre",
  "Electronics",
  "Event Planning",
  "Fast Food",
  "Florist",
  "Footwear",
  "Garage",
  "Grocery",
  "Gym",
  "Hardware",
  "Hospital",
  "Hotel",
  "Insurance",
  "IT Services",
  "Jewellery",
  "Juice Bar",
  "Laundry",
  "Lawyer",
  "Medical",
  "Mobile Shop",
  "Pet Shop",
  "Petrol Pump",
  "Pharmacy",
  "Photo Studio",
  "Printing",
  "Real Estate",
  "Restaurant",
  "Retail Shop",
  "Salon",
  "School",
  "Spa",
  "Stationery",
  "Sweet Shop",
  "Tailor",
  "Travel Agency",
  "Tuition Centre",
  "Other"
];

const TOAST_SCRIPT = `<script>
(function(){
  var t = document.getElementById("toast");
  if (!t) return;
  requestAnimationFrame(function(){ t.classList.add("show"); });
  setTimeout(function(){ t.classList.remove("show"); }, 2800);
})();
</script>`;

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

// opts.intro = false  -> no entrance animation (used after a POST so the page doesn't jump)
// opts.toast          -> success message shown as a sliding toast
function page(body, opts = {}) {
  const bodyClass = opts.intro === false ? "still" : "";
  const toast = opts.toast ? `<div class="toast" id="toast">${esc(opts.toast)}</div>` : "";
  const script = opts.toast ? TOAST_SCRIPT : "";
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Card Settings</title><link rel="icon" type="image/png" href="/favicon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body class="${bodyClass}"><div class="stars"><span class="star-on">★</span><span class="star-on">★</span><span class="star-on">★</span><span class="star-off">★</span><span class="star-off">★</span></div><div class="card">${body}</div><p class="footer">© 2026 Debajyoti Shaw. All rights reserved.</p>${toast}${script}</body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

function renderForm(card, info, notice) {
  const v = (k) => esc(info[k] || "");
  const current = info.category || "Other";
  const options = CATEGORIES
    .map((c) => `<option value="${c}"${c === current ? " selected" : ""}>${c}</option>`)
    .join("");

  return `
    <h1>Card ${esc(card)} Settings</h1>
    <div class="head">Business details</div>
    <p class="status">Card ${esc(card)} is unlocked. You can edit its details or reset it.</p>
    ${notice ? `<p class="msg">${esc(notice)}</p>` : ""}
    <form method="POST" onsubmit="var b=this.querySelector('button');b.disabled=true;b.textContent='Saving...';">
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
    return page(`<h1>Card ${esc(card)}</h1><p class="msg">Card has been reset to available.</p>`, {
      intro: false,
      toast: "Card has been reset to available.",
    });
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

  // Validation errors stay inline, next to the form
  if (!data.name) return page(renderForm(card, data, "Business name is required."), { intro: false });
  if (!isHttps(data.google)) return page(renderForm(card, data, "Google link must start with https://"), { intro: false });
  if (!isHttps(data.instagram)) return page(renderForm(card, data, "Instagram link must start with https://"), { intro: false });
  if (!isHttps(data.facebook)) return page(renderForm(card, data, "Facebook link must start with https://"), { intro: false });
  if (data.whatsapp && data.whatsapp.length < 10) {
    return page(renderForm(card, data, "WhatsApp number must be at least 10 digits."), { intro: false });
  }

  await env.TAPREVIEW.put("info:" + card, JSON.stringify(data));

  const primary =
    data.google || data.instagram || data.facebook || (data.whatsapp ? "https://wa.me/" + data.whatsapp : "");
  if (primary) {
    await env.TAPREVIEW.put(card, primary);
  } else {
    await env.TAPREVIEW.delete(card);
  }

  // Success: no card re-animation, message slides in as a toast
  return page(renderForm(card, data, ""), {
    intro: false,
    toast: "Card details saved successfully.",
  });
}
