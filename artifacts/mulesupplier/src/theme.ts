export type Theme = "dark-purple" | "dark-white" | "light";

const STORAGE_KEY = "ms.theme";
const DEFAULT: Theme = "dark-purple";

export function getTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  return stored ?? DEFAULT;
}

export function setTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function initTheme() {
  document.documentElement.setAttribute("data-theme", getTheme());
}
