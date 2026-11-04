// Вспомогательные функции

const DAY = 24 * 60 * 60 * 1000;
const SOON_DAYS = 60; // за сколько дней предупреждать о ревакцинации

const dateFormat = new Intl.DateTimeFormat("ru-RU");
const formatDate = (iso) => dateFormat.format(new Date(iso));

const findOwner = (id) => owners.find((owner) => owner.id === id);
const findPet = (id) => pets.find((pet) => pet.id === id);
const petsOf = (ownerId) => pets.filter((pet) => pet.ownerId === ownerId);

// Ревакцинация — через год после прививки
function nextDate(iso) {
  const date = new Date(iso);
  date.setFullYear(date.getFullYear() + 1);
  return date;
}

const statusTitle = {
  ok: "Актуальна",
  soon: "Скоро",
  overdue: "Просрочена",
};

function vaccineStatus(iso) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((nextDate(iso) - today) / DAY);
  if (daysLeft < 0) return "overdue";
  if (daysLeft <= SOON_DAYS) return "soon";
  return "ok";
}

function petStatus(pet) {
  const statuses = pet.vaccines.map((v) => vaccineStatus(v.date));
  if (statuses.includes("overdue")) return "overdue";
  if (statuses.includes("soon")) return "soon";
  return "ok";
}

// Все прививки всех питомцев одним списком
const allVaccines = () =>
  pets.flatMap((pet) =>
    pet.vaccines.map((vaccine) => ({
      ...vaccine,
      pet,
      next: nextDate(vaccine.date),
      status: vaccineStatus(vaccine.date),
    })),
  );

const petStatusTitle = {
  ok: "Прививки в порядке",
  soon: "Скоро ревакцинация",
  overdue: "Прививка просрочена",
};

const statusBadge = (status, titles = statusTitle) =>
  el("span", { className: `status status--${status}` }, titles[status]);

// Всплывающее уведомление — видимый результат действия
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
  toastTimer = setTimeout(() => box.classList.remove("is-visible"), 2200);
}

