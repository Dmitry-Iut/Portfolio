function getInitialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
  } catch (e) {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

document.documentElement.dataset.theme = getInitialTheme();

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === "dark";
    themeToggle.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
    themeToggle.setAttribute("aria-label", dark ? "Светлая тема" : "Тёмная тема");
    themeToggle.title = themeToggle.getAttribute("aria-label");
  }

  setTheme(document.documentElement.dataset.theme);

  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });
});
