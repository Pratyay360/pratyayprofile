import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import webfontDownload from "vite-plugin-webfont-dl";
import oxlintPlugin from "vite-plugin-oxlint";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { oxContent } from "@ox-content/vite-plugin";
import { robots } from "vite-plugin-robots";
export default defineConfig({
  plugins: [
    robots(),
    tailwindcss(),
    sveltekit(),
    oxlintPlugin(),
    enhancedImages(),
    oxContent(),
    webfontDownload([
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
      "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
    ])
  ],
});
