const CSS = `
*{box-sizing:border-box}
body{margin:0;min-height:100vh;padding:24px 16px 28px;color:#fff;font-family:Montserrat,sans-serif;background:linear-gradient(180deg,#040a1c 0%,#06245e 55%,#0050c8 100%)}
.wrap{max-width:820px;margin:0 auto}
h1{margin:0 0 6px;font-family:"Playfair Display",serif;font-size:28px;font-weight:800;color:transparent;background:linear-gradient(90deg,#ffffff 0%,#ffe600 40%,#ffffff 60%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;animation:textShine 5s linear infinite}
@keyframes textShine{to{background-position:200% center}}
.sub{margin:0 0 22px;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:#9fb6e8}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:18px}
.stat{padding:18px;border-radius:18px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,#050d26 0%,#0a2a6e 60%,#0050c8 100%);box-shadow:0 14px 34px rgba(0,0,0,.4)}
.stat b{display:block;font-size:26px;color:#ffe600;text-shadow:0 0 12px rgba(255,230,0,.45)}
.stat span{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#9fb6e8}
.trend{display:block;margin-top:6px;font-size:12px;letter-spacing:.3px;color:#9fb6e8}
.up{color:#8ff0b8}
.down{color:#ff8a8a}
.panel{padding:20px;margin-bottom:18px;border-radius:18px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,#050d26 0%,#0a2a6e 60%,#0050c8 100%);box-shadow:0 14px 34px rgba(0,0,0,.4);overflow-x:auto}
.panel h2{margin:0 0 14px;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;color:#c3d3f5}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{padding:10px 8px;text-align:left;vertical-align:top;border-bottom:1px solid rgba(120,160,255,.18)}
th{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9fb6e8}
.badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;white-space:nowrap}
.on-b{background:rgba(80,220,140,.18);color:#8ff0b8;border:1px solid rgba(80,220,140,.5)}
.warn-b{background:rgba(255,230,0,.12);color:#ffe600;border:1px solid rgba(255,230,0,.5)}
.bars{display:flex;align-items:flex-end;gap:6px;height:160px;padding-top:10px}
.bar{flex:1;min-width:10px;border-radius:8px 8px 3px 3px;background:linear-gradient(180deg,#ffe600,#f5c518);box-shadow:0 0 12px rgba(255,230,0,.35);position:relative}
.bar span{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);font-size:10px;color:#9fb6e8;white-space:nowrap}
.bar em{position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;font-style:normal;color:#ffe600}
.axis{height:26px}
.msg{padding:14px;border-radius:12px;background:rgba(255,230,0,.08);border:1px solid rgba(255,230,0,.45);color:#ffe600;font-size:14px}
input{width:100%;padding:12px;border-radius:12px;border:2px solid #e8eeff;background:linear-gradient(90deg,#040b22,#0a3c9e);color:#fff;font-family:Montserrat,sans-serif;font-size:15px}
input:focus{outline:none;border-color:#ffe600;box-shadow:0 0 14px rgba(255,230,0,.55)}
button{width:100%;margin-top:14px;padding:15px;border:0;border-radius:14px;font-family:Montserrat,sans-serif;font-size:16px;font-weight:700;cursor:pointer;color:#111;background:linear-gradient(90deg,#d4a80c,#f5c518)}
.reset-btn{width:auto;margin:0;padding:6px 12px;font-size:12px;border-radius:10px;color:#ff8a8a;background:rgba(160,20,40,.25);border:1px solid rgba(255,90,90,.5)}
.footer{margin-top:20px;font-size:12px;color:#7f93c4;text-align:center}
.logout{display:inline-block;margin-top:10px;font-size:13px;color:#ffe600}
`;

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function page(body) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Owner Panel</title><link rel="icon" type="image/png" href="/favicon.png"><meta name="robots" content="noindex,nofollow"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body><div class="wrap">${body}<p class="footer">© 2026 Debajyoti Shaw. All rights reserved.</p></div></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } }
  );
}

