export type Theme = "dark-purple" | "dark-white" | "white-black" | "light";

const THEME_KEY = "mule-theme-v1";

export function getTheme(): Theme {
  return (localStorage.getItem(THEME_KEY) as Theme) ?? "dark-purple";
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark");
  root.removeAttribute("data-theme");

  switch (theme) {
    case "dark-purple":
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark-purple");
      break;
    case "dark-white":
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark-white");
      break;
    case "white-black":
      root.setAttribute("data-theme", "white-black");
      break;
    case "light":
      root.setAttribute("data-theme", "light");
      break;
  }
}