function petCard(pet) {
  return el(
    "li",
    { className: "card" },
    el(
      "a",
      { className: "card__link", href: `#/pets/${pet.id}` },
      el("img", {
        className: "card__photo",
        src: pet.photo,
        alt: `${pet.name}, ${pet.breed.toLowerCase()}`,
        loading: "lazy",
      }),
      el(
        "div",
        { className: "card__body" },
        el("h3", { className: "card__title" }, pet.name),
        el("p", { className: "card__meta" }, `${pet.breed} · ${pet.ageText}`),
        statusBadge(petStatus(pet), petStatusTitle),
      ),
    ),
    el(
      "span",
      { className: `badge badge--${pet.species}` },
      speciesTitle[pet.species],
    ),
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

//  Страницы

function homeView() {
  const vaccines = allVaccines();
  const attention = vaccines
    .filter((v) => v.status !== "ok")
    .toSorted((a, b) => a.next - b.next);

  const stats = [
    ["Питомцев", pets.length, "#/pets"],
    ["Хозяев", owners.length, "#/owners"],
    [
      "Нужна прививка",
      pets.filter((pet) => petStatus(pet) !== "ok").length,
      "#/vaccines",
    ],
  ];

  return [
    el(
      "section",
      { className: "hero" },
      el("h1", {}, "Ветпаспорт"),
      el(
        "p",
        { className: "lead" },
        "Электронная база домашних питомцев: карточки, хозяева и календарь прививок в одном месте.",
      ),
      el(
        "div",
        { className: "hero__actions" },
        el("a", { className: "button", href: "#/pets" }, "Все питомцы"),
        el(
          "a",
          { className: "button button--ghost", href: "#/vaccines" },
          "Календарь прививок",
        ),
      ),
    ),
    el(
      "ul",
      { className: "stats" },
      stats.map(([label, value, href]) =>
        el(
          "li",
          {},
          el(
            "a",
            { className: "stat", href },
            el("strong", { className: "stat__value" }, String(value)),
            el("span", { className: "stat__label" }, label),
          ),
        ),
      ),
    ),
    el(
      "section",
      { className: "block" },
      el("h2", {}, "Требует внимания"),
      attention.length === 0
        ? el("p", { className: "empty" }, "Все прививки актуальны 🎉")
        : el(
            "ul",
            { className: "alerts" },
            attention.map((v) =>
              el(
                "li",
                { className: `alert alert--${v.status}` },
                el("a", { href: `#/pets/${v.pet.id}` }, v.pet.name),
                ` — ${v.name}, ревакцинация ${dateFormat.format(v.next)} `,
                statusBadge(v.status),
              ),
            ),
          ),
    ),
  ];
}

const petSorter = {
  name: (list) => list.toSorted((a, b) => a.name.localeCompare(b.name, "ru")),
  young: (list) => list.toSorted((a, b) => a.ageMonths - b.ageMonths),
  old: (list) => list.toSorted((a, b) => b.ageMonths - a.ageMonths),
  light: (list) => list.toSorted((a, b) => a.weight - b.weight),
  heavy: (list) => list.toSorted((a, b) => b.weight - a.weight),
};

function petsView(route) {
  const list = el("ul", { className: "cards" });
  const counter = el("p", { className: "counter", "aria-live": "polite" });

  const search = el("input", {
    id: "search",
    className: "input",
    type: "search",
    placeholder: "Имя или порода",
  });

  const species = el(
    "select",
    { id: "species", className: "select" },
    el("option", { value: "all" }, "Все"),
    el("option", { value: "dog" }, "Собаки"),
    el("option", { value: "cat" }, "Кошки"),
  );

  const status = el(
    "select",
    { id: "status", className: "select" },
    el("option", { value: "all" }, "Любые"),
    el("option", { value: "ok" }, "Актуальны"),
    el("option", { value: "soon" }, "Скоро ревакцинация"),
    el("option", { value: "overdue" }, "Просрочены"),
  );

  const sort = el(
    "select",
    { id: "sort", className: "select" },
    el("option", { value: "name" }, "по имени"),
    el("option", { value: "young" }, "сначала младшие"),
    el("option", { value: "old" }, "сначала старшие"),
    el("option", { value: "light" }, "сначала лёгкие"),
    el("option", { value: "heavy" }, "сначала тяжёлые"),
  );

  const reset = el(
    "button",
    { className: "button button--small button--ghost", type: "button" },
    "Сбросить",
  );

  function renderList() {
    const query = search.value.trim().toLowerCase();
    const filtered = pets.filter(
      (pet) =>
        (species.value === "all" || pet.species === species.value) &&
        (status.value === "all" || petStatus(pet) === status.value) &&
        (pet.name.toLowerCase().includes(query) ||
          pet.breed.toLowerCase().includes(query)),
    );
    const sorted = petSorter[sort.value](filtered);

    counter.textContent = `Найдено: ${sorted.length} из ${pets.length}`;
    if (sorted.length === 0) {
      list.replaceChildren(
        el(
          "li",
          { className: "empty" },
          "Никого не нашли. Попробуйте изменить фильтры.",
        ),
      );
    } else {
      list.replaceChildren(...sorted.map(petCard));
    }
  }

  search.addEventListener("input", renderList);
  for (const select of [species, status, sort]) {
    select.addEventListener("change", renderList);
  }
  reset.addEventListener("click", () => {
    search.value = "";
    species.value = "all";
    status.value = "all";
    sort.value = "name";
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
      field("Вид", "species", species),
      field("Прививки", "status", status),
      field("Сортировка", "sort", sort),
      reset,
    ),
    counter,
    list,
  ];
}

function petView(route) {
  const pet = findPet(route.slug);
  const owner = findOwner(pet.ownerId);

  const chipButton =
    pet.chip &&
    el(
      "button",
      { className: "button button--small", type: "button" },
      "Скопировать номер чипа",
    );
  chipButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pet.chip);
      toast(`Номер чипа ${pet.chip} скопирован`);
    } catch {
      toast(`Номер чипа: ${pet.chip}`);
    }
  });

  const vaccines = pet.vaccines.toSorted((a, b) =>
    b.date.localeCompare(a.date),
  );

  return [
    el(
      "article",
      { className: "pet" },
      el("img", {
        className: "pet__photo",
        src: pet.photo,
        alt: `${pet.name}, ${pet.breed.toLowerCase()}`,
      }),
      el(
        "div",
        { className: "pet__info" },
        el("h1", {}, pet.name),
        statusBadge(petStatus(pet), petStatusTitle),
        infoList([
          ["Вид", speciesTitle[pet.species]],
          ["Пол", pet.sex],
          ["Порода", pet.breed],
          ["Окрас", pet.color],
          ["Возраст", pet.ageText],
          ["Вес", pet.weightText],
          ["Чип", pet.chip ?? "нет"],
          ["Хозяин", el("a", { href: `#/owners/${owner.id}` }, owner.name)],
        ]),
        chipButton,
      ),
    ),
    el(
      "section",
      { className: "block" },
      el("h2", {}, "Прививки"),
      vaccineTable(
        vaccines.map((v) => ({
          ...v,
          next: nextDate(v.date),
          status: vaccineStatus(v.date),
        })),
        false,
      ),
    ),
    el(
      "section",
      { className: "block" },
      el("h2", {}, "Заметки"),
      el("blockquote", { className: "note" }, pet.notes),
    ),
  ];
}

