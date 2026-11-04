function homeView() {
  const hits = games
    .toSorted((a, b) => b.popularity - a.popularity)
    .slice(0, 4);
  const fresh = games.filter(
    (game) => game.badge === "new" || game.badge === "preorder",
  );

  return [
    el(
      "section",
      { className: "hero" },
      el(
        "div",
        { className: "hero__content" },
        el("p", { className: "hero__label" }, "Издательство настольных игр"),
        el(
          "h1",
          { className: "hero__title" },
          "Игры, ради которых собираются вместе",
        ),
        el(
          "p",
          { className: "lead" },
          "Карточные, ролевые, стратегии и приключения. Выпускаем сами и отправляем по всей России.",
        ),
        el(
          "div",
          { className: "hero__actions" },
          el(
            "a",
            { className: "button", href: "#/catalog" },
            "Смотреть каталог",
          ),
          el(
            "a",
            { className: "button button--ghost", href: "#/categories" },
            "Категории",
          ),
        ),
      ),
      el(
        "ul",
        { className: "stats" },
        [
          [String(games.length), "игр в каталоге", "#/catalog"],
          [String(categories.length), "категории", "#/categories"],
          ["от 3 000 ₽", "бесплатная доставка", "#/about"],
        ].map(([value, label, href]) =>
          el(
            "li",
            {},
            el(
              "a",
              { className: "stat", href },
              el("strong", { className: "stat__value" }, value),
              el("span", { className: "stat__label" }, label),
            ),
          ),
        ),
      ),
    ),
    el(
      "section",
      { className: "block" },
      el(
        "div",
        { className: "block__head" },
        el("h2", {}, "Популярное"),
        el("a", { className: "more", href: "#/catalog" }, "Весь каталог →"),
      ),
      gameGrid(hits),
    ),
    el(
      "section",
      { className: "block" },
      el("h2", {}, "Категории"),
      categoryList(),
    ),
    el(
      "section",
      { className: "block" },
      el("h2", {}, "Новинки и предзаказ"),
      gameGrid(fresh),
    ),
  ];
}

const gameSorter = {
  popular: (list) => list.toSorted((a, b) => b.popularity - a.popularity),
  cheap: (list) => list.toSorted((a, b) => a.price - b.price),
  expensive: (list) => list.toSorted((a, b) => b.price - a.price),
  title: (list) =>
    list.toSorted((a, b) => a.title.localeCompare(b.title, "ru")),
};

