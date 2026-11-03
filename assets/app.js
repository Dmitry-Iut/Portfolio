// Рендер портфолио. Данные лежат в data/projects.js — этот файл трогать не нужно.
(function () {
  const D = window.PORTFOLIO;
  const body = document.body;
  const base = body.dataset.base || "";          // "" на главной, "../" в папках
  const current = body.dataset.section || "";     // "3d" | "web" | "figma" | "practice" | ""
  const order = ["3d", "web", "figma", "practice"];

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const src = p => (!p ? "" : /^https?:\/\//.test(p) ? p : base + p);
  const plural = n => { const a = n % 10, b = n % 100;
    return n + " " + (a === 1 && b !== 11 ? "работа" : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? "работы" : "работ"); };

  // ---------- шапка и подвал ----------
  const nav = order.map(k => {
    const s = D.sections[k];
    return `<a href="${base}${s.folder}/" class="${k === current ? "active" : ""}">${esc(s.title)}</a>`;
  }).join("");
  document.getElementById("top").innerHTML =
    `<div class="wrap"><a class="logo" href="${base || "./"}">${esc(D.owner.name)}<span>.</span></a><nav class="nav">${nav}</nav></div>`;
  document.getElementById("foot").innerHTML =
    `<div class="wrap"><span>© ${new Date().getFullYear()} ${esc(D.owner.name)}</span>
     ${D.owner.github ? `<a href="${esc(D.owner.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : ""}</div>`;

  // ---------- главная ----------
  if (!current) {
    document.title = D.owner.name + " — портфолио";
    const o = D.owner;
    const contacts = [
      o.github && `<a class="btn primary" href="${esc(o.github)}" target="_blank" rel="noopener">GitHub ↗</a>`,
      o.email && `<a class="btn" href="mailto:${esc(o.email)}">${esc(o.email)}</a>`,
      o.telegram && `<a class="btn" href="${esc(o.telegram)}" target="_blank" rel="noopener">Telegram ↗</a>`
    ].filter(Boolean).join("");
    document.getElementById("main").innerHTML = `
      <section class="hero"><div class="wrap">
        <div class="eyebrow reveal">Портфолио</div>
        <h1 class="reveal" style="animation-delay:.08s">${esc(o.name)}</h1>
        <p class="reveal" style="animation-delay:.16s">${esc(o.role)}. ${esc(o.about)}</p>
        <div class="contacts reveal" style="animation-delay:.24s">${contacts}</div>
      </div></section>
      <div class="wrap"><div class="sections">
        ${order.map((k, i) => { const s = D.sections[k]; return `
          <a class="section-card reveal" style="animation-delay:${.3 + i * .08}s" href="${s.folder}/">
            <div class="num">0${i + 1}</div>
            <div class="icon">${esc(s.icon)}</div>
            <div><h2>${esc(s.title)}</h2><p>${esc(s.lead)}</p>
              <div class="count"><span>${plural(s.projects.length)}</span><span class="arrow">→</span></div></div>
          </a>`; }).join("")}
      </div></div>`;
    return;
  }

  // ---------- страница раздела ----------
  const S = D.sections[current];
  document.title = S.title + " — " + D.owner.name;
  if (current === "3d" && S.projects.some(p => p.model)) {
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js";
    document.head.appendChild(s);
  }

  const tags = [...new Set(S.projects.flatMap(p => p.tags || []))];
  document.getElementById("main").innerHTML = `
    <div class="wrap">
      <header class="page-head">
        <a class="back" href="${base}">← Все разделы</a>
        <h1 class="reveal">${esc(S.title)}</h1>
        <p class="reveal" style="animation-delay:.08s">${esc(S.lead)}</p>
      </header>
      ${tags.length > 1 ? `<div class="filters"><button class="chip on" data-t="">Все</button>${tags.map(t => `<button class="chip" data-t="${esc(t)}">${esc(t)}</button>`).join("")}</div>` : ""}
      <div class="grid" id="grid"></div>
    </div>`;

  function media(p) {
    if (current === "3d" && p.model)
      return `<model-viewer src="${esc(src(p.model))}" ${p.image ? `poster="${esc(src(p.image))}"` : ""} camera-controls auto-rotate touch-action="pan-y" shadow-intensity="1" alt="${esc(p.title)}"></model-viewer><span class="badge">3D · покрути</span>`;
    if (current === "figma" && p.figma && !p.image)
      return `<iframe loading="lazy" allowfullscreen src="https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(p.figma)}"></iframe>`;
    if (p.image) return `<img loading="lazy" src="${esc(src(p.image))}" alt="${esc(p.title)}">`;
    return `<div class="placeholder">${esc(S.icon)}</div>`;
  }
  function links(p) {
    return [
      p.demo && `<a class="btn primary" href="${esc(p.demo)}" target="_blank" rel="noopener">Открыть ↗</a>`,
      p.code && `<a class="btn" href="${esc(p.code)}" target="_blank" rel="noopener">Код</a>`,
      p.figma && `<a class="btn primary" href="${esc(p.figma)}" target="_blank" rel="noopener">Открыть в Figma ↗</a>`,
      p.link && `<a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">Подробнее ↗</a>`
    ].filter(Boolean).join("");
  }
  function render(tag) {
    const list = S.projects.filter(p => !tag || (p.tags || []).includes(tag));
    document.getElementById("grid").innerHTML = list.length ? list.map((p, i) => `
      <article class="project reveal" style="animation-delay:${i * .06}s">
        <div class="media">${media(p)}</div>
        <div class="body">
          <h3>${esc(p.title)}</h3>
          ${(p.role || p.period || p.place) ? `<div class="meta">${[
            p.role && `<span><b>Роль:</b> ${esc(p.role)}</span>`,
            p.period && `<span><b>Когда:</b> ${esc(p.period)}</span>`,
            p.place && `<span><b>Где:</b> ${esc(p.place)}</span>`
          ].filter(Boolean).join("")}</div>` : ""}
          ${p.description ? `<p>${esc(p.description)}</p>` : ""}
          ${p.tags?.length ? `<div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
          <div class="links">${links(p)}</div>
        </div>
      </article>`).join("") : `<div class="empty">Здесь скоро появятся работы</div>`;
  }
  render("");
  document.querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(x => x.classList.toggle("on", x === b));
    render(b.dataset.t);
  }));
})();