function vaccineTable(rows, withPet = true) {
  if (rows.length === 0) {
    return el("p", { className: "empty" }, "Прививок с такими условиями нет.");
  }
  return el(
    "div",
    { className: "table-wrap" },
    el(
      "table",
      { className: "table" },
      el(
        "thead",
        {},
        el(
          "tr",
          {},
          withPet && el("th", { scope: "col" }, "Питомец"),
          el("th", { scope: "col" }, "Вакцина"),
          el("th", { scope: "col" }, "Тип"),
          el("th", { scope: "col" }, "Дата"),
          el("th", { scope: "col" }, "Ревакцинация"),
          el("th", { scope: "col" }, "Статус"),
        ),
      ),
      el(
        "tbody",
        {},
        rows.map((v) =>
          el(
            "tr",
            {},
            withPet &&
              el(
                "td",
                { "data-label": "Питомец" },
                el("a", { href: `#/pets/${v.pet.id}` }, v.pet.name),
              ),
            el("td", { "data-label": "Вакцина" }, v.name),
            el("td", { "data-label": "Тип" }, v.type),
            el("td", { "data-label": "Дата" }, formatDate(v.date)),
            el(
              "td",
              { "data-label": "Ревакцинация" },
              dateFormat.format(v.next),
            ),
            el("td", { "data-label": "Статус" }, statusBadge(v.status)),
          ),
        ),
      ),
    ),
  );
}

function ownersView(route) {
  return [
    el("h1", {}, route.title),
    el(
      "ul",
      { className: "owners" },
      owners.map((owner) => {
        const ownPets = petsOf(owner.id);
        return el(
          "li",
          {},
          el(
            "a",
            { className: "owner-card", href: `#/owners/${owner.id}` },
            el(
              "span",
              { className: "avatar", "aria-hidden": "true" },
              owner.name[0],
            ),
            el(
              "span",
              {},
              el("strong", { className: "owner-card__name" }, owner.name),
              el(
                "span",
                { className: "owner-card__pets" },
                ownPets.map((pet) => pet.name).join(", "),
              ),
            ),
            el(
              "span",
              { className: "owner-card__count" },
              String(ownPets.length),
            ),
          ),
        );
      }),
    ),
  ];
}

