import { mdsvex } from "mdsvex";
import preprocessor from "svelte-preprocess";
import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    csrf: {
      trustedOrigins: ['*.qzz.io', 'localhost']
    }
  },
  preprocess: [mdsvex(), preprocessor()],
  extensions: [".svelte", ".svx"],
};

export default config;
