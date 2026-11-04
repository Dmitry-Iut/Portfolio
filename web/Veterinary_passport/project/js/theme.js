function getInitialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
  } catch (e) {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

document.documentElement.dataset.theme = getInitialTheme();

// Кнопка в шапке появится в DOM позже, поэтому ждём загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === "dark";
    themeToggle.textContent = dark ? "☀️" : "🌙";
    themeToggle.setAttribute(
      "aria-label",
      dark ? "Светлая тема" : "Тёмная тема",
    );
    themeToggle.title = themeToggle.getAttribute("aria-label");
  }

  setTheme(document.documentElement.dataset.theme);

  themeToggle.addEventListener("click", () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });
});