function catalogView(route) {
  const list = el("div");
  const counter = el("p", { className: "counter", "aria-live": "polite" });

  const search = el("input", {
    id: "search",
    className: "input",
    type: "search",
    placeholder: "Название игры",
    autocomplete: "off",
  });

  const category = el(
    "select",
    { id: "category", className: "select" },
    el("option", { value: "all" }, "Все"),
    categories.map((c) => el("option", { value: c.id }, c.title)),
  );

  const players = el(
    "select",
    { id: "players", className: "select" },
    el("option", { value: "all" }, "Любое"),
    el("option", { value: "1" }, "Один"),
    el("option", { value: "2" }, "Вдвоём"),
    el("option", { value: "4" }, "До 4"),
    el("option", { value: "6" }, "До 6"),
    el("option", { value: "8" }, "8 и больше"),
  );

  const age = el(
    "select",
    { id: "age", className: "select" },
    el("option", { value: "all" }, "Любой"),
    el("option", { value: "8" }, "С детьми (до 8+)"),
    el("option", { value: "12" }, "Подросткам (до 12+)"),
    el("option", { value: "16" }, "Взрослым (16+)"),
  );

  const sort = el(
    "select",
    { id: "sort", className: "select" },
    el("option", { value: "popular" }, "сначала популярные"),
    el("option", { value: "cheap" }, "сначала дешевле"),
    el("option", { value: "expensive" }, "сначала дороже"),
    el("option", { value: "title" }, "по названию"),
  );

  const reset = el(
    "button",
    { className: "button button--small button--ghost", type: "button" },
    "Сбросить",
  );

  const byPlayers = (game) => {
    const n = Number(players.value);
    if (players.value === "all") return true;
    if (n === 8) return game.players[1] >= 8;
    return game.players[0] <= n && game.players[1] >= n;
  };

  const byAge = (game) => {
    const n = Number(age.value);
    if (age.value === "all") return true;
    if (n === 16) return game.age >= 16;
    return game.age <= n;
  };

  function renderList() {
    const query = search.value.trim().toLowerCase();
    const filtered = games.filter(
      (game) =>
        (category.value === "all" || game.category === category.value) &&
        byPlayers(game) &&
        byAge(game) &&
        game.title.toLowerCase().includes(query),
    );
    const sorted = gameSorter[sort.value](filtered);

    counter.textContent = `Найдено: ${sorted.length} из ${games.length}`;
    list.replaceChildren(
      sorted.length
        ? gameGrid(sorted)
        : emptyState(
            "Ничего не нашлось",
            "Попробуйте изменить фильтры или запрос.",
          ),
    );
  }

  search.addEventListener("input", renderList);
  for (const select of [category, players, age, sort]) {
    select.addEventListener("change", renderList);
  }
  reset.addEventListener("click", () => {
    search.value = "";
    category.value = "all";
    players.value = "all";
    age.value = "all";
    sort.value = "popular";
    renderList();
    toast("Фильтры сброшены");
  });

  renderList();

  const field = (label, id, control) =>
    el(
      "div",
      { className: "field" },
      el("label", { htmlFor: id }, label),
      control,
    );

  return [
    el("h1", {}, route.title),
    el(
      "form",
      {
        className: "toolbar",
        role: "search",
        onsubmit: (e) => e.preventDefault(),
      },
      field("Поиск", "search", search),
      field("Категория", "category", category),
      field("Игроков", "players", players),
      field("Возраст", "age", age),
      field("Сортировка", "sort", sort),
      reset,
    ),
    counter,
    list,
  ];
}

function gameView(route) {
  const game = findGame(route.slug);
  const category = findCategory(game.category);
  let amount = 1;

  const similar = games
    .filter((g) => g.id !== game.id)
    .toSorted(
      (a, b) =>
        (b.category === game.category) - (a.category === game.category) ||
        b.popularity - a.popularity,
    )
    .slice(0, 4);

  const tabs = [
    [
      "about",
      "Описание",
      () => game.description.map((text) => el("p", {}, text)),
    ],
    [
      "contents",
      "Комплектация",
      () =>
        el(
          "ul",
          { className: "list" },
          game.contents.map((item) => el("li", {}, item)),
        ),
    ],
    [
      "rules",
      "Как играть",
      () =>
        el(
          "ol",
          { className: "steps" },
          game.steps.map((step) => el("li", {}, step)),
        ),
    ],
  ];

  const panel = el("div", { className: "tabs__panel", role: "tabpanel" });
  const tabButtons = tabs.map(([id, title, render]) => {
    const button = el(
      "button",
      { className: "tabs__btn", type: "button", role: "tab" },
      title,
    );
    button.addEventListener("click", () => {
      tabButtons.forEach((b) =>
        b.setAttribute("aria-selected", String(b === button)),
      );
      panel.replaceChildren(...[render()].flat());
    });
    return button;
  });
  tabButtons[0].click();

  return [
    el(
      "article",
      { className: "game" },
      carousel(game, { big: true }),
      el(
        "div",
        { className: "game__info" },
        gameChips(game),
        el("h1", { className: "game__title" }, game.title),
        el(
          "p",
          { className: "game__meta" },
          el("a", { href: `#/categories/${category.id}` }, category.title),
          " · ",
          game.rating
            ? `★ ${game.rating} · ${reviewsText(game.reviews)}`
            : reviewsText(game.reviews),
        ),
        el("p", { className: "lead" }, game.short),
        el(
          "div",
          { className: "buy-box" },
          priceBlock(game, true),
          el(
            "div",
            { className: "buy-box__row" },
            stepper(1, (value) => (amount = value)),
            buyButton(game, { amount: () => amount }),
            favButton(game, "fav fav--static"),
          ),
          el(
            "p",
            { className: "buy-box__note" },
            game.badge === "preorder"
              ? "Отправим сразу после выхода тиража"
              : `В наличии · бесплатная доставка от ${formatPrice(FREE_DELIVERY)}`,
          ),
        ),
        infoList([
          ["Игроков", playersText(game.players)],
          ["Время партии", `${game.time} мин`],
          ["Возраст", `${game.age}+`],
          ["Сложность", game.difficulty],
          ["Год выпуска", String(game.year)],
          ["Артикул", game.sku],
        ]),
      ),
    ),
    el(
      "section",
      { className: "block tabs" },
      el("div", { className: "tabs__list", role: "tablist" }, tabButtons),
      panel,
    ),
    el(
      "section",
      { className: "block" },
      el("h2", {}, "Похожие игры"),
      gameGrid(similar),
    ),
  ];
}

