import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, Plus } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallButton() {
  const { canInstall, isIos, triggerInstall } = useInstallPrompt();
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <AnimatePresence>
        {(canInstall || isIos) && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
          >
            <motion.button
              onClick={() => {
                if (canInstall) triggerInstall();
                else setShowIosGuide(true);
              }}
              className="flex items-center gap-2.5 px-5 py-3 rounded-full font-semibold text-sm shadow-xl backdrop-blur-md border border-primary/30 bg-primary/20 text-primary hover:bg-primary/30 active:scale-95 transition-transform"
              style={{ boxShadow: "var(--glow-md)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Install app
            </motion.button>
            <motion.button
              onClick={() => setDismissed(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 bg-black/30 text-white/50 hover:text-white/80 active:scale-95 transition-all"
              whileTap={{ scale: 0.9 }}
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS install guide */}
      <AnimatePresence>
        {showIosGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowIosGuide(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-white/10 bg-[#120d1e] px-6 pt-6 pb-10"
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6" />
              <p className="text-lg font-semibold text-white mb-1">Install BestFinds</p>
              <p className="text-sm text-white/50 mb-8">Add to your home screen in 2 steps</p>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Share className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Step 1 — Tap Share</p>
                    <p className="text-xs text-white/50 mt-0.5">Tap the Share button at the bottom of Safari (the box with an arrow pointing up)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Step 2 — Add to Home Screen</p>
                    <p className="text-xs text-white/50 mt-0.5">Scroll down in the share menu and tap "Add to Home Screen", then tap "Add"</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setShowIosGuide(false); setDismissed(true); }}
                className="w-full py-3.5 rounded-2xl bg-white/8 border border-white/10 text-white/60 text-sm font-medium"
              >
                Got it
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
