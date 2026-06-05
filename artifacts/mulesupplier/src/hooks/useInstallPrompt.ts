import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

export function useInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) {
      setInstalled(true);
      return;
    }
    if (localStorage.getItem("ms.pwa.installed") === "true") {
      setInstalled(true);
      return;
    }

    setIos(isIos());

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => {
      setInstalled(true);
      setPrompt(null);
      localStorage.setItem("ms.pwa.installed", "true");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  async function triggerInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setPrompt(null);
      localStorage.setItem("ms.pwa.installed", "true");
    }
  }

  return {
    canInstall: !!prompt && !installed,
    isIos: ios && !installed,
    installed,
    triggerInstall,
  };
}
