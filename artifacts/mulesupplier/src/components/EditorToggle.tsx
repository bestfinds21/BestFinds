import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isEditorUnlocked, unlockEditor, lockEditor } from "@/store";
import { toast } from "sonner";

interface EditorToggleProps {
  isUnlocked: boolean;
  onToggle: (v: boolean) => void;
}

export function EditorToggle({ isUnlocked, onToggle }: EditorToggleProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("ms.editor.tooltip.seen");
    if (!seen) setTooltipVisible(true);
  }, []);

  function dismissTooltip() {
    localStorage.setItem("ms.editor.tooltip.seen", "true");
    setTooltipVisible(false);
  }

  function handleToggle() {
    if (isUnlocked) {
      lockEditor();
      onToggle(false);
      toast("Editor mode locked");
    } else {
      setDialogOpen(true);
      dismissTooltip();
    }
  }

  function handleUnlock() {
    if (unlockEditor(pin)) {
      setDialogOpen(false);
      setPin("");
      onToggle(true);
      toast.success("Editor mode unlocked");
    } else {
      toast.error("Incorrect code");
    }
  }

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-4">
        <motion.button
          onClick={handleToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-colors ${
            isUnlocked
              ? "glow-purple-strong border-primary/40 bg-primary/25 text-primary hover:bg-primary/35"
              : "shadow-lg border-white/10 bg-black/50 text-muted-foreground hover:text-foreground hover:bg-black/70"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isUnlocked ? "Lock Editor" : "Unlock Editor"}
        >
          {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span className="text-sm font-medium">Editor</span>
        </motion.button>

        <AnimatePresence>
          {tooltipVisible && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative bg-card border border-border p-4 pr-10 rounded-xl shadow-xl max-w-[260px]"
            >
              <button
                type="button"
                onClick={dismissTooltip}
                className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {isUnlocked ? (
                <p className="text-sm text-foreground">
                  Editor mode is on. Add, edit and delete categories and products from here.
                </p>
              ) : (
                <>
                  <p className="text-sm text-foreground mb-2">
                    Tap <span className="font-semibold">Editor</span> to manage your catalog.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Code: <span className="font-mono font-semibold text-primary">139238</span>
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Enter editor code</DialogTitle>
            <DialogDescription>Unlock the showroom to edit your catalog.</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Input
              type="password"
              placeholder="Enter code..."
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="bg-muted border-border text-center text-2xl tracking-widest font-mono"
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => { setDialogOpen(false); setPin(""); }} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleUnlock} className="rounded-full bg-primary text-white">
              Unlock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
