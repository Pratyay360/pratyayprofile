import { writable } from "svelte/store";
import { browser } from "$app/environment";

const initialValue = browser ? (window.localStorage.getItem("theme") ?? "catppuchin") : "catppuchin";

export const theme = writable(initialValue);

if (browser) {
	theme.subscribe((value) => {
		window.localStorage.setItem("theme", value);
	});
}
