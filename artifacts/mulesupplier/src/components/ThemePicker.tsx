import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, X } from "lucide-react";
import { getTheme, setTheme, type Theme } from "@/theme";

const THEMES: {
  id: Theme;
  label: string;
  sub: string;
  bg: string;
  card: string;
  dot: string;
  border: string;
  textColor: string;
}[] = [
  {
    id: "dark-purple",
    label: "Dark Purple",
    sub: "Deep violet glow",
    bg: "#0d0916",
    card: "#120d1e",
    dot: "#7c3aed",
    border: "#1e1530",
    textColor: "#fff",
  },
  {
    id: "dark-white",
    label: "Dark White",
    sub: "Bright white glow",
    bg: "#0a0a0a",
    card: "#111111",
    dot: "#e8e8e8",
    border: "#1f1f1f",
    textColor: "#fff",
  },
  {
    id: "white-black",
    label: "White & Black",
    sub: "Clean black glow",
    bg: "#ffffff",
    card: "#f7f7f7",
    dot: "#111111",
    border: "#e2e2e2",
    textColor: "#111",
  },
  {
    id: "light",
    label: "Light Purple",
    sub: "Soft violet accent",
    bg: "#f5f4fb",
    card: "#ffffff",
    dot: "#6d28d9",
    border: "#e5e2f5",
    textColor: "#1a1530",
  },
];

interface ThemePickerProps {
  floating?: boolean;
}

export function ThemePicker({ floating = false }: ThemePickerProps) {
  const [active, setActive] = useState<Theme>(() => getTheme());
  const [open, setOpen] = useState(false);

  function handlePick(theme: Theme) {
    setActive(theme);
    setTheme(theme);
    setTimeout(() => setOpen(false), 180);
  }

  const current = THEMES.find((t) => t.id === active)!;

  return (
    <>
      {/* Trigger button */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.9 }}
        className={
          floating
            ? "flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
            : "flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
        }
        aria-label="Change theme"
      >
        <span
          className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10"
          style={{ background: current.dot }}
        />
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{current.label}</span>
      </motion.button>

      {/* Sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Bottom sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.9 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-border bg-popover px-5 pt-5 pb-10 shadow-2xl"
            >
              {/* Handle + header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="w-10 h-1 rounded-full bg-border mb-4" />
                  <p className="text-base font-semibold text-foreground">Choose theme</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Saved automatically</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Theme grid */}
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map((t) => {
                  const isActive = active === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      type="button"
                      onClick={() => handlePick(t.id)}
                      whileTap={{ scale: 0.96 }}
                      className="relative text-left rounded-2xl overflow-hidden border-2 transition-all"
                      style={{
                        borderColor: isActive ? t.dot : t.border,
                        background: t.bg,
                        boxShadow: isActive
                          ? `0 0 0 1px ${t.dot}40, 0 4px 20px ${t.dot}28`
                          : "none",
                      }}
                    >
                      {/* Mini preview */}
                      <div className="p-3 pb-2">
                        <div
                          className="w-full h-10 rounded-xl mb-2 flex items-center px-3 gap-2"
                          style={{ background: t.card, border: `1px solid ${t.border}` }}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: t.dot }}
                          />
                          <div className="flex-1 h-1.5 rounded-full opacity-30" style={{ background: t.textColor }} />
                        </div>
                        <div className="flex gap-1.5">
                          <div className="h-1 rounded-full flex-1 opacity-20" style={{ background: t.textColor }} />
                          <div className="h-1 rounded-full w-1/2 opacity-10" style={{ background: t.textColor }} />
                        </div>
                      </div>

                      {/* Label */}
                      <div className="px-3 pb-3">
                        <p className="text-xs font-semibold" style={{ color: t.textColor }}>
                          {t.label}
                        </p>
                        <p className="text-[10px] opacity-50 mt-0.5" style={{ color: t.textColor }}>
                          {t.sub}
                        </p>
                      </div>

                      {/* Active check */}
                      {isActive && (
                        <motion.div
                          layoutId="theme-check"
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: t.dot }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
