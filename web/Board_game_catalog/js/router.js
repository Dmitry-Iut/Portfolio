function createRoute(node, parent = null) {
  const { children = [], ...info } = node;

  const segments = parent ? [...parent.segments, info.slug] : [];

  const route = { ...info, segments, path: `/${segments.join("/")}`, parent };

  route.children = children.map((child) => createRoute(child, route));

  return route;
}

const flatten = (route) => [route, ...route.children.flatMap(flatten)];

function getTrail(route) {
  return route ? [...getTrail(route.parent), route] : [];
}

class Router {
  #routes;
  #onChange;

  constructor(routes, onChange) {
    this.#routes = new Map(routes.map((route) => [route.path, route]));
    this.#onChange = onChange;
  }

  get path() {
    const clean = location.hash.slice(1).replace(/^\/+|\/+$/g, "");

    return `/${clean}`;
  }

  start() {
    window.addEventListener("hashchange", () => this.#resolve());
    this.#resolve();
  }

  #resolve() {
    const route = this.#routes.get(this.path) ?? null;
    this.#onChange(route, this.path);
  }
}
