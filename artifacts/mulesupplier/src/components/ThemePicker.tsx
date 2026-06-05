import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X } from "lucide-react";
import { getTheme, setTheme, applyTheme } from "@/theme";
import type { Theme } from "@/theme";

const THEMES: { value: Theme; label: string; bg: string; fg: string; accent: string }[] = [
  { value: "dark-purple", label: "Dark Purple", bg: "#0a0612", fg: "#f5f3ff", accent: "#8b5cf6" },
  { value: "dark-white",  label: "Dark White",  bg: "#111113", fg: "#f8f8f8", accent: "#ffffff" },
  { value: "white-black", label: "White Black", bg: "#ffffff", fg: "#09090b", accent: "#09090b" },
  { value: "light",       label: "Light",       bg: "#f9f8ff", fg: "#1e0a3c", accent: "#7c3aed" },
];

export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Theme>(getTheme);

  useEffect(() => {
    applyTheme(current);
  }, []);

  function pick(theme: Theme) {
    setCurrent(theme);
    setTheme(theme);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all shadow-lg z-40"
      >
        <Palette className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="fixed bottom-20 right-6 bg-card border border-border rounded-2xl p-4 shadow-2xl z-50 w-52"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm text-foreground">Theme</p>
                <button onClick={() => setOpen(false)}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => pick(t.value)}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors ${current === t.value ? "bg-primary/20 text-primary" : "hover:bg-secondary text-foreground"}`}
                  >
                    <div
                      className="h-5 w-5 rounded-full border border-white/20 flex-shrink-0"
                      style={{ background: `radial-gradient(circle at 35% 35%, ${t.accent}, ${t.bg})` }}
                    />
                    <span className="text-sm">{t.label}</span>
                    {current === t.value && (
                      <span className="ml-auto text-xs text-primary">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
