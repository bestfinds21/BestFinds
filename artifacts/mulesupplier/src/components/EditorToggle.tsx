import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EDITOR_PIN, isEditorUnlocked, setEditorUnlocked } from "@/store";

interface EditorToggleProps {
  isUnlocked: boolean;
  onToggle: (value: boolean) => void;
}

export function EditorToggle({ isUnlocked, onToggle }: EditorToggleProps) {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleUnlock() {
    if (pin === EDITOR_PIN) {
      setEditorUnlocked(true);
      onToggle(true);
      setOpen(false);
      setPin("");
      setError(false);
    } else {
      setError(true);
      setPin("");
    }
  }

  function handleLock() {
    setEditorUnlocked(false);
    onToggle(false);
  }

  return (
    <>
      <button
        onClick={() => isUnlocked ? handleLock() : setOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all shadow-lg z-50"
      >
        {isUnlocked ? <Unlock className="h-3.5 w-3.5 text-primary" /> : <Lock className="h-3.5 w-3.5" />}
        {isUnlocked ? "Editor mode on" : "Editor"}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-card border border-border rounded-2xl p-5 w-72 shadow-2xl z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-foreground">Enter PIN</p>
                <button onClick={() => { setOpen(false); setPin(""); setError(false); }}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <Input
                type="password"
                inputMode="numeric"
                placeholder="PIN"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                className={error ? "border-destructive" : ""}
                autoFocus
              />
              {error && <p className="text-destructive text-xs mt-1.5">Incorrect PIN</p>}
              <Button className="w-full mt-3" onClick={handleUnlock}>
                Unlock
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