function categoryList() {
  return el(
    "ul",
    { className: "categories" },
    categories.map((category) => {
      const count = gamesOf(category.id).length;
      return el(
        "li",
        {},
        el(
          "a",
          { className: "category-card", href: `#/categories/${category.id}` },
          el("strong", { className: "category-card__title" }, category.title),
          el("span", { className: "category-card__text" }, category.text),
          el(
            "span",
            { className: "category-card__count" },
            `${count} ${plural(count, "игра", "игры", "игр")}`,
          ),
        ),
      );
    }),
  );
}

function categoriesView(route) {
  return [el("h1", {}, route.title), categoryList()];
}

function categoryView(route) {
  const category = findCategory(route.slug);
  return [
    el("h1", {}, category.title),
    el("p", { className: "lead" }, category.text),
    gameGrid(gamesOf(category.id)),
  ];
}

function favoritesView(route) {
  const box = el("div");
  return [
    el("h1", {}, route.title),
    watch(favStore, box, () => {
      const list = favorites.list();
      box.replaceChildren(
        list.length
          ? gameGrid(list)
          : emptyState(
              "Здесь пока пусто",
              "Нажмите ♡ на карточке игры, чтобы сохранить её.",
              ["В каталог", "#/catalog"],
            ),
      );
    }),
  ];
}

function cartRow({ game, qty }) {
  const remove = el("button", {
    className: "icon-btn icon-btn--small",
    type: "button",
    "aria-label": "Удалить",
    onclick: () => {
      cart.remove(game.id);
      toast(`«${game.title}» удалена из корзины`);
    },
  });
  remove.append(icon("trash"));

  return el(
    "li",
    { className: "cart-item" },
    el(
      "a",
      { href: `#/catalog/${game.id}`, className: "cart-item__photo" },
      photo(game, game.images[0], 0),
    ),
    el(
      "div",
      { className: "cart-item__info" },
      el(
        "a",
        { className: "cart-item__title", href: `#/catalog/${game.id}` },
        game.title,
      ),
      el(
        "span",
        { className: "cart-item__meta" },
        `${formatPrice(game.price)} за шт.`,
      ),
      stepper(qty, (value) => cart.setQty(game.id, value)),
    ),
    el(
      "strong",
      { className: "cart-item__sum" },
      formatPrice(game.price * qty),
    ),
    remove,
  );
}

function orderForm() {
  const name = el("input", {
    id: "name",
    className: "input",
    required: true,
    autocomplete: "name",
    placeholder: "Иван Иванов",
  });
  const phone = el("input", {
    id: "phone",
    className: "input",
    type: "tel",
    required: true,
    autocomplete: "tel",
    placeholder: "+7 (900) 000-00-00",
    // Скобки внутри [...] без экранирования ломают pattern (браузеры
    // компилируют его с флагом v) — тогда проверка молча отключается.
    pattern: String.raw`(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}`,
    title: "Формат: +7 (900) 000-00-00 или 89000000000",
  });
  phone.addEventListener("input", () => phone.setCustomValidity(""));
  phone.addEventListener("invalid", () => {
    if (phone.validity.patternMismatch) {
      phone.setCustomValidity("Введите номер в формате +7 (900) 000-00-00");
    }
  });
  const delivery = el(
    "select",
    { id: "delivery", className: "select" },
    el("option", { value: "courier" }, "Курьером"),
    el("option", { value: "pickup" }, "Пункт выдачи"),
  );

  const field = (label, id, control) =>
    el(
      "div",
      { className: "field" },
      el("label", { htmlFor: id }, label),
      control,
    );

  const form = el(
    "form",
    { className: "order-form", noValidate: false },
    field("Имя", "name", name),
    field("Телефон", "phone", phone),
    field("Доставка", "delivery", delivery),
    el(
      "button",
      { className: "button button--block", type: "submit" },
      "Оформить заказ",
    ),
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const number = Math.floor(100000 + Math.random() * 900000);
    cart.clear();
    toast(
      `Заказ №${number} оформлен. Мы позвоним, ${name.value.split(" ")[0]}!`,
    );
  });

  return form;
}

