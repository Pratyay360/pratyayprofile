import { writable } from "svelte/store";
import { browser } from "$app/environment";

const DEFAULT_THEME = "catppuchin";

export const theme = writable<string>(DEFAULT_THEME);

export function initTheme(initialTheme: string) {
  theme.set(initialTheme);

  if (browser) {
    // Apply immediately
    document.documentElement.setAttribute("data-theme", initialTheme);

    // Persist to localStorage
    localStorage.setItem("theme", initialTheme);

    // Persist to cookie
    document.cookie = `theme=${encodeURIComponent(initialTheme)}; path=/; max-age=31536000; SameSite=Lax`;
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
