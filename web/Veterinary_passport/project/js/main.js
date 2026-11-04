const root = createRoute(siteMap);
const routes = flatten(root);

const nav = document.querySelector("#site-nav");
const burger = document.querySelector(".burger");
const app = document.querySelector("#app");
const breadcrumbs = document.querySelector(".breadcrumbs");


function renderNav(items) {
  return el(
    "ul",
    { className: "nav__list" },
    items
      .filter((route) => !route.hidden)
      .map((route) =>
        el(
          "li",
          { className: "nav__item" },
          el(
            "a",
            {
              className: "nav__link",
              href: `#${route.path}`,
              "data-path": route.path,
            },
            route.title,
          ),
        ),
      ),
  );
}

function highlight(route) {
  const trailPaths = new Set(getTrail(route).map((item) => item.path));
  for (const link of nav.querySelectorAll(".nav__link")) {
    const isCurrent = link.dataset.path === route?.path;
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
    link.classList.toggle(
      "is-parent",
      !isCurrent && trailPaths.has(link.dataset.path),
    );
  }
}

function renderBreadcrumbs(route) {
  const trail = getTrail(route);

  if (trail.length < 2) {
    breadcrumbs.replaceChildren();
    return;
  }

  const current = trail.at(-1);
  breadcrumbs.replaceChildren(
    el(
      "ol",
      { className: "breadcrumbs__list" },
      trail
        .slice(0, -1)
        .map((item) =>
          el("li", {}, el("a", { href: `#${item.path}` }, item.title)),
        ),
      el("li", { "aria-current": "page" }, current.title),
    ),
  );
}

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
}

burger.addEventListener("click", () => {
  setMenu(!nav.classList.contains("is-open"));
});

function renderPage(route, path) {
  if (route) {
    app.replaceChildren(...views[route.view](route));
    document.title = route.parent
      ? `${route.title} — Ветпаспорт`
      : "Ветпаспорт";
  } else {
    app.replaceChildren(...notFoundView(path));
    document.title = "Не найдено — Ветпаспорт";
  }
  highlight(route);
  renderBreadcrumbs(route);
  setMenu(false);
  window.scrollTo({ top: 0 });
  app.focus({ preventScroll: true });
}

nav.append(renderNav(root.children));

const router = new Router(routes, renderPage);
router.start();
