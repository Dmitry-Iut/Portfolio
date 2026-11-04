function createStore(key, initial) {
  let value = initial;
  try {
    value = JSON.parse(localStorage.getItem(key)) ?? initial;
  } catch (e) {}

  const listeners = new Set();

  return {
    get: () => value,
    set(next) {
      value = next;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {}
      listeners.forEach((fn) => fn(value));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

const cartStore = createStore("fishka-cart", {});
const favStore = createStore("fishka-fav", []);

const cart = {
  qty: (id) => cartStore.get()[id] ?? 0,
  has: (id) => Boolean(cartStore.get()[id]),
  add(id, amount = 1) {
    const items = { ...cartStore.get() };
    items[id] = Math.min((items[id] ?? 0) + amount, 99);
    cartStore.set(items);
  },
  setQty(id, qty) {
    const items = { ...cartStore.get() };
    if (qty <= 0) delete items[id];
    else items[id] = Math.min(qty, 99);
    cartStore.set(items);
  },
  remove(id) {
    const items = { ...cartStore.get() };
    delete items[id];
    cartStore.set(items);
  },
  clear: () => cartStore.set({}),
  entries: () =>
    Object.entries(cartStore.get())
      .map(([id, qty]) => ({ game: findGame(id), qty }))
      .filter((entry) => entry.game),
  count: () => Object.values(cartStore.get()).reduce((sum, qty) => sum + qty, 0),
  total: () => cart.entries().reduce((sum, e) => sum + e.game.price * e.qty, 0),
};

const favorites = {
  has: (id) => favStore.get().includes(id),
  toggle(id) {
    const list = favStore.get();
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    favStore.set(next);
    return next.includes(id);
  },
  list: () => favStore.get().map(findGame).filter(Boolean),
};

const findGame = (id) => games.find((game) => game.id === id);
const findCategory = (id) => categories.find((category) => category.id === id);
const gamesOf = (categoryId) => games.filter((game) => game.category === categoryId);
