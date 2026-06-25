"use client";
import { useCallback, useEffect, useSyncExternalStore } from "react";

const THEME_EVENT = "eu-theme-change";

function getPreferredDark() {
  const saved = localStorage.getItem("eu-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return saved ? saved === "dark" : prefersDark;
}

function getSnapshot() {
  return getPreferredDark();
}

function getServerSnapshot() {
  return false;
}

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  media.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
    media.removeEventListener("change", onStoreChange);
  };
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = useCallback(() => {
    const next = !dark;
    localStorage.setItem("eu-theme", next ? "dark" : "light");
    window.dispatchEvent(new Event(THEME_EVENT));
  }, [dark]);

  return { dark, toggle };
}
