const models = [
  { thumb: "house_by_the_sea", full: "house _by_the _sea.png", title: "Домик у моря" },
  { thumb: "ship_poster", full: "ship.mp4", title: "Кораблик в море — анимация", video: true },
  { thumb: "ship_day", full: "ship_day.png", title: "Кораблик в море — день" },
  { thumb: "ship_night", full: "ship_night.png", title: "Кораблик в море — ночь" },
  { thumb: "ship_night2", full: "ship_night2.png", title: "Кораблик в море — ночь, другой ракурс" },
  { thumb: "duck", full: "duck.png", title: "Утка" },
  { thumb: "room_full", full: "room full.png", title: "Интерьер комнаты" },
  { thumb: "book_anb_chashka2", full: "book anb chashka2.png", title: "Книги и чашки" },
  { thumb: "minion", full: "minion.png", title: "Миньон" },
  { thumb: "The_phoenix", full: "The_phoenix.png", title: "Феникс" },
  { thumb: "perfume", full: "perfume.jpg", title: "Флакон духов" },
  { thumb: "perfume2", full: "perfume2.jpg", title: "Флакон духов — другой ракурс" },
  { thumb: "model1", full: "model1.jpg", title: "Флакон духов — предметная съёмка" },
  { thumb: "flower_and_hat_and_vase", full: "flower and hat and vase.jpg", title: "Цветок, шляпа и ваза" },
  { thumb: "VASE", full: "VASE.png", title: "Ваза" },
  { thumb: "flower", full: "flower.jpg", title: "Цветок" },
  { thumb: "Texture", full: "Texture.jpg", title: "Материалы и текстуры" }
];

const course = [
  { thumb: "MacBook_Pro_-_2", full: "MacBook Pro - 2.jpg", title: "MDR Ultra Light — первый экран для дрона" },
  { thumb: "fan", full: "fan.jpg", title: "Whoosh — первый экран для фена" },
  { thumb: "perfumery", full: "perfumery.jpg", title: "Perfume Mode — магазин парфюмерии" },
  { thumb: "fitness", full: "fitness.jpg", title: "X'Flow Gym — фитнес-клуб" }
];

const certificate = { thumb: "certificate", full: "certificate.jpg", title: "Сертификат YUDAEV.SCHOOL о прохождении обучения по веб-дизайну" };

const figma = [
  { group: "Курсовая работа", title: "Игра «Манчкины»", text: "Дизайн карточной игры", url: "https://www.figma.com/design/LM1GfDHWs3m9Pgtd3JOa5j/Курсовая-работа?t=HWRuZFCQE8TTkOve-0" },
  { group: "Курсовая работа", title: "Электронное портфолио", text: "Прототип интерфейса", url: "https://www.figma.com/design/JV5Elgo30oVFzCP4bgBCe8/%D0%BB%D0%B0%D0%B1%D0%B0-%D0%B2%D0%B5%D0%B1-%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-2?node-id=529-1154&t=0Lw1l4mSR4DAmTGS-1" },
  { group: "Компьютерная графика", title: "«Камень, ножницы, бумага»", text: "Карты и интерфейс карточной игры", url: "https://www.figma.com/design/4MmsiNsKZ0HFKu22vCFULd/%D0%BA%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D0%BD%D0%B0%D1%8F-%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B0?t=HWRuZFCQE8TTkOve-1" },
  { group: "Веб-дизайн", title: "Грузинский ресторан", text: "Прототип сайта", url: "https://www.figma.com/design/JV5Elgo30oVFzCP4bgBCe8/%D0%BB%D0%B0%D0%B1%D0%B0-%D0%B2%D0%B5%D0%B1-%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-2?node-id=0-1&t=0Lw1l4mSR4DAmTGS-1" },
  { group: "Дизайн-проект", title: "ПиццаКлаб", text: "Дизайн для пиццерии", url: "https://www.figma.com/design/tpqzxfTpRM0wReK9EnCBnZ/%D0%9F%D0%B8%D1%86%D1%86%D0%B0%D0%9A%D0%BB%D0%B0%D0%B1?node-id=0-1&t=HWRuZFCQE8TTkOve-1" },
  { group: "Инфографика", title: "История компьютерной графики", text: "Основные этапы развития", url: "https://www.figma.com/design/WTOdI8qlWeasZHy3yZFxz3/%D0%98%D0%BD%D1%84%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B0?t=HWRuZFCQE8TTkOve-1" },
  { group: "Практика", title: "Space", text: "Мини-игра ко Дню космонавтики", url: "https://www.figma.com/design/ZoXlmP57n46gRokn2EPjQd/Space?t=HWRuZFCQE8TTkOve-1" },
  { group: "Практика", title: "Музей сладостей", text: "Макеты веб-игры", url: "https://www.figma.com/design/4335ww4KQNeCONw6IRcUs6/%D0%A1%D0%9A%D0%91%D0%A2-%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0?node-id=105-26&t=CyLHAzmLSKX5TTX1-1" }
];

const sets = {
  "3d": models.map(m => ({ ...m, src: encodeURI("3d-modeling/media/" + m.full) })),
  course: course.map(m => ({ ...m, src: encodeURI("figma/media/prototype_course/" + m.full) })),
  certificate: [{ ...certificate, src: "figma/media/prototype_course/certificate.jpg" }]
};

function renderGallery(name) {
  const box = document.querySelector(`[data-gallery="${name}"]`);
  sets[name].forEach((item, i) => {
    const tile = document.createElement("button");
    tile.className = "tile";
    tile.innerHTML = `<img src="assets/thumbs/${item.thumb}.webp" alt="${item.title}" loading="lazy">${item.video ? '<i class="play">▶</i>' : ""}<span>${item.title}</span>`;
    tile.addEventListener("click", () => openLightbox(name, i));
    box.appendChild(tile);
  });
}

renderGallery("3d");
renderGallery("course");

document.getElementById("figmaList").innerHTML = figma.map(f => `
  <a class="figma-item" href="${f.url}" target="_blank" rel="noopener">
    <div><small>${f.group}</small><h4>${f.title}</h4><p>${f.text}</p></div>
    <span class="arrow">↗</span>
  </a>`).join("");

const lb = document.getElementById("lightbox");
const lbMedia = lb.querySelector(".lb-media");
const lbCaption = lb.querySelector("figcaption");
let current = { set: null, index: 0 };

function showItem() {
  const list = sets[current.set];
  const item = list[current.index];
  lbMedia.innerHTML = item.video
    ? `<video src="${item.src}" controls autoplay loop playsinline></video>`
    : `<img src="${item.src}" alt="${item.title}">`;
  lbCaption.textContent = `${item.title} · ${current.index + 1} / ${list.length}`;
  const many = list.length > 1;
  lb.querySelector(".lb-prev").hidden = !many;
  lb.querySelector(".lb-next").hidden = !many;
}

function openLightbox(set, index) {
  current = { set, index };
  showItem();
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lb.hidden = true;
  lbMedia.innerHTML = "";
  document.body.style.overflow = "";
}

function step(d) {
  const len = sets[current.set].length;
  current.index = (current.index + d + len) % len;
  showItem();
}

lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
lb.querySelector(".lb-prev").addEventListener("click", () => step(-1));
lb.querySelector(".lb-next").addEventListener("click", () => step(1));
lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

let touchX = null;
lb.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  touchX = null;
});

document.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => openLightbox(b.dataset.open, 0)));

const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  burger.classList.remove("open");
  navLinks.classList.remove("open");
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".section-title, .about-grid, .skill, .web-card, .game, .course, .figma-item, .tile, .pr, .contacts").forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});
