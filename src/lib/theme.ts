import { writable } from "svelte/store";
import { browser } from "$app/environment";

const DEFAULT_THEME = "catppuchin";

export const theme = writable<string>(DEFAULT_THEME);

export function initTheme(ssrTheme: string) {
  if (browser) {
    // Prefer localStorage (client-side source of truth), fall back to SSR cookie value
    const stored = localStorage.getItem("theme");
    theme.set(stored ? stored : ssrTheme);
  } else {
    theme.set(ssrTheme);
  }
}

if (browser) {
  theme.subscribe((value) => {
    // Persist to localStorage
    localStorage.setItem("theme", value);

    // Persist to cookie for SSR
    document.cookie = `theme=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;

    // Apply theme immediately to avoid flash of unstyled content
    document.documentElement.setAttribute("data-theme", value);
  });
}
