import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initTheme } from "./theme";

initTheme();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("root")!).render(<App />);
