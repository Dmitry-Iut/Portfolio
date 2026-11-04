const FREE_DELIVERY = 3000;
const DELIVERY_PRICE = 350;

const priceFormat = new Intl.NumberFormat("ru-RU");
const formatPrice = (value) => `${priceFormat.format(value)} ₽`;

const playersText = ([min, max]) => (min === max ? `${min}` : `${min}–${max}`);

function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

const reviewsText = (n) =>
  n === 0 ? "Пока нет отзывов" : `${n} ${plural(n, "отзыв", "отзыва", "отзывов")}`;

const initials = (title) =>
  title
    .split(/[\s:.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const ICONS = {
  players:
    '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5a6.5 6.5 0 0 1 3 5.5"/></svg>',
  time: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/></svg>',
  cart: '<svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H6"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>',
  heart:
    '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.6 3.6 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.6 0 5.8 3.6 4.5 7.1-1.8 4.8-9.3 9.4-9.3 9.4z"/></svg>',
  prev: '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
};

function icon(name) {
  const span = el("span", { className: "icon", "aria-hidden": "true" });
  span.innerHTML = ICONS[name];
  return span;
}

let toastTimer;
function toast(text) {
  let box = document.querySelector(".toast");
  if (!box) {
    box = el("div", { className: "toast", role: "status" });
    document.body.append(box);
  }
  box.textContent = text;
  box.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove("is-visible"), 2400);
}

function watch(store, node, update) {
  const stop = store.subscribe(() => {
    if (!node.isConnected) {
      stop();
      return;
    }
    update();
  });
  update();
  return node;
}

function photo(game, src, index, className = "photo") {
  const img = el("img", {
    src,
    alt: `${game.title}, фото ${index + 1}`,
    loading: index === 0 ? "eager" : "lazy",
  });
  img.addEventListener("error", () => img.remove());
  return el("div", { className, "data-label": initials(game.title) }, img);
}

function carousel(game, { href, big = false } = {}) {
  let index = 0;
  const total = game.images.length;

  const track = el(
    "div",
    { className: "carousel__track" },
    game.images.map((src, i) => {
      const slide = photo(game, src, i, "carousel__slide photo");
      return href ? el("a", { href, tabIndex: -1, className: "carousel__link" }, slide) : slide;
    }),
  );

  const dots = game.images.map((_, i) =>
    el("button", {
      className: "carousel__dot",
      type: "button",
      "aria-label": `Фото ${i + 1}`,
      onclick: () => go(i),
    }),
  );

  const thumbs =
    big &&
    el(
      "div",
      { className: "thumbs" },
      game.images.map((src, i) =>
        el(
          "button",
          { className: "thumbs__item", type: "button", "aria-label": `Фото ${i + 1}`, onclick: () => go(i) },
          photo(game, src, i, "photo"),
        ),
      ),
    );

  function go(next) {
    index = (next + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    if (thumbs) {
      [...thumbs.children].forEach((t, i) => t.classList.toggle("is-active", i === index));
    }
  }

  const arrow = (dir, label, name) => {
    const button = el("button", {
      className: `carousel__btn carousel__btn--${name}`,
      type: "button",
      "aria-label": label,
      onclick: (e) => {
        e.preventDefault();
        go(index + dir);
      },
    });
    button.append(icon(name));
    return button;
  };

  const box = el(
    "div",
    { className: `carousel${big ? " carousel--big" : ""}` },
    track,
    arrow(-1, "Предыдущее фото", "prev"),
    arrow(1, "Следующее фото", "next"),
    el("div", { className: "carousel__dots" }, dots),
  );

  let startX = 0;
  let startY = 0;
  box.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    { passive: true },
  );
  box.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
  });

  go(0);
  return big ? el("div", { className: "gallery" }, box, thumbs) : box;
}

const badge = (game) =>
  game.badge && el("span", { className: `badge badge--${game.badge}` }, badgeTitle[game.badge]);

function chip(iconName, text, title) {
  const node = el("span", { className: "chip", title });
  if (iconName) node.append(icon(iconName));
  node.append(text);
  return node;
}

const gameChips = (game) =>
  el(
    "div",
    { className: "chips" },
    badge(game),
    chip("players", playersText(game.players), "Игроков"),
    chip("time", game.time, "Время партии, мин"),
    chip(null, `${game.age}+`, "Возраст"),
  );

function priceBlock(game, big = false) {
  return el(
    "div",
    { className: `price${big ? " price--big" : ""}` },
    el("span", { className: "price__now" }, formatPrice(game.price)),
    game.oldPrice && el("span", { className: "price__old" }, formatPrice(game.oldPrice)),
  );
}

function buyButton(game, { amount = () => 1 } = {}) {
  const button = el("button", { type: "button" });
  const preorder = game.badge === "preorder";

  button.addEventListener("click", () => {
    if (cart.has(game.id)) {
      location.hash = "#/cart";
      return;
    }
    cart.add(game.id, amount());
    toast(`«${game.title}» в корзине`);
  });

  return watch(cartStore, button, () => {
    const inCart = cart.has(game.id);
    button.className = `button button--buy${preorder ? " button--preorder" : ""}${inCart ? " is-added" : ""}`;
    button.replaceChildren(
      icon(inCart ? "check" : "cart"),
      el("span", {}, inCart ? "В корзине" : preorder ? "Предзаказ" : "Купить"),
    );
  });
}

function favButton(game, className = "fav") {
  const button = el("button", {
    className,
    type: "button",
    onclick: (e) => {
      e.preventDefault();
      const added = favorites.toggle(game.id);
      toast(added ? "Добавлено в избранное" : "Удалено из избранного");
    },
  });
  button.append(icon("heart"));
  return watch(favStore, button, () => {
    const active = favorites.has(game.id);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? "Убрать из избранного" : "В избранное");
  });
}

function gameCard(game) {
  const href = `#/catalog/${game.id}`;
  return el(
    "li",
    { className: "card" },
    el("div", { className: "card__media" }, carousel(game, { href }), favButton(game)),
    el(
      "div",
      { className: "card__body" },
      gameChips(game),
      el("a", { className: "card__category", href: `#/categories/${game.category}` }, findCategory(game.category).title),
      el("h3", { className: "card__title" }, el("a", { href }, game.title)),
      el("p", { className: "card__desc" }, game.short),
      el("p", { className: "card__reviews" }, reviewsText(game.reviews)),
      el("div", { className: "card__footer" }, priceBlock(game), buyButton(game)),
    ),
  );
}

const gameGrid = (list) => el("ul", { className: "cards" }, list.map(gameCard));

function stepper(value, onChange, min = 1) {
  const output = el("span", { className: "stepper__value" }, String(value));
  const set = (next) => {
    value = Math.max(min, Math.min(99, next));
    output.textContent = String(value);
    onChange(value);
  };
  return el(
    "div",
    { className: "stepper" },
    el("button", { type: "button", "aria-label": "Меньше", onclick: () => set(value - 1) }, "−"),
    output,
    el("button", { type: "button", "aria-label": "Больше", onclick: () => set(value + 1) }, "+"),
  );
}

function infoList(rows) {
  return el(
    "dl",
    { className: "info" },
    rows
      .filter(([, value]) => value != null)
      .flatMap(([key, value]) => [el("dt", {}, key), el("dd", {}, value)]),
  );
}

function emptyState(title, text, link) {
  return el(
    "div",
    { className: "empty" },
    el("p", { className: "empty__title" }, title),
    el("p", {}, text),
    link && el("a", { className: "button button--ghost", href: link[1] }, link[0]),
  );
}
