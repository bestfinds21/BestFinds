import { useState } from "react";
import { motion } from "framer-motion";
import { getTheme, setTheme, type Theme } from "@/theme";

const THEMES: { id: Theme; label: string; bg: string; dot: string }[] = [
  { id: "dark-purple", label: "Dark Purple", bg: "#0d0a14", dot: "#7c3aed" },
  { id: "dark-white",  label: "Dark White",  bg: "#0a0a0a", dot: "#e8e8e8" },
  { id: "light",       label: "Light",       bg: "#f8f8f8", dot: "#7c3aed" },
];

export function ThemePicker() {
  const [active, setActive] = useState<Theme>(() => getTheme());

  function handlePick(theme: Theme) {
    setActive(theme);
    setTheme(theme);
  }

  return (
    <div className="flex items-center gap-2">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          title={t.label}
          onClick={() => handlePick(t.id)}
          className="relative w-7 h-7 rounded-full border-2 transition-all"
          style={{
            background: t.bg,
            borderColor: active === t.id ? t.dot : "transparent",
            boxShadow: active === t.id ? `0 0 0 1px ${t.dot}40` : "none",
          }}
        >
          <span
            className="absolute inset-[4px] rounded-full"
            style={{ background: t.dot }}
          />
          {active === t.id && (
            <motion.span
              layoutId="theme-ring"
              className="absolute -inset-[3px] rounded-full border-2"
              style={{ borderColor: t.dot }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
