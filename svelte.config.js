import { mdsvex } from "mdsvex";
import { sveltePreprocess } from "svelte-preprocess";
import adapter from "@sveltejs/adapter-cloudflare";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    csrf: { trustedOrigins: ["pocketbase.pratyay.qzz.io", "localhost"] }
  },
  preprocess: [mdsvex(), sveltePreprocess()],
  extensions: [".svelte", ".svx"],
  alias: { $themes: "./src/lib/themes" }
};

export default config;