function loginForm(notice) {
  return `
    <h1>Owner Panel</h1>
    <p class="sub">Restricted access</p>
    ${notice ? `<p class="msg">${esc(notice)}</p>` : ""}
    <form method="POST" class="panel">
      <input type="password" name="pass" placeholder="Owner password" required>
      <button type="submit">Enter</button>
    </form>`;
}

// Constant-time comparison so the password check doesn't leak timing
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return match ? match[1] : null;
}

async function isOwner(request, env) {
  const token = getCookie(request, "tr_owner");
  if (!token) return false;
  return !!(await env.TAPREVIEW.get("owner:" + token));
}

function dayLabel(ts) {
  const d = new Date(ts + 5.5 * 3600 * 1000); // IST
  return d.toISOString().slice(5, 10); // MM-DD
}

async function dashboard(env) {
  const cards = await env.TAPREVIEW.list({ prefix: "pin:" });
  const activeIds = cards.keys
    .map((k) => k.name.slice(4))
    .sort((a, b) => Number(a) - Number(b));

  const infos = {};
  for (const id of activeIds) {
    infos[id] = JSON.parse((await env.TAPREVIEW.get("info:" + id)) || "{}");
  }

  const totals = { scans: 0, last7: 0, prev7: 0 };
  const perCard = {};
  const countries = {};
  const daily = {};

  if (env.DB) {
    const now = Date.now();
    const since14 = now - 14 * 86400000;
    const since7 = now - 7 * 86400000;

    const all = await env.DB.prepare(
      "SELECT card, COUNT(*) AS n, MAX(ts) AS last FROM scans GROUP BY card"
    ).all();
    for (const r of all.results) perCard[r.card] = { n: r.n, last: r.last };
    totals.scans = all.results.reduce((s, r) => s + r.n, 0);

    const week = await env.DB.prepare("SELECT COUNT(*) AS n FROM scans WHERE ts >= ?")
      .bind(since7).first();
    totals.last7 = week ? week.n : 0;

    const prev = await env.DB.prepare("SELECT COUNT(*) AS n FROM scans WHERE ts >= ? AND ts < ?")
      .bind(since14, since7).first();
    totals.prev7 = prev ? prev.n : 0;

    const dayRows = await env.DB.prepare("SELECT ts FROM scans WHERE ts >= ? ORDER BY ts")
      .bind(since14).all();
    for (let i = 13; i >= 0; i--) daily[dayLabel(now - i * 86400000)] = 0;
    for (const r of dayRows.results) {
      const key = dayLabel(r.ts);
      if (key in daily) daily[key]++;
    }

    const cRows = await env.DB.prepare(
      "SELECT country, COUNT(*) AS n FROM scans GROUP BY country ORDER BY n DESC LIMIT 8"
    ).all();
    for (const r of cRows.results) countries[r.country || "Unknown"] = r.n;
  }

  // Week-over-week change
  let trendHtml = "";
  if (totals.prev7 > 0) {
    const change = Math.round(((totals.last7 - totals.prev7) / totals.prev7) * 100);
    trendHtml = `<span class="trend ${change >= 0 ? "up" : "down"}">${change >= 0 ? "▲" : "▼"} ${Math.abs(change)}% vs previous week</span>`;
  } else if (totals.last7 > 0) {
    trendHtml = `<span class="trend up">▲ New activity this week</span>`;
  }

  // Incomplete = activated (PIN set) but no business details saved yet
  const incomplete = activeIds.filter((id) => !infos[id].name).length;

  const rows = activeIds.map((id) => {
    const info = infos[id];
    const s = perCard[id];
    const isIncomplete = !info.name;
    const lastScan = s
      ? new Date(s.last + 5.5 * 3600 * 1000).toISOString().slice(0, 16).replace("T", " ")
      : "—";
    const status = isIncomplete
      ? `<span class="badge warn-b">Incomplete</span>`
      : `<span class="badge on-b">Active</span>`;
    return `<tr>
      <td>${esc(id)}</td>
      <td>${esc(info.name || "—")}</td>
      <td>${esc(info.area || "—")}</td>
      <td>${s ? s.n : 0}</td>
      <td>${lastScan}</td>
      <td>${status}</td>
      <td>
        <form method="POST" onsubmit="return confirm('Reset card ${esc(id)} to available? Its shop details and PIN will be removed.')">
          <input type="hidden" name="action" value="reset">
          <input type="hidden" name="card" value="${esc(id)}">
          <button class="reset-btn" type="submit">Reset</button>
        </form>
      </td>
    </tr>`;
  });

  const values = Object.values(daily);
  const max = Math.max(1, ...values);
  const bars = Object.entries(daily)
    .map(([label, n]) => {
      const h = Math.round((n / max) * 140);
      return `<div class="bar" style="height:${Math.max(h, 2)}px"><em>${n || ""}</em><span>${label}</span></div>`;
    })
    .join("");

  const countryRows = Object.entries(countries)
    .map(([c, n]) => `<tr><td>${esc(c)}</td><td>${n}</td></tr>`)
    .join("");

  return `
    <h1>Owner Panel</h1>
    <p class="sub">All cards at a glance</p>

    <div class="grid">
      <div class="stat"><b>${activeIds.length}</b><span>Activated cards</span></div>
      <div class="stat"><b>${incomplete}</b><span>Incomplete setup</span></div>
      <div class="stat"><b>${totals.scans}</b><span>Total scans</span></div>
      <div class="stat"><b>${totals.last7}</b><span>Scans, last 7 days</span>${trendHtml}</div>
    </div>

    <div class="panel">
      <h2>Scans, last 14 days</h2>
      <div class="bars">${bars}</div>
      <div class="axis"></div>
    </div>

    <div class="panel">
      <h2>Cards</h2>
      ${rows.length ? `<table>
        <tr><th>No.</th><th>Business</th><th>Area</th><th>Scans</th><th>Last scan (IST)</th><th>Status</th><th></th></tr>
        ${rows.join("")}
      </table>` : `<p class="msg">No activated cards yet.</p>`}
    </div>

    <div class="panel">
      <h2>Scans by country</h2>
      ${countryRows ? `<table><tr><th>Country</th><th>Scans</th></tr>${countryRows}</table>` : `<p class="msg">No scans yet.</p>`}
    </div>

    <a class="logout" href="/owner?logout=1">Log out</a>`;
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (url.searchParams.get("logout") === "1") {
    const token = getCookie(request, "tr_owner");
    if (token) await env.TAPREVIEW.delete("owner:" + token);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/owner",
        "Set-Cookie": "tr_owner=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
      },
    });
  }

  if (request.method === "POST") {
    const form = await request.formData();

    // Reset a single card (owner only)
    if (form.get("action") === "reset") {
      if (!(await isOwner(request, env))) return page(loginForm("Please log in first."));
      const card = String(form.get("card") || "").replace(/\D/g, "").slice(0, 6);
      if (card) {
        await env.TAPREVIEW.delete(card);
        await env.TAPREVIEW.delete("pin:" + card);
        await env.TAPREVIEW.delete("info:" + card);
        await env.TAPREVIEW.delete("fail:" + card);
      }
      return new Response(null, { status: 303, headers: { Location: "/owner" } });
    }

    // Login
    const pass = String(form.get("pass") || "");
    const expected = env.OWNER_PASS || "";

    // Small delay on every attempt slows brute force
    await new Promise((r) => setTimeout(r, 800));

    if (!expected || !safeEqual(pass, expected)) {
      return page(loginForm("Wrong password."));
    }

    const token = crypto.randomUUID();
    await env.TAPREVIEW.put("owner:" + token, "1", { expirationTtl: 3600 });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/owner",
        "Set-Cookie": `tr_owner=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
      },
    });
  }

  if (!(await isOwner(request, env))) {
    return page(loginForm(""));
  }

  return page(await dashboard(env));
}