function cartView(route) {
  const box = el("div");

  function render() {
    const entries = cart.entries();
    if (entries.length === 0) {
      box.replaceChildren(
        emptyState("В корзине пока пусто", "Добавьте игры из каталога.", [
          "В каталог",
          "#/catalog",
        ]),
      );
      return;
    }

    const total = cart.total();
    const delivery = total >= FREE_DELIVERY ? 0 : DELIVERY_PRICE;
    const left = FREE_DELIVERY - total;

    box.replaceChildren(
      el(
        "div",
        { className: "cart" },
        el(
          "div",
          {},
          el("ul", { className: "cart__list" }, entries.map(cartRow)),
          el(
            "button",
            {
              className: "link-btn",
              type: "button",
              onclick: () => {
                cart.clear();
                toast("Корзина очищена");
              },
            },
            "Очистить корзину",
          ),
        ),
        el(
          "aside",
          { className: "summary" },
          el("h2", {}, "Ваш заказ"),
          infoList([
            [`Товары (${cart.count()})`, formatPrice(total)],
            ["Доставка", delivery ? formatPrice(delivery) : "Бесплатно"],
          ]),
          left > 0 &&
            el(
              "p",
              { className: "summary__hint" },
              `Добавьте товаров на ${formatPrice(left)} — доставка будет бесплатной`,
            ),
          el(
            "p",
            { className: "summary__total" },
            el("span", {}, "Итого"),
            el("strong", {}, formatPrice(total + delivery)),
          ),
          orderForm(),
        ),
      ),
    );
  }

  return [el("h1", {}, route.title), watch(cartStore, box, render)];
}

function aboutView(route) {
  const features = [
    [
      "Своё производство",
      "Сами разрабатываем, печатаем и проверяем каждую коробку.",
    ],
    [
      "Быстрая доставка",
      `Курьером или в пункт выдачи за 1–3 дня. Бесплатно от ${formatPrice(FREE_DELIVERY)}.`,
    ],
    [
      "Гарантия комплектности",
      "Потерялась фишка или карта — пришлём замену бесплатно.",
    ],
  ];

  return [
    el("h1", {}, route.title),
    el(
      "p",
      { className: "lead" },
      "«Фишка» — издательство настольных игр. Делаем игры для семьи, друзей и больших компаний.",
    ),
    el(
      "ul",
      { className: "features" },
      features.map(([title, text]) =>
        el(
          "li",
          { className: "feature" },
          el("h3", {}, title),
          el("p", {}, text),
        ),
      ),
    ),
    el(
      "section",
      { className: "block" },
      el("h2", {}, "Контакты"),
      infoList([
        ["Телефон", el("a", { href: "tel:+78000000000" }, "8 800 000-00-00")],
        ["Почта", el("a", { href: "mailto:shop@fishka.ru" }, "shop@fishka.ru")],
        ["Город", "Кострома"],
        ["Автор сайта", "Иутинский Дмитрий"],
      ]),
    ),
  ];
}

function notFoundView(path) {
  return [
    el("h1", {}, "Страница не найдена"),
    el("p", {}, `Раздела ${path} нет. Похоже, фишка укатилась под стол.`),
    el("a", { className: "button", href: "#/" }, "Вернуться на главную"),
  ];
}

const views = {
  home: homeView,
  catalog: catalogView,
  game: gameView,
  categories: categoriesView,
  category: categoryView,
  favorites: favoritesView,
  cart: cartView,
  about: aboutView,
};
