import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import oxlintPlugin from "vite-plugin-oxlint";
import webfontDownload from "vite-plugin-webfont-dl";
import { enhancedImages } from "@sveltejs/enhanced-img";
export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    oxlintPlugin(),
    enhancedImages(),
    webfontDownload([
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
      "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
    ]),
  ],
});
