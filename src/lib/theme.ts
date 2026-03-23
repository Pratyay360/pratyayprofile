import { writable } from "svelte/store";
import { browser } from "$app/environment";

function getThemeCookie(): string {
  const match = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "catppuchin";
}

const initialValue = browser ? getThemeCookie() : "catppuchin";

export const theme = writable(initialValue);

if (browser) {
  theme.subscribe((value) => {
    document.cookie = `theme=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
  });
}
