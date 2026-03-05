import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { defineConfig } from "vite";
import oxlintPlugin from "vite-plugin-oxlint";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig({
  server: {
    cors: true
  },
  plugins: [
    tailwindcss(),
    sveltekit(),
    enhancedImages(),
    oxlintPlugin(),
    webfontDownload([
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
      "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",

      
    ]),
  ],
});