function ownerView(route) {
  const owner = findOwner(route.slug);
  const ownPets = petsOf(owner.id);

  const track = el(
    "ul",
    { className: "carousel__track" },
    ownPets.map(petCard),
  );
  const prev = el(
    "button",
    {
      className: "carousel__btn",
      type: "button",
      "aria-label": "Предыдущий питомец",
    },
    "‹",
  );
  const next = el(
    "button",
    {
      className: "carousel__btn",
      type: "button",
      "aria-label": "Следующий питомец",
    },
    "›",
  );
  const scrollBy = (dir) =>
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: "smooth" });
  prev.addEventListener("click", () => scrollBy(-1));
  next.addEventListener("click", () => scrollBy(1));

  return [
    el(
      "section",
      { className: "owner" },
      el(
        "span",
        { className: "avatar avatar--big", "aria-hidden": "true" },
        owner.name[0],
      ),
      el(
        "div",
        {},
        el("h1", {}, owner.name),
        infoList([
          [
            "Телефон",
            el(
              "a",
              { href: `tel:${owner.phone.replace(/[^\d+]/g, "")}` },
              owner.phone,
            ),
          ],
          ["Город", owner.city],
          ["Клиент с", `${owner.since} года`],
          ["Питомцев", String(ownPets.length)],
        ]),
      ),
    ),
    el(
      "section",
      { className: "block carousel" },
      el(
        "div",
        { className: "carousel__head" },
        el("h2", {}, "Питомцы"),
        ownPets.length > 1 &&
          el("div", { className: "carousel__nav" }, prev, next),
      ),
      track,
    ),
  ];
}

const vaccineSorter = {
  next: (list) => list.toSorted((a, b) => a.next - b.next),
  recent: (list) => list.toSorted((a, b) => b.date.localeCompare(a.date)),
  pet: (list) =>
    list.toSorted((a, b) => a.pet.name.localeCompare(b.pet.name, "ru")),
};

function vaccinesView(route) {
  const all = allVaccines();
  const box = el("div");

  const tabs = [
    ["all", "Все"],
    ["ok", "Актуальны"],
    ["soon", "Скоро"],
    ["overdue", "Просрочены"],
  ];
  let current = "all";

  const tabList = el(
    "div",
    { className: "chips", role: "group", "aria-label": "Фильтр по статусу" },
    tabs.map(([value, title]) => {
      const count =
        value === "all"
          ? all.length
          : all.filter((v) => v.status === value).length;
      const button = el(
        "button",
        { className: "chip", type: "button", "data-value": value },
        `${title} (${count})`,
      );
      button.addEventListener("click", () => {
        current = value;
        render();
      });
      return button;
    }),
  );

  const sort = el(
    "select",
    { id: "vsort", className: "select" },
    el("option", { value: "next" }, "по дате ревакцинации"),
    el("option", { value: "recent" }, "сначала свежие"),
    el("option", { value: "pet" }, "по питомцу"),
  );
  sort.addEventListener("change", render);

  function render() {
    for (const chip of tabList.children) {
      chip.setAttribute("aria-pressed", String(chip.dataset.value === current));
    }
    const filtered = all.filter(
      (v) => current === "all" || v.status === current,
    );
    box.replaceChildren(vaccineTable(vaccineSorter[sort.value](filtered)));
  }
  render();

  return [
    el("h1", {}, route.title),
    el(
      "p",
      { className: "lead" },
      `Ревакцинация — через год после прививки. «Скоро» — осталось меньше ${SOON_DAYS} дней.`,
    ),
    el(
      "div",
      { className: "toolbar" },
      tabList,
      el(
        "div",
        { className: "field" },
        el("label", { htmlFor: "vsort" }, "Сортировка"),
        sort,
      ),
    ),
    box,
  ];
}

function aboutView(route) {
  return [
    el("h1", {}, route.title),
    el(
      "p",
      { className: "lead" },
      "«Ветпаспорт» — учебное веб-приложение: база домашних питомцев с карточками, хозяевами и прививками.",
    ),
    infoList([
      ["Автор", "Иутинский Дмитрий"],
      ["Группа", "24-ИМбо-3а, КГУ «Высшая ИТ-школа»"],
      ["Технологии", "HTML, CSS, JavaScript (модули)"],
    ]),
  ];
}

function notFoundView(path) {
  return [
    el("h1", {}, "Страница не найдена"),
    el("p", {}, `Раздела ${path} нет. Возможно, питомец убежал 🐾`),
    el("a", { className: "button", href: "#/" }, "Вернуться на главную"),
  ];
}

const views = {
  home: homeView,
  pets: petsView,
  pet: petView,
  owners: ownersView,
  owner: ownerView,
  vaccines: vaccinesView,
  about: aboutView,
};
