"use client";
import { useEffect, useState } from "react";

function getInitialDark() {
  if (typeof window === "undefined") return true;

  const saved = localStorage.getItem("eu-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return saved ? saved === "dark" : prefersDark;
}

export function useTheme() {
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("eu-theme", next ? "dark" : "light");
  };

  return { dark, toggle };
}
