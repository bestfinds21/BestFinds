export type Theme = "dark-purple" | "dark-white" | "white-black" | "light";

const STORAGE_KEY = "ms.theme";
const DEFAULT: Theme = "dark-purple";

export function getTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  return stored ?? DEFAULT;
}

export function setTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  // Keep Tailwind dark class in sync
  if (theme === "white-black" || theme === "light") {
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
  }
}

export function initTheme() {
  applyTheme(getTheme());
}
