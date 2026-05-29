import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallButton() {
  const { canInstall, triggerInstall } = useInstallPrompt();

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.button
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onClick={triggerInstall}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full font-semibold text-sm shadow-xl backdrop-blur-md border border-primary/30 bg-primary/20 text-primary hover:bg-primary/30 hover:scale-105 active:scale-95 transition-transform"
          style={{ boxShadow: "var(--glow-md)" }}
        >
          <Download className="w-4 h-4" />
          Install app
        </motion.button>
      )}
    </AnimatePresence>
  );
}
